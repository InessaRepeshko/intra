import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  QUESTION_REPOSITORY,
  QuestionRepositoryPort,
  QuestionSearchQuery,
  QuestionUpdatePayload,
} from '../ports/question.repository.port';
import { CompetenceService } from './competence.service';
import { QuestionDomain } from '../../domain/question.domain';
import { AnswerType } from '../../domain/answer-type.enum';
import { QuestionStatus } from '../../domain/question-status.enum';
import {
  QUESTION_POSITION_REPOSITORY,
  QuestionPositionRepositoryPort,
} from '../ports/question-position.repository.port';
import { PositionService } from 'src/contexts/organisation/application/services/position.service';

export type CreateQuestionCommand = {
  competenceId: number;
  title: string;
  answerType: AnswerType;
  isForSelfassessment?: boolean;
  questionStatus?: QuestionStatus;
  positionIds?: number[];
};

export type UpdateQuestionCommand = Partial<CreateQuestionCommand>;

@Injectable()
export class QuestionService {
  constructor(
    @Inject(QUESTION_REPOSITORY) private readonly questions: QuestionRepositoryPort,
    @Inject(QUESTION_POSITION_REPOSITORY)
    private readonly questionPositions: QuestionPositionRepositoryPort,
    private readonly competences: CompetenceService,
    private readonly positions: PositionService,
  ) { }

  async create(command: CreateQuestionCommand): Promise<QuestionDomain> {
    await this.competences.getById(command.competenceId);

    const question = QuestionDomain.create({
      competenceId: command.competenceId,
      title: command.title,
      answerType: command.answerType,
      isForSelfassessment: command.isForSelfassessment ?? false,
      questionStatus: command.questionStatus ?? QuestionStatus.ACTIVE,
    });

    const created = await this.questions.create(question);

    const positionIds = command.positionIds ? Array.from(new Set(command.positionIds)) : [];
    if (positionIds.length) {
      await this.ensurePositionsExist(positionIds);
      await this.questionPositions.replace(created.id!, positionIds);
    }

    return this.getById(created.id!);
  }

  async search(query: QuestionSearchQuery): Promise<QuestionDomain[]> {
    return this.questions.search(query);
  }

  async getById(id: number): Promise<QuestionDomain> {
    const question = await this.questions.findById(id);
    if (!question) throw new NotFoundException('Question not found');
    return question;
  }

  async update(id: number, patch: UpdateQuestionCommand): Promise<QuestionDomain> {
    const current = await this.getById(id);

    if (patch.competenceId && patch.competenceId !== current.competenceId) {
      await this.competences.getById(patch.competenceId);
    }

    const payload: QuestionUpdatePayload = {
      ...(patch.competenceId !== undefined ? { competenceId: patch.competenceId } : {}),
      ...(patch.title !== undefined ? { title: patch.title } : {}),
      ...(patch.answerType !== undefined ? { answerType: patch.answerType } : {}),
      ...(patch.isForSelfassessment !== undefined ? { isForSelfassessment: patch.isForSelfassessment } : {}),
      ...(patch.questionStatus !== undefined ? { questionStatus: patch.questionStatus } : {}),
    };

    await this.questions.updateById(id, payload);

    if (patch.positionIds) {
      const uniquePositions = Array.from(new Set(patch.positionIds));
      await this.ensurePositionsExist(uniquePositions);
      await this.questionPositions.replace(id, uniquePositions);
    }

    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    await this.getById(id);
    await this.questions.deleteById(id);
  }

  async attachPosition(questionId: number, positionId: number): Promise<QuestionDomain> {
    await this.getById(questionId);
    await this.positions.getById(positionId);

    await this.questionPositions.link(questionId, positionId);
    return this.getById(questionId);
  }

  async detachPosition(questionId: number, positionId: number): Promise<void> {
    await this.getById(questionId);
    await this.questionPositions.unlink(questionId, positionId);
  }

  async listPositions(questionId: number): Promise<number[]> {
    await this.getById(questionId);
    const relations = await this.questionPositions.listByQuestion(questionId);
    return relations.map((r) => r.positionId);
  }

  private async ensurePositionsExist(positionIds: number[]): Promise<void> {
    await Promise.all(positionIds.map((id) => this.positions.getById(id)));
  }
}

