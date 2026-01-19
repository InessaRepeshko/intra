import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { Feedback360QuestionDomain } from '../../domain/feedback360-question.domain';
import { AnswerType } from 'src/contexts/library/domain/answer-type.enum';

export const FEEDBACK360_QUESTION_REPOSITORY = Symbol('PERFORMANCE.FEEDBACK360_QUESTION_REPOSITORY');

export enum Feedback360QuestionSortField {
  ID = 'id',
  CREATED_AT = 'createdAt',
}

export type Feedback360QuestionSearchQuery = {
  cycleId?: number;
  positionId?: number;
  competenceId?: number;
  answerType?: AnswerType;
  isForSelfassessment?: boolean;
  sortBy?: Feedback360QuestionSortField;
  sortDirection?: SortDirection;
};

export interface Feedback360QuestionRepositoryPort {
  create(question: Feedback360QuestionDomain): Promise<Feedback360QuestionDomain>;
  findById(id: number): Promise<Feedback360QuestionDomain | null>;
  search(query: Feedback360QuestionSearchQuery): Promise<Feedback360QuestionDomain[]>;
  deleteById(id: number): Promise<void>;
}
