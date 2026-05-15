import { defineConfig } from 'cypress';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const METRICS_FILE = resolve(__dirname, 'metrics.json');

type Metric = {
    scenario: string;
    timestamp: string;
    durationMs: number;
    stepCount: number;
    success: boolean;
    notes?: string;
};

function appendMetric(metric: Metric): null {
    const current: Metric[] = existsSync(METRICS_FILE)
        ? JSON.parse(readFileSync(METRICS_FILE, 'utf-8'))
        : [];
    current.push(metric);
    writeFileSync(METRICS_FILE, JSON.stringify(current, null, 2));
    return null;
}

function resetMetrics(): null {
    writeFileSync(METRICS_FILE, JSON.stringify([], null, 2));
    return null;
}

export default defineConfig({
    // The Cypress Cloud project. Set CYPRESS_PROJECT_ID in CI / `.env.test`
    // alongside CYPRESS_RECORD_KEY. Keeping the literal out of the repo means
    // forks cannot accidentally record into our cloud project.
    projectId: process.env.CYPRESS_PROJECT_ID,

    // Explicit opt-in silences the Cypress 15 deprecation warning while we
    // continue using Cypress.env() in specs. Migration to Cypress.expose() is
    // tracked separately — see web-e2e/README.md.
    allowCypressEnv: true,

    e2e: {
        baseUrl: process.env.E2E_WEB_URL ?? 'http://localhost:3000',
        specPattern: 'cypress/e2e/**/*.cy.ts',
        supportFile: 'cypress/support/e2e.ts',
        viewportWidth: 1440,
        viewportHeight: 900,
        defaultCommandTimeout: 10_000,
        requestTimeout: 15_000,
        video: true,
        screenshotOnRunFailure: true,
        env: {
            apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080',
            users: {
                admin: 'oleksandr.bondarenko@intra.com',
                hr: 'natalya.tkachenko@intra.com',
                manager: 'pavlo.lytvyn@intra.com',
                employee: 'yulia.kravchenko@intra.com',
            },
        },
        setupNodeEvents(on) {
            on('task', {
                logMetric: (metric: Metric) => appendMetric(metric),
                resetMetrics,
            });
        },
    },
});
