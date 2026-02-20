import { PositionDto } from '@/entities/position/model/types';
import { TeamDto } from '@/entities/team/model/types';
import type {
    CreateUserPayload,
    IdentityRole,
    UpdateUserPayload,
    UserDto,
    UserSearchQuery,
} from '@/entities/user/model/types';
import { apiClient } from '@/shared/api/api-client';

const USERS_BASE = 'identity/users';
const POSITIONS_BASE = 'organization/positions';
const TEAMS_BASE = 'organization/teams';

export async function fetchCurrentUser(): Promise<UserDto> {
    const response = await apiClient.get<UserDto>(`${USERS_BASE}/me`);
    return response.data;
}

export async function fetchUserById(id: number): Promise<UserDto> {
    const response = await apiClient.get<UserDto>(`${USERS_BASE}/${id}`);
    return response.data;
}

export async function fetchUsers(params?: UserSearchQuery): Promise<UserDto[]> {
    const { data } = await apiClient.get<UserDto[]>(USERS_BASE, { params });
    return data;
}

export async function createUser(payload: CreateUserPayload): Promise<UserDto> {
    const { data } = await apiClient.post<UserDto>(USERS_BASE, payload);
    return data;
}

export async function updateUser(
    id: number,
    payload: UpdateUserPayload,
): Promise<UserDto> {
    const { data } = await apiClient.patch<UserDto>(
        `${USERS_BASE}/${id}`,
        payload,
    );
    return data;
}

export async function deleteUser(id: number): Promise<void> {
    await apiClient.delete(`${USERS_BASE}/${id}`);
}

export async function changeUserRoles(
    userId: number,
    roles: IdentityRole[],
): Promise<void> {
    await apiClient.put(`${USERS_BASE}/${userId}/roles`, roles);
}

export async function fetchPositionTitleByPositionId(
    positionId: number,
): Promise<string> {
    const response = await apiClient.get<PositionDto>(
        `${POSITIONS_BASE}/${positionId}`,
    );
    return response.data?.title;
}

export async function fetchTeamTitleByTeamId(teamId: number): Promise<string> {
    const response = await apiClient.get<TeamDto>(`${TEAMS_BASE}/${teamId}`);
    return response.data?.title;
}

export async function fetchManagerNameByManagerId(
    managerId: number,
): Promise<string> {
    const response = await apiClient.get<UserDto>(`${USERS_BASE}/${managerId}`);
    return (
        response.data?.fullName ??
        `${response.data?.lastName} ${response.data?.firstName}`
    );
}
