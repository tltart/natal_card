import TelegramBot from 'node-telegram-bot-api';
import { MainMenu } from '../constants/menu';

export const sendMainMenu = async (bot: TelegramBot, chatId: number) => {
  await bot.sendMessage(chatId, '✨✨✨ Основное меню ✨✨✨', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Прогнозы',
            callback_data: MainMenu.PREDICT,
          },
        ],
        [
          {
            text: 'Анализ личности',
            callback_data: MainMenu.ANALYZE_PERSON,
          },
        ],
        [
          {
            text: 'Совместимость',
            callback_data: MainMenu.COMPATIBILITY,
          },
        ],
        [
          {
            text: 'Профессии и карьера',
            callback_data: MainMenu.PROFESSION,
          },
        ],
        [
          {
            text: 'Финансы',
            callback_data: MainMenu.FINANSE_ANALYZE,
          },
        ],
        [
          {
            text: 'Здоровье',
            callback_data: MainMenu.HEALTH_RECOMENDATIONS,
          },
        ],
        [
          {
            text: 'Жизненные циклы',
            callback_data: MainMenu.LIFE_CYCLES,
          },
        ],
        [
          {
            text: 'Личное развитие',
            callback_data: MainMenu.PERSON_EVOLUTION,
          },
        ],
      ],
    },
  });
};
