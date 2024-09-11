import { Injectable } from '@nestjs/common';
import {
  ProfessionMenuCallbacks,
  LocaleProfessionMenu,
  professionMenuItems,
} from '../itemsMenu/profissionMenu';

@Injectable()
export class ProfessionMenuService {
  getSubMenuProfessionInlineKeboard() {
    return {
      reply_markup: {
        inline_keyboard: professionMenuItems.map((item) => [item]),
      },
    };
  }

  handle(cbName: string) {
    let action = '';
    switch (cbName) {
      case ProfessionMenuCallbacks.RECOMENDATIONS:
        action = LocaleProfessionMenu.RECOMENDATIONS;
        break;
      case ProfessionMenuCallbacks.POTENTIAL:
        action = LocaleProfessionMenu.POTENTIAL;
        break;
      case ProfessionMenuCallbacks.TALANT:
        action = LocaleProfessionMenu.TALANT;
        break;
      case ProfessionMenuCallbacks.STABILITY:
        action = LocaleProfessionMenu.STABILITY;
        break;
      case ProfessionMenuCallbacks.CARIER_STEP:
        action = LocaleProfessionMenu.CARIER_STEP;
        break;
      default:
        break;
    }
    return action;
  }
}
