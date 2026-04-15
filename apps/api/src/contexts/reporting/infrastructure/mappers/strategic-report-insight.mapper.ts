import {
    Prisma,
    EntityType as PrismaEntityType,
    InsightType as PrismaInsightType,
    StrategicReportInsights as PrismaStrategicReportInsights,
} from '@intra/database';
import { EntityType, InsightType } from '@intra/shared-kernel';
import Decimal from 'decimal.js';
import { StrategicReportInsightDomain } from '../../domain/startegic-report-insight.domain';

export class StrategicReportInsightMapper {
    static toDomain(
        analytics: PrismaStrategicReportInsights,
    ): StrategicReportInsightDomain {
        return StrategicReportInsightDomain.create({
            id: analytics.id,
            strategicReportId: analytics.strategicReportId,
            insightType: StrategicReportInsightMapper.toDomainInsightType(
                analytics.insightType,
            ),
            competenceId: analytics.competenceId,
            competenceTitle: analytics.competenceTitle,
            averageScore: analytics.averageScore,
            averageRating: analytics.averageRating,
            averageDelta: analytics.averageDelta,
            createdAt: analytics.createdAt,
        });
    }

    static toPrisma(
        reportId: number,
        insights: StrategicReportInsightDomain,
    ): Prisma.StrategicReportInsightsCreateManyInput {
        return {
            strategicReportId: reportId,
            insightType: StrategicReportInsightMapper.toPrismaInsightType(
                insights.insightType,
            ),
            competenceId: insights.competenceId,
            competenceTitle: insights.competenceTitle,
            averageScore: StrategicReportInsightMapper.toDecimalString(
                insights.averageScore,
            ),
            averageRating: StrategicReportInsightMapper.toDecimalString(
                insights.averageRating,
            ),
            averageDelta: StrategicReportInsightMapper.toDecimalString(
                insights.averageDelta,
            ),
        };
    }

    static toPrismaEntityType(domainType: EntityType): PrismaEntityType {
        return domainType.toString().toUpperCase() as PrismaEntityType;
    }

    static toDomainEntityType(prismaType: PrismaEntityType): EntityType {
        return prismaType.toString().toUpperCase() as EntityType;
    }

    static toPrismaInsightType(domainType: InsightType): PrismaInsightType {
        return domainType.toString().toUpperCase() as PrismaInsightType;
    }

    static toDomainInsightType(prismaType: PrismaInsightType): InsightType {
        return prismaType.toString().toUpperCase() as InsightType;
    }

    static toDecimalString(
        value: Decimal.Value | null | undefined,
    ): string | undefined {
        if (value === null || value === undefined) {
            return undefined;
        }
        return new Decimal(value).toDecimalPlaces(4).toFixed(4);
    }
}
