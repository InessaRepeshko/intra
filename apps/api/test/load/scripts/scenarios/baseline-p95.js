import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, SLO } from '../lib/config.js';
import { login, authHeaders } from '../lib/auth.js';
import { INTERACTIVE_ENDPOINTS, pickWeighted } from '../lib/endpoints.js';

export const options = {
    scenarios: {
        baseline: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '1m', target: 50 },
                { duration: '5m', target: 50 },
                { duration: '30s', target: 0 },
            ],
            gracefulRampDown: '30s',
        },
    },
    thresholds: {
        http_req_failed: [`rate<${SLO.ERROR_RATE}`],
        'http_req_duration{kind:interactive}': [
            `p(95)<${SLO.INTERACTIVE_P95_MS}`,
            `p(99)<${SLO.INTERACTIVE_P95_MS * 2}`,
        ],
    },
};

export function setup() {
    return { token: login() };
}

export default function (data) {
    const ep = pickWeighted(INTERACTIVE_ENDPOINTS);
    const res = http.request(ep.method, `${BASE_URL}${ep.path}`, null, {
        headers: authHeaders(data.token),
        tags: { name: ep.name, kind: 'interactive' },
    });
    check(res, { 'status 2xx': (r) => r.status >= 200 && r.status < 300 });
    sleep(Math.random() * 2 + 0.5);
}
