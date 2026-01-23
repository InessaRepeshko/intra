import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CYCLE_REPOSITORY,
  CycleRepositoryPort,
  CycleSearchQuery,
  CycleUpdatePayload,
} from '../ports/cycle.repository.port';
import { CycleDomain } from '../../domain/cycle.domain';
import { CycleStage } from '@intra/shared-kernel';
import { CYCLE_CONSTRAINTS } from '@intra/shared-kernel';

export type CreateCycleCommand = {
  title: string;
  description?: string;
  hrId: number;
  minRespondentsThreshold?: number;
  stage?: CycleStage;
  isActive?: boolean;
  startDate: Date;
  reviewDeadline?: Date;
  approvalDeadline?: Date;
  responseDeadline?: Date;
  endDate: Date;
};

export type UpdateCycleCommand = Partial<CreateCycleCommand>;

@Injectable()
export class CycleService {
  constructor(
    @Inject(CYCLE_REPOSITORY)
    private readonly cycles: CycleRepositoryPort
  ) { }

  async create(command: CreateCycleCommand): Promise<CycleDomain> {
    const cycle = CycleDomain.create({
      title: command.title,
      description: command.description,
      hrId: command.hrId,
      stage: command.stage ?? CycleStage.NEW,
      minRespondentsThreshold: command.minRespondentsThreshold ?? CYCLE_CONSTRAINTS.ANONYMITY_THRESHOLD.MIN,
      isActive: command.isActive ?? true,
      startDate: command.startDate,
      reviewDeadline: command.reviewDeadline,
      approvalDeadline: command.approvalDeadline,
      responseDeadline: command.responseDeadline,
      endDate: command.endDate,
    });

    const created = await this.cycles.create(cycle);
    return this.getById(created.id!);
  }

  async search(query: CycleSearchQuery): Promise<CycleDomain[]> {
    return this.cycles.search(query);
  }

  async getById(id: number): Promise<CycleDomain> {
    const cycle = await this.cycles.findById(id);
    if (!cycle) throw new NotFoundException('Cycle not found');
    return cycle;
  }

  async update(id: number, patch: UpdateCycleCommand): Promise<CycleDomain> {
    await this.getById(id);

    const payload: CycleUpdatePayload = {
      ...(patch.title !== undefined ? { title: patch.title } : {}),
      ...(patch.description !== undefined ? { description: patch.description } : {}),
      ...(patch.hrId !== undefined ? { hrId: patch.hrId } : {}),
      ...(patch.stage !== undefined ? { stage: patch.stage } : {}),
      ...(patch.isActive !== undefined ? { isActive: patch.isActive } : {}),
      ...(patch.startDate !== undefined ? { startDate: patch.startDate } : {}),
      ...(patch.reviewDeadline !== undefined ? { reviewDeadline: patch.reviewDeadline } : {}),
      ...(patch.approvalDeadline !== undefined ? { approvalDeadline: patch.approvalDeadline } : {}),
      ...(patch.responseDeadline !== undefined ? { responseDeadline: patch.responseDeadline } : {}),
      ...(patch.endDate !== undefined ? { endDate: patch.endDate } : {}),
    };

    await this.cycles.updateById(id, payload);
    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    await this.getById(id);
    await this.cycles.deleteById(id);
  }
}
