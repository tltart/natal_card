import TelegramBot from 'node-telegram-bot-api';
import { sendBirthDate } from '../Stages/sendBirthDate';
import { IUserData } from '../Stages/checkCompletedStage';
import { sendBirthTime } from '../Stages/sendBirthTime';
import { sendBirthPlace } from '../Stages/sendBirthPlace';
import { UpdatedProperty } from '../constants/updatedProperty';
import { Stages } from '../constants/questionsStatus';
import { sendMessageCreateCard } from '../Stages/createCard';
import { sendCardName } from '../Stages/sendCardName';

export const updateBirthData = async ({
  bot,
  chatId,
  userStates,
  userData,
  messageData,
}: {
  bot: TelegramBot;
  chatId: number;
  userStates: Map<number, Stages>;
  action?: 'create' | 'update';
  userData: Map<number, IUserData>;
  messageData: UpdatedProperty;
}) => {
  if (messageData === UpdatedProperty.CREATE_BIRTH_DATA) {
    userData.set(chatId, null);
    userStates.set(chatId, Stages.AWAITING_BIRTH_NAME);
    await sendCardName({
      bot,
      chatId,
      userStates: userStates,
      userData: userData,
    });
    return false;
  }
  if (messageData === UpdatedProperty.UPDATE_BIRTH_DATA) {
    bot.sendMessage(chatId, 'Подтвердить/Изменить', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Изменить имя',
              callback_data: UpdatedProperty.UPDATE_BIRTH_NAME,
            },
            {
              text: 'Изменить дату',
              callback_data: UpdatedProperty.UPDATE_BIRTH_DATE,
            },
          ],
          [
            {
              text: 'Изменить время',
              callback_data: UpdatedProperty.UPDATE_BIRTH_TIME,
            },
          ],
          [
            {
              text: 'Изменить место',
              callback_data: UpdatedProperty.UPDATE_BIRTH_PLACE,
            },
          ],
          [
            {
              text: 'Подтвердить',
              callback_data: UpdatedProperty.ACCEPT_BIRTH_DATA,
            },
          ],
        ],
      },
    });
  }
  if (messageData === UpdatedProperty.UPDATE_BIRTH_NAME) {
    await sendCardName({
      bot,
      chatId,
      userStates: userStates,
      action: 'update',
      userData: userData,
    });
    return false;
  } else if (messageData === UpdatedProperty.UPDATE_BIRTH_DATE) {
    await sendBirthDate({
      bot,
      chatId,
      userStates: userStates,
      action: 'update',
      userData: userData,
    });
    return false;
  } else if (messageData === UpdatedProperty.UPDATE_BIRTH_TIME) {
    await sendBirthTime({
      bot,
      chatId,
      userStates: userStates,
      action: 'update',
      userData: userData,
    });
    return false;
  } else if (messageData === UpdatedProperty.UPDATE_BIRTH_PLACE) {
    await sendBirthPlace({
      bot,
      chatId,
      userStates: userStates,
      action: 'update',
      userData: userData,
    });
    return false;
  } else if (messageData === UpdatedProperty.ACCEPT_BIRTH_DATA) {
    if (
      userData.get(chatId).birthDate &&
      userData.get(chatId).birthTime &&
      userData.get(chatId).birthPlace
    ) {
      await sendMessageCreateCard({ bot, chatId });
      return true;
    }
    throw new Error();
  }
};
