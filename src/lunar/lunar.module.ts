import { Module } from '@nestjs/common';
import { LunarService } from './lunar.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [LunarService, PrismaService],
  exports: [LunarService],
})
export class LunarModule {}
