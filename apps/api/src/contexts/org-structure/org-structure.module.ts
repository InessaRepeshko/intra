import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { IdentityModule } from '../identity/identity.module';
import { TeamService } from './application/services/team.service';
import { PositionService } from './application/services/position.service';
import { PositionHierarchyService } from './application/services/position-hierarchy.service';
import { TeamRepository } from './infrastructure/prisma-repositories/team.repository';
import { PositionRepository } from './infrastructure/prisma-repositories/position.repository';
import { PositionHierarchyRepository } from './infrastructure/prisma-repositories/position-hierarchy.repository';
import { ORG_TEAM_REPOSITORY } from './application/ports/team.repository.port';
import { ORG_POSITION_REPOSITORY } from './application/ports/position.repository.port';
import { ORG_POSITION_HIERARCHY_REPOSITORY } from './application/ports/position-hierarchy.repository.port';
import { TeamsController } from './presentation/http/controllers/teams.controller';
import { PositionsController } from './presentation/http/controllers/positions.controller';

@Module({
  imports: [PrismaModule, IdentityModule],
  controllers: [TeamsController, PositionsController],
  providers: [
    TeamService,
    PositionService,
    PositionHierarchyService,
    TeamRepository,
    PositionRepository,
    PositionHierarchyRepository,
    { provide: ORG_TEAM_REPOSITORY, useExisting: TeamRepository },
    { provide: ORG_POSITION_REPOSITORY, useExisting: PositionRepository },
    { provide: ORG_POSITION_HIERARCHY_REPOSITORY, useExisting: PositionHierarchyRepository },
  ],
  exports: [TeamService, PositionService, PositionHierarchyService],
})
export class OrgStructureModule {}
