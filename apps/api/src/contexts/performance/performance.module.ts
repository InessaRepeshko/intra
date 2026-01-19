import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { LibraryModule } from '../library/library.module';
import { Feedback360CycleService } from './application/services/feedback360-cycle.service';
import { Feedback360Service } from './application/services/feedback360.service';
import { Feedback360CycleRepository } from './infrastructure/prisma-repositories/feedback360-cycle.repository';
import { Feedback360Repository } from './infrastructure/prisma-repositories/feedback360.repository';
import { Feedback360QuestionRepository } from './infrastructure/prisma-repositories/feedback360-question.repository';
import { Feedback360QuestionRelationRepository } from './infrastructure/prisma-repositories/feedback360-question-relation.repository';
import { Feedback360AnswerRepository } from './infrastructure/prisma-repositories/feedback360-answer.repository';
import { Feedback360RespondentRepository } from './infrastructure/prisma-repositories/feedback360-respondent.repository';
import { Feedback360ReviewerRepository } from './infrastructure/prisma-repositories/feedback360-reviewer.repository';
import { Feedback360ClusterScoreRepository } from './infrastructure/prisma-repositories/feedback360-cluster-score.repository';
import { FEEDBACK360_CYCLE_REPOSITORY } from './application/ports/feedback360-cycle.repository.port';
import { FEEDBACK360_REPOSITORY } from './application/ports/feedback360.repository.port';
import { FEEDBACK360_QUESTION_REPOSITORY } from './application/ports/feedback360-question.repository.port';
import { FEEDBACK360_QUESTION_RELATION_REPOSITORY } from './application/ports/feedback360-question-relation.repository.port';
import { FEEDBACK360_ANSWER_REPOSITORY } from './application/ports/feedback360-answer.repository.port';
import { FEEDBACK360_RESPONDENT_REPOSITORY } from './application/ports/feedback360-respondent.repository.port';
import { FEEDBACK360_REVIEWER_REPOSITORY } from './application/ports/feedback360-reviewer.repository.port';
import { FEEDBACK360_CLUSTER_SCORE_REPOSITORY } from './application/ports/feedback360-cluster-score.repository.port';
import { CyclesController } from './presentation/http/controllers/cycles.controller';
import { Feedback360Controller } from './presentation/http/controllers/feedback360.controller';
import { CycleQuestionsController } from './presentation/http/controllers/cycle-questions.controller';
import { ClusterScoresController } from './presentation/http/controllers/cluster-scores.controller';

@Module({
  imports: [DatabaseModule, LibraryModule],
  controllers: [CyclesController, Feedback360Controller, CycleQuestionsController, ClusterScoresController],
  providers: [
    Feedback360CycleService,
    Feedback360Service,
    Feedback360CycleRepository,
    Feedback360Repository,
    Feedback360QuestionRepository,
    Feedback360QuestionRelationRepository,
    Feedback360AnswerRepository,
    Feedback360RespondentRepository,
    Feedback360ReviewerRepository,
    Feedback360ClusterScoreRepository,
    { provide: FEEDBACK360_CYCLE_REPOSITORY, useExisting: Feedback360CycleRepository },
    { provide: FEEDBACK360_REPOSITORY, useExisting: Feedback360Repository },
    { provide: FEEDBACK360_QUESTION_REPOSITORY, useExisting: Feedback360QuestionRepository },
    { provide: FEEDBACK360_QUESTION_RELATION_REPOSITORY, useExisting: Feedback360QuestionRelationRepository },
    { provide: FEEDBACK360_ANSWER_REPOSITORY, useExisting: Feedback360AnswerRepository },
    { provide: FEEDBACK360_RESPONDENT_REPOSITORY, useExisting: Feedback360RespondentRepository },
    { provide: FEEDBACK360_REVIEWER_REPOSITORY, useExisting: Feedback360ReviewerRepository },
    { provide: FEEDBACK360_CLUSTER_SCORE_REPOSITORY, useExisting: Feedback360ClusterScoreRepository },
  ],
  exports: [Feedback360CycleService, Feedback360Service],
})
export class PerformanceModule { }
