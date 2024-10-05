export enum GoroscopeMenuCallbacks {
  GOROSCOPE_TODAY = 'GOROSCOPE_TODAY',
  GOROSCOPE_TOMORROW = 'GOROSCOPE_TOMORROW',
}

export enum LocaleGoroscopeDataActionMenu {
  GOROSCOPE_TODAY = 'На сегодня',
  GOROSCOPE_TOMORROW = 'На завтра',
}

export const GoroscopeMenuItems: { text: string; callback_data: string }[] = [
  {
    text: LocaleGoroscopeDataActionMenu.GOROSCOPE_TODAY,
    callback_data: GoroscopeMenuCallbacks.GOROSCOPE_TODAY,
  },
  {
    text: LocaleGoroscopeDataActionMenu.GOROSCOPE_TOMORROW,
    callback_data: GoroscopeMenuCallbacks.GOROSCOPE_TOMORROW,
  },
];
