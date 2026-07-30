import http from 'k6/http';
import { check, fail } from 'k6';
import { BASE_URL, DEV_LOGIN_EMAIL } from './config.js';

export function login(email = DEV_LOGIN_EMAIL) {
    const res = http.post(
        `${BASE_URL}/auth/dev/login`,
        JSON.stringify({ email }),
        { headers: { 'Content-Type': 'application/json' }, tags: { name: 'auth/dev/login' } },
    );

    const ok = check(res, { 'login 2xx': (r) => r.status >= 200 && r.status < 300 });
    if (!ok) fail(`dev-login failed for ${email}: ${res.status} ${res.body}`);

    let token;
    try {
        token = res.json('session.token');
    } catch (_) {
        token = null;
    }
    if (!token) fail(`No session.token in login response: ${res.body}`);

    return token;
}

export function authHeaders(token) {
    return { Authorization: `Bearer ${token}` };
}
