import { MainMenuCallbacks, LocaleMainMenu } from './itemsMainMenu';

export enum HealthMenuCallbacks {
  ASTROLOGY_HEALTH = 'ASTROLOGY_HEALTH',
  RECOVERY_PERIOD = 'RECOVERY_PERIOD',
  WELFARE_EMOTION = 'WELFARE_EMOTION',
  FOOD_RECOMENDATION = 'FOOD_RECOMENDATION',
  PHISYC_SPORT = 'PHISYC_SPORT',
}

export enum LocaleHealthMenu {
  HEALTH_MENU = 'Здоровье',
  ASTROLOGY_HEALTH = 'Астрология здоровья',
  RECOVERY_PERIOD = 'Периоды для оздоровления',
  WELFARE_EMOTION = 'Эмоциональное благополучие',
  FOOD_RECOMENDATION = 'Рекомендации по питанию',
  PHISYC_SPORT = 'Физическая активность и спорт',
}

export enum LocaleHealth {
  ASTROLOGY_HEALTH = 'Астрология здоровья. Анализ натальной карты для выявления предрасположенности к заболеваниям. Влияние планет и знаков на различные системы организма. Рекомендации по укреплению здоровья на основе положения Солнца, Луны и Марса.',
  RECOVERY_PERIOD = 'Оптимальные периоды для оздоровления. Лучшая дата для начала диеты, физических упражнений или медицинского лечения. Влияние лунных фаз и транзитов на здоровье. Оптимальные периоды для детоксикации и очищения организма.',
  WELFARE_EMOTION = 'Психологическое и эмоциональное благополучие. Влияние Луны и Венеры на эмоциональное состояние. Рекомендации по поддержанию психического здоровья и эмоциональной стабильности. Анализ натальных аспектов, связанных с психическим здоровьем.',
  FOOD_RECOMENDATION = 'Рекомендации по питанию. Подбор диеты на основе астрологических данных. Влияние планет на пищевые привычки и метаболизм. Советы по питанию для различных знаков зодиака.',
  PHISYC_SPORT = 'Физическая активность и спорт. Определение подходящего вида физической активности на основе натальной карты. Влияние Марса и 6-го дома (здоровье и повседневные привычки) на спортивные достижения. Рекомендации по поддержанию физической формы и энергии.',
}

export const healthMenuItems = [
  {
    text: LocaleHealthMenu.ASTROLOGY_HEALTH,
    callback_data: HealthMenuCallbacks.ASTROLOGY_HEALTH,
  },
  {
    text: LocaleHealthMenu.RECOVERY_PERIOD,
    callback_data: HealthMenuCallbacks.RECOVERY_PERIOD,
  },
  {
    text: LocaleHealthMenu.WELFARE_EMOTION,
    callback_data: HealthMenuCallbacks.WELFARE_EMOTION,
  },
  {
    text: LocaleHealthMenu.FOOD_RECOMENDATION,
    callback_data: HealthMenuCallbacks.FOOD_RECOMENDATION,
  },
  {
    text: LocaleHealthMenu.PHISYC_SPORT,
    callback_data: HealthMenuCallbacks.PHISYC_SPORT,
  },
  {
    text: LocaleMainMenu.MAIN_MENU,
    callback_data: MainMenuCallbacks.MAIN_MENU,
  },
];
