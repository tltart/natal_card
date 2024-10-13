import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async findUsersByChatId(chatId: number) {
    return this.user.findMany({ where: { chatId } });
  }

  async findChatByChatId(chatId: number) {
    return this.chat.findFirst({ where: { chatId } });
  }

  async createChatByChatId(chatId: number) {
    return this.chat.create({ data: { chatId } });
  }

  async createCountReport({ chatId, countReportDay, dayLimit }: { chatId: number; countReportDay: number; dayLimit: number }) {
    return this.countReports.create({
      data: { chatId, countReportDay, dayLimit },
    });
  }

  async incrementCountReportByDay(chatId: number) {
    return this.countReports.update({
      where: { chatId },
      data: {
        countReportDay: {
          increment: 1,
        },
      },
    });
  }

  async findCountReportByChatId(chatId: number) {
    return this.countReports.findFirst({ where: { chatId } });
  }

  async findTargetbyNameAndChatId(chatId: number, name: string) {
    return this.user.findFirst({
      where: {
        name,
        chatId,
      },
    });
  }

  async createTarget(chatId: number, birthDate: string, birthTime: string, birthPlace: string, name: string) {
    return this.user.create({
      data: {
        chatId,
        birthDate,
        birthTime,
        birthPlace: birthPlace.toUpperCase(),
        name,
      },
    });
  }

  async createNatalCard(chatId: number, text: string, userId: number) {
    return this.natalCards.create({
      data: {
        chatId,
        text,
        userId,
      },
    });
  }

  async findTargetByPlaceAndDate(birthDate: string, birthPlace: string) {
    return this.user.findFirst({
      where: {
        birthDate,
        birthPlace: birthPlace.toUpperCase(),
      },
      include: {
        NatalCards: true,
      },
    });
  }

  async findNatalCardById(id: number) {
    return this.natalCards.findUnique({ where: { id } });
  }

  async findAllCardsByChatId(chatId: number) {
    return this.chat.findFirst({
      where: { chatId },
      include: {
        User: true,
      },
    });
  }

  async findGoroscopeBySignAndDay(sign: string, day: 'today' | 'tommorow') {
    const select = day === 'today' ? { today: true, updatedToday: true } : { tommorow: true, updatedTommorow: true };
    const goroscope = await this.goroscopes.findFirst({ where: { sign }, select });
    return goroscope;
  }

  async findAllGoroscopesByDay(day: 'today' | 'tommorow') {
    const select = day === 'today' ? { sign: true, today: true, updatedToday: true } : { sign: true, tommorow: true, updatedTommorow: true };
    const goroscope = await this.goroscopes.findMany({ select });
    return goroscope;
  }

  async createGoroscope({ sign, day, text }: { sign: string; day: 'today' | 'tommorow'; text: string }) {
    const data: {
      sign: string;
      today?: string;
      updatedToday?: string;
      tommorow?: string;
      updatedTommorow?: string;
    } = { sign };

    if (day === 'today') {
      data.today = text;
      data.updatedToday = new Date().toISOString();
    } else {
      data.tommorow = text;
      data.updatedTommorow = new Date().toISOString();
    }

    return this.goroscopes.create({
      data,
    });
  }

  async updateGoroscope({ sign, day, text }: { sign: string; day: 'today' | 'tommorow'; text: string }) {
    const data: {
      sign: string;
      today?: string;
      updatedToday?: string;
      tommorow?: string;
      updatedTommorow?: string;
    } = { sign };

    if (day === 'today') {
      data.today = text;
      data.updatedToday = new Date().toISOString();
    } else {
      data.tommorow = text;
      data.updatedTommorow = new Date().toISOString();
    }

    return this.goroscopes.update({
      where: { sign },
      data,
    });
  }

  async reverseGoroscopeDay() {
    const goroscopesTommorow = await this.goroscopes.findMany();
    await Promise.all(
      goroscopesTommorow.map((el, idx) => {
        return this.goroscopes.update({
          where: {
            sign: el.sign,
          },
          data: {
            today: goroscopesTommorow[idx].tommorow,
            tommorow: null,
          },
        });
      }),
    );
  }

  async findLunarPhaseByDay(date: Date) {
    const startOfDay = new Date(`${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}T00:00:00.000Z`);
    const endOfDay = new Date(`${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}T23:59:59.999Z`);
    
    return this.lunar.findFirst({
      where: {
        day: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
  }

  async findLunarPhaseByWeek(date: Date) {
    const startOfWeek = new Date(date);
    const endOfWeek = new Date(date);
    
    const dayOfWeek = startOfWeek.getDay();
  
    const diffToMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
    const diffToSunday = 7 - dayOfWeek;
  
    startOfWeek.setDate(startOfWeek.getDate() - diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);
  
    endOfWeek.setDate(endOfWeek.getDate() + diffToSunday - 1);
    endOfWeek.setHours(23, 59, 59, 999);
    
    return this.lunar.findMany({
      where: {
        day: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
    });
  }

  // async enableShutdownHooks(app: INestApplication) {
  //   this.$on('', async () => {
  //     await app.close();
  //   });
  // }
}
