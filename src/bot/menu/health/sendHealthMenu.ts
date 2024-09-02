import TelegramBot from 'node-telegram-bot-api';
import { HealthMenu, MainMenu } from '../../constants/menu';

export const sendHealthMenu = async (bot: TelegramBot, chatId: number) => {
  await bot.sendMessage(chatId, 'Выберете тип отчета', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Астрология здоровья',
            callback_data: HealthMenu.ASTROLOGY_HEALTH,
          },
        ],
        [
          {
            text: 'Периоды для оздоровления',
            callback_data: HealthMenu.RECOVERY_PERIOD,
          },
        ],
        [
          {
            text: 'Эмоциональное благополучие',
            callback_data: HealthMenu.WELFARE_EMOTION,
          },
        ],
        [
          {
            text: 'Рекомендации по питанию',
            callback_data: HealthMenu.FOOD_RECOMENDATION,
          },
        ],
        [
          {
            text: 'Физическая активность и спорт',
            callback_data: HealthMenu.PHISYC_SPORT,
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
