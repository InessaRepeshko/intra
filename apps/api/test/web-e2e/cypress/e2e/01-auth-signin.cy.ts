/**
 * Scenario 1 — Guest sign-in via dev credentials.
 *
 * Persona: any role visiting the app for the first time on a new device.
 * Task: from a clean browser state, reach the dashboard.
 * Usability focus: discoverability of the sign-in form, error feedback on bad input.
 */

describe('Sign-in flow', () => {
    const users = Cypress.env('users') as Record<string, string>;

    beforeEach(() => {
        cy.clearLocalStorage();
        cy.clearCookies();
    });

    it('redirects an unauthenticated visitor from a protected page to /signin', () => {
        cy.startScenario('auth.redirect-unauthenticated');
        cy.visit('/dashboard');
        cy.step('visit protected page');
        cy.location('pathname', { timeout: 10_000 }).should('eq', '/signin');
        cy.step('observe redirect');
        cy.endScenario({ success: true });
    });

    it('shows an error when an unknown email is submitted', () => {
        cy.startScenario('auth.invalid-email');
        cy.visit('/signin');
        cy.step('open signin');
        cy.fieldByLabel('Email').type('does-not-exist@intra.com');
        cy.step('type unknown email');
        cy.clickButton(/sign\s*in/i);
        cy.step('submit');
        cy.contains(/failed to signin|not found|invalid/i, {
            timeout: 10_000,
        }).should('be.visible');
        cy.step('see error');
        cy.endScenario({
            success: true,
            notes: 'error message is shown inline',
        });
    });

    it('signs an HR user in through the UI form and lands on /dashboard', () => {
        cy.startScenario('auth.ui-login.hr');
        cy.uiLogin(users.hr);
        cy.step('completed UI login');
        cy.location('pathname').should('eq', '/dashboard');
        cy.contains(/dashboard|welcome/i, { timeout: 10_000 }).should(
            'be.visible',
        );
        cy.step('dashboard rendered');
        cy.endScenario({ success: true });
    });
});
