import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    console.log('Chat service init');
  }

  async findChatByChatId(chatId: number) {
    return this.prisma.findChatByChatId(chatId);
  }

  async createNewChat(chatId: number) {
    return this.prisma.chat.create({
      data: {
        chatId,
      },
    });
  }
}
