import { Injectable } from '@nestjs/common';
import {
  AnalyzePersonMenuCallbacks,
  LocaleAnalyzePersonMenu,
  analyzePersontMenuItems,
} from '../itemsMenu/analyzePersonMenu';

@Injectable()
export class AnalyzePersonMenuService {
  getSubMenuAnalyzePersonInlineKeboard() {
    return {
      reply_markup: {
        inline_keyboard: analyzePersontMenuItems.map((item) => [item]),
      },
    };
  }

  handle(cbName: string) {
    let action = '';
    switch (cbName) {
      case AnalyzePersonMenuCallbacks.CHARACTER_TRAITS:
        action = LocaleAnalyzePersonMenu.CHARACTER_TRAITS;
        break;
      case AnalyzePersonMenuCallbacks.STRENGTHS_WEAKNESSES:
        action = LocaleAnalyzePersonMenu.STRENGTHS_WEAKNESSES;
        break;
      case AnalyzePersonMenuCallbacks.PSYCHOLOGICAL_PROFILE:
        action = LocaleAnalyzePersonMenu.PSYCHOLOGICAL_PROFILE;
        break;
      default:
        break;
    }
    return action;
  }
}
