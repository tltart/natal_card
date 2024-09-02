import TelegramBot from 'node-telegram-bot-api';
import { PersonEvolutionMenu, MainMenu } from '../../constants/menu';

export const sendPersonEvolutionMenu = async (
  bot: TelegramBot,
  chatId: number,
) => {
  await bot.sendMessage(chatId, 'Выберете тип отчета', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Духовный путь и предназначение',
            callback_data: PersonEvolutionMenu.SPIRIT_PATH,
          },
        ],
        [
          {
            text: 'Работа с теневой стороной личности',
            callback_data: PersonEvolutionMenu.WORK_SHADOW,
          },
        ],
        [
          {
            text: 'Развитие интуиции и внутреннего голоса',
            callback_data: PersonEvolutionMenu.INTUITION_EVO,
          },
        ],
        [
          {
            text: 'Баланс энергии и личная гармония',
            callback_data: PersonEvolutionMenu.BALANCE_ENERGY,
          },
        ],
        [
          {
            text: 'Аффирмации и позитивное мышление',
            callback_data: PersonEvolutionMenu.AFFIRMATION,
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
