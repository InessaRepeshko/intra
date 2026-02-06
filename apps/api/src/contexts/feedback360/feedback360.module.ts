import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';
import { IdentityModule } from '../identity/identity.module';
import { LibraryModule } from '../library/library.module';
import { CycleFinishedListener } from './application/listeners/cycle-finished.listener';
import { ANSWER_REPOSITORY } from './application/ports/answer.repository.port';
import { CLUSTER_SCORE_ANALYTICS_REPOSITORY } from './application/ports/cluster-score-analytics.repository.port';
import { CLUSTER_SCORE_REPOSITORY } from './application/ports/cluster-score.repository.port';
import { CYCLE_REPOSITORY } from './application/ports/cycle.repository.port';
import { QUESTION_REPOSITORY } from './application/ports/question.repository.port';
import { RESPONDENT_REPOSITORY } from './application/ports/respondent.repository.port';
import { REVIEW_QUESTION_RELATION_REPOSITORY } from './application/ports/review-question-relation.repository.port';
import { REVIEW_STAGE_HISTORY_REPOSITORY } from './application/ports/review-stage-history.repository.port';
import { REVIEW_REPOSITORY } from './application/ports/review.repository.port';
import { REVIEWER_REPOSITORY } from './application/ports/reviewer.repository.port';
import { ClusterScoreAnalyticsService } from './application/services/cluster-score-analytics.service';
import { CycleService } from './application/services/cycle.service';
import { ReviewSchedulerService } from './application/services/review-scheduler.service';
import { ReviewService } from './application/services/review.service';
import { AnswerRepository } from './infrastructure/prisma-repositories/answer.repository';
import { ClusterScoreAnalyticsRepository } from './infrastructure/prisma-repositories/cluster-score-analytics.repository';
import { ClusterScoreRepository } from './infrastructure/prisma-repositories/cluster-score.repository';
import { CycleRepository } from './infrastructure/prisma-repositories/cycle.repository';
import { QuestionRepository } from './infrastructure/prisma-repositories/question.repository';
import { RespondentRepository } from './infrastructure/prisma-repositories/respondent.repository';
import { ReviewQuestionRelationRepository } from './infrastructure/prisma-repositories/review-question-relation.repository';
import { ReviewStageHistoryRepository } from './infrastructure/prisma-repositories/review-stage-history.repository';
import { ReviewRepository } from './infrastructure/prisma-repositories/review.repository';
import { ReviewerRepository } from './infrastructure/prisma-repositories/reviewer.repository';
import { ClusterScoreAnalyticsController } from './presentation/http/controllers/cluster-score-analytics.controller';
import { ClusterScoresController } from './presentation/http/controllers/cluster-scores.controller';
import { CyclesController } from './presentation/http/controllers/cycles.controller';
import { QuestionsController } from './presentation/http/controllers/questions.controller';
import { ReviewController } from './presentation/http/controllers/reviews.controller';

@Module({
    imports: [
        EventEmitterModule.forRoot(),
        ScheduleModule.forRoot(),
        DatabaseModule,
        LibraryModule,
        AuthModule,
        IdentityModule,
    ],
    controllers: [
        CyclesController,
        ReviewController,
        QuestionsController,
        ClusterScoresController,
        ClusterScoreAnalyticsController,
    ],
    providers: [
        CycleFinishedListener,
        CycleService,
        ReviewService,
        ReviewSchedulerService,
        ClusterScoreAnalyticsService,
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
        { provide: CYCLE_REPOSITORY, useExisting: CycleRepository },
        { provide: REVIEW_REPOSITORY, useExisting: ReviewRepository },
        { provide: QUESTION_REPOSITORY, useExisting: QuestionRepository },
        {
            provide: REVIEW_QUESTION_RELATION_REPOSITORY,
            useExisting: ReviewQuestionRelationRepository,
        },
        { provide: ANSWER_REPOSITORY, useExisting: AnswerRepository },
        { provide: RESPONDENT_REPOSITORY, useExisting: RespondentRepository },
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
    ],
    exports: [
        CycleService,
        ReviewService,
        ClusterScoreAnalyticsService,
        RESPONDENT_REPOSITORY,
        CLUSTER_SCORE_REPOSITORY,
        ANSWER_REPOSITORY,
        REVIEW_QUESTION_RELATION_REPOSITORY,
        REVIEW_REPOSITORY,
    ],
})
export class Feedback360Module {}
