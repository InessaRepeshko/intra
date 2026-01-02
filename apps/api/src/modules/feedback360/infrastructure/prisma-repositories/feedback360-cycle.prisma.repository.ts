import { Injectable } from '@nestjs/common';
import { Feedback360Cycle as PrismaFeedback360Cycle, Prisma, cycle_stage } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PAGINATION_DEFAULT_TAKE, PAGINATION_MAX_TAKE } from 'src/common/constants/pagination.constants';
import type {
  Feedback360CycleRepositoryPort,
  Feedback360CycleSearchQuery,
  Feedback360CycleSearchResult,
} from '../../application/repository-ports/feedback360-cycle.repository.port';
import { Feedback360CycleDomain } from '../../domain/cycle/feedback360-cycle.domain';
import { CycleStage } from '../../domain/enums/cycle-stage.enum';

@Injectable()
export class Feedback360CyclePrismaRepository implements Feedback360CycleRepositoryPort {
  constructor(private readonly db: PrismaService) {}

  async create(entity: Feedback360CycleDomain): Promise<Feedback360CycleDomain> {
    const created = await this.db.feedback360Cycle.create({ data: this.toPrismaCreate(entity) });
    return this.fromPrisma(created);
  }

  async search(query: Feedback360CycleSearchQuery = {}): Promise<Feedback360CycleSearchResult> {
    const take = Math.min(query.take ?? PAGINATION_DEFAULT_TAKE, PAGINATION_MAX_TAKE);
    const skip = query.skip ?? 0;

    const where: Prisma.Feedback360CycleWhereInput = {
      ...(query.hrId !== undefined ? { hrId: query.hrId } : {}),
      ...(query.stage !== undefined ? { stage: query.stage as unknown as cycle_stage } : {}),
      ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
      ...(query.startDateFrom || query.startDateTo
        ? {
            startDate: {
              ...(query.startDateFrom ? { gte: query.startDateFrom } : {}),
              ...(query.startDateTo ? { lte: query.startDateTo } : {}),
            },
          }
        : {}),
      ...(query.search
        ? {
            OR: [
              { title: { contains: query.search } },
              { description: { contains: query.search } },
            ],
          }
        : {}),
    };

    const [total, rows] = await Promise.all([
      this.db.feedback360Cycle.count({ where }),
      this.db.feedback360Cycle.findMany({
        where,
        skip,
        take,
        orderBy: [{ startDate: 'desc' }, { id: 'desc' }],
      }),
    ]);

    const items = rows.map((r) => this.fromPrisma(r));
    return { items, count: items.length, total };
  }

  async findById(id: number): Promise<Feedback360CycleDomain | null> {
    const row = await this.db.feedback360Cycle.findUnique({ where: { id } });
    return row ? this.fromPrisma(row) : null;
  }

  async updateById(id: number, patch: Partial<Feedback360CycleDomain>): Promise<Feedback360CycleDomain> {
    const updated = await this.db.feedback360Cycle.update({ where: { id }, data: this.toPrismaUpdate(patch) });
    return this.fromPrisma(updated);
  }

  async deleteById(id: number): Promise<void> {
    await this.db.feedback360Cycle.delete({ where: { id } });
  }

  private fromPrisma(row: PrismaFeedback360Cycle): Feedback360CycleDomain {
    return new Feedback360CycleDomain({
      id: row.id,
      title: row.title,
      description: row.description,
      hrId: row.hrId,
      stage: row.stage as unknown as CycleStage,
      isActive: row.isActive,
      startDate: row.startDate,
      reviewDeadline: row.reviewDeadline,
      approvalDeadline: row.approvalDeadline,
      surveyDeadline: row.surveyDeadline,
      endDate: row.endDate,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  private toPrismaCreate(domain: Feedback360CycleDomain): Prisma.Feedback360CycleUncheckedCreateInput {
    return {
      title: domain.title,
      description: domain.description,
      hrId: domain.hrId,
      stage: domain.stage as unknown as cycle_stage,
      isActive: domain.isActive,
      startDate: domain.startDate,
      reviewDeadline: domain.reviewDeadline,
      approvalDeadline: domain.approvalDeadline,
      surveyDeadline: domain.surveyDeadline,
      endDate: domain.endDate,
    };
  }

  private toPrismaUpdate(domain: Partial<Feedback360CycleDomain>): Prisma.Feedback360CycleUncheckedUpdateInput {
    return {
      ...(domain.title !== undefined ? { title: domain.title } : {}),
      ...(domain.description !== undefined ? { description: domain.description } : {}),
      ...(domain.hrId !== undefined ? { hrId: domain.hrId } : {}),
      ...(domain.stage !== undefined ? { stage: domain.stage as unknown as cycle_stage } : {}),
      ...(domain.isActive !== undefined ? { isActive: domain.isActive } : {}),
      ...(domain.startDate !== undefined ? { startDate: domain.startDate } : {}),
      ...(domain.reviewDeadline !== undefined ? { reviewDeadline: domain.reviewDeadline } : {}),
      ...(domain.approvalDeadline !== undefined ? { approvalDeadline: domain.approvalDeadline } : {}),
      ...(domain.surveyDeadline !== undefined ? { surveyDeadline: domain.surveyDeadline } : {}),
      ...(domain.endDate !== undefined ? { endDate: domain.endDate } : {}),
    };
  }
}


