import { Injectable } from '@nestjs/common';
import {
  Feedback360RespondentRelation as PrismaRel,
  Prisma,
  respondent_category,
  feedback360_status,
} from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PAGINATION_DEFAULT_TAKE, PAGINATION_MAX_TAKE } from 'src/common/constants/pagination.constants';
import type {
  Feedback360RespondentRelationRepositoryPort,
  Feedback360RespondentRelationSearchQuery,
  Feedback360RespondentRelationSearchResult,
} from '../../application/repository-ports/feedback360-respondent-relation.repository.port';
import { Feedback360RespondentRelationDomain } from '../../domain/feedback-respondent-relation/feedback360-respondent-relation.domain';
import { Feedback360Status } from '../../domain/enums/feedback360-status.enum';
import { RespondentCategory } from '../../domain/enums/respondent-category.enum';

@Injectable()
export class Feedback360RespondentRelationPrismaRepository implements Feedback360RespondentRelationRepositoryPort {
  constructor(private readonly db: PrismaService) {}

  async create(entity: Feedback360RespondentRelationDomain): Promise<Feedback360RespondentRelationDomain> {
    const created = await this.db.feedback360RespondentRelation.create({ data: this.toPrismaCreate(entity) });
    return this.fromPrisma(created);
  }

  async search(query: Feedback360RespondentRelationSearchQuery = {}): Promise<Feedback360RespondentRelationSearchResult> {
    const take = Math.min(query.take ?? PAGINATION_DEFAULT_TAKE, PAGINATION_MAX_TAKE);
    const skip = query.skip ?? 0;

    const where: Prisma.Feedback360RespondentRelationWhereInput = {
      ...(query.feedback360Id !== undefined ? { feedback360Id: query.feedback360Id } : {}),
      ...(query.respondentId !== undefined ? { respondentId: query.respondentId } : {}),
      ...(query.respondentCategory !== undefined
        ? { respondentCategory: query.respondentCategory as unknown as respondent_category }
        : {}),
      ...(query.feedback360Status !== undefined
        ? { feedback360Status: query.feedback360Status as unknown as feedback360_status }
        : {}),
      ...(query.search ? { respondentNote: { contains: query.search } } : {}),
    };

    const [total, rows] = await Promise.all([
      this.db.feedback360RespondentRelation.count({ where }),
      this.db.feedback360RespondentRelation.findMany({
        where,
        skip,
        take,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      }),
    ]);

    const items = rows.map((r) => this.fromPrisma(r));
    return { items, count: items.length, total };
  }

  async findById(id: number): Promise<Feedback360RespondentRelationDomain | null> {
    const row = await this.db.feedback360RespondentRelation.findUnique({ where: { id } });
    return row ? this.fromPrisma(row) : null;
  }

  async updateById(
    id: number,
    patch: Partial<Feedback360RespondentRelationDomain>,
  ): Promise<Feedback360RespondentRelationDomain> {
    const updated = await this.db.feedback360RespondentRelation.update({ where: { id }, data: this.toPrismaUpdate(patch) });
    return this.fromPrisma(updated);
  }

  async deleteById(id: number): Promise<void> {
    await this.db.feedback360RespondentRelation.delete({ where: { id } });
  }

  private fromPrisma(row: PrismaRel): Feedback360RespondentRelationDomain {
    return new Feedback360RespondentRelationDomain({
      id: row.id,
      feedback360Id: row.feedback360Id,
      respondentId: row.respondentId,
      respondentCategory: row.respondentCategory as unknown as RespondentCategory,
      feedback360Status: row.feedback360Status as unknown as Feedback360Status,
      respondentNote: row.respondentNote,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  private toPrismaCreate(domain: Feedback360RespondentRelationDomain): Prisma.Feedback360RespondentRelationUncheckedCreateInput {
    return {
      feedback360Id: domain.feedback360Id,
      respondentId: domain.respondentId,
      respondentCategory: domain.respondentCategory as unknown as respondent_category,
      feedback360Status: domain.feedback360Status as unknown as feedback360_status,
      respondentNote: domain.respondentNote,
    };
  }

  private toPrismaUpdate(domain: Partial<Feedback360RespondentRelationDomain>): Prisma.Feedback360RespondentRelationUncheckedUpdateInput {
    return {
      ...(domain.respondentCategory !== undefined
        ? { respondentCategory: domain.respondentCategory as unknown as respondent_category }
        : {}),
      ...(domain.feedback360Status !== undefined
        ? { feedback360Status: domain.feedback360Status as unknown as feedback360_status }
        : {}),
      ...(domain.respondentNote !== undefined ? { respondentNote: domain.respondentNote } : {}),
    };
  }
}


