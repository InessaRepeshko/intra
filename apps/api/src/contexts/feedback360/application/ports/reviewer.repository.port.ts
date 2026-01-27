import { ReviewerSearchQuery } from '@intra/shared-kernel';
import { ReviewerDomain } from '../../domain/reviewer.domain';

export const REVIEWER_REPOSITORY = Symbol('FEEDBACK360.REVIEWER_REPOSITORY');

export interface ReviewerRepositoryPort {
  create(relation: ReviewerDomain): Promise<ReviewerDomain>;
  listByReview(reviewId: number, query: ReviewerSearchQuery): Promise<ReviewerDomain[]>;
  deleteById(id: number): Promise<void>;
}
