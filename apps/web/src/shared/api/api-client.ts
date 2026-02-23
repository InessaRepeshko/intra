import axios from 'axios';

export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach session token from localStorage as Bearer if present.
// This is required for cross-origin dev environments where SameSite=Lax
// cookies are not forwarded by the browser in XHR/fetch requests.
if (typeof window !== 'undefined') {
    apiClient.interceptors.request.use((config) => {
        const token = localStorage.getItem('session_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    });
}
