import {
    CreateTeamPayload,
    TeamFilterQuery,
    TeamResponseDto,
    UpdateTeamPayload,
} from '@entities/organisation/team/model/types';
import { apiClient } from '@shared/api/api-client';

const TEAMS_BASE = '/organisation/teams';

export async function fetchTeams(
    params?: TeamFilterQuery,
): Promise<TeamResponseDto[]> {
    const { data } = await apiClient.get<TeamResponseDto[]>(TEAMS_BASE, {
        params,
    });
    return data;
}

export async function fetchTeamById(id: number): Promise<TeamResponseDto> {
    const { data } = await apiClient.get<TeamResponseDto>(
        `${TEAMS_BASE}/${id}`,
    );
    return data;
}

export async function createTeam(
    payload: CreateTeamPayload,
): Promise<TeamResponseDto> {
    const { data } = await apiClient.post<TeamResponseDto>(TEAMS_BASE, payload);
    return data;
}

export async function updateTeam(
    id: number,
    payload: UpdateTeamPayload,
): Promise<TeamResponseDto> {
    const { data } = await apiClient.patch<TeamResponseDto>(
        `${TEAMS_BASE}/${id}`,
        payload,
    );
    return data;
}

export async function deleteTeam(id: number): Promise<void> {
    await apiClient.delete<void>(`${TEAMS_BASE}/${id}`);
}

export async function fetchTeamTitleById(teamId: number): Promise<string> {
    const response = await apiClient.get<TeamResponseDto>(
        `${TEAMS_BASE}/${teamId}`,
    );
    return response.data?.title;
}

export async function fetchTeamTitlesByIds(
    teamIds: number[],
): Promise<{ id: number; title: string }[]> {
    const uniqueIds = Array.from(new Set(teamIds));

    const data = await Promise.all(
        uniqueIds.map(async (teamId) => {
            const title = await fetchTeamTitleById(teamId);
            return { id: teamId, title };
        }),
    );

    const teams: { id: number; title: string }[] = data.sort((a, b) =>
        a.title.localeCompare(b.title),
    );
    return teams;
}
