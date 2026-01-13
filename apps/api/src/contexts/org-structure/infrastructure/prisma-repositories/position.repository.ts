import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  PositionRepositoryPort,
  PositionSearchQuery,
  PositionSearchResult,
  PositionSortField,
  PositionUpdatePayload,
} from '../../application/ports/position.repository.port';
import { OrgStructureMapper } from './org-structure.mapper';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { Prisma } from '@prisma/client';
import { PositionDomain } from '../../domain/position.domain';

@Injectable()
export class PositionRepository implements PositionRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(position: PositionDomain): Promise<PositionDomain> {
    const created = await this.prisma.position.create({
      data: {
        title: position.title,
        description: position.description,
      },
    });
    return OrgStructureMapper.toPositionDomain(created);
  }

  async findById(id: number): Promise<PositionDomain | null> {
    const found = await this.prisma.position.findUnique({ where: { id } });
    return found ? OrgStructureMapper.toPositionDomain(found) : null;
  }

  async search(query: PositionSearchQuery): Promise<PositionSearchResult> {
    const where = this.buildWhere(query);
    const orderBy = this.buildOrder(query);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.position.findMany({
        where,
        skip: query.skip,
        take: query.take,
        orderBy,
      }),
      this.prisma.position.count({ where }),
    ]);

    const mapped = items.map(OrgStructureMapper.toPositionDomain);
    return { items: mapped, count: mapped.length, total };
  }

  async updateById(id: number, patch: PositionUpdatePayload): Promise<PositionDomain> {
    const updated = await this.prisma.position.update({
      where: { id },
      data: patch,
    });
    return OrgStructureMapper.toPositionDomain(updated);
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.position.delete({ where: { id } });
  }

  private buildWhere(query: PositionSearchQuery): Prisma.PositionWhereInput {
    const { search } = query;
    return search
      ? {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } },
          ],
        }
      : {};
  }

  private buildOrder(query: PositionSearchQuery): Prisma.PositionOrderByWithRelationInput[] {
    const field = query.sortBy ?? PositionSortField.CREATED_AT;
    const direction = query.sortDirection ?? SortDirection.DESC;
    return [{ [field]: direction.toLowerCase() as Prisma.SortOrder }];
  }
}
