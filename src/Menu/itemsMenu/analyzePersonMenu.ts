import { MainMenuCallbacks, LocaleMainMenu } from './itemsMainMenu';

export enum AnalyzePersonMenuCallbacks {
  CHARACTER_TRAITS = 'CHARACTER_TRAITS',
  STRENGTHS_WEAKNESSES = 'STRENGTHS_WEAKNESSES',
  PSYCHOLOGICAL_PROFILE = 'PSYCHOLOGICAL_PROFILE',
}

export enum LocaleAnalyzePersonMenu {
  ANALYZE_PERSON = 'Анализ личности',
  CHARACTER_TRAITS = 'Основные черты характера',
  STRENGTHS_WEAKNESSES = 'Сильные и слабые стороны',
  PSYCHOLOGICAL_PROFILE = 'Психологический портрет',
}

export enum LocaleAnalyzePerson {
  CHARACTER_TRAITS = 'Основные черты характера. Описание влияния Солнца, Луны и асцендента на личность. Анализ доминирующих элементов (огонь, вода, земля, воздух). Влияние знака зодиака на стиль поведения и мировоззрение.',
  STRENGTHS_WEAKNESSES = 'сильные и слабые стороны. Выявление природных талантов и способностей. Области, требующие внимания и развития. Потенциальные внутренние конфликты и способы их разрешения.',
  PSYCHOLOGICAL_PROFILE = 'психологический портрет. Эмоциональная структура: как ты переживаешь и выражаешь чувства. Восприятие себя и мира: анализ самооценки и жизненных ценностей. Влияние внутренних планет (Меркурий, Венера, Марс) на мышление, общение и желания.',
}

export const analyzePersontMenuItems = [
  {
    text: LocaleAnalyzePersonMenu.CHARACTER_TRAITS,
    callback_data: AnalyzePersonMenuCallbacks.CHARACTER_TRAITS,
  },
  {
    text: LocaleAnalyzePersonMenu.STRENGTHS_WEAKNESSES,
    callback_data: AnalyzePersonMenuCallbacks.STRENGTHS_WEAKNESSES,
  },
  {
    text: LocaleAnalyzePersonMenu.PSYCHOLOGICAL_PROFILE,
    callback_data: AnalyzePersonMenuCallbacks.PSYCHOLOGICAL_PROFILE,
  },
  {
    text: LocaleMainMenu.MAIN_MENU,
    callback_data: MainMenuCallbacks.MAIN_MENU,
  },
];
