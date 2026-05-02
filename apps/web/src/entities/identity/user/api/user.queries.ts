import { UserSearchQuery } from '@entities/identity/user/model/types';
import { fetchPositionTitleById } from '@entities/organisation/position/api/position.api';
import { fetchTeamTitleById } from '@entities/organisation/team/api/team.api';
import { useQueries, useQuery } from '@tanstack/react-query';
import { type User, mapUserResponseDtoToModel } from '../model/mappers';
import {
    fetchCurrentUser,
    fetchManagerNameByManagerId,
    fetchUserById,
    fetchUsers,
} from './user.api';

export const userKeys = {
    all: ['users'] as const,
    lists: () => [...userKeys.all, 'list'] as const,
    list: (filters?: UserSearchQuery) =>
        [...userKeys.lists(), filters ?? {}] as const,
    details: () => [...userKeys.all, 'detail'] as const,
    detail: (id: number) => [...userKeys.details(), id] as const,
    me: () => [...userKeys.details(), 'me'] as const,
    positionTitles: () => [...userKeys.all, 'positionTitles'] as const,
    positionTitle: (positionId: number) =>
        [...userKeys.positionTitles(), positionId] as const,
    teamTitles: () => [...userKeys.all, 'teamTitles'] as const,
    teamTitle: (teamId: number) => [...userKeys.teamTitles(), teamId] as const,
    managerNames: () => [...userKeys.all, 'managerNames'] as const,
    managerName: (managerId: number) =>
        [...userKeys.managerNames(), managerId] as const,
};

async function enrichUserWithPositionTitle(user: User): Promise<User> {
    if (!user.positionId) return user;
    try {
        const positionTitle = await fetchPositionTitleById(user.positionId);
        return { ...user, positionTitle };
    } catch {
        return user;
    }
}

async function enrichUserWithTeamTitle(user: User): Promise<User> {
    if (!user.teamId) return user;
    try {
        const teamTitle = await fetchTeamTitleById(user.teamId);
        return { ...user, teamTitle };
    } catch {
        return user;
    }
}

async function enrichUserWithManagerName(user: User): Promise<User> {
    if (!user.managerId) return user;
    try {
        const managerName = await fetchManagerNameByManagerId(user.managerId);
        return { ...user, managerName };
    } catch {
        return user;
    }
}

async function enrichUserWithOrgData(user: User): Promise<User> {
    user = await enrichUserWithPositionTitle(user);
    user = await enrichUserWithTeamTitle(user);
    user = await enrichUserWithManagerName(user);
    return user;
}

export function useUsersQuery(params?: UserSearchQuery) {
    return useQuery<User[]>({
        queryKey: userKeys.list(params),
        queryFn: async () => {
            const dtos = await fetchUsers(params);
            return dtos.map(mapUserResponseDtoToModel);
        },
    });
}

export function useUsersByUserIdsQuery(ids: number[]) {
    const queries = useQueries({
        queries: ids.map((id) => ({
            queryKey: userKeys.detail(id),
            queryFn: async () => {
                const dto = await fetchUserById(id);
                const user = mapUserResponseDtoToModel(dto);
                return enrichUserWithOrgData(user);
            },
        })),
    });

    const users: User[] = [];
    ids.forEach((id, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            users.push(result.data);
        }
    });

    const isLoading = queries.some((q) => q.isLoading);
    const isError = queries.some((q) => q.isError);

    return { data: users, isLoading, isError };
}

export function useUserQuery(id: number) {
    return useQuery<User>({
        queryKey: userKeys.detail(id),
        queryFn: async () => {
            const dto = await fetchUserById(id);
            const user = mapUserResponseDtoToModel(dto);
            return enrichUserWithOrgData(user);
        },
    });
}

export function useMeQuery() {
    return useQuery<User>({
        queryKey: userKeys.me(),
        queryFn: async () => {
            const dto = await fetchCurrentUser();
            const user = mapUserResponseDtoToModel(dto);
            return enrichUserWithOrgData(user);
        },
    });
}

export function useUserPositionTitleQuery(userId: number, positionId: number) {
    return useQuery<string>({
        queryKey: userKeys.positionTitle(positionId),
        queryFn: () => fetchPositionTitleById(positionId),
        enabled: userId > 0 && positionId > 0,
    });
}

export function useUserPositionTitlesQuery(positionIds: number[]) {
    const queries = useQueries({
        queries: positionIds.map((positionId, index) => ({
            queryKey: userKeys.positionTitle(positionId),
            queryFn: () => fetchPositionTitleById(positionIds[index]),
        })),
    });

    const positionTitles: Record<number, string> = {};
    positionIds.forEach((positionId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            positionTitles[positionId] = result.data;
        }
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { positionTitles, isLoading };
}

export function useUserTeamTitleQuery(userId: number, teamId: number) {
    return useQuery<string>({
        queryKey: userKeys.teamTitle(teamId),
        queryFn: () => fetchTeamTitleById(teamId),
        enabled: userId > 0 && teamId > 0,
    });
}

export function useUserTeamTitlesQuery(teamIds: number[]) {
    const queries = useQueries({
        queries: teamIds.map((teamId, index) => ({
            queryKey: userKeys.teamTitle(teamId),
            queryFn: () => fetchTeamTitleById(teamIds[index]),
        })),
    });

    const teamTitles: Record<number, string> = {};
    teamIds.forEach((teamId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            teamTitles[teamId] = result.data;
        }
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { teamTitles, isLoading };
}

export function useUserManagerFullNameQuery(userId: number, managerId: number) {
    return useQuery<string>({
        queryKey: userKeys.managerName(managerId),
        queryFn: () => fetchManagerNameByManagerId(managerId),
        enabled: userId > 0 && managerId > 0,
    });
}

export function useUserManagerFullNamesQuery(managerIds: number[]) {
    const queries = useQueries({
        queries: managerIds.map((managerId, index) => ({
            queryKey: userKeys.managerName(managerId),
            queryFn: () => fetchManagerNameByManagerId(managerIds[index]),
        })),
    });

    const managerNames: Record<number, string> = {};
    managerIds.forEach((managerId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            managerNames[managerId] = result.data;
        }
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { managerNames, isLoading };
}
