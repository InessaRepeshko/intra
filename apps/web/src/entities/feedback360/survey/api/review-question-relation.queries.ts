import { fetchCycleTitleById } from '@entities/feedback360/cycle/api/cycle.api';
import { fetchReviewById } from '@entities/feedback360/review/api/review.api';
import {
    mapReviewDtoToModel,
    Review,
} from '@entities/feedback360/review/model/mappers';
import { useQueries, useQuery } from '@tanstack/react-query';
import { mapSurveyQuestionDtoToModel, SurveyQuestion } from '../model/mappers';
import { fetchReviewQuestions } from './review-question-relation.api';

export const reviewQuestionKeys = {
    all: ['reviewQuestions'] as const,
    lists: () => [...reviewQuestionKeys.all, 'list'] as const,
    list: (reviewId: number) =>
        [...reviewQuestionKeys.lists(), reviewId] as const,
    details: () => [...reviewQuestionKeys.all, 'detail'] as const,
    detail: (id: number) => [...reviewQuestionKeys.details(), id] as const,
    reviews: () => [...reviewQuestionKeys.all, 'reviews'] as const,
    review: (reviewId: number) =>
        [...reviewQuestionKeys.reviews(), reviewId] as const,
    cycleTitles: () => [...reviewQuestionKeys.all, 'cycleTitles'] as const,
    cycleTitle: (cycleId: number) =>
        [...reviewQuestionKeys.cycleTitles(), cycleId] as const,
};

export function useSurveyQuestionsQuery(reviewId: number) {
    return useQuery<SurveyQuestion[]>({
        queryKey: reviewQuestionKeys.list(reviewId),
        queryFn: async () => {
            const dtos = await fetchReviewQuestions(reviewId);
            return dtos.map(mapSurveyQuestionDtoToModel);
        },
    });
}

export function useAllSurveyQuestionsQuery(reviewIds: number[]) {
    const uniqueReviewIds = Array.from(new Set(reviewIds));

    const queries = useQueries({
        queries: uniqueReviewIds.map((reviewId) => ({
            queryKey: reviewQuestionKeys.list(reviewId),
            queryFn: async () => {
                const dtos = await fetchReviewQuestions(reviewId);
                return dtos.map(mapSurveyQuestionDtoToModel);
            },
        })),
    });

    const surveyQuestions: Record<number, SurveyQuestion[]> = {};
    uniqueReviewIds.forEach((reviewId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            surveyQuestions[reviewId] = Array.isArray(result.data)
                ? result.data
                : [];
        }
    });

    const isLoading = queries.some((q) => q.isLoading);
    const isError = queries.some((q) => q.isError);

    return { surveyQuestions, isLoading, isError };
}

export function useSurveyReviewQuery(reviewId: number) {
    return useQuery<Review>({
        queryKey: reviewQuestionKeys.review(reviewId),
        queryFn: async () => {
            const dto = await fetchReviewById(reviewId);
            return mapReviewDtoToModel(dto);
        },
        enabled: reviewId > 0,
    });
}

export function useSurveyReviewsQuery(reviewIds: number[]) {
    const queries = useQueries({
        queries: reviewIds.map((reviewId) => ({
            queryKey: reviewQuestionKeys.review(reviewId),
            queryFn: async () => {
                const dto = await fetchReviewById(reviewId);
                return mapReviewDtoToModel(dto);
            },
        })),
    });

    const reviews: Record<number, Review> = {};
    reviewIds.forEach((reviewId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            reviews[reviewId] = result.data;
        }
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { reviews, isLoading };
}

export function useSurveyCycleTitleQuery(cycleId: number) {
    return useQuery<string>({
        queryKey: reviewQuestionKeys.cycleTitle(cycleId),
        queryFn: () => fetchCycleTitleById(cycleId),
        enabled: cycleId > 0,
    });
}

export function useSurveyCycleTitlesQuery(cycleIds: number[]) {
    const queries = useQueries({
        queries: cycleIds.map((cycleId, index) => ({
            queryKey: reviewQuestionKeys.cycleTitle(cycleId),
            queryFn: () => fetchCycleTitleById(cycleIds[index]),
        })),
    });

    const cycleTitles: Record<number, string> = {};
    cycleIds.forEach((cycleId, index) => {
        const result = queries[index];
        const cycle = cycleIds[index];
        if (
            result.isSuccess &&
            result.data !== undefined &&
            cycle !== undefined
        ) {
            cycleTitles[cycle] = result.data;
        }
    });

    const isLoading = queries.some((q) => q.isLoading);
    const isError = queries.some((q) => q.isError);

    return { cycleTitles, isLoading, isError };
}
