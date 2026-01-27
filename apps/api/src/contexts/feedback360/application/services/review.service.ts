import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AnswerType } from '@intra/shared-kernel';
import { QuestionTemplateService } from 'src/contexts/library/application/services/question-template.service';
import { CompetenceService } from 'src/contexts/library/application/services/competence.service';
import {
  REVIEW_REPOSITORY,
  ReviewRepositoryPort,
  ReviewSearchQuery,
  ReviewUpdatePayload,
} from '../ports/review.repository.port';
import {
  QUESTION_REPOSITORY as REVIEW_QUESTION_REPOSITORY,
  QuestionRepositoryPort,
  QuestionSearchQuery,
} from '../ports/question.repository.port';
import {
  REVIEW_QUESTION_RELATION_REPOSITORY,
  ReviewQuestionRelationRepositoryPort,
  ReviewQuestionRelationSearchQuery,
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
  ReviewerSearchQuery,
} from '../ports/reviewer.repository.port';
import {
  CLUSTER_SCORE_REPOSITORY,
  ClusterScoreRepositoryPort,
  ClusterScoreSearchQuery,
} from '../ports/cluster-score.repository.port';
import { ReviewDomain } from '../../domain/review.domain';
import { ReviewStage } from '@intra/shared-kernel';
import { QuestionDomain } from '../../domain/question.domain';
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
  rateeFullName: string,
  rateePositionId: number;
  rateePositionTitle: string;
  hrId: number;
  hrFullName: string,
  hrNote?: string;
  teamId?: number | null;
  teamTitle?: string | null;
  managerId?: number | null;
  managerFullName?: string | null,
  managerPositionId?: number | null,
  managerPositionTitle?: string | null,
  cycleId?: number | null;
  stage?: ReviewStage;
  reportId?: number | null;
};

export type UpdateReviewCommand = Partial<CreateReviewCommand>;

export type CreateQuestionCommand = {
  cycleId?: number | null;
  questionTemplateId?: number | null;
  title?: string;
  answerType?: AnswerType;
  competenceId?: number | null;
  isForSelfassessment?: boolean | null;
};

export type AddQuestionToReviewCommand = {
  reviewId: number;
  questionId: number;
};

export type AddAnswerCommand = {
  reviewId: number;
  questionId: number;
  respondentCategory: RespondentCategory;
  answerType: AnswerType;
  numericalValue?: number | null;
  textValue?: string | null;
};

export type AddRespondentCommand = {
  reviewId: number;
  respondentId: number;
  fullName: string;
  category: RespondentCategory;
  responseStatus?: ResponseStatus;
  respondentNote?: string | null;
  hrNote?: string | null;
  positionId: number;
  positionTitle: string;
  teamId?: number | null;
  teamTitle?: string | null;
  invitedAt?: Date | null;
  canceledAt?: Date | null;
  respondedAt?: Date | null;
};

export type AddReviewerCommand = {
  reviewId: number;
  reviewerId: number;
  fullName: string;
  positionId: number;
  positionTitle: string;
  teamId?: number | null;
  teamTitle?: string | null;
};

export type UpsertClusterScoreCommand = {
  cycleId?: number | null;
  clusterId: number;
  rateeId: number;
  reviewId: number;
  score: number;
  answersCount?: number;
};

@Injectable()
export class ReviewService {
  constructor(
    @Inject(REVIEW_REPOSITORY) private readonly reviews: ReviewRepositoryPort,
    @Inject(REVIEW_QUESTION_REPOSITORY)
    private readonly questions: QuestionRepositoryPort,
    @Inject(REVIEW_QUESTION_RELATION_REPOSITORY)
    private readonly questionRelations: ReviewQuestionRelationRepositoryPort,
    @Inject(ANSWER_REPOSITORY) private readonly answers: AnswerRepositoryPort,
    @Inject(RESPONDENT_REPOSITORY)
    private readonly respondents: RespondentRepositoryPort,
    @Inject(REVIEWER_REPOSITORY)
    private readonly reviewers: ReviewerRepositoryPort,
    @Inject(CLUSTER_SCORE_REPOSITORY)
    private readonly clusterScores: ClusterScoreRepositoryPort,
    private readonly questionTemplates: QuestionTemplateService,
    private readonly competences: CompetenceService,
    private readonly cycles: CycleService,
  ) { }

  async create(command: CreateReviewCommand): Promise<ReviewDomain> {
    if (command.cycleId) {
      await this.cycles.getById(command.cycleId);
    }

    const review = ReviewDomain.create({
      rateeId: command.rateeId,
      rateeFullName: command.rateeFullName,
      rateePositionId: command.rateePositionId,
      rateePositionTitle: command.rateePositionTitle,
      hrId: command.hrId,
      hrFullName: command.hrFullName,
      hrNote: command.hrNote,
      teamId: command.teamId ?? null,
      teamTitle: command.teamTitle ?? null,
      managerId: command.managerId ?? null,
      managerFullName: command.managerFullName ?? null,
      managerPositionId: command.managerPositionId ?? null,
      managerPositionTitle: command.managerPositionTitle ?? null,
      cycleId: command.cycleId ?? null,
      stage: command.stage ?? ReviewStage.VERIFICATION_BY_HR,
      reportId: command.reportId ?? null,
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
      ...(patch.rateeFullName !== undefined ? { rateeFullName: patch.rateeFullName } : {}),
      ...(patch.rateePositionId !== undefined ? { rateePositionId: patch.rateePositionId } : {}),
      ...(patch.rateePositionTitle !== undefined ? { rateePositionTitle: patch.rateePositionTitle } : {}),
      ...(patch.hrId !== undefined ? { hrId: patch.hrId } : {}),
      ...(patch.hrFullName !== undefined ? { hrFullName: patch.hrFullName } : {}),
      ...(patch.hrNote !== undefined ? { hrNote: patch.hrNote } : {}),
      ...(patch.teamId !== undefined ? { teamId: patch.teamId } : {}),
      ...(patch.teamTitle !== undefined ? { teamTitle: patch.teamTitle } : {}),
      ...(patch.managerId !== undefined ? { managerId: patch.managerId } : {}),
      ...(patch.managerFullName !== undefined ? { managerFullName: patch.managerFullName } : {}),
      ...(patch.managerPositionId !== undefined ? { managerPositionId: patch.managerPositionId } : {}),
      ...(patch.managerPositionTitle !== undefined ? { managerPositionTitle: patch.managerPositionTitle } : {}),
      ...(patch.cycleId !== undefined ? { cycleId: patch.cycleId } : {}),
      ...(patch.stage !== undefined ? { stage: patch.stage } : {}),
      ...(patch.reportId !== undefined ? { reportId: patch.reportId } : {}),
    };

    await this.reviews.updateById(id, payload);
    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    await this.getById(id);
    await this.reviews.deleteById(id);
  }

  async createQuestion(command: CreateQuestionCommand): Promise<QuestionDomain> {
    if (command.cycleId) {
      await this.cycles.getById(command.cycleId);
    }

    const baseQuestion = command.questionTemplateId ? await this.questionTemplates.getById(command.questionTemplateId) : null;

    const title = command.title ?? baseQuestion?.title;
    const answerType = command.answerType ?? baseQuestion?.answerType;

    if (!title || !answerType) {
      throw new NotFoundException('Base question data is required to create review question');
    }

    const question = QuestionDomain.create({
      cycleId: command.cycleId ?? null,
      questionTemplateId: command.questionTemplateId ?? null,
      title,
      answerType,
      competenceId: command.competenceId ?? baseQuestion?.competenceId ?? null,
      isForSelfassessment: command.isForSelfassessment ?? baseQuestion?.isForSelfassessment ?? false,
    });

    return this.questions.create(question);
  }

  async listQuestions(query: QuestionSearchQuery): Promise<QuestionDomain[]> {
    return this.questions.search(query);
  }

  async deleteQuestion(id: number): Promise<void> {
    await this.questions.deleteById(id);
  }

  async attachQuestion(command: AddQuestionToReviewCommand): Promise<ReviewQuestionRelationDomain> {
    await this.getById(command.reviewId);
    const question = await this.questionTemplates.getById(command.questionId);
    const competence = await this.competences.getById(question.competenceId);

    const relation = ReviewQuestionRelationDomain.create({
      reviewId: command.reviewId,
      questionId: question.id!,
      questionTitle: question.title,
      answerType: question.answerType,
      competenceId: question.competenceId,
      competenceTitle: competence.title,
      isForSelfassessment: question.isForSelfassessment,
    });

    return this.questionRelations.link(relation);
  }

  async listQuestionRelations(reviewId: number, query: ReviewQuestionRelationSearchQuery): Promise<ReviewQuestionRelationDomain[]> {
    await this.getById(reviewId);
    return this.questionRelations.listByReview(reviewId, query);
  }

  async detachQuestion(reviewId: number, questionId: number): Promise<void> {
    await this.getById(reviewId);
    await this.questionRelations.unlink(reviewId, questionId);
  }

  async addAnswer(command: AddAnswerCommand): Promise<AnswerDomain> {
    await this.getById(command.reviewId);

    const answer = AnswerDomain.create({
      reviewId: command.reviewId,
      questionId: command.questionId,
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
      fullName: command.fullName,
      category: command.category,
      responseStatus: command.responseStatus,
      respondentNote: command.respondentNote,
      hrNote: command.hrNote,
      positionId: command.positionId,
      positionTitle: command.positionTitle,
      teamId: command.teamId,
      teamTitle: command.teamTitle,
      invitedAt: command.invitedAt,
      canceledAt: command.canceledAt,
      respondedAt: command.respondedAt,
    });

    return this.respondents.create(relation);
  }

  async updateRespondent(id: number, patch: RespondentUpdatePayload): Promise<RespondentDomain> {
    return this.respondents.updateById(id, patch);
  }

  async listRespondents(reviewId: number, query: RespondentSearchQuery): Promise<RespondentDomain[]> {
    await this.getById(reviewId);
    return this.respondents.listByReview(reviewId, query);
  }

  async removeRespondent(id: number): Promise<void> {
    await this.respondents.deleteById(id);
  }

  async addReviewer(command: AddReviewerCommand): Promise<ReviewerDomain> {
    await this.getById(command.reviewId);
    const relation = ReviewerDomain.create({
      reviewId: command.reviewId,
      reviewerId: command.reviewerId,
      fullName: command.fullName,
      positionId: command.positionId,
      positionTitle: command.positionTitle,
      teamId: command.teamId,
      teamTitle: command.teamTitle,
    });
    return this.reviewers.create(relation);
  }

  async listReviewers(reviewId: number, query: ReviewerSearchQuery): Promise<ReviewerDomain[]> {
    await this.getById(reviewId);
    return this.reviewers.listByReview(reviewId, query);
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
      rateeId: command.rateeId,
      reviewId: command.reviewId,
      score: command.score,
      answersCount: command.answersCount ?? 1,
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
