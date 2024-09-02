import TelegramBot from 'node-telegram-bot-api';
import {
  LocalePersonEvolution,
  PersonEvolutionMenu,
} from '../../constants/menu';
import { ErrorsEnum } from 'src/errors/errorsEnum';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { IActionCard } from '../predict/handlePredictMenu';

export const handlePersonEvolutionMenu = async ({
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
    case PersonEvolutionMenu.SPIRIT_PATH:
      await bot.sendMessage(
        chatId,
        `<b>Запускаю построение отчета.</b>\n✅ Анализ положения Нептуна и Плутона для понимания духовного пути.\n✅ Советы по раскрытию внутреннего потенциала и следованию жизненному предназначению.\n✅ Определение духовных практик, подходящих для твоего знака зодиака и натальной карты...`,
        { parse_mode: 'HTML' },
      );
      reportType = LocalePersonEvolution.SPIRIT_PATH;
      break;
    case PersonEvolutionMenu.WORK_SHADOW:
      await bot.sendMessage(
        chatId,
        `<b>Запускаю построение отчета.</b>\n✅ Анализ влияния Лилит и Плутона на тёмные стороны личности.\n✅ Рекомендации по интеграции и преодолению внутренних конфликтов.\n✅ Практики для осознания и трансформации теневых аспектов личности...`,
        { parse_mode: 'HTML' },
      );
      reportType = LocalePersonEvolution.WORK_SHADOW;
      break;
    case PersonEvolutionMenu.INTUITION_EVO:
      await bot.sendMessage(
        chatId,
        `<b>Запускаю построение отчета.</b>\n✅ Влияние Луны и Нептуна на интуитивные способности.\n✅ Методы развития интуиции и доверия к внутреннему голосу.\n✅ Медитации и техники для улучшения связи с подсознанием...`,
        { parse_mode: 'HTML' },
      );
      reportType = LocalePersonEvolution.INTUITION_EVO;
      break;
    case PersonEvolutionMenu.BALANCE_ENERGY:
      await bot.sendMessage(
        chatId,
        `<b>Запускаю построение отчета.</b>\n✅ Определение энергетических блоков на основе положения Марса и Сатурна.\n✅ Советы по поддержанию баланса между различными аспектами жизни (работа, отношения, духовность).\n✅ Рекомендации по гармонизации чакр и энергетических центров на основе натальной карты...`,
        { parse_mode: 'HTML' },
      );
      reportType = LocalePersonEvolution.BALANCE_ENERGY;
      break;
    case PersonEvolutionMenu.AFFIRMATION:
      await bot.sendMessage(
        chatId,
        `<b>Запускаю построение отчета.</b>\n✅ Создание аффирмаций, соответствующих твоей натальной карте и планетарным аспектам.\n✅ Влияние Юпитера и Солнца на оптимизм и позитивное восприятие жизни.\n✅ Практики для ежедневного укрепления позитивного мышления и манифестации желаемого...`,
        { parse_mode: 'HTML' },
      );
      reportType = LocalePersonEvolution.AFFIRMATION;
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
    'get-person-evolution',
    JSON.stringify({ natalCard: cardText.text, reportType }),
  );
  const response = await lastValueFrom(response$);
  return response;
};
