import { fetchUsersByPositionIds } from '@entities/identity/user/api/user.api';
import { User } from '@entities/identity/user/model/mappers';
import { fetchCompetenceTitlesByIds } from '@entities/library/competence/api/competence.api';
import { useQueries, useQuery } from '@tanstack/react-query';
import { Position, mapPositionDtoToModel } from '../model/mappers';
import { PositionFilterQuery } from '../model/types';
import {
    fetchPositionById,
    fetchPositionCompetenceIds,
    fetchPositions,
} from './position.api';

export const positionKeys = {
    all: ['positions'] as const,
    lists: () => [...positionKeys.all, 'lists'] as const,
    list: (filters?: PositionFilterQuery) =>
        [...positionKeys.lists(), filters ?? {}] as const,
    details: () => [...positionKeys.all, 'details'] as const,
    detail: (id: number) => [...positionKeys.details(), id] as const,
    allCompetenceIds: () => [...positionKeys.all, 'allCompetenceIds'] as const,
    competenceIds: (positionId: number) =>
        [...positionKeys.allCompetenceIds(), positionId] as const,
    allCompetenceTitles: () =>
        [...positionKeys.all, 'allCompetenceTitles'] as const,
    competenceTitles: (positionIds: number[]) =>
        [...positionKeys.allCompetenceTitles(), positionIds] as const,
    allUsers: () => [...positionKeys.all, 'allUsers'] as const,
    users: (positionIds: number[]) =>
        [...positionKeys.allUsers(), ...positionIds] as const,
};

export function usePositionsQuery(params?: PositionFilterQuery) {
    return useQuery<Position[]>({
        queryKey: positionKeys.list(params),
        queryFn: async () => {
            const dtos = await fetchPositions(params);
            return dtos.map(mapPositionDtoToModel);
        },
    });
}

export function usePositionQuery(id: number) {
    return useQuery<Position>({
        queryKey: positionKeys.detail(id),
        queryFn: async () => {
            const dto = await fetchPositionById(id);
            return mapPositionDtoToModel(dto);
        },
        enabled: id > 0,
    });
}

export function usePositionCompetenceIdsQuery(positionId: number) {
    return useQuery<number[]>({
        queryKey: positionKeys.competenceIds(positionId),
        queryFn: () => fetchPositionCompetenceIds(positionId),
        enabled: positionId > 0,
    });
}

export function usePositionAllCompetenceIdsQuery(positionIds: number[]) {
    const queries = useQueries({
        queries: positionIds.map((positionId) => ({
            queryKey: positionKeys.competenceIds(positionId),
            queryFn: () => fetchPositionCompetenceIds(positionId),
        })),
    });

    const competenceIds: Record<number, number[]> = {};
    positionIds.forEach((positionId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            competenceIds[positionId] = result.data;
        }
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { competenceIds, isLoading };
}

export function usePositionCompetenceTitlesQuery(competenceIds: number[]) {
    return useQuery<{ id: number; title: string }[]>({
        queryKey: positionKeys.competenceTitles(competenceIds),
        queryFn: () => fetchCompetenceTitlesByIds(competenceIds),
        enabled: competenceIds.length > 0,
    });
}

export function usePositionAllCompetenceTitlesQuery(
    positionWithCompetenceIds: {
        positionId: number;
        competenceIds: number[];
    }[],
) {
    positionWithCompetenceIds.forEach((position) => {
        position.competenceIds = Array.from(new Set(position.competenceIds));
    });

    const queries = useQueries({
        queries: positionWithCompetenceIds.map((position) => ({
            queryKey: [
                ...positionKeys.competenceTitles([position.positionId]),
                position.competenceIds,
            ],
            queryFn: () => fetchCompetenceTitlesByIds(position.competenceIds),
            enabled: position.competenceIds.length > 0,
        })),
    });

    const competenceTitles: Record<number, { id: number; title: string }[]> =
        {};

    positionWithCompetenceIds.forEach((position, index) => {
        const result = queries[index];
        competenceTitles[position.positionId] =
            result.isSuccess && result.data ? result.data : [];
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { competenceTitles, isLoading };
}

export function usePositionUsersQuery(positionIds: number[]) {
    return useQuery<{ positionId: number; users: User[] }[]>({
        queryKey: positionKeys.users(positionIds),
        queryFn: () => fetchUsersByPositionIds(positionIds),
        enabled: positionIds.length > 0,
    });
}

export function usePositionAllUsersQuery(positionIds: number[]) {
    const uniquePositionIds = Array.from(new Set(positionIds));

    const queries = useQueries({
        queries: uniquePositionIds.map((positionId) => ({
            queryKey: positionKeys.users([positionId]),
            queryFn: () => fetchUsersByPositionIds([positionId]),
            enabled: positionId > 0,
        })),
    });

    const users: { positionId: number; users: User[] }[] = [];

    uniquePositionIds.forEach((positionId, index) => {
        const result = queries[index];
        users.push({
            positionId,
            users:
                result.data?.[0]?.users?.sort((a, b) =>
                    (a.fullName ?? '').localeCompare(b.fullName ?? ''),
                ) ?? [],
        });
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { users, isLoading };
}
