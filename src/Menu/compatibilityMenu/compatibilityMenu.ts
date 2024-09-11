import { Injectable } from '@nestjs/common';
import {
  CompatibilityMenuCallbacks,
  LocaleCompatibilityMenu,
  compatibilityMenuItems,
} from '../itemsMenu/compatibilityMenu';

@Injectable()
export class CompatibilityMenuService {
  getSubMenuCompatibilityInlineKeboard() {
    return {
      reply_markup: {
        inline_keyboard: compatibilityMenuItems.map((item) => [item]),
      },
    };
  }

  handle(cbName: string) {
    let action = '';
    switch (cbName) {
      case CompatibilityMenuCallbacks.ROMANTIC:
        action = LocaleCompatibilityMenu.ROMANTIC;
        break;
      case CompatibilityMenuCallbacks.FRIENDS:
        action = LocaleCompatibilityMenu.FRIENDS;
        break;
      case CompatibilityMenuCallbacks.PARTNER_BUSINESS:
        action = LocaleCompatibilityMenu.PARTNER_BUSINESS;
        break;
      case CompatibilityMenuCallbacks.FAMILY:
        action = LocaleCompatibilityMenu.FAMILY;
        break;
      case CompatibilityMenuCallbacks.KARMIC:
        action = LocaleCompatibilityMenu.KARMIC;
        break;
      default:
        break;
    }
    return action;
  }
}
