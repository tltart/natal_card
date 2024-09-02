import TelegramBot from 'node-telegram-bot-api';
import { IUserData } from './checkCompletedStage';

export const sendBirthData = async ({
  bot,
  chatId,
  userData,
}: {
  bot: TelegramBot;
  chatId: number;
  userData: Map<number, IUserData>;
}) => {
  await bot.sendMessage(chatId, '<b>Проверьте введенные данные</b>', {
    parse_mode: 'HTML',
  });
  await bot.sendMessage(
    chatId,
    `Вы ввели данные:\n\n\<b>🏷 Имя:</b> ${userData.get(chatId).cardName}\n<b>📆 Дата рождения:</b> ${userData.get(chatId).birthDate}\n<b>⏰ Время рождения:</b> ${userData.get(chatId).birthTime}\n<b>🌏Место рождения:</b> ${userData.get(chatId).birthPlace}`,
    { parse_mode: 'HTML' },
  );
  bot.sendMessage(chatId, 'Подтвердить/Изменить', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Подтвердить',
            callback_data: 'accept_birth_data',
          },
        ],
        [
          {
            text: 'Изменить',
            callback_data: 'update_birth_data',
          },
        ],
      ],
    },
  });
};
