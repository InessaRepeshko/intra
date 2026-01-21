import { SortDirection } from '@intra/shared-kernel';
import { QuestionDomain } from '../../domain/question.domain';
import { AnswerType } from '../../domain/enums/answer-type.enum';
import { QuestionStatus } from '../../domain/enums/question-status.enum';

export const QUESTION_REPOSITORY = Symbol('LIBRARY.QUESTION_REPOSITORY');

export enum QuestionSortField {
  ID = 'id',
  TITLE = 'title',
  ANSWER_TYPE = 'answerType',
  STATUS = 'questionStatus',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export type QuestionSearchQuery = {
  competenceId?: number;
  positionId?: number;
  status?: QuestionStatus;
  answerType?: AnswerType;
  isForSelfassessment?: boolean;
  search?: string;
  sortBy?: QuestionSortField;
  sortDirection?: SortDirection;
};

export type QuestionUpdatePayload = Partial<{
  title: string;
  answerType: AnswerType;
  competenceId: number;
  isForSelfassessment: boolean;
  questionStatus: QuestionStatus;
}>;

export interface QuestionRepositoryPort {
  create(question: QuestionDomain): Promise<QuestionDomain>;
  findById(id: number): Promise<QuestionDomain | null>;
  search(query: QuestionSearchQuery): Promise<QuestionDomain[]>;
  updateById(id: number, patch: QuestionUpdatePayload): Promise<QuestionDomain>;
  deleteById(id: number): Promise<void>;
}

