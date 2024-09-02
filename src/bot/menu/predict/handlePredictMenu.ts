import TelegramBot from 'node-telegram-bot-api';
import { PredictMenu, LocalePredict } from '../../constants/menu';
import { ErrorsEnum } from 'src/errors/errorsEnum';
import { PrismaService } from 'src/prisma/prisma.service';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import {
  getCurrentDay,
  getCurrentMonth,
  getCurrentWeek,
  getCurrentYear,
  getNextDay,
  getNextMonth,
  getNextWeek,
  getNextYear,
} from './utils/getDate';

export interface IActionCard {
  action: string;
  target: number;
}

export const handlePredictMenu = async ({
  bot,
  chatId,
  cbName,
  cardAction,
  prisma,
  gpt,
}: {
  bot: TelegramBot;
  chatId: number;
  cbName: string;
  cardAction: Map<number, IActionCard | null>;
  prisma: PrismaService;
  gpt: ClientProxy;
}) => {
  if (!cardAction.has(chatId) || cardAction.get(chatId) === null) {
    throw new Error(ErrorsEnum.CARD_NOT_SELECTED);
  }
  let predictPeriod = '';

  const cardText = await prisma.natalCards.findFirst({
    where: {
      targetId: cardAction.get(chatId).target,
    },
  });

  switch (cbName) {
    case PredictMenu.PREDICT_DAY_TODAY:
      predictPeriod = LocalePredict.PREDICT_DAY_TODAY;
      predictPeriod += getCurrentDay();
      break;
    case PredictMenu.PREDICT_DAY_NEXT:
      predictPeriod = LocalePredict.PREDICT_DAY_NEXT;
      predictPeriod += getNextDay();
      break;
    case PredictMenu.PREDICT_WEEK_CURRENT:
      predictPeriod = LocalePredict.PREDICT_WEEK_CURRENT;
      const { startWeek, endWeek } = getCurrentWeek();
      predictPeriod += `c ${startWeek} по ${endWeek}`;
      break;
    case PredictMenu.PREDICT_WEEK_NEXT:
      predictPeriod = LocalePredict.PREDICT_WEEK_NEXT;
      const { startNextWeek, endNextWeek } = getNextWeek();
      predictPeriod += `c ${startNextWeek} по ${endNextWeek}`;
      break;
    case PredictMenu.PREDICT_MONTH_CURRENT:
      predictPeriod = LocalePredict.PREDICT_MONTH_CURRENT;
      predictPeriod += getCurrentMonth();
      break;
    case PredictMenu.PREDICT_MONTH_NEXT:
      predictPeriod = LocalePredict.PREDICT_MONTH_NEXT;
      predictPeriod += getNextMonth();
      break;
    case PredictMenu.PREDICT_YEAR_CURRENT:
      predictPeriod = LocalePredict.PREDICT_YEAR_CURRENT;
      predictPeriod += getCurrentYear();
      break;
    case PredictMenu.PREDICT_YEAR_NEXT:
      predictPeriod = LocalePredict.PREDICT_YEAR_NEXT;
      predictPeriod += getNextYear();
      break;
    default:
      break;
  }
  if (!predictPeriod.length) {
    throw new Error();
  }
  await bot.sendMessage(chatId, `${predictPeriod}. Отчет строится...`);

  const response$ = gpt.send<string>(
    'get-predict',
    JSON.stringify({ natalCard: cardText.text, predictPeriod: predictPeriod }),
  );
  const response = await lastValueFrom(response$);
  return response;
};
