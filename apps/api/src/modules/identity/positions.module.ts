import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { PositionsService } from './application/positions.service';
import { POSITION_REPOSITORY } from './application/repository-ports/position.repository.port';
import { PositionPrismaRepository } from './infrastructure/prisma-repositories/position.prisma.repository';
import { PositionsController } from './presentation/http/controllers/positions.controller';

@Module({
  imports: [PrismaModule],
  controllers: [PositionsController],
  providers: [
    PositionsService,
    PositionPrismaRepository,
    { provide: POSITION_REPOSITORY, useExisting: PositionPrismaRepository },
  ],
  exports: [PositionsService],
})
export class PositionsModule {}


