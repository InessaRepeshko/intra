import { apiClient } from '@/shared/api/api-client';
import type {
    ReportAnalyticsFilterQuery,
    ReportAnalyticsResponseDto,
} from '@entities/reporting/analytics/model/types';

const ANALYTICS_BASE = '/reporting/analytics';

export async function fetchReportAnalytics(
    params?: ReportAnalyticsFilterQuery,
): Promise<ReportAnalyticsResponseDto[]> {
    const { data } = await apiClient.get<ReportAnalyticsResponseDto[]>(
        ANALYTICS_BASE,
        { params },
    );
    return data;
}

export async function fetchReportAnalyticsById(
    id: number,
): Promise<ReportAnalyticsResponseDto> {
    const { data } = await apiClient.get<ReportAnalyticsResponseDto>(
        `${ANALYTICS_BASE}/${id}`,
    );
    return data;
}
