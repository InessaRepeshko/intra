import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { PositionDomain } from '../entities/position.domain';
import { PositionSortField } from '../value-objects/position-sort-field.enum';

export const POSITION_REPOSITORY = Symbol('ORG_STRUCTURE.POSITION_REPOSITORY');

export type PositionSearchQuery = {
  skip?: number;
  take?: number;
  title?: string;
  description?: string;
  search?: string;
  sortBy?: PositionSortField;
  sortDirection?: SortDirection;
};

export type PositionSearchResult = {
  items: PositionDomain[];
  count: number;
  total: number;
};

export interface PositionRepositoryPort {
  create(position: PositionDomain): Promise<PositionDomain>;
  findAll(): Promise<PositionDomain[]>;
  search(query?: PositionSearchQuery): Promise<PositionSearchResult>;
  findById(id: number): Promise<PositionDomain | null>;
  findByIdWithRelations(id: number): Promise<PositionDomain | null>;
  updateById(id: number, patch: Partial<PositionDomain>): Promise<PositionDomain>;
  deleteById(id: number): Promise<void>;
}

