import { PositionDomain } from '../../domain/position/position.domain';

export const POSITION_REPOSITORY = Symbol('IDENTITY.POSITION_REPOSITORY');

export type PositionSearchQuery = {
  skip?: number;
  take?: number;
  title?: string;
  description?: string;
  search?: string;
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
  updateById(id: number, patch: Partial<PositionDomain>): Promise<PositionDomain>;
  deleteById(id: number): Promise<void>;
}


