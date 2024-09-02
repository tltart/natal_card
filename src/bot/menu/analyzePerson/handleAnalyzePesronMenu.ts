import TelegramBot from 'node-telegram-bot-api';
import { AnalyzePersonMenu, LocaleAnalyzePerson } from '../../constants/menu';
import { ErrorsEnum } from 'src/errors/errorsEnum';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { IActionCard } from '../predict/handlePredictMenu';

export const handleAnalyzePersonMenu = async ({
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
  cardAction: Map<number, IActionCard>;
  prisma: PrismaService;
  gpt: ClientProxy;
}) => {
  if (!cardAction.has(chatId) || cardAction.get(chatId) === null) {
    throw new Error(ErrorsEnum.CARD_NOT_SELECTED);
  }
  let reportType = '';
  switch (cbName) {
    case AnalyzePersonMenu.CHARACTER_TRAITS:
      await bot.sendMessage(
        chatId,
        `Запускаю построение отчета по основным чертам характера...`,
      );
      reportType = LocaleAnalyzePerson.CHARACTER_TRAITS;
      break;
    case AnalyzePersonMenu.STRENGTHS_WEAKNESSES:
      await bot.sendMessage(
        chatId,
        `Запускаю построение отчета по сильным и слабым сторонам личности...`,
      );
      reportType = LocaleAnalyzePerson.STRENGTHS_WEAKNESSES;
      break;
    case AnalyzePersonMenu.PSYCHOLOGICAL_PROFILE:
      await bot.sendMessage(
        chatId,
        `Запускаю построение отчета по психологическому портрету личности...`,
      );
      reportType = LocaleAnalyzePerson.PSYCHOLOGICAL_PROFILE;
      break;

    default:
      break;
  }
  if (!reportType.length) return;

  const cardText = await prisma.natalCards.findFirst({
    where: {
      targetId: cardAction.get(chatId).target,
    },
  });

  const response$ = gpt.send<string>(
    'get-person-analyze',
    JSON.stringify({ natalCard: cardText.text, reportType }),
  );
  const response = await lastValueFrom(response$);
  return response;
};
