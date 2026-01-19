import { Feedback360ReviewerRelationDomain } from '../../domain/feedback360-reviewer-relation.domain';

export const FEEDBACK360_REVIEWER_REPOSITORY = Symbol('PERFORMANCE.FEEDBACK360_REVIEWER_REPOSITORY');

export interface Feedback360ReviewerRepositoryPort {
  create(relation: Feedback360ReviewerRelationDomain): Promise<Feedback360ReviewerRelationDomain>;
  listByFeedback(feedback360Id: number): Promise<Feedback360ReviewerRelationDomain[]>;
  deleteById(id: number): Promise<void>;
}
