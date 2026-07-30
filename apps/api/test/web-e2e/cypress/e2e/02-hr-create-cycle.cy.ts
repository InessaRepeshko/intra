/**
 * Scenario 2 — HR important path: assemble a brand-new 360° feedback cycle.
 *
 * Persona: HR specialist (`natalya.tkachenko@intra.com`).
 * Task: create a team → position → competence → question template → cycle,
 *       then verify the cycle appears in the active list.
 *
 * Selector style:
 *   - Action buttons use loose `cy.contains(/create/i)` because the real UI
 *     labels are "Create New Team", "Create New Position", … (full phrases).
 *     Anchored regexes (^create$) miss those — we keep matchers liberal.
 *   - Auth lives in `beforeEach` because Cypress 12+ wipes localStorage
 *     between `it()` blocks.
 */

describe('HR — full 360° feedback cycle setup', () => {
    const users = Cypress.env('users') as Record<string, string>;
    const runId = Date.now().toString().slice(-6);

    const teamName = `E2E Team ${runId}`;
    const positionName = `E2E Engineer ${runId}`;
    const competenceCode = `E2E${runId}`;
    const competenceTitle = `E2E Competence ${runId}`;
    const questionText = `How effectively does ${runId} collaborate?`;
    const cycleTitle = `E2E Cycle ${runId}`;

    beforeEach(() => {
        cy.apiLogin(users.hr);
    });

    it('walks an HR user through the whole setup', () => {
        cy.startScenario('hr.important-path.create-cycle');

        // 1) Create a team
        cy.visit('/organisation/teams');
        cy.step('open teams');
        cy.contains('button', /create/i)
            .first()
            .click();
        cy.step('open team form');
        cy.fieldByLabel(/team name|title|name/i).type(teamName);
        cy.fieldByLabel(/description/i).type(
            'Created by Cypress usability run',
        );
        cy.step('fill team form');
        cy.submitDialog();
        // Use `exist` (not `be.visible`) for post-CRUD checks: responsive
        // tables render both desktop and mobile variants, the latter hidden
        // by `lg:hidden`. Either presence in DOM proves the row was created.
        cy.contains(teamName, { timeout: 10_000 }).should('exist');
        cy.step('team visible in list');

        // 2) Create a position
        cy.visit('/organisation/positions');
        cy.step('open positions');
        cy.contains('button', /create/i)
            .first()
            .click();
        cy.fieldByLabel(/title|name/i).type(positionName);
        cy.fieldByLabel(/description/i).type(
            'Created by Cypress usability run',
        );
        cy.submitDialog();
        cy.contains(positionName).should('exist');
        cy.step('position created');

        // 3) Create a competence
        cy.visit('/library/competences');
        cy.step('open competences');
        cy.contains('button', /create/i)
            .first()
            .click();
        cy.fieldByLabel(/code/i).type(competenceCode);
        cy.fieldByLabel(/title|name/i).type(competenceTitle);
        cy.fieldByLabel(/description/i).type(
            'Created by Cypress usability run',
        );
        cy.submitDialog();
        cy.contains(competenceTitle).should('exist');
        cy.step('competence created');

        // 4) Create a question template
        cy.visit('/library/question-templates');
        cy.step('open question templates');
        cy.contains('button', /create/i)
            .first()
            .click();
        // Question text field is labelled "Title" (not "Text" / "Question").
        cy.fieldByLabel(/title|text|question/i).type(questionText);
        cy.step('fill question text');

        // Competence is a combobox; click the trigger and pick the new entry.
        cy.contains('button, [role="combobox"]', /competence/i)
            .first()
            .click({ force: true });
        cy.contains(competenceTitle).click({ force: true });
        cy.step('attach competence');

        // `positionIds.min(1)` is required by the form schema — without this
        // the dialog stays open with a "At least one position is required"
        // error and the next assertion times out.
        cy.contains('button, [role="combobox"]', /select positions/i)
            .first()
            .click({ force: true });
        cy.contains(positionName).click({ force: true });
        // Close the multi-select popover so the submit button is clickable.
        cy.get('body').type('{esc}');
        cy.step('attach position');

        cy.submitDialog();
        cy.contains(questionText).should('exist');
        cy.step('question template created');

        // 5) Create the cycle
        cy.visit('/feedback360/cycles');
        cy.step('open cycles');
        cy.contains('button', /create/i)
            .first()
            .click();
        cy.fieldByLabel(/title|name/i).type(cycleTitle);
        cy.fieldByLabel(/description/i).type(
            'Created by Cypress usability run',
        );
        // Note: Start Date / End Date come pre-filled with sensible defaults
        // (today and today+30), so we don't open the calendar pickers — that
        // would just re-pick the same range and add fragility around the
        // calendar popover. Leave them as-is.
        cy.step('fill cycle form');

        cy.submitDialog();
        cy.contains(cycleTitle, { timeout: 15_000 }).should('exist');
        cy.step('cycle appears in list');

        cy.endScenario({
            success: true,
            notes: 'team + position + competence + question template + cycle in one walk',
        });
    });
});
