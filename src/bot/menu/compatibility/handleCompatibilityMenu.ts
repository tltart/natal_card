import TelegramBot from 'node-telegram-bot-api';
import { CompatibilityMenu, LocaleCompatibility } from '../../constants/menu';
import { ErrorsEnum } from 'src/errors/errorsEnum';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { IActionCard } from '../predict/handlePredictMenu';

export const handleCompatibilityMenu = async ({
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
    case CompatibilityMenu.ROMANTIC:
      await bot.sendMessage(
        chatId,
        `<b>Запускаю построение отчета.</b>\n✅ Анализ отношений в любви и браке.\n✅ Гармония в чувствах и эмоциональное понимание.\n✅ Совместимость по Венере и Марсу...`,
        { parse_mode: 'HTML' },
      );
      reportType = LocaleCompatibility.ROMANTIC;
      break;
    case CompatibilityMenu.FRIENDS:
      await bot.sendMessage(
        chatId,
        `<b>Запускаю построение отчета.</b>\n✅ Оценка совместимости в дружбе.\n✅ Общие интересы и совместные увлечения.\n✅ Поддержка и взаимопонимание на уровне Солнца и Луны...`,
        { parse_mode: 'HTML' },
      );
      reportType = LocaleCompatibility.FRIENDS;
      break;
    case CompatibilityMenu.FAMILY:
      await bot.sendMessage(
        chatId,
        `<b>Запускаю построение отчета.</b>\n✅ Взаимоотношения с родителями, детьми и родственниками.\n✅ Энергетическая динамика в семье.\n✅ Анализ Лунных узлов и Четвёртого дома...`,
        { parse_mode: 'HTML' },
      );
      reportType = LocaleCompatibility.FAMILY;
      break;
    case CompatibilityMenu.KARMIC:
      await bot.sendMessage(
        chatId,
        `<b>Запускаю построение отчета.</b>\n✅ Связи из прошлых жизней и кармические уроки.\n✅ Совместимость по Лилит и Сатурну.\n✅ Влияние Южного и Северного узлов на отношения...`,
        { parse_mode: 'HTML' },
      );
      reportType = LocaleCompatibility.KARMIC;
      break;
    case CompatibilityMenu.PARTNER_BUSINESS:
      await bot.sendMessage(
        chatId,
        `<b>Запускаю построение отчета.</b>\n✅ Совместимость в деловых отношениях и партнёрствах.\n✅ Анализ коммуникаций и стилей работы.\n✅ Совместимость по Меркурию и Юпитеру...`,
        { parse_mode: 'HTML' },
      );
      reportType = LocaleCompatibility.PARTNER_BUSINESS;
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
    'get-compatibility',
    JSON.stringify({ natalCard: cardText.text, reportType }),
  );
  const response = await lastValueFrom(response$);
  return response;
};
