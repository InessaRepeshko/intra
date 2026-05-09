# Intra API

REST backend for the **Intra** 360° feedback platform. Built on top of [NestJS](https://nestjs.com/) and organised as a set of bounded contexts following Domain-Driven Design and the Hexagonal (Ports & Adapters) architecture. The package is part of a Turborepo monorepo and is published internally as `@intra/api`.

---

## Table of contents

- [Tech stack](#tech-stack)
- [Architecture overview](#architecture-overview)
- [Project structure](#project-structure)
- [Bounded contexts](#bounded-contexts)
- [Authentication & authorisation](#authentication--authorisation)
- [Notifications & mailing](#notifications--mailing)
- [Reporting & exports](#reporting--exports)
- [Configuration](#configuration)
- [Prerequisites](#prerequisites)
- [Available scripts](#available-scripts)
- [Running locally](#running-locally)
- [Database workflow](#database-workflow)
- [Testing](#testing)
- [Linting & formatting](#linting--formatting)
- [Build & production](#build--production)
- [API documentation (Swagger)](#api-documentation-swagger)
- [Path aliases](#path-aliases)

---

## Tech stack

| Area              | Technology                                                                  |
| ----------------- | --------------------------------------------------------------------------- |
| Runtime           | Node.js (TypeScript, CommonJS build target)                                 |
| Framework         | NestJS 11 (modular, DI-based, decorator-driven)                             |
| ORM / DB driver   | Prisma + `@prisma/adapter-pg` over `pg` (PostgreSQL)                        |
| Auth              | [Better Auth](https://better-auth.com/) with Google OAuth2                  |
| Mailing           | `@nestjs-modules/mailer` + Nodemailer (Gmail API via OAuth2) + Handlebars   |
| Events            | `@nestjs/event-emitter` (in-process domain events)                          |
| Scheduling        | `@nestjs/schedule` (cron-style review/cycle scheduler)                      |
| Validation        | `class-validator` + `class-transformer` via global `ValidationPipe`         |
| API docs          | `@nestjs/swagger` with a dark-themed Swagger UI                             |
| Static assets     | `@nestjs/serve-static` (logo / favicon for Swagger and emails)              |
| Numeric precision | `decimal.js` for analytics calculations                                     |
| Google APIs       | `googleapis` (OAuth2, Gmail)                                                |
| Tests             | Jest (unit + e2e)                                                           |
| Tooling           | Turborepo, pnpm workspaces, ESLint, Prettier, dotenv-cli                    |

---

## Architecture overview

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

## Project structure

```
apps/api/
├── nest-cli.json            # Nest CLI config (assets include Handlebars templates)
├── package.json             # Scripts and dependencies
├── tsconfig.json            # TS config with `src/*` and `@intra/api/*` aliases
├── tsconfig.build.json      # Build-only TS config
├── test/                    # Jest specs (app, users, teams, feedback360, …)
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

## Bounded contexts

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

## Authentication & authorisation

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
  - `POST /auth/dev/login` — dev/test-only impersonation by email (disabled in `production`).
- **Guards & decorators:**
  - `AuthSessionGuard` — applied globally on the controller; checks the Better Auth session.
  - `RolesGuard` + `@Roles(...)` — role-based access control.
  - `@Public()` — opts an endpoint out of `AuthSessionGuard`.
  - `@CurrentUser()` — injects the authenticated `UserDomain` into a handler.

---

## Notifications & mailing

The notifications context is fully event-driven:

1. A domain action (e.g. `ReviewService.advanceStage(...)`) emits a typed event via `EventEmitter2`.
2. A listener inside `notifications/application/listeners/*` picks it up.
3. `ReviewEmailNotificationService` resolves recipients, renders a Handlebars template, and dispatches via `NestMailerAdapter`.
4. A `NotificationLogDomain` record is persisted through `NotificationLogRepository` for auditability.

Gmail credentials (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_GMAIL_USER`, `GOOGLE_GMAIL_API_REFRESH_TOKEN`, optional `GOOGLE_GMAIL_API_ACCESS_TOKEN`) are required for outgoing mail. The `from` and `replyTo` headers default to `${MAIL_FROM_NAME} <${GOOGLE_GMAIL_USER}>` and `APP_SUPPORT_EMAIL` respectively.

The Nest CLI is configured (`nest-cli.json`) to copy `*.hbs` templates into `dist/src/contexts/notifications/infrastructure/templates` so they are available at runtime.

---

## Reporting & exports

Reports are produced by the `reporting` context and split into two flavours:

- **Individual reports** — one per ratee per cycle, with insights, analytics, and reviewer comments.
- **Strategic reports** — cycle-level rollups consumed by HR/leadership.

Both are materialised in response to `feedback360` events (`ReviewStageListener`, `CycleStageListener` in `reporting/application/listeners`) and exposed via `ReportingController` / `StrategicReportingController`. Numeric aggregations are computed with `decimal.js` to avoid floating-point drift.

Two dedicated seed scripts populate sample data for local exploration:

```bash
pnpm seed:individual-reports
pnpm seed:strategic-reports
```

---

## Configuration

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

## Prerequisites

- Node.js (LTS recommended)
- pnpm
- A running PostgreSQL instance (use `pnpm docker:up` from the repo root for a local one)
- A Google Cloud project with OAuth2 credentials and Gmail API enabled (for auth + outbound mail)

---

## Available scripts

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
| Script        | Description                                          |
| ------------- | ---------------------------------------------------- |
| `test`        | Clear Jest cache and run the full suite.             |
| `test:unit`   | Jest watch over `*.spec.ts` only.                    |
| `test:e2e`    | Jest watch over `*.e2e-spec.ts` only.                |
| `test:watch`  | Generic watch mode.                                  |
| `test:cov`    | Coverage report.                                     |
| `test:debug`  | `--inspect-brk` for step-through debugging.          |

---

## Running locally

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

## Database workflow

The Prisma schema and migration tooling live in `@intra/database`. The API depends on it as a workspace package and consumes the generated `PrismaClient`. Common commands (run from the API package or the repo root):

```bash
pnpm db:generate      -w @intra/database   # regenerate client
pnpm db:refresh       -w @intra/database   # reset + migrate + seed (dev)
pnpm db:test:refresh  -w @intra/database   # same, for the test DB
```

`PrismaService` (`src/database/prisma.service.ts`) wires `PrismaClient` over a `pg.Pool` using `@prisma/adapter-pg`. In production it sets `ssl.rejectUnauthorized = false` to accommodate managed Postgres providers. It throws a descriptive error at startup if `DATABASE_URL` is missing, pointing the developer to the expected env file.

---

## Testing

Specs live under `apps/api/test/` and cover application services and controllers (`app/`, `users/`, `teams/`, `feedback360/`). Run them with:

```bash
pnpm test -w @intra/api          # full suite
pnpm test:unit -w @intra/api     # unit specs in watch mode
pnpm test:e2e -w @intra/api      # e2e specs in watch mode
pnpm test:cov -w @intra/api      # with coverage
```

Tests that touch the database expect a freshly migrated test DB:

```bash
pnpm db:test:refresh -w @intra/database
```

---

## Linting & formatting

```bash
pnpm lint -w @intra/api      # ESLint --fix over src/ and test/
pnpm format -w @intra/api    # Prettier over src/ and test/
```

ESLint and Prettier configurations are inherited from the monorepo root.

---

## Build & production

```bash
pnpm build -w @intra/api
pnpm start:prod -w @intra/api
```

`nest build` writes to `apps/api/dist/`. Handlebars email templates are copied alongside the compiled JS thanks to the `assets` entry in `nest-cli.json`. The production runtime listens on `process.env.PORT` (falling back to `app.port`) on `0.0.0.0`, with cookie-based CORS enabled and `app.enableShutdownHooks()` engaged for graceful termination.

---

## API documentation (Swagger)

Swagger UI is mounted at the path defined by `DOCUMENTATION_PREFIX` (`/docs`). The generated OpenAPI document is also serialised to disk at `../docs/api/openapi.json` on every boot, so it can be consumed by the docs site or by client generators.

The static directory `apps/docs/public` is served under `/public` (used for the Swagger logo and favicon).

Local URLs (printed at startup):

- App: `http://localhost:<APP_PORT>`
- Docs: `http://localhost:<APP_PORT>/docs`

---

## Path aliases

The TypeScript config defines two convenience aliases (see `tsconfig.json`):

| Alias              | Resolves to        |
| ------------------ | ------------------ |
| `src/*`            | `src/*`            |
| `@intra/api`       | `src/contexts`     |
| `@intra/api/*`     | `src/contexts/*`   |

Use them when importing across contexts to keep paths stable as the tree grows.

---

© Inessa Repeshko, 2026
