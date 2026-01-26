import { SortDirection } from '@intra/shared-kernel';
import { QuestionDomain } from '../../domain/question.domain';
import { AnswerType } from '@intra/shared-kernel';

export const QUESTION_REPOSITORY = Symbol('FEEDBACK360.QUESTION_REPOSITORY');

export enum QuestionSortField {
  ID = 'id',
  CYCLE_ID = 'cycleId',
  QUESTION_TEMPLATE_ID = 'questionTemplateId',
  TITLE = 'title',
  ANSWER_TYPE = 'answerType',
  COMPETENCE_ID = 'competenceId',
  IS_FOR_SELFASSESSMENT = 'isForSelfassessment',
  CREATED_AT = 'createdAt',
}

export type QuestionSearchQuery = {
  cycleId?: number;
  questionTemplateId?: number;
  competenceId?: number;
  title?: string;
  answerType?: AnswerType;
  isForSelfassessment?: boolean;
  sortBy?: QuestionSortField;
  sortDirection?: SortDirection;
};

export interface QuestionRepositoryPort {
  create(question: QuestionDomain): Promise<QuestionDomain>;
  findById(id: number): Promise<QuestionDomain | null>;
  search(query: QuestionSearchQuery): Promise<QuestionDomain[]>;
  deleteById(id: number): Promise<void>;
}
