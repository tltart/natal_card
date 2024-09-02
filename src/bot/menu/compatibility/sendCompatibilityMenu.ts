import TelegramBot from 'node-telegram-bot-api';
import { CompatibilityMenu, MainMenu } from '../../constants/menu';

export const sendCompatibilityMenu = async (
  bot: TelegramBot,
  chatId: number,
) => {
  await bot.sendMessage(chatId, 'Выберете тип отчета', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Романтическая совместимость',
            callback_data: CompatibilityMenu.ROMANTIC,
          },
        ],
        [
          {
            text: 'Дружеские отношения',
            callback_data: CompatibilityMenu.FRIENDS,
          },
        ],
        [
          {
            text: 'Партнёрство и бизнес',
            callback_data: CompatibilityMenu.PARTNER_BUSINESS,
          },
        ],
        [
          {
            text: 'Семейная совместимость',
            callback_data: CompatibilityMenu.FAMILY,
          },
        ],
        [
          {
            text: 'Кармическая совместимость',
            callback_data: CompatibilityMenu.KARMIC,
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
