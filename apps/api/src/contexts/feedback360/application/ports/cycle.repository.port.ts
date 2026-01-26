import { SortDirection } from '@intra/shared-kernel';
import { CycleStage } from '@intra/shared-kernel';
import { CycleDomain } from '../../domain/cycle.domain';

export const CYCLE_REPOSITORY = Symbol('FEEDBACK360.CYCLE_REPOSITORY');

export enum CycleSortField {
  ID = 'id',
  TITLE = 'title',
  DESCRIPTION = 'description',
  HR_ID = 'hrId',
  MIN_RESPONDENTS_THRESHOLD = 'minRespondentsThreshold',
  STAGE = 'stage',
  IS_ACTIVE = 'isActive',
  START_DATE = 'startDate',
  REVIEW_DEADLINE = 'reviewDeadline',
  APPROVAL_DEADLINE = 'approvalDeadline',
  RESPONSE_DEADLINE = 'responseDeadline',
  END_DATE = 'endDate',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export type CycleSearchQuery = {
  title?: string;
  description?: string;
  search?: string;
  hrId?: number;
  minRespondentsThreshold?: number;
  stage?: CycleStage;
  isActive?: boolean;
  startDate?: Date;
  reviewDeadline?: Date;
  approvalDeadline?: Date;
  responseDeadline?: Date;
  endDate?: Date;
  sortBy?: CycleSortField;
  sortDirection?: SortDirection;
};

export type CycleUpdatePayload = Partial<{
  title: string;
  description: string | null;
  hrId: number;
  minRespondentsThreshold: number;
  stage: CycleStage;
  isActive: boolean | null;
  startDate: Date;
  reviewDeadline: Date | null;
  approvalDeadline: Date | null;
  responseDeadline: Date | null;
  endDate: Date;
}>;

export interface CycleRepositoryPort {
  create(cycle: CycleDomain): Promise<CycleDomain>;
  findById(id: number): Promise<CycleDomain | null>;
  search(query: CycleSearchQuery): Promise<CycleDomain[]>;
  updateById(id: number, patch: CycleUpdatePayload): Promise<CycleDomain>;
  deleteById(id: number): Promise<void>;
}
