import { AnswerDomain } from '../../domain/answer.domain';
import { RespondentCategory } from '@intra/shared-kernel';
import { SortDirection } from '@intra/shared-kernel';
import { AnswerType } from '@intra/shared-kernel';

export const ANSWER_REPOSITORY = Symbol('FEEDBACK360.ANSWER_REPOSITORY');

export enum AnswerSortField {
  ID = 'id',
  REVIEW_ID = 'reviewId',
  QUESTION_ID = 'questionId',
  RESPONDENT_CATEGORY = 'respondentCategory',
  ANSWER_TYPE = 'answerType',
  NUMERICAL_VALUE = 'numericalValue',
  TEXT_VALUE = 'textValue',
  CREATED_AT = 'createdAt',
}

export type AnswerSearchQuery = {
  reviewId?: number;
  questionId?: number;
  respondentCategory?: RespondentCategory;
  answerType?: AnswerType;
  numericalValue?: number;
  textValue?: string;
  sortBy?: AnswerSortField;
  sortDirection?: SortDirection;
};

export interface AnswerRepositoryPort {
  create(answer: AnswerDomain): Promise<AnswerDomain>;
  list(query: AnswerSearchQuery): Promise<AnswerDomain[]>;
  deleteById(id: number): Promise<void>;
}
