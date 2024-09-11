import TelegramBot from 'node-telegram-bot-api';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { MenuService } from 'src/Menu/menu.service';
import { UserService } from 'src/users/user.service';
import { ChatService } from 'src/chat/chat.service';
import { Messages } from '../messages/messages';
import { UserDataActionMenuCallbacks } from 'src/Menu/itemsMenu/actionMenu';

@Injectable()
export class BotService implements OnModuleInit {
  private bot: TelegramBot;

  constructor(
    @Inject('GPT_SERVICE') private readonly gpt: ClientProxy,
    private readonly configService: ConfigService,
    private readonly mainMenuService: MenuService,
    private readonly userService: UserService,
    private readonly chatService: ChatService,
  ) {}

  async onModuleInit() {
    console.log('Init bot service');
    this.bot = new TelegramBot(this.configService.get<string>('BOT_TOKEN'), {
      polling: true,
    });
    // await this.gpt.connect();
    this.botMessage();
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
    this.userService.userData = users[0];
    return users;
  }

  async sendMessageToBot({ chatId, message }: { chatId: number; message: string }) {
    return this.bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
  }

  async sendInlineMenuToBot({ chatId, title, menu }: { chatId: number; title: string; menu: ReturnType<MenuService['getMainMenuInlineKeboard']> }) {
    return this.bot.sendMessage(chatId, title, { reply_markup: menu.reply_markup, parse_mode: 'HTML' });
  }


  async botMessage() {
    this.bot.setMyCommands([
      { command: 'start', description: 'Старт' },
      { command: 'cards', description: 'Мои карты' },
    ]);

    this.bot.onText(/\/start/, async (msg) => {
      this.userService.dropUserData();
      this.userService.dropUserStageData();

      const chatId = msg.chat.id;

      await this.startCommand(chatId);

      const isUserExsist = await this.userService.checkUserData(chatId);

      if (!isUserExsist) {
        const message = await this.userService.checkStageUserData();
        await this.sendMessageToBot({ chatId, message });
      }
      await this.sendMessageToBot({
        chatId,
        message: `Ваши данные:\n\n\<b>🏷 Имя:</b> ${this.userService.userData.name}\n<b>📆 Дата рождения:</b> ${this.userService.userData.birthDate}\n<b>⏰ Время рождения:</b> ${this.userService.userData.birthTime}\n<b>🌏Место рождения:</b> ${this.userService.userData.birthPlace}`,
      });
      // await this.sendInlineMenuToBot({ chatId, title: 'Главное меню', menu: this.mainMenu.getMainMenuInlineKeboard() });
      // await this.bot.sendMessage(chatId, 'Главное меню', this.mainMenu.getMainMenuInlineKeboard());
    });

    this.bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;
      if (!text || text.startsWith('/')) {
        return;
      }
      const fullUserData = await this.userService.checkUserData(chatId, text);
      if (!fullUserData) return;
    });

    this.bot.on('callback_query', async (cbData) => {
      const { data: cbName } = cbData;
      const chatId = Number(cbData.message.chat.id);
      const nextMenu = this.mainMenuService.handle(cbName);
      if (nextMenu.title && nextMenu.keyboard) {
        await this.bot.sendMessage(chatId, nextMenu.title, nextMenu.keyboard);
      }
      const actionSubMenu = this.mainMenuService.handleAllSubMenus(cbName);
      if (actionSubMenu.length) {
        if (actionSubMenu === UserDataActionMenuCallbacks.ACCEPT) {
          await this.userService.createUser(chatId);
          await this.sendMessageToBot({ chatId, message: Messages.PREPARING_GOROSCOPE_TODAY });
        }
        await this.bot.sendMessage(chatId, actionSubMenu);
      }
    });
  }
}
