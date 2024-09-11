import { Injectable, OnModuleInit } from '@nestjs/common';
import { mainMenuItems, MainMenuCallbacks, LocaleMainMenu } from './itemsMenu/itemsMainMenu';
import { PredictMenuService } from './predictMenu/predictMenu';
import { LocalePredictMenu } from './itemsMenu/predictMenu';
import { LocaleAnalyzePersonMenu } from './itemsMenu/analyzePersonMenu';
import { AnalyzePersonMenuService } from './analyzePersonMenu/analyzePersonMenu';
import { CompatibilityMenuService } from './compatibilityMenu/compatibilityMenu';
import { LocaleCompatibilityMenu } from './itemsMenu/compatibilityMenu';
import { ProfessionMenuService } from './professionMenu/professionMenu';
import { LocaleProfessionMenu } from './itemsMenu/profissionMenu';
import { LocaleFinanseMenu } from './itemsMenu/finanseMenu';
import { FinanseMenuService } from './finanseMenu/finanseMenu';
import { HealthMenuService } from './healthMenu/healthMenu';
import { LocaleHealthMenu } from './itemsMenu/healthMenu';
import { ActionMenuService } from './actionMenu/actionMenu';

@Injectable()
export class MenuService implements OnModuleInit {
  constructor(
    private readonly predictMenu: PredictMenuService,
    private readonly analyzePersonMenu: AnalyzePersonMenuService,
    private readonly compatibilityMenu: CompatibilityMenuService,
    private readonly professionMenu: ProfessionMenuService,
    private readonly finanseMenu: FinanseMenuService,
    private readonly healthMenu: HealthMenuService,
    private readonly actionMenu: ActionMenuService,
  ) {}

  async onModuleInit() {
    console.log('Menu service init');
  }

  getMainMenuKeboard() {
    return {
      reply_markup: {
        keyboard: mainMenuItems.map((item) => [item]),
      },
    };
  }

  getMainMenuInlineKeboard() {
    return {
      reply_markup: {
        inline_keyboard: mainMenuItems.map((item) => [item]),
      },
    };
  }

  getUserDataActionMenu() {
    return this.actionMenu.getMenuUserDataActionInlineKeboard();
  }

  handleAllSubMenus(cbName: string) {
    const action =
      this.predictMenu.handle(cbName) ||
      this.analyzePersonMenu.handle(cbName) ||
      this.compatibilityMenu.handle(cbName) ||
      this.professionMenu.handle(cbName) ||
      this.finanseMenu.handle(cbName) ||
      this.healthMenu.handle(cbName) ||
      this.actionMenu.handle(cbName);
    return action;
  }

  handle(cbName: string): {
    title: string | null;
    keyboard: ReturnType<typeof this.getMainMenuInlineKeboard> | null;
  } {
    const nextMenu = { title: null, keyboard: null } as {
      title: string | null;
      keyboard: ReturnType<MenuService['getMainMenuInlineKeboard']> | null;
    };

    switch (cbName) {
      case MainMenuCallbacks.MAIN_MENU:
        nextMenu.title = LocaleMainMenu.MAIN_MENU;
        nextMenu.keyboard = this.getMainMenuInlineKeboard();
        break;
      case MainMenuCallbacks.PREDICT:
        nextMenu.title = LocalePredictMenu.PREDICT;
        nextMenu.keyboard = this.predictMenu.getPredictMenuInlineKeboard();
        break;
      case MainMenuCallbacks.ANALYZE_PERSON:
        nextMenu.title = LocaleAnalyzePersonMenu.ANALYZE_PERSON;
        nextMenu.keyboard = this.analyzePersonMenu.getSubMenuAnalyzePersonInlineKeboard();
        break;
      case MainMenuCallbacks.COMPATIBILITY:
        nextMenu.title = LocaleCompatibilityMenu.COMPATIBILITY;
        nextMenu.keyboard = this.compatibilityMenu.getSubMenuCompatibilityInlineKeboard();
        break;
      case MainMenuCallbacks.PROFESSION:
        nextMenu.title = LocaleProfessionMenu.PROFESSION_MENU;
        nextMenu.keyboard = this.professionMenu.getSubMenuProfessionInlineKeboard();
        break;
      case MainMenuCallbacks.FINANSE_ANALYZE:
        nextMenu.title = LocaleFinanseMenu.FINANSE_MENU;
        nextMenu.keyboard = this.finanseMenu.getSubMenuFinanseInlineKeboard();
        break;
      case MainMenuCallbacks.HEALTH_RECOMENDATIONS:
        nextMenu.title = LocaleHealthMenu.HEALTH_MENU;
        nextMenu.keyboard = this.healthMenu.getSubMenuFinanseInlineKeboard();
        break;
      default:
        break;
    }
    return nextMenu;
  }
}
