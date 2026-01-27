import { RespondentDomain } from '../../domain/respondent.domain';
import { ResponseStatus, SortDirection } from '@intra/shared-kernel';
import { RespondentCategory } from '@intra/shared-kernel';

export const RESPONDENT_REPOSITORY = Symbol('FEEDBACK360.RESPONDENT_REPOSITORY');

export enum RespondentSortField {
  ID = 'id',
  REVIEW_ID = 'reviewId',
  RESPONDENT_ID = 'respondentId',
  FULL_NAME = 'fullName',
  CATEGORY = 'category',
  RESPONSE_STATUS = 'responseStatus',
  RESPONDENT_NOTE = 'respondentNote',
  HR_NOTE = 'hrNote',
  POSITION_ID = 'positionId',
  POSITION_TITLE = 'positionTitle',
  TEAM_ID = 'teamId',
  TEAM_TITLE = 'teamTitle',
  INVITED_AT = 'invitedAt',
  CANCELED_AT = 'canceledAt',
  RESPONDED_AT = 'respondedAt',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export type RespondentSearchQuery = {
  reviewId?: number;
  respondentId?: number;
  fullName?: string;
  category?: RespondentCategory;
  responseStatus?: ResponseStatus;
  respondentNote?: string;
  hrNote?: string;
  positionId?: number;
  positionTitle?: string;
  teamId?: number | null;
  teamTitle?: string | null;
  invitedAt?: Date;
  canceledAt?: Date;
  respondedAt?: Date;
  sortBy?: RespondentSortField;
  sortDirection?: SortDirection;
};

export type RespondentUpdatePayload = Partial<{
  category: RespondentCategory;
  responseStatus: ResponseStatus;
  respondentNote: string | null;
  hrNote: string | null;
  positionId: number;
  positionTitle: string;
  teamId: number | null;
  teamTitle: string | null;
  invitedAt: Date | null;
  canceledAt: Date | null;
  respondedAt: Date | null;
}>;

export interface RespondentRepositoryPort {
  create(relation: RespondentDomain): Promise<RespondentDomain>;
  listByReview(reviewId: number, query: RespondentSearchQuery): Promise<RespondentDomain[]>;
  updateById(id: number, patch: RespondentUpdatePayload): Promise<RespondentDomain>;
  deleteById(id: number): Promise<void>;
}
