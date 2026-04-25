import { fetchTeamMembers } from "./team-member.api";
import { mapUserTeamMemberDtoToModel, TeamMember, UserTeamMember, mapTeamMemberDtoToModel } from "../model/mappers";
import { useQueries, useQuery } from '@tanstack/react-query';
import { TeamMemberResponseDto } from "@entities/organisation/team-member/model/types";

export const teamMemberKeys = {
    all: ['team-members'] as const,
    lists: () => [...teamMemberKeys.all, 'lists'] as const,
    list: () => [...teamMemberKeys.lists()] as const,
    details: () => [...teamMemberKeys.all, 'details'] as const,
    detail: (id: number) => [...teamMemberKeys.details(), id] as const,
    allUsers: () => [...teamMemberKeys.all, 'allUsers'] as const,
    users: (teamId: number) => [...teamMemberKeys.allUsers(), teamId] as const,
};

export function useTeamMembersQuery(teamId: number) {
    return useQuery<UserTeamMember[]>({
        queryKey: teamMemberKeys.users(teamId),
        queryFn: async () => {
            const dtos = await fetchTeamMembers(teamId);
            return dtos.map(mapUserTeamMemberDtoToModel);
        },
        enabled: teamId > 0,
    });
}

export function useAllTeamMembersQuery(teamIds: number[]) {
    const queries = useQueries({
        queries: teamIds.map((teamId, index) => ({
            queryKey: teamMemberKeys.users(teamId),
            queryFn: () => fetchTeamMembers(teamId),
        })),
    });

    const teamMembers: Record<number, UserTeamMember[]> = {};
    teamIds.forEach((teamId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            teamMembers[teamId] = result.data.map(mapUserTeamMemberDtoToModel);
        }
    });


    const isLoading = queries.some((q) => q.isLoading);
    const isError = queries.some((q) => q.isError);

    return { teamMembers, isLoading, isError };
}
