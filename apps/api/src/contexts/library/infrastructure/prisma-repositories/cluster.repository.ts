import { Prisma } from '@intra/database';
import {
    ClusterSearchQuery,
    ClusterSortField,
    SortDirection,
    UpdateClusterPayload,
} from '@intra/shared-kernel';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ClusterRepositoryPort } from '../../application/ports/cluster.repository.port';
import { ClusterDomain } from '../../domain/cluster.domain';
import { ClusterMapper } from '../mappers/cluster.mapper';

@Injectable()
export class ClusterRepository implements ClusterRepositoryPort {
    constructor(private readonly prisma: PrismaService) {}

    async create(cluster: ClusterDomain): Promise<ClusterDomain> {
        const created = await this.prisma.cluster.create({
            data: {
                competenceId: cluster.competenceId,
                lowerBound: cluster.lowerBound,
                upperBound: cluster.upperBound,
                title: cluster.title,
                description: cluster.description,
            },
        });

        return ClusterMapper.toDomain(created);
    }

    async findById(id: number): Promise<ClusterDomain | null> {
        const cluster = await this.prisma.cluster.findUnique({ where: { id } });
        return cluster ? ClusterMapper.toDomain(cluster) : null;
    }

    async search(query: ClusterSearchQuery): Promise<ClusterDomain[]> {
        const where = this.buildWhere(query);
        const orderBy = this.buildOrder(query);

        const items = await this.prisma.cluster.findMany({ where, orderBy });
        return items.map(ClusterMapper.toDomain);
    }

    async updateById(
        id: number,
        patch: UpdateClusterPayload,
    ): Promise<ClusterDomain> {
        const updated = await this.prisma.cluster.update({
            where: { id },
            data: patch,
        });

        return ClusterMapper.toDomain(updated);
    }

    async deleteById(id: number): Promise<void> {
        await this.prisma.cluster.delete({ where: { id } });
    }

    private buildWhere(query: ClusterSearchQuery): Prisma.ClusterWhereInput {
        const {
            competenceId,
            lowerBound,
            upperBound,
            title,
            description,
            search,
        } = query;
        return {
            ...(competenceId ? { competenceId } : {}),
            ...(lowerBound ? { lowerBound } : {}),
            ...(upperBound ? { upperBound } : {}),
            ...(title
                ? { title: { contains: title, mode: 'insensitive' } }
                : {}),
            ...(description
                ? {
                      description: {
                          contains: description,
                          mode: 'insensitive',
                      },
                  }
                : {}),
            ...(search
                ? {
                      OR: [
                          { title: { contains: search, mode: 'insensitive' } },
                          {
                              description: {
                                  contains: search,
                                  mode: 'insensitive',
                              },
                          },
                      ],
                  }
                : {}),
        };
    }

    private buildOrder(
        query: ClusterSearchQuery,
    ): Prisma.ClusterOrderByWithRelationInput[] {
        const field = query.sortBy ?? ClusterSortField.ID;
        const direction = query.sortDirection ?? SortDirection.ASC;
        return [{ [field]: direction.toLowerCase() as Prisma.SortOrder }];
    }
}
