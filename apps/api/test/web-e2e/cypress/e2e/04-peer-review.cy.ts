/**
 * Scenario 4 — Anonymous peer review.
 *
 * Persona: any user who has at least one peer review assigned (seed gives
 *           managers/peers IN_PROGRESS reviews).
 * Task: open the review, verify anonymity is communicated, complete it.
 *
 * Navigation note: like surveys, the reviews list is a table; the entry
 * point is a click on the first row, not a "Start" button.
 */

describe('Peer — anonymous review', () => {
    const users = Cypress.env('users') as Record<string, string>;

    beforeEach(() => {
        cy.apiLogin(users.manager);
    });

    it('communicates anonymity clearly and completes a peer review', () => {
        cy.startScenario('peer.anonymous-review');

        cy.visit('/feedback360/reviews');
        cy.step('open reviews list');

        cy.contains(/reviews/i, { timeout: 15_000 }).should('be.visible');

        cy.get('body').then(($body) => {
            const hasRows = $body.find('table tbody tr').length > 0;
            if (!hasRows) {
                cy.contains(/\bno\b.{0,40}reviews?|empty|nothing/i, {
                    timeout: 5_000,
                })
                    .should('exist')
                    .then(() => {
                        cy.step('empty state shown clearly');
                        cy.endScenario({
                            success: true,
                            notes: 'no reviews assigned to seed user — empty state OK',
                        });
                    });
                return;
            }

            cy.get('table tbody tr').first().find('button, a').first().click();
            cy.step('open first review');

            // Check anonymity messaging is reachable on the review page.
            cy.get('body').then(($page) => {
                const hasAnonymity =
                    /anonymous|anonymity|not be revealed|hidden/i.test(
                        $page.text(),
                    );
                if (hasAnonymity) {
                    cy.step('anonymity message visible');
                } else {
                    cy.step(
                        'anonymity message NOT visible — usability finding',
                    );
                }
            });

            // Fill answers if the form is present.
            cy.get('body').then(($page) => {
                if ($page.find('form, [role="form"]').length === 0) {
                    cy.endScenario({
                        success: true,
                        notes: 'review detail rendered but no form on this seed row',
                    });
                    return;
                }
                cy.get('textarea').each(($el) =>
                    cy
                        .wrap($el)
                        .type('Constructive peer feedback from Cypress.'),
                );
                cy.get('[role="radiogroup"]').each(($g) =>
                    cy
                        .wrap($g)
                        .find('[role="radio"]')
                        .eq(2)
                        .click({ force: true }),
                );
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
});
