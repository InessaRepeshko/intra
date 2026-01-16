import { QuestionPositionDomain } from '../../domain/question-position.domain';

export const QUESTION_POSITION_REPOSITORY = Symbol('LIBRARY.QUESTION_POSITION_REPOSITORY');

export interface QuestionPositionRepositoryPort {
  link(questionId: number, positionId: number): Promise<QuestionPositionDomain>;
  unlink(questionId: number, positionId: number): Promise<void>;
  listByQuestion(questionId: number): Promise<QuestionPositionDomain[]>;
  replace(questionId: number, positionIds: number[]): Promise<QuestionPositionDomain[]>;
}

