import {
    Prisma,
    EntityType as PrismaEntityType,
    InsightType as PrismaInsightType,
    ReportInsights as PrismaReportInsights,
} from '@intra/database';
import { EntityType, InsightType } from '@intra/shared-kernel';
import Decimal from 'decimal.js';
import { ReportInsightDomain } from '../../domain/report-insight.domain';

export class ReportInsightMapper {
    static toDomain(analytics: PrismaReportInsights): ReportInsightDomain {
        return ReportInsightDomain.create({
            id: analytics.id,
            reportId: analytics.reportId,
            insightType: ReportInsightMapper.toDomainInsightType(
                analytics.insightType,
            ),
            entityType: ReportInsightMapper.toDomainEntityType(
                analytics.entityType,
            ),
            questionId: analytics.questionId,
            questionTitle: analytics.questionTitle,
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
        insights: ReportInsightDomain,
    ): Prisma.ReportInsightsCreateManyInput {
        return {
            reportId,
            insightType: ReportInsightMapper.toPrismaInsightType(
                insights.insightType,
            ),
            entityType: ReportInsightMapper.toPrismaEntityType(
                insights.entityType,
            ),
            questionId: insights.questionId ?? undefined,
            questionTitle: insights.questionTitle ?? undefined,
            competenceId: insights.competenceId ?? undefined,
            competenceTitle: insights.competenceTitle ?? undefined,
            averageScore: ReportInsightMapper.toDecimalString(
                insights.averageScore,
            ),
            averageRating: ReportInsightMapper.toDecimalString(
                insights.averageRating,
            ),
            averageDelta: ReportInsightMapper.toDecimalString(
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
