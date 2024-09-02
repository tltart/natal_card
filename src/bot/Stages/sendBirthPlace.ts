import TelegramBot from 'node-telegram-bot-api';
import { Stages } from '../constants/questionsStatus';
import { IUserData } from './checkCompletedStage';

export const sendBirthPlace = async ({
  bot,
  chatId,
  userStates,
  action = 'create',
  userData,
}: {
  bot: TelegramBot;
  chatId: number;
  userStates: Map<number, Stages>;
  action?: 'create' | 'update';
  userData: Map<number, IUserData>;
}) => {
  if (action === 'update') {
    const currentData = userData.get(chatId) || {
      birthDate: null,
      birthTime: null,
      birthPlace: null,
      cardName: null,
    };
    userData.set(chatId, { ...currentData, birthPlace: null });
  }
  await bot.sendMessage(
    chatId,
    '<b>🌏 ВВЕДИТЕ МЕСТО РОЖДЕНИЯ</b>\nФормат: <b>Страна, Город</b>\nНапример: <b>Россия, Самара</b>',
    { parse_mode: 'HTML' },
  );

  userStates.set(chatId, Stages.AWAITING_BIRTH_PLACE);
};
