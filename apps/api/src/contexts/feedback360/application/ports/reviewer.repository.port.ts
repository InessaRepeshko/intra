import { SortDirection } from '@intra/shared-kernel';
import { ReviewerDomain } from '../../domain/reviewer.domain';

export const REVIEWER_REPOSITORY = Symbol('FEEDBACK360.REVIEWER_REPOSITORY');

export enum ReviewerSortField {
  ID = 'id',
  REVIEW_ID = 'reviewId',
  REVIEWER_ID = 'reviewerId',
  FULL_NAME = 'fullName',
  POSITION_ID = 'positionId',
  POSITION_TITLE = 'positionTitle',
  TEAM_ID = 'teamId',
  TEAM_TITLE = 'teamTitle',
  CREATED_AT = 'createdAt',
}

export type ReviewerSearchQuery = {
  reviewId?: number;
  reviewerId?: number;
  fullName?: string;
  positionId?: number;
  positionTitle?: string;
  teamId?: number | null;
  teamTitle?: string | null;
  sortBy?: ReviewerSortField;
  sortDirection?: SortDirection;
};

export interface ReviewerRepositoryPort {
  create(relation: ReviewerDomain): Promise<ReviewerDomain>;
  listByReview(reviewId: number, query: ReviewerSearchQuery): Promise<ReviewerDomain[]>;
  deleteById(id: number): Promise<void>;
}
