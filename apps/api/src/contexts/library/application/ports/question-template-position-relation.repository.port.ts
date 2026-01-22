import { QuestionTemplatePositionRelationDomain } from '../../domain/question-template-position-relation.domain';

export const QUESTION_TEMPLATE_POSITION_RELATION_REPOSITORY = Symbol('LIBRARY.QUESTION_TEMPLATE_POSITION_RELATION_REPOSITORY');

export interface QuestionTemplatePositionRelationRepositoryPort {
  link(questionId: number, positionId: number): Promise<QuestionTemplatePositionRelationDomain>;
  unlink(questionId: number, positionId: number): Promise<void>;
  listByQuestion(questionId: number): Promise<QuestionTemplatePositionRelationDomain[]>;
  replace(questionId: number, positionIds: number[]): Promise<QuestionTemplatePositionRelationDomain[]>;
}

