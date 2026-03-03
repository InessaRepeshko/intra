import { fetchCycleTitleById } from '@/entities/feedback360/cycle/api/cycle.api';
import { fetchClusterById } from '@/entities/library/cluster/api/cluster.api';
import { fetchCompetenceById } from '@/entities/library/competence/api/competence.api';
import { useQueries, useQuery } from '@tanstack/react-query';
import {
    type ClusterScoreAnalytics,
    mapClusterScoreAnalyticsDtoToModel,
} from '../model/mappers';
import type { ClusterScoreAnalyticsFilterQuery } from '../model/types';
import {
    fetchClusterScoreAnalyticsById,
    fetchClusterScoresAnalytics,
} from './cluster-score-analytics.api';

export const clusterScoreAnalyticsKeys = {
    all: ['clusterScoreAnalytics'] as const,
    lists: () => [...clusterScoreAnalyticsKeys.all, 'list'] as const,
    list: (filters?: ClusterScoreAnalyticsFilterQuery) =>
        [...clusterScoreAnalyticsKeys.lists(), filters ?? {}] as const,
    details: () => [...clusterScoreAnalyticsKeys.all, 'detail'] as const,
    detail: (id: number) =>
        [...clusterScoreAnalyticsKeys.details(), id] as const,
    clusterScoreTitles: () =>
        [...clusterScoreAnalyticsKeys.all, 'clusterScoreTitles'] as const,
    clusterScoreTitle: (clusterScoreId: number) =>
        [
            ...clusterScoreAnalyticsKeys.clusterScoreTitles(),
            clusterScoreId,
        ] as const,
    cycleTitles: () =>
        [...clusterScoreAnalyticsKeys.all, 'cycleTitles'] as const,
    cycleTitle: (cycleId: number) =>
        [...clusterScoreAnalyticsKeys.cycleTitles(), cycleId] as const,
    competenceTitles: () =>
        [...clusterScoreAnalyticsKeys.all, 'competenceTitles'] as const,
    competenceTitle: (competenceId: number) =>
        [
            ...clusterScoreAnalyticsKeys.competenceTitles(),
            competenceId,
        ] as const,
};

export function useClusterScoresAnalyticsQuery(
    params?: ClusterScoreAnalyticsFilterQuery,
) {
    return useQuery<ClusterScoreAnalytics[]>({
        queryKey: clusterScoreAnalyticsKeys.list(params),
        queryFn: async () => {
            const dtos = await fetchClusterScoresAnalytics(params);
            return dtos.map(mapClusterScoreAnalyticsDtoToModel);
        },
    });
}

export function useClusterScoreAnalyticsQuery(id: number) {
    return useQuery<ClusterScoreAnalytics>({
        queryKey: clusterScoreAnalyticsKeys.detail(id),
        queryFn: async () => {
            const dto = await fetchClusterScoreAnalyticsById(id);
            return mapClusterScoreAnalyticsDtoToModel(dto);
        },
        enabled: id > 0,
    });
}

export function useClusterScoreAnalyticsClusterScoreTitleQuery(
    clusterId: number,
) {
    return useQuery<{ title: string; description: string }>({
        queryKey: clusterScoreAnalyticsKeys.clusterScoreTitle(clusterId),
        queryFn: async () => {
            const cluster = await fetchClusterById(clusterId);
            return {
                title: cluster?.title,
                description: cluster?.description,
            };
        },
        enabled: clusterId > 0,
    });
}

export function useClusterScoreAnalyticsClusterScoreTitlesQuery(
    clusterIds: number[],
) {
    const queries = useQueries({
        queries: clusterIds.map((clusterId) => ({
            queryKey: clusterScoreAnalyticsKeys.clusterScoreTitle(clusterId),
            queryFn: async () => {
                const cluster = await fetchClusterById(clusterId);
                return {
                    title: cluster?.title,
                    description: cluster?.description,
                    competenceId: cluster?.competenceId,
                };
            },
        })),
    });

    const clusterData: Record<
        number,
        { title: string; description: string; competenceId: number }
    > = {};
    clusterIds.forEach((clusterId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            clusterData[clusterId] = result.data;
        }
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { clusterData, isLoading };
}

export function useClusterScoreAnalyticsCycleTitleQuery(cycleId: number) {
    return useQuery<string>({
        queryKey: clusterScoreAnalyticsKeys.cycleTitle(cycleId),
        queryFn: () => fetchCycleTitleById(cycleId),
        enabled: cycleId > 0,
    });
}

export function useClusterScoreAnalyticsCycleTitlesQuery(cycleIds: number[]) {
    const queries = useQueries({
        queries: cycleIds.map((cycleId) => ({
            queryKey: clusterScoreAnalyticsKeys.cycleTitle(cycleId),
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

    return { cycleTitles, isLoading };
}

export function useClusterScoreAnalyticsCompetenceTitleQuery(
    competenceId: number,
) {
    return useQuery<{
        title: string;
        code: string | null;
        description: string | null;
    }>({
        queryKey: clusterScoreAnalyticsKeys.competenceTitle(competenceId),
        queryFn: async () => {
            const competence = await fetchCompetenceById(competenceId);
            return {
                title: competence?.title,
                code: competence?.code,
                description: competence?.description,
            };
        },
        enabled: competenceId > 0,
    });
}

export function useClusterScoreAnalyticsCompetenceTitlesQuery(
    competenceIds: number[],
) {
    const queries = useQueries({
        queries: competenceIds.map((competenceId) => ({
            queryKey: clusterScoreAnalyticsKeys.competenceTitle(competenceId),
            queryFn: async () => {
                const competence = await fetchCompetenceById(competenceId);
                return {
                    title: competence?.title,
                    code: competence?.code,
                    description: competence?.description,
                };
            },
        })),
    });

    const competenceTitles: Record<
        number,
        { title: string; code: string | null; description: string | null }
    > = {};
    competenceIds.forEach((competenceId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            competenceTitles[competenceId] = result.data;
        }
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { competenceTitles, isLoading };
}
