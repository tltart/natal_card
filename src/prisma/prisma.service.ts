import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async findChatByChatId(chatId: number) {
    return this.chat.findFirst({ where: { chatId } });
  }

  async createChatByChatId(chatId: number) {
    return this.chat.create({ data: { chatId } });
  }

  async createCountReport({
    chatId,
    countReportDay,
    dayLimit,
  }: {
    chatId: number;
    countReportDay: number;
    dayLimit: number;
  }) {
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
    return this.target.findFirst({
      where: {
        name,
        chatId,
      },
    });
  }

  async createTarget(
    chatId: number,
    birthDate: string,
    birthTime: string,
    birthPlace: string,
    name: string,
  ) {
    return this.target.create({
      data: {
        chatId,
        birthDate,
        birthTime,
        birthPlace: birthPlace.toUpperCase(),
        name,
      },
    });
  }

  async createNatalCard(chatId: number, text: string, targetId: number) {
    return this.natalCards.create({
      data: {
        chatId,
        text,
        targetId,
      },
    });
  }

  async findTargetByPlaceAndDate(birthDate: string, birthPlace: string) {
    return this.target.findFirst({
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
        target: true,
      },
    });
  }

  // async enableShutdownHooks(app: INestApplication) {
  //   this.$on('', async () => {
  //     await app.close();
  //   });
  // }
}
