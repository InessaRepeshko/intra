import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { CycleStage } from '../../domain/enum/cycle-stage.enum';
import { Feedback360CycleDomain } from '../../domain/feedback360-cycle.domain';

export const FEEDBACK360_CYCLE_REPOSITORY = Symbol('PERFORMANCE.FEEDBACK360_CYCLE_REPOSITORY');

export enum Feedback360CycleSortField {
  ID = 'id',
  TITLE = 'title',
  STAGE = 'stage',
  START_DATE = 'startDate',
  END_DATE = 'endDate',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export type Feedback360CycleSearchQuery = {
  hrId?: number;
  stage?: CycleStage;
  isActive?: boolean;
  search?: string;
  sortBy?: Feedback360CycleSortField;
  sortDirection?: SortDirection;
};

export type Feedback360CycleUpdatePayload = Partial<{
  title: string;
  description: string | null;
  hrId: number;
  stage: CycleStage;
  isActive: boolean | null;
  startDate: Date;
  reviewDeadline: Date | null;
  approvalDeadline: Date | null;
  surveyDeadline: Date | null;
  endDate: Date;
}>;

export interface Feedback360CycleRepositoryPort {
  create(cycle: Feedback360CycleDomain): Promise<Feedback360CycleDomain>;
  findById(id: number): Promise<Feedback360CycleDomain | null>;
  search(query: Feedback360CycleSearchQuery): Promise<Feedback360CycleDomain[]>;
  updateById(id: number, patch: Feedback360CycleUpdatePayload): Promise<Feedback360CycleDomain>;
  deleteById(id: number): Promise<void>;
}
