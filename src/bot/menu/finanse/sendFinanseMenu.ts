import TelegramBot from 'node-telegram-bot-api';
import { FinanseMenu, MainMenu } from '../../constants/menu';

export const sendFinanseMenu = async (bot: TelegramBot, chatId: number) => {
  await bot.sendMessage(chatId, 'Выберете тип отчета', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Финансовый потенциал',
            callback_data: FinanseMenu.POTENTIAL,
          },
        ],
        [
          {
            text: 'Инвестиционные перспективы',
            callback_data: FinanseMenu.PERSPECTIVE,
          },
        ],
        [
          {
            text: 'Благоприятные периоды для финансовых решений',
            callback_data: FinanseMenu.RECOMENDATIONS,
          },
        ],
        [
          {
            text: 'Риски и предостережения',
            callback_data: FinanseMenu.RISK,
          },
        ],
        [
          {
            text: 'Долгосрочное финансовое планирование',
            callback_data: FinanseMenu.PLAINING,
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
