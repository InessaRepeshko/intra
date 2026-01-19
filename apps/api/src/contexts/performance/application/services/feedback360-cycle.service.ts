import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  FEEDBACK360_CYCLE_REPOSITORY,
  Feedback360CycleRepositoryPort,
  Feedback360CycleSearchQuery,
  Feedback360CycleUpdatePayload,
} from '../ports/feedback360-cycle.repository.port';
import { Feedback360CycleDomain } from '../../domain/feedback360-cycle.domain';
import { CycleStage } from '../../domain/enum/cycle-stage.enum';

export type CreateFeedback360CycleCommand = {
  title: string;
  description?: string;
  hrId: number;
  stage?: CycleStage;
  isActive?: boolean;
  startDate: Date;
  reviewDeadline?: Date;
  approvalDeadline?: Date;
  surveyDeadline?: Date;
  endDate: Date;
};

export type UpdateFeedback360CycleCommand = Partial<CreateFeedback360CycleCommand>;

@Injectable()
export class Feedback360CycleService {
  constructor(
    @Inject(FEEDBACK360_CYCLE_REPOSITORY)
    private readonly cycles: Feedback360CycleRepositoryPort
  ) { }

  async create(command: CreateFeedback360CycleCommand): Promise<Feedback360CycleDomain> {
    const cycle = Feedback360CycleDomain.create({
      title: command.title,
      description: command.description,
      hrId: command.hrId,
      stage: command.stage ?? CycleStage.NEW,
      isActive: command.isActive ?? true,
      startDate: command.startDate,
      reviewDeadline: command.reviewDeadline,
      approvalDeadline: command.approvalDeadline,
      surveyDeadline: command.surveyDeadline,
      endDate: command.endDate,
    });

    const created = await this.cycles.create(cycle);
    return this.getById(created.id!);
  }

  async search(query: Feedback360CycleSearchQuery): Promise<Feedback360CycleDomain[]> {
    return this.cycles.search(query);
  }

  async getById(id: number): Promise<Feedback360CycleDomain> {
    const cycle = await this.cycles.findById(id);
    if (!cycle) throw new NotFoundException('Feedback360 cycle not found');
    return cycle;
  }

  async update(id: number, patch: UpdateFeedback360CycleCommand): Promise<Feedback360CycleDomain> {
    await this.getById(id);

    const payload: Feedback360CycleUpdatePayload = {
      ...(patch.title !== undefined ? { title: patch.title } : {}),
      ...(patch.description !== undefined ? { description: patch.description } : {}),
      ...(patch.hrId !== undefined ? { hrId: patch.hrId } : {}),
      ...(patch.stage !== undefined ? { stage: patch.stage } : {}),
      ...(patch.isActive !== undefined ? { isActive: patch.isActive } : {}),
      ...(patch.startDate !== undefined ? { startDate: patch.startDate } : {}),
      ...(patch.reviewDeadline !== undefined ? { reviewDeadline: patch.reviewDeadline } : {}),
      ...(patch.approvalDeadline !== undefined ? { approvalDeadline: patch.approvalDeadline } : {}),
      ...(patch.surveyDeadline !== undefined ? { surveyDeadline: patch.surveyDeadline } : {}),
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
