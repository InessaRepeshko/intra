import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AnswerType } from '@intra/shared-kernel';
import { QuestionTemplateService as LibraryQuestionService } from 'src/contexts/library/application/services/question-template.service';
import {
  REVIEW_REPOSITORY,
  ReviewRepositoryPort,
  ReviewSearchQuery,
  ReviewUpdatePayload,
} from '../ports/review.repository.port';
import {
  QUESTION_REPOSITORY as REVIEW_QUESTION_REPOSITORY,
  QuestionRepositoryPort as ReviewQuestionRepositoryPort,
  QuestionSearchQuery as ReviewQuestionSearchQuery,
} from '../ports/question.repository.port';
import {
  REVIEW_QUESTION_RELATION_REPOSITORY,
  ReviewQuestionRelationRepositoryPort,
} from '../ports/review-question-relation.repository.port';
import {
  ANSWER_REPOSITORY,
  AnswerRepositoryPort,
} from '../ports/answer.repository.port';
import {
  RESPONDENT_REPOSITORY,
  RespondentRepositoryPort,
  RespondentUpdatePayload,
  RespondentSearchQuery,
} from '../ports/respondent.repository.port';
import {
  REVIEWER_REPOSITORY,
  ReviewerRepositoryPort,
} from '../ports/reviewer.repository.port';
import {
  CLUSTER_SCORE_REPOSITORY,
  ClusterScoreRepositoryPort,
  ClusterScoreSearchQuery,
} from '../ports/cluster-score.repository.port';
import { ReviewDomain } from '../../domain/review.domain';
import { ReviewStage } from '@intra/shared-kernel';
import { QuestionDomain as ReviewQuestionDomain } from '../../domain/question.domain';
import { ReviewQuestionRelationDomain } from '../../domain/review-question-relation.domain';
import { AnswerDomain } from '../../domain/answer.domain';
import { RespondentCategory } from '@intra/shared-kernel';
import { RespondentDomain } from '../../domain/respondent.domain';
import { ResponseStatus } from '@intra/shared-kernel';
import { ReviewerDomain } from '../../domain/reviewer.domain';
import { ClusterScoreDomain } from '../../domain/cluster-score.domain';
import { CycleService } from './cycle.service';

export type CreateReviewCommand = {
  rateeId: number;
  rateeNote?: string;
  positionId: number;
  hrId: number;
  hrNote?: string;
  cycleId?: number | null;
  stage?: ReviewStage;
};

export type UpdateReviewCommand = Partial<CreateReviewCommand>;

export type CreateQuestionCommand = {
  cycleId?: number | null;
  questionId?: number | null;
  title?: string;
  answerType?: AnswerType;
  competenceId?: number | null;
  positionId?: number | null;
  isForSelfassessment?: boolean | null;
};

export type AddQuestionToReviewCommand = {
  reviewId: number;
  questionId: number;
};

export type AddAnswerCommand = {
  reviewId: number;
  questionId: number;
  reviewQuestionId?: number | null;
  respondentCategory: RespondentCategory;
  answerType: AnswerType;
  numericalValue?: number | null;
  textValue?: string | null;
};

export type AddRespondentCommand = {
  reviewId: number;
  respondentId: number;
  respondentCategory: RespondentCategory;
  responseStatus?: ResponseStatus;
  respondentNote?: string | null;
  invitedAt?: Date | null;
  respondedAt?: Date | null;
};

export type AddReviewerCommand = {
  reviewId: number;
  userId: number;
};

export type UpsertClusterScoreCommand = {
  cycleId?: number | null;
  clusterId: number;
  userId: number;
  reviewId?: number | null;
  score: number;
};

@Injectable()
export class ReviewService {
  constructor(
    @Inject(REVIEW_REPOSITORY) private readonly reviews: ReviewRepositoryPort,
    @Inject(REVIEW_QUESTION_REPOSITORY)
    private readonly cycleQuestions: ReviewQuestionRepositoryPort,
    @Inject(REVIEW_QUESTION_RELATION_REPOSITORY)
    private readonly questionRelations: ReviewQuestionRelationRepositoryPort,
    @Inject(ANSWER_REPOSITORY) private readonly answers: AnswerRepositoryPort,
    @Inject(RESPONDENT_REPOSITORY)
    private readonly respondents: RespondentRepositoryPort,
    @Inject(REVIEWER_REPOSITORY)
    private readonly reviewers: ReviewerRepositoryPort,
    @Inject(CLUSTER_SCORE_REPOSITORY)
    private readonly clusterScores: ClusterScoreRepositoryPort,
    private readonly libraryQuestions: LibraryQuestionService,
    private readonly cycles: CycleService,
  ) { }

  async create(command: CreateReviewCommand): Promise<ReviewDomain> {
    if (command.cycleId) {
      await this.cycles.getById(command.cycleId);
    }

    const review = ReviewDomain.create({
      rateeId: command.rateeId,
      rateeNote: command.rateeNote,
      positionId: command.positionId,
      hrId: command.hrId,
      hrNote: command.hrNote,
      cycleId: command.cycleId ?? null,
      stage: command.stage ?? ReviewStage.VERIFICATION_BY_HR,
    });

    const created = await this.reviews.create(review);
    return this.getById(created.id!);
  }

  async search(query: ReviewSearchQuery): Promise<ReviewDomain[]> {
    return this.reviews.search(query);
  }

  async getById(id: number): Promise<ReviewDomain> {
    const review = await this.reviews.findById(id);
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  async update(id: number, patch: UpdateReviewCommand): Promise<ReviewDomain> {
    await this.getById(id);

    if (patch.cycleId) {
      await this.cycles.getById(patch.cycleId);
    }

    const payload: ReviewUpdatePayload = {
      ...(patch.rateeId !== undefined ? { rateeId: patch.rateeId } : {}),
      ...(patch.rateeNote !== undefined ? { rateeNote: patch.rateeNote } : {}),
      ...(patch.positionId !== undefined ? { positionId: patch.positionId } : {}),
      ...(patch.hrId !== undefined ? { hrId: patch.hrId } : {}),
      ...(patch.hrNote !== undefined ? { hrNote: patch.hrNote } : {}),
      ...(patch.cycleId !== undefined ? { cycleId: patch.cycleId } : {}),
      ...(patch.stage !== undefined ? { stage: patch.stage } : {}),
    };

    await this.reviews.updateById(id, payload);
    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    await this.getById(id);
    await this.reviews.deleteById(id);
  }

  async createReviewQuestion(command: CreateQuestionCommand): Promise<ReviewQuestionDomain> {
    if (command.cycleId) {
      await this.cycles.getById(command.cycleId);
    }

    const baseQuestion = command.questionId ? await this.libraryQuestions.getById(command.questionId) : null;

    const title = command.title ?? baseQuestion?.title;
    const answerType = command.answerType ?? baseQuestion?.answerType;

    if (!title || !answerType) {
      throw new NotFoundException('Base question data is required to create review question');
    }

    const question = ReviewQuestionDomain.create({
      cycleId: command.cycleId ?? null,
      libraryQuestionId: command.questionId ?? null,
      title,
      answerType,
      competenceId: command.competenceId ?? baseQuestion?.competenceId ?? null,
      positionId: command.positionId ?? baseQuestion?.positionIds?.[0] ?? null,
      isForSelfassessment: command.isForSelfassessment ?? baseQuestion?.isForSelfassessment ?? false,
    });

    return this.cycleQuestions.create(question);
  }

  async listReviewQuestions(query: ReviewQuestionSearchQuery): Promise<ReviewQuestionDomain[]> {
    return this.cycleQuestions.search(query);
  }

  async deleteReviewQuestion(id: number): Promise<void> {
    await this.cycleQuestions.deleteById(id);
  }

  async attachQuestionToReview(command: AddQuestionToReviewCommand): Promise<ReviewQuestionRelationDomain> {
    await this.getById(command.reviewId);
    const question = await this.libraryQuestions.getById(command.questionId);

    const relation = ReviewQuestionRelationDomain.create({
      reviewId: command.reviewId,
      libraryQuestionId: question.id!,
      questionTitle: question.title,
      answerType: question.answerType,
      competenceId: question.competenceId,
      isForSelfassessment: question.isForSelfassessment,
    });

    return this.questionRelations.link(relation);
  }

  async listQuestionRelations(reviewId: number): Promise<ReviewQuestionRelationDomain[]> {
    await this.getById(reviewId);
    return this.questionRelations.listByReview(reviewId);
  }

  async detachQuestion(reviewId: number, questionId: number): Promise<void> {
    await this.getById(reviewId);
    await this.questionRelations.unlink(reviewId, questionId);
  }

  async addAnswer(command: AddAnswerCommand): Promise<AnswerDomain> {
    await this.getById(command.reviewId);

    const answer = AnswerDomain.create({
      reviewId: command.reviewId,
      libraryQuestionId: command.questionId,
      reviewQuestionId: command.reviewQuestionId ?? null,
      respondentCategory: command.respondentCategory,
      answerType: command.answerType,
      numericalValue: command.numericalValue ?? null,
      textValue: command.textValue ?? null,
    });

    return this.answers.create(answer);
  }

  async listAnswers(reviewId: number, respondentCategory?: RespondentCategory): Promise<AnswerDomain[]> {
    await this.getById(reviewId);
    return this.answers.list({ reviewId: reviewId, respondentCategory });
  }

  async addRespondent(command: AddRespondentCommand): Promise<RespondentDomain> {
    await this.getById(command.reviewId);

    const relation = RespondentDomain.create({
      reviewId: command.reviewId,
      respondentId: command.respondentId,
      respondentCategory: command.respondentCategory,
      responseStatus: command.responseStatus,
      respondentNote: command.respondentNote,
      invitedAt: command.invitedAt,
      respondedAt: command.respondedAt,
    });

    return this.respondents.create(relation);
  }

  async updateRespondent(id: number, patch: RespondentUpdatePayload): Promise<RespondentDomain> {
    return this.respondents.updateById(id, patch);
  }

  async listRespondents(query: RespondentSearchQuery): Promise<RespondentDomain[]> {
    return this.respondents.list(query);
  }

  async removeRespondent(id: number): Promise<void> {
    await this.respondents.deleteById(id);
  }

  async addReviewer(command: AddReviewerCommand): Promise<ReviewerDomain> {
    await this.getById(command.reviewId);
    const relation = ReviewerDomain.create({
      reviewId: command.reviewId,
      userId: command.userId,
    });
    return this.reviewers.create(relation);
  }

  async listReviewers(reviewId: number): Promise<ReviewerDomain[]> {
    await this.getById(reviewId);
    return this.reviewers.listByReview(reviewId);
  }

  async removeReviewer(id: number): Promise<void> {
    await this.reviewers.deleteById(id);
  }

  async upsertClusterScore(command: UpsertClusterScoreCommand): Promise<ClusterScoreDomain> {
    if (command.cycleId) {
      await this.cycles.getById(command.cycleId);
    }

    const score = ClusterScoreDomain.create({
      cycleId: command.cycleId ?? null,
      clusterId: command.clusterId,
      userId: command.userId,
      reviewId: command.reviewId ?? null,
      score: command.score,
    });

    return this.clusterScores.upsert(score);
  }

  async listClusterScores(query: ClusterScoreSearchQuery): Promise<ClusterScoreDomain[]> {
    return this.clusterScores.list(query);
  }

  async removeClusterScore(id: number): Promise<void> {
    await this.clusterScores.deleteById(id);
  }
}
