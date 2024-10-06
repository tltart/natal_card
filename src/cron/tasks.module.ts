import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { GoroscopeModule } from 'src/goroscope/goroscope.module';

@Module({
  imports: [GoroscopeModule],
  providers: [TasksService, PrismaService],
})
export class TasksModule {}
