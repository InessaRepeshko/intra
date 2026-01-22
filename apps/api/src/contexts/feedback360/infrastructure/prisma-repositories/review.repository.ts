import { Injectable } from '@nestjs/common';
import { Prisma } from '@intra/database';
import { PrismaService } from 'src/database/prisma.service';
import {
  REVIEW_REPOSITORY,
  ReviewRepositoryPort,
  ReviewSearchQuery,
  ReviewSortField,
  ReviewUpdatePayload,
} from '../../application/ports/review.repository.port';
import { ReviewDomain } from '../../domain/review.domain';
import { Feedback360Mapper } from './feedback360.mapper';
import { SortDirection } from '@intra/shared-kernel';

@Injectable()
export class ReviewRepository implements ReviewRepositoryPort {
  readonly [REVIEW_REPOSITORY] = REVIEW_REPOSITORY;

  constructor(private readonly prisma: PrismaService) { }

  async create(review: ReviewDomain): Promise<ReviewDomain> {
    const created = await this.prisma.review.create({
      data: {
        rateeId: review.rateeId,
        rateePositionId: review.rateePositionId,
        rateePositionTitle: review.rateePositionTitle,
        hrId: review.hrId,
        hrNote: review.hrNote,
        teamId: review.teamId,
        teamTitle: review.teamTitle,
        managerId: review.managerId,
        cycleId: review.cycleId,
        stage: Feedback360Mapper.toPrismaReviewStage(review.stage),
      },
    });

    return Feedback360Mapper.toReviewDomain(created);
  }

  async findById(id: number): Promise<ReviewDomain | null> {
    const review = await this.prisma.review.findUnique({ where: { id } });
    return review ? Feedback360Mapper.toReviewDomain(review) : null;
  }

  async search(query: ReviewSearchQuery): Promise<ReviewDomain[]> {
    const where = this.buildWhere(query);
    const orderBy = this.buildOrder(query);
    const items = await this.prisma.review.findMany({ where, orderBy });
    return items.map(Feedback360Mapper.toReviewDomain);
  }

  async updateById(id: number, patch: ReviewUpdatePayload): Promise<ReviewDomain> {
    const updated = await this.prisma.review.update({
      where: { id },
      data: {
        ...patch,
        ...(patch.stage ? { stage: Feedback360Mapper.toPrismaReviewStage(patch.stage) } : {}),
      },
    });
    return Feedback360Mapper.toReviewDomain(updated);
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.review.delete({ where: { id } });
  }

  private buildWhere(query: ReviewSearchQuery): Prisma.ReviewWhereInput {
    const { cycleId, rateeId, hrId, rateePositionId, teamId, managerId, stage } = query;
    return {
      ...(cycleId ? { cycleId } : {}),
      ...(rateeId ? { rateeId } : {}),
      ...(hrId ? { hrId } : {}),
      ...(rateePositionId ? { rateePositionId } : {}),
      ...(teamId ? { teamId } : {}),
      ...(managerId ? { managerId } : {}),
      ...(stage ? { stage: Feedback360Mapper.toPrismaReviewStage(stage) } : {}),
    };
  }

  private buildOrder(query: ReviewSearchQuery): Prisma.ReviewOrderByWithRelationInput[] {
    const field = query.sortBy ?? ReviewSortField.CREATED_AT;
    const direction = query.sortDirection ?? SortDirection.DESC;
    return [{ [field]: direction.toLowerCase() as Prisma.SortOrder }];
  }
}
