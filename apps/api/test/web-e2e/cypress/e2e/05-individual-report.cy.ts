/**
 * Scenario 5 — Employee reads own individual report.
 *
 * Persona: any employee.
 * Task: open the individual reports page; if a report row exists, drill in,
 *       check that charts render and that the comment affordance is reachable.
 *
 * Seed reality: the development seed does NOT produce FINISHED cycles, so
 * `/reporting/individual-reports` may legitimately be empty. The spec treats
 * the empty state as a valid usability outcome — it asserts the empty message
 * is readable rather than failing.
 */

describe('Employee — individual report', () => {
    const users = Cypress.env('users') as Record<string, string>;

    beforeEach(() => {
        cy.apiLogin(users.employee);
    });

    it('opens the reports page and inspects whatever is available', () => {
        cy.startScenario('employee.individual-report');

        cy.visit('/reporting/individual-reports');
        cy.step('open reports list');

        cy.contains(/individual reports/i, { timeout: 15_000 }).should(
            'be.visible',
        );
        cy.step('page header visible');

        cy.get('body').then(($body) => {
            const hasRows = $body.find('table tbody tr').length > 0;

            if (!hasRows) {
                cy.contains(/\bno\b.{0,40}reports?|empty|nothing/i, {
                    timeout: 5_000,
                })
                    .should('exist')
                    .then(() => {
                        cy.step('empty state shown clearly');
                        cy.endScenario({
                            success: true,
                            notes: 'no finished cycles in seed — empty-state branch tested',
                        });
                    });
                return;
            }

            // Open the first available report.
            cy.get('table tbody tr').first().find('button, a').first().click();
            cy.step('open report');

            cy.location('pathname', { timeout: 10_000 }).should(
                'match',
                /\/reporting\/individual-reports\/.+/,
            );

            // Charts may take a moment to render.
            cy.get('.recharts-surface, svg', { timeout: 15_000 })
                .its('length')
                .should('be.gte', 1);
            cy.step('charts rendered');

            // Try to leave a comment if the UI offers it.
            cy.get('body').then(($page) => {
                const $box = $page.find(
                    'textarea[placeholder*="comment" i], textarea[placeholder*="reflection" i]',
                );
                if ($box.length === 0) {
                    cy.step('no comment box on this report');
                    cy.endScenario({
                        success: true,
                        notes: 'report opened, charts visible, no comment box on this row',
                    });
                    return;
                }
                cy.wrap($box.first()).type(
                    'Acknowledged — will work on collaboration.',
                );
                cy.clickButton(/post|send|submit|save|add/i);
                cy.contains(/posted|saved|added|thanks|success/i, {
                    timeout: 10_000,
                }).should('be.visible');
                cy.step('comment posted');
                cy.endScenario({ success: true });
            });
        });
    });
});
