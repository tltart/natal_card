import { Injectable } from '@nestjs/common';
import {
  LocalePredictMenu,
  PredictMenuCallbacks,
  predictMenuItems,
} from '../itemsMenu/predictMenu';

@Injectable()
export class PredictMenuService {
  getPredictMenuInlineKeboard() {
    return {
      reply_markup: {
        inline_keyboard: predictMenuItems.map((item) => [item]),
      },
    };
  }

  handle(cbName: string) {
    let action = '';
    switch (cbName) {
      case PredictMenuCallbacks.PREDICT_DAY_TODAY:
        action = LocalePredictMenu.PREDICT_DAY_TODAY;
        break;
      case PredictMenuCallbacks.PREDICT_DAY_NEXT:
        action = LocalePredictMenu.PREDICT_DAY_NEXT;
        break;
      case PredictMenuCallbacks.PREDICT_WEEK_CURRENT:
        action = LocalePredictMenu.PREDICT_WEEK_CURRENT;
        break;
      case PredictMenuCallbacks.PREDICT_WEEK_NEXT:
        action = LocalePredictMenu.PREDICT_WEEK_NEXT;
        break;
      case PredictMenuCallbacks.PREDICT_MONTH_CURRENT:
        action = LocalePredictMenu.PREDICT_MONTH_CURRENT;
        break;
      case PredictMenuCallbacks.PREDICT_MONTH_NEXT:
        action = LocalePredictMenu.PREDICT_MONTH_NEXT;
        break;
      case PredictMenuCallbacks.PREDICT_YEAR_CURRENT:
        action = LocalePredictMenu.PREDICT_YEAR_CURRENT;
        break;
      case PredictMenuCallbacks.PREDICT_YEAR_NEXT:
        action = LocalePredictMenu.PREDICT_YEAR_NEXT;
        break;
      default:
        break;
    }
    return action;
  }
}
