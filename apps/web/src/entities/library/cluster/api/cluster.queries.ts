import { fetchCompetenceTitleById } from '@/entities/library/competence/api/competence.api';
import { useQueries, useQuery } from '@tanstack/react-query';
import { Cluster, mapClusterDtoToModel } from '../model/mappers';
import { ClusterFilterQuery } from '../model/types';
import { fetchClusterById, fetchClusters } from './cluster.api';

export const clusterKeys = {
    all: ['clusters'] as const,
    lists: () => [...clusterKeys.all, 'list'] as const,
    list: (filters?: ClusterFilterQuery) =>
        [...clusterKeys.lists(), filters ?? {}] as const,
    details: () => [...clusterKeys.all, 'detail'] as const,
    detail: (id: number) => [...clusterKeys.details(), id] as const,
    competenceTitles: () => [...clusterKeys.all, 'competenceTitles'] as const,
    competenceTitle: (competenceId: number) =>
        [...clusterKeys.competenceTitles(), competenceId] as const,
};

export function useClustersQuery(params?: ClusterFilterQuery) {
    return useQuery<Cluster[]>({
        queryKey: clusterKeys.list(params),
        queryFn: async () => {
            const dtos = await fetchClusters(params);
            return dtos.map(mapClusterDtoToModel);
        },
    });
}

export function useClusterQuery(id: number) {
    return useQuery<Cluster>({
        queryKey: clusterKeys.detail(id),
        queryFn: async () => {
            const dto = await fetchClusterById(id);
            return mapClusterDtoToModel(dto);
        },
        enabled: id > 0,
    });
}

export function useCompetenceTitleQuery(competenceId: number) {
    return useQuery<string>({
        queryKey: clusterKeys.competenceTitle(competenceId),
        queryFn: () => fetchCompetenceTitleById(competenceId),
        enabled: competenceId > 0,
    });
}

export function useCompetenceTitlesQuery(competenceIds: number[]) {
    const queries = useQueries({
        queries: competenceIds.map((competenceId) => ({
            queryKey: clusterKeys.competenceTitle(competenceId),
            queryFn: () => fetchCompetenceTitleById(competenceId),
        })),
    });

    const competenceTitles: Record<number, string> = {};
    competenceIds.forEach((competenceId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            competenceTitles[competenceId] = result.data;
        }
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { competenceTitles, isLoading };
}
