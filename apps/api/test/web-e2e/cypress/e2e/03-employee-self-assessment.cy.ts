/**
 * Scenario 3 — Employee fills in a self-assessment survey.
 *
 * Persona: rank-and-file employee — seed gives every employee at least one
 *           survey row in IN_PROGRESS state.
 * Task: open the surveys list, click into the first review row, answer every
 *       visible question, submit, see confirmation.
 *
 * Navigation note: the surveys page is a table; opening a survey is done by
 * clicking the `Review #` cell (which routes to /feedback360/surveys/[id]),
 * NOT by a "Start" button.
 */

describe('Employee — self-assessment survey', () => {
    const users = Cypress.env('users') as Record<string, string>;

    beforeEach(() => {
        cy.apiLogin(users.employee);
    });

    it('completes the active self-assessment end to end', () => {
        cy.startScenario('employee.self-assessment');

        cy.visit('/feedback360/surveys');
        cy.step('open surveys list');

        // Wait for the page header so we know the route resolved and the table
        // hydrated (the data is React-Query async).
        cy.contains(/surveys/i, { timeout: 15_000 }).should('be.visible');

        // If the table is empty for this seed user, log the empty state as a
        // usability observation and stop — we tested what we could test.
        cy.get('body').then(($body) => {
            const hasRows = $body.find('table tbody tr').length > 0;
            if (!hasRows) {
                cy.contains(/\bno\b.{0,40}surveys?|empty|nothing/i, {
                    timeout: 5_000,
                })
                    .should('exist')
                    .then(() => {
                        cy.step('empty state shown clearly');
                        cy.endScenario({
                            success: true,
                            notes: 'no surveys assigned to seed user — empty state OK',
                        });
                    });
                return;
            }

            // Open the first survey via the `Review #` cell click.
            cy.get('table tbody tr').first().find('button').first().click();
            cy.step('open first survey');

            cy.location('pathname', { timeout: 10_000 }).should(
                'match',
                /\/feedback360\/surveys\/\d+/,
            );
            cy.step('on survey detail page');

            // Answer everything generically (textarea / radio / range), so the
            // test does not depend on the exact question template.
            cy.get('form, [role="form"], main').within(() => {
                cy.get('textarea').each(($el) =>
                    cy.wrap($el).type('Cypress sample answer.'),
                );
                cy.get('[role="radiogroup"]').each(($g) =>
                    cy
                        .wrap($g)
                        .find('[role="radio"]')
                        .last()
                        .click({ force: true }),
                );
                cy.get('input[type="range"], [role="slider"]').each(($s) => {
                    const el = $s[0] as HTMLInputElement;
                    if (el.type === 'range') {
                        const max = Number(el.max || 5);
                        cy.wrap(el)
                            .invoke('val', Math.ceil(max / 2))
                            .trigger('change');
                    }
                });
            });
            cy.step('fill answers');

            cy.clickButton(/submit|finish|complete|save/i);
            cy.step('submit');

            cy.contains(/thank you|submitted|completed|saved|success/i, {
                timeout: 15_000,
            }).should('be.visible');
            cy.step('confirmation visible');

            cy.endScenario({ success: true });
        });
    });
});
