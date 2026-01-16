import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { CompetenceQuestionDomain } from '../../domain/competence-question.domain';
import { CompetenceQuestionAnswerType } from '../../domain/competence-question-answer-type.enum';
import { CompetenceQuestionStatus } from '../../domain/competence-question-status.enum';

export const COMPETENCE_QUESTION_REPOSITORY = Symbol('COMPETENCE.QUESTION_REPOSITORY');

export enum CompetenceQuestionSortField {
  ID = 'id',
  TITLE = 'title',
  ANSWER_TYPE = 'answerType',
  STATUS = 'questionStatus',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export type CompetenceQuestionSearchQuery = {
  competenceId?: number;
  positionId?: number;
  status?: CompetenceQuestionStatus;
  answerType?: CompetenceQuestionAnswerType;
  isForSelfassessment?: boolean;
  search?: string;
  sortBy?: CompetenceQuestionSortField;
  sortDirection?: SortDirection;
};

export type CompetenceQuestionUpdatePayload = Partial<{
  title: string;
  answerType: CompetenceQuestionAnswerType;
  competenceId: number;
  isForSelfassessment: boolean;
  questionStatus: CompetenceQuestionStatus;
}>;

export interface CompetenceQuestionRepositoryPort {
  create(question: CompetenceQuestionDomain): Promise<CompetenceQuestionDomain>;
  findById(id: number): Promise<CompetenceQuestionDomain | null>;
  search(query: CompetenceQuestionSearchQuery): Promise<CompetenceQuestionDomain[]>;
  updateById(id: number, patch: CompetenceQuestionUpdatePayload): Promise<CompetenceQuestionDomain>;
  deleteById(id: number): Promise<void>;
}

