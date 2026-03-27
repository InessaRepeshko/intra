import Decimal from 'decimal.js';
import { StrategicReportAnalyticsDomain } from '../../../domain/strategic-report-analytics.domain';
import { StrategicReportAnalyticsResponse } from '../models/strategic-report-analytics.response';

export class StrategicReportAnalyticsHttpMapper {
    static toResponse(
        analytics: StrategicReportAnalyticsDomain,
    ): StrategicReportAnalyticsResponse {
        const response = new StrategicReportAnalyticsResponse();
        response.id = analytics.id!;
        response.strategicReportId = analytics.strategicReportId;
        response.competenceId = analytics.competenceId;
        response.competenceTitle = analytics.competenceTitle;
        response.averageBySelfAssessment =
            StrategicReportAnalyticsHttpMapper.roundScore(
                analytics.averageBySelfAssessment,
            );
        response.averageByTeam = StrategicReportAnalyticsHttpMapper.roundScore(
            analytics.averageByTeam,
        );
        response.averageByOther = StrategicReportAnalyticsHttpMapper.roundScore(
            analytics.averageByOther,
        );
        response.percentageBySelfAssessment =
            StrategicReportAnalyticsHttpMapper.roundScore(
                analytics.percentageBySelfAssessment,
            );
        response.percentageByTeam =
            StrategicReportAnalyticsHttpMapper.roundScore(
                analytics.percentageByTeam,
            );
        response.percentageByOther =
            StrategicReportAnalyticsHttpMapper.roundScore(
                analytics.percentageByOther,
            );
        response.deltaPercentageByTeam =
            StrategicReportAnalyticsHttpMapper.roundScore(
                analytics.deltaPercentageByTeam,
            );
        response.deltaPercentageByOther =
            StrategicReportAnalyticsHttpMapper.roundScore(
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
