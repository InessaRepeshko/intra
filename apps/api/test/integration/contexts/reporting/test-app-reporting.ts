import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import appConfig from 'src/config/app';
import databaseConfig from 'src/config/database';
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
import { ReviewService } from 'src/contexts/feedback360/application/services/review.service';
import { AnswerRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/answer.repository';
import { ClusterScoreAnalyticsRepository as Feedback360ClusterScoreAnalyticsRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cluster-score-analytics.repository';
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
import { CycleStageListener as ReportingCycleStageListener } from 'src/contexts/reporting/application/listeners/cycle-stage.listener';
import { ReviewStageListener as ReportingReviewStageListener } from 'src/contexts/reporting/application/listeners/review-stage.listener';
import { REPORT_ANALYTICS_REPOSITORY } from 'src/contexts/reporting/application/ports/report-analytics.repository.port';
import { REPORT_COMMENT_REPOSITORY } from 'src/contexts/reporting/application/ports/report-comment.repository.port';
import { REPORT_INSIGHT_REPOSITORY } from 'src/contexts/reporting/application/ports/report-insight.repository.port';
import { REPORT_REPOSITORY } from 'src/contexts/reporting/application/ports/report.repository.port';
import { STRATEGIC_REPORT_ANALYTICS_REPOSITORY } from 'src/contexts/reporting/application/ports/strategic-report-analytics.repository.port';
import { STRATEGIC_REPORT_INSIGHT_REPOSITORY } from 'src/contexts/reporting/application/ports/strategic-report-insight.repository.port';
import { STRATEGIC_REPORT_REPOSITORY } from 'src/contexts/reporting/application/ports/strategic-report.repository.port';
import { ReportAnalyticsService } from 'src/contexts/reporting/application/services/report-analytics.service';
import { ReportCommentService } from 'src/contexts/reporting/application/services/report-comment.service';
import { ReportInsightService } from 'src/contexts/reporting/application/services/report-insight.service';
import { ReportingService } from 'src/contexts/reporting/application/services/reports.service';
import { StartegicReportInsightService } from 'src/contexts/reporting/application/services/startegic-report-insight.service';
import { StrategicReportAnalyticsService } from 'src/contexts/reporting/application/services/strategic-report-analytics.service';
import { StrategicReportingService } from 'src/contexts/reporting/application/services/strategic-reports.service';
import { TextAnswerService } from 'src/contexts/reporting/application/services/text-answer.service';
import { ReportAnalyticsRepository } from 'src/contexts/reporting/infrastructure/prisma-repositories/report-analytics.repository';
import { ReportCommentRepository } from 'src/contexts/reporting/infrastructure/prisma-repositories/report-comment.repository';
import { ReportInsightRepository } from 'src/contexts/reporting/infrastructure/prisma-repositories/report-insight.repository';
import { ReportRepository } from 'src/contexts/reporting/infrastructure/prisma-repositories/report.repository';
import { StrategicReportInsightRepository } from 'src/contexts/reporting/infrastructure/prisma-repositories/startegic-report-insight.repository';
import { StrategicReportAnalyticsRepository } from 'src/contexts/reporting/infrastructure/prisma-repositories/strategic-report-analytics.repository';
import { StrategicReportRepository } from 'src/contexts/reporting/infrastructure/prisma-repositories/strategic-report.repository';
import { DatabaseModule } from 'src/database/database.module';
import { PrismaService } from 'src/database/prisma.service';
import { ensureTestDatabaseExists } from '../../setup-env';

/**
 * Bootstraps a Nest testing module for the reporting context wired to
 * the real database. We assemble the providers manually instead of
 * importing `ReportingModule` because that module pulls in
 * `AuthModule`, `Feedback360Module` (via forwardRef), and a fleet of
 * listeners that require the full HTTP / better-auth setup.
 *
 * Cross-context dependencies wired in:
 * - Identity (`IdentityUserService` + repo) so reviews can reference
 *   real `identity_users` rows for HR, ratee, etc.
 * - Organisation (`PositionRepository`, `TeamRepository`) so reviews
 *   can reference real positions/teams without FK errors.
 * - Library (`CompetenceRepository`, `ClusterRepository`) because
 *   reporting analytics/insights reference competences.
 * - Feedback360 (`CycleRepository`, `ReviewRepository`,
 *   `QuestionRepository`, `RespondentRepository`, `ReviewerRepository`,
 *   `AnswerRepository`) so reports can be tied to real reviews / cycles
 *   / questions when the foreign-key constraints fire.
 */
export async function createReportingTestModule(): Promise<TestingModule> {
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
            // Reporting — services
            ReportingService,
            StrategicReportingService,
            ReportAnalyticsService,
            ReportInsightService,
            ReportCommentService,
            StrategicReportAnalyticsService,
            StartegicReportInsightService,
            TextAnswerService,
            // Reporting — listeners
            ReportingCycleStageListener,
            ReportingReviewStageListener,
            // Reporting — repositories
            ReportRepository,
            ReportAnalyticsRepository,
            ReportInsightRepository,
            ReportCommentRepository,
            StrategicReportRepository,
            StrategicReportAnalyticsRepository,
            StrategicReportInsightRepository,
            { provide: REPORT_REPOSITORY, useExisting: ReportRepository },
            {
                provide: REPORT_ANALYTICS_REPOSITORY,
                useExisting: ReportAnalyticsRepository,
            },
            {
                provide: REPORT_INSIGHT_REPOSITORY,
                useExisting: ReportInsightRepository,
            },
            {
                provide: REPORT_COMMENT_REPOSITORY,
                useExisting: ReportCommentRepository,
            },
            {
                provide: STRATEGIC_REPORT_REPOSITORY,
                useExisting: StrategicReportRepository,
            },
            {
                provide: STRATEGIC_REPORT_ANALYTICS_REPOSITORY,
                useExisting: StrategicReportAnalyticsRepository,
            },
            {
                provide: STRATEGIC_REPORT_INSIGHT_REPOSITORY,
                useExisting: StrategicReportInsightRepository,
            },
            // Feedback360 — services (required by reporting listeners
            // which call CycleService.changeStage / ReviewService.changeReviewStage)
            CycleService,
            ReviewService,
            ClusterScoreAnalyticsService,
            // Feedback360 — repositories
            CycleRepository,
            ReviewRepository,
            QuestionRepository,
            RespondentRepository,
            ReviewerRepository,
            AnswerRepository,
            ClusterScoreRepository,
            ReviewQuestionRelationRepository,
            CycleStageHistoryRepository,
            ReviewStageHistoryRepository,
            Feedback360ClusterScoreAnalyticsRepository,
            { provide: CYCLE_REPOSITORY, useExisting: CycleRepository },
            { provide: REVIEW_REPOSITORY, useExisting: ReviewRepository },
            { provide: QUESTION_REPOSITORY, useExisting: QuestionRepository },
            {
                provide: RESPONDENT_REPOSITORY,
                useExisting: RespondentRepository,
            },
            { provide: REVIEWER_REPOSITORY, useExisting: ReviewerRepository },
            { provide: ANSWER_REPOSITORY, useExisting: AnswerRepository },
            {
                provide: CLUSTER_SCORE_REPOSITORY,
                useExisting: ClusterScoreRepository,
            },
            {
                provide: REVIEW_QUESTION_RELATION_REPOSITORY,
                useExisting: ReviewQuestionRelationRepository,
            },
            {
                provide: CYCLE_STAGE_HISTORY_REPOSITORY,
                useExisting: CycleStageHistoryRepository,
            },
            {
                provide: REVIEW_STAGE_HISTORY_REPOSITORY,
                useExisting: ReviewStageHistoryRepository,
            },
            {
                provide: CLUSTER_SCORE_ANALYTICS_REPOSITORY,
                useExisting: Feedback360ClusterScoreAnalyticsRepository,
            },
            // Library — services + relation repos required by ReviewService
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
            // Identity
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
 * Truncates every table touched by reporting scenarios. The order is
 * not significant because we use CASCADE, but the explicit list
 * documents the schema dependencies. `identity_roles` (reference data)
 * is preserved.
 */
export async function resetReportingTables(
    prisma: PrismaService,
): Promise<void> {
    await prisma.$executeRawUnsafe(
        `TRUNCATE TABLE
            "reporting_strategic_report_insights",
            "reporting_strategic_report_analytics",
            "reporting_strategic_reports",
            "reporting_individual_report_comments",
            "reporting_individual_report_insights",
            "reporting_individual_report_analytics",
            "reporting_individual_reports",
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
