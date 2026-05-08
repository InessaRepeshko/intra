import {
    type ReportAnalytics,
    mapReportAnalyticsToModel,
} from '@entities/reporting/analytics/model/mappers';
import { useQuery } from '@tanstack/react-query';
import { ReportAnalyticsFilterQuery } from '../model/types';
import {
    fetchReportAnalytics,
    fetchReportAnalyticsById,
} from './analytics.api';

export const analyticsKeys = {
    all: ['analytics'] as const,
    lists: () => [...analyticsKeys.all, 'list'] as const,
    list: (params?: ReportAnalyticsFilterQuery) =>
        [...analyticsKeys.lists(), params] as const,
    details: () => [...analyticsKeys.all, 'detail'] as const,
    detail: (id: number) => [...analyticsKeys.details(), id] as const,
};

export function useReportAnalyticsQuery(params?: ReportAnalyticsFilterQuery) {
    return useQuery<ReportAnalytics[]>({
        queryKey: analyticsKeys.list(params),
        queryFn: async () => {
            const dtos = await fetchReportAnalytics(params);
            return dtos.map(mapReportAnalyticsToModel);
        },
    });
}

export function useReportAnalyticQuery(id: number) {
    return useQuery<ReportAnalytics>({
        queryKey: analyticsKeys.detail(id),
        queryFn: async () => {
            const dto = await fetchReportAnalyticsById(id);
            return mapReportAnalyticsToModel(dto);
        },
        enabled: id > 0,
    });
}
