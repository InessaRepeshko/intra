import { CompetenceQuestionPositionDomain } from '../../domain/competence-question-position.domain';

export const COMPETENCE_QUESTION_POSITION_REPOSITORY = Symbol('COMPETENCE.QUESTION_POSITION_REPOSITORY');

export interface CompetenceQuestionPositionRepositoryPort {
  link(questionId: number, positionId: number): Promise<CompetenceQuestionPositionDomain>;
  unlink(questionId: number, positionId: number): Promise<void>;
  listByQuestion(questionId: number): Promise<CompetenceQuestionPositionDomain[]>;
  replace(questionId: number, positionIds: number[]): Promise<CompetenceQuestionPositionDomain[]>;
}

