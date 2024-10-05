import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { PredictMenuService } from './predictMenu/predictMenu';
import { AnalyzePersonMenuService } from './analyzePersonMenu/analyzePersonMenu';
import { CompatibilityMenuService } from './compatibilityMenu/compatibilityMenu';
import { ProfessionMenuService } from './professionMenu/professionMenu';
import { FinanseMenuService } from './finanseMenu/finanseMenu';
import { HealthMenuService } from './healthMenu/healthMenu';
import { ActionMenuService } from './actionMenu/actionMenu';
import { GoroscopeMenuService } from './goroscopeMenu/goroscopeMenu';

@Module({
  providers: [
    MenuService,
    PredictMenuService,
    AnalyzePersonMenuService,
    CompatibilityMenuService,
    ProfessionMenuService,
    FinanseMenuService,
    HealthMenuService,
    ActionMenuService,
    GoroscopeMenuService,
  ],
  exports: [MenuService],
})
export class MenuModule {}
