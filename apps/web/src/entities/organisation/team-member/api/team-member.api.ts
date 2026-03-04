import {
    AddTeamMemberPayload,
    TeamMemberResponseDto,
} from '@entities/organisation/team-member/model/types';
import { apiClient } from '@shared/api/api-client';

const TEAM_MEMBERS_BASE = (teamId: number) =>
    `/organisation/teams/${teamId}/members`;

export async function fetchTeamMembers(
    teamId: number,
): Promise<TeamMemberResponseDto[]> {
    const { data } = await apiClient.get<TeamMemberResponseDto[]>(
        TEAM_MEMBERS_BASE(teamId),
    );
    return data;
}

export async function addTeamMember(
    teamId: number,
    payload: AddTeamMemberPayload,
): Promise<TeamMemberResponseDto> {
    const { data } = await apiClient.post<TeamMemberResponseDto>(
        TEAM_MEMBERS_BASE(teamId),
        payload,
    );
    return data;
}

export async function deleteTeamMember(
    teamId: number,
    memberId: number,
): Promise<void> {
    await apiClient.delete<void>(`${TEAM_MEMBERS_BASE(teamId)}/${memberId}`);
}
