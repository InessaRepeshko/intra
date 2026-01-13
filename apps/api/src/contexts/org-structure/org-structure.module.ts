import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TeamsService } from './application/services/teams.service';
import { PositionsService } from './application/services/positions.service';
import { TeamsController } from './infrastructure/http/controllers/teams.controller';
import { PositionsController } from './infrastructure/http/controllers/positions.controller';
import { TeamPrismaRepository } from './infrastructure/prisma/repositories/team.prisma.repository';
import { PositionPrismaRepository } from './infrastructure/prisma/repositories/position.prisma.repository';
import { OrgUserPrismaRepository } from './infrastructure/prisma/repositories/user.prisma.repository';
import { TEAM_REPOSITORY } from './domain/repositories/team.repository.port';
import { POSITION_REPOSITORY } from './domain/repositories/position.repository.port';
import { ORG_USER_REPOSITORY } from './domain/repositories/user.repository.port';

@Module({
  imports: [PrismaModule],
  controllers: [TeamsController, PositionsController],
  providers: [
    TeamsService,
    PositionsService,
    TeamPrismaRepository,
    PositionPrismaRepository,
    OrgUserPrismaRepository,
    { provide: TEAM_REPOSITORY, useExisting: TeamPrismaRepository },
    { provide: POSITION_REPOSITORY, useExisting: PositionPrismaRepository },
    { provide: ORG_USER_REPOSITORY, useExisting: OrgUserPrismaRepository },
  ],
  exports: [TeamsService, PositionsService],
})
export class OrgStructureModule {}

