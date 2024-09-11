import { MainMenuCallbacks, LocaleMainMenu } from './itemsMainMenu';

export enum ProfessionMenuCallbacks {
  RECOMENDATIONS = 'PROFESSION_RECOMENDATIONS',
  POTENTIAL = 'PROFESSION_POTENTIAL',
  TALANT = 'PROFESSION_TALANT',
  STABILITY = 'PROFESSION_STABILITY',
  CARIER_STEP = 'PROFESSION_CARIER_STEP',
}

export enum LocaleProfessionMenu {
  PROFESSION_MENU = 'Профессиональная деятельность',
  RECOMENDATIONS = 'Рекомендованные профессии',
  POTENTIAL = 'Карьерный потенциал',
  TALANT = 'Таланты и способности',
  STABILITY = 'Финансовая стабильность',
  CARIER_STEP = 'Выбор времени для карьерных шагов',
}

export enum LocaleProfession {
  RECOMENDATIONS = 'Рекомендованные профессии. Список профессий, наиболее соответствующих вашим планетарным аспектам. Анализ влияния знаков на карьерные предпочтения. Подходящие сферы деятельности на основе элементов и домов.',
  POTENTIAL = 'Карьерный потенциал. Оценка силы и слабости в профессиональной сфере. Анализ планет в 10-м доме (доме карьеры) и их влияние на успех. Перспективы роста и достижения целей.',
  TALANT = 'Таланты и способности. Определение природных талантов и навыков. Влияние Меркурия, Венеры и Марса на умственные и физические способности. Рекомендации по развитию и применению талантов в карьере.',
  STABILITY = 'Финансовая стабильность. Анализ 2-го и 8-го домов (финансы и ресурсы). Способы достижения материального благополучия. Влияние Юпитера и Сатурна на финансовые возможности.',
  CARIER_STEP = 'Выбор времени для карьерных шагов. Лучшая дата для начала новых проектов или смены работы. Анализ транзитов и прогрессий для оптимальных карьерных решений. Влияние текущих планетарных аспектов на успех в карьере.',
}

export const professionMenuItems = [
  {
    text: LocaleProfessionMenu.RECOMENDATIONS,
    callback_data: ProfessionMenuCallbacks.RECOMENDATIONS,
  },
  {
    text: LocaleProfessionMenu.POTENTIAL,
    callback_data: ProfessionMenuCallbacks.POTENTIAL,
  },
  {
    text: LocaleProfessionMenu.TALANT,
    callback_data: ProfessionMenuCallbacks.TALANT,
  },
  {
    text: LocaleProfessionMenu.STABILITY,
    callback_data: ProfessionMenuCallbacks.STABILITY,
  },
  {
    text: LocaleProfessionMenu.CARIER_STEP,
    callback_data: ProfessionMenuCallbacks.CARIER_STEP,
  },
  {
    text: LocaleMainMenu.MAIN_MENU,
    callback_data: MainMenuCallbacks.MAIN_MENU,
  },
];
