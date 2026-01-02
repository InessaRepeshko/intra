import { Feedback360Domain } from '../../domain/feedback/feedback360.domain';
import { Feedback360Stage } from '../../domain/enums/feedback360-stage.enum';

export const FEEDBACK360_REPOSITORY = Symbol('FEEDBACK360.FEEDBACK360_REPOSITORY');

export type Feedback360SearchQuery = {
  skip?: number;
  take?: number;
  rateeId?: number;
  hrId?: number;
  positionId?: number;
  cycleId?: number;
  reportId?: number;
  stage?: Feedback360Stage;
  search?: string;
};

export type Feedback360SearchResult = {
  items: Feedback360Domain[];
  count: number;
  total: number;
};

export interface Feedback360RepositoryPort {
  create(entity: Feedback360Domain): Promise<Feedback360Domain>;
  findAll(): Promise<Feedback360Domain[]>;
  search(query?: Feedback360SearchQuery): Promise<Feedback360SearchResult>;
  findById(id: number): Promise<Feedback360Domain | null>;
  findByRateeId(rateeId: number): Promise<Feedback360Domain[]>;
  findByHrId(hrId: number): Promise<Feedback360Domain[]>;
  findByPositionId(positionId: number): Promise<Feedback360Domain[]>;
  findByCycleId(cycleId: number): Promise<Feedback360Domain[]>;
  findByReportId(reportId: number): Promise<Feedback360Domain[]>;
  findByStage(stage: Feedback360Stage): Promise<Feedback360Domain[]>;
  updateById(id: number, patch: Partial<Feedback360Domain>): Promise<Feedback360Domain>;
  deleteById(id: number): Promise<void>;
}


