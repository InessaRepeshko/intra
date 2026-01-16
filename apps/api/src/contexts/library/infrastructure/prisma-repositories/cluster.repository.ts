import { Injectable } from '@nestjs/common';
import { Prisma } from '@intra/database';
import { PrismaService } from 'src/database/prisma.service';
import {
  ClusterRepositoryPort,
  ClusterSearchQuery,
  ClusterSortField,
  ClusterUpdatePayload,
} from '../../application/ports/cluster.repository.port';
import { ClusterDomain } from '../../domain/cluster.domain';
import { CompetenceMapper } from './competence.mapper';
import { SortDirection } from 'src/common/enums/sort-direction.enum';

@Injectable()
export class ClusterRepository implements ClusterRepositoryPort {
  constructor(private readonly prisma: PrismaService) { }

  async create(cluster: ClusterDomain): Promise<ClusterDomain> {
    const created = await this.prisma.cluster.create({
      data: {
        competenceId: cluster.competenceId,
        cycleId: cluster.cycleId,
        lowerBound: cluster.lowerBound,
        upperBound: cluster.upperBound,
        minScore: cluster.minScore,
        maxScore: cluster.maxScore,
        averageScore: cluster.averageScore,
        employeesCount: cluster.employeesCount,
      },
    });

    return CompetenceMapper.toClusterDomain(created);
  }

  async findById(id: number): Promise<ClusterDomain | null> {
    const cluster = await this.prisma.cluster.findUnique({ where: { id } });
    return cluster ? CompetenceMapper.toClusterDomain(cluster) : null;
  }

  async search(query: ClusterSearchQuery): Promise<ClusterDomain[]> {
    const where = this.buildWhere(query);
    const orderBy = this.buildOrder(query);

    const items = await this.prisma.cluster.findMany({ where, orderBy });
    return items.map(CompetenceMapper.toClusterDomain);
  }

  async updateById(id: number, patch: ClusterUpdatePayload): Promise<ClusterDomain> {
    const updated = await this.prisma.cluster.update({
      where: { id },
      data: patch,
    });

    return CompetenceMapper.toClusterDomain(updated);
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.cluster.delete({ where: { id } });
  }

  private buildWhere(query: ClusterSearchQuery): Prisma.ClusterWhereInput {
    const { competenceId, cycleId } = query;
    return {
      ...(competenceId ? { competenceId } : {}),
      ...(cycleId !== undefined ? { cycleId } : {}),
    };
  }

  private buildOrder(query: ClusterSearchQuery): Prisma.ClusterOrderByWithRelationInput[] {
    const field = query.sortBy ?? ClusterSortField.ID;
    const direction = query.sortDirection ?? SortDirection.ASC;
    return [{ [field]: direction.toLowerCase() as Prisma.SortOrder }];
  }
}

