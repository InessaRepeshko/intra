import { Injectable } from '@nestjs/common';
import { Feedback360 as PrismaFeedback360, feedback360_stage, Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PAGINATION_DEFAULT_TAKE, PAGINATION_MAX_TAKE } from 'src/common/constants/pagination.constants';
import type {
  Feedback360RepositoryPort,
  Feedback360SearchQuery,
  Feedback360SearchResult,
} from '../../application/repository-ports/feedback360.repository.port';
import { Feedback360Domain } from '../../domain/feedback/feedback360.domain';
import { Feedback360Stage } from '../../domain/enums/feedback360-stage.enum';

@Injectable()
export class Feedback360PrismaRepository implements Feedback360RepositoryPort {
  constructor(private readonly db: PrismaService) {}

  async create(entity: Feedback360Domain): Promise<Feedback360Domain> {
    const created = await this.db.feedback360.create({ data: this.toPrismaCreate(entity) });
    return this.fromPrisma(created);
  }

  async findAll(): Promise<Feedback360Domain[]> {
    const rows = await this.db.feedback360.findMany();
    return rows.map((r) => this.fromPrisma(r));
  }

  async search(query: Feedback360SearchQuery = {}): Promise<Feedback360SearchResult> {
    const take = Math.min(query.take ?? PAGINATION_DEFAULT_TAKE, PAGINATION_MAX_TAKE);
    const skip = query.skip ?? 0;

    const where: Prisma.Feedback360WhereInput = {
      ...(query.rateeId !== undefined ? { rateeId: query.rateeId } : {}),
      ...(query.hrId !== undefined ? { hrId: query.hrId } : {}),
      ...(query.positionId !== undefined ? { positionId: query.positionId } : {}),
      ...(query.cycleId !== undefined ? { cycleId: query.cycleId } : {}),
      ...(query.reportId !== undefined ? { reportId: query.reportId } : {}),
      ...(query.stage !== undefined ? { stage: query.stage as unknown as feedback360_stage } : {}),
      ...(query.search
        ? {
            OR: [
              { rateeNote: { contains: query.search } },
              { hrNote: { contains: query.search } },
            ],
          }
        : {}),
    };

    const [total, rows] = await Promise.all([
      this.db.feedback360.count({ where }),
      this.db.feedback360.findMany({
        where,
        skip,
        take,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      }),
    ]);

    const items = rows.map((r) => this.fromPrisma(r));
    return { items, count: items.length, total };
  }

  async findById(id: number): Promise<Feedback360Domain | null> {
    const row = await this.db.feedback360.findUnique({ where: { id } });
    return row ? this.fromPrisma(row) : null;
  }

  async findByRateeId(rateeId: number): Promise<Feedback360Domain[]> {
    const rows = await this.db.feedback360.findMany({ where: { rateeId } });
    return rows.map((r) => this.fromPrisma(r));
  }

  async findByHrId(hrId: number): Promise<Feedback360Domain[]> {
    const rows = await this.db.feedback360.findMany({ where: { hrId } });
    return rows.map((r) => this.fromPrisma(r));
  }

  async findByPositionId(positionId: number): Promise<Feedback360Domain[]> {
    const rows = await this.db.feedback360.findMany({ where: { positionId } });
    return rows.map((r) => this.fromPrisma(r));
  }

  async findByCycleId(cycleId: number): Promise<Feedback360Domain[]> {
    const rows = await this.db.feedback360.findMany({ where: { cycleId } });
    return rows.map((r) => this.fromPrisma(r));
  }

  async findByReportId(reportId: number): Promise<Feedback360Domain[]> {
    const rows = await this.db.feedback360.findMany({ where: { reportId } });
    return rows.map((r) => this.fromPrisma(r));
  }

  async findByStage(stage: Feedback360Stage): Promise<Feedback360Domain[]> {
    const rows = await this.db.feedback360.findMany({ where: { stage: stage as unknown as feedback360_stage } });
    return rows.map((r) => this.fromPrisma(r));
  }

  async updateById(id: number, patch: Partial<Feedback360Domain>): Promise<Feedback360Domain> {
    const updated = await this.db.feedback360.update({ where: { id }, data: this.toPrismaUpdate(patch) });
    return this.fromPrisma(updated);
  }

  async deleteById(id: number): Promise<void> {
    await this.db.feedback360.delete({ where: { id } });
  }

  private fromPrisma(row: PrismaFeedback360): Feedback360Domain {
    return new Feedback360Domain({
      id: row.id,
      rateeId: row.rateeId,
      rateeNote: row.rateeNote,
      positionId: row.positionId,
      hrId: row.hrId,
      hrNote: row.hrNote,
      cycleId: row.cycleId,
      stage: row.stage as unknown as Feedback360Stage,
      reportId: row.reportId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  private toPrismaCreate(domain: Feedback360Domain): Prisma.Feedback360UncheckedCreateInput {
    return {
      rateeId: domain.rateeId,
      rateeNote: domain.rateeNote,
      positionId: domain.positionId,
      hrId: domain.hrId,
      hrNote: domain.hrNote,
      cycleId: domain.cycleId,
      stage: domain.stage as unknown as feedback360_stage,
      reportId: domain.reportId,
    };
  }

  private toPrismaUpdate(domain: Partial<Feedback360Domain>): Prisma.Feedback360UncheckedUpdateInput {
    return {
      ...(domain.rateeNote !== undefined ? { rateeNote: domain.rateeNote } : {}),
      ...(domain.hrNote !== undefined ? { hrNote: domain.hrNote } : {}),
      ...(domain.stage !== undefined ? { stage: domain.stage as unknown as feedback360_stage } : {}),
    };
  }
}


