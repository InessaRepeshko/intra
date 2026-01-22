import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  QUESTION_TEMPLATE_REPOSITORY,
  QuestionTemplateRepositoryPort,
  QuestionTemplateSearchQuery,
  QuestionTemplateUpdatePayload,
} from '../ports/question-template.repository.port';
import { CompetenceService } from './competence.service';
import { QuestionTemplateDomain } from '../../domain/question-template.domain';
import { AnswerType } from '@intra/shared-kernel';
import { QuestionTemplateStatus } from '@intra/shared-kernel';
import {
  QUESTION_TEMPLATE_POSITION_RELATION_REPOSITORY,
  QuestionTemplatePositionRelationRepositoryPort,
} from '../ports/question-template-position-relation.repository.port';
import { PositionService } from 'src/contexts/organisation/application/services/position.service';

export type CreateQuestionTemplateCommand = {
  competenceId: number;
  title: string;
  answerType: AnswerType;
  isForSelfassessment?: boolean;
  status?: QuestionTemplateStatus;
  positionIds?: number[];
};

export type UpdateQuestionTemplateCommand = Partial<CreateQuestionTemplateCommand>;

@Injectable()
export class QuestionTemplateService {
  constructor(
    @Inject(QUESTION_TEMPLATE_REPOSITORY) private readonly questionTemplates: QuestionTemplateRepositoryPort,
    @Inject(QUESTION_TEMPLATE_POSITION_RELATION_REPOSITORY)
    private readonly questionTemplatePositionRelations: QuestionTemplatePositionRelationRepositoryPort,
    private readonly competences: CompetenceService,
    private readonly positions: PositionService,
  ) { }

  async create(command: CreateQuestionTemplateCommand): Promise<QuestionTemplateDomain> {
    await this.competences.getById(command.competenceId);

    const question = QuestionTemplateDomain.create({
      competenceId: command.competenceId,
      title: command.title,
      answerType: command.answerType,
      isForSelfassessment: command.isForSelfassessment ?? false,
      status: command.status ?? QuestionTemplateStatus.ACTIVE,
    });

    const created = await this.questionTemplates.create(question);

    const positionIds = command.positionIds ? Array.from(new Set(command.positionIds)) : [];
    if (positionIds.length) {
      await this.ensurePositionsExist(positionIds);
      await this.questionTemplatePositionRelations.replace(created.id!, positionIds);
    }

    return this.getById(created.id!);
  }

  async search(query: QuestionTemplateSearchQuery): Promise<QuestionTemplateDomain[]> {
    return this.questionTemplates.search(query);
  }

  async getById(id: number): Promise<QuestionTemplateDomain> {
    const question = await this.questionTemplates.findById(id);
    if (!question) throw new NotFoundException('Question template not found');
    return question;
  }

  async update(id: number, patch: UpdateQuestionTemplateCommand): Promise<QuestionTemplateDomain> {
    const current = await this.getById(id);

    if (patch.competenceId && patch.competenceId !== current.competenceId) {
      await this.competences.getById(patch.competenceId);
    }

    const payload: QuestionTemplateUpdatePayload = {
      ...(patch.competenceId !== undefined ? { competenceId: patch.competenceId } : {}),
      ...(patch.title !== undefined ? { title: patch.title } : {}),
      ...(patch.answerType !== undefined ? { answerType: patch.answerType } : {}),
      ...(patch.isForSelfassessment !== undefined ? { isForSelfassessment: patch.isForSelfassessment } : {}),
      ...(patch.status !== undefined ? { status: patch.status } : {}),
    };

    await this.questionTemplates.updateById(id, payload);

    if (patch.positionIds) {
      const uniquePositions = Array.from(new Set(patch.positionIds));
      await this.ensurePositionsExist(uniquePositions);
      await this.questionTemplatePositionRelations.replace(id, uniquePositions);
    }

    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    await this.getById(id);
    await this.questionTemplates.deleteById(id);
  }

  async attachPosition(questionId: number, positionId: number): Promise<QuestionTemplateDomain> {
    await this.getById(questionId);
    await this.positions.getById(positionId);

    await this.questionTemplatePositionRelations.link(questionId, positionId);
    return this.getById(questionId);
  }

  async detachPosition(questionId: number, positionId: number): Promise<void> {
    await this.getById(questionId);
    await this.questionTemplatePositionRelations.unlink(questionId, positionId);
  }

  async listPositions(questionId: number): Promise<number[]> {
    await this.getById(questionId);
    const relations = await this.questionTemplatePositionRelations.listByQuestion(questionId);
    return relations.map((r) => r.positionId);
  }

  private async ensurePositionsExist(positionIds: number[]): Promise<void> {
    await Promise.all(positionIds.map((id) => this.positions.getById(id)));
  }
}

