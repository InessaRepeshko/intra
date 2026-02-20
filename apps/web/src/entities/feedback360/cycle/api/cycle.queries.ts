import { useQueries, useQuery } from '@tanstack/react-query';
import { type Cycle, mapCycleDtoToModel } from '../model/mapper';
import { CycleFilterQuery } from '../model/types';
import {
    fetchCycleById,
    fetchCycles,
    fetchReviewCountByCycleId,
} from './cycle.api';

export const cycleKeys = {
    all: ['cycles'] as const,
    lists: () => [...cycleKeys.all, 'list'] as const,
    list: (filters?: CycleFilterQuery) =>
        [...cycleKeys.lists(), filters ?? {}] as const,
    details: () => [...cycleKeys.all, 'detail'] as const,
    detail: (id: number) => [...cycleKeys.details(), id] as const,
    reviewCounts: () => [...cycleKeys.all, 'reviewCounts'] as const,
    reviewCount: (cycleId: number) =>
        [...cycleKeys.reviewCounts(), cycleId] as const,
};

export function useCyclesQuery(params?: CycleFilterQuery) {
    return useQuery<Cycle[]>({
        queryKey: cycleKeys.list(params),
        queryFn: async () => {
            const dtos = await fetchCycles(params);
            return dtos.map(mapCycleDtoToModel);
        },
    });
}

export function useCycleQuery(id: number) {
    return useQuery<Cycle>({
        queryKey: cycleKeys.detail(id),
        queryFn: async () => {
            const dto = await fetchCycleById(id);
            return mapCycleDtoToModel(dto);
        },
        enabled: id > 0,
    });
}

export function useReviewCountQuery(cycleId: number) {
    return useQuery<number>({
        queryKey: cycleKeys.reviewCount(cycleId),
        queryFn: () => fetchReviewCountByCycleId(cycleId),
        enabled: cycleId > 0,
    });
}

export function useReviewCountsQuery(cycleIds: number[]) {
    const queries = useQueries({
        queries: cycleIds.map((cycleId) => ({
            queryKey: cycleKeys.reviewCount(cycleId),
            queryFn: () => fetchReviewCountByCycleId(cycleId),
        })),
    });

    const reviewCounts: Record<number, number> = {};
    cycleIds.forEach((cycleId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            reviewCounts[cycleId] = result.data;
        }
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { reviewCounts, isLoading };
}
