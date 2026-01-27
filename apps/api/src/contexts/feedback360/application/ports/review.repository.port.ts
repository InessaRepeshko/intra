import { SortDirection } from '@intra/shared-kernel';
import { ReviewStage } from '@intra/shared-kernel';
import { ReviewDomain } from '../../domain/review.domain';

export const REVIEW_REPOSITORY = Symbol('FEEDBACK360.REVIEW_REPOSITORY');

export enum ReviewSortField {
  ID = 'id',
  RATEE_ID = 'rateeId',
  RATEE_FULL_NAME = 'rateeFullName',
  RATEE_POSITION_ID = 'rateePositionId',
  RATEE_POSITION_TITLE = 'rateePositionTitle',
  HR_ID = 'hrId',
  HR_FULL_NAME = 'hrFullName',
  HR_NOTE = 'hrNote',
  TEAM_ID = 'teamId',
  TEAM_TITLE = 'teamTitle',
  MANAGER_ID = 'managerId',
  MANAGER_FULL_NAME = 'managerFullName',
  MANAGER_POSITION_ID = 'managerPositionId',
  MANAGER_POSITION_TITLE = 'managerPositionTitle',
  CYCLE_ID = 'cycleId',
  STAGE = 'stage',
  REPORT_ID = 'reportId',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export type ReviewSearchQuery = {
  rateeId?: number;
  rateeFullName?: string;
  rateePositionId?: number;
  rateePositionTitle?: string;
  hrId?: number;
  hrFullName?: string,
  hrNote?: string;
  teamId?: number | null;
  teamTitle?: string | null;
  managerId?: number | null;
  managerFullName?: string | null,
  managerPositionId?: number | null,
  managerPositionTitle?: string | null,
  cycleId?: number | null;
  stage?: ReviewStage;
  reportId?: number | null;
  sortBy?: ReviewSortField;
  sortDirection?: SortDirection;
};

export type ReviewUpdatePayload = Partial<{
  rateeId: number;
  rateeFullName: string,
  rateePositionId: number;
  rateePositionTitle: string;
  hrId: number;
  hrFullName: string,
  hrNote: string | null;
  teamId: number | null;
  teamTitle: string | null;
  managerId: number | null;
  managerFullName: string | null,
  managerPositionId: number | null,
  managerPositionTitle: string | null,
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
