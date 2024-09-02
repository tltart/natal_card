import TelegramBot from 'node-telegram-bot-api';
import { MainMenu } from '../constants/menu';
import { sendPredictMenu } from './predict/predictMenu';
import { sendAnalyzePersonMenu } from './analyzePerson/sendAnalyzePesronMenu';
import { sendCompatibilityMenu } from './compatibility/sendCompatibilityMenu';
import { sendProfessionMenu } from './profession/sendProfessionMenu';
import { sendFinanseMenu } from './finanse/sendFinanseMenu';
import { sendHealthMenu } from './health/sendHealthMenu';
import { sendLifeCyclesMenu } from './lifeCycles/sendLifeCyclesMenu';
import { sendPersonEvolutionMenu } from './personEvolution/sendPersonEvolutionMenu';

export const handleMainMenu = async (
  bot: TelegramBot,
  chatId: number,
  cbName: string,
) => {
  switch (cbName) {
    case MainMenu.PREDICT:
      await sendPredictMenu(bot, chatId);
      break;
    case MainMenu.ANALYZE_PERSON:
      await sendAnalyzePersonMenu(bot, chatId);
      break;
    case MainMenu.COMPATIBILITY:
      await sendCompatibilityMenu(bot, chatId);
      break;
    case MainMenu.PROFESSION:
      await sendProfessionMenu(bot, chatId);
      break;
    case MainMenu.FINANSE_ANALYZE:
      await sendFinanseMenu(bot, chatId);
      break;
    case MainMenu.HEALTH_RECOMENDATIONS:
      await sendHealthMenu(bot, chatId);
      break;
    case MainMenu.LIFE_CYCLES:
      await sendLifeCyclesMenu(bot, chatId);
      break;
    case MainMenu.PERSON_EVOLUTION:
      await sendPersonEvolutionMenu(bot, chatId);
      break;

    default:
      break;
  }
};
