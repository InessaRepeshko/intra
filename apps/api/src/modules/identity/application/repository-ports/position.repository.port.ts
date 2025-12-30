import { PositionDomain } from '../../domain/position/position.domain';

export const POSITION_REPOSITORY = Symbol('IDENTITY.POSITION_REPOSITORY');

export interface PositionRepositoryPort {
  create(position: PositionDomain): Promise<PositionDomain>;
  findAll(): Promise<PositionDomain[]>;
  findById(id: number): Promise<PositionDomain | null>;
  updateById(id: number, patch: Partial<PositionDomain>): Promise<PositionDomain>;
  deleteById(id: number): Promise<void>;
}


