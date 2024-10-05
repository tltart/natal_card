export enum UserDataActionMenuCallbacks {
  ACCEPT = 'ACCEPT_USER_DATA',
  REMOVE = 'REMOVE_USER_DATA',
  UPDATE = 'UPDATE_USER_DATA',
}

export enum LocaleUserDataActionMenu {
  ACCEPT = 'Подтвердить',
  UPDATE = 'Изменить',
  REMOVE = 'Удалить',
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
  {
    text: LocaleUserDataActionMenu.REMOVE,
    callback_data: UserDataActionMenuCallbacks.REMOVE,
  },
];
