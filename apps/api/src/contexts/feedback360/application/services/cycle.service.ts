import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CYCLE_REPOSITORY,
  CycleRepositoryPort,
} from '../ports/cycle.repository.port';
import { CycleDomain } from '../../domain/cycle.domain';
import { CycleStage, UpdateCyclePayload, CycleSearchQuery, CreateCyclePayload } from '@intra/shared-kernel';
import { CYCLE_CONSTRAINTS } from '@intra/shared-kernel';

@Injectable()
export class CycleService {
  constructor(
    @Inject(CYCLE_REPOSITORY)
    private readonly cycles: CycleRepositoryPort
  ) { }

  async create(payload: CreateCyclePayload): Promise<CycleDomain> {
    const cycle = CycleDomain.create({
      title: payload.title,
      description: payload.description,
      hrId: payload.hrId,
      stage: payload.stage ?? CycleStage.NEW,
      minRespondentsThreshold: payload.minRespondentsThreshold ?? CYCLE_CONSTRAINTS.ANONYMITY_THRESHOLD.MIN,
      isActive: payload.isActive ?? true,
      startDate: payload.startDate,
      reviewDeadline: payload.reviewDeadline,
      approvalDeadline: payload.approvalDeadline,
      responseDeadline: payload.responseDeadline,
      endDate: payload.endDate,
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

  async update(id: number, patch: UpdateCyclePayload): Promise<CycleDomain> {
    await this.getById(id);

    const payload: UpdateCyclePayload = {
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
