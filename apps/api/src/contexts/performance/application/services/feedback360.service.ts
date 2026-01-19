import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AnswerType } from 'src/contexts/library/domain/answer-type.enum';
import { QuestionService as LibraryQuestionService } from 'src/contexts/library/application/services/question.service';
import {
  FEEDBACK360_REPOSITORY,
  Feedback360RepositoryPort,
  Feedback360SearchQuery,
  Feedback360UpdatePayload,
} from '../ports/feedback360.repository.port';
import {
  FEEDBACK360_QUESTION_REPOSITORY,
  Feedback360QuestionRepositoryPort,
  Feedback360QuestionSearchQuery,
} from '../ports/feedback360-question.repository.port';
import {
  FEEDBACK360_QUESTION_RELATION_REPOSITORY,
  Feedback360QuestionRelationRepositoryPort,
} from '../ports/feedback360-question-relation.repository.port';
import {
  FEEDBACK360_ANSWER_REPOSITORY,
  Feedback360AnswerRepositoryPort,
} from '../ports/feedback360-answer.repository.port';
import {
  FEEDBACK360_RESPONDENT_REPOSITORY,
  Feedback360RespondentRepositoryPort,
  Feedback360RespondentUpdatePayload,
  Feedback360RespondentSearchQuery,
} from '../ports/feedback360-respondent.repository.port';
import {
  FEEDBACK360_REVIEWER_REPOSITORY,
  Feedback360ReviewerRepositoryPort,
} from '../ports/feedback360-reviewer.repository.port';
import {
  FEEDBACK360_CLUSTER_SCORE_REPOSITORY,
  Feedback360ClusterScoreRepositoryPort,
  Feedback360ClusterScoreSearchQuery,
} from '../ports/feedback360-cluster-score.repository.port';
import { Feedback360Domain } from '../../domain/feedback360.domain';
import { Feedback360Stage } from '../../domain/feedback360-stage.enum';
import { Feedback360QuestionDomain } from '../../domain/feedback360-question.domain';
import { Feedback360QuestionRelationDomain } from '../../domain/feedback360-question-relation.domain';
import { Feedback360AnswerDomain } from '../../domain/feedback360-answer.domain';
import { RespondentCategory } from '../../domain/respondent-category.enum';
import { Feedback360RespondentRelationDomain } from '../../domain/feedback360-respondent-relation.domain';
import { Feedback360Status } from '../../domain/feedback360-status.enum';
import { Feedback360ReviewerRelationDomain } from '../../domain/feedback360-reviewer-relation.domain';
import { Feedback360ClusterScoreDomain } from '../../domain/feedback360-cluster-score.domain';
import { Feedback360CycleService } from './feedback360-cycle.service';

export type CreateFeedback360Command = {
  rateeId: number;
  rateeNote?: string;
  positionId: number;
  hrId: number;
  hrNote?: string;
  cycleId?: number | null;
  stage?: Feedback360Stage;
};

export type UpdateFeedback360Command = Partial<CreateFeedback360Command>;

export type CreateFeedback360QuestionCommand = {
  cycleId?: number | null;
  questionId?: number | null;
  title?: string;
  answerType?: AnswerType;
  competenceId?: number | null;
  positionId?: number | null;
  isForSelfassessment?: boolean | null;
};

export type AddQuestionToFeedbackCommand = {
  feedback360Id: number;
  questionId: number;
};

export type AddAnswerCommand = {
  feedback360Id: number;
  questionId: number;
  feedback360QuestionId?: number | null;
  respondentCategory: RespondentCategory;
  answerType: AnswerType;
  numericalValue?: number | null;
  textValue?: string | null;
};

export type AddRespondentCommand = {
  feedback360Id: number;
  respondentId: number;
  respondentCategory: RespondentCategory;
  feedback360Status?: Feedback360Status;
  respondentNote?: string | null;
  invitedAt?: Date | null;
  respondedAt?: Date | null;
};

export type AddReviewerCommand = {
  feedback360Id: number;
  userId: number;
};

export type UpsertClusterScoreCommand = {
  cycleId?: number | null;
  clusterId: number;
  userId: number;
  feedback360Id?: number | null;
  score: number;
};

@Injectable()
export class Feedback360Service {
  constructor(
    @Inject(FEEDBACK360_REPOSITORY) private readonly feedbacks: Feedback360RepositoryPort,
    @Inject(FEEDBACK360_QUESTION_REPOSITORY)
    private readonly cycleQuestions: Feedback360QuestionRepositoryPort,
    @Inject(FEEDBACK360_QUESTION_RELATION_REPOSITORY)
    private readonly questionRelations: Feedback360QuestionRelationRepositoryPort,
    @Inject(FEEDBACK360_ANSWER_REPOSITORY) private readonly answers: Feedback360AnswerRepositoryPort,
    @Inject(FEEDBACK360_RESPONDENT_REPOSITORY)
    private readonly respondents: Feedback360RespondentRepositoryPort,
    @Inject(FEEDBACK360_REVIEWER_REPOSITORY)
    private readonly reviewers: Feedback360ReviewerRepositoryPort,
    @Inject(FEEDBACK360_CLUSTER_SCORE_REPOSITORY)
    private readonly clusterScores: Feedback360ClusterScoreRepositoryPort,
    private readonly libraryQuestions: LibraryQuestionService,
    private readonly cycles: Feedback360CycleService,
  ) {}

  async create(command: CreateFeedback360Command): Promise<Feedback360Domain> {
    if (command.cycleId) {
      await this.cycles.getById(command.cycleId);
    }

    const feedback = Feedback360Domain.create({
      rateeId: command.rateeId,
      rateeNote: command.rateeNote,
      positionId: command.positionId,
      hrId: command.hrId,
      hrNote: command.hrNote,
      cycleId: command.cycleId ?? null,
      stage: command.stage ?? Feedback360Stage.VERIFICATION_BY_HR,
    });

    const created = await this.feedbacks.create(feedback);
    return this.getById(created.id!);
  }

  async search(query: Feedback360SearchQuery): Promise<Feedback360Domain[]> {
    return this.feedbacks.search(query);
  }

  async getById(id: number): Promise<Feedback360Domain> {
    const feedback = await this.feedbacks.findById(id);
    if (!feedback) throw new NotFoundException('Feedback360 not found');
    return feedback;
  }

  async update(id: number, patch: UpdateFeedback360Command): Promise<Feedback360Domain> {
    await this.getById(id);

    if (patch.cycleId) {
      await this.cycles.getById(patch.cycleId);
    }

    const payload: Feedback360UpdatePayload = {
      ...(patch.rateeId !== undefined ? { rateeId: patch.rateeId } : {}),
      ...(patch.rateeNote !== undefined ? { rateeNote: patch.rateeNote } : {}),
      ...(patch.positionId !== undefined ? { positionId: patch.positionId } : {}),
      ...(patch.hrId !== undefined ? { hrId: patch.hrId } : {}),
      ...(patch.hrNote !== undefined ? { hrNote: patch.hrNote } : {}),
      ...(patch.cycleId !== undefined ? { cycleId: patch.cycleId } : {}),
      ...(patch.stage !== undefined ? { stage: patch.stage } : {}),
    };

    await this.feedbacks.updateById(id, payload);
    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    await this.getById(id);
    await this.feedbacks.deleteById(id);
  }

  async createCycleQuestion(command: CreateFeedback360QuestionCommand): Promise<Feedback360QuestionDomain> {
    if (command.cycleId) {
      await this.cycles.getById(command.cycleId);
    }

    const baseQuestion = command.questionId ? await this.libraryQuestions.getById(command.questionId) : null;

    const title = command.title ?? baseQuestion?.title;
    const answerType = command.answerType ?? baseQuestion?.answerType;

    if (!title || !answerType) {
      throw new NotFoundException('Base question data is required to create feedback question');
    }

    const question = Feedback360QuestionDomain.create({
      cycleId: command.cycleId ?? null,
      questionId: command.questionId ?? null,
      title,
      answerType,
      competenceId: command.competenceId ?? baseQuestion?.competenceId ?? null,
      positionId: command.positionId ?? baseQuestion?.positionIds?.[0] ?? null,
      isForSelfassessment: command.isForSelfassessment ?? baseQuestion?.isForSelfassessment ?? false,
    });

    return this.cycleQuestions.create(question);
  }

  async listCycleQuestions(query: Feedback360QuestionSearchQuery): Promise<Feedback360QuestionDomain[]> {
    return this.cycleQuestions.search(query);
  }

  async deleteCycleQuestion(id: number): Promise<void> {
    await this.cycleQuestions.deleteById(id);
  }

  async attachQuestion(command: AddQuestionToFeedbackCommand): Promise<Feedback360QuestionRelationDomain> {
    await this.getById(command.feedback360Id);
    const question = await this.libraryQuestions.getById(command.questionId);

    const relation = Feedback360QuestionRelationDomain.create({
      feedback360Id: command.feedback360Id,
      questionId: question.id!,
      questionTitle: question.title,
      answerType: question.answerType,
      competenceId: question.competenceId,
      isForSelfassessment: question.isForSelfassessment,
    });

    return this.questionRelations.link(relation);
  }

  async listQuestionRelations(feedback360Id: number): Promise<Feedback360QuestionRelationDomain[]> {
    await this.getById(feedback360Id);
    return this.questionRelations.listByFeedback(feedback360Id);
  }

  async detachQuestion(feedback360Id: number, questionId: number): Promise<void> {
    await this.getById(feedback360Id);
    await this.questionRelations.unlink(feedback360Id, questionId);
  }

  async addAnswer(command: AddAnswerCommand): Promise<Feedback360AnswerDomain> {
    await this.getById(command.feedback360Id);

    const answer = Feedback360AnswerDomain.create({
      feedback360Id: command.feedback360Id,
      questionId: command.questionId,
      feedback360QuestionId: command.feedback360QuestionId ?? null,
      respondentCategory: command.respondentCategory,
      answerType: command.answerType,
      numericalValue: command.numericalValue ?? null,
      textValue: command.textValue ?? null,
    });

    return this.answers.create(answer);
  }

  async listAnswers(feedback360Id: number, respondentCategory?: RespondentCategory): Promise<Feedback360AnswerDomain[]> {
    await this.getById(feedback360Id);
    return this.answers.list({ feedback360Id, respondentCategory });
  }

  async addRespondent(command: AddRespondentCommand): Promise<Feedback360RespondentRelationDomain> {
    await this.getById(command.feedback360Id);

    const relation = Feedback360RespondentRelationDomain.create({
      feedback360Id: command.feedback360Id,
      respondentId: command.respondentId,
      respondentCategory: command.respondentCategory,
      feedback360Status: command.feedback360Status,
      respondentNote: command.respondentNote,
      invitedAt: command.invitedAt,
      respondedAt: command.respondedAt,
    });

    return this.respondents.create(relation);
  }

  async updateRespondent(id: number, patch: Feedback360RespondentUpdatePayload): Promise<Feedback360RespondentRelationDomain> {
    return this.respondents.updateById(id, patch);
  }

  async listRespondents(query: Feedback360RespondentSearchQuery): Promise<Feedback360RespondentRelationDomain[]> {
    return this.respondents.list(query);
  }

  async removeRespondent(id: number): Promise<void> {
    await this.respondents.deleteById(id);
  }

  async addReviewer(command: AddReviewerCommand): Promise<Feedback360ReviewerRelationDomain> {
    await this.getById(command.feedback360Id);
    const relation = Feedback360ReviewerRelationDomain.create({
      feedback360Id: command.feedback360Id,
      userId: command.userId,
    });
    return this.reviewers.create(relation);
  }

  async listReviewers(feedback360Id: number): Promise<Feedback360ReviewerRelationDomain[]> {
    await this.getById(feedback360Id);
    return this.reviewers.listByFeedback(feedback360Id);
  }

  async removeReviewer(id: number): Promise<void> {
    await this.reviewers.deleteById(id);
  }

  async upsertClusterScore(command: UpsertClusterScoreCommand): Promise<Feedback360ClusterScoreDomain> {
    if (command.cycleId) {
      await this.cycles.getById(command.cycleId);
    }

    const score = Feedback360ClusterScoreDomain.create({
      cycleId: command.cycleId ?? null,
      clusterId: command.clusterId,
      userId: command.userId,
      feedback360Id: command.feedback360Id ?? null,
      score: command.score,
    });

    return this.clusterScores.upsert(score);
  }

  async listClusterScores(query: Feedback360ClusterScoreSearchQuery): Promise<Feedback360ClusterScoreDomain[]> {
    return this.clusterScores.list(query);
  }

  async removeClusterScore(id: number): Promise<void> {
    await this.clusterScores.deleteById(id);
  }
}
