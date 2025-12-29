import { CreateFeedback360Data, Feedback360, Feedback360Stage, UpdateFeedback360Data } from '../model/feedback360';

export interface Feedback360Repository {
  create(data: CreateFeedback360Data): Promise<Feedback360>;
  findAll(): Promise<Feedback360[]>;
  findById(id: number): Promise<Feedback360 | null>;
  findByRateeId(rateeId: number): Promise<Feedback360[]>;
  findByHrId(hrId: number): Promise<Feedback360[]>;
  findByPositionId(positionId: number): Promise<Feedback360[]>;
  findByCycleId(cycleId: number): Promise<Feedback360[]>;
  findByReportId(reportId: number): Promise<Feedback360[]>;
  findByStage(stage: Feedback360Stage): Promise<Feedback360[]>;
  updateById(id: number, data: UpdateFeedback360Data): Promise<Feedback360>;
  deleteById(id: number): Promise<void>;
}


