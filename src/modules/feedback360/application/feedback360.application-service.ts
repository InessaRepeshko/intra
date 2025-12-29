import { Inject, Injectable } from '@nestjs/common';
import { Feedback360Repository } from '../domain/repositories/feedback360.repository';
import { FEEDBACK360_REPOSITORY } from '../domain/repositories/feedback360.repository.token';
import { Feedback360, Feedback360Stage } from '../domain/model/feedback360';
import { Feedback360NotFoundError } from '../domain/errors/feedback360-not-found.error';
import { CreateFeedback360Request } from './use-cases/create-feedback360.request';
import { UpdateFeedback360Request } from './use-cases/update-feedback360.request';
import { CreateFeedback360UseCase } from './use-cases/create-feedback360.usecase';
import { UpdateFeedback360UseCase } from './use-cases/update-feedback360.usecase';

@Injectable()
export class Feedback360ApplicationService {
  constructor(
    private readonly createFeedback: CreateFeedback360UseCase,
    private readonly updateFeedback: UpdateFeedback360UseCase,
    @Inject(FEEDBACK360_REPOSITORY) private readonly repo: Feedback360Repository,
  ) {}

  async create(req: CreateFeedback360Request): Promise<Feedback360> {
    return this.createFeedback.execute(req);
  }

  async findAll(): Promise<Feedback360[]> {
    return this.repo.findAll();
  }

  async findOne(id: number): Promise<Feedback360> {
    const feedback = await this.repo.findById(id);
    if (!feedback) throw new Feedback360NotFoundError(id);
    return feedback;
  }

  async findByRateeId(rateeId: number): Promise<Feedback360[]> {
    return this.repo.findByRateeId(rateeId);
  }

  async findByHrId(hrId: number): Promise<Feedback360[]> {
    return this.repo.findByHrId(hrId);
  }

  async findByPositionId(positionId: number): Promise<Feedback360[]> {
    return this.repo.findByPositionId(positionId);
  }

  async findByCycleId(cycleId: number): Promise<Feedback360[]> {
    return this.repo.findByCycleId(cycleId);
  }

  async findByReportId(reportId: number): Promise<Feedback360[]> {
    return this.repo.findByReportId(reportId);
  }

  async findByStage(stage: Feedback360Stage): Promise<Feedback360[]> {
    return this.repo.findByStage(stage);
  }

  async update(id: number, req: UpdateFeedback360Request): Promise<Feedback360> {
    return this.updateFeedback.execute(id, req);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.repo.deleteById(id);
  }
}


