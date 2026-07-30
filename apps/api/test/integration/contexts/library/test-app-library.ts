import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import appConfig from 'src/config/app';
import databaseConfig from 'src/config/database';
import { QUESTION_REPOSITORY } from 'src/contexts/feedback360/application/ports/question.repository.port';
import { QuestionRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/question.repository';
import { IDENTITY_ROLE_REPOSITORY } from 'src/contexts/identity/application/ports/role.repository.port';
import { IDENTITY_USER_REPOSITORY } from 'src/contexts/identity/application/ports/user.repository.port';
import { IdentityRoleService } from 'src/contexts/identity/application/services/identity-role.service';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { RoleRepository } from 'src/contexts/identity/infrastructure/prisma-repositories/role.repository';
import { UserRepository } from 'src/contexts/identity/infrastructure/prisma-repositories/user.repository';
import { CLUSTER_REPOSITORY } from 'src/contexts/library/application/ports/cluster.repository.port';
import { COMPETENCE_QUESTION_TEMPLATE_RELATION_REPOSITORY } from 'src/contexts/library/application/ports/competence-question-template-relation.repository.port';
import { COMPETENCE_REPOSITORY } from 'src/contexts/library/application/ports/competence.repository.port';
import { POSITION_COMPETENCE_RELATION_REPOSITORY } from 'src/contexts/library/application/ports/position-competence-relation.repository.port';
import { POSITION_QUESTION_TEMPLATE_RELATION_REPOSITORY } from 'src/contexts/library/application/ports/position-question-template-relation.repository.port';
import { QUESTION_TEMPLATE_REPOSITORY } from 'src/contexts/library/application/ports/question-template.repository.port';
import { ClusterService } from 'src/contexts/library/application/services/cluster.service';
import { CompetenceService } from 'src/contexts/library/application/services/competence.service';
import { QuestionTemplateService } from 'src/contexts/library/application/services/question-template.service';
import { ClusterRepository } from 'src/contexts/library/infrastructure/prisma-repositories/cluster.repository';
import { CompetenceQuestionTemplateRelationRepository } from 'src/contexts/library/infrastructure/prisma-repositories/competence-question-template-relation.repository';
import { CompetenceRepository } from 'src/contexts/library/infrastructure/prisma-repositories/competence.repository';
import { PositionCompetenceRelationRepository } from 'src/contexts/library/infrastructure/prisma-repositories/position-competence-relation.repository';
import { PositionQuestionTemplateRelationRepository } from 'src/contexts/library/infrastructure/prisma-repositories/position-question-template-relation.repository';
import { QuestionTemplateRepository } from 'src/contexts/library/infrastructure/prisma-repositories/question-template.repository';
import { ORGANISATION_POSITION_REPOSITORY } from 'src/contexts/organisation/application/ports/position.repository.port';
import { PositionService } from 'src/contexts/organisation/application/services/position.service';
import { PositionRepository } from 'src/contexts/organisation/infrastructure/prisma-repositories/position.repository';
import { DatabaseModule } from 'src/database/database.module';
import { PrismaService } from 'src/database/prisma.service';
import { ensureTestDatabaseExists } from '../../setup-env';

/**
 * Bootstraps a Nest testing module for the library context wired to
 * the real database. We assemble the providers manually instead of
 * importing `LibraryModule` because that module pulls in `AuthModule`
 * and the full `Feedback360Module`, which would require the entire
 * HTTP / better-auth setup for service-level tests that never need it.
 *
 * Cross-context dependencies wired in:
 * - Organisation `PositionService` + `PositionRepository`
 *   (`CompetenceService.attachPosition` and `QuestionTemplateService`
 *   validate positions against real rows in `org_positions`).
 * - Identity providers (for completeness in case future tests use
 *   them).
 * - Feedback360 `QuestionRepository` bound under `QUESTION_REPOSITORY`
 *   so `QuestionTemplateService.delete()` can check for related review
 *   questions in `feedback360_questions`.
 */
export async function createLibraryTestModule(): Promise<TestingModule> {
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
            // Library
            CompetenceService,
            ClusterService,
            QuestionTemplateService,
            CompetenceRepository,
            ClusterRepository,
            QuestionTemplateRepository,
            PositionCompetenceRelationRepository,
            PositionQuestionTemplateRelationRepository,
            CompetenceQuestionTemplateRelationRepository,
            {
                provide: COMPETENCE_REPOSITORY,
                useExisting: CompetenceRepository,
            },
            { provide: CLUSTER_REPOSITORY, useExisting: ClusterRepository },
            {
                provide: QUESTION_TEMPLATE_REPOSITORY,
                useExisting: QuestionTemplateRepository,
            },
            {
                provide: POSITION_COMPETENCE_RELATION_REPOSITORY,
                useExisting: PositionCompetenceRelationRepository,
            },
            {
                provide: POSITION_QUESTION_TEMPLATE_RELATION_REPOSITORY,
                useExisting: PositionQuestionTemplateRelationRepository,
            },
            {
                provide: COMPETENCE_QUESTION_TEMPLATE_RELATION_REPOSITORY,
                useExisting: CompetenceQuestionTemplateRelationRepository,
            },
            // Organisation (PositionService is required by library services)
            PositionService,
            PositionRepository,
            {
                provide: ORGANISATION_POSITION_REPOSITORY,
                useExisting: PositionRepository,
            },
            // Feedback360 question repo — used by QuestionTemplateService.delete
            QuestionRepository,
            { provide: QUESTION_REPOSITORY, useExisting: QuestionRepository },
            // Identity (kept for completeness; some library scenarios may
            // need ratees / managers in future)
            IdentityUserService,
            IdentityRoleService,
            UserRepository,
            RoleRepository,
            { provide: IDENTITY_USER_REPOSITORY, useExisting: UserRepository },
            { provide: IDENTITY_ROLE_REPOSITORY, useExisting: RoleRepository },
        ],
    }).compile();

    await module.init();
    return module;
}

/**
 * Truncates the library-owned tables and their cross-context
 * dependencies between tests. `identity_roles` reference data is
 * preserved; everything else relevant to library scenarios is wiped.
 */
export async function resetLibraryTables(prisma: PrismaService): Promise<void> {
    await prisma.$executeRawUnsafe(
        `TRUNCATE TABLE
            "feedback360_questions",
            "library_competence_question_template_relations",
            "library_position_question_template_relations",
            "library_position_competence_relations",
            "library_clusters",
            "library_question_templates",
            "library_competences",
            "org_positions",
            "identity_users_roles",
            "identity_users"
         RESTART IDENTITY CASCADE`,
    );
}
