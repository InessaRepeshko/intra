import { useQueries, useQuery } from '@tanstack/react-query';
import { type Reviewer, mapReviewerDtoToModel } from '../model/mappers';
import { ReviewerFilterQuery } from '../model/types';
import { fetchReviewReviewers } from './reviewer.api';

export const reviewerKeys = {
    all: ['reviewers'] as const,
    lists: () => [...reviewerKeys.all, 'list'] as const,
    list: (reviewId: number, filters?: ReviewerFilterQuery) =>
        [...reviewerKeys.lists(), reviewId, filters ?? {}] as const,
    details: () => [...reviewerKeys.all, 'detail'] as const,
    detail: (id: number) => [...reviewerKeys.details(), id] as const,
};

export function useReviewReviewersQuery(
    reviewId: number,
    params?: ReviewerFilterQuery,
) {
    return useQuery<Reviewer[]>({
        queryKey: reviewerKeys.list(reviewId, params),
        queryFn: async () => {
            const dtos = await fetchReviewReviewers(reviewId, params);
            return dtos.map(mapReviewerDtoToModel);
        },
        enabled: reviewId > 0,
    });
}

export function useAllReviewsReviewersQuery(reviewIds: number[]) {
    const queries = useQueries({
        queries: reviewIds.map((reviewId) => ({
            queryKey: reviewerKeys.list(reviewId),
            queryFn: async () => {
                const dtos = await fetchReviewReviewers(reviewId);
                return dtos.map(mapReviewerDtoToModel);
            },
            enabled: reviewId > 0,
        })),
    });

    const reviewers: { reviewId: number; reviewers: Reviewer[] }[] = [];
    reviewIds.forEach((reviewId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            reviewers.push({ reviewId, reviewers: result.data });
        }
    });

    const isLoading = queries.some((q) => q.isLoading);
    const isError = queries.some((q) => q.isError);

    return { data: reviewers, isLoading, isError };
}
