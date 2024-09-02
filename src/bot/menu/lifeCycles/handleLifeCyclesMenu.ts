import TelegramBot from 'node-telegram-bot-api';
import { LifeCyclesMenu, LocaleLifeCycles } from '../../constants/menu';
import { ErrorsEnum } from 'src/errors/errorsEnum';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { IActionCard } from '../predict/handlePredictMenu';

export const handleLifeCycleMenu = async ({
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
    case LifeCyclesMenu.SATURN_CYCLES:
      await bot.sendMessage(
        chatId,
        `<b>Запускаю построение отчета.</b>\n✅ Анализ циклов Сатурна (возвращения и квадраты) и их влияние на важные жизненные этапы.\n✅ Оценка зрелости и ответственности на основе транзитов Сатурна.\n✅ Советы по преодолению трудностей и достижению целей в период Сатурновых трансформаций...`,
        { parse_mode: 'HTML' },
      );
      reportType = LocaleLifeCycles.SATURN_CYCLES;
      break;
    case LifeCyclesMenu.PLUTON_TRANSIT:
      await bot.sendMessage(
        chatId,
        `<b>Запускаю построение отчета.</b>\n✅ Влияние транзитов Плутона на кардинальные перемены в жизни.\n✅ Преобразование и личная трансформация через аспекты Плутона.\n✅ Восстановление и обновление после кризисов и перемен...`,
        { parse_mode: 'HTML' },
      );
      reportType = LocaleLifeCycles.PLUTON_TRANSIT;
      break;
    case LifeCyclesMenu.JUPITER_PERIODS:
      await bot.sendMessage(
        chatId,
        `<b>Запускаю построение отчета.</b>\n✅ Определение периодов, когда Юпитер приносит удачу и возможности.\n✅ Развитие и рост в карьере, финансах и личной жизни во время транзитов Юпитера.\n✅ Советы по максимальному использованию благоприятных периодов Юпитера...`,
        { parse_mode: 'HTML' },
      );
      reportType = LocaleLifeCycles.JUPITER_PERIODS;
      break;
    case LifeCyclesMenu.URAN_RETURN:
      await bot.sendMessage(
        chatId,
        `<b>Запускаю построение отчета.</b>\n✅ Анализ Урановых циклов и их влияние на неожиданные перемены в жизни.\n✅ Влияние транзитов Урана на свободу, инновации и резкие изменения.\n✅ Подготовка к неожиданным событиям и адаптация к новым условиям...`,
        { parse_mode: 'HTML' },
      );
      reportType = LocaleLifeCycles.URAN_RETURN;
      break;
    case LifeCyclesMenu.KARMIC_NODES:
      await bot.sendMessage(
        chatId,
        `<b>Запускаю построение отчета.</b>\n✅ Влияние Северного и Южного узлов на предназначение и кармические задачи.\n✅ Определение ключевых жизненных уроков и путей их выполнения.\n✅ Советы по развитию в соответствии с кармическими задачами и узловыми циклами...`,
        { parse_mode: 'HTML' },
      );
      reportType = LocaleLifeCycles.KARMIC_NODES;
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
    'get-life-cycles',
    JSON.stringify({ natalCard: cardText.text, reportType }),
  );
  const response = await lastValueFrom(response$);
  return response;
};
