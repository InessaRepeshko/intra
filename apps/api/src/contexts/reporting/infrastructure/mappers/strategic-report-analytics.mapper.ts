import {
    Prisma,
    StrategicReportAnalytics as PrismaStrategicReportAnalytics,
} from '@intra/database';
import Decimal from 'decimal.js';
import { StrategicReportAnalyticsDomain } from '../../domain/strategic-report-analytics.domain';

export class StrategicReportAnalyticsMapper {
    static toDomain(
        analytics: PrismaStrategicReportAnalytics,
    ): StrategicReportAnalyticsDomain {
        return StrategicReportAnalyticsDomain.create({
            id: analytics.id,
            strategicReportId: analytics.strategicReportId,
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
        strategicReportId: number,
        analytics: StrategicReportAnalyticsDomain,
    ): Prisma.StrategicReportAnalyticsCreateManyInput {
        return {
            strategicReportId: strategicReportId,
            competenceId: analytics.competenceId,
            competenceTitle: analytics.competenceTitle,
            averageBySelfAssessment:
                StrategicReportAnalyticsMapper.toDecimalString(
                    analytics.averageBySelfAssessment,
                ),
            averageByTeam: StrategicReportAnalyticsMapper.toDecimalString(
                analytics.averageByTeam,
            ),
            averageByOther: StrategicReportAnalyticsMapper.toDecimalString(
                analytics.averageByOther,
            ),
            percentageBySelfAssessment:
                StrategicReportAnalyticsMapper.toDecimalString(
                    analytics.percentageBySelfAssessment,
                ),
            percentageByTeam: StrategicReportAnalyticsMapper.toDecimalString(
                analytics.percentageByTeam,
            ),
            percentageByOther: StrategicReportAnalyticsMapper.toDecimalString(
                analytics.percentageByOther,
            ),
            deltaPercentageByTeam:
                StrategicReportAnalyticsMapper.toDecimalString(
                    analytics.deltaPercentageByTeam,
                ),
            deltaPercentageByOther:
                StrategicReportAnalyticsMapper.toDecimalString(
                    analytics.deltaPercentageByOther,
                ),
        };
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
