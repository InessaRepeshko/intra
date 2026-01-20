import { ReviewerDomain } from '../../domain/reviewer.domain';

export const REVIEWER_REPOSITORY = Symbol('FEEDBACK360.REVIEWER_REPOSITORY');

export interface ReviewerRepositoryPort {
  create(relation: ReviewerDomain): Promise<ReviewerDomain>;
  listByReview(reviewId: number): Promise<ReviewerDomain[]>;
  deleteById(id: number): Promise<void>;
}
