import { Module } from '@nestjs/common';
import { NatalCardService } from './natalCard.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [NatalCardService, PrismaService],
  exports: [NatalCardService],
})
export class NatalCardModule {}
