import TelegramBot from 'node-telegram-bot-api';
import { Stages } from '../constants/questionsStatus';
import { isValidDate } from '../../utils/checkDate';
import { sendBirthDate } from './sendBirthDate';
import { sendBirthTime } from './sendBirthTime';
import { sendBirthPlace } from './sendBirthPlace';
import { sendBirthData } from './sendBirthData';
import { sendCardName } from './sendCardName';

export interface IUserData {
  birthDate: string | null;
  birthTime: string | null;
  birthPlace: string | null;
  cardName: string | null;
}

export const checkCompletedStage = async ({
  bot,
  chatId,
  userStates,
  userData,
  text,
}: {
  bot: TelegramBot;
  chatId: number;
  userStates: Map<number, Stages>;
  userData: Map<number, IUserData>;
  text: string;
}) => {
  let { birthDate, birthPlace, birthTime, cardName } =
    userData.get(chatId) || {};
  if (!birthDate || !birthTime || !birthPlace || !cardName) {
    if (userStates.get(chatId) === Stages.AWAITING_BIRTH_DATE) {
      if (!isValidDate(text)) {
        await bot.sendMessage(
          chatId,
          '<b>❌ НЕВЕРНАЯ ДАТА. НЕ СООТВЕТСТВУЕТ ШАБЛОНУ.</b>',
          { parse_mode: 'HTML' },
        );
        await bot.sendMessage(
          chatId,
          '<b>📆 ВВЕДИТЕ ДАТУ РОЖДЕНИЯ</b>\nФормат <b>ЧИСЛО➖МЕСЯЦ➖ГОД</b>\nНапример: <b>04-06-1992</b>',
          { parse_mode: 'HTML' },
        );
        return;
      }
      await bot.sendMessage(chatId, `✅ Вы ввели дату рождения: ${text}`);
      userStates.delete(chatId);
      userData.set(chatId, {
        ...userData.get(chatId),
        birthDate: text,
      });
      birthDate = text;
    } else if (userStates.get(chatId) === Stages.AWAITING_BIRTH_TIME) {
      if (!text.match(/^\d{2}:\d{2}$/)) {
        await bot.sendMessage(
          chatId,
          '<b>❌ НЕВЕРНОЕ ВРЕМЯ. НЕ СООТВЕТСТВУЕТ ШАБЛОНУ.</b>',
          { parse_mode: 'HTML' },
        );
        await bot.sendMessage(
          chatId,
          '<b>⏰ ВВЕДИТЕ ВРЕМЯ РОЖДЕНИЯ</b>\nФормат <b>ЧАСЫ:МИНУТЫ</b>\nНапример: <b>16:45</b>',
          { parse_mode: 'HTML' },
        );
        return;
      }
      userStates.delete(chatId);
      userData.set(chatId, {
        ...userData.get(chatId),
        birthTime: text,
      });
      await bot.sendMessage(chatId, `✅ Вы ввели время рождения: ${text}`);
      birthTime = text;
    } else if (userStates.get(chatId) === Stages.AWAITING_BIRTH_PLACE) {
      if (!text.match(/^.+,.+$/)) {
        await bot.sendMessage(
          chatId,
          '<b>❌ НЕВЕРНОЕ МЕСТО. НЕ СООТВЕТСТВУЕТ ШАБЛОНУ.</b>',
          { parse_mode: 'HTML' },
        );
        await bot.sendMessage(
          chatId,
          '<b>🌏 ВВЕДИТЕ МЕСТО РОЖДЕНИЯ</b>\nФормат: <b>Страна, Город</b>\nНапример: <b>Россия, Самара</b>',
          { parse_mode: 'HTML' },
        );
        return;
      }
      await bot.sendMessage(chatId, `✅ Вы ввели место рождения: ${text}`);
      userStates.delete(chatId);
      userData.set(chatId, {
        ...userData.get(chatId),
        birthPlace: text,
      });
      birthPlace = text;
    } else if (userStates.get(chatId) === Stages.AWAITING_BIRTH_NAME) {
      if (text.length > 20) {
        await bot.sendMessage(
          chatId,
          '<b>❌ СЛИШКОМ ДЛИННОЕ ИМЯ. ИЗМЕНИТЕ ВВОД.</b>',
          { parse_mode: 'HTML' },
        );
        await bot.sendMessage(
          chatId,
          '<b>⏰ ВВЕДИТЕ ВРЕМЯ РОЖДЕНИЯ</b>\nФормат <b>ЧАСЫ:МИНУТЫ</b>\nНапример: <b>16:45</b>',
          { parse_mode: 'HTML' },
        );
        return;
      }
      await bot.sendMessage(chatId, `✅ Вы ввели имя: ${text}`);
      userStates.delete(chatId);
      userData.set(chatId, {
        ...userData.get(chatId),
        cardName: text,
      });
      cardName = text;
    }
    if (!cardName) {
      return await sendCardName({
        bot,
        chatId,
        userStates,
        userData,
      });
    } else if (!birthDate) {
      return await sendBirthDate({
        bot,
        chatId,
        userStates,
        userData,
      });
    } else if (!birthTime) {
      return await sendBirthTime({
        bot,
        chatId,
        userStates,
        userData,
      });
    } else if (!birthPlace) {
      return await sendBirthPlace({
        bot,
        chatId,
        userStates,
        userData,
      });
    } else {
      return sendBirthData({ bot, chatId, userData });
    }
  }
};
