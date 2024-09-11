import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NatalCardService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    console.log('NatalCard service init');
  }

  async getAllCardsByChatId(chatId: number) {
    return this.prisma.findAllCardsByChatId(chatId);
  }
}
