import { Injectable } from '@nestjs/common';
import { Prisma } from '@intra/database';
import { PrismaService } from 'src/database/prisma.service';
import {
  FEEDBACK360_CYCLE_REPOSITORY,
  Feedback360CycleRepositoryPort,
  Feedback360CycleSearchQuery,
  Feedback360CycleSortField,
  Feedback360CycleUpdatePayload,
} from '../../application/ports/feedback360-cycle.repository.port';
import { Feedback360CycleDomain } from '../../domain/feedback360-cycle.domain';
import { PerformanceMapper } from './performance.mapper';
import { SortDirection } from 'src/common/enums/sort-direction.enum';

@Injectable()
export class Feedback360CycleRepository implements Feedback360CycleRepositoryPort {
  readonly [FEEDBACK360_CYCLE_REPOSITORY] = FEEDBACK360_CYCLE_REPOSITORY;

  constructor(private readonly prisma: PrismaService) { }

  async create(cycle: Feedback360CycleDomain): Promise<Feedback360CycleDomain> {
    const created = await this.prisma.feedback360Cycle.create({
      data: {
        title: cycle.title,
        description: cycle.description,
        hrId: cycle.hrId,
        stage: PerformanceMapper.toPrismaCycleStage(cycle.stage),
        isActive: cycle.isActive,
        startDate: cycle.startDate,
        reviewDeadline: cycle.reviewDeadline,
        approvalDeadline: cycle.approvalDeadline,
        surveyDeadline: cycle.surveyDeadline,
        endDate: cycle.endDate,
      },
    });

    return PerformanceMapper.toCycleDomain(created);
  }

  async findById(id: number): Promise<Feedback360CycleDomain | null> {
    const cycle = await this.prisma.feedback360Cycle.findUnique({ where: { id } });
    return cycle ? PerformanceMapper.toCycleDomain(cycle) : null;
  }

  async search(query: Feedback360CycleSearchQuery): Promise<Feedback360CycleDomain[]> {
    const where = this.buildWhere(query);
    const orderBy = this.buildOrder(query);

    const items = await this.prisma.feedback360Cycle.findMany({
      where,
      orderBy,
    });

    return items.map(PerformanceMapper.toCycleDomain);
  }

  async updateById(id: number, patch: Feedback360CycleUpdatePayload): Promise<Feedback360CycleDomain> {
    const updated = await this.prisma.feedback360Cycle.update({
      where: { id },
      data: {
        ...patch,
        ...(patch.stage ? { stage: PerformanceMapper.toPrismaCycleStage(patch.stage) } : {}),
      },
    });
    return PerformanceMapper.toCycleDomain(updated);
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.feedback360Cycle.delete({ where: { id } });
  }

  private buildWhere(query: Feedback360CycleSearchQuery): Prisma.Feedback360CycleWhereInput {
    const { hrId, stage, isActive, search } = query;
    return {
      ...(hrId ? { hrId } : {}),
      ...(stage ? { stage: PerformanceMapper.toPrismaCycleStage(stage) } : {}),
      ...(isActive !== undefined ? { isActive } : {}),
      ...(search
        ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
        : {}),
    };
  }

  private buildOrder(query: Feedback360CycleSearchQuery): Prisma.Feedback360CycleOrderByWithRelationInput[] {
    const field = query.sortBy ?? Feedback360CycleSortField.ID;
    const direction = query.sortDirection ?? SortDirection.DESC;
    return [{ [field]: direction.toLowerCase() as Prisma.SortOrder }];
  }
}
