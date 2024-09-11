import { MainMenuCallbacks, LocaleMainMenu } from './itemsMainMenu';

export enum CompatibilityMenuCallbacks {
  ROMANTIC = 'ROMANTIC',
  FRIENDS = 'FRIENDS',
  PARTNER_BUSINESS = 'PARTNER_BUSINESS',
  FAMILY = 'FAMILY',
  KARMIC = 'KARMIC',
}

export enum LocaleCompatibilityMenu {
  COMPATIBILITY = 'Анализ совместимости',
  ROMANTIC = 'Романтическая совместимость',
  FRIENDS = 'Дружеские отношения',
  PARTNER_BUSINESS = 'Партнёрство и бизнес',
  FAMILY = 'Семейная совместимость',
  KARMIC = 'Кармическая совместимость',
}

export enum LocaleCompatibility {
  ROMANTIC = 'Романтическая совместимость. Анализ отношений в любви и браке. Гармония в чувствах и эмоциональное понимание. Совместимость по Венере и Марсу.',
  FRIENDS = 'Дружеские отношения. Оценка совместимости в дружбе. Общие интересы и совместные увлечения. Поддержка и взаимопонимание на уровне Солнца и Луны.',
  PARTNER_BUSINESS = 'Партнёрство и бизнес. Совместимость в деловых отношениях и партнёрствах. Анализ коммуникаций и стилей работы. Совместимость по Меркурию и Юпитеру.',
  FAMILY = 'Семейная совместимость. Взаимоотношения с родителями, детьми и родственниками. Энергетическая динамика в семье. Анализ Лунных узлов и Четвёртого дома.',
  KARMIC = 'Кармическая совместимость. Связи из прошлых жизней и кармические уроки. Совместимость по Лилит и Сатурну. Влияние Южного и Северного узлов на отношения.',
}

export const compatibilityMenuItems = [
  {
    text: LocaleCompatibilityMenu.ROMANTIC,
    callback_data: CompatibilityMenuCallbacks.ROMANTIC,
  },
  {
    text: LocaleCompatibilityMenu.FRIENDS,
    callback_data: CompatibilityMenuCallbacks.FRIENDS,
  },
  {
    text: LocaleCompatibilityMenu.PARTNER_BUSINESS,
    callback_data: CompatibilityMenuCallbacks.PARTNER_BUSINESS,
  },
  {
    text: LocaleCompatibilityMenu.FAMILY,
    callback_data: CompatibilityMenuCallbacks.FAMILY,
  },
  {
    text: LocaleCompatibilityMenu.KARMIC,
    callback_data: CompatibilityMenuCallbacks.KARMIC,
  },
  {
    text: LocaleMainMenu.MAIN_MENU,
    callback_data: MainMenuCallbacks.MAIN_MENU,
  },
];
