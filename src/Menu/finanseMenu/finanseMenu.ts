import { Injectable } from '@nestjs/common';
import {
  FinanseMenuCallbacks,
  LocaleFinanseMenu,
  finanseMenuItems,
} from '../itemsMenu/finanseMenu';

@Injectable()
export class FinanseMenuService {
  getSubMenuFinanseInlineKeboard() {
    return {
      reply_markup: {
        inline_keyboard: finanseMenuItems.map((item) => [item]),
      },
    };
  }

  handle(cbName: string) {
    let action = '';
    switch (cbName) {
      case FinanseMenuCallbacks.POTENTIAL:
        action = LocaleFinanseMenu.POTENTIAL;
        break;
      case FinanseMenuCallbacks.PERSPECTIVE:
        action = FinanseMenuCallbacks.PERSPECTIVE;
        break;
      case FinanseMenuCallbacks.RECOMENDATIONS:
        action = FinanseMenuCallbacks.RECOMENDATIONS;
        break;
      case FinanseMenuCallbacks.RISK:
        action = FinanseMenuCallbacks.RISK;
        break;
      case FinanseMenuCallbacks.PLAINING:
        action = FinanseMenuCallbacks.PLAINING;
        break;
      default:
        break;
    }
    return action;
  }
}
