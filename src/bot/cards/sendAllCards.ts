import TelegramBot from 'node-telegram-bot-api';
import { Target } from '@prisma/client';
import { CardStagesEnum } from './constants/cardsStageEnum';
import { UpdatedProperty } from '../constants/updatedProperty';

export const sendAllCards = async (
  bot: TelegramBot,
  chatId: number,
  cards: Target[],
) => {
  await bot.sendMessage(chatId, '🗺 Выбрать натальную карту 🗺', {
    reply_markup: {
      inline_keyboard: cards.map((card) => [
        {
          text: `🌌 Карта для ${card.name}`,
          callback_data: `${CardStagesEnum.GET_CARD}-${card.id}-${card.name}`,
        },
      ]),
    },
  });
  await bot.sendMessage(chatId, '🗺 Создать натальную карту 🗺', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '🌌 Создать новую натальную карту',
            callback_data: UpdatedProperty.CREATE_BIRTH_DATA,
          },
        ],
      ],
    },
  });
};
