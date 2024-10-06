import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ScheduleModule } from '@nestjs/schedule';
import { BotModule } from './bot/bot.module';
import { GptModule } from './gpt/gpt.module';
import { ConfigModule } from '@nestjs/config';
import { MenuModule } from './Menu/menu.module';
import { GoroscopeModule } from './goroscope/goroscope.module';
import { TasksModule } from './cron/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    GptModule,
    BotModule,
    MenuModule,
    GoroscopeModule,
    TasksModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
