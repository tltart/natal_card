import TelegramBot from 'node-telegram-bot-api';
import { ProfessionMenu, LocaleProfession } from '../../constants/menu';
import { ErrorsEnum } from 'src/errors/errorsEnum';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { IActionCard } from '../predict/handlePredictMenu';

export const handleProfessionMenu = async ({
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
    case ProfessionMenu.RECOMENDATIONS:
      await bot.sendMessage(
        chatId,
        `<b>Запускаю построение отчета.</b>\n✅ Список профессий, наиболее соответствующих твоим планетарным аспектам.\n✅ Анализ влияния знаков на карьерные предпочтения.\n✅ Подходящие сферы деятельности на основе элементов и домов...`,
        { parse_mode: 'HTML' },
      );
      reportType = LocaleProfession.RECOMENDATIONS;
      break;
    case ProfessionMenu.POTENTIAL:
      await bot.sendMessage(
        chatId,
        `<b>Запускаю построение отчета.</b>\n✅ Оценка силы и слабости в профессиональной сфере.\n✅ Анализ планет в 10-м доме (доме карьеры) и их влияние на успех.\n✅ Перспективы роста и достижения целей...`,
        { parse_mode: 'HTML' },
      );
      reportType = LocaleProfession.POTENTIAL;
      break;
    case ProfessionMenu.TALANT:
      await bot.sendMessage(
        chatId,
        `<b>Запускаю построение отчета.</b>\n✅ Определение природных талантов и навыков.\n✅ Влияние Меркурия, Венеры и Марса на умственные и физические способности.\n✅ Рекомендации по развитию и применению талантов в карьере...`,
        { parse_mode: 'HTML' },
      );
      reportType = LocaleProfession.TALANT;
      break;
    case ProfessionMenu.STABILITY:
      await bot.sendMessage(
        chatId,
        `<b>Запускаю построение отчета.</b>\n✅ Анализ 2-го и 8-го домов (финансы и ресурсы).\n✅ Способы достижения материального благополучия.\n✅ Влияние Юпитера и Сатурна на финансовые возможности...`,
        { parse_mode: 'HTML' },
      );
      reportType = LocaleProfession.STABILITY;
      break;
    case ProfessionMenu.CARIER_STEP:
      await bot.sendMessage(
        chatId,
        `<b>Запускаю построение отчета.</b>\n✅ Лучшая дата для начала новых проектов или смены работы.\n✅ Анализ транзитов и прогрессий для оптимальных карьерных решений.\n✅ Влияние текущих планетарных аспектов на успех в карьере...`,
        { parse_mode: 'HTML' },
      );
      reportType = LocaleProfession.CARIER_STEP;
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
    'get-profession',
    JSON.stringify({ natalCard: cardText.text, reportType }),
  );
  const response = await lastValueFrom(response$);
  return response;
};
