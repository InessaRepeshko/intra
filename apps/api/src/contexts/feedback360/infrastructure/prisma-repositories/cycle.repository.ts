import { Injectable } from '@nestjs/common';
import { Prisma } from '@intra/database';
import { PrismaService } from 'src/database/prisma.service';
import {
  CYCLE_REPOSITORY,
  CycleRepositoryPort,
  CycleSearchQuery,
  CycleSortField,
  CycleUpdatePayload,
} from '../../application/ports/cycle.repository.port';
import { CycleDomain } from '../../domain/cycle.domain';
import { Feedback360Mapper } from './feedback360.mapper';
import { SortDirection } from '../../../../../../../packages/shared-kernel/src/common/enums/sort-direction.enum';

@Injectable()
export class CycleRepository implements CycleRepositoryPort {
  readonly [CYCLE_REPOSITORY] = CYCLE_REPOSITORY;

  constructor(private readonly prisma: PrismaService) { }

  async create(cycle: CycleDomain): Promise<CycleDomain> {
    const created = await this.prisma.cycle.create({
      data: {
        title: cycle.title,
        description: cycle.description,
        hrId: cycle.hrId,
        minRespondentsThreshold: cycle.minRespondentsThreshold,
        stage: Feedback360Mapper.toPrismaCycleStage(cycle.stage),
        isActive: cycle.isActive,
        startDate: cycle.startDate,
        reviewDeadline: cycle.reviewDeadline,
        approvalDeadline: cycle.approvalDeadline,
        responseDeadline: cycle.responseDeadline,
        endDate: cycle.endDate,
      },
    });

    return Feedback360Mapper.toCycleDomain(created);
  }

  async findById(id: number): Promise<CycleDomain | null> {
    const cycle = await this.prisma.cycle.findUnique({ where: { id } });
    return cycle ? Feedback360Mapper.toCycleDomain(cycle) : null;
  }

  async search(query: CycleSearchQuery): Promise<CycleDomain[]> {
    const where = this.buildWhere(query);
    const orderBy = this.buildOrder(query);

    const items = await this.prisma.cycle.findMany({
      where,
      orderBy,
    });

    return items.map(Feedback360Mapper.toCycleDomain);
  }

  async updateById(id: number, patch: CycleUpdatePayload): Promise<CycleDomain> {
    const updated = await this.prisma.cycle.update({
      where: { id },
      data: {
        ...patch,
        ...(patch.stage ? { stage: Feedback360Mapper.toPrismaCycleStage(patch.stage) } : {}),
      },
    });
    return Feedback360Mapper.toCycleDomain(updated);
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.cycle.delete({ where: { id } });
  }

  private buildWhere(query: CycleSearchQuery): Prisma.CycleWhereInput {
    const { hrId, stage, isActive, search } = query;
    return {
      ...(hrId ? { hrId } : {}),
      ...(stage ? { stage: Feedback360Mapper.toPrismaCycleStage(stage) } : {}),
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

  private buildOrder(query: CycleSearchQuery): Prisma.CycleOrderByWithRelationInput[] {
    const field = query.sortBy ?? CycleSortField.ID;
    const direction = query.sortDirection ?? SortDirection.DESC;
    return [{ [field]: direction.toLowerCase() as Prisma.SortOrder }];
  }
}
