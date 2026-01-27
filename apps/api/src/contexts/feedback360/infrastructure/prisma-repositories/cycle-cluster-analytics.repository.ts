import { Injectable } from '@nestjs/common';
import { Prisma } from '@intra/database';
import { PrismaService } from 'src/database/prisma.service';
import {
    CycleClusterAnalyticsRepositoryPort,
    CYCLE_CLUSTER_ANALYTICS_REPOSITORY,
} from '../../application/ports/cycle-cluster-analytics.repository.port';
import { CycleClusterAnalyticsDomain } from '../../domain/cycle-cluster-analytics.domain';
import { Feedback360Mapper } from './feedback360.mapper';
import { SortDirection, CycleClusterAnalyticsSortField, CycleClusterAnalyticsSearchQuery, UpdateCycleClusterAnalyticsPayload } from '@intra/shared-kernel';

@Injectable()
export class CycleClusterAnalyticsRepository implements CycleClusterAnalyticsRepositoryPort {
    readonly [CYCLE_CLUSTER_ANALYTICS_REPOSITORY] = CYCLE_CLUSTER_ANALYTICS_REPOSITORY;

    constructor(private readonly prisma: PrismaService) { }

    async upsert(analytics: CycleClusterAnalyticsDomain): Promise<CycleClusterAnalyticsDomain> {
        const saved = await this.prisma.cycleClusterAnalytics.upsert({
            where: {
                cycleId_clusterId: {
                    cycleId: analytics.cycleId,
                    clusterId: analytics.clusterId,
                },
            },
            create: {
                cycleId: analytics.cycleId,
                clusterId: analytics.clusterId,
                employeesCount: analytics.employeesCount,
                minScore: analytics.minScore,
                maxScore: analytics.maxScore,
                averageScore: analytics.averageScore,
            },
            update: {
                employeesCount: analytics.employeesCount,
                minScore: analytics.minScore,
                maxScore: analytics.maxScore,
                averageScore: analytics.averageScore,
            },
        });

        return Feedback360Mapper.toCycleClusterAnalyticsDomain(saved);
    }

    async findById(id: number): Promise<CycleClusterAnalyticsDomain | null> {
        const item = await this.prisma.cycleClusterAnalytics.findUnique({ where: { id } });
        return item ? Feedback360Mapper.toCycleClusterAnalyticsDomain(item) : null;
    }

    async search(query: CycleClusterAnalyticsSearchQuery): Promise<CycleClusterAnalyticsDomain[]> {
        const where = this.buildWhere(query);
        const orderBy = this.buildOrder(query);

        const items = await this.prisma.cycleClusterAnalytics.findMany({ where, orderBy });
        return items.map(Feedback360Mapper.toCycleClusterAnalyticsDomain);
    }

    async updateById(id: number, patch: UpdateCycleClusterAnalyticsPayload): Promise<CycleClusterAnalyticsDomain> {
        const updated = await this.prisma.cycleClusterAnalytics.update({
            where: { id },
            data: patch,
        });

        return Feedback360Mapper.toCycleClusterAnalyticsDomain(updated);
    }

    async deleteById(id: number): Promise<void> {
        await this.prisma.cycleClusterAnalytics.delete({ where: { id } });
    }

    private buildWhere(query: CycleClusterAnalyticsSearchQuery): Prisma.CycleClusterAnalyticsWhereInput {
        const { cycleId, clusterId, employeesCount, minScore, maxScore, averageScore } = query;
        return {
            ...(cycleId ? { cycleId } : {}),
            ...(clusterId ? { clusterId } : {}),
            ...(employeesCount ? { employeesCount } : {}),
            ...(minScore ? { minScore } : {}),
            ...(maxScore ? { maxScore } : {}),
            ...(averageScore ? { averageScore } : {}),
        };
    }

    private buildOrder(query: CycleClusterAnalyticsSearchQuery): Prisma.CycleClusterAnalyticsOrderByWithRelationInput[] {
        const field = query.sortBy ?? CycleClusterAnalyticsSortField.ID;
        const direction = query.sortDirection ?? SortDirection.ASC;
        return [{ [field]: direction.toLowerCase() as Prisma.SortOrder }];
    }
}
