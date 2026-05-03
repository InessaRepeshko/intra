import { useQueries, useQuery } from '@tanstack/react-query';
import { type Respondent, mapRespondentDtoToModel } from '../model/mappers';
import { RespondentFilterQuery } from '../model/types';
import { fetchReviewRespondents } from './respondent.api';

export const respondentKeys = {
    all: ['respondents'] as const,
    lists: () => [...respondentKeys.all, 'list'] as const,
    list: (reviewId: number, filters?: RespondentFilterQuery) =>
        [...respondentKeys.lists(), reviewId, filters ?? {}] as const,
    details: () => [...respondentKeys.all, 'detail'] as const,
    detail: (id: number) => [...respondentKeys.details(), id] as const,
};

export function useReviewRespondentsQuery(
    reviewId: number,
    params?: RespondentFilterQuery,
) {
    return useQuery<Respondent[]>({
        queryKey: respondentKeys.list(reviewId, params),
        queryFn: async () => {
            const dtos = await fetchReviewRespondents(reviewId, params);
            return dtos.map(mapRespondentDtoToModel);
        },
        enabled: reviewId > 0,
    });
}

export function useAllReviewsRespondentsQuery(reviewIds: number[]) {
    const queries = useQueries({
        queries: reviewIds.map((reviewId) => ({
            queryKey: respondentKeys.list(reviewId),
            queryFn: async () => {
                const dtos = await fetchReviewRespondents(reviewId);
                return dtos.map(mapRespondentDtoToModel);
            },
            enabled: reviewId > 0,
        })),
    });

    const respondents: { reviewId: number; respondents: Respondent[] }[] = [];
    reviewIds.forEach((reviewId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            respondents.push({ reviewId, respondents: result.data });
        }
    });

    const isLoading = queries.some((q) => q.isLoading);
    const isError = queries.some((q) => q.isError);

    return { data: respondents, isLoading, isError };
}
