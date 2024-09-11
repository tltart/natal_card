import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { BotModule } from './bot/bot.module';
import { GptModule } from './gpt/gpt.module';
import { ConfigModule } from '@nestjs/config';
import { MenuModule } from './Menu/menu.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GptModule,
    BotModule,
    MenuModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
