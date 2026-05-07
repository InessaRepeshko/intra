import { fetchPositionTitlesByIds } from '@entities/organisation/position/api/position.api';
import { fetchTeamMembers } from '@entities/organisation/team-member/api/team-member.api';
import {
    UserTeamMember,
    mapUserTeamMemberDtoToModel,
} from '@entities/organisation/team-member/model/mappers';
import { useQueries, useQuery } from '@tanstack/react-query';
import { Team, mapTeamDtoToModel } from '../model/mappers';
import { fetchTeamById, fetchTeams } from './team.api';

export const teamKeys = {
    all: ['teams'] as const,
    lists: () => [...teamKeys.all, 'lists'] as const,
    list: () => [...teamKeys.lists()] as const,
    details: () => [...teamKeys.all, 'details'] as const,
    detail: (id: number) => [...teamKeys.details(), id] as const,
    allUsers: () => [...teamKeys.all, 'allUsers'] as const,
    users: (teamId: number) => [...teamKeys.allUsers(), teamId] as const,
    allPositionTitles: () => [...teamKeys.all, 'allPositionTitles'] as const,
    positionTitles: (teamIds: number[]) =>
        [...teamKeys.allPositionTitles(), teamIds] as const,
};

export function useTeamsQuery() {
    return useQuery<Team[]>({
        queryKey: teamKeys.list(),
        queryFn: async () => {
            const dtos = await fetchTeams();
            return dtos.map(mapTeamDtoToModel);
        },
    });
}

export function useTeamQuery(id: number) {
    return useQuery<Team>({
        queryKey: teamKeys.detail(id),
        queryFn: async () => {
            const dto = await fetchTeamById(id);
            return mapTeamDtoToModel(dto);
        },
        enabled: id > 0,
    });
}

export function useTeamUsersQuery(teamId: number) {
    return useQuery<UserTeamMember[]>({
        queryKey: teamKeys.users(teamId),
        queryFn: async () => {
            const dtos = await fetchTeamMembers(teamId);
            return dtos.map(mapUserTeamMemberDtoToModel);
        },
        enabled: teamId > 0,
    });
}

export function useTeamAllUsersQuery(teamIds: number[]) {
    const uniqueTeamIds = Array.from(new Set(teamIds));

    const queries = useQueries({
        queries: uniqueTeamIds.map((teamId) => ({
            queryKey: teamKeys.users(teamId),
            queryFn: async () => {
                const dtos = await fetchTeamMembers(teamId);
                return dtos.map(mapUserTeamMemberDtoToModel);
            },
            enabled: teamId > 0,
        })),
    });

    const users: { teamId: number; users: UserTeamMember[] }[] = [];

    uniqueTeamIds.forEach((teamId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            users.push({
                teamId,
                users:
                    result.data?.sort((a, b) =>
                        (a.user?.fullName ?? '').localeCompare(
                            b.user?.fullName ?? '',
                        ),
                    ) ?? [],
            });
        }
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { users, isLoading };
}

export function useTeamPositionTitlesQuery(positionIds: number[]) {
    return useQuery<{ id: number; title: string }[]>({
        queryKey: teamKeys.positionTitles(positionIds),
        queryFn: () => fetchPositionTitlesByIds(positionIds),
        enabled: positionIds.length > 0,
    });
}

export function useTeamAllPositionTitlesQuery(
    teamWithPositionIds: {
        teamId: number;
        positionIds: number[];
    }[],
) {
    teamWithPositionIds.forEach((team) => {
        team.positionIds = Array.from(new Set(team.positionIds));
    });

    const queries = useQueries({
        queries: teamWithPositionIds.map((team) => ({
            queryKey: [
                ...teamKeys.positionTitles([team.teamId]),
                team.positionIds,
            ],
            queryFn: () => fetchPositionTitlesByIds(team.positionIds),
            enabled: team.positionIds.length > 0,
        })),
    });

    const positionTitles: Record<number, { id: number; title: string }[]> = {};

    teamWithPositionIds.forEach((team, index) => {
        const result = queries[index];
        positionTitles[team.teamId] =
            result.isSuccess && result.data
                ? result.data?.sort((a, b) => a.title.localeCompare(b.title))
                : [];
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { positionTitles, isLoading };
}
