import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IUserData } from './interfaces/userData';
import { UserDataStages } from './interfaces/dataStages';
import { ChatService } from 'src/chat/chat.service';
import { Messages } from 'src/messages/messages';
import { isValidDate } from 'src/shared/checkDate';
import { isValidTime } from 'src/shared/checkTime';
import { ErrorsEnum } from 'src/errors/errorsEnum';
import { getZodiacSign } from '../shared/zodiacCalculate';

@Injectable()
export class UserService implements OnModuleInit {
  private _userData: Map<number, IUserData> = new Map();

  private _userStageData: Map<number, keyof typeof UserDataStages | ''> = new Map();

  private _isUpdatedData: Map<number, boolean> = new Map();

  public get isUpdatedData(): Map<number, boolean> {
    return this._isUpdatedData;
  }

  public set isUpdatedData({ chatId, value }: { chatId: number; value: boolean }) {
    this._isUpdatedData.set(chatId, value);
  }

  constructor(
    private readonly prisma: PrismaService,
    private readonly chatService: ChatService,
  ) {}

  public getUserData(chatId: number): IUserData {
    return this._userData.get(chatId);
  }

  dropUserData(chatId: number) {
    this.userData = { chatId, value: { id: null } };
    this.userData = { chatId, value: { name: null } };
    this.userData = { chatId, value: { birthDate: null } };
    this.userData = { chatId, value: { zodiac: null } };
    this.userData = { chatId, value: { birthTime: null } };
    this.userData = { chatId, value: { birthPlace: null } };
  }

  dropUserStageData(chatId: number) {
    this._userStageData.set(chatId, '');
  }

  public set userData({ chatId, value }: { chatId: number; value: Partial<IUserData> }) {
    if ('name' in value) {
      this._userData.set(chatId, { ...this._userData.get(chatId), name: value.name });
    }
    if ('birthDate' in value) {
      this._userData.set(chatId, { ...this._userData.get(chatId), birthDate: value.birthDate });
    }
    if ('zodiac' in value) {
      this._userData.set(chatId, { ...this._userData.get(chatId), zodiac: value.zodiac });
    }
    if ('birthTime' in value) {
      this._userData.set(chatId, { ...this._userData.get(chatId), birthTime: value.birthTime });
    }
    if ('birthPlace' in value) {
      this._userData.set(chatId, { ...this._userData.get(chatId), birthPlace: value.birthPlace });
    }
  }

  async onModuleInit() {
    console.log('Chat service init');
  }

  checkFullUserData(chatId: number) {
    const user = this.getUserData(chatId);
    if (user?.name && user?.birthDate && user?.birthTime && user?.birthPlace) return true;
    return false;
  }

  async createUser(chatId: number) {
    const chat = await this.prisma.chat.findFirst({ where: { chatId } });
    const user = await this.prisma.user.findFirst({ where: { chatId: chat.id } });
    if (user) throw new Error(ErrorsEnum.EXSIR_USER);
    return this.prisma.user.create({
      data: {
        name: this._userData.get(chatId).name,
        birthDate: this._userData.get(chatId).birthDate,
        birthTime: this._userData.get(chatId).birthTime,
        birthPlace: this._userData.get(chatId).birthPlace,
        chatId: chat.id,
      },
    });
  }

  async updateUser(chatId: number) {
    const chat = await this.prisma.chat.findFirst({ where: { chatId } });
    return this.prisma.user.updateMany({
      data: {
        name: this._userData.get(chatId).name,
        birthDate: this._userData.get(chatId).birthDate,
        birthTime: this._userData.get(chatId).birthTime,
        birthPlace: this._userData.get(chatId).birthPlace,
      },
      where: { chatId: chat.id },
    });
  }

  async deleteUser(chatId: number) {
    const chat = await this.prisma.chat.findFirst({ where: { chatId } });
    return this.prisma.user.deleteMany({
      where: { chatId: chat.id },
    });
  }

  async findUsersByChatId(chatId: number) {
    const chat = await this.chatService.findChatByChatId(chatId);
    return this.prisma.findUsersByChatId(chat.id);
  }

  async updateLastTimeReport(userId: number) {
    return this.prisma.user.updateMany({
      data: {
        lastReport: new Date().toISOString(),
      },
      where: { id: userId },
    });
  }

  async getLastTimeReportsLessThen(date: string) {
    return this.prisma.user.findMany({ where: { lastReport: { lt: new Date(date) } } });
  }

  async checkUserData(chatId: number) {
    if (this.checkFullUserData(chatId)) {
      const userInDb = await this.findUsersByChatId(chatId);
      if (userInDb) {
        this._userData.set(chatId, {
          id: userInDb[0].id,
          birthDate: userInDb[0].birthDate,
          birthPlace: userInDb[0].birthPlace,
          birthTime: userInDb[0].birthTime,
          name: userInDb[0].name,
          zodiac: getZodiacSign(userInDb[0].birthDate),
        });
        return true;
      }
      const user = await this.createUser(chatId);
      this.userData = { chatId, value: { id: user.id } };
      return true;
    }
    return false;
  }

  async checkStageUserData({ chatId, text }: { chatId: number; text?: string }) {
    if (!this._userData.get(chatId)?.name && !this._userStageData?.get(chatId)) {
      this._userStageData.set(chatId, UserDataStages.AWAITING_BIRTH_NAME);
      return Messages.ENTER_NAME;
    } else if (!this._userData.get(chatId)?.birthDate && this._userStageData.get(chatId) === UserDataStages.AWAITING_BIRTH_NAME && text) {
      this.userData = { chatId, value: { name: text } };
      this._userStageData.set(chatId, UserDataStages.AWAITING_BIRTH_DATE);
      return Messages.ENTER_DATE;
    } else if (!this._userData.get(chatId)?.birthTime && this._userStageData.get(chatId) === UserDataStages.AWAITING_BIRTH_DATE) {
      if (!text || !isValidDate(text)) {
        return Messages.WRONG_DATA;
      }
      this.userData = { chatId, value: { birthDate: text } };
      this.userData = { chatId, value: { zodiac: getZodiacSign(text) } };
      this._userStageData.set(chatId, UserDataStages.AWAITING_BIRTH_TIME);
      return Messages.ENTER_TIME;
    } else if (!this._userData.get(chatId)?.birthPlace && this._userStageData.get(chatId) === UserDataStages.AWAITING_BIRTH_TIME) {
      if (!isValidTime(text)) {
        return Messages.WRONG_DATA;
      }
      this.userData = { chatId, value: { birthTime: text } };
      this._userStageData.set(chatId, UserDataStages.AWAITING_BIRTH_PLACE);
      return Messages.ENTER_PLACE;
    } else if (!this._userData.get(chatId)?.birthPlace && this._userStageData.get(chatId) === UserDataStages.AWAITING_BIRTH_PLACE) {
      this.userData = { chatId, value: { birthPlace: text } };
      this._userStageData.set(chatId, '');
      return;
    } else if (this._userStageData.get(chatId).length) {
      return Messages.WRONG_DATA;
    }
    throw new Error('UNKNOWN STAGE USER DATA');
  }
}
