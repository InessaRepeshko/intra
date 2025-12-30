import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FEEDBACK360_REPOSITORY } from './repository-ports/feedback360.repository.port';
import type { Feedback360RepositoryPort } from './repository-ports/feedback360.repository.port';
import { IDENTITY_READ } from './external-ports/identity-read.port';
import type { IdentityReadPort } from './external-ports/identity-read.port';
import { Feedback360Domain } from '../domain/feedback/feedback360.domain';
import { Feedback360Stage } from '../domain/enums/feedback360-stage.enum';

export type CreateFeedback360Input = {
  rateeId: number;
  rateeNote?: string | null;
  positionId: number;
  hrId: number;
  hrNote?: string | null;
  cycleId?: number | null;
  stage?: Feedback360Stage;
  reportId?: number | null;
};

export type UpdateFeedback360Input = {
  rateeNote?: string | null;
  hrNote?: string | null;
  stage?: Feedback360Stage;
};

@Injectable()
export class Feedback360Service {
  constructor(
    @Inject(FEEDBACK360_REPOSITORY) private readonly repo: Feedback360RepositoryPort,
    @Inject(IDENTITY_READ) private readonly identity: IdentityReadPort,
  ) { }

  async create(input: CreateFeedback360Input): Promise<Feedback360Domain> {
    await this.ensureUserExists(input.rateeId);
    await this.ensureUserExists(input.hrId);
    await this.ensurePositionExists(input.positionId);

    const feedback = new Feedback360Domain({
      rateeId: input.rateeId,
      rateeNote: input.rateeNote ?? null,
      positionId: input.positionId,
      hrId: input.hrId,
      hrNote: input.hrNote ?? null,
      cycleId: input.cycleId ?? null,
      stage: input.stage ?? Feedback360Stage.VERIFICATION_BY_HR,
      reportId: input.reportId ?? null,
    });

    return this.repo.create(feedback);
  }

  async findAll(): Promise<Feedback360Domain[]> {
    return this.repo.findAll();
  }

  async findOne(id: number): Promise<Feedback360Domain> {
    const found = await this.repo.findById(id);
    if (!found) throw new NotFoundException('Feedback360 not found');
    return found;
  }

  async findByRateeId(rateeId: number): Promise<Feedback360Domain[]> {
    return this.repo.findByRateeId(rateeId);
  }

  async findByHrId(hrId: number): Promise<Feedback360Domain[]> {
    return this.repo.findByHrId(hrId);
  }

  async findByPositionId(positionId: number): Promise<Feedback360Domain[]> {
    return this.repo.findByPositionId(positionId);
  }

  async findByCycleId(cycleId: number): Promise<Feedback360Domain[]> {
    return this.repo.findByCycleId(cycleId);
  }

  async findByReportId(reportId: number): Promise<Feedback360Domain[]> {
    return this.repo.findByReportId(reportId);
  }

  async findByStage(stage: Feedback360Stage): Promise<Feedback360Domain[]> {
    return this.repo.findByStage(stage);
  }

  async update(id: number, patch: UpdateFeedback360Input): Promise<Feedback360Domain> {
    await this.findOne(id);
    return this.repo.updateById(id, patch);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.repo.deleteById(id);
  }

  private async ensureUserExists(userId: number): Promise<void> {
    const ok = await this.identity.userExists(userId);
    if (!ok) throw new NotFoundException('User not found');
  }

  private async ensurePositionExists(positionId: number): Promise<void> {
    const ok = await this.identity.positionExists(positionId);
    if (!ok) throw new NotFoundException('Position not found');
  }
}
