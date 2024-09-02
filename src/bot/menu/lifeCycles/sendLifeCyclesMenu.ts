import TelegramBot from 'node-telegram-bot-api';
import { LifeCyclesMenu, MainMenu } from '../../constants/menu';

export const sendLifeCyclesMenu = async (bot: TelegramBot, chatId: number) => {
  await bot.sendMessage(chatId, 'Выберете тип отчета', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Сатурновы циклы и возвраты',
            callback_data: LifeCyclesMenu.SATURN_CYCLES,
          },
        ],
        [
          {
            text: 'Транзиты Плутона',
            callback_data: LifeCyclesMenu.PLUTON_TRANSIT,
          },
        ],
        [
          {
            text: 'Юпитер: периоды удачи и расширения',
            callback_data: LifeCyclesMenu.JUPITER_PERIODS,
          },
        ],
        [
          {
            text: 'Возвращения Урана и неожиданные перемены',
            callback_data: LifeCyclesMenu.URAN_RETURN,
          },
        ],
        [
          {
            text: 'Кармические узлы',
            callback_data: LifeCyclesMenu.KARMIC_NODES,
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
