import { ReportAnalyticsResponseDto } from '@entities/reporting/analytics/model/types';

export interface ReportAnalytics extends Omit<
    ReportAnalyticsResponseDto,
    'createdAt'
> {
    createdAt: Date;
}

export function mapReportAnalyticsToModel(
    dto: ReportAnalyticsResponseDto,
): ReportAnalytics {
    return {
        ...dto,
        createdAt: new Date(dto.createdAt),
    };
}
