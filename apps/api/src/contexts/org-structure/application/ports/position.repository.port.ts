import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { PositionDomain } from '../../domain/position.domain';

export const ORG_POSITION_REPOSITORY = Symbol('ORG_STRUCTURE.POSITION_REPOSITORY');

export enum PositionSortField {
  CREATED_AT = 'createdAt',
  TITLE = 'title',
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
