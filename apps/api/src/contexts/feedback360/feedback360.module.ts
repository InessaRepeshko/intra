import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { LibraryModule } from '../library/library.module';
import { CycleService } from './application/services/cycle.service';
import { ReviewService } from './application/services/review.service';
import { CycleRepository } from './infrastructure/prisma-repositories/cycle.repository';
import { ReviewRepository } from './infrastructure/prisma-repositories/review.repository';
import { QuestionRepository } from './infrastructure/prisma-repositories/question.repository';
import { ReviewQuestionRelationRepository } from './infrastructure/prisma-repositories/review-question-relation.repository';
import { AnswerRepository } from './infrastructure/prisma-repositories/answer.repository';
import { RespondentRepository } from './infrastructure/prisma-repositories/respondent.repository';
import { ReviewerRepository } from './infrastructure/prisma-repositories/reviewer.repository';
import { ClusterScoreRepository } from './infrastructure/prisma-repositories/cluster-score.repository';
import { CYCLE_REPOSITORY } from './application/ports/cycle.repository.port';
import { REVIEW_REPOSITORY } from './application/ports/review.repository.port';
import { QUESTION_REPOSITORY } from './application/ports/question.repository.port';
import { REVIEW_QUESTION_RELATION_REPOSITORY } from './application/ports/review-question-relation.repository.port';
import { ANSWER_REPOSITORY } from './application/ports/answer.repository.port';
import { RESPONDENT_REPOSITORY } from './application/ports/respondent.repository.port';
import { REVIEWER_REPOSITORY } from './application/ports/reviewer.repository.port';
import { CLUSTER_SCORE_REPOSITORY } from './application/ports/cluster-score.repository.port';
import { CyclesController } from './presentation/http/controllers/cycles.controller';
import { ReviewController } from './presentation/http/controllers/reviews.controller';
import { QuestionsController } from './presentation/http/controllers/questions.controller';
import { ClusterScoresController } from './presentation/http/controllers/cluster-scores.controller';

@Module({
  imports: [DatabaseModule, LibraryModule],
  controllers: [CyclesController, ReviewController, QuestionsController, ClusterScoresController],
  providers: [
    CycleService,
    ReviewService,
    CycleRepository,
    ReviewRepository,
    QuestionRepository,
    ReviewQuestionRelationRepository,
    AnswerRepository,
    RespondentRepository,
    ReviewerRepository,
    ClusterScoreRepository,
    { provide: CYCLE_REPOSITORY, useExisting: CycleRepository },
    { provide: REVIEW_REPOSITORY, useExisting: ReviewRepository },
    { provide: QUESTION_REPOSITORY, useExisting: QuestionRepository },
    { provide: REVIEW_QUESTION_RELATION_REPOSITORY, useExisting: ReviewQuestionRelationRepository },
    { provide: ANSWER_REPOSITORY, useExisting: AnswerRepository },
    { provide: RESPONDENT_REPOSITORY, useExisting: RespondentRepository },
    { provide: REVIEWER_REPOSITORY, useExisting: ReviewerRepository },
    { provide: CLUSTER_SCORE_REPOSITORY, useExisting: ClusterScoreRepository },
  ],
  exports: [CycleService, ReviewService],
})
export class Feedback360Module { }
