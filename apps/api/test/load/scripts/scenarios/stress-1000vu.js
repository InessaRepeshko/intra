import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, SLO, SEED_EMAILS } from '../lib/config.js';
import { login, authHeaders } from '../lib/auth.js';
import { INTERACTIVE_ENDPOINTS, pickWeighted } from '../lib/endpoints.js';

export const options = {
    scenarios: {
        stress_to_breaking_point: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '2m', target: 250 },
                { duration: '2m', target: 500 },
                { duration: '3m', target: 1000 },
                { duration: '5m', target: 1000 },
                { duration: '2m', target: 1500 },
                { duration: '3m', target: 1500 },
                { duration: '1m', target: 0 },
            ],
            gracefulRampDown: '30s',
        },
    },
    thresholds: {
        http_req_failed: ['rate<0.05'],
        'http_req_duration{kind:interactive}': [
            { threshold: `p(95)<${SLO.INTERACTIVE_P95_MS}`, abortOnFail: false },
        ],
    },
};

export function setup() {
    return { tokens: SEED_EMAILS.map((e) => login(e)) };
}

export default function (data) {
    const token = data.tokens[__VU % data.tokens.length];
    const ep = pickWeighted(INTERACTIVE_ENDPOINTS);
    const res = http.request(ep.method, `${BASE_URL}${ep.path}`, null, {
        headers: authHeaders(token),
        tags: { name: ep.name, kind: 'interactive' },
    });
    check(res, { 'status 2xx': (r) => r.status >= 200 && r.status < 300 });
    sleep(Math.random() * 1 + 0.3);
}
