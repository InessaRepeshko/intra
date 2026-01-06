import { Injectable } from '@nestjs/common';
import { Position as PrismaPosition, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PAGINATION_DEFAULT_TAKE, PAGINATION_MAX_TAKE } from 'src/common/constants/pagination.constants';
import type { PositionRepositoryPort, PositionSearchQuery, PositionSearchResult } from '../../application/repository-ports/position.repository.port';
import { PositionDomain } from '../../domain/position/position.domain';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { PositionSortField } from '../../domain/position/position-sort-field.enum';

@Injectable()
export class PositionPrismaRepository implements PositionRepositoryPort {
  constructor(private readonly db: PrismaService) {}

  async create(position: PositionDomain): Promise<PositionDomain> {
    const created = await this.db.position.create({ data: this.toPrismaCreate(position) });
    return this.fromPrisma(created);
  }

  async findAll(): Promise<PositionDomain[]> {
    const rows = await this.db.position.findMany();
    return rows.map((p) => this.fromPrisma(p));
  }

  async search(query: PositionSearchQuery = {}): Promise<PositionSearchResult> {
    const take = Math.min(query.take ?? PAGINATION_DEFAULT_TAKE, PAGINATION_MAX_TAKE);
    const skip = query.skip ?? 0;

    const where: Prisma.PositionWhereInput = {
      ...(query.title ? { title: { contains: query.title } } : {}),
      ...(query.description ? { description: { contains: query.description } } : {}),
      ...(query.search
        ? {
            OR: [
              { title: { contains: query.search } },
              { description: { contains: query.search } },
            ],
          }
        : {}),
    };

    const sortDirection = query.sortDirection ?? SortDirection.ASC;
    const orderBy = this.buildOrderBy(query.sortBy, sortDirection);

    const [total, rows] = await Promise.all([
      this.db.position.count({ where }),
      this.db.position.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
    ]);

    const items = rows.map((p) => this.fromPrisma(p));
    return { items, count: items.length, total };
  }

  private buildOrderBy(
    sortBy?: PositionSortField,
    sortDirection: SortDirection = SortDirection.ASC,
  ): Prisma.PositionOrderByWithRelationInput[] {
    if (!sortBy) {
      return [{ id: 'asc' }];
    }

    const direction = sortDirection === SortDirection.DESC ? 'desc' : 'asc';

    const orderByMap: Record<PositionSortField, Prisma.PositionOrderByWithRelationInput> = {
      [PositionSortField.ID]: { id: direction },
      [PositionSortField.TITLE]: { title: direction },
      [PositionSortField.DESCRIPTION]: { description: direction },
      [PositionSortField.CREATED_AT]: { createdAt: direction },
      [PositionSortField.UPDATED_AT]: { updatedAt: direction },
    };

    return [orderByMap[sortBy], { id: 'asc' }];
  }

  async findById(id: number): Promise<PositionDomain | null> {
    const row = await this.db.position.findUnique({ where: { id } });
    return row ? this.fromPrisma(row) : null;
  }

  async updateById(id: number, patch: Partial<PositionDomain>): Promise<PositionDomain> {
    const updated = await this.db.position.update({ where: { id }, data: this.toPrismaUpdate(patch) });
    return this.fromPrisma(updated);
  }

  async deleteById(id: number): Promise<void> {
    await this.db.position.delete({ where: { id } });
  }

  private fromPrisma(row: PrismaPosition): PositionDomain {
    return new PositionDomain({
      id: row.id,
      title: row.title,
      description: row.description,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  private toPrismaCreate(domain: PositionDomain): Prisma.PositionUncheckedCreateInput {
    return {
      title: domain.title,
      description: domain.description,
    };
  }

  private toPrismaUpdate(domain: Partial<PositionDomain>): Prisma.PositionUncheckedUpdateInput {
    return {
      ...(domain.title !== undefined ? { title: domain.title } : {}),
      ...(domain.description !== undefined ? { description: domain.description } : {}),
    };
  }
}


