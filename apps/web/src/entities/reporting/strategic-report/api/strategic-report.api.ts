import { apiClient } from '@/shared/api/api-client';
import type {
    StrategicReportAnalyticsResponseDto,
    StrategicReportFilterQuery,
    StrategicReportResponseDto,
} from '@entities/reporting/strategic-report/model/types';

const STRATEGIC_REPORTS_BASE = '/reporting/strategic-reports';

export async function fetchStrategicReports(
    params?: StrategicReportFilterQuery,
): Promise<StrategicReportResponseDto[]> {
    const { data } = await apiClient.get<StrategicReportResponseDto[]>(
        STRATEGIC_REPORTS_BASE,
        { params },
    );
    return data;
}

export async function fetchStrategicReportById(
    id: number,
): Promise<StrategicReportResponseDto> {
    const { data } = await apiClient.get<StrategicReportResponseDto>(
        `${STRATEGIC_REPORTS_BASE}/${id}`,
    );
    return data;
}

export async function fetchStrategicReportByCycleId(
    cycleId: number,
): Promise<StrategicReportResponseDto> {
    const { data } = await apiClient.get<StrategicReportResponseDto>(
        `${STRATEGIC_REPORTS_BASE}/cycles/${cycleId}`,
    );
    return data;
}

export async function fetchStrategicReportAnalyticsByReportId(
    reportId: number,
): Promise<StrategicReportAnalyticsResponseDto[]> {
    const { data } = await apiClient.get<StrategicReportAnalyticsResponseDto[]>(
        `${STRATEGIC_REPORTS_BASE}/${reportId}/analytics`,
    );
    return data;
}

export async function fetchStrategicReportAnalyticsByAnalyticsId(
    analyticsId: number,
): Promise<StrategicReportAnalyticsResponseDto[]> {
    const { data } = await apiClient.get<StrategicReportAnalyticsResponseDto[]>(
        `${STRATEGIC_REPORTS_BASE}/analytics/${analyticsId}`,
    );
    return data;
}
