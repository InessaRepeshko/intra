import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, SLO } from '../lib/config.js';
import { login, authHeaders } from '../lib/auth.js';

const PDF_GENERATE_PATH = __ENV.PDF_GENERATE_PATH || '/reporting/reports/{id}/pdf';
const PDF_POLL_PATH = __ENV.PDF_POLL_PATH || '/reporting/reports/jobs/{jobId}';
const REPORT_ID = __ENV.REPORT_ID || '';
const SYNC_MODE = (__ENV.PDF_SYNC_MODE || 'false') === 'true';

export const options = {
    scenarios: {
        pdf_generation: {
            executor: 'per-vu-iterations',
            vus: 5,
            iterations: 5,
            maxDuration: '10m',
        },
    },
    thresholds: {
        'pdf_total_ms': [`p(95)<${SLO.PDF_BUDGET_MS}`],
        http_req_failed: ['rate<0.02'],
    },
};

import { Trend } from 'k6/metrics';
const pdfTotalMs = new Trend('pdf_total_ms');

export function setup() {
    if (!REPORT_ID) {
        throw new Error('Set REPORT_ID env var (id of an existing report)');
    }
    return { token: login(), reportId: REPORT_ID };
}

export default function (data) {
    const headers = authHeaders(data.token);
    const startUrl = `${BASE_URL}${PDF_GENERATE_PATH.replace('{id}', data.reportId)}`;
    const t0 = Date.now();

    const startRes = http.post(startUrl, null, { headers, tags: { name: 'pdf:start' } });

    if (SYNC_MODE) {
        const elapsed = Date.now() - t0;
        pdfTotalMs.add(elapsed);
        check(startRes, {
            'pdf status 2xx': (r) => r.status >= 200 && r.status < 300,
            'pdf < 15s': () => elapsed < SLO.PDF_BUDGET_MS,
        });
        return;
    }

    if (!check(startRes, { 'start accepted': (r) => r.status === 202 || r.status === 200 })) {
        return;
    }

    let jobId;
    try {
        jobId = startRes.json('jobId') || startRes.json('id');
    } catch (_) {
        return;
    }
    if (!jobId) return;

    const pollUrl = `${BASE_URL}${PDF_POLL_PATH.replace('{jobId}', jobId)}`;
    while (Date.now() - t0 < SLO.PDF_BUDGET_MS + 5000) {
        sleep(0.5);
        const pollRes = http.get(pollUrl, { headers, tags: { name: 'pdf:poll' } });
        let status;
        try { status = pollRes.json('status'); } catch (_) { break; }
        if (status === 'done' || status === 'completed' || status === 'success') {
            const elapsed = Date.now() - t0;
            pdfTotalMs.add(elapsed);
            check(null, { 'pdf < 15s': () => elapsed < SLO.PDF_BUDGET_MS });
            return;
        }
        if (status === 'failed' || status === 'error') {
            check(null, { 'pdf job did not fail': () => false });
            return;
        }
    }
    check(null, { 'pdf finished in time': () => false });
}
