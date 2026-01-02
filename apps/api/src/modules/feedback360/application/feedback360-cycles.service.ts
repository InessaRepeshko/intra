import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IDENTITY_READ } from './external-ports/identity-read.port';
import type { IdentityReadPort } from './external-ports/identity-read.port';
import { FEEDBACK360_CYCLE_REPOSITORY } from './repository-ports/feedback360-cycle.repository.port';
import type {
  Feedback360CycleRepositoryPort,
  Feedback360CycleSearchQuery,
  Feedback360CycleSearchResult,
} from './repository-ports/feedback360-cycle.repository.port';
import { Feedback360CycleDomain } from '../domain/cycle/feedback360-cycle.domain';
import { CycleStage } from '../domain/enums/cycle-stage.enum';

export type CreateFeedback360CycleInput = {
  title: string;
  description?: string | null;
  hrId: number;
  stage?: CycleStage;
  isActive?: boolean | null;
  startDate: Date;
  reviewDeadline?: Date | null;
  approvalDeadline?: Date | null;
  surveyDeadline?: Date | null;
  endDate: Date;
};

export type UpdateFeedback360CycleInput = {
  title?: string;
  description?: string | null;
  hrId?: number;
  stage?: CycleStage;
  isActive?: boolean | null;
  startDate?: Date;
  reviewDeadline?: Date | null;
  approvalDeadline?: Date | null;
  surveyDeadline?: Date | null;
  endDate?: Date;
};

@Injectable()
export class Feedback360CyclesService {
  constructor(
    @Inject(FEEDBACK360_CYCLE_REPOSITORY) private readonly cyclesRepo: Feedback360CycleRepositoryPort,
    @Inject(IDENTITY_READ) private readonly identity: IdentityReadPort,
  ) {}

  async create(input: CreateFeedback360CycleInput): Promise<Feedback360CycleDomain> {
    await this.ensureUserExists(input.hrId);

    const cycle = new Feedback360CycleDomain({
      title: input.title,
      description: input.description ?? null,
      hrId: input.hrId,
      stage: input.stage ?? CycleStage.NEW,
      isActive: input.isActive ?? null,
      startDate: input.startDate,
      reviewDeadline: input.reviewDeadline ?? null,
      approvalDeadline: input.approvalDeadline ?? null,
      surveyDeadline: input.surveyDeadline ?? null,
      endDate: input.endDate,
    });

    return this.cyclesRepo.create(cycle);
  }

  async search(query?: Feedback360CycleSearchQuery): Promise<Feedback360CycleSearchResult> {
    return this.cyclesRepo.search(query);
  }

  async findOne(id: number): Promise<Feedback360CycleDomain> {
    const found = await this.cyclesRepo.findById(id);
    if (!found) throw new NotFoundException('Feedback360Cycle not found');
    return found;
  }

  async update(id: number, patch: UpdateFeedback360CycleInput): Promise<Feedback360CycleDomain> {
    await this.findOne(id);
    if (patch.hrId !== undefined) await this.ensureUserExists(patch.hrId);
    return this.cyclesRepo.updateById(id, patch);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.cyclesRepo.deleteById(id);
  }

  private async ensureUserExists(userId: number): Promise<void> {
    const ok = await this.identity.userExists(userId);
    if (!ok) throw new NotFoundException('User not found');
  }
}


