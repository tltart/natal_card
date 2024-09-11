export enum UserDataActionMenuCallbacks {
  ACCEPT = 'ACCEPT_USER_DATA',
  UPDATE = 'UPDATE_USER_DATA',
}

export enum LocaleUserDataActionMenu {
  ACCEPT = 'Подтвердить',
  UPDATE = 'Изменить',
}

export const userDataActionMenuItems: { text: string; callback_data: string }[] = [
  {
    text: LocaleUserDataActionMenu.ACCEPT,
    callback_data: UserDataActionMenuCallbacks.ACCEPT,
  },
  {
    text: LocaleUserDataActionMenu.UPDATE,
    callback_data: UserDataActionMenuCallbacks.UPDATE,
  },
];
