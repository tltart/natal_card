import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IUserData } from './interfaces/userData';
import { UserDataStages } from './interfaces/dataStages';
import { ChatService } from 'src/chat/chat.service';
import { Messages } from 'src/messages/messages';
import { isValidDate } from 'src/utils/checkDate';
import { isValidTime } from 'src/utils/checkTime';

@Injectable()
export class UserService implements OnModuleInit {
  private _userData: IUserData = {
    name: null,
    birthDate: null,
    birthPlace: null,
    birthTime: null,
    accepted: false,
  };

  private _userStageData: keyof typeof UserDataStages | '';

  public get userStageData() {
    return this._userStageData;
  }
  public set userStageData(stage: keyof typeof UserDataStages | '') {
    this._userStageData = stage;
  }

  constructor(
    private readonly prisma: PrismaService,
    private readonly chatSerice: ChatService,
  ) {}

  public get userData(): IUserData {
    return this._userData;
  }

  dropUserData() {
    this._userData.name = null;
    this._userData.birthDate = null;
    this._userData.birthPlace = null;
    this._userData.birthTime = null;
  }

  dropUserStageData() {
    this._userStageData = '';
  }

  public set userData(value: IUserData) {
    if (value.name) {
      this._userData.name = value.name;
    }
    if (value.birthDate) {
      this._userData.birthDate = value.birthDate;
    }
    if (value.birthTime) {
      this._userData.birthTime = value.birthTime;
    }
    if (value.birthPlace) {
      this._userData.birthPlace = value.birthPlace;
    }
  }

  async onModuleInit() {
    console.log('Chat service init');
  }

  checkFullUserData() {
    if (this.userData.name && this.userData.birthDate && this.userData.birthTime && this.userData.birthPlace) return true;
    return false;
  }

  async createUser(chatId: number) {
    const chat = await this.prisma.chat.findFirst({ where: { chatId } });
    return this.prisma.user.create({
      data: {
        name: this.userData.name,
        birthDate: this.userData.birthDate,
        birthTime: this.userData.birthTime,
        birthPlace: this.userData.birthPlace,
        chatId: chat.id,
      },
    });
  }

  async findUsersByChatId(chatId: number) {
    const chat = await this.chatSerice.findChatByChatId(chatId);
    return this.prisma.findUsersByChatId(chat.id);
  }

  async checkUserData(chatId: number) {
    if (this.checkFullUserData()) {
      const userInDb = await this.findUsersByChatId(chatId);
      if (userInDb) {
        this.userData = userInDb[0];
        return true;
      }
      await this.createUser(chatId);
      return true;
    }
    return false;
  }

  async checkStageUserData(text?: string) {
    if (!this.userData.name && !this.userStageData) {
      this.userStageData = UserDataStages.AWAITING_BIRTH_NAME;
      return Messages.ENTER_NAME;
    } else if (!this.userData.birthDate && this.userStageData === UserDataStages.AWAITING_BIRTH_NAME) {
      this.userData.name = text;
      this.userStageData = UserDataStages.AWAITING_BIRTH_DATE;
      return Messages.ENTER_DATE;
    } else if (!this.userData.birthTime && this.userStageData === UserDataStages.AWAITING_BIRTH_DATE) {
      if (!text || !isValidDate(text)) {
        return Messages.WRONG_DATA;
      }
      this.userData.birthDate = text;
      this.userStageData = UserDataStages.AWAITING_BIRTH_TIME;
      return Messages.ENTER_TIME;
    } else if (!this.userData.birthPlace && this.userStageData === UserDataStages.AWAITING_BIRTH_TIME) {
      if (!isValidTime(text)) {
        return Messages.WRONG_DATA;
      }
      this.userData.birthTime = text;
      this.userStageData = UserDataStages.AWAITING_BIRTH_PLACE;
      return Messages.ENTER_PLACE;
    } else if (!this.userData.birthPlace && this.userStageData === UserDataStages.AWAITING_BIRTH_PLACE) {
      this.userData.birthPlace = text;
      this.userStageData = '';
      await this.sendInlineMenuToBot({
        chatId,
        title: `Вы ввели данные:\n\n\<b>🏷 Имя:</b> ${this.userData.name}\n<b>📆 Дата рождения:</b> ${this.userData.birthDate}\n<b>⏰ Время рождения:</b> ${this.userData.birthTime}\n<b>🌏 Место рождения:</b> ${this.userService.userData.birthPlace}`,
        menu: this.mainMenuService.getUserDataActionMenu(),
      });
      return Messages.ENTER_PLACE;
    }
    throw new Error('UNKNOWN STAGE USER DATA');
  }
}
