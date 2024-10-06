import { Module } from '@nestjs/common';
import { GoroscopeService } from './goroscope.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
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
  providers: [GoroscopeService, PrismaService],
  exports: [GoroscopeService]
})
export class GoroscopeModule {}
