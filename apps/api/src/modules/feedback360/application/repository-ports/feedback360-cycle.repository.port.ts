import { Feedback360CycleDomain } from '../../domain/cycle/feedback360-cycle.domain';
import { CycleStage } from '../../domain/enums/cycle-stage.enum';

export const FEEDBACK360_CYCLE_REPOSITORY = Symbol('FEEDBACK360.FEEDBACK360_CYCLE_REPOSITORY');

export type Feedback360CycleSearchQuery = {
  skip?: number;
  take?: number;
  hrId?: number;
  stage?: CycleStage;
  isActive?: boolean;
  search?: string;
  startDateFrom?: Date;
  startDateTo?: Date;
};

export type Feedback360CycleSearchResult = {
  items: Feedback360CycleDomain[];
  count: number;
  total: number;
};

export interface Feedback360CycleRepositoryPort {
  create(entity: Feedback360CycleDomain): Promise<Feedback360CycleDomain>;
  search(query?: Feedback360CycleSearchQuery): Promise<Feedback360CycleSearchResult>;
  findById(id: number): Promise<Feedback360CycleDomain | null>;
  updateById(id: number, patch: Partial<Feedback360CycleDomain>): Promise<Feedback360CycleDomain>;
  deleteById(id: number): Promise<void>;
}


