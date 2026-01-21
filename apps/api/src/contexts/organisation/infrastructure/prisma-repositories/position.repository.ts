import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
  PositionRepositoryPort,
  PositionSearchQuery,
  PositionSortField,
  PositionUpdatePayload,
} from '../../application/ports/position.repository.port';
import { OrganisationMapper } from './organisation.mapper';
import { SortDirection } from '@intra/shared-kernel';
import { Prisma } from '@intra/database';
import { PositionDomain } from '../../domain/position.domain';

@Injectable()
export class PositionRepository implements PositionRepositoryPort {
  constructor(private readonly prisma: PrismaService) { }

  async create(position: PositionDomain): Promise<PositionDomain> {
    const created = await this.prisma.position.create({
      data: {
        title: position.title,
        description: position.description,
      },
    });
    return OrganisationMapper.toPositionDomain(created);
  }

  async findById(id: number): Promise<PositionDomain | null> {
    const found = await this.prisma.position.findUnique({ where: { id } });
    return found ? OrganisationMapper.toPositionDomain(found) : null;
  }

  async search(query: PositionSearchQuery): Promise<PositionDomain[]> {
    const where = this.buildWhere(query);
    const orderBy = this.buildOrder(query);

    const items = await this.prisma.position.findMany({
      where,
      orderBy,
    });

    return items.map(OrganisationMapper.toPositionDomain);
  }

  async updateById(id: number, patch: PositionUpdatePayload): Promise<PositionDomain> {
    const updated = await this.prisma.position.update({
      where: { id },
      data: patch,
    });
    return OrganisationMapper.toPositionDomain(updated);
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
    const field = query.sortBy ?? PositionSortField.ID;
    const direction = query.sortDirection ?? SortDirection.ASC;
    return [{ [field]: direction.toLowerCase() as Prisma.SortOrder }];
  }
}
