import { SortDirection } from '@intra/shared-kernel';
import { PositionDomain } from '../../domain/position.domain';

export const ORGANISATION_POSITION_REPOSITORY = Symbol('ORGANISATION.POSITION_REPOSITORY');

export enum PositionSortField {
  ID = 'id',
  TITLE = 'title',
  DESCRIPTION = 'description',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export type PositionSearchQuery = {
  search?: string;
  sortBy?: PositionSortField;
  sortDirection?: SortDirection;
};

export type PositionUpdatePayload = Partial<{
  title: string;
  description: string | null;
}>;

export interface PositionRepositoryPort {
  create(position: PositionDomain): Promise<PositionDomain>;
  findById(id: number): Promise<PositionDomain | null>;
  search(query: PositionSearchQuery): Promise<PositionDomain[]>;
  updateById(id: number, patch: PositionUpdatePayload): Promise<PositionDomain>;
  deleteById(id: number): Promise<void>;
}
