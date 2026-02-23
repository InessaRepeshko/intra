import { AuthDto, UserDto } from '@intra/shared-kernel';

import { API_BASE_URL, apiClient } from '@shared/api/api-client';

const AUTH_BASE = '/auth';

/**
 * Redirects the user to the backend Google OAuth2 login endpoint.
 */
export function login(): void {
    window.location.href = `${API_BASE_URL}${AUTH_BASE}/google`;
}

/**
 * Handles the callback from Google OAuth2.
 * Usually called on the frontend callback route page with the URL's search params.
 *
 * @param searchParams The query string parameters (e.g. "?code=...&state=...")
 */
export async function handleGoogleCallback(
    searchParams: string,
): Promise<AuthDto> {
    console.log('handleGoogleCallback called with:', searchParams);
    console.log('API URL:', API_BASE_URL);
    const { data } = await apiClient.get<AuthDto>(
        `${AUTH_BASE}/google/callback${searchParams}`,
    );
    return data;
}

/**
 * Gets the current authenticated user's profile.
 */
export async function getCurrentUser(): Promise<UserDto> {
    const { data } = await apiClient.get<UserDto>(`${AUTH_BASE}/me`);
    return data;
}

/**
 * Authenticates as any user by email (only available in development).
 *
 * @param email The email of the user to login as
 */
export async function devLogin(email: string): Promise<AuthDto> {
    const { data } = await apiClient.post<AuthDto>(`${AUTH_BASE}/dev/login`, {
        email,
    });
    return data;
}

/**
 * Logs out the current user and clears the session cookie.
 */
export async function logout(): Promise<void> {
    await apiClient.post(`${AUTH_BASE}/logout`);
}
