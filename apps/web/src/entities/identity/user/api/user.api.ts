import { mapUserResponseDtoToModel, type User } from '@entities/identity/user/model/mappers';
import type {
    CreateUserPayload,
    IdentityRole,
    UpdateUserPayload,
    UserResponseDto,
    UserSearchQuery,
} from '@entities/identity/user/model/types';
import { apiClient } from '@shared/api/api-client';
import { compareStringArrays } from '@shared/lib/utils/compare-arrays';

const AUTH_BASE = 'auth';
const USERS_BASE = 'identity/users';

export async function fetchCurrentUser(): Promise<UserResponseDto> {
    const response = await apiClient.get<UserResponseDto>(`${AUTH_BASE}/me`);
    return response.data;
}

export async function fetchUserById(id: number): Promise<UserResponseDto> {
    const response = await apiClient.get<UserResponseDto>(`${USERS_BASE}/${id}`);
    return response.data;
}

export async function fetchUsers(params?: UserSearchQuery): Promise<UserResponseDto[]> {
    const { data } = await apiClient.get<UserResponseDto[]>(USERS_BASE, { params });
    return data;
}

export async function createUser(payload: CreateUserPayload): Promise<UserResponseDto> {
    const { data } = await apiClient.post<UserResponseDto>(USERS_BASE, payload);
    return data;
}

export async function updateUser(
    id: number,
    payload: UpdateUserPayload,
): Promise<UserResponseDto> {
    const { data } = await apiClient.patch<UserResponseDto>(
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

export async function fetchFullNameByUserId(userId: number): Promise<string> {
    const response = await apiClient.get<UserResponseDto>(`${USERS_BASE}/${userId}`);
    return (
        response.data?.fullName ??
        `${response.data?.lastName} ${response.data?.firstName}`
    );
}

export async function fetchManagerNameByManagerId(
    managerId: number,
): Promise<string> {
    const response = await apiClient.get<UserResponseDto>(`${USERS_BASE}/${managerId}`);
    return (
        response.data?.fullName ??
        `${response.data?.lastName} ${response.data?.firstName}`
    );
}

export async function fetchUsersByPositionIds(
    positionIds: number[],
): Promise<{ positionId: number; users: User[] }[]> {
    const uniqueIds = Array.from(new Set(positionIds));

    const results = await Promise.all(
        uniqueIds.map(async (positionId) => {
            const { data } = await apiClient.get<UserResponseDto[]>(`${USERS_BASE}`, {
                params: { positionId },
            });
            return { positionId, users: data.map(mapUserResponseDtoToModel) };
        }),
    );

    results.sort((a, b) => {
        const namesA = a.users.map((user) => user?.fullName ?? '').sort();
        const namesB = b.users.map((user) => user?.fullName ?? '').sort();
        const comparison = compareStringArrays(namesA, namesB);
        return comparison;
    });

    return results;
}
