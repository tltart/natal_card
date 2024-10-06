import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GoroscopeService } from 'src/goroscope/goroscope.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { LocaleZodiac } from 'src/users/interfaces/userData';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly goroscopeService: GoroscopeService,
    private readonly prisma: PrismaService,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleCron() {
    const goroscopes = await this.prisma.findAllGoroscopesByDay('today');
    const lastUpdate = new Date(goroscopes[0].updatedToday);
    const now = new Date();
    if (lastUpdate.getFullYear() !== now.getFullYear() || lastUpdate.getMonth() !== now.getMonth() || lastUpdate.getDate() !== now.getDate()) {
      await Promise.all(
        Object.values(LocaleZodiac).map((sign) => {
          return this.prisma.updateGoroscope({ sign, day: 'today', text: null });
        }),
      );
      await Promise.all(
        Object.values(LocaleZodiac).map((sign) => {
          return this.prisma.updateGoroscope({ sign, day: 'tommorow', text: null });
        }),
      );
      await this.goroscopeService.initGoroscopeToday();
      await this.goroscopeService.initGoroscopeTommorow();
      return;
    }
  }
}
