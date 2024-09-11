import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GptModule } from 'src/gpt/gpt.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { MenuModule } from 'src/Menu/menu.module';
import { UserModule } from 'src/users/user.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [
    MenuModule,
    GptModule,
    UserModule,
    ChatModule,
    ClientsModule.register([
      {
        name: 'GPT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 7766,
        },
      },
    ]),
  ],
  providers: [BotService, PrismaService],
})
export class BotModule {}
