import { fetchReviewAnswers } from '@entities/feedback360/answer/api/answer.api';
import { fetchCycleTitleById } from '@entities/feedback360/cycle/api/cycle.api';
import { fetchReviewByReportId } from '@entities/feedback360/review/api/review.api';
import { fetchReportComments } from '@entities/reporting/individual-report-comment/api/individual-report-comment.api';
import {
    Answer,
    mapAnswerDtoToModel,
    mapReportCommentDtoToModel,
    mapReportDtoToModel,
    mapReviewDtoToModel,
    Report,
    ReportComment,
    Review,
} from '@entities/reporting/individual-report-comment/model/mappers';
import { fetchReportById } from '@entities/reporting/individual-report/api/individual-report.api';
import { useQueries, useQuery } from '@tanstack/react-query';

export const commentKeys = {
    all: ['reports'] as const,
    lists: () => [...commentKeys.all, 'list'] as const,
    list: (reportId: number) => [...commentKeys.lists(), reportId] as const,
    details: () => [...commentKeys.all, 'detail'] as const,
    detail: (id: number) => [...commentKeys.details(), id] as const,
    reports: () => [...commentKeys.all, 'reports'] as const,
    report: (reportId: number) => [...commentKeys.reports(), reportId] as const,
    reviews: () => [...commentKeys.all, 'reviews'] as const,
    review: (reviewId: number) => [...commentKeys.reviews(), reviewId] as const,
    cycleTitles: () => [...commentKeys.all, 'cycleTitles'] as const,
    cycleTitle: (cycleId: number) =>
        [...commentKeys.cycleTitles(), cycleId] as const,
    answers: () => [...commentKeys.all, 'answers'] as const,
    answer: (answerId: number) => [...commentKeys.answers(), answerId] as const,
};

export function useReportCommentsQuery(reportId: number) {
    return useQuery<ReportComment[]>({
        queryKey: commentKeys.list(reportId),
        queryFn: async () => {
            const dtos = await fetchReportComments(reportId);
            return dtos.map(mapReportCommentDtoToModel);
        },
        enabled: reportId > 0,
    });
}

export function useAllReportCommentsQuery(reportIds: number[]) {
    const queries = useQueries({
        queries: reportIds.map((reportId) => ({
            queryKey: commentKeys.detail(reportId),
            queryFn: () => fetchReportComments(reportId),
        })),
    });

    const reportComments: Record<number, ReportComment[]> = {};
    reportIds.forEach((reportId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            reportComments[reportId] = result.data.map(
                mapReportCommentDtoToModel,
            );
        }
    });

    const isLoading = queries.some((q) => q.isLoading);
    const isError = queries.some((q) => q.isError);

    return { reportComments, isLoading, isError };
}

export function useCommentReportQuery(reportId: number) {
    return useQuery<Report>({
        queryKey: commentKeys.report(reportId),
        queryFn: async () => {
            const dto = await fetchReportById(reportId);
            return mapReportDtoToModel(dto);
        },
        enabled: reportId > 0,
    });
}

export function useAllCommentReportsQuery(reportsIds: number[]) {
    const queries = useQueries({
        queries: reportsIds.map((reportId) => ({
            queryKey: commentKeys.report(reportId),
            queryFn: () => fetchReportById(reportId),
        })),
    });

    const reports: Record<number, Report> = {};
    reportsIds.forEach((reportId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            reports[reportId] = mapReportDtoToModel(result.data);
        }
    });

    const isLoading = queries.some((q) => q.isLoading);
    const isError = queries.some((q) => q.isError);

    return { reports, isLoading, isError };
}

export function useCommentReviewQuery(reportId: number) {
    return useQuery<Review | null>({
        queryKey: commentKeys.report(reportId),
        queryFn: async () => {
            const dto = await fetchReviewByReportId(reportId);
            if (!dto) return null;
            return mapReviewDtoToModel(dto);
        },
        enabled: reportId > 0,
    });
}

export function useAllCommentReviewsQuery(reportsIds: number[]) {
    const queries = useQueries({
        queries: reportsIds.map((reportId) => ({
            queryKey: commentKeys.report(reportId),
            queryFn: () => fetchReviewByReportId(reportId),
        })),
    });

    const reviews: Record<number, Review> = {};
    reportsIds.forEach((reportId, index) => {
        const result = queries[index];
        if (
            result.isSuccess &&
            result.data !== undefined &&
            result.data !== null
        ) {
            reviews[reportId] = mapReviewDtoToModel(result.data);
        }
    });

    const isLoading = queries.some((q) => q.isLoading);
    const isError = queries.some((q) => q.isError);

    return { reviews, isLoading, isError };
}

export function useCommentCycleTitleQuery(cycleId: number) {
    return useQuery<string>({
        queryKey: commentKeys.cycleTitle(cycleId),
        queryFn: () => fetchCycleTitleById(cycleId),
        enabled: cycleId > 0,
    });
}

export function useAllCommentCycleTitlesQuery(cycleIds: number[]) {
    const queries = useQueries({
        queries: cycleIds.map((cycleId) => ({
            queryKey: commentKeys.cycleTitle(cycleId),
            queryFn: () => fetchCycleTitleById(cycleId),
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
    const isError = queries.some((q) => q.isError);

    return { cycleTitles, isLoading, isError };
}

export function useReviewAnswersQuery(reviewId: number) {
    return useQuery<Answer[]>({
        queryKey: commentKeys.answer(reviewId),
        queryFn: async () => {
            const dtos = await fetchReviewAnswers(reviewId);
            return dtos.map(mapAnswerDtoToModel);
        },
        enabled: reviewId > 0,
    });
}

export function useAllReportAnswersQuery(reviewIds: number[]) {
    const queries = useQueries({
        queries: reviewIds.map((reviewId) => ({
            queryKey: commentKeys.answer(reviewId),
            queryFn: () => fetchReviewAnswers(reviewId),
        })),
    });

    const answers: Record<number, Answer[]> = {};
    reviewIds.forEach((reportId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            answers[reportId] = result.data.map(mapAnswerDtoToModel);
        }
    });

    const isLoading = queries.some((q) => q.isLoading);
    const isError = queries.some((q) => q.isError);

    return { answers, isLoading, isError };
}
