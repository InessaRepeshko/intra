import {
    Prisma,
    ClusterScoreAnalytics as PrismaClusterScoreAnalytics,
} from '@intra/database';
import Decimal from 'decimal.js';
import { ClusterScoreAnalyticsDomain } from '../../domain/cluster-score-analytics.domain';
import { ClusterScoreMapper } from './cluster-score.mapper';

export class ClusterScoreAnalyticsMapper {
    static toDomain(
        analytics: PrismaClusterScoreAnalytics,
    ): ClusterScoreAnalyticsDomain {
        return ClusterScoreAnalyticsDomain.create({
            id: analytics.id,
            cycleId: analytics.cycleId,
            clusterId: analytics.clusterId,
            employeesCount: analytics.employeesCount,
            lowerBound: new Decimal(analytics.lowerBound),
            upperBound: new Decimal(analytics.upperBound),
            minScore: new Decimal(analytics.minScore),
            maxScore: new Decimal(analytics.maxScore),
            averageScore: new Decimal(analytics.averageScore),
            createdAt: analytics.createdAt,
            updatedAt: analytics.updatedAt,
        });
    }

    static toPrisma(
        analytics: ClusterScoreAnalyticsDomain,
    ): Prisma.ClusterScoreAnalyticsUncheckedCreateInput {
        return {
            cycleId: analytics.cycleId,
            clusterId: analytics.clusterId,
            lowerBound: ClusterScoreMapper.toScoreDecimalString(
                analytics.lowerBound,
            ),
            upperBound: ClusterScoreMapper.toScoreDecimalString(
                analytics.upperBound,
            ),
            employeesCount: analytics.employeesCount,
            minScore: ClusterScoreMapper.toScoreDecimalString(
                analytics.minScore,
            ),
            maxScore: ClusterScoreMapper.toScoreDecimalString(
                analytics.maxScore,
            ),
            averageScore: ClusterScoreMapper.toScoreDecimalString(
                analytics.averageScore,
            ),
        };
    }
}
