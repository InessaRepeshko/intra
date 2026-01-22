import { SortDirection } from '@intra/shared-kernel';
import { QuestionTemplateDomain } from '../../domain/question-template.domain';
import { AnswerType } from '@intra/shared-kernel';
import { QuestionTemplateStatus } from '@intra/shared-kernel';

export const QUESTION_TEMPLATE_REPOSITORY = Symbol('LIBRARY.QUESTION_TEMPLATE_REPOSITORY');

export enum QuestionTemplateSortField {
  ID = 'id',
  TITLE = 'title',
  ANSWER_TYPE = 'answerType',
  STATUS = 'status',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export type QuestionTemplateSearchQuery = {
  competenceId?: number;
  positionId?: number;
  status?: QuestionTemplateStatus;
  answerType?: AnswerType;
  isForSelfassessment?: boolean;
  search?: string;
  sortBy?: QuestionTemplateSortField;
  sortDirection?: SortDirection;
};

export type QuestionTemplateUpdatePayload = Partial<{
  title: string;
  answerType: AnswerType;
  competenceId: number;
  isForSelfassessment: boolean;
  status: QuestionTemplateStatus;
}>;

export interface QuestionTemplateRepositoryPort {
  create(question: QuestionTemplateDomain): Promise<QuestionTemplateDomain>;
  findById(id: number): Promise<QuestionTemplateDomain | null>;
  search(query: QuestionTemplateSearchQuery): Promise<QuestionTemplateDomain[]>;
  updateById(id: number, patch: QuestionTemplateUpdatePayload): Promise<QuestionTemplateDomain>;
  deleteById(id: number): Promise<void>;
}

