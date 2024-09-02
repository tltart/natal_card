import TelegramBot from 'node-telegram-bot-api';
import { HealthMenu, LocaleHealth } from '../../constants/menu';
import { ErrorsEnum } from 'src/errors/errorsEnum';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { IActionCard } from '../predict/handlePredictMenu';

export const handleHealthMenu = async ({
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
    case HealthMenu.ASTROLOGY_HEALTH:
      await bot.sendMessage(
        chatId,
        `<b>Запускаю построение отчета.</b>\n✅ Анализ натальной карты для выявления предрасположенности к заболеваниям.\n✅ Влияние планет и знаков на различные системы организма.\n✅ Рекомендации по укреплению здоровья на основе положения Солнца, Луны и Марса...`,
        { parse_mode: 'HTML' },
      );
      reportType = LocaleHealth.ASTROLOGY_HEALTH;
      break;
    case HealthMenu.RECOVERY_PERIOD:
      await bot.sendMessage(
        chatId,
        `<b>Запускаю построение отчета.</b>\n✅ Лучшая дата для начала диеты, физических упражнений или медицинского лечения.\n✅ Влияние лунных фаз и транзитов на здоровье.\n✅ Оптимальные периоды для детоксикации и очищения организма...`,
        { parse_mode: 'HTML' },
      );
      reportType = LocaleHealth.RECOVERY_PERIOD;
      break;
    case HealthMenu.WELFARE_EMOTION:
      await bot.sendMessage(
        chatId,
        `<b>Запускаю построение отчета.</b>\n✅ Влияние Луны и Венеры на эмоциональное состояние.\n✅ Рекомендации по поддержанию психического здоровья и эмоциональной стабильности.\n✅ Анализ натальных аспектов, связанных с психическим здоровьем...`,
        { parse_mode: 'HTML' },
      );
      reportType = LocaleHealth.WELFARE_EMOTION;
      break;
    case HealthMenu.FOOD_RECOMENDATION:
      await bot.sendMessage(
        chatId,
        `<b>Запускаю построение отчета.</b>\n✅ Подбор диеты на основе астрологических данных.\n✅ Влияние планет на пищевые привычки и метаболизм.\n✅ Советы по питанию для различных знаков зодиака...`,
        { parse_mode: 'HTML' },
      );
      reportType = LocaleHealth.FOOD_RECOMENDATION;
      break;
    case HealthMenu.PHISYC_SPORT:
      await bot.sendMessage(
        chatId,
        `<b>Запускаю построение отчета.</b>\n✅ Определение подходящего вида физической активности на основе натальной карты.\n✅ Влияние Марса и 6-го дома (здоровье и повседневные привычки) на спортивные достижения.\n✅ Рекомендации по поддержанию физической формы и энергии...`,
        { parse_mode: 'HTML' },
      );
      reportType = LocaleHealth.PHISYC_SPORT;
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
    'get-health',
    JSON.stringify({ natalCard: cardText.text, reportType }),
  );
  const response = await lastValueFrom(response$);
  return response;
};
