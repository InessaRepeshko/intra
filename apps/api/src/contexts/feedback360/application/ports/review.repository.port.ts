import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { ReviewStage } from '../../domain/enums/review-stage.enum';
import { ReviewDomain } from '../../domain/review.domain';

export const REVIEW_REPOSITORY = Symbol('FEEDBACK360.REVIEW_REPOSITORY');

export enum ReviewSortField {
  ID = 'id',
  STAGE = 'stage',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export type ReviewSearchQuery = {
  cycleId?: number;
  rateeId?: number;
  hrId?: number;
  positionId?: number;
  stage?: ReviewStage;
  sortBy?: ReviewSortField;
  sortDirection?: SortDirection;
};

export type ReviewUpdatePayload = Partial<{
  rateeId: number;
  rateeNote: string | null;
  positionId: number;
  hrId: number;
  hrNote: string | null;
  cycleId: number | null;
  stage: ReviewStage;
}>;

export interface ReviewRepositoryPort {
  create(review: ReviewDomain): Promise<ReviewDomain>;
  findById(id: number): Promise<ReviewDomain | null>;
  search(query: ReviewSearchQuery): Promise<ReviewDomain[]>;
  updateById(id: number, patch: ReviewUpdatePayload): Promise<ReviewDomain>;
  deleteById(id: number): Promise<void>;
}
