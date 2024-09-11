import { MainMenuCallbacks, LocaleMainMenu } from './itemsMainMenu';

export enum FinanseMenuCallbacks {
  POTENTIAL = 'FINANSE_POTENTIAL',
  PERSPECTIVE = 'FINANSE_PERSPECTIVE',
  RECOMENDATIONS = 'FINANSE_RECOMENDATIONS',
  RISK = 'FINANSE_RISK',
  PLAINING = 'FINANSE_PLAINING',
}

export enum LocaleFinanseMenu {
  FINANSE_MENU = 'Финансы',
  POTENTIAL = 'Финансовый потенциал',
  PERSPECTIVE = 'Инвестиционные перспективы',
  RECOMENDATIONS = 'Благоприятные периоды',
  RISK = 'Риски',
  PLAINING = 'Планирование',
}

export enum LocaleFinanse {
  POTENTIAL = 'Финансовый потенциал. Анализ натальных аспектов, влияющих на способность к зарабатыванию денег. Влияние планет во 2-м доме (доме ресурсов) на материальные возможности. Определение сильных и слабых сторон в области финансов.',
  PERSPECTIVE = 'Инвестиционные перспективы. Анализ аспектов, влияющих на успех в инвестициях и предпринимательстве. Влияние Юпитера и Плутона на возможность масштабирования капитала. Подходящие сферы для инвестиций на основе натальной карты.',
  RECOMENDATIONS = 'Благоприятные периоды для финансовых решений. Определение наиболее удачных дат для инвестиций, крупных покупок или начала бизнеса. Влияние ретроградных планет на финансовые решения. Астрологический прогноз на ближайшие месяцы для финансовых операций.',
  RISK = 'Риски и предостережения. Определение неблагоприятных аспектов и транзитов, влияющих на финансовые решения. Анализ положения Сатурна и Урана на предмет возможных финансовых кризисов. Рекомендации по управлению рисками и избеганию финансовых потерь.',
  PLAINING = 'Долгосрочное финансовое планирование. Влияние прогрессий и долгосрочных транзитов на финансовое благополучие. Перспективы накопления и сбережения на будущее. Анализ 8-го дома (долги, наследство, общие финансы) для понимания возможностей и ограничений.',
}

export const finanseMenuItems = [
  {
    text: LocaleFinanseMenu.POTENTIAL,
    callback_data: FinanseMenuCallbacks.POTENTIAL,
  },
  {
    text: LocaleFinanseMenu.PERSPECTIVE,
    callback_data: FinanseMenuCallbacks.PERSPECTIVE,
  },
  {
    text: LocaleFinanseMenu.RECOMENDATIONS,
    callback_data: FinanseMenuCallbacks.RECOMENDATIONS,
  },
  {
    text: LocaleFinanseMenu.RISK,
    callback_data: FinanseMenuCallbacks.RISK,
  },
  {
    text: LocaleFinanseMenu.PLAINING,
    callback_data: FinanseMenuCallbacks.PLAINING,
  },
  {
    text: LocaleMainMenu.MAIN_MENU,
    callback_data: MainMenuCallbacks.MAIN_MENU,
  },
];
