import { fetchCycleTitleById } from '@entities/feedback360/cycle/api/cycle.api';
import { fetchRespondentCategoriesByReviewId } from '@entities/feedback360/respondent/api/respondent.api';
import {
    fetchRateeFullNameByReviewId,
    fetchRateePositionTitleByReviewId,
    fetchRateeTeamTitleByReviewId,
    fetchReviewStageByReviewId,
} from '@entities/feedback360/review/api/review.api';
import { ReviewStage } from '@entities/reporting/report/model/types';
import { useQueries, useQuery } from '@tanstack/react-query';
import { type Report, mapReportDtoToModel } from '../model/mappers';
import { ReportFilterQuery, RespondentCategory } from '../model/types';
import { fetchReportById, fetchReports } from './report.api';

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
    respondentCategories: () =>
        [...reportKeys.all, 'respondentCategories'] as const,
    respondentCategory: (reviewId: number) =>
        [...reportKeys.respondentCategories(), reviewId] as const,
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

export function useRespondentCategoryQuery(reviewId: number) {
    return useQuery<RespondentCategory[]>({
        queryKey: reportKeys.respondentCategory(reviewId),
        queryFn: () => fetchRespondentCategoriesByReviewId(reviewId),
        enabled: reviewId > 0,
    });
}

export function useRespondentCategoriesQuery(reviewIds: number[]) {
    const queries = useQueries({
        queries: reviewIds.map((reviewId) => ({
            queryKey: reportKeys.respondentCategory(reviewId),
            queryFn: () => fetchRespondentCategoriesByReviewId(reviewId),
        })),
    });

    const respondentCategories: Record<number, RespondentCategory[]> = {};
    reviewIds.forEach((reviewId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            respondentCategories[reviewId] = result.data;
        }
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { respondentCategories, isLoading };
}
