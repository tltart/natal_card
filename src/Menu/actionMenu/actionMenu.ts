import { Injectable } from '@nestjs/common';
import { UserDataActionMenuCallbacks, userDataActionMenuItems } from '../itemsMenu/actionMenu';

@Injectable()
export class ActionMenuService {
  getMenuUserDataActionInlineKeboard() {
    return {
      reply_markup: {
        inline_keyboard: userDataActionMenuItems.map((item) => [item]),
      },
    };
  }

  handle(cbName: string) {
    let action = '';
    switch (cbName) {
      case UserDataActionMenuCallbacks.ACCEPT:
        action = UserDataActionMenuCallbacks.ACCEPT;
        break;
      case UserDataActionMenuCallbacks.UPDATE:
        action = UserDataActionMenuCallbacks.UPDATE;
        break;
      default:
        break;
    }
    return action;
  }
}
