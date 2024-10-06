import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { LocaleZodiac } from 'src/users/interfaces/userData';

@Injectable()
export class GoroscopeService implements OnModuleInit {
  private readonly logger = new Logger(GoroscopeService.name);

  constructor(
    @Inject('GPT_SERVICE') private readonly gpt: ClientProxy,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    await this.initGoroscopeToday();
    await this.initGoroscopeTommorow();
    return;
  }

  async getGoroscope(sign: string, day: 'today' | 'tommorow') {
    return this.prisma.findGoroscopeBySignAndDay(sign, day);
  }

  async initGoroscopeToday(){
    const goroscopesToday = await this.prisma.findAllGoroscopesByDay('today');
    if (!goroscopesToday.length) {
      await Promise.all(
        Object.values(LocaleZodiac).map((sign) => {
          return this.prisma.createGoroscope({ sign, day: 'today', text: null });
        }),
      );
    }
    const emptyGoroscopeToday = goroscopesToday.filter((el) => !el.today);

    if (emptyGoroscopeToday.length) {
      const emptyGoroscopeSigns = emptyGoroscopeToday.map((el) => el.sign);
      const results = await Promise.all(
        emptyGoroscopeSigns.map((sign) => {
          const response$ = this.gpt.send<string>('get-goroscope', JSON.stringify({ period: 'Today', sign }));
          return lastValueFrom(response$);
        }),
      );

      await Promise.all(
        emptyGoroscopeSigns.map((sign, idx) => {
          return this.prisma.updateGoroscope({ sign, day: 'today', text: results[idx] });
        }),
      );
    }

    return;
  }

  async initGoroscopeTommorow(){
    const goroscopesTommorow = await this.prisma.findAllGoroscopesByDay('tommorow');
    if (!goroscopesTommorow.length) {
      await Promise.all(
        Object.values(LocaleZodiac).map((sign) => {
          return this.prisma.createGoroscope({ sign, day: 'tommorow', text: null });
        }),
      );
    }
    const emptyGoroscopeTommorow = goroscopesTommorow.filter((el) => !el.tommorow);

    if (emptyGoroscopeTommorow.length) {
      const emptyGoroscopeSigns = emptyGoroscopeTommorow.map((el) => el.sign);
      const results = await Promise.all(
        emptyGoroscopeSigns.map((sign) => {
          const response$ = this.gpt.send<string>('get-goroscope', JSON.stringify({ period: 'Tommorow', sign }));
          return lastValueFrom(response$);
        }),
      );

      await Promise.all(
        emptyGoroscopeSigns.map((sign, idx) => {
          return this.prisma.updateGoroscope({ sign, day: 'tommorow', text: results[idx] });
        }),
      );
    }

    return;
  }
}
