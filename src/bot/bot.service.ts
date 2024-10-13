import fs from 'node:fs';
import path from 'node:path';
import TelegramBot from 'node-telegram-bot-api';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { MenuService } from 'src/Menu/menu.service';
import { UserService } from 'src/users/user.service';
import { ChatService } from 'src/chat/chat.service';
import { Messages } from '../messages/messages';
import { UserDataActionMenuCallbacks } from 'src/Menu/itemsMenu/actionMenu';
import { ErrorsEnum } from 'src/errors/errorsEnum';
import { LocaleMainMenu, mainMenuItems } from 'src/Menu/itemsMenu/itemsMainMenu';
import { GoroscopeMenuCallbacks } from 'src/Menu/itemsMenu/goroscopeMenu';
import { textOnImage } from '../shared/textOnImage';
import { LocaleZodiac } from 'src/users/interfaces/userData';
import { GoroscopeService } from 'src/goroscope/goroscope.service';
import { LunarService } from 'src/lunar/lunar.service';

@Injectable()
export class BotService implements OnModuleInit {
  private bot: TelegramBot;

  constructor(
    @Inject('GPT_SERVICE') private readonly gpt: ClientProxy,
    private readonly configService: ConfigService,
    private readonly mainMenuService: MenuService,
    private readonly userService: UserService,
    private readonly chatService: ChatService,
    private readonly goroscopeService: GoroscopeService,
    private readonly lunarService: LunarService,
  ) {}

  async onModuleInit() {
    console.log('Bot init service');
    this.bot = new TelegramBot(this.configService.get<string>('BOT_TOKEN'), {
      polling: true,
    });
    await this.gpt.connect();
    this.botMessage();
  }

  async updateUser(chatId: number) {
    this.userService.dropUserData(chatId);
    this.userService.dropUserStageData(chatId);
    this.userService.isUpdatedData = { chatId, value: true };
    const message = await this.userService.checkStageUserData({ chatId });
    await this.sendMessageToBot({ chatId, message });
    return;
  }

  async removeUser(chatId: number) {
    this.userService.dropUserData(chatId);
    this.userService.dropUserStageData(chatId);
    const message = await this.userService.checkStageUserData({ chatId });
    await this.sendMessageToBot({ chatId, message });
    return;
  }

  async startCommand(chatId: number) {
    const chat = await this.chatService.findChatByChatId(chatId);
    if (!chat) {
      await this.chatService.createNewChat(chatId);
    }
    const users = await this.userService.findUsersByChatId(chatId);
    if (!users.length) {
      return false;
    }
    this.userService.userData = { chatId, value: users[0] };
    return users;
  }

  async sendMessageToBot({ chatId, message }: { chatId: number; message: string }) {
    return this.bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
  }

  async sendInlineMenuToBot({ chatId, title, menu }: { chatId: number; title: string; menu: ReturnType<MenuService['getMainMenuInlineKeboard']> }) {
    return this.bot.sendMessage(chatId, title, { reply_markup: menu.reply_markup, parse_mode: 'HTML' });
  }

  async sendKeyboard({ chatId, title, menu }: { chatId: number; title: string; menu: ReturnType<MenuService['getMainMenuKeboard']> }) {
    return this.bot.sendMessage(chatId, title, { reply_markup: menu.reply_markup });
  }

  async botMessage() {
    this.bot.setMyCommands([
      { command: 'start', description: 'Старт' },
      // { command: 'cards', description: 'Мои карты' },
    ]);

    this.bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;

      this.userService.dropUserData(chatId);
      this.userService.dropUserStageData(chatId);

      await this.startCommand(chatId);

      const isUserExsist = await this.userService.checkUserData(chatId);

      if (!isUserExsist) {
        const message = await this.userService.checkStageUserData({ chatId });
        await this.sendMessageToBot({ chatId, message });
        return;
      }
      const imgPath = path.resolve(__dirname, '../..', `static/card.png`);
      const buff = fs.readFileSync(imgPath);
      await this.bot.sendPhoto(chatId, buff);
      return await this.sendKeyboard({ chatId, title: 'Выбрать действие', menu: this.mainMenuService.getMainMenuKeboard() });
    });

    this.bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;
      if (!text || text.startsWith('/')) {
        return;
      }
      if (mainMenuItems.some((items) => text.includes(items.text))) {
        return await this.handleTextMessages({ chatId, message: text });
      }
      const fullUserData = await this.userService.checkUserData(chatId);
      if (!fullUserData) {
        const message = await this.userService.checkStageUserData({ chatId, text });
        if (message && message.length !== 0) {
          await this.sendMessageToBot({ chatId, message });
          return;
        }
      }
      const user = this.userService.getUserData(chatId);
      return await this.sendInlineMenuToBot({
        chatId,
        title: `Ваши данные:\n\n\<b>🏷 Имя:</b> ${user.name}\n<b>📆 Дата рождения:</b> ${user.birthDate}\n<b>⏰ Время рождения:</b> ${user.birthTime}\n<b>🌏Место рождения:</b> ${user.birthPlace}`,
        menu: this.mainMenuService.getUserDataActionMenu(),
      });
    });

    this.bot.on('callback_query', async (cbData) => {
      const { data: cbName } = cbData;
      const chatId = Number(cbData.message.chat.id);
      try {
        const nextMenu = this.mainMenuService.handleInlineMenu(cbName);
        if (nextMenu.title && nextMenu.keyboard) {
          await this.bot.sendMessage(chatId, nextMenu.title, nextMenu.keyboard);
        }
        const actionSubMenu = this.mainMenuService.handleAllSubMenus(cbName);
        if (actionSubMenu.length && this.userService.checkFullUserData(chatId)) {
          if (actionSubMenu === UserDataActionMenuCallbacks.ACCEPT) {
            if (this.userService.isUpdatedData.get(chatId) === true) {
              await this.userService.updateUser(chatId);
              await this.sendMessageToBot({ chatId, message: 'Данные успешно обновлены' });
              this.userService.isUpdatedData.set(chatId, false);
              await this.sendMessageToBot({ chatId, message: Messages.PREPARING_GOROSCOPE_TODAY });
              await this.sendAnimationSign(chatId);
              const goroscope = await this.goroscopeService.getGoroscope(LocaleZodiac[this.userService.getUserData(chatId).zodiac], 'today');
              const im = await textOnImage(goroscope.today);
              await this.bot.sendPhoto(chatId, im);
              await this.sendKeyboard({ chatId, title: 'Выбрать действие', menu: this.mainMenuService.getMainMenuKeboard() });
              return;
            }
            await this.userService.createUser(chatId);
            await this.sendMessageToBot({ chatId, message: Messages.PREPARING_GOROSCOPE_TODAY });
            await this.sendAnimationSign(chatId);
            const goroscope = await this.goroscopeService.getGoroscope(LocaleZodiac[this.userService.getUserData(chatId).zodiac], 'today');
            const im = await textOnImage(goroscope.today);
            
            await this.bot.sendPhoto(chatId, im);
            await this.sendKeyboard({ chatId, title: 'Выбрать действие', menu: this.mainMenuService.getMainMenuKeboard() });
            await this.userService.updateLastTimeReport(this.userService.getUserData(chatId).id);
            return;
          } else if (actionSubMenu === UserDataActionMenuCallbacks.UPDATE) {
            this.userService.dropUserData(chatId);
            this.userService.dropUserStageData(chatId);
            await this.updateUser(chatId);
            return;
          } else if (actionSubMenu === UserDataActionMenuCallbacks.REMOVE) {
            this.userService.dropUserData(chatId);
            this.userService.dropUserStageData(chatId);
            await this.userService.deleteUser(chatId);
            return await this.sendMessageToBot({ chatId, message: 'Данные успешно удалены' });
          } else if (actionSubMenu === GoroscopeMenuCallbacks.GOROSCOPE_TODAY) {
            await this.bot.sendMessage(chatId, 'Строю гороскоп на сегодня...');
            const goroscope = await this.goroscopeService.getGoroscope(LocaleZodiac[this.userService.getUserData(chatId).zodiac], 'today');

            const im = await textOnImage(goroscope.today);
            await this.bot.sendPhoto(chatId, im);
            await this.userService.updateLastTimeReport(this.userService.getUserData(chatId).id);
            return;
          } else if (actionSubMenu === GoroscopeMenuCallbacks.GOROSCOPE_TOMORROW) {
            await this.bot.sendMessage(chatId, 'Строю гороскоп на завтра...');
            const goroscope = await this.goroscopeService.getGoroscope(LocaleZodiac[this.userService.getUserData(chatId).zodiac], 'tommorow');

            const im = await textOnImage(goroscope.tommorow);
            await this.bot.sendPhoto(chatId, im);
            await this.userService.updateLastTimeReport(this.userService.getUserData(chatId).id);
            return;
          }
          await this.bot.sendMessage(chatId, actionSubMenu);
        }
      } catch (error: unknown) {
        if (typeof error === 'object' && error !== null && 'message' in error && Object.values(ErrorsEnum).includes(error.message as ErrorsEnum)) {
          return await this.bot.sendMessage(chatId, error.message as string);
        }
        this.bot.sendMessage(chatId, '❌ Произошла ошибка. Повторите ввод.');
      }
    });
  }

  async handleTextMessages({ chatId, message }: { chatId: number; message: string }) {
    await this.startCommand(chatId);
    const isUserExsist = await this.userService.checkUserData(chatId);

    if (!isUserExsist) {
      const message = await this.userService.checkStageUserData({ chatId });
      await this.sendMessageToBot({ chatId, message });
      return;
    }
    const user = this.userService.getUserData(chatId);
    if (message === LocaleMainMenu.USER_DATA) {
      await this.sendAnimationSign(chatId);
      return await this.sendInlineMenuToBot({
        chatId,
        title: `Ваши данные:\n\n\<b>🏷 Имя:</b> ${user.name}\n<b>📆 Дата рождения:</b> ${user.birthDate}\n<b>⏰ Время рождения:</b> ${user.birthTime}\n<b>🌏Место рождения:</b> ${user.birthPlace}`,
        menu: this.mainMenuService.getUserDataActionMenu(),
      });
    } else if (message === LocaleMainMenu.GOROSCOPES) {
      return await this.sendInlineMenuToBot({ chatId, title: 'Выбрать гороскоп', menu: this.mainMenuService.getGoroscopeMenu() });
    } else if (message === LocaleMainMenu.MOON_DATA) {
      const lunarData = await this.lunarService.getImage();
      
      await this.bot.sendPhoto(chatId, lunarData);
      return;
    }
  }

  async sendAnimationSign(chatId: number) {
    const imgPath = path.resolve(__dirname, '../..', `static/spinners/spinner_${this.userService.getUserData(chatId).zodiac.toLowerCase()}.gif`);
    const buff = fs.readFileSync(imgPath);
    await this.bot.sendAnimation(chatId, buff);
  }
}
