import { CycleDomain } from '../../domain/cycle.domain';
import { CycleSearchQuery, UpdateCyclePayload } from '@intra/shared-kernel';

export const CYCLE_REPOSITORY = Symbol('FEEDBACK360.CYCLE_REPOSITORY');

export interface CycleRepositoryPort {
  create(cycle: CycleDomain): Promise<CycleDomain>;
  findById(id: number): Promise<CycleDomain | null>;
  search(query: CycleSearchQuery): Promise<CycleDomain[]>;
  updateById(id: number, patch: UpdateCyclePayload): Promise<CycleDomain>;
  deleteById(id: number): Promise<void>;
}
