# @intra/web-e2e — Cypress usability tests

End-to-end usability tests for the Intra 360° Feedback web application,
designed to feed the **usability metrics table** in the thesis.

## Rationale — why these scenarios

In line with ISO 9241-11, three measurable usability metrics are captured:

| Metric          | Source in this suite                                |
| --------------- | --------------------------------------------------- |
| Effectiveness   | Cypress assertion outcomes (success = task done).   |
| Efficiency      | `stepCount` and `durationMs` per scenario in `metrics.json`. |
| Error tolerance | Negative paths (invalid email, forbidden routes).   |

The six scenarios were selected on a **persona × task** matrix — one
important task per role plus a few cross-role checks — instead of one test per
page. Page-level checks belong to component / integration tests, not
usability research.

| # | Scenario                                           | Persona    | Why it's here                                    |
| - | -------------------------------------------------- | ---------- | ------------------------------------------------ |
| 1 | Sign-in (redirect, invalid email, happy path)      | Guest      | Entry point — clarity of feedback on bad input.  |
| 2 | HR important path: team → position → competence → question template → cycle | HR     | Longest flow; dominates the efficiency table.    |
| 3 | Self-assessment fill                               | Employee   | Form completion friction.                        |
| 4 | Anonymous peer review                              | Manager    | Anonymity messaging must be visible BEFORE typing.|
| 5 | Individual report + comment                        | Employee   | Readability of analytical visualisations.        |
| 6 | Strategic report + cluster-score analytics filter  | HR         | Reaction of charts to filter changes.            |

## Prerequisites

1. The test PostgreSQL container is up (`pnpm docker:up` from the repo root).
2. The API runs against `.env.test`: `pnpm start:test` (port `8080`).
3. The web app runs against `.env.test`: `cd apps/web && pnpm env:test -- next dev` (port `3000`).
4. Test DB is seeded: `pnpm db:test:refresh` from the repo root.

> If you forget step 4, the `apiLogin` command fails on the very first
> spec — none of the seeded users will exist.

## Running

From the repository root:

```bash
# One-time, before each run — refresh DB and execute every spec headlessly:
pnpm test:e2e:refresh

# Interactive (Cypress runner UI):
pnpm test:e2e:open

# Headless without DB refresh (faster, but assumes clean seed):
pnpm test:e2e

# Print the metrics table after a run:
pnpm test:e2e:report
```

Sample output of `pnpm test:e2e:report`:

```
Scenario                               | Steps  | Duration (s)  | Success
---------------------------------------+--------+---------------+--------
auth.redirect-unauthenticated          |      2 |          0.42 | yes
auth.invalid-email                     |      4 |          1.61 | yes
auth.ui-login.hr                       |      2 |          1.28 | yes
hr.important-path.create-cycle          |     17 |         24.85 | yes
employee.self-assessment               |      6 |          5.93 | yes
peer.anonymous-review                  |      6 |          4.31 | yes
employee.individual-report             |      6 |          3.74 | yes
hr.strategic-report                    |      3 |          2.18 | yes
hr.cluster-analytics.filter            |      3 |          2.47 | yes

Scenarios : 9
Success   : 100.0%
Avg steps : 5.4
Avg time  : 5.20 s
```

The raw rows live in `apps/api/test/web-e2e/metrics.json` (gitignored) — copy into
the thesis as a CSV / LaTeX table.

## Configuration

`cypress.config.ts` reads from `.env.test`:

- `APP_FRONTEND_PROTOCOL`/`HOST`/`PORT` → `baseUrl` (default `http://localhost:3000`).
- `NEXT_PUBLIC_API_URL` → API URL for `cy.apiLogin()` (default `http://localhost:8080`).

Seeded test users (in `Cypress.env('users')`):

- `admin`    — `oleksandr.bondarenko@intra.com`
- `hr`       — `natalya.tkachenko@intra.com`
- `manager`  — `pavlo.lytvyn@intra.com`
- `employee` — `yulia.kravchenko@intra.com`

## Custom commands

| Command                                  | Purpose                                       |
| ---------------------------------------- | --------------------------------------------- |
| `cy.apiLogin(email)`                     | Programmatic dev login — bypasses signin UI.  |
| `cy.uiLogin(email)`                      | Real UI signin — used only by the auth spec.  |
| `cy.fieldByLabel(text)`                  | Get an input by its `<Label>` text.           |
| `cy.clickButton(name)`                   | Click a button by visible name (regex OK).    |
| `cy.rowContaining(text)`                 | Find a table row containing some text.        |
| `cy.startScenario(name)`                 | Begin metric collection for a usability run.  |
| `cy.step(label?)`                        | Increment the step counter.                   |
| `cy.endScenario({ success, notes? })`    | Flush the metric row to `metrics.json`.       |

## Continuous integration

The repository ships a GitHub Actions workflow at
[`.github/workflows/e2e.yml`](../../.github/workflows/e2e.yml) that, on every
push and PR to `main`:

1. Builds the full stack via `docker compose -f docker-compose.yml -f docker-compose.ci.yml`
   ([Dockerfile.ci](../../Dockerfile.ci) — multi-stage, targets `api-runtime` and `web-runtime`).
2. Waits for `http://localhost:8080/api/health` and `http://localhost:3000`.
3. Seeds the test database via `pnpm db:test:refresh`.
4. Runs Cypress against the stack and **records the run to Cypress Cloud**
   so videos, screenshots and per-spec timings land on the dashboard.
5. Uploads `metrics.json` and any failure screenshots as GitHub artifacts.

### One-time Cypress Cloud setup

1. Open [cloud.cypress.io](https://cloud.cypress.io) and create a project for
   this repo. The dashboard gives two values:
    - **Project ID** (public, looks like `abc123`).
    - **Record Key** (secret — you already have one).
2. Add both as GitHub repository secrets
   (`Settings → Secrets and variables → Actions`):
    - `CYPRESS_PROJECT_ID` — paste the project ID.
    - `CYPRESS_RECORD_KEY` — paste the record key.
3. For **local** record runs, put both values into a gitignored env file:
   ```bash
   cp .env.test.local.example .env.test.local
   $EDITOR .env.test.local        # fill in the two values
   ```
   The `env:test` script in [`apps/api/test/web-e2e/package.json`](package.json)
   loads `.env.test` first, then `.env.test.local` on top, so the secrets
   override the base file but **never end up in git** (the patterns
   `.env.test.local` and `.env.*.local` are already ignored).

   After that, any of these run with `--record`:
   ```bash
   pnpm test:e2e -- --record
   pnpm test:e2e:open               # GUI picks them up too
   ```

   The `projectId` field in [`cypress.config.ts`](cypress.config.ts) reads
   `process.env.CYPRESS_PROJECT_ID`, so the literal never appears in the repo.

   If you only want to run tests locally **without** recording to Cloud, you
   don't need either value — just run `pnpm test:e2e:open` and skip the
   `--record` flag.

### Why the docker-compose stack uses different hostnames

Inside the docker network containers reach each other by **service name**
(`postgres`, `api`, `web`), not `localhost`. That is why `.env.ci` exists —
it mirrors `.env.test` but rewrites `DATABASE_HOST=postgres`, `APP_HOST=api`,
`APP_FRONTEND_HOST=web`. Cypress itself runs on the GitHub runner (outside
docker), so for it `NEXT_PUBLIC_API_URL=http://localhost:8080` — the host-side
port published by the `api` container.

## Seed-state assumption (important for results interpretation)

The development seed (`pnpm db:test:refresh`) leaves the system **mid-cycle**:
all cycles are `ACTIVE` and reviews are `IN_PROGRESS`. No `FINISHED` cycle is
produced, which means:

- `/reporting/individual-reports`, `/reporting/strategic-reports` and
  `/reporting/cluster-score-analytics` legitimately show an **empty state**
  ("No reports in this stage"). Specs 05 and 06 treat that as a valid path —
  they assert the empty message is legible instead of demanding chart labels.
- Specs 03 and 04 navigate **by clicking a row in the table** (not by a
  "Start" button) because that is how the surveys/reviews UI is actually
  designed.

For the thesis: when documenting results, report each scenario's `notes`
field from `metrics.json` — it explicitly states whether the data path was
exercised or the empty-state path. Both are valid usability findings.

To exercise the full data path, you have two options:

1. **Live integration** — run spec 02 first (it creates a fresh cycle). Then
   manually (or via a dedicated test endpoint) advance that cycle to
   `FINISHED`, and re-run specs 05/06.
2. **Custom test fixture** — add an `e2e-seed.ts` to `packages/database`
   that creates one `FINISHED` cycle with answers, individual reports and
   aggregates. Then chain it in `test:e2e:refresh`.

## Notes for the thesis chapter

- Selectors are **semantic** (label text, accessible role, visible button
  text). If a future redesign re-skins the UI but keeps wording, the suite
  keeps passing — and the metrics stay comparable across iterations.
- For the qualitative half of the usability study (SUS questionnaire,
  observer notes), the scenarios above also serve as the **task script**
  given to real participants — one-to-one with what Cypress automates.
- `step()` is counted, not asserted. If a scenario consistently needs
  >10 steps for what a user perceives as one task, it's a UI smell — a
  candidate for a redesign decision in the thesis.
