import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
  FEEDBACK360_REVIEWER_REPOSITORY,
  Feedback360ReviewerRepositoryPort,
} from '../../application/ports/feedback360-reviewer.repository.port';
import { Feedback360ReviewerRelationDomain } from '../../domain/feedback360-reviewer-relation.domain';
import { PerformanceMapper } from './performance.mapper';

@Injectable()
export class Feedback360ReviewerRepository implements Feedback360ReviewerRepositoryPort {
  readonly [FEEDBACK360_REVIEWER_REPOSITORY] = FEEDBACK360_REVIEWER_REPOSITORY;

  constructor(private readonly prisma: PrismaService) { }

  async create(relation: Feedback360ReviewerRelationDomain): Promise<Feedback360ReviewerRelationDomain> {
    const created = await this.prisma.feedback360ReviewerRelation.create({
      data: {
        feedback360Id: relation.feedback360Id,
        userId: relation.userId,
      },
    });
    return PerformanceMapper.toReviewerDomain(created);
  }

  async listByFeedback(feedback360Id: number): Promise<Feedback360ReviewerRelationDomain[]> {
    const items = await this.prisma.feedback360ReviewerRelation.findMany({ where: { feedback360Id } });
    return items.map(PerformanceMapper.toReviewerDomain);
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.feedback360ReviewerRelation.delete({ where: { id } });
  }
}
