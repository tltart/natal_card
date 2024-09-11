import { Injectable } from '@nestjs/common';
import {
  HealthMenuCallbacks,
  LocaleHealthMenu,
  healthMenuItems,
} from '../itemsMenu/healthMenu';

@Injectable()
export class HealthMenuService {
  getSubMenuFinanseInlineKeboard() {
    return {
      reply_markup: {
        inline_keyboard: healthMenuItems.map((item) => [item]),
      },
    };
  }

  handle(cbName: string) {
    let action = '';
    switch (cbName) {
      case HealthMenuCallbacks.ASTROLOGY_HEALTH:
        action = LocaleHealthMenu.ASTROLOGY_HEALTH;
        break;
      case HealthMenuCallbacks.RECOVERY_PERIOD:
        action = LocaleHealthMenu.RECOVERY_PERIOD;
        break;
      case HealthMenuCallbacks.WELFARE_EMOTION:
        action = LocaleHealthMenu.WELFARE_EMOTION;
        break;
      case HealthMenuCallbacks.FOOD_RECOMENDATION:
        action = LocaleHealthMenu.FOOD_RECOMENDATION;
        break;
      case HealthMenuCallbacks.PHISYC_SPORT:
        action = LocaleHealthMenu.PHISYC_SPORT;
        break;
      default:
        break;
    }
    return action;
  }
}
