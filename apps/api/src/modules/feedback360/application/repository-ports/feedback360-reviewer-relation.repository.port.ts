import { Feedback360ReviewerRelationDomain } from '../../domain/feedback-reviewer-relation/feedback360-reviewer-relation.domain';

export const FEEDBACK360_REVIEWER_RELATION_REPOSITORY = Symbol(
  'FEEDBACK360.FEEDBACK360_REVIEWER_RELATION_REPOSITORY',
);

export type Feedback360ReviewerRelationSearchQuery = {
  skip?: number;
  take?: number;
  feedback360Id?: number;
  userId?: number;
};

export type Feedback360ReviewerRelationSearchResult = {
  items: Feedback360ReviewerRelationDomain[];
  count: number;
  total: number;
};

export interface Feedback360ReviewerRelationRepositoryPort {
  create(entity: Feedback360ReviewerRelationDomain): Promise<Feedback360ReviewerRelationDomain>;
  search(query?: Feedback360ReviewerRelationSearchQuery): Promise<Feedback360ReviewerRelationSearchResult>;
  findById(id: number): Promise<Feedback360ReviewerRelationDomain | null>;
  updateById(id: number, patch: Partial<Feedback360ReviewerRelationDomain>): Promise<Feedback360ReviewerRelationDomain>;
  deleteById(id: number): Promise<void>;
}


