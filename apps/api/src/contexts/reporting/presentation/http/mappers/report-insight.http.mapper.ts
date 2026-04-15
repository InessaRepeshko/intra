import Decimal from 'decimal.js';
import { ReportInsightDomain } from '../../../domain/report-insight.domain';
import { ReportInsightResponse } from '../models/report-insight.response';

export class ReportInsightHttpMapper {
    static toResponse(analytics: ReportInsightDomain): ReportInsightResponse {
        const response = new ReportInsightResponse();
        response.id = analytics.id!;
        response.reportId = analytics.reportId;
        response.insightType = analytics.insightType;
        response.entityType = analytics.entityType;
        response.questionId = analytics.questionId ?? null;
        response.questionTitle = analytics.questionTitle ?? null;
        response.competenceId = analytics.competenceId ?? null;
        response.competenceTitle = analytics.competenceTitle ?? null;
        response.averageScore = ReportInsightHttpMapper.roundScore(
            analytics.averageScore,
        );
        response.averageRating = ReportInsightHttpMapper.roundScore(
            analytics.averageRating,
        );
        response.averageDelta = ReportInsightHttpMapper.roundScore(
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
