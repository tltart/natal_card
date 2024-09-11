export enum MainMenuCallbacks {
  MAIN_MENU = 'MAIN_MENU',
  PREDICT = 'PREDICT',
  ANALYZE_PERSON = 'ANALYZE_PERSON',
  COMPATIBILITY = 'COMPATIBILITY',
  PROFESSION = 'PROFESSION',
  HEALTH_RECOMENDATIONS = 'HEALTH_RECOMENDATIONS',
  FINANSE_ANALYZE = 'FINANSE_ANALYZE',
}

export enum LocaleMainMenu {
  MAIN_MENU = 'Главное меню',
  PREDICT = 'Прогнозы',
  ANALYZE_PERSON = 'Анализ личности',
  COMPATIBILITY = 'Совместимость',
  PROFESSION = 'Профессии и карьера',
  FINANSE_ANALYZE = 'Финансы',
  HEALTH_RECOMENDATIONS = 'Здоровье',
}

export const mainMenuItems: { text: string; callback_data: string }[] = [
  {
    text: LocaleMainMenu.PREDICT,
    callback_data: MainMenuCallbacks.PREDICT,
  },
  {
    text: LocaleMainMenu.ANALYZE_PERSON,
    callback_data: MainMenuCallbacks.ANALYZE_PERSON,
  },
  {
    text: LocaleMainMenu.COMPATIBILITY,
    callback_data: MainMenuCallbacks.COMPATIBILITY,
  },
  {
    text: LocaleMainMenu.PROFESSION,
    callback_data: MainMenuCallbacks.PROFESSION,
  },
  {
    text: LocaleMainMenu.FINANSE_ANALYZE,
    callback_data: MainMenuCallbacks.FINANSE_ANALYZE,
  },
  {
    text: LocaleMainMenu.HEALTH_RECOMENDATIONS,
    callback_data: MainMenuCallbacks.HEALTH_RECOMENDATIONS,
  },
];
