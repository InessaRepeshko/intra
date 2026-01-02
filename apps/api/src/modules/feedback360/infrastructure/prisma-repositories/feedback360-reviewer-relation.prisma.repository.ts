import { Injectable } from '@nestjs/common';
import { Feedback360ReviewerRelation as PrismaRel, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PAGINATION_DEFAULT_TAKE, PAGINATION_MAX_TAKE } from 'src/common/constants/pagination.constants';
import type {
  Feedback360ReviewerRelationRepositoryPort,
  Feedback360ReviewerRelationSearchQuery,
  Feedback360ReviewerRelationSearchResult,
} from '../../application/repository-ports/feedback360-reviewer-relation.repository.port';
import { Feedback360ReviewerRelationDomain } from '../../domain/feedback-reviewer-relation/feedback360-reviewer-relation.domain';

@Injectable()
export class Feedback360ReviewerRelationPrismaRepository implements Feedback360ReviewerRelationRepositoryPort {
  constructor(private readonly db: PrismaService) {}

  async create(entity: Feedback360ReviewerRelationDomain): Promise<Feedback360ReviewerRelationDomain> {
    const created = await this.db.feedback360ReviewerRelation.create({ data: this.toPrismaCreate(entity) });
    return this.fromPrisma(created);
  }

  async search(query: Feedback360ReviewerRelationSearchQuery = {}): Promise<Feedback360ReviewerRelationSearchResult> {
    const take = Math.min(query.take ?? PAGINATION_DEFAULT_TAKE, PAGINATION_MAX_TAKE);
    const skip = query.skip ?? 0;

    const where: Prisma.Feedback360ReviewerRelationWhereInput = {
      ...(query.feedback360Id !== undefined ? { feedback360Id: query.feedback360Id } : {}),
      ...(query.userId !== undefined ? { userId: query.userId } : {}),
    };

    const [total, rows] = await Promise.all([
      this.db.feedback360ReviewerRelation.count({ where }),
      this.db.feedback360ReviewerRelation.findMany({
        where,
        skip,
        take,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      }),
    ]);

    const items = rows.map((r) => this.fromPrisma(r));
    return { items, count: items.length, total };
  }

  async findById(id: number): Promise<Feedback360ReviewerRelationDomain | null> {
    const row = await this.db.feedback360ReviewerRelation.findUnique({ where: { id } });
    return row ? this.fromPrisma(row) : null;
  }

  async deleteById(id: number): Promise<void> {
    await this.db.feedback360ReviewerRelation.delete({ where: { id } });
  }

  private fromPrisma(row: PrismaRel): Feedback360ReviewerRelationDomain {
    return new Feedback360ReviewerRelationDomain({
      id: row.id,
      feedback360Id: row.feedback360Id,
      userId: row.userId,
      createdAt: row.createdAt,
    });
  }

  private toPrismaCreate(domain: Feedback360ReviewerRelationDomain): Prisma.Feedback360ReviewerRelationUncheckedCreateInput {
    return {
      feedback360Id: domain.feedback360Id,
      userId: domain.userId,
    };
  }
}


