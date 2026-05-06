import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';
import { CYCLE_REPOSITORY } from '../feedback360/application/ports/cycle.repository.port';
import { Feedback360Module } from '../feedback360/feedback360.module';
import { CycleRepository } from '../feedback360/infrastructure/prisma-repositories/cycle.repository';
import { CLUSTER_REPOSITORY } from '../library/application/ports/cluster.repository.port';
import { ClusterRepository } from '../library/infrastructure/prisma-repositories/cluster.repository';
import { CycleStageListener } from './application/listeners/cycle-stage.listener';
import { ReviewStageListener } from './application/listeners/review-stage.listener';
import { REPORT_ANALYTICS_REPOSITORY } from './application/ports/report-analytics.repository.port';
import { REPORT_COMMENT_REPOSITORY } from './application/ports/report-comment.repository.port';
import { REPORT_INSIGHT_REPOSITORY } from './application/ports/report-insight.repository.port';
import { REPORT_REPOSITORY } from './application/ports/report.repository.port';
import { STRATEGIC_REPORT_ANALYTICS_REPOSITORY } from './application/ports/strategic-report-analytics.repository.port';
import { STRATEGIC_REPORT_INSIGHT_REPOSITORY } from './application/ports/strategic-report-insight.repository.port';
import { STRATEGIC_REPORT_REPOSITORY } from './application/ports/strategic-report.repository.port';
import { ReportAnalyticsService } from './application/services/report-analytics.service';
import { ReportCommentService } from './application/services/report-comment.service';
import { ReportInsightService } from './application/services/report-insight.service';
import { ReportingService } from './application/services/reports.service';
import { StartegicReportInsightService } from './application/services/startegic-report-insight.service';
import { StrategicReportAnalyticsService } from './application/services/strategic-report-analytics.service';
import { StrategicReportingService } from './application/services/strategic-reports.service';
import { TextAnswerService } from './application/services/text-answer.service';
import { ReportAnalyticsRepository } from './infrastructure/prisma-repositories/report-analytics.repository';
import { ReportCommentRepository } from './infrastructure/prisma-repositories/report-comment.repository';
import { ReportInsightRepository } from './infrastructure/prisma-repositories/report-insight.repository';
import { ReportRepository } from './infrastructure/prisma-repositories/report.repository';
import { StrategicReportInsightRepository } from './infrastructure/prisma-repositories/startegic-report-insight.repository';
import { StrategicReportAnalyticsRepository } from './infrastructure/prisma-repositories/strategic-report-analytics.repository';
import { StrategicReportRepository } from './infrastructure/prisma-repositories/strategic-report.repository';
import { ReportingController } from './presentation/http/controllers/reporting.controller';
import { StrategicReportingController } from './presentation/http/controllers/strategic-reporting.controller';

import { ANSWER_REPOSITORY } from '../feedback360/application/ports/answer.repository.port';
import { QUESTION_REPOSITORY } from '../feedback360/application/ports/question.repository.port';
import { RESPONDENT_REPOSITORY } from '../feedback360/application/ports/respondent.repository.port';
import { REVIEW_REPOSITORY } from '../feedback360/application/ports/review.repository.port';
import { REVIEWER_REPOSITORY } from '../feedback360/application/ports/reviewer.repository.port';

import { AnswerRepository } from '../feedback360/infrastructure/prisma-repositories/answer.repository';
import { QuestionRepository } from '../feedback360/infrastructure/prisma-repositories/question.repository';
import { RespondentRepository } from '../feedback360/infrastructure/prisma-repositories/respondent.repository';
import { ReviewRepository } from '../feedback360/infrastructure/prisma-repositories/review.repository';
import { ReviewerRepository } from '../feedback360/infrastructure/prisma-repositories/reviewer.repository';

import { IDENTITY_USER_REPOSITORY } from '../identity/application/ports/user.repository.port';
import { IdentityModule } from '../identity/identity.module';
import { UserRepository } from '../identity/infrastructure/prisma-repositories/user.repository';

import { ORGANISATION_POSITION_REPOSITORY } from '../organisation/application/ports/position.repository.port';
import { ORGANISATION_TEAM_REPOSITORY } from '../organisation/application/ports/team.repository.port';
import { PositionRepository } from '../organisation/infrastructure/prisma-repositories/position.repository';
import { TeamRepository } from '../organisation/infrastructure/prisma-repositories/team.repository';
import { OrganisationModule } from '../organisation/organisation.module';

import { forwardRef } from '@nestjs/common';
import { COMPETENCE_REPOSITORY } from '../library/application/ports/competence.repository.port';
import { CompetenceRepository } from '../library/infrastructure/prisma-repositories/competence.repository';
import { LibraryModule } from '../library/library.module';

@Module({
    imports: [
        EventEmitterModule.forRoot(),
        DatabaseModule,
        DatabaseModule,
        AuthModule,
        forwardRef(() => Feedback360Module),
        IdentityModule,
        OrganisationModule,
        LibraryModule,
    ],
    controllers: [ReportingController, StrategicReportingController],
    providers: [
        ReviewStageListener,
        CycleStageListener,
        ReportingService,
        StrategicReportingService,
        ReportInsightService,
        StartegicReportInsightService,
        ReportAnalyticsService,
        StrategicReportAnalyticsService,
        ReportCommentService,
        TextAnswerService,
        ReportInsightRepository,
        ReportRepository,
        ReportAnalyticsRepository,
        StrategicReportInsightRepository,
        StrategicReportRepository,
        StrategicReportAnalyticsRepository,
        ReportCommentRepository,
        ClusterRepository,
        CycleRepository,
        RespondentRepository,
        ReviewerRepository,
        AnswerRepository,
        ReviewRepository,
        QuestionRepository,
        UserRepository,
        TeamRepository,
        PositionRepository,
        CompetenceRepository,
        { provide: REPORT_REPOSITORY, useExisting: ReportRepository },
        {
            provide: REPORT_INSIGHT_REPOSITORY,
            useExisting: ReportInsightRepository,
        },
        {
            provide: REPORT_ANALYTICS_REPOSITORY,
            useExisting: ReportAnalyticsRepository,
        },
        {
            provide: STRATEGIC_REPORT_INSIGHT_REPOSITORY,
            useExisting: StrategicReportInsightRepository,
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
            provide: REPORT_COMMENT_REPOSITORY,
            useExisting: ReportCommentRepository,
        },
        { provide: CLUSTER_REPOSITORY, useExisting: ClusterRepository },
        { provide: CYCLE_REPOSITORY, useExisting: CycleRepository },
        { provide: RESPONDENT_REPOSITORY, useExisting: RespondentRepository },
        { provide: REVIEWER_REPOSITORY, useExisting: ReviewerRepository },
        { provide: ANSWER_REPOSITORY, useExisting: AnswerRepository },
        { provide: REVIEW_REPOSITORY, useExisting: ReviewRepository },
        { provide: QUESTION_REPOSITORY, useExisting: QuestionRepository },
        { provide: IDENTITY_USER_REPOSITORY, useExisting: UserRepository },
        { provide: ORGANISATION_TEAM_REPOSITORY, useExisting: TeamRepository },
        {
            provide: ORGANISATION_POSITION_REPOSITORY,
            useExisting: PositionRepository,
        },
        { provide: COMPETENCE_REPOSITORY, useExisting: CompetenceRepository },
    ],
    exports: [
        ReportingService,
        StrategicReportingService,
        ReportInsightService,
        StartegicReportInsightService,
        ReportAnalyticsService,
        ReportCommentService,
        TextAnswerService,
        CLUSTER_REPOSITORY,
        STRATEGIC_REPORT_REPOSITORY,
    ],
})
export class ReportingModule {}
