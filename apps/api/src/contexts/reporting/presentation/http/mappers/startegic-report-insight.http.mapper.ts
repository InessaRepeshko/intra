import Decimal from 'decimal.js';
import { StrategicReportInsightDomain } from '../../../domain/startegic-report-insight.domain';
import { StrategicReportInsightResponse } from '../models/startegic-report-insight.response';

export class StrategicReportInsightHttpMapper {
    static toResponse(
        analytics: StrategicReportInsightDomain,
    ): StrategicReportInsightResponse {
        const response = new StrategicReportInsightResponse();
        response.id = analytics.id!;
        response.strategicReportId = analytics.strategicReportId;
        response.insightType = analytics.insightType;
        response.competenceId = analytics.competenceId;
        response.competenceTitle = analytics.competenceTitle;
        response.averageScore = StrategicReportInsightHttpMapper.roundScore(
            analytics.averageScore,
        );
        response.averageRating = StrategicReportInsightHttpMapper.roundScore(
            analytics.averageRating,
        );
        response.averageDelta = StrategicReportInsightHttpMapper.roundScore(
            analytics.averageDelta,
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
