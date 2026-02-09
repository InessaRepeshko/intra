import {
    Prisma,
    EntityType as PrismaEntityType,
    ReportAnalytics as PrismaReportAnalytics,
} from '@intra/database';
import { EntityType } from '@intra/shared-kernel';
import Decimal from 'decimal.js';
import { ReportAnalyticsDomain } from '../../domain/report-analytics.domain';

export class ReportAnalyticsMapper {
    static toDomain(analytics: PrismaReportAnalytics): ReportAnalyticsDomain {
        return ReportAnalyticsDomain.create({
            id: analytics.id,
            reportId: analytics.reportId,
            entityType: ReportAnalyticsMapper.toDomainEntityType(
                analytics.entityType,
            ),
            questionId: analytics.questionId,
            questionTitle: analytics.questionTitle,
            competenceId: analytics.competenceId,
            competenceTitle: analytics.competenceTitle,
            averageBySelfAssessment: analytics.averageBySelfAssessment,
            averageByTeam: analytics.averageByTeam,
            averageByOther: analytics.averageByOther,
            percentageBySelfAssessment: analytics.percentageBySelfAssessment,
            percentageByTeam: analytics.percentageByTeam,
            percentageByOther: analytics.percentageByOther,
            deltaPercentageByTeam: analytics.deltaPercentageByTeam,
            deltaPercentageByOther: analytics.deltaPercentageByOther,
            createdAt: analytics.createdAt,
        });
    }

    static toPrisma(
        reportId: number,
        analytics: ReportAnalyticsDomain,
    ): Prisma.ReportAnalyticsCreateManyInput {
        return {
            reportId,
            entityType: ReportAnalyticsMapper.toPrismaEntityType(
                analytics.entityType,
            ),
            questionId: analytics.questionId ?? undefined,
            questionTitle: analytics.questionTitle ?? undefined,
            competenceId: analytics.competenceId ?? undefined,
            competenceTitle: analytics.competenceTitle ?? undefined,
            averageBySelfAssessment: ReportAnalyticsMapper.toDecimalString(
                analytics.averageBySelfAssessment,
            ),
            averageByTeam: ReportAnalyticsMapper.toDecimalString(
                analytics.averageByTeam,
            ),
            averageByOther: ReportAnalyticsMapper.toDecimalString(
                analytics.averageByOther,
            ),
            percentageBySelfAssessment: ReportAnalyticsMapper.toDecimalString(
                analytics.percentageBySelfAssessment,
            ),
            percentageByTeam: ReportAnalyticsMapper.toDecimalString(
                analytics.percentageByTeam,
            ),
            percentageByOther: ReportAnalyticsMapper.toDecimalString(
                analytics.percentageByOther,
            ),
            deltaPercentageByTeam: ReportAnalyticsMapper.toDecimalString(
                analytics.deltaPercentageByTeam,
            ),
            deltaPercentageByOther: ReportAnalyticsMapper.toDecimalString(
                analytics.deltaPercentageByOther,
            ),
        };
    }

    static toPrismaEntityType(domainType: EntityType): PrismaEntityType {
        return domainType.toString().toUpperCase() as PrismaEntityType;
    }

    static toDomainEntityType(prismaType: PrismaEntityType): EntityType {
        return prismaType.toString().toUpperCase() as EntityType;
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
