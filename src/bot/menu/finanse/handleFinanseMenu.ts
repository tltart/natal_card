import TelegramBot from 'node-telegram-bot-api';
import { FinanseMenu, LocaleFinanse } from '../../constants/menu';
import { ErrorsEnum } from 'src/errors/errorsEnum';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { IActionCard } from '../predict/handlePredictMenu';

export const handleFinanseMenu = async ({
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
    case FinanseMenu.POTENTIAL:
      await bot.sendMessage(
        chatId,
        `<b>Запускаю построение отчета.</b>\n✅ Анализ натальных аспектов, влияющих на способность к зарабатыванию денег.\n✅ Влияние планет во 2-м доме (доме ресурсов) на материальные возможности.\n✅ Определение сильных и слабых сторон в области финансов...`,
        { parse_mode: 'HTML' },
      );
      reportType = LocaleFinanse.POTENTIAL;
      break;
    case FinanseMenu.PERSPECTIVE:
      await bot.sendMessage(
        chatId,
        `<b>Запускаю построение отчета.</b>\n✅ Анализ аспектов, влияющих на успех в инвестициях и предпринимательстве.\n✅ Влияние Юпитера и Плутона на возможность масштабирования капитала.\n✅ Подходящие сферы для инвестиций на основе натальной карты...`,
        { parse_mode: 'HTML' },
      );
      reportType = LocaleFinanse.PERSPECTIVE;
      break;
    case FinanseMenu.RECOMENDATIONS:
      await bot.sendMessage(
        chatId,
        `<b>Запускаю построение отчета.</b>\n✅ Определение наиболее удачных дат для инвестиций, крупных покупок или начала бизнеса.\n✅ Влияние ретроградных планет на финансовые решения.\n✅ Астрологический прогноз на ближайшие месяцы для финансовых операций...`,
        { parse_mode: 'HTML' },
      );
      reportType = LocaleFinanse.RECOMENDATIONS;
      break;
    case FinanseMenu.RISK:
      await bot.sendMessage(
        chatId,
        `<b>Запускаю построение отчета.</b>\n✅ Определение неблагоприятных аспектов и транзитов, влияющих на финансовые решения.\n✅ Анализ положения Сатурна и Урана на предмет возможных финансовых кризисов.\n✅ Рекомендации по управлению рисками и избеганию финансовых потерь...`,
        { parse_mode: 'HTML' },
      );
      reportType = LocaleFinanse.RISK;
      break;
    case FinanseMenu.PLAINING:
      await bot.sendMessage(
        chatId,
        `<b>Запускаю построение отчета.</b>\n✅ Влияние прогрессий и долгосрочных транзитов на финансовое благополучие.\n✅ Перспективы накопления и сбережения на будущее.\n✅ Анализ 8-го дома (долги, наследство, общие финансы) для понимания возможностей и ограничений...`,
        { parse_mode: 'HTML' },
      );
      reportType = LocaleFinanse.PLAINING;
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
    'get-finanse',
    JSON.stringify({ natalCard: cardText.text, reportType }),
  );
  const response = await lastValueFrom(response$);
  return response;
};
