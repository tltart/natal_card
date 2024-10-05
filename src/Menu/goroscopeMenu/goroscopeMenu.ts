import { Injectable } from '@nestjs/common';
import { GoroscopeMenuCallbacks, GoroscopeMenuItems } from '../itemsMenu/goroscopeMenu';

@Injectable()
export class GoroscopeMenuService {
  getMenuGoroscopeInlineKeboard() {
    return {
      reply_markup: {
        inline_keyboard: GoroscopeMenuItems.map((item) => [item]),
      },
    };
  }

  handle(cbName: string) {
    let action = '';
    switch (cbName) {
      case GoroscopeMenuCallbacks.GOROSCOPE_TODAY:
        action = GoroscopeMenuCallbacks.GOROSCOPE_TODAY;
        break;
      case GoroscopeMenuCallbacks.GOROSCOPE_TOMORROW:
        action = GoroscopeMenuCallbacks.GOROSCOPE_TOMORROW;
        break;
      default:
        break;
    }
    return action;
  }
}
