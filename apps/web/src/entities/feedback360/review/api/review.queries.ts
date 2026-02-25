import type { ReviewFilterQuery } from '../model/types';

export const reviewKeys = {
    all: ['reviews'] as const,
    lists: () => [...reviewKeys.all, 'list'] as const,
    list: (filters?: ReviewFilterQuery) =>
        [...reviewKeys.lists(), filters ?? {}] as const,
    details: () => [...reviewKeys.all, 'detail'] as const,
    detail: (id: number) => [...reviewKeys.details(), id] as const,
    reviewCounts: () => [...reviewKeys.all, 'reviewCounts'] as const,
    reviewCount: (cycleId: number) =>
        [...reviewKeys.reviewCounts(), cycleId] as const,
};
