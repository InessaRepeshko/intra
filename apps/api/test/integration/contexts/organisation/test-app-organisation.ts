import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import appConfig from 'src/config/app';
import databaseConfig from 'src/config/database';
import { IDENTITY_ROLE_REPOSITORY } from 'src/contexts/identity/application/ports/role.repository.port';
import { IDENTITY_USER_REPOSITORY } from 'src/contexts/identity/application/ports/user.repository.port';
import { IdentityRoleService } from 'src/contexts/identity/application/services/identity-role.service';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { RoleRepository } from 'src/contexts/identity/infrastructure/prisma-repositories/role.repository';
import { UserRepository } from 'src/contexts/identity/infrastructure/prisma-repositories/user.repository';
import { POSITION_COMPETENCE_RELATION_REPOSITORY } from 'src/contexts/library/application/ports/position-competence-relation.repository.port';
import { PositionCompetenceRelationRepository } from 'src/contexts/library/infrastructure/prisma-repositories/position-competence-relation.repository';
import { ORGANISATION_POSITION_HIERARCHY_REPOSITORY } from 'src/contexts/organisation/application/ports/position-hierarchy.repository.port';
import { ORGANISATION_POSITION_REPOSITORY } from 'src/contexts/organisation/application/ports/position.repository.port';
import { ORGANISATION_TEAM_REPOSITORY } from 'src/contexts/organisation/application/ports/team.repository.port';
import { PositionHierarchyService } from 'src/contexts/organisation/application/services/position-hierarchy.service';
import { PositionService } from 'src/contexts/organisation/application/services/position.service';
import { TeamService } from 'src/contexts/organisation/application/services/team.service';
import { PositionHierarchyRepository } from 'src/contexts/organisation/infrastructure/prisma-repositories/position-hierarchy.repository';
import { PositionRepository } from 'src/contexts/organisation/infrastructure/prisma-repositories/position.repository';
import { TeamRepository } from 'src/contexts/organisation/infrastructure/prisma-repositories/team.repository';
import { DatabaseModule } from 'src/database/database.module';
import { PrismaService } from 'src/database/prisma.service';
import { ensureTestDatabaseExists } from '../../setup-env';

/**
 * Bootstraps a Nest testing module for the organisation context wired
 * to the real database. We assemble the providers manually instead of
 * importing `OrganisationModule` because that module pulls in
 * `AuthModule`, which would require the full HTTP / better-auth setup
 * for service-level tests that never need it.
 *
 * Identity providers are included because `TeamService` depends on
 * `IdentityUserService` to validate team head/member references against
 * real users. The `library` position-competence relation repository is
 * also included so `PositionService.delete()` can talk to its real
 * table when no competences are linked.
 */
export async function createOrganisationTestModule(): Promise<TestingModule> {
    await ensureTestDatabaseExists();

    const module = await Test.createTestingModule({
        imports: [
            ConfigModule.forRoot({
                isGlobal: true,
                load: [appConfig, databaseConfig],
                ignoreEnvFile: true,
            }),
            EventEmitterModule.forRoot(),
            DatabaseModule,
        ],
        providers: [
            // Organisation
            PositionService,
            PositionHierarchyService,
            TeamService,
            PositionRepository,
            PositionHierarchyRepository,
            TeamRepository,
            {
                provide: ORGANISATION_POSITION_REPOSITORY,
                useExisting: PositionRepository,
            },
            {
                provide: ORGANISATION_POSITION_HIERARCHY_REPOSITORY,
                useExisting: PositionHierarchyRepository,
            },
            {
                provide: ORGANISATION_TEAM_REPOSITORY,
                useExisting: TeamRepository,
            },
            // Identity (TeamService uses IdentityUserService)
            IdentityUserService,
            IdentityRoleService,
            UserRepository,
            RoleRepository,
            { provide: IDENTITY_USER_REPOSITORY, useExisting: UserRepository },
            { provide: IDENTITY_ROLE_REPOSITORY, useExisting: RoleRepository },
            // Library cross-context dependency
            PositionCompetenceRelationRepository,
            {
                provide: POSITION_COMPETENCE_RELATION_REPOSITORY,
                useExisting: PositionCompetenceRelationRepository,
            },
        ],
    }).compile();

    await module.init();
    return module;
}

/**
 * Truncates organisation-owned tables and the identity user tables
 * between tests. We TRUNCATE identity users too because TeamService
 * scenarios create them inline; `identity_roles` (reference data) is
 * preserved.
 */
export async function resetOrganisationTables(
    prisma: PrismaService,
): Promise<void> {
    await prisma.$executeRawUnsafe(
        `TRUNCATE TABLE
            "org_team_memberships",
            "org_teams",
            "org_position_hierarchies",
            "library_position_competence_relations",
            "library_competences",
            "org_positions",
            "identity_users_roles",
            "identity_users"
         RESTART IDENTITY CASCADE`,
    );
}
