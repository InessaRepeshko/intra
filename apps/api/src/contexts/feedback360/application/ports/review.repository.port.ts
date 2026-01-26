import { SortDirection } from '@intra/shared-kernel';
import { ReviewStage } from '@intra/shared-kernel';
import { ReviewDomain } from '../../domain/review.domain';

export const REVIEW_REPOSITORY = Symbol('FEEDBACK360.REVIEW_REPOSITORY');

export enum ReviewSortField {
  ID = 'id',
  RATEE_ID = 'rateeId',
  RATEE_POSITION_ID = 'rateePositionId',
  RATEE_POSITION_TITLE = 'rateePositionTitle',
  HR_ID = 'hrId',
  HR_NOTE = 'hrNote',
  TEAM_ID = 'teamId',
  TEAM_TITLE = 'teamTitle',
  MANAGER_ID = 'managerId',
  CYCLE_ID = 'cycleId',
  STAGE = 'stage',
  REPORT_ID = 'reportId',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export type ReviewSearchQuery = {
  rateeId?: number;
  rateePositionId?: number;
  rateePositionTitle?: string;
  hrId?: number;
  hrNote?: string;
  teamId?: number;
  teamTitle?: string;
  managerId?: number;
  cycleId?: number;
  stage?: ReviewStage;
  reportId?: number;
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
  reportId: number | null;
}>;

export interface ReviewRepositoryPort {
  create(review: ReviewDomain): Promise<ReviewDomain>;
  findById(id: number): Promise<ReviewDomain | null>;
  search(query: ReviewSearchQuery): Promise<ReviewDomain[]>;
  updateById(id: number, patch: ReviewUpdatePayload): Promise<ReviewDomain>;
  deleteById(id: number): Promise<void>;
}
