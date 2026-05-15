/// <reference types="cypress" />

type DevLoginResponse = {
    userId: number;
    session: {
        token: string;
        user: { id: string; email: string; name?: string };
        redirect: boolean;
    };
};

declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Programmatic login through the dev endpoint. Skips the UI so individual
             * specs measure efficiency of their own scenario, not the login form.
             */
            apiLogin(email: string): Chainable<DevLoginResponse>;
            /**
             * Full UI login (only for the auth spec — measures the signin flow itself).
             */
            uiLogin(email: string): Chainable<void>;
            /**
             * Open a field by its visible <Label> text and return the bound input/select.
             */
            fieldByLabel(label: string): Chainable<JQuery<HTMLElement>>;
            /**
             * Click a button by its visible accessible name (text or aria-label).
             */
            clickButton(name: string | RegExp): Chainable<void>;
            /**
             * Find a table row containing a piece of text — used for CRUD listings.
             */
            rowContaining(text: string): Chainable<JQuery<HTMLElement>>;
            /**
             * Click a submit-style button inside the currently open Radix
             * Dialog. Required because Radix sets `pointer-events: none` on
             * <body> while a dialog is open, so any click on a button OUTSIDE
             * the dialog throws "pointer-events: none, inherited from body".
             */
            submitDialog(name?: string | RegExp): Chainable<void>;
        }
    }
}

Cypress.Commands.add('apiLogin', (email: string) => {
    const apiUrl = Cypress.env('apiUrl') as string;
    return cy
        .request<DevLoginResponse>({
            method: 'POST',
            url: `${apiUrl}/auth/dev/login`,
            body: { email },
        })
        .then((response) => {
            const token = response.body.session.token;
            window.localStorage.setItem('session_token', token);
            return response.body;
        });
});

Cypress.Commands.add('uiLogin', (email: string) => {
    cy.visit('/signin');
    cy.fieldByLabel('Email').clear().type(email);
    cy.clickButton(/sign\s*in/i);
    cy.location('pathname', { timeout: 15_000 }).should('eq', '/dashboard');
});

Cypress.Commands.add('fieldByLabel', (label: string) => {
    return cy
        .contains('label', label, { matchCase: false })
        .invoke('attr', 'for')
        .then((id) => {
            if (id) return cy.get(`#${id}`);
            return cy
                .contains('label', label, { matchCase: false })
                .parent()
                .find('input, textarea, select')
                .first();
        });
});

Cypress.Commands.add('clickButton', (name: string | RegExp) => {
    cy.findAllByRole?.('button', { name });
    return cy.contains('button', name).first().click();
});

Cypress.Commands.add('rowContaining', (text: string) => {
    return cy.contains('table tbody tr', text).first();
});

Cypress.Commands.add(
    'submitDialog',
    (name: string | RegExp = /create|save|submit/i) => {
        // shadcn `Sidebar` mounts a Radix `Sheet` which also carries
        // `role="dialog"`, so a vanilla `[role="dialog"]` selector returns two
        // nodes (open form + closed sidebar). Filter by `data-state="open"` to
        // get only the active modal.
        cy.get('[role="dialog"][data-state="open"]', { timeout: 10_000 })
            .filter(':visible')
            .first()
            .within(() => {
                cy.contains('button', name).click();
            });
    },
);

export {};
