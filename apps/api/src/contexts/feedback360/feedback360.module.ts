import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { LibraryModule } from '../library/library.module';
import { ANSWER_REPOSITORY } from './application/ports/answer.repository.port';
import { CLUSTER_SCORE_REPOSITORY } from './application/ports/cluster-score.repository.port';
import { CYCLE_CLUSTER_ANALYTICS_REPOSITORY } from './application/ports/cycle-cluster-analytics.repository.port';
import { CYCLE_REPOSITORY } from './application/ports/cycle.repository.port';
import { QUESTION_REPOSITORY } from './application/ports/question.repository.port';
import { RESPONDENT_REPOSITORY } from './application/ports/respondent.repository.port';
import { REVIEW_QUESTION_RELATION_REPOSITORY } from './application/ports/review-question-relation.repository.port';
import { REVIEW_REPOSITORY } from './application/ports/review.repository.port';
import { REVIEWER_REPOSITORY } from './application/ports/reviewer.repository.port';
import { CycleClusterAnalyticsService } from './application/services/cycle-cluster-analytics.service';
import { CycleService } from './application/services/cycle.service';
import { ReviewService } from './application/services/review.service';
import { AnswerRepository } from './infrastructure/prisma-repositories/answer.repository';
import { ClusterScoreRepository } from './infrastructure/prisma-repositories/cluster-score.repository';
import { CycleClusterAnalyticsRepository } from './infrastructure/prisma-repositories/cycle-cluster-analytics.repository';
import { CycleRepository } from './infrastructure/prisma-repositories/cycle.repository';
import { QuestionRepository } from './infrastructure/prisma-repositories/question.repository';
import { RespondentRepository } from './infrastructure/prisma-repositories/respondent.repository';
import { ReviewQuestionRelationRepository } from './infrastructure/prisma-repositories/review-question-relation.repository';
import { ReviewRepository } from './infrastructure/prisma-repositories/review.repository';
import { ReviewerRepository } from './infrastructure/prisma-repositories/reviewer.repository';
import { ClusterScoresController } from './presentation/http/controllers/cluster-scores.controller';
import { CycleClusterAnalyticsController } from './presentation/http/controllers/cycle-cluster-analytics.controller';
import { CyclesController } from './presentation/http/controllers/cycles.controller';
import { QuestionsController } from './presentation/http/controllers/questions.controller';
import { ReviewController } from './presentation/http/controllers/reviews.controller';

@Module({
    imports: [DatabaseModule, LibraryModule],
    controllers: [
        CyclesController,
        ReviewController,
        QuestionsController,
        ClusterScoresController,
        CycleClusterAnalyticsController,
    ],
    providers: [
        CycleService,
        ReviewService,
        CycleClusterAnalyticsService,
        CycleRepository,
        ReviewRepository,
        QuestionRepository,
        ReviewQuestionRelationRepository,
        AnswerRepository,
        RespondentRepository,
        ReviewerRepository,
        ClusterScoreRepository,
        CycleClusterAnalyticsRepository,
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
            provide: CYCLE_CLUSTER_ANALYTICS_REPOSITORY,
            useExisting: CycleClusterAnalyticsRepository,
        },
    ],
    exports: [CycleService, ReviewService, CycleClusterAnalyticsService],
})
export class Feedback360Module {}
