import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
  REVIEWER_REPOSITORY,
  ReviewerRepositoryPort,
} from '../../application/ports/reviewer.repository.port';
import { ReviewerDomain } from '../../domain/reviewer.domain';
import { Feedback360Mapper } from './feedback360.mapper';

@Injectable()
export class ReviewerRepository implements ReviewerRepositoryPort {
  readonly [REVIEWER_REPOSITORY] = REVIEWER_REPOSITORY;

  constructor(private readonly prisma: PrismaService) { }

  async create(relation: ReviewerDomain): Promise<ReviewerDomain> {
    const created = await this.prisma.reviewer.create({
      data: {
        reviewId: relation.reviewId,
        userId: relation.userId,
      },
    });
    return Feedback360Mapper.toReviewerDomain(created);
  }

  async listByReview(reviewId: number): Promise<ReviewerDomain[]> {
    const items = await this.prisma.reviewer.findMany({ where: { reviewId: reviewId } });
    return items.map(Feedback360Mapper.toReviewerDomain);
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.reviewer.delete({ where: { id } });
  }
}
