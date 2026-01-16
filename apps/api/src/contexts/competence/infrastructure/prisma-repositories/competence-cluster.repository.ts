import { Injectable } from '@nestjs/common';
import { Prisma } from '@intra/database';
import { PrismaService } from 'src/database/prisma.service';
import {
  CompetenceClusterRepositoryPort,
  CompetenceClusterSearchQuery,
  CompetenceClusterSortField,
  CompetenceClusterUpdatePayload,
} from '../../application/ports/competence-cluster.repository.port';
import { CompetenceClusterDomain } from '../../domain/competence-cluster.domain';
import { CompetenceMapper } from './competence.mapper';
import { SortDirection } from 'src/common/enums/sort-direction.enum';

@Injectable()
export class CompetenceClusterRepository implements CompetenceClusterRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(cluster: CompetenceClusterDomain): Promise<CompetenceClusterDomain> {
    const created = await this.prisma.competenceCluster.create({
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

  async findById(id: number): Promise<CompetenceClusterDomain | null> {
    const cluster = await this.prisma.competenceCluster.findUnique({ where: { id } });
    return cluster ? CompetenceMapper.toClusterDomain(cluster) : null;
  }

  async search(query: CompetenceClusterSearchQuery): Promise<CompetenceClusterDomain[]> {
    const where = this.buildWhere(query);
    const orderBy = this.buildOrder(query);

    const items = await this.prisma.competenceCluster.findMany({ where, orderBy });
    return items.map(CompetenceMapper.toClusterDomain);
  }

  async updateById(id: number, patch: CompetenceClusterUpdatePayload): Promise<CompetenceClusterDomain> {
    const updated = await this.prisma.competenceCluster.update({
      where: { id },
      data: patch,
    });

    return CompetenceMapper.toClusterDomain(updated);
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.competenceCluster.delete({ where: { id } });
  }

  private buildWhere(query: CompetenceClusterSearchQuery): Prisma.CompetenceClusterWhereInput {
    const { competenceId, cycleId } = query;
    return {
      ...(competenceId ? { competenceId } : {}),
      ...(cycleId !== undefined ? { cycleId } : {}),
    };
  }

  private buildOrder(query: CompetenceClusterSearchQuery): Prisma.CompetenceClusterOrderByWithRelationInput[] {
    const field = query.sortBy ?? CompetenceClusterSortField.ID;
    const direction = query.sortDirection ?? SortDirection.ASC;
    return [{ [field]: direction.toLowerCase() as Prisma.SortOrder }];
  }
}

