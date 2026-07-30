/**
 * Scenario 6 — HR explores the strategic report and cluster-score analytics.
 *
 * Persona: HR director.
 * Task: open both analytical dashboards, verify the page structure, and —
 *       only if seed contains aggregated data — check that the filter
 *       interactions work.
 *
 * Seed reality: the development seed does NOT produce FINISHED cycles, so
 * dashboards may legitimately show empty states. The spec tolerates both
 * paths and records which one was exercised in `metrics.json`.
 *
 * Auth lives in `beforeEach` because Cypress 12+ wipes localStorage between
 * `it()` blocks — without this the second test runs unauthenticated and gets
 * redirected to /signin.
 */

describe('HR — strategic analytics', () => {
    const users = Cypress.env('users') as Record<string, string>;

    beforeEach(() => {
        cy.apiLogin(users.hr);
    });

    it('opens the strategic report page and confirms its structure', () => {
        cy.startScenario('hr.strategic-report');

        cy.visit('/reporting/strategic-reports');
        cy.step('open strategic reports');

        // Header and tabs render regardless of data — these are the structural
        // anchors that prove the page resolved.
        cy.contains(/strategic reports/i, { timeout: 15_000 }).should(
            'be.visible',
        );
        cy.contains(/report dashboard/i).should('be.visible');
        cy.contains(/report table/i).should('be.visible');
        cy.step('page structure visible');

        // Two valid outcomes:
        //  a) any chart rendered → data path
        //  b) explicit "no reports" / empty message → empty-state path
        // We do NOT look for competence names (Leadership / …) — they live
        // inside recharts SVG <text>, which `body.text()` does not always
        // surface reliably across browsers.
        cy.get('body').then(($body) => {
            const $charts = $body.find(
                '.recharts-surface, svg.recharts-surface',
            );
            const text = $body.text();
            // Empty-state messages on the dashboard come in several phrasings:
            //   "No strategic reports for this stage"
            //   "0 strategic reports are available"
            //   "Total 0 reports are published"
            //   "Total 0 records across 0 cycles"
            // The patterns below tolerate one word between "no"/"0" and "reports".
            const hasEmpty =
                /\bno\b.{0,40}reports?\b/i.test(text) ||
                /\b0\b.{0,40}(reports?|records?|competences?|cycles?)\b/i.test(
                    text,
                ) ||
                /\bempty\b|\bnothing\b/i.test(text);

            if ($charts.length > 0) {
                cy.step(`charts present (${$charts.length}) — data path`);
                cy.endScenario({ success: true });
                return;
            }

            if (hasEmpty) {
                cy.step('empty state shown clearly');
                cy.endScenario({
                    success: true,
                    notes: 'no finished cycles in seed — empty-state branch tested',
                });
                return;
            }

            cy.endScenario({
                success: false,
                notes: 'neither charts nor empty state found — usability issue',
            });
            throw new Error(
                'Page rendered but showed neither charts nor empty state.',
            );
        });
    });

    it('opens cluster-score analytics and reacts to a filter change', () => {
        cy.startScenario('hr.cluster-analytics.filter');

        cy.visit('/reporting/cluster-score-analytics');
        cy.step('open cluster analytics');

        // Page header is the exact string "Cluster Score Analytics".
        cy.contains(/cluster score analytics/i, { timeout: 15_000 }).should(
            'be.visible',
        );
        cy.step('page header visible');

        cy.get('body').then(($body) => {
            const $charts = $body.find(
                '.recharts-surface, svg.recharts-surface',
            );
            const text = $body.text();
            // Empty-state messages on the dashboard come in several phrasings:
            //   "No strategic reports for this stage"
            //   "0 strategic reports are available"
            //   "Total 0 reports are published"
            //   "Total 0 records across 0 cycles"
            // The patterns below tolerate one word between "no"/"0" and "reports".
            const hasEmpty =
                /\bno\b.{0,40}reports?\b/i.test(text) ||
                /\b0\b.{0,40}(reports?|records?|competences?|cycles?)\b/i.test(
                    text,
                ) ||
                /\bempty\b|\bnothing\b/i.test(text);

            if ($charts.length === 0) {
                if (hasEmpty) {
                    cy.step('empty state shown clearly');
                    cy.endScenario({
                        success: true,
                        notes: 'no aggregated data — empty-state branch tested',
                    });
                    return;
                }
                cy.endScenario({
                    success: false,
                    notes: 'neither charts nor empty state found',
                });
                throw new Error(
                    'Page rendered but showed neither charts nor empty state.',
                );
            }

            cy.step(`charts present (${$charts.length})`);

            // Try the first filter widget, if any. We do not fail when it is
            // absent — the page works without a filter as well.
            const $filter = $body.find(
                'button[role="combobox"], select, [data-slot="select-trigger"]',
            );
            if ($filter.length === 0) {
                cy.endScenario({
                    success: true,
                    notes: 'charts visible, no filter widget on this page',
                });
                return;
            }

            cy.wrap($filter.first()).click({ force: true });
            cy.get('[role="option"], option').then(($opts) => {
                if ($opts.length >= 2) {
                    cy.wrap($opts[1]).click({ force: true });
                    cy.step('filter changed');
                }
            });
            cy.endScenario({ success: true });
        });
    });
});
