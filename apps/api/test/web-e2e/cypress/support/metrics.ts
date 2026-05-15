/// <reference types="cypress" />

/**
 * Usability metric collection.
 *
 * Each scenario calls `startScenario(name)` once, then `step()` for every
 * meaningful user action. `endScenario({ success })` flushes a metric row to
 * `metrics.json` via Cypress task. The output is used to populate the
 * efficiency / effectiveness tables in the thesis.
 */

declare global {
    namespace Cypress {
        interface Chainable {
            startScenario(name: string): Chainable<void>;
            step(label?: string): Chainable<void>;
            endScenario(opts: {
                success: boolean;
                notes?: string;
            }): Chainable<void>;
        }
    }
}

interface ScenarioState {
    name: string;
    startedAt: number;
    steps: string[];
}

let current: ScenarioState | null = null;

Cypress.Commands.add('startScenario', (name: string) => {
    current = { name, startedAt: Date.now(), steps: [] };
    cy.log(`[usability] start: ${name}`);
});

Cypress.Commands.add('step', (label?: string) => {
    if (!current) {
        throw new Error('step() called before startScenario()');
    }
    current.steps.push(label ?? `step-${current.steps.length + 1}`);
    cy.log(`[usability] step ${current.steps.length}: ${current.steps.at(-1)}`);
});

Cypress.Commands.add('endScenario', ({ success, notes }) => {
    if (!current) {
        throw new Error('endScenario() called before startScenario()');
    }
    const metric = {
        scenario: current.name,
        timestamp: new Date().toISOString(),
        durationMs: Date.now() - current.startedAt,
        stepCount: current.steps.length,
        success,
        notes,
    };
    cy.task('logMetric', metric, { log: false });
    cy.log(
        `[usability] end: ${metric.scenario} — ${metric.stepCount} steps, ${metric.durationMs} ms, success=${metric.success}`,
    );
    current = null;
});

before(() => {
    cy.task('resetMetrics', null, { log: false });
});

export {};
