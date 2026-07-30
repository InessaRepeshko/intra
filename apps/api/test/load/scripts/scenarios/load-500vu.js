import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, SLO, SEED_EMAILS } from '../lib/config.js';
import { login, authHeaders } from '../lib/auth.js';
import { INTERACTIVE_ENDPOINTS, pickWeighted } from '../lib/endpoints.js';

export const options = {
    scenarios: {
        load_500_sessions: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '2m', target: 100 },
                { duration: '2m', target: 300 },
                { duration: '2m', target: 500 },
                { duration: '10m', target: 500 },
                { duration: '1m', target: 0 },
            ],
            gracefulRampDown: '30s',
        },
    },
    thresholds: {
        http_req_failed: [`rate<${SLO.ERROR_RATE}`],
        'http_req_duration{kind:interactive}': [`p(95)<${SLO.INTERACTIVE_P95_MS}`],
    },
};

export function setup() {
    const tokens = SEED_EMAILS.map((email) => login(email));
    return { tokens };
}

export default function (data) {
    const token = data.tokens[__VU % data.tokens.length];
    const ep = pickWeighted(INTERACTIVE_ENDPOINTS);
    const res = http.request(ep.method, `${BASE_URL}${ep.path}`, null, {
        headers: authHeaders(token),
        tags: { name: ep.name, kind: 'interactive' },
    });
    check(res, { 'status 2xx': (r) => r.status >= 200 && r.status < 300 });
    sleep(Math.random() * 2 + 0.5);
}
