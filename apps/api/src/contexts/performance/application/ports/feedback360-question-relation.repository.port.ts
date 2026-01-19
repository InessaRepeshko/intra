import { Feedback360QuestionRelationDomain } from '../../domain/feedback360-question-relation.domain';

export const FEEDBACK360_QUESTION_RELATION_REPOSITORY = Symbol('PERFORMANCE.FEEDBACK360_QUESTION_RELATION_REPOSITORY');

export interface Feedback360QuestionRelationRepositoryPort {
  link(relation: Feedback360QuestionRelationDomain): Promise<Feedback360QuestionRelationDomain>;
  listByFeedback(feedback360Id: number): Promise<Feedback360QuestionRelationDomain[]>;
  unlink(feedback360Id: number, questionId: number): Promise<void>;
}
