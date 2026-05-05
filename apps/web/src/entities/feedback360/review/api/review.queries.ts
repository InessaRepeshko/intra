import { fetchReviewAnswerCount } from '@entities/feedback360/answer/api/answer.api';
import { fetchCycleTitleById } from '@entities/feedback360/cycle/api/cycle.api';
import { fetchReviewRespondentCount } from '@entities/feedback360/respondent/api/respondent.api';
import { fetchReviewReviewerCount } from '@entities/feedback360/reviewer/api/reviewer.api';
import { fetchReviewQuestionCount } from '@entities/feedback360/survey/api/review-question-relation.api';
import { useQueries, useQuery } from '@tanstack/react-query';
import { type Review, mapReviewDtoToModel } from '../model/mappers';
import type { ReviewFilterQuery } from '../model/types';
import { fetchReviewById, fetchReviews } from './review.api';

export const reviewKeys = {
    all: ['reviews'] as const,
    lists: () => [...reviewKeys.all, 'list'] as const,
    list: (filters?: ReviewFilterQuery) =>
        [...reviewKeys.lists(), filters ?? {}] as const,
    details: () => [...reviewKeys.all, 'detail'] as const,
    detail: (id: number) => [...reviewKeys.details(), id] as const,
    respondentCounts: () => [...reviewKeys.all, 'respondentCounts'] as const,
    respondentCount: (reviewId: number) =>
        [...reviewKeys.respondentCounts(), reviewId] as const,
    reviewerCounts: () => [...reviewKeys.all, 'reviewerCounts'] as const,
    reviewerCount: (reviewId: number) =>
        [...reviewKeys.reviewerCounts(), reviewId] as const,
    answersCounts: () => [...reviewKeys.all, 'answersCounts'] as const,
    answersCount: (reviewId: number) =>
        [...reviewKeys.answersCounts(), reviewId] as const,
    questionCounts: () => [...reviewKeys.all, 'questionCounts'] as const,
    questionCount: (reviewId: number) =>
        [...reviewKeys.questionCounts(), reviewId] as const,
    cycleTitles: () => [...reviewKeys.all, 'cycleTitles'] as const,
    cycleTitle: (cycleId: number) =>
        [...reviewKeys.cycleTitles(), cycleId] as const,
};

export function useReviewsQuery(params?: ReviewFilterQuery) {
    return useQuery<Review[]>({
        queryKey: reviewKeys.list(params),
        queryFn: async () => {
            const dtos = await fetchReviews(params);
            return Array.isArray(dtos) ? dtos.map(mapReviewDtoToModel) : [];
        },
    });
}

export function useReviewQuery(id: number) {
    return useQuery<Review>({
        queryKey: reviewKeys.detail(id),
        queryFn: async () => {
            const dto = await fetchReviewById(id);
            return mapReviewDtoToModel(dto);
        },
        enabled: id > 0,
    });
}

export function useReviewRespondentCountQuery(reviewId: number) {
    return useQuery<number>({
        queryKey: reviewKeys.respondentCount(reviewId),
        queryFn: () => fetchReviewRespondentCount(reviewId),
        enabled: reviewId > 0,
    });
}

export function useReviewRespondentCountsQuery(reviewIds: number[]) {
    const queries = useQueries({
        queries: reviewIds.map((reviewId) => ({
            queryKey: reviewKeys.respondentCount(reviewId),
            queryFn: () => fetchReviewRespondentCount(reviewId),
        })),
    });

    const respondentCounts: Record<number, number> = {};
    reviewIds.forEach((reviewId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            respondentCounts[reviewId] = result.data;
        }
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { respondentCounts, isLoading };
}

export function useReviewReviewerCountQuery(reviewId: number) {
    return useQuery<number>({
        queryKey: reviewKeys.reviewerCount(reviewId),
        queryFn: () => fetchReviewReviewerCount(reviewId),
        enabled: reviewId > 0,
    });
}

export function useReviewReviewerCountsQuery(reviewIds: number[]) {
    const queries = useQueries({
        queries: reviewIds.map((reviewId) => ({
            queryKey: reviewKeys.reviewerCount(reviewId),
            queryFn: () => fetchReviewReviewerCount(reviewId),
        })),
    });

    const reviewerCounts: Record<number, number> = {};
    reviewIds.forEach((reviewId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            reviewerCounts[reviewId] = result.data;
        }
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { reviewerCounts, isLoading };
}

export function useReviewAnswersCountQuery(reviewId: number) {
    return useQuery<number>({
        queryKey: reviewKeys.answersCount(reviewId),
        queryFn: () => fetchReviewAnswerCount(reviewId),
        enabled: reviewId > 0,
    });
}

export function useReviewAnswersCountsQuery(reviewIds: number[]) {
    const queries = useQueries({
        queries: reviewIds.map((reviewId) => ({
            queryKey: reviewKeys.answersCount(reviewId),
            queryFn: () => fetchReviewAnswerCount(reviewId),
        })),
    });

    const answerCounts: Record<number, number> = {};
    reviewIds.forEach((reviewId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            answerCounts[reviewId] = result.data;
        }
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { answerCounts, isLoading };
}

export function useReviewQuestionCountQuery(reviewId: number) {
    return useQuery<number>({
        queryKey: reviewKeys.questionCount(reviewId),
        queryFn: () => fetchReviewQuestionCount(reviewId),
        enabled: reviewId > 0,
    });
}

export function useReviewQuestionCountsQuery(reviewIds: number[]) {
    const queries = useQueries({
        queries: reviewIds.map((reviewId) => ({
            queryKey: reviewKeys.questionCount(reviewId),
            queryFn: () => fetchReviewQuestionCount(reviewId),
        })),
    });

    const questionCounts: Record<number, number> = {};
    reviewIds.forEach((reviewId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            questionCounts[reviewId] = result.data;
        }
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { questionCounts, isLoading };
}

export function useReviewCycleTitleQuery(reviewId: number, cycleId: number) {
    return useQuery<string>({
        queryKey: reviewKeys.cycleTitle(reviewId),
        queryFn: () => fetchCycleTitleById(cycleId),
        enabled: reviewId > 0 && cycleId > 0,
    });
}

export function useReviewCycleTitlesQuery(
    reviewIds: number[],
    cycleIds: number[],
) {
    const queries = useQueries({
        queries: reviewIds.map((reviewId, index) => ({
            queryKey: reviewKeys.cycleTitle(reviewId),
            queryFn: () => fetchCycleTitleById(cycleIds[index]),
        })),
    });

    const cycleTitles: Record<number, string> = {};
    reviewIds.forEach((reviewId, index) => {
        const result = queries[index];
        const cycleId = cycleIds[index];
        if (
            result.isSuccess &&
            result.data !== undefined &&
            cycleId !== undefined
        ) {
            cycleTitles[cycleId] = result.data;
        }
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { cycleTitles, isLoading };
}

export function useReviewsByIdsQuery(reviewIds: number[]) {
    const uniqueReviewIds = Array.from(new Set(reviewIds));

    const queries = useQueries({
        queries: uniqueReviewIds.map((reviewId) => ({
            queryKey: reviewKeys.detail(reviewId),
            queryFn: async () => {
                const review = await fetchReviewById(reviewId);
                return mapReviewDtoToModel(review);
            },
        })),
    });

    const reviews: Record<number, Review> = {};
    uniqueReviewIds.forEach((reviewId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            reviews[reviewId] = result.data;
        }
    });

    const isLoading = queries.some((q) => q.isLoading);
    const isError = queries.some((q) => q.isError);

    return { reviews, isLoading, isError };
}
