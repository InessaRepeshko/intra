import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import appConfig from 'src/config/app';
import databaseConfig from 'src/config/database';
import { CycleStageListener } from 'src/contexts/feedback360/application/listeners/cycle-stage.listener';
import {
    RespondentStatusListener,
    SelfAssessmentCompletedListener,
} from 'src/contexts/feedback360/application/listeners/respondent-status.listener';
import { ReviewStageListener } from 'src/contexts/feedback360/application/listeners/review-stage.listener';
import { ANSWER_REPOSITORY } from 'src/contexts/feedback360/application/ports/answer.repository.port';
import { CLUSTER_SCORE_ANALYTICS_REPOSITORY } from 'src/contexts/feedback360/application/ports/cluster-score-analytics.repository.port';
import { CLUSTER_SCORE_REPOSITORY } from 'src/contexts/feedback360/application/ports/cluster-score.repository.port';
import { CYCLE_STAGE_HISTORY_REPOSITORY } from 'src/contexts/feedback360/application/ports/cycle-stage-history.repository.port';
import { CYCLE_REPOSITORY } from 'src/contexts/feedback360/application/ports/cycle.repository.port';
import { QUESTION_REPOSITORY } from 'src/contexts/feedback360/application/ports/question.repository.port';
import { RESPONDENT_REPOSITORY } from 'src/contexts/feedback360/application/ports/respondent.repository.port';
import { REVIEW_QUESTION_RELATION_REPOSITORY } from 'src/contexts/feedback360/application/ports/review-question-relation.repository.port';
import { REVIEW_STAGE_HISTORY_REPOSITORY } from 'src/contexts/feedback360/application/ports/review-stage-history.repository.port';
import { REVIEW_REPOSITORY } from 'src/contexts/feedback360/application/ports/review.repository.port';
import { REVIEWER_REPOSITORY } from 'src/contexts/feedback360/application/ports/reviewer.repository.port';
import { ClusterScoreAnalyticsService } from 'src/contexts/feedback360/application/services/cluster-score-analytics.service';
import { CycleService } from 'src/contexts/feedback360/application/services/cycle.service';
import { ReviewSchedulerService } from 'src/contexts/feedback360/application/services/review-scheduler.service';
import { ReviewService } from 'src/contexts/feedback360/application/services/review.service';
import { AnswerRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/answer.repository';
import { ClusterScoreAnalyticsRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cluster-score-analytics.repository';
import { ClusterScoreRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cluster-score.repository';
import { CycleStageHistoryRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cycle-stage-history.repository';
import { CycleRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cycle.repository';
import { QuestionRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/question.repository';
import { RespondentRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/respondent.repository';
import { ReviewQuestionRelationRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/review-question-relation.repository';
import { ReviewStageHistoryRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/review-stage-history.repository';
import { ReviewRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/review.repository';
import { ReviewerRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/reviewer.repository';
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
import { ORGANISATION_TEAM_REPOSITORY } from 'src/contexts/organisation/application/ports/team.repository.port';
import { PositionService } from 'src/contexts/organisation/application/services/position.service';
import { PositionRepository } from 'src/contexts/organisation/infrastructure/prisma-repositories/position.repository';
import { TeamRepository } from 'src/contexts/organisation/infrastructure/prisma-repositories/team.repository';
import { STRATEGIC_REPORT_REPOSITORY } from 'src/contexts/reporting/application/ports/strategic-report.repository.port';
import { DatabaseModule } from 'src/database/database.module';
import { PrismaService } from 'src/database/prisma.service';
import { ensureTestDatabaseExists } from '../../setup-env';

/**
 * Bootstraps a Nest testing module for the feedback360 context wired to
 * the real database. We assemble the providers manually instead of
 * importing `Feedback360Module` because that module pulls in
 * `AuthModule`, `LibraryModule`, the reporting context, and a fleet of
 * listeners that require the full HTTP / better-auth setup.
 *
 * Cross-context dependencies wired in:
 * - Identity (`UserRepository` + `IdentityUserService`) so reviews/
 *   cycles can reference real `identity_users` rows for HR, ratee,
 *   manager and reviewer ids.
 * - Organisation (`PositionRepository`, `TeamRepository`) so reviews
 *   can reference real positions/teams without FK errors.
 * - Reporting `STRATEGIC_REPORT_REPOSITORY` is stubbed — `CycleService`
 *   only needs `findByCycleId()`, and pulling in the full reporting
 *   module would expand the surface area for service-level tests
 *   considerably.
 */
export async function createFeedback360TestModule(): Promise<TestingModule> {
    await ensureTestDatabaseExists();

    const strategicReportStub = {
        async findByCycleId() {
            return null;
        },
        async create() {
            throw new Error('not implemented in test stub');
        },
        async findById() {
            return null;
        },
        async search() {
            return [];
        },
    };

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
            // Feedback360 — services
            CycleService,
            ReviewService,
            ReviewSchedulerService,
            ClusterScoreAnalyticsService,
            // Feedback360 — listeners
            CycleStageListener,
            ReviewStageListener,
            RespondentStatusListener,
            SelfAssessmentCompletedListener,
            // Feedback360 — repositories
            CycleRepository,
            ReviewRepository,
            QuestionRepository,
            ReviewQuestionRelationRepository,
            AnswerRepository,
            RespondentRepository,
            ReviewerRepository,
            ClusterScoreRepository,
            ClusterScoreAnalyticsRepository,
            ReviewStageHistoryRepository,
            CycleStageHistoryRepository,
            { provide: CYCLE_REPOSITORY, useExisting: CycleRepository },
            { provide: REVIEW_REPOSITORY, useExisting: ReviewRepository },
            { provide: QUESTION_REPOSITORY, useExisting: QuestionRepository },
            {
                provide: REVIEW_QUESTION_RELATION_REPOSITORY,
                useExisting: ReviewQuestionRelationRepository,
            },
            { provide: ANSWER_REPOSITORY, useExisting: AnswerRepository },
            {
                provide: RESPONDENT_REPOSITORY,
                useExisting: RespondentRepository,
            },
            { provide: REVIEWER_REPOSITORY, useExisting: ReviewerRepository },
            {
                provide: CLUSTER_SCORE_REPOSITORY,
                useExisting: ClusterScoreRepository,
            },
            {
                provide: CLUSTER_SCORE_ANALYTICS_REPOSITORY,
                useExisting: ClusterScoreAnalyticsRepository,
            },
            {
                provide: REVIEW_STAGE_HISTORY_REPOSITORY,
                useExisting: ReviewStageHistoryRepository,
            },
            {
                provide: CYCLE_STAGE_HISTORY_REPOSITORY,
                useExisting: CycleStageHistoryRepository,
            },
            // Identity
            IdentityUserService,
            IdentityRoleService,
            UserRepository,
            RoleRepository,
            { provide: IDENTITY_USER_REPOSITORY, useExisting: UserRepository },
            { provide: IDENTITY_ROLE_REPOSITORY, useExisting: RoleRepository },
            // Library (needed for cluster score / question relation tests
            // + ReviewService.attachQuestion and CompetenceService /
            // QuestionTemplateService dependencies from ReviewService)
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
            // Organisation
            PositionService,
            PositionRepository,
            TeamRepository,
            {
                provide: ORGANISATION_POSITION_REPOSITORY,
                useExisting: PositionRepository,
            },
            {
                provide: ORGANISATION_TEAM_REPOSITORY,
                useExisting: TeamRepository,
            },
            // Reporting — stub
            {
                provide: STRATEGIC_REPORT_REPOSITORY,
                useValue: strategicReportStub,
            },
        ],
    }).compile();

    await module.init();
    return module;
}

/**
 * Truncates every table touched by feedback360 scenarios. The order is
 * not significant because we use CASCADE, but the explicit list
 * documents the schema dependencies. `identity_roles` (reference data)
 * is preserved.
 */
export async function resetFeedback360Tables(
    prisma: PrismaService,
): Promise<void> {
    await prisma.$executeRawUnsafe(
        `TRUNCATE TABLE
            "feedback360_answers",
            "feedback360_cluster_score_analytics",
            "feedback360_cluster_scores",
            "feedback360_review_question_relations",
            "feedback360_review_stage_history",
            "feedback360_cycle_stage_history",
            "feedback360_respondents",
            "feedback360_reviewers",
            "feedback360_questions",
            "feedback360_reviews",
            "feedback360_cycles",
            "library_clusters",
            "library_position_question_template_relations",
            "library_position_competence_relations",
            "library_competence_question_template_relations",
            "library_question_templates",
            "library_competences",
            "org_team_memberships",
            "org_teams",
            "org_position_hierarchies",
            "org_positions",
            "identity_users_roles",
            "identity_users"
         RESTART IDENTITY CASCADE`,
    );
}
