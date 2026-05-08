import { apiClient } from '@/shared/api/api-client';
import type {
    ReportAnalyticsResponseDto,
    ReportFilterQuery,
    ReportResponseDto,
    ReportTextAnswerDto,
} from '@entities/reporting/report/model/types';

const REPORTS_BASE = '/reporting/reports';

export async function fetchReports(
    params?: ReportFilterQuery,
): Promise<ReportResponseDto[]> {
    const { data } = await apiClient.get<ReportResponseDto[]>(REPORTS_BASE, {
        params,
    });
    return data;
}

export async function fetchReportById(id: number): Promise<ReportResponseDto> {
    const { data } = await apiClient.get<ReportResponseDto>(
        `${REPORTS_BASE}/${id}`,
    );
    return data;
}

export async function fetchReportByReviewId(
    reviewId: number,
): Promise<ReportResponseDto> {
    const { data } = await apiClient.get<ReportResponseDto>(
        `${REPORTS_BASE}/review/${reviewId}`,
    );
    return data;
}

export async function fetchReportTextAnswersByReviewId(
    reviewId: number,
): Promise<ReportTextAnswerDto[]> {
    const { data } = await apiClient.get<ReportTextAnswerDto[]>(
        `${REPORTS_BASE}/review/${reviewId}/text-answers`,
    );
    return data;
}

export async function fetchReportAnalyticsByReportId(
    reportId: number,
): Promise<ReportAnalyticsResponseDto[]> {
    const { data } = await apiClient.get<ReportAnalyticsResponseDto[]>(
        `${REPORTS_BASE}/${reportId}/analytics`,
    );
    return data;
}

export async function fetchReportAnalyticsByAnalyticsId(
    analyticsId: number,
): Promise<ReportAnalyticsResponseDto[]> {
    const { data } = await apiClient.get<ReportAnalyticsResponseDto[]>(
        `${REPORTS_BASE}/analytics/${analyticsId}`,
    );
    return data;
}
