import { SortDirection } from '@intra/shared-kernel';
import { QuestionTemplateDomain } from '../../domain/question-template.domain';
import { AnswerType } from '@intra/shared-kernel';
import { QuestionTemplateStatus } from '@intra/shared-kernel';

export const QUESTION_TEMPLATE_REPOSITORY = Symbol('LIBRARY.QUESTION_TEMPLATE_REPOSITORY');

export enum QuestionTemplateSortField {
  ID = 'id',
  TITLE = 'title',
  ANSWER_TYPE = 'answerType',
  COMPELTECE_ID = 'competenceId',
  IS_FOR_SELFASSESSMENT = 'isForSelfassessment',
  STATUS = 'status',
  POSITION_IDS = 'positionIds',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export type QuestionTemplateSearchQuery = {
  title?: string;
  answerType?: AnswerType;
  competenceId?: number;
  isForSelfassessment?: boolean;
  status?: QuestionTemplateStatus;
  positionIds?: number[];
  sortBy?: QuestionTemplateSortField;
  sortDirection?: SortDirection;
};

export type QuestionTemplateUpdatePayload = Partial<{
  title: string;
  answerType: AnswerType;
  competenceId: number;
  isForSelfassessment: boolean;
  status: QuestionTemplateStatus;
  positionIds: number[];
}>;

export interface QuestionTemplateRepositoryPort {
  create(question: QuestionTemplateDomain): Promise<QuestionTemplateDomain>;
  findById(id: number): Promise<QuestionTemplateDomain | null>;
  search(query: QuestionTemplateSearchQuery): Promise<QuestionTemplateDomain[]>;
  updateById(id: number, patch: QuestionTemplateUpdatePayload): Promise<QuestionTemplateDomain>;
  deleteById(id: number): Promise<void>;
}

