import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { IdentityModule } from '../identity/identity.module';
import { ORGANISATION_POSITION_HIERARCHY_REPOSITORY } from './application/ports/position-hierarchy.repository.port';
import { ORGANISATION_POSITION_REPOSITORY } from './application/ports/position.repository.port';
import { ORGANISATION_TEAM_REPOSITORY } from './application/ports/team.repository.port';
import { PositionHierarchyService } from './application/services/position-hierarchy.service';
import { PositionService } from './application/services/position.service';
import { TeamService } from './application/services/team.service';
import { PositionHierarchyRepository } from './infrastructure/prisma-repositories/position-hierarchy.repository';
import { PositionRepository } from './infrastructure/prisma-repositories/position.repository';
import { TeamRepository } from './infrastructure/prisma-repositories/team.repository';
import { PositionsController } from './presentation/http/controllers/positions.controller';
import { TeamsController } from './presentation/http/controllers/teams.controller';

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
        {
            provide: ORGANISATION_POSITION_REPOSITORY,
            useExisting: PositionRepository,
        },
        {
            provide: ORGANISATION_POSITION_HIERARCHY_REPOSITORY,
            useExisting: PositionHierarchyRepository,
        },
    ],
    exports: [TeamService, PositionService, PositionHierarchyService],
})
export class OrganisationModule {}
