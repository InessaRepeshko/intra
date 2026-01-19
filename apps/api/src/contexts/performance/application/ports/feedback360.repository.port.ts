import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { Feedback360Stage } from '../../domain/feedback360-stage.enum';
import { Feedback360Domain } from '../../domain/feedback360.domain';

export const FEEDBACK360_REPOSITORY = Symbol('PERFORMANCE.FEEDBACK360_REPOSITORY');

export enum Feedback360SortField {
  ID = 'id',
  STAGE = 'stage',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export type Feedback360SearchQuery = {
  cycleId?: number;
  rateeId?: number;
  hrId?: number;
  positionId?: number;
  stage?: Feedback360Stage;
  sortBy?: Feedback360SortField;
  sortDirection?: SortDirection;
};

export type Feedback360UpdatePayload = Partial<{
  rateeId: number;
  rateeNote: string | null;
  positionId: number;
  hrId: number;
  hrNote: string | null;
  cycleId: number | null;
  stage: Feedback360Stage;
}>;

export interface Feedback360RepositoryPort {
  create(feedback: Feedback360Domain): Promise<Feedback360Domain>;
  findById(id: number): Promise<Feedback360Domain | null>;
  search(query: Feedback360SearchQuery): Promise<Feedback360Domain[]>;
  updateById(id: number, patch: Feedback360UpdatePayload): Promise<Feedback360Domain>;
  deleteById(id: number): Promise<void>;
}
