# Intra API

REST backend for the **Intra** 360° feedback platform. Built on top of [NestJS](https://nestjs.com/) and organised as a set of bounded contexts following Domain-Driven Design and the Hexagonal (Ports & Adapters) architecture. The package is part of a Turborepo monorepo and is published internally as `@intra/api`.

Deployed on a Render Web Service: **https://intra-feedback360-service.onrender.com** —
[Swagger UI](https://intra-feedback360-service.onrender.com/docs). On Render's free tier the instance
spins down when idle, so the first request after a pause cold-starts it and may take up to a minute.

---

## 📑 Table of contents

- [🛠️ Tech stack](#-tech-stack)
- [🏛️ Architecture overview](#-architecture-overview)
- [🗂️ Project structure](#-project-structure)
- [🧩 Bounded contexts](#-bounded-contexts)
- [🔐 Authentication & authorisation](#-authentication--authorisation)
- [✉️ Notifications & mailing](#-notifications--mailing)
- [📊 Reporting & exports](#-reporting--exports)
- [⚙️ Configuration](#-configuration)
- [📋 Prerequisites](#-prerequisites)
- [📜 Available scripts](#-available-scripts)
- [🚀 Running locally](#-running-locally)
- [🐘 Database workflow](#-database-workflow)
- [🧪 Testing](#-testing)
- [🧹 Linting & formatting](#-linting--formatting)
- [📦 Build & production](#-build--production)
- [📚 API documentation (Swagger)](#-api-documentation-swagger)
- [🧭 Path aliases](#-path-aliases)

---

## 🛠️ Tech stack

<p>
    <img src="https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white" alt="NestJS" />
    <img src="https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Better_Auth-000000?logo=betterauth&logoColor=white" alt="Better Auth" />
    <img src="https://img.shields.io/badge/Google_OAuth2-4285F4?logo=google&logoColor=white" alt="Google OAuth2" />
    <img src="https://img.shields.io/badge/Swagger-85EA2D?logo=swagger&logoColor=black" alt="Swagger" />
    <img src="https://img.shields.io/badge/Nodemailer-0095FF?logo=nodemailer&logoColor=white" alt="Nodemailer" />
    <img src="https://img.shields.io/badge/Gmail_API-EA4335?logo=gmail&logoColor=white" alt="Gmail API" />
    <img src="https://img.shields.io/badge/Handlebars-F0772B?logo=handlebarsdotjs&logoColor=white" alt="Handlebars" />
    <img src="https://img.shields.io/badge/class_validator-FF6F61?logo=class-validator&logoColor=white" alt="class-validator" />
    <img src="https://img.shields.io/badge/class_transformer-FF6F61?logo=class-transformer&logoColor=white" alt="class-transformer" />
    <img src="https://img.shields.io/badge/decimal.js-4B5562?logo=decimal-js&logoColor=white" alt="decimal.js" />
    <img src="https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=white" alt="Jest" />
    <img src="https://img.shields.io/badge/Cypress-69D3A7?logo=cypress&logoColor=black" alt="Cypress" />
    <img src="https://img.shields.io/badge/k6-7D64FF?logo=k6&logoColor=white" alt="k6" />
    <img src="https://img.shields.io/badge/Turborepo-EF4444?logo=turborepo&logoColor=white" alt="Turborepo" />
    <img src="https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white" alt="pnpm" />
    <img src="https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white" alt="ESLint" />
    <img src="https://img.shields.io/badge/Prettier-F7B93E?logo=prettier&logoColor=black" alt="Prettier" />
</p>

Key libraries beyond the badges: `@nestjs/event-emitter` (in-process domain events),
`@nestjs/schedule` (cron-style review/cycle scheduler), `@nestjs/serve-static` (Swagger logo /
favicon), `googleapis` (OAuth2 + Gmail) and `supertest` (HTTP assertions in integration tests).

---

## 🏛️ Architecture overview

The codebase follows a **Domain-Driven Design (DDD)** layering inside each bounded context:

```
contexts/<context>/
├── domain/           # Pure domain models (no framework deps)
├── application/
│   ├── ports/        # Interfaces (repository / mailer / etc. abstractions)
│   ├── services/     # Use cases / application services
│   ├── events/       # Domain event payloads
│   └── listeners/    # In-process event handlers (cross-context choreography)
├── infrastructure/
│   ├── prisma-repositories/   # Concrete repository adapters (Prisma)
│   └── mappers/               # Domain ↔ persistence mapping
└── presentation/
    └── http/
        ├── controllers/  # NestJS controllers (route handlers)
        ├── dto/          # Request DTOs (validation)
        ├── models/       # Response models
        └── mappers/      # Domain ↔ HTTP mapping
```

Key principles:

- **Hexagonal / Ports & Adapters.** Application services depend on repository **ports** (interfaces with injection tokens such as `CYCLE_REPOSITORY`, `REPORT_REPOSITORY`). Concrete Prisma repositories are wired in the module via `{ provide: TOKEN, useExisting: ConcreteRepo }`.
- **Domain isolation.** `domain/*.domain.ts` files contain plain classes/value objects free of NestJS or Prisma imports.
- **Choreography over orchestration.** Cross-context interactions go through `EventEmitter2`. For example, when a review changes stage, listeners in the `notifications` and `reporting` contexts react independently.
- **Single shared persistence layer.** A global `DatabaseModule` exposes a single `PrismaService` that connects via `pg` Pool with optional SSL in production.

---

## 🗂️ Project structure

```
apps/api/
├── nest-cli.json            # Nest CLI config (assets include Handlebars templates)
├── package.json             # Scripts and dependencies
├── tsconfig.json            # TS config with `src/*` and `@intra/api/*` aliases
├── tsconfig.build.json      # Build-only TS config
├── test/                    # Test layers: unit/, integration/, web-e2e/ (Cypress), load/ (k6)
├── dist/                    # Compiled output (generated)
└── src/
    ├── main.ts              # App bootstrap (CORS, global pipes, Swagger, server)
    ├── app.module.ts        # Root module, ConfigModule + ServeStatic + contexts
    ├── app.controller.ts    # Health/root endpoints
    ├── app.service.ts
    ├── auth/                # Better Auth integration, guards, decorators
    ├── common/              # Cross-cutting helpers
    │   ├── documentation/   # Reusable Swagger decorators
    │   ├── serialisation/   # Class-transformer groups & presets
    │   ├── transforms/      # Query sanitisation, etc.
    │   └── validators/      # Custom class-validator validators
    ├── config/              # Typed config loaders + bootstrap helpers
    │   ├── app.ts           # APP_*, frontend link, logo
    │   ├── database.ts      # DATABASE_*
    │   ├── mail.ts          # Gmail OAuth2 credentials
    │   ├── server.ts        # `app.listen` + startup logs
    │   ├── swagger.ts       # OpenAPI document + custom theme
    │   ├── global-pipes.ts  # Global `ValidationPipe` setup
    │   ├── env-utils.ts     # Strict env var helpers
    │   └── constants.ts     # Version, asset paths, doc prefix, pool size
    ├── database/            # Global PrismaService + DatabaseModule
    ├── contexts/            # Bounded contexts (see below)
    └── scripts/             # One-off seeding utilities
        ├── seed-individual-reports.ts
        └── seed-strategic-reports.ts
```

---

## 🧩 Bounded contexts

The application is split into six bounded contexts. Each is a self-contained NestJS feature module with its own domain model, application services, ports, Prisma adapters, and HTTP layer.

### 1. `identity`
Manages users and roles.

- **Domain:** `UserDomain`, `RoleDomain`.
- **Services:** `IdentityUserService`, `IdentityRoleService`.
- **HTTP:** `IdentityUsersController`, `IdentityRolesController`.
- **Exports:** `IdentityUserService`, `IdentityRoleService`, `IDENTITY_USER_REPOSITORY`.

### 2. `organisation`
Models the organisational structure: teams, positions and their hierarchy.

- **Domain:** `TeamDomain`, `PositionDomain`, `PositionHierarchyDomain`, `TeamMembershipDomain`.
- **Services:** `TeamService`, `PositionService`, `PositionHierarchyService`.
- **HTTP:** `TeamsController`, `PositionsController`.

### 3. `library`
Reusable assessment building blocks: clusters, competences, question templates and their relations to positions.

- **Domain:** `ClusterDomain`, `CompetenceDomain`, `QuestionTemplateDomain`, plus relation entities.
- **Services:** `ClusterService`, `CompetenceService`, `QuestionTemplateService`.
- **HTTP:** `ClustersController`, `CompetencesController`, `QuestionTemplatesController`.

### 4. `feedback360`
The heart of the platform — 360° feedback cycles, reviews, respondents/reviewers, questions and cluster scores.

- **Domain:** `CycleDomain`, `ReviewDomain`, `RespondentDomain`, `ReviewerDomain`, `QuestionDomain`, `AnswerDomain`, `ClusterScoreDomain`, `ClusterScoreAnalyticsDomain`, plus stage-history aggregates.
- **Services:**
  - `CycleService` — cycle lifecycle and stage transitions.
  - `ReviewService` — individual review lifecycle.
  - `ReviewSchedulerService` — cron-driven automatic stage advancement (uses `@nestjs/schedule`).
  - `ClusterScoreAnalyticsService` — aggregated analytics (decimal-precise).
- **Listeners:** `CycleStageListener`, `ReviewStageListener`, `RespondentStatusListener`, `SelfAssessmentCompletedListener`.
- **HTTP:** `CyclesController`, `ReviewController`, `QuestionsController`, `ClusterScoresController`, `ClusterScoreAnalyticsController`.

A review is finished by two independent triggers: the daily cron in `ReviewSchedulerService` when the
response deadline passes, and a reactive check after the last respondent answers. Both converge on the
same `review.stage.processed` event that the `reporting` context listens to.

<img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/diagrams/sequence-diagram-review-autocompletion.png?raw=true" width="850" alt="Sequence diagram — review auto-completion">

<details>
<summary><b>Class diagram</b> — the four layers of <code>feedback360</code></summary>

<img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/diagrams/class-diagram-feedback360.png?raw=true" width="850" alt="Class diagram — feedback360 bounded context">

</details>

<details>
<summary><b>More sequence diagrams</b> — review creation, survey answers</summary>

Creating a review, from the HTTP request to the `review.stage.changed` event and the invitation email:

<img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/diagrams/sequence-diagram-review-creation.png?raw=true" width="850" alt="Sequence diagram — review creation">

Submitting answers, for both the self-assessment and the team/others paths:

<img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/diagrams/sequence-diagram-survey-answers.png?raw=true" width="850" alt="Sequence diagram — survey answers">

</details>

### 5. `reporting`
Generates individual and strategic reports on top of completed reviews/cycles.

- **Domain:** `ReportDomain`, `ReportInsightDomain`, `ReportAnalyticsDomain`, `ReportCommentDomain`, `StrategicReportDomain`, `StrategicReportInsightDomain`, `StrategicReportAnalyticsDomain`.
- **Services:**
  - `ReportingService`, `StrategicReportingService` — report assembly and persistence.
  - `ReportInsightService`, `StartegicReportInsightService` — derived insights.
  - `ReportAnalyticsService`, `StrategicReportAnalyticsService` — numeric breakdowns.
  - `ReportCommentService` — review comments threading.
  - `TextAnswerService` — handling of free-text answers.
- **Listeners:** `CycleStageListener`, `ReviewStageListener` (react to feedback360 events to materialise reports).
- **HTTP:** `ReportingController`, `StrategicReportingController`.

<details>
<summary><b>Class diagram</b> — the four layers of <code>reporting</code></summary>

<img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/diagrams/class-diagram-reporting.png?raw=true" width="850" alt="Class diagram — reporting bounded context">

</details>

### 6. `notifications`
Sends transactional and stage-driven emails and persists a delivery log.

- **Domain:** `NotificationLogDomain`, `NotificationKind`, `NotificationChannel`.
- **Services:** `ReviewEmailNotificationService`.
- **Listeners:** `ReviewStageNotificationListener`, `CycleStageNotificationListener`, `UserCreatedNotificationListener`.
- **Templates (Handlebars, `infrastructure/templates/`):**
  - `user-welcome.hbs`
  - `respondent-invitation.hbs`
  - `ratee-self-assessment.hbs`
  - `reviewer-report-ready.hbs`
  - `hr-report-ready.hbs`
  - `cycle-strategic-report-ready.hbs`
- **Adapter:** `NestMailerAdapter` (`@nestjs-modules/mailer` over Nodemailer + Gmail OAuth2).

---

## 🔐 Authentication & authorisation

Authentication is handled by **Better Auth** wrapped in a NestJS module.

- **Provider:** `betterAuthProvider` constructs the Better Auth instance from configuration.
- **Strategy:** Google OAuth2 (password login is intentionally disabled).
- **Sessions:** Cookie-based (CORS is configured with `credentials: true` and `set-cookie` exposed in `main.ts`).
- **Endpoints (`AuthController`, `/auth`):**
  - `GET /auth/google` — start the OAuth2 flow.
  - `GET /auth/login` — alias that redirects to `/auth/google`.
  - `GET /auth/google/callback` — OAuth2 callback; performs the code exchange and creates a session.
  - `GET /auth/me` — current authenticated user (`UserResponse`).
  - `POST /auth/logout` — invalidates the session and clears the cookie.
  - `POST /auth/dev/login` — impersonation by email, intended for development and tests.
- **Guards & decorators:**
  - `AuthSessionGuard` — applied globally on the controller; checks the Better Auth session.
  - `RolesGuard` + `@Roles(...)` — role-based access control.
  - `@Public()` — opts an endpoint out of `AuthSessionGuard`.
  - `@CurrentUser()` — injects the authenticated `UserDomain` into a handler.

### Dev login & seeded accounts

`POST /auth/dev/login` takes `{ "email": "..." }`, finds the user through `IdentityUserService`,
creates a Better Auth user/session if none exists yet, and returns the session token while setting the
session cookie. It bypasses Google OAuth2 entirely, which is what makes integration tests, Cypress
specs and k6 scenarios able to authenticate without a browser.

Accounts created by `pnpm db:seed`, one per role:

| Email                       | Roles              | Position / team                    |
| --------------------------- | ------------------ | ---------------------------------- |
| `mariia.pavlenko@intra.com` | `HR`               | HR Manager · HR Team               |
| `pavlo.lytvyn@intra.com`    | `MANAGER`, `ADMIN` | Tech Lead · SE Team                |
| `taras.rudenko@intra.com`   | `EMPLOYEE`         | Senior Software Engineer · SE Team |

```bash
curl -X POST http://localhost:8080/auth/dev/login -H 'Content-Type: application/json' -d '{"email":"pavlo.lytvyn@intra.com"}'
```

The k6 scenarios authenticate the same way — `test/load/scripts/lib/auth.js` posts to this endpoint,
with `DEV_LOGIN_EMAIL` defaulting to `oleksandr.bondarenko@intra.com`. The full seeded directory lives
in `packages/database/src/prisma/seeds/identity/users.ts`.

> ⚠️ `AuthService.devLogin` opens with a commented-out `isProd` check
> ([`auth.service.ts`](src/auth/auth.service.ts)). As long as it stays commented out, anyone who knows
> a seeded address can impersonate that user on the **deployed** API, including the `ADMIN` account.
> Uncomment the guard before treating the deployment as anything other than a demo.

---

## ✉️ Notifications & mailing

The notifications context is fully event-driven:

1. A domain action (e.g. `ReviewService.advanceStage(...)`) emits a typed event via `EventEmitter2`.
2. A listener inside `notifications/application/listeners/*` picks it up.
3. `ReviewEmailNotificationService` resolves recipients, renders a Handlebars template, and dispatches via `NestMailerAdapter`.
4. A `NotificationLogDomain` record is persisted through `NotificationLogRepository` for auditability.

Gmail credentials (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_GMAIL_USER`, `GOOGLE_GMAIL_API_REFRESH_TOKEN`, optional `GOOGLE_GMAIL_API_ACCESS_TOKEN`) are required for outgoing mail. The `from` and `replyTo` headers default to `${MAIL_FROM_NAME} <${GOOGLE_GMAIL_USER}>` and `APP_SUPPORT_EMAIL` respectively.

The Nest CLI is configured (`nest-cli.json`) to copy `*.hbs` templates into `dist/src/contexts/notifications/infrastructure/templates` so they are available at runtime.

---

## 📊 Reporting & exports

Reports are produced by the `reporting` context and split into two flavours:

- **Individual reports** — one per ratee per cycle, with insights, analytics, and reviewer comments.
- **Strategic reports** — cycle-level rollups consumed by HR/leadership.

Both are materialised in response to `feedback360` events (`ReviewStageListener`, `CycleStageListener` in `reporting/application/listeners`) and exposed via `ReportingController` / `StrategicReportingController`. Numeric aggregations are computed with `decimal.js` to avoid floating-point drift.

### Individual reports

Generation is triggered by an event, never by an HTTP call. `ReviewStageListener` picks up
`review.stage.processed`, moves the review to `PREPARING_REPORT`, and `ReportingService` assembles the
report: it checks the anonymity threshold before reading any answer, aggregates analytics and
insights, then emits `review.stage.changed` so the notifications context can tell HR the report is
ready.

<img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/diagrams/sequence-diagram-individual-report-generation.png?raw=true" width="850" alt="Sequence diagram — individual report generation">

### Strategic reports

The cycle-level pipeline — stage listener, per-review aggregation, competence analytics, insight
generation and publication:

<div align="center">
    <img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/diagrams/activity-diagram-strategic-report-generation.png?raw=true" width="850" alt="Activity diagram — strategic report generation">
</div>

Two dedicated seed scripts populate sample data for local exploration:

```bash
pnpm seed:individual-reports
pnpm seed:strategic-reports
```

---

## ⚙️ Configuration

Configuration is loaded by `ConfigModule.forRoot({ load: [appConfig, databaseConfig, mailConfig] })` and accessed through `ConfigService`. Helpers in `src/config/env-utils.ts` throw on missing/invalid values, so misconfigured environments fail fast at boot.

Required environment variables:

| Variable                              | Purpose                                                                                |
| ------------------------------------- | -------------------------------------------------------------------------------------- |
| `APP_NAME`                            | Display name (used in Swagger and email subjects).                                     |
| `APP_NODE_ENV`                        | `development` \| `test` \| `production` (drives SSL, CORS, dev-login gating).          |
| `APP_PROTOCOL`, `APP_HOST`, `APP_PORT`| Backend URL pieces (dev). In production `PORT` is honoured by the runtime.             |
| `APP_FRONTEND_PROTOCOL/HOST/PORT`     | Used to compute `app.frontendLink` (links inside emails).                              |
| `APP_DOMAIN`                          | Public domain (cookies / OAuth2 redirects).                                            |
| `APP_SUPPORT_EMAIL`                   | `Reply-To` header for outbound mail.                                                   |
| `DATABASE_HOST/PORT/USER/PASSWORD/NAME` | Connection components.                                                               |
| `DATABASE_URL`                        | Full PostgreSQL connection string used by Prisma + `pg` Pool.                          |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth2 client (login + Gmail).                                            |
| `GOOGLE_GMAIL_USER`                   | Sending mailbox.                                                                       |
| `GOOGLE_GMAIL_API_REFRESH_TOKEN`      | Long-lived refresh token for Gmail API.                                                |
| `GOOGLE_GMAIL_API_ACCESS_TOKEN`       | Optional pre-issued access token.                                                      |
| `MAIL_FROM`, `MAIL_FROM_NAME`         | Optional overrides for the `From` header.                                              |

Environment files are loaded with `dotenv-cli`:

- `pnpm env:dev` → `../../.env.development.local` + `NODE_ENV=development`
- `pnpm env:test` → `../../.env.test` + `NODE_ENV=test`
- `pnpm env:prod` → `../../.env.production` + `NODE_ENV=production`

---

## 📋 Prerequisites

- Node.js (LTS recommended)
- pnpm
- A running PostgreSQL instance (use `pnpm docker:up` from the repo root for a local one)
- A Google Cloud project with OAuth2 credentials and Gmail API enabled (for auth + outbound mail)

---

## 📜 Available scripts

All scripts live in `package.json` and can be invoked from the workspace (`pnpm <script> -w @intra/api`) or via Turbo from the repo root.

### Lifecycle
| Script             | Description                                                       |
| ------------------ | ----------------------------------------------------------------- |
| `start`            | Start the app with the dev env file.                              |
| `start:dev` / `dev`| Start in watch mode against `.env.development.local`.             |
| `start:test`       | Start against `.env.test`.                                        |
| `start:debug`      | Watch + Node inspector.                                           |
| `start:prod`       | Run the compiled `dist/src/main.js`.                              |

### Database (delegated to `@intra/database`)
| Script           | Description                                                      |
| ---------------- | ---------------------------------------------------------------- |
| `refresh`        | `db:refresh` (reset + seed) and then `start:dev`.                |
| `refresh:test`   | Same for the test database, then `start:test`.                   |
| `seed:individual-reports` | Seed sample individual reports.                         |
| `seed:strategic-reports`  | Seed sample strategic reports.                          |

### Build & quality
| Script    | Description                                              |
| --------- | -------------------------------------------------------- |
| `build`   | `nest build` → `dist/`.                                  |
| `lint`    | ESLint over `src/` and `test/` with `--fix`.             |
| `format`  | Prettier over `src/` and `test/`.                        |

### Tests
| Script                 | Description                                              |
| ---------------------- | -------------------------------------------------------- |
| `test`                 | Clear Jest cache and run the unit suite.                 |
| `test:unit`            | Unit suite (`test/unit/jest.unit.config.ts`).            |
| `test:unit:cov`        | Unit suite with coverage.                                |
| `test:unit:watch`      | Unit suite in watch mode.                                |
| `test:unit:dashboard`  | Unit suite + HTML dashboard (`test/unit/dashboard.html`).|
| `test:integ`           | Integration suite against the `.env.test` database.      |
| `test:integ:cov`       | Integration suite with coverage.                         |
| `test:integ:dashboard` | Integration suite + HTML dashboard.                      |
| `test:integ:refresh`   | Reset + migrate + seed the test database.                |
| `test:debug`           | `--inspect-brk` for step-through debugging.              |

---

## 🚀 Running locally

1. Create `.env.development.local` (and `.env.test` if you plan to run the test suite) at the repo root.
2. Start the database container from the repo root:
   ```bash
   pnpm docker:up
   ```
3. Apply the schema and seed initial data (from the repo root):
   ```bash
   pnpm db:refresh        # development DB
   pnpm db:test:refresh   # test DB (optional)
   ```
4. Start the API in watch mode:
   ```bash
   pnpm start:dev -w @intra/api
   # or, equivalently, from the repo root:
   pnpm start:dev
   ```

On boot the console prints both the application URL and the Swagger URL.

---

## 🐘 Database workflow

The Prisma schema and migration tooling live in `@intra/database`. The API depends on it as a workspace package and consumes the generated `PrismaClient`. Common commands (run from the API package or the repo root):

```bash
pnpm db:generate      -w @intra/database   # regenerate client
pnpm db:refresh       -w @intra/database   # reset + migrate + seed (dev)
pnpm db:test:refresh  -w @intra/database   # same, for the test DB
```

`PrismaService` (`src/database/prisma.service.ts`) wires `PrismaClient` over a `pg.Pool` using `@prisma/adapter-pg`. In production it sets `ssl.rejectUnauthorized = false` to accommodate managed Postgres providers. It throws a descriptive error at startup if `DATABASE_URL` is missing, pointing the developer to the expected env file.

---

## 🧪 Testing

Four independent layers live under `apps/api/test/`:

| Layer       | Location            | Tooling                 | What it covers                                        |
| ----------- | ------------------- | ----------------------- | ----------------------------------------------------- |
| Unit        | `test/unit`         | Jest, ports mocked      | Domain logic and application services, no DB.         |
| Integration | `test/integration`  | Jest + `.env.test` DB   | Every bounded context against a real Postgres.        |
| E2E (UI)    | `test/web-e2e`      | Cypress (`@intra/web-e2e`) | User flows through the web app — see its [README](test/web-e2e/README.md). |
| Load        | `test/load`         | k6 in Docker            | SLO scenarios: `smoke`, `baseline-p95`, `load-500vu`, `stress-1000vu`, `pdf-15s`. |

```bash
pnpm test:unit -w @intra/api        # unit suite
pnpm test:integ -w @intra/api       # integration suite (needs the test DB)
pnpm test:e2e                       # Cypress, from the repo root
pnpm test:perf:baseline             # k6 baseline scenario, from the repo root
```

A unit test that needs Prisma belongs in `integration/` — the repository ports exist precisely so
they can be mocked. Integration and e2e runs expect a freshly migrated test DB:

```bash
pnpm db:test:refresh -w @intra/database
```

k6 SLO budgets (interactive p95 < 500 ms, error rate < 1 %) are defined once in
`test/load/scripts/lib/config.js`; the endpoint mix and weights in `scripts/lib/endpoints.js`. Fresh
runs land in `test/load/results/` (gitignored) — the captured reports are committed instead:

| Scenario | Profile | Report |
| --- | --- | --- |
| `smoke` | 1 VU, sanity check before every load run | [↗](../docs/tests/load-tests-smoke.png) |
| `baseline-p95` | ramp to 50 VUs, 5 min plateau — the SLO reference run | [↗](../docs/tests/load-tests-baseline-p95.png) |
| `load-500vu` | staged ramp to 500 VUs, 10 min plateau | [↗](../docs/tests/load-tests-load-500vu.png) |
| `stress-1000vu` | staged ramp to 1 500 VUs — the breaking-point run | [↗](../docs/tests/load-tests-stress-1500vu.png) |

The `stress-1000vu` scenario ramps beyond its name: `options.scenarios[].stages` peak at 1 500 VUs,
which is why the captured report is filed under `1500vu`.

Measured results, the two failing thresholds and what the failure pattern actually indicates are
written up in the root [README](../../README.md#-testing). Frontend performance is measured separately
with Lighthouse — see [`apps/web/README.md`](../web/README.md#-performance).

---

## 🧹 Linting & formatting

```bash
pnpm lint -w @intra/api      # ESLint --fix over src/ and test/
pnpm format -w @intra/api    # Prettier over src/ and test/
```

ESLint and Prettier configurations are inherited from the monorepo root.

---

## 📦 Build & production

```bash
pnpm build -w @intra/api
pnpm start:prod -w @intra/api
```

`nest build` writes to `apps/api/dist/`. Handlebars email templates are copied alongside the compiled JS thanks to the `assets` entry in `nest-cli.json`. The production runtime listens on `process.env.PORT` (falling back to `app.port`) on `0.0.0.0`, with cookie-based CORS enabled and `app.enableShutdownHooks()` engaged for graceful termination.

---

## 📚 API documentation (Swagger)

Swagger UI is mounted at the path defined by `DOCUMENTATION_PREFIX` (`/docs`). The generated OpenAPI document is also serialised to disk at `../docs/api/openapi.json` on every boot, so it can be consumed by the docs site or by client generators.

The static directory `apps/docs/public` is served under `/public` (used for the Swagger logo and favicon).

Local URLs (printed at startup):

- App: `http://localhost:<APP_PORT>`
- Docs: `http://localhost:<APP_PORT>/docs`

---

## 🧭 Path aliases

The TypeScript config defines convenience aliases (see `tsconfig.json`):

| Alias              | Resolves to        |
| ------------------ | ------------------ |
| `src/*`            | `src/*`            |
| `@intra/api`       | `src/contexts`     |
| `@intra/api/*`     | `src/contexts/*`   |

Use them when importing across contexts to keep paths stable as the tree grows.

---

© Inessa Repeshko, 2026
