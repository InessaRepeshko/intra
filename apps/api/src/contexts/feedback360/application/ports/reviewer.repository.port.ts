import { SortDirection } from '@intra/shared-kernel';
import { ReviewerDomain } from '../../domain/reviewer.domain';

export const REVIEWER_REPOSITORY = Symbol('FEEDBACK360.REVIEWER_REPOSITORY');

export enum ReviewerSortField {
  ID = 'id',
  REVIEW_ID = 'reviewId',
  REVIEWER_ID = 'reviewerId',
  POSITION_ID = 'positionId',
  POSITION_TITLE = 'positionTitle',
  CREATED_AT = 'createdAt',
}

export type ReviewerSearchQuery = {
  reviewId?: number;
  reviewerId?: number;
  positionId?: number;
  positionTitle?: string;
  sortBy?: ReviewerSortField;
  sortDirection?: SortDirection;
};

export interface ReviewerRepositoryPort {
  create(relation: ReviewerDomain): Promise<ReviewerDomain>;
  listByReview(reviewId: number, query: ReviewerSearchQuery): Promise<ReviewerDomain[]>;
  deleteById(id: number): Promise<void>;
}
