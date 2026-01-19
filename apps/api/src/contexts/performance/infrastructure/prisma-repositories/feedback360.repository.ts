import { Injectable } from '@nestjs/common';
import { Prisma } from '@intra/database';
import { PrismaService } from 'src/database/prisma.service';
import {
  FEEDBACK360_REPOSITORY,
  Feedback360RepositoryPort,
  Feedback360SearchQuery,
  Feedback360SortField,
  Feedback360UpdatePayload,
} from '../../application/ports/feedback360.repository.port';
import { Feedback360Domain } from '../../domain/feedback360.domain';
import { PerformanceMapper } from './performance.mapper';
import { SortDirection } from 'src/common/enums/sort-direction.enum';

@Injectable()
export class Feedback360Repository implements Feedback360RepositoryPort {
  readonly [FEEDBACK360_REPOSITORY] = FEEDBACK360_REPOSITORY;

  constructor(private readonly prisma: PrismaService) { }

  async create(feedback: Feedback360Domain): Promise<Feedback360Domain> {
    const created = await this.prisma.feedback360.create({
      data: {
        rateeId: feedback.rateeId,
        rateeNote: feedback.rateeNote,
        positionId: feedback.positionId,
        hrId: feedback.hrId,
        hrNote: feedback.hrNote,
        cycleId: feedback.cycleId,
        stage: PerformanceMapper.toPrismaFeedbackStage(feedback.stage),
      },
    });

    return PerformanceMapper.toFeedbackDomain(created);
  }

  async findById(id: number): Promise<Feedback360Domain | null> {
    const feedback = await this.prisma.feedback360.findUnique({ where: { id } });
    return feedback ? PerformanceMapper.toFeedbackDomain(feedback) : null;
  }

  async search(query: Feedback360SearchQuery): Promise<Feedback360Domain[]> {
    const where = this.buildWhere(query);
    const orderBy = this.buildOrder(query);
    const items = await this.prisma.feedback360.findMany({ where, orderBy });
    return items.map(PerformanceMapper.toFeedbackDomain);
  }

  async updateById(id: number, patch: Feedback360UpdatePayload): Promise<Feedback360Domain> {
    const updated = await this.prisma.feedback360.update({
      where: { id },
      data: {
        ...patch,
        ...(patch.stage ? { stage: PerformanceMapper.toPrismaFeedbackStage(patch.stage) } : {}),
      },
    });
    return PerformanceMapper.toFeedbackDomain(updated);
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.feedback360.delete({ where: { id } });
  }

  private buildWhere(query: Feedback360SearchQuery): Prisma.Feedback360WhereInput {
    const { cycleId, rateeId, hrId, positionId, stage } = query;
    return {
      ...(cycleId ? { cycleId } : {}),
      ...(rateeId ? { rateeId } : {}),
      ...(hrId ? { hrId } : {}),
      ...(positionId ? { positionId } : {}),
      ...(stage ? { stage: PerformanceMapper.toPrismaFeedbackStage(stage) } : {}),
    };
  }

  private buildOrder(query: Feedback360SearchQuery): Prisma.Feedback360OrderByWithRelationInput[] {
    const field = query.sortBy ?? Feedback360SortField.CREATED_AT;
    const direction = query.sortDirection ?? SortDirection.DESC;
    return [{ [field]: direction.toLowerCase() as Prisma.SortOrder }];
  }
}
