import TelegramBot from 'node-telegram-bot-api';

export const GetCard = async ({
  bot,
  chatId,
  cbName,
}: {
  bot: TelegramBot;
  chatId: number;
  cbName: string;
}) => {
  await bot.sendMessage(
    chatId,
    `✅ Вы выбрали карту <b>${cbName.split('-')[2]}</b> ✅\nЧто нужно сделать?`,
    { parse_mode: 'HTML' },
  );
};
