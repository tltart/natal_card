import { LocaleMainMenu, MainMenuCallbacks } from "./itemsMainMenu";

export enum PredictMenuCallbacks {
  PREDICT_DAY_TODAY = 'PREDICT_DAY_TODAY',
  PREDICT_DAY_NEXT = 'PREDICT_DAY_TOMORROW',
  PREDICT_WEEK_NEXT = 'PREDICT_WEEK_NEXT',
  PREDICT_WEEK_CURRENT = 'PREDICT_WEEK_CURRENT',
  PREDICT_MONTH_NEXT = 'PREDICT_MONTH_NEXT',
  PREDICT_MONTH_CURRENT = 'PREDICT_MONTH_CURRENT',
  PREDICT_YEAR_CURRENT = 'PREDICT_YEAR_CURRENT',
  PREDICT_YEAR_NEXT = 'PREDICT_YEAR_NEXT',
}

export enum LocalePredictMenu {
  PREDICT = 'Построить прогноз',
  PREDICT_DAY_TODAY = 'прогноз на сегодня ',
  PREDICT_DAY_NEXT = 'прогноз на завтра ',
  PREDICT_WEEK_NEXT = 'прогноз на следующую неделю ',
  PREDICT_WEEK_CURRENT = 'прогноз на текущую неделю ',
  PREDICT_MONTH_NEXT = 'прогноз на следующий месяц ',
  PREDICT_MONTH_CURRENT = 'прогноз на текущий месяц ',
  PREDICT_YEAR_CURRENT = 'прогноз на текущий год ',
  PREDICT_YEAR_NEXT = 'прогноз на следующий год ',
}

export const predictMenuItems = [
  {
    text: LocalePredictMenu.PREDICT_DAY_TODAY,
    callback_data: PredictMenuCallbacks.PREDICT_DAY_TODAY,
  },
  {
    text: LocalePredictMenu.PREDICT_DAY_NEXT,
    callback_data: PredictMenuCallbacks.PREDICT_DAY_NEXT,
  },
  {
    text: LocalePredictMenu.PREDICT_WEEK_CURRENT,
    callback_data: PredictMenuCallbacks.PREDICT_WEEK_CURRENT,
  },
  {
    text: LocalePredictMenu.PREDICT_WEEK_NEXT,
    callback_data: PredictMenuCallbacks.PREDICT_WEEK_NEXT,
  },
  {
    text: LocalePredictMenu.PREDICT_MONTH_CURRENT,
    callback_data: PredictMenuCallbacks.PREDICT_MONTH_CURRENT,
  },
  {
    text: LocalePredictMenu.PREDICT_MONTH_NEXT,
    callback_data: PredictMenuCallbacks.PREDICT_MONTH_NEXT,
  },
  {
    text: LocalePredictMenu.PREDICT_YEAR_CURRENT,
    callback_data: PredictMenuCallbacks.PREDICT_YEAR_CURRENT,
  },
  {
    text: LocalePredictMenu.PREDICT_YEAR_NEXT,
    callback_data: PredictMenuCallbacks.PREDICT_YEAR_NEXT,
  },
  {
    text: LocaleMainMenu.MAIN_MENU,
    callback_data: MainMenuCallbacks.MAIN_MENU,
  },
];
