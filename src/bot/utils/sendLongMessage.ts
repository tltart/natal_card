import TelegramBot from 'node-telegram-bot-api';

export const sendLongMessage = async (
  bot: TelegramBot,
  chatId: number,
  message: string,
) => {
  function splitMessage(message: string, maxLength: number) {
    const messages = [];
    for (let i = 0; i < message.length; i += maxLength) {
      messages.push(message.slice(i, i + maxLength));
    }
    return messages;
  }

  const parts = splitMessage(message, 4000);

  for (const part of parts) {
    await bot.sendMessage(chatId, part);
  }
};
