import TelegramBot from 'node-telegram-bot-api';
import { MainMenu, PredictMenu } from '../../constants/menu';

export const sendPredictMenu = async (bot: TelegramBot, chatId: number) => {
  await bot.sendMessage(chatId, 'Выбрать прогноз на основе натальной карты', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Прогноз на сегодня',
            callback_data: PredictMenu.PREDICT_DAY_TODAY,
          },
        ],
        [
          {
            text: 'Прогноз на завтра',
            callback_data: PredictMenu.PREDICT_DAY_NEXT,
          },
        ],
        [
          {
            text: 'Прогноз на текущую неделю',
            callback_data: PredictMenu.PREDICT_WEEK_CURRENT,
          },
        ],
        [
          {
            text: 'Прогноз на следующую неделю',
            callback_data: PredictMenu.PREDICT_WEEK_NEXT,
          },
        ],
        [
          {
            text: 'Прогноз на текущий месяц',
            callback_data: PredictMenu.PREDICT_MONTH_CURRENT,
          },
        ],
        [
          {
            text: 'Прогноз на следующий месяц',
            callback_data: PredictMenu.PREDICT_MONTH_NEXT,
          },
        ],
        [
          {
            text: 'Прогноз на текущий год',
            callback_data: PredictMenu.PREDICT_YEAR_CURRENT,
          },
        ],
        [
          {
            text: 'Прогноз на следующий год',
            callback_data: PredictMenu.PREDICT_YEAR_NEXT,
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
