import { Prisma } from '@intra/database';
import {
    ClusterScoreAnalyticsSearchQuery,
    ClusterScoreAnalyticsSortField,
    SortDirection,
    UpdateClusterScoreAnalyticsPayload,
} from '@intra/shared-kernel';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
    CLUSTER_SCORE_ANALYTICS_REPOSITORY,
    ClusterScoreAnalyticsRepositoryPort,
} from '../../application/ports/cluster-score-analytics.repository.port';
import { ClusterScoreAnalyticsDomain } from '../../domain/cluster-score-analytics.domain';
import { Feedback360Mapper } from './feedback360.mapper';

@Injectable()
export class ClusterScoreAnalyticsRepository implements ClusterScoreAnalyticsRepositoryPort {
    readonly [CLUSTER_SCORE_ANALYTICS_REPOSITORY] =
        CLUSTER_SCORE_ANALYTICS_REPOSITORY;

    constructor(private readonly prisma: PrismaService) { }

    async upsert(
        analytics: ClusterScoreAnalyticsDomain,
    ): Promise<ClusterScoreAnalyticsDomain> {
        const saved = await this.prisma.clusterScoreAnalytics.upsert({
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

        return Feedback360Mapper.toClusterScoreAnalyticsDomain(saved);
    }

    async findById(id: number): Promise<ClusterScoreAnalyticsDomain | null> {
        const item = await this.prisma.clusterScoreAnalytics.findUnique({
            where: { id },
        });
        return item
            ? Feedback360Mapper.toClusterScoreAnalyticsDomain(item)
            : null;
    }

    async search(
        query: ClusterScoreAnalyticsSearchQuery,
    ): Promise<ClusterScoreAnalyticsDomain[]> {
        const where = this.buildWhere(query);
        const orderBy = this.buildOrder(query);

        const items = await this.prisma.clusterScoreAnalytics.findMany({
            where,
            orderBy,
        });
        return items.map(Feedback360Mapper.toClusterScoreAnalyticsDomain);
    }

    async updateById(
        id: number,
        patch: UpdateClusterScoreAnalyticsPayload,
    ): Promise<ClusterScoreAnalyticsDomain> {
        const updated = await this.prisma.clusterScoreAnalytics.update({
            where: { id },
            data: patch,
        });

        return Feedback360Mapper.toClusterScoreAnalyticsDomain(updated);
    }

    async deleteById(id: number): Promise<void> {
        await this.prisma.clusterScoreAnalytics.delete({ where: { id } });
    }

    private buildWhere(
        query: ClusterScoreAnalyticsSearchQuery,
    ): Prisma.ClusterScoreAnalyticsWhereInput {
        const {
            cycleId,
            clusterId,
            employeesCount,
            minScore,
            maxScore,
            averageScore,
        } = query;
        return {
            ...(cycleId ? { cycleId } : {}),
            ...(clusterId ? { clusterId } : {}),
            ...(employeesCount ? { employeesCount } : {}),
            ...(minScore ? { minScore } : {}),
            ...(maxScore ? { maxScore } : {}),
            ...(averageScore ? { averageScore } : {}),
        };
    }

    private buildOrder(
        query: ClusterScoreAnalyticsSearchQuery,
    ): Prisma.ClusterScoreAnalyticsOrderByWithRelationInput[] {
        const field = query.sortBy ?? ClusterScoreAnalyticsSortField.ID;
        const direction = query.sortDirection ?? SortDirection.ASC;
        return [{ [field]: direction.toLowerCase() as Prisma.SortOrder }];
    }
}
