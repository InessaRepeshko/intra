import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  COMPETENCE_QUESTION_REPOSITORY,
  CompetenceQuestionRepositoryPort,
  CompetenceQuestionSearchQuery,
  CompetenceQuestionUpdatePayload,
} from '../ports/competence-question.repository.port';
import { CompetenceService } from './competence.service';
import { CompetenceQuestionDomain } from '../../domain/competence-question.domain';
import { CompetenceQuestionAnswerType } from '../../domain/competence-question-answer-type.enum';
import { CompetenceQuestionStatus } from '../../domain/competence-question-status.enum';
import {
  COMPETENCE_QUESTION_POSITION_REPOSITORY,
  CompetenceQuestionPositionRepositoryPort,
} from '../ports/competence-question-position.repository.port';
import { PositionService } from 'src/contexts/org-structure/application/services/position.service';

export type CreateCompetenceQuestionCommand = {
  competenceId: number;
  title: string;
  answerType: CompetenceQuestionAnswerType;
  isForSelfassessment?: boolean;
  questionStatus?: CompetenceQuestionStatus;
  positionIds?: number[];
};

export type UpdateCompetenceQuestionCommand = Partial<CreateCompetenceQuestionCommand>;

@Injectable()
export class CompetenceQuestionService {
  constructor(
    @Inject(COMPETENCE_QUESTION_REPOSITORY) private readonly questions: CompetenceQuestionRepositoryPort,
    @Inject(COMPETENCE_QUESTION_POSITION_REPOSITORY)
    private readonly questionPositions: CompetenceQuestionPositionRepositoryPort,
    private readonly competences: CompetenceService,
    private readonly positions: PositionService,
  ) {}

  async create(command: CreateCompetenceQuestionCommand): Promise<CompetenceQuestionDomain> {
    await this.competences.getById(command.competenceId);

    const question = CompetenceQuestionDomain.create({
      competenceId: command.competenceId,
      title: command.title,
      answerType: command.answerType,
      isForSelfassessment: command.isForSelfassessment ?? false,
      questionStatus: command.questionStatus ?? CompetenceQuestionStatus.ACTIVE,
    });

    const created = await this.questions.create(question);

    const positionIds = command.positionIds ? Array.from(new Set(command.positionIds)) : [];
    if (positionIds.length) {
      await this.ensurePositionsExist(positionIds);
      await this.questionPositions.replace(created.id!, positionIds);
    }

    return this.getById(created.id!);
  }

  async search(query: CompetenceQuestionSearchQuery): Promise<CompetenceQuestionDomain[]> {
    return this.questions.search(query);
  }

  async getById(id: number): Promise<CompetenceQuestionDomain> {
    const question = await this.questions.findById(id);
    if (!question) throw new NotFoundException('Competence question not found');
    return question;
  }

  async update(id: number, patch: UpdateCompetenceQuestionCommand): Promise<CompetenceQuestionDomain> {
    const current = await this.getById(id);

    if (patch.competenceId && patch.competenceId !== current.competenceId) {
      await this.competences.getById(patch.competenceId);
    }

    const payload: CompetenceQuestionUpdatePayload = {
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

  async attachPosition(questionId: number, positionId: number): Promise<CompetenceQuestionDomain> {
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

