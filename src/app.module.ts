import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { BotModule } from './bot/bot.module';
import { GptModule } from './gpt/gpt.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BotModule,
    GptModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
