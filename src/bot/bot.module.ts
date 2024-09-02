import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GptModule } from 'src/gpt/gpt.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    GptModule,
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
