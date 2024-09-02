import fs from 'node:fs';
import path from 'node:path';
import TelegramBot from 'node-telegram-bot-api';

export const sendMessageCreateCard = async ({
  bot,
  chatId,
}: {
  bot: TelegramBot;
  chatId: number;
}) => {
  await bot.sendMessage(chatId, 'Идет построение натальной карты...');

  const filePath = path.resolve(
    __dirname,
    '../../..',
    'static/space-stars.gif',
  );
  const buff = fs.readFileSync(filePath);
  await bot.sendAnimation(chatId, buff);
};
