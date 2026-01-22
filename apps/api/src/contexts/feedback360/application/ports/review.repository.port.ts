import { SortDirection } from '@intra/shared-kernel';
import { ReviewStage } from '@intra/shared-kernel';
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
  rateePositionId?: number;
  teamId?: number;
  managerId?: number;
  stage?: ReviewStage;
  sortBy?: ReviewSortField;
  sortDirection?: SortDirection;
};

export type ReviewUpdatePayload = Partial<{
  rateeId: number;
  rateePositionId: number;
  rateePositionTitle: string;
  hrId: number;
  hrNote: string | null;
  teamId: number | null;
  teamTitle: string | null;
  managerId: number | null;
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
