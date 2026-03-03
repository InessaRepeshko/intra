import { UserSearchQuery } from '@entities/identity/user/model/types';
import { useQuery } from '@tanstack/react-query';
import { type User, mapUserDtoToModel } from '../model/mappers';
import {
    fetchCurrentUser,
    fetchManagerNameByManagerId,
    fetchPositionTitleById,
    fetchTeamTitleByTeamId,
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
        const teamTitle = await fetchTeamTitleByTeamId(user.teamId);
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
            return dtos.map(mapUserDtoToModel);
        },
    });
}

export function useUserQuery(id: number) {
    return useQuery<User>({
        queryKey: userKeys.detail(id),
        queryFn: async () => {
            const dto = await fetchUserById(id);
            const user = mapUserDtoToModel(dto);
            return enrichUserWithOrgData(user);
        },
    });
}

export function useMeQuery() {
    return useQuery<User>({
        queryKey: userKeys.me(),
        queryFn: async () => {
            const dto = await fetchCurrentUser();
            const user = mapUserDtoToModel(dto);
            return enrichUserWithOrgData(user);
        },
    });
}
