import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
  REVIEWER_REPOSITORY,
  ReviewerRepositoryPort,
} from '../../application/ports/reviewer.repository.port';
import { ReviewerDomain } from '../../domain/reviewer.domain';
import { Feedback360Mapper } from './feedback360.mapper';
import { Prisma } from '@intra/database';
import { SortDirection, ReviewerSearchQuery, ReviewerSortField, } from '@intra/shared-kernel';

@Injectable()
export class ReviewerRepository implements ReviewerRepositoryPort {
  readonly [REVIEWER_REPOSITORY] = REVIEWER_REPOSITORY;

  constructor(private readonly prisma: PrismaService) { }

  async create(relation: ReviewerDomain): Promise<ReviewerDomain> {
    const created = await this.prisma.reviewer.create({
      data: {
        reviewId: relation.reviewId,
        reviewerId: relation.reviewerId,
        fullName: relation.fullName,
        positionId: relation.positionId,
        positionTitle: relation.positionTitle,
        teamId: relation.teamId,
        teamTitle: relation.teamTitle,
      },
    });
    return Feedback360Mapper.toReviewerDomain(created);
  }

  async listByReview(reviewId: number, query: ReviewerSearchQuery): Promise<ReviewerDomain[]> {
    const where = this.buildWhere(query);
    where.reviewId = reviewId;
    const orderBy = this.buildOrder(query);
    const items = await this.prisma.reviewer.findMany({ where, orderBy });
    return items.map(Feedback360Mapper.toReviewerDomain);
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.reviewer.delete({ where: { id } });
  }

  private buildWhere(query: ReviewerSearchQuery): Prisma.ReviewerWhereInput {
    const { reviewId, reviewerId, fullName, positionId, positionTitle, teamId, teamTitle } = query;
    return {
      ...(reviewId ? { reviewId } : {}),
      ...(reviewerId ? { reviewerId } : {}),
      ...(fullName ? { fullName: { contains: fullName, mode: 'insensitive' } } : {}),
      ...(positionId ? { positionId } : {}),
      ...(positionTitle ? { positionTitle: { contains: positionTitle, mode: 'insensitive' } } : {}),
      ...(teamId ? { teamId } : {}),
      ...(teamTitle ? { teamTitle: { contains: teamTitle, mode: 'insensitive' } } : {}),
    };
  }

  private buildOrder(query: ReviewerSearchQuery): Prisma.ReviewerOrderByWithRelationInput[] {
    const field = query.sortBy ?? ReviewerSortField.ID;
    const direction = query.sortDirection ?? SortDirection.ASC;
    return [{ [field]: direction.toLowerCase() as Prisma.SortOrder }];
  }
}
