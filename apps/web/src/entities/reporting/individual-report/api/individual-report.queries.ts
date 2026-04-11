import { fetchCycleTitleById } from '@entities/feedback360/cycle/api/cycle.api';
import {
    fetchRateeFullNameByReviewId,
    fetchRateePositionTitleByReviewId,
    fetchRateeTeamTitleByReviewId,
    fetchReviewById,
    fetchReviewStageByReviewId,
} from '@entities/feedback360/review/api/review.api';
import {
    type Review,
    mapReviewDtoToModel,
} from '@entities/feedback360/review/model/mappers';
import { fetchUserById } from '@entities/identity/user/api/user.api';
import {
    type User,
    mapUserResponseDtoToModel,
} from '@entities/identity/user/model/mappers';
import { ReviewStage } from '@entities/reporting/individual-report/model/types';
import { useQueries, useQuery } from '@tanstack/react-query';
import {
    type Report,
    type ReportAnalytics,
    mapReportAnalyticsDtoToModel,
    mapReportDtoToModel,
} from '../model/mappers';
import { ReportFilterQuery } from '../model/types';
import {
    fetchReportAnalyticsByReportId,
    fetchReportById,
    fetchReports,
} from './individual-report.api';

export const reportKeys = {
    all: ['reports'] as const,
    lists: () => [...reportKeys.all, 'list'] as const,
    list: (filters?: ReportFilterQuery) =>
        [...reportKeys.lists(), filters ?? {}] as const,
    details: () => [...reportKeys.all, 'detail'] as const,
    detail: (id: number) => [...reportKeys.details(), id] as const,
    rateeFullNames: () => [...reportKeys.all, 'rateeFullNames'] as const,
    rateeFullName: (reviewId: number) =>
        [...reportKeys.rateeFullNames(), reviewId] as const,
    rateePositionTitles: () =>
        [...reportKeys.all, 'rateePositionTitles'] as const,
    rateePositionTitle: (reviewId: number) =>
        [...reportKeys.rateePositionTitles(), reviewId] as const,
    rateeTeamTitles: () => [...reportKeys.all, 'rateeTeamTitles'] as const,
    rateeTeamTitle: (reviewId: number) =>
        [...reportKeys.rateeTeamTitles(), reviewId] as const,
    cycleTitles: () => [...reportKeys.all, 'cycleTitles'] as const,
    cycleTitle: (cycleId: number) =>
        [...reportKeys.cycleTitles(), cycleId] as const,
    reviewStages: () => [...reportKeys.all, 'reviewStages'] as const,
    reviewStage: (reviewId: number) =>
        [...reportKeys.reviewStages(), reviewId] as const,
    allReportAnalytics: () =>
        [...reportKeys.all, 'allReportAnalytics'] as const,
    reportAnalytics: (analyticsId: number) =>
        [...reportKeys.allReportAnalytics(), analyticsId] as const,
    reviews: () => [...reportKeys.all, 'reviews'] as const,
    review: (reviewId: number) => [...reportKeys.reviews(), reviewId] as const,
    ratees: () => [...reportKeys.all, 'ratees'] as const,
    ratee: (rateeId: number) => [...reportKeys.ratees(), rateeId] as const,
};

export function useReportsQuery(params?: ReportFilterQuery) {
    return useQuery<Report[]>({
        queryKey: reportKeys.list(params),
        queryFn: async () => {
            const dtos = await fetchReports(params);
            return dtos.map(mapReportDtoToModel);
        },
    });
}

export function useReportQuery(id: number) {
    return useQuery<Report>({
        queryKey: reportKeys.detail(id),
        queryFn: async () => {
            const dto = await fetchReportById(id);
            return mapReportDtoToModel(dto);
        },
        enabled: id > 0,
    });
}

export function useRateeFullNameQuery(reviewId: number) {
    return useQuery<string>({
        queryKey: reportKeys.rateeFullName(reviewId),
        queryFn: () => fetchRateeFullNameByReviewId(reviewId),
        enabled: reviewId > 0,
    });
}

export function useRateeFullNamesQuery(reviewIds: number[]) {
    const queries = useQueries({
        queries: reviewIds.map((reviewId) => ({
            queryKey: reportKeys.rateeFullName(reviewId),
            queryFn: () => fetchRateeFullNameByReviewId(reviewId),
        })),
    });

    const rateeFullNames: Record<number, string> = {};
    reviewIds.forEach((reviewId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            rateeFullNames[reviewId] = result.data;
        }
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { rateeFullNames, isLoading };
}

export function useRateePositionTitleQuery(reviewId: number) {
    return useQuery<string>({
        queryKey: reportKeys.rateePositionTitle(reviewId),
        queryFn: () => fetchRateePositionTitleByReviewId(reviewId),
        enabled: reviewId > 0,
    });
}

export function useRateePositionTitlesQuery(reviewIds: number[]) {
    const queries = useQueries({
        queries: reviewIds.map((reviewId) => ({
            queryKey: reportKeys.rateePositionTitle(reviewId),
            queryFn: () => fetchRateePositionTitleByReviewId(reviewId),
        })),
    });

    const rateePositionTitles: Record<number, string> = {};
    reviewIds.forEach((reviewId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            rateePositionTitles[reviewId] = result.data;
        }
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { rateePositionTitles, isLoading };
}

export function useRateeTeamTitleQuery(reviewId: number) {
    return useQuery<string | null>({
        queryKey: reportKeys.rateeTeamTitle(reviewId),
        queryFn: () => fetchRateeTeamTitleByReviewId(reviewId),
        enabled: reviewId > 0,
    });
}

export function useRateeTeamTitlesQuery(reviewIds: number[]) {
    const queries = useQueries({
        queries: reviewIds.map((reviewId) => ({
            queryKey: reportKeys.rateeTeamTitle(reviewId),
            queryFn: () => fetchRateeTeamTitleByReviewId(reviewId),
        })),
    });

    const rateeTeamTitles: Record<number, string | null> = {};
    reviewIds.forEach((reviewId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            rateeTeamTitles[reviewId] = result.data;
        }
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { rateeTeamTitles, isLoading };
}

export function useCycleTitleQuery(cycleId: number) {
    return useQuery<string>({
        queryKey: reportKeys.cycleTitle(cycleId),
        queryFn: () => fetchCycleTitleById(cycleId),
        enabled: cycleId > 0,
    });
}

export function useCycleTitlesQuery(cycleIds: number[]) {
    const queries = useQueries({
        queries: cycleIds.map((cycleId, index) => ({
            queryKey: reportKeys.cycleTitle(cycleId),
            queryFn: () => fetchCycleTitleById(cycleId[index]),
        })),
    });

    const cycleTitles: Record<number, string> = {};
    cycleIds.forEach((cycleId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            cycleTitles[cycleId] = result.data;
        }
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { cycleTitles, isLoading };
}

export function useReviewStageQuery(reviewId: number) {
    return useQuery<ReviewStage>({
        queryKey: reportKeys.reviewStage(reviewId),
        queryFn: () => fetchReviewStageByReviewId(reviewId),
        enabled: reviewId > 0,
    });
}

export function useReviewStagesQuery(reviewIds: number[]) {
    const queries = useQueries({
        queries: reviewIds.map((reviewId) => ({
            queryKey: reportKeys.reviewStage(reviewId),
            queryFn: () => fetchReviewStageByReviewId(reviewId),
        })),
    });

    const reviewStages: Record<number, ReviewStage> = {};
    reviewIds.forEach((reviewId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            reviewStages[reviewId] = result.data;
        }
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { reviewStages, isLoading };
}

export function useReportAnalyticsQuery(analyticsId: number) {
    return useQuery<ReportAnalytics[]>({
        queryKey: reportKeys.reportAnalytics(analyticsId),
        queryFn: async () => {
            const dtos = await fetchReportAnalyticsByReportId(analyticsId);
            return dtos.map(mapReportAnalyticsDtoToModel);
        },
        enabled: analyticsId > 0,
    });
}

export function useAllReportAnalyticsQuery(analyticsIds: number[]) {
    const queries = useQueries({
        queries: analyticsIds.map((analyticsId, index) => ({
            queryKey: reportKeys.reportAnalytics(analyticsId),
            queryFn: () => fetchReportAnalyticsByReportId(analyticsIds[index]),
        })),
    });

    const reportAnalytics: Record<number, ReportAnalytics[]> = {};
    analyticsIds.forEach((reportId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            reportAnalytics[reportId] = result.data.map(
                mapReportAnalyticsDtoToModel,
            );
        }
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { reportAnalytics, isLoading };
}

export function useReportReviewsQuery(reviewIds: number[]) {
    return useQueries<Review[]>({
        queries: reviewIds.map((reviewId) => ({
            queryKey: reportKeys.review(reviewId),
            queryFn: async () => {
                const dto = await fetchReviewById(reviewId);
                return mapReviewDtoToModel(dto);
            },
        })),
    });
}

export function useReportReviewQuery(reviewId: number) {
    return useQuery<Review>({
        queryKey: reportKeys.review(reviewId),
        queryFn: async () => {
            const dto = await fetchReviewById(reviewId);
            return mapReviewDtoToModel(dto);
        },
        enabled: !!reviewId && reviewId > 0,
    });
}

export function useReportRateesQuery(rateeIds: number[]) {
    return useQueries<User[]>({
        queries: rateeIds.map((rateeId) => ({
            queryKey: reportKeys.ratee(rateeId),
            queryFn: async () => {
                const dto = await fetchUserById(rateeId);
                return mapUserResponseDtoToModel(dto);
            },
        })),
    });
}

export function useReportRateeQuery(rateeId: number) {
    return useQuery<User>({
        queryKey: reportKeys.ratee(rateeId),
        queryFn: async () => {
            const dto = await fetchUserById(rateeId);
            return mapUserResponseDtoToModel(dto);
        },
        enabled: !!rateeId && rateeId > 0,
    });
}
