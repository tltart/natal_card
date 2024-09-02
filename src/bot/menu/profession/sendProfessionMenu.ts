import TelegramBot from 'node-telegram-bot-api';
import { ProfessionMenu, MainMenu } from '../../constants/menu';

export const sendProfessionMenu = async (bot: TelegramBot, chatId: number) => {
  await bot.sendMessage(chatId, 'Выберете тип отчета', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Рекомендованные профессии',
            callback_data: ProfessionMenu.RECOMENDATIONS,
          },
        ],
        [
          {
            text: 'Карьерный потенциал',
            callback_data: ProfessionMenu.POTENTIAL,
          },
        ],
        [
          {
            text: 'Таланты и способности',
            callback_data: ProfessionMenu.TALANT,
          },
        ],
        [
          {
            text: 'Финансовая стабильность',
            callback_data: ProfessionMenu.STABILITY,
          },
        ],
        [
          {
            text: 'Выбор времени для карьерных шагов',
            callback_data: ProfessionMenu.CARIER_STEP,
          },
        ],
        [
          {
            text: '<- В Главное Меню',
            callback_data: MainMenu.MAIN_MENU,
          },
        ],
      ],
    },
  });
};
