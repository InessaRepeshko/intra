import Decimal from 'decimal.js';
import { ReportAnalyticsDomain } from '../../../domain/report-analytics.domain';
import { ReportAnalyticsResponse } from '../models/report-analytics.response';

export class ReportAnalyticsHttpMapper {
    static toResponse(
        analytics: ReportAnalyticsDomain,
    ): ReportAnalyticsResponse {
        const response = new ReportAnalyticsResponse();
        response.id = analytics.id!;
        response.reportId = analytics.reportId;
        response.entityType = analytics.entityType;
        response.questionId = analytics.questionId ?? null;
        response.questionTitle = analytics.questionTitle ?? null;
        response.competenceId = analytics.competenceId ?? null;
        response.competenceTitle = analytics.competenceTitle ?? null;
        response.averageBySelfAssessment = ReportAnalyticsHttpMapper.roundScore(
            analytics.averageBySelfAssessment,
        );
        response.averageByTeam = ReportAnalyticsHttpMapper.roundScore(
            analytics.averageByTeam,
        );
        response.averageByOther = ReportAnalyticsHttpMapper.roundScore(
            analytics.averageByOther,
        );
        response.percentageBySelfAssessment =
            ReportAnalyticsHttpMapper.roundScore(
                analytics.percentageBySelfAssessment,
            );
        response.percentageByTeam = ReportAnalyticsHttpMapper.roundScore(
            analytics.percentageByTeam,
        );
        response.percentageByOther = ReportAnalyticsHttpMapper.roundScore(
            analytics.percentageByOther,
        );
        response.deltaPercentageByTeam = ReportAnalyticsHttpMapper.roundScore(
            analytics.deltaPercentageByTeam,
        );
        response.deltaPercentageByOther = ReportAnalyticsHttpMapper.roundScore(
            analytics.deltaPercentageByOther,
        );
        response.createdAt = analytics.createdAt!;
        return response;
    }

    static roundScore(
        value: Decimal | number | null | undefined,
    ): number | null {
        if (value === null || value === undefined) return null;
        const decimalValue =
            value instanceof Decimal ? value : new Decimal(value);
        return Number(decimalValue.toDecimalPlaces(4).toFixed(4));
    }
}
