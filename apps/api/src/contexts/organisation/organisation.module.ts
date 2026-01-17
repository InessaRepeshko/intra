import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { IdentityModule } from '../identity/identity.module';
import { TeamService } from './application/services/team.service';
import { PositionService } from './application/services/position.service';
import { PositionHierarchyService } from './application/services/position-hierarchy.service';
import { TeamRepository } from './infrastructure/prisma-repositories/team.repository';
import { PositionRepository } from './infrastructure/prisma-repositories/position.repository';
import { PositionHierarchyRepository } from './infrastructure/prisma-repositories/position-hierarchy.repository';
import { ORGANISATION_TEAM_REPOSITORY } from './application/ports/team.repository.port';
import { ORGANISATION_POSITION_REPOSITORY } from './application/ports/position.repository.port';
import { ORGANISATION_POSITION_HIERARCHY_REPOSITORY } from './application/ports/position-hierarchy.repository.port';
import { TeamsController } from './presentation/http/controllers/teams.controller';
import { PositionsController } from './presentation/http/controllers/positions.controller';

@Module({
  imports: [DatabaseModule, IdentityModule],
  controllers: [TeamsController, PositionsController],
  providers: [
    TeamService,
    PositionService,
    PositionHierarchyService,
    TeamRepository,
    PositionRepository,
    PositionHierarchyRepository,
    { provide: ORGANISATION_TEAM_REPOSITORY, useExisting: TeamRepository },
    { provide: ORGANISATION_POSITION_REPOSITORY, useExisting: PositionRepository },
    { provide: ORGANISATION_POSITION_HIERARCHY_REPOSITORY, useExisting: PositionHierarchyRepository },
  ],
  exports: [TeamService, PositionService, PositionHierarchyService],
})
export class OrganisationModule {}
