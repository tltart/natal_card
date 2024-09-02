import TelegramBot from 'node-telegram-bot-api';
import { AnalyzePersonMenu, MainMenu } from '../../constants/menu';

export const sendAnalyzePersonMenu = async (
  bot: TelegramBot,
  chatId: number,
) => {
  await bot.sendMessage(chatId, 'Выберете тип отчета', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Основные черты характера',
            callback_data: AnalyzePersonMenu.CHARACTER_TRAITS,
          },
        ],
        [
          {
            text: 'Сильные и слабые стороны',
            callback_data: AnalyzePersonMenu.STRENGTHS_WEAKNESSES,
          },
        ],
        [
          {
            text: 'Психологический портрет',
            callback_data: AnalyzePersonMenu.PSYCHOLOGICAL_PROFILE,
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
