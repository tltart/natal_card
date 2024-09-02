import TelegramBot from 'node-telegram-bot-api';
import { IUserData, checkCompletedStage } from './Stages/checkCompletedStage';
import { updateBirthData } from './updateData/updateUserData';
import { Stages } from './constants/questionsStatus';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { sendLongMessage } from './utils/sendLongMessage';
import { PrismaService } from 'src/prisma/prisma.service';
import { sendCardName } from './Stages/sendCardName';
import { ErrorsEnum } from '../errors/errorsEnum';
import { sendAllCards } from './cards/sendAllCards';
import { GetCard } from './cards/getCard';
import { handleMainMenu } from './menu/handleMainMenu';
import {
  handlePredictMenu,
  IActionCard,
} from './menu/predict/handlePredictMenu';
import { CardStagesEnum } from './cards/constants/cardsStageEnum';
import { sendMainMenu } from './menu/sendMainMenu';
import {
  AnalyzePersonMenu,
  CompatibilityMenu,
  FinanseMenu,
  HealthMenu,
  LifeCyclesMenu,
  MainMenu,
  PersonEvolutionMenu,
  PredictMenu,
  ProfessionMenu,
} from './constants/menu';
import { handleAnalyzePersonMenu } from './menu/analyzePerson/handleAnalyzePesronMenu';
import { handleCompatibilityMenu } from './menu/compatibility/handleCompatibilityMenu';
import { handleProfessionMenu } from './menu/profession/handleProfessionMenu';
import { handleFinanseMenu } from './menu/finanse/handleFinanseMenu';
import { handleHealthMenu } from './menu/health/handleHealthMenu';
import { handleLifeCycleMenu } from './menu/lifeCycles/handleLifeCyclesMenu';
import { handlePersonEvolutionMenu } from './menu/personEvolution/handlePersonEvolutionMenu';
import { checkLimits } from './checkLimits/checkLimits';

@Injectable()
export class BotService implements OnModuleInit {
  private userStates = new Map<number, Stages>();

  private userData = new Map<number, IUserData>();

  private cardAction = new Map<number, IActionCard>();

  constructor(
    @Inject('GPT_SERVICE') private readonly gpt: ClientProxy,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    console.log('Init bot service');
    await this.gpt.connect();
    this.botMessage();
  }

  async botMessage() {
    const bot = new TelegramBot(this.configService.get<string>('BOT_TOKEN'), {
      polling: true,
    });

    bot.setMyCommands([
      { command: 'start', description: 'Старт' },
      { command: 'cards', description: 'Мои карты' },
    ]);

    bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;

      await bot.sendMessage(chatId, `Привет, ${msg.from.first_name}`);
      const target = await this.prisma.findAllCardsByChatId(chatId);
      if (target && target.target.length) {
        await sendAllCards(bot, chatId, target.target);
        return;
      }
      await sendCardName({
        bot,
        chatId,
        userStates: this.userStates,
        userData: this.userData,
      });
      this.userStates.set(chatId, Stages.AWAITING_BIRTH_NAME);
      if (!(await this.prisma.findChatByChatId(chatId))) {
        const chat = await this.prisma.createChatByChatId(chatId);
        await this.prisma.createCountReport({
          chatId: chat.id,
          countReportDay: 0,
          dayLimit: 3,
        });
      }
    });

    bot.onText(/\/cards/, async (msg) => {
      const chatId = msg.chat.id;

      await bot.sendMessage(chatId, 'Ваши сохранненные натальные карты');
      const { target } = await this.prisma.findAllCardsByChatId(chatId);
      if (target.length) {
        await sendAllCards(bot, chatId, target);
        return;
      }
    });

    bot.on('message', async (msg: any) => {
      const chatId = msg.chat.id;
      const text = msg.text;
      if (!text || text.startsWith('/')) {
        return;
      }

      await checkCompletedStage({
        bot,
        chatId,
        userData: this.userData,
        userStates: this.userStates,
        text,
      });
    });

    bot.on('callback_query', async (msg: any) => {
      const { data } = msg;
      const chatId = Number(msg.message.chat.id);
      try {
        const chat = await this.prisma.findChatByChatId(chatId);
        if (!chat) throw new Error(ErrorsEnum.RESTART_BOT);
        const isNeedCreateCard = await updateBirthData({
          bot,
          chatId,
          messageData: data,
          userData: this.userData,
          userStates: this.userStates,
          action: 'update',
        });
        if (
          isNeedCreateCard &&
          this.userData.get(chatId).birthDate &&
          this.userData.get(chatId).birthTime &&
          this.userData.get(chatId).birthPlace &&
          this.userData.get(chatId).cardName
        ) {
          await checkLimits({ prisma: this.prisma, chatIdDb: chat.id });

          const isExistTargeByName =
            await this.prisma.findTargetbyNameAndChatId(
              chat.id,
              this.userData.get(chatId).cardName,
            );

          if (isExistTargeByName) throw new Error(ErrorsEnum.EXIST_CARD);

          const isExistTarget = await this.prisma.findTargetByPlaceAndDate(
            this.userData.get(chatId).birthDate,
            this.userData.get(chatId).birthPlace,
          );
          if (isExistTarget?.NatalCards?.id) {
            await this.prisma.createTarget(
              chat.id,
              this.userData.get(chatId).birthDate,
              this.userData.get(chatId).birthTime,
              this.userData.get(chatId).birthPlace,
              this.userData.get(chatId).cardName,
            );
            await sendLongMessage(bot, chatId, isExistTarget.NatalCards.text);
            await sendMainMenu(bot, chatId);
            await this.prisma.incrementCountReportByDay(chat.id);
            return;
          }

          const response$ = this.gpt.send<string>(
            'get-nat-card',
            `Для натальной карты ${this.userData.get(chatId).birthDate}, ${this.userData.get(chatId).birthTime}, ${this.userData.get(chatId).birthPlace}, предоставьте конкретное описание влияния планет и знаков на личность. Пожалуйста, представьте это в виде готового анализа, включая основные планеты, знаки, дома и аспекты, без общих рекомендаций о необходимости инструментов или дополнительных действий. Без вводных слов типа конечно и тому подобного. Это должно вышлядеть как отчет.`,
          );

          const response = await lastValueFrom(response$);

          const target = await this.prisma.createTarget(
            chat.id,
            this.userData.get(chatId).birthDate,
            this.userData.get(chatId).birthTime,
            this.userData.get(chatId).birthPlace,
            this.userData.get(chatId).cardName,
          );

          await this.prisma.createNatalCard(chat.id, response, target.id);
          await sendLongMessage(bot, chatId, response);
          await sendMainMenu(bot, chatId);
          await this.prisma.incrementCountReportByDay(chat.id);
          return;
        } else if (data.split('-')[0] === CardStagesEnum.GET_CARD) {
          await GetCard({
            bot,
            chatId,
            cbName: data,
          });
          this.cardAction.set(chatId, {
            action: CardStagesEnum.GET_CARD,
            target: Number(data.split('-')[1]),
          });
          await sendMainMenu(bot, chatId);
          return;
        } else if (Object.values(PredictMenu).includes(data)) {
          await checkLimits({ prisma: this.prisma, chatIdDb: chat.id });
          const predict = await handlePredictMenu({
            bot,
            chatId,
            cbName: data,
            cardAction: this.cardAction,
            prisma: this.prisma,
            gpt: this.gpt,
          });

          if (predict) {
            await sendLongMessage(bot, chatId, predict);
            await sendMainMenu(bot, chatId);
            await this.prisma.incrementCountReportByDay(chat.id);
            return;
          } else {
            await bot.sendMessage(chatId, 'Ошибка получения данных');
            await sendMainMenu(bot, chatId);
            return;
          }
        } else if (Object.values(AnalyzePersonMenu).includes(data)) {
          await checkLimits({ prisma: this.prisma, chatIdDb: chat.id });
          const analyze = await handleAnalyzePersonMenu({
            bot,
            chatId,
            cbName: data,
            cardAction: this.cardAction,
            gpt: this.gpt,
            prisma: this.prisma,
          });
          if (analyze) {
            await sendLongMessage(bot, chatId, analyze);
            await sendMainMenu(bot, chatId);
            await this.prisma.incrementCountReportByDay(chat.id);
            return;
          } else {
            await bot.sendMessage(chatId, 'Ошибка получения данных');
            await sendMainMenu(bot, chatId);
            return;
          }
        } else if (data === MainMenu.MAIN_MENU) {
          await sendMainMenu(bot, chatId);
          return;
        } else if (Object.values(CompatibilityMenu).includes(data)) {
          await checkLimits({ prisma: this.prisma, chatIdDb: chat.id });
          const compatibility = await handleCompatibilityMenu({
            bot,
            chatId,
            gpt: this.gpt,
            cardAction: this.cardAction,
            cbName: data,
            prisma: this.prisma,
          });
          if (compatibility) {
            await sendLongMessage(bot, chatId, compatibility);
            await sendMainMenu(bot, chatId);
            await this.prisma.incrementCountReportByDay(chat.id);
            return;
          } else {
            await bot.sendMessage(chatId, 'Ошибка получения данных');
            await sendMainMenu(bot, chatId);
            return;
          }
        } else if (Object.values(ProfessionMenu).includes(data)) {
          await checkLimits({ prisma: this.prisma, chatIdDb: chat.id });
          const profession = await handleProfessionMenu({
            bot,
            chatId,
            gpt: this.gpt,
            cardAction: this.cardAction,
            cbName: data,
            prisma: this.prisma,
          });
          if (profession) {
            await sendLongMessage(bot, chatId, profession);
            await sendMainMenu(bot, chatId);
            await this.prisma.incrementCountReportByDay(chat.id);
            return;
          } else {
            await bot.sendMessage(chatId, 'Ошибка получения данных');
            await sendMainMenu(bot, chatId);
            return;
          }
        } else if (Object.values(FinanseMenu).includes(data)) {
          await checkLimits({ prisma: this.prisma, chatIdDb: chat.id });
          const finanse = await handleFinanseMenu({
            bot,
            chatId,
            gpt: this.gpt,
            cardAction: this.cardAction,
            cbName: data,
            prisma: this.prisma,
          });
          if (finanse) {
            await sendLongMessage(bot, chatId, finanse);
            await sendMainMenu(bot, chatId);
            await this.prisma.incrementCountReportByDay(chat.id);
            return;
          } else {
            await bot.sendMessage(chatId, 'Ошибка получения данных');
            await sendMainMenu(bot, chatId);
            return;
          }
        } else if (Object.values(HealthMenu).includes(data)) {
          await checkLimits({ prisma: this.prisma, chatIdDb: chat.id });
          const health = await handleHealthMenu({
            bot,
            chatId,
            gpt: this.gpt,
            cardAction: this.cardAction,
            cbName: data,
            prisma: this.prisma,
          });
          if (health) {
            await sendLongMessage(bot, chatId, health);
            await sendMainMenu(bot, chatId);
            await this.prisma.incrementCountReportByDay(chat.id);
            return;
          } else {
            await bot.sendMessage(chatId, 'Ошибка получения данных');
            await sendMainMenu(bot, chatId);
            return;
          }
        } else if (Object.values(LifeCyclesMenu).includes(data)) {
          await checkLimits({ prisma: this.prisma, chatIdDb: chat.id });
          const cycles = await handleLifeCycleMenu({
            bot,
            chatId,
            gpt: this.gpt,
            cardAction: this.cardAction,
            cbName: data,
            prisma: this.prisma,
          });
          if (cycles) {
            await sendLongMessage(bot, chatId, cycles);
            await sendMainMenu(bot, chatId);
            await this.prisma.incrementCountReportByDay(chat.id);
            return;
          } else {
            await bot.sendMessage(chatId, 'Ошибка получения данных');
            await sendMainMenu(bot, chatId);
            return;
          }
        } else if (Object.values(PersonEvolutionMenu).includes(data)) {
          await checkLimits({ prisma: this.prisma, chatIdDb: chat.id });
          const personInfo = await handlePersonEvolutionMenu({
            bot,
            chatId,
            gpt: this.gpt,
            cardAction: this.cardAction,
            cbName: data,
            prisma: this.prisma,
          });
          if (personInfo) {
            await sendLongMessage(bot, chatId, personInfo);
            await sendMainMenu(bot, chatId);
            await this.prisma.incrementCountReportByDay(chat.id);
            return;
          } else {
            await bot.sendMessage(chatId, 'Ошибка получения данных');
            await sendMainMenu(bot, chatId);
            return;
          }
        }
        await handleMainMenu(bot, chatId, data);
      } catch (error: unknown) {
        if (
          typeof error === 'object' &&
          error !== null &&
          'message' in error &&
          Object.values(ErrorsEnum).includes(error.message as ErrorsEnum)
        ) {
          return await bot.sendMessage(chatId, error.message as string);
        }
        bot.sendMessage(chatId, '❌ Произошла ошибка. Повторите ввод.');
      }
    });
  }
}
