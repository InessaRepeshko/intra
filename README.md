<h1 align="center">"Intra" 360° Feedback Service</h1>

<div align="center">
    <img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/public/1.png?raw=true" width="600" alt="Intra 360° Feedback Service">
</div>

<p align="center">
    A full-stack platform for running, monitoring and analysing 360° feedback cycles in an organisation —
    a Turborepo + pnpm monorepo with a NestJS backend, a Next.js frontend, a Prisma-managed PostgreSQL
    database and a shared TypeScript kernel.
</p>

---

## 📑 Table of contents

- [🎯 Overview](#-overview)
- [📸 Screenshots](#-screenshots)
- [🗂️ Monorepo layout](#-monorepo-layout)
- [🛠️ Tech stack](#-tech-stack)
- [🏛️ Architecture](#-architecture)
- [🗃️ Data model](#-data-model)
- [🚀 Quick start](#-quick-start)
- [⚙️ Environment configuration](#-environment-configuration)
- [🐘 Working with the database](#-working-with-the-database)
- [🧪 Testing](#-testing)
- [📜 Scripts cheatsheet](#-scripts-cheatsheet)
- [📚 Documentation](#-documentation)
- [✅ Requirements](#-requirements)
- [📄 License](#-license)

---

## 🎯 Overview

**Intra** is a 360° feedback service that lets HR, managers and employees plan assessment cycles, collect
multi-source feedback (self, manager, peers, subordinates), review answers anonymously and consume results
as individual and strategic reports with rich analytics.

- **HR / Admin** — define organisational structure (teams, positions, hierarchy), maintain a library of
  competences and question templates, plan and run feedback cycles.
- **Managers** — drive their direct reports through reviews, see team-level analytics.
- **Employees (ratees / reviewers)** — complete self-assessments, answer surveys, read their personal
  reports and leave reactions/comments.

The platform handles authentication (Google OAuth2 via Better Auth), email notifications (Gmail OAuth2 +
Handlebars templates), automatic stage transitions on a schedule, anonymity rules, decimal-precise
analytics, and printable PDF reports.

The full set of user scenarios per role:

<div align="center">
    <img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/diagrams/use-case-diagram.png?raw=true" width="850" alt="Use case diagram">
</div>

---

## 📸 Screenshots

### Dashboard

<img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/screens/dashboard.png?raw=true" width="850" alt="Dashboard">

### Feedback cycles

Planning and lifecycle management of 360° cycles: stages, deadlines, anonymity threshold, participants.

<img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/screens/360-feedback-cycles-list.png?raw=true" width="850" alt="Feedback cycles list">

### Survey form

The core answering experience — competence-grouped questions on a 1–5 scale with N/A, plus qualitative
free-text feedback.

<img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/screens/360-feedback-survey-form.png?raw=true" width="850" alt="Survey form">

### Individual report

Per-ratee analytics: radar and radial charts, self-vs-others deltas ("hidden strengths" and "blind
spots"), per-question breakdowns and depersonalised comments grouped by mention frequency.

<img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/screens/reporting-individual-report.png?raw=true" width="850" alt="Individual report">

### Strategic report

Cycle-level rollup for leadership: engagement and turnout, organisational talent profile, team
performance ratings, competence matrix heatmap.

<img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/screens/reporting-strategic-report.png?raw=true" width="850" alt="Strategic report">

### Cluster score analytics

Cross-cycle competence analytics grouped by proficiency clusters.

<img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/screens/reporting-cluster-score-analytics.png?raw=true" width="850" alt="Cluster score analytics">

<details>
<summary><b>More screens</b> — cycle form, reviews, surveys, library, organisation, profile</summary>

### Cycle form

<img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/screens/360-feedback-cycle-form.png?raw=true" width="850" alt="Cycle form">

### Reviews list

<img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/screens/360-feedback-reviews-list.png?raw=true" width="850" alt="Reviews list">

### Review form

<img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/screens/360-feedback-review-form-1.png?raw=true" width="850" alt="Review form — participants">

<img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/screens/360-feedback-review-form-2.png?raw=true" width="850" alt="Review form — questions">

### Surveys list

<img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/screens/360-feedback-surveys-list.png?raw=true" width="850" alt="Surveys list">

### Library — clusters, competences, question templates

<img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/screens/library-clusters.png?raw=true" width="850" alt="Library — clusters">

<img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/screens/library-competences.png?raw=true" width="850" alt="Library — competences">

<img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/screens/library-question-templates.png?raw=true" width="850" alt="Library — question templates">

### Organisation — teams, positions, users

<img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/screens/organisation-teams.png?raw=true" width="850" alt="Organisation — teams">

<img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/screens/organisation-positions.png?raw=true" width="850" alt="Organisation — positions">

<img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/screens/organisation-users.png?raw=true" width="850" alt="Organisation — users">

### Profile

<img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/screens/profile.png?raw=true" width="850" alt="Profile">

</details>

---

## 🗂️ Monorepo layout

```
intra/
├── apps/
│   ├── api/                  # NestJS REST API (@intra/api)
│   ├── web/                  # Next.js 16 frontend (@intra/web)
│   └── docs/                 # Documentation assets
│       ├── api/              # Generated openapi.json + Postman collection
│       ├── diagrams/         # Architecture, use-case and ERD diagrams
│       ├── screens/          # UI screenshots
│       ├── tests/            # Test dashboard screenshots
│       └── public/           # Runtime static assets served by the API at /public
├── packages/
│   ├── database/             # Prisma schema, migrations, seeders (@intra/database)
│   └── shared-kernel/        # Pure TS DTOs, enums, constraints, rules (@intra/shared-kernel)
├── docker-compose.yml        # Postgres 18 service used in local dev
├── docker-compose.ci.yml     # CI database service
├── turbo.json                # Turborepo task graph and caching rules
├── pnpm-workspace.yaml       # Workspace declaration
├── package.json              # Root scripts (Turbo entrypoints) + shared dev tooling
└── README.md                 # You are here
```

The root `package.json` is intentionally a **thin orchestrator**: it owns the pnpm/Turbo plumbing and
shared dev dependencies; every concrete script delegates to a workspace via Turbo
(`turbo run <task> --filter=@intra/<pkg>`).

---

## 🛠️ Tech stack

<table>
  <tbody>
    <tr>
      <td><b>Monorepo & runtime</b></td>
      <td>
        <img src="https://img.shields.io/badge/Turborepo-EF4444?logo=turborepo&logoColor=white" alt="Turborepo" />
        <img src="https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white" alt="pnpm" />
        <img src="https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white" alt="Node.js" />
        <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
        <img src="https://img.shields.io/badge/dotenv-ECD53F?logo=dotenv&logoColor=black" alt="dotenv" />
      </td>
    </tr>
    <tr>
      <td><b>Backend — NestJS 11</b></td>
      <td>
        <img src="https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white" alt="NestJS" />
        <img src="https://img.shields.io/badge/Better_Auth-000000?logo=betterauth&logoColor=white" alt="Better Auth" />
        <img src="https://img.shields.io/badge/Google_OAuth2-4285F4?logo=google&logoColor=white" alt="Google OAuth2" />
        <img src="https://img.shields.io/badge/Swagger-85EA2D?logo=swagger&logoColor=black" alt="Swagger" />
        <img src="https://img.shields.io/badge/Nodemailer-0095FF?logo=nodemailer&logoColor=white" alt="Nodemailer" />
        <img src="https://img.shields.io/badge/Gmail_API-EA4335?logo=gmail&logoColor=white" alt="Gmail API" />
        <img src="https://img.shields.io/badge/Handlebars-F0772B?logo=handlebarsdotjs&logoColor=white" alt="Handlebars" />
      </td>
    </tr>
    <tr>
      <td><b>Frontend — Next.js 16</b></td>
      <td>
        <img src="https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white" alt="Next.js" />
        <img src="https://img.shields.io/badge/React_19-61DAFB?logo=react&logoColor=black" alt="React 19" />
        <img src="https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
        <img src="https://img.shields.io/badge/shadcn%2Fui-000000?logo=shadcnui&logoColor=white" alt="shadcn/ui" />
        <img src="https://img.shields.io/badge/Radix_UI-161618?logo=radixui&logoColor=white" alt="Radix UI" />
        <img src="https://img.shields.io/badge/TanStack_Query-FF4154?logo=reactquery&logoColor=white" alt="TanStack Query" />
        <img src="https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=white" alt="Axios" />
        <img src="https://img.shields.io/badge/React_Hook_Form-EC5990?logo=reacthookform&logoColor=white" alt="React Hook Form" />
        <img src="https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=white" alt="Zod" />
        <img src="https://img.shields.io/badge/Recharts-8884D8?logo=recharts&logoColor=white" alt="Recharts" />
      </td>
    </tr>
    <tr>
      <td><b>Database</b></td>
      <td>
        <img src="https://img.shields.io/badge/PostgreSQL_18-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL 18" />
        <img src="https://img.shields.io/badge/Prisma_7-2D3748?logo=prisma&logoColor=white" alt="Prisma 7" />
        <img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white" alt="Docker" />
        <img src="https://img.shields.io/badge/decimal.js-4B5562?logo=decimal-js&logoColor=white" alt="decimal.js" />
      </td>
    </tr>
    <tr>
      <td><b>Testing</b></td>
      <td>
        <img src="https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=white" alt="Jest" />
        <img src="https://img.shields.io/badge/Cypress-69D3A7?logo=cypress&logoColor=black" alt="Cypress" />
        <img src="https://img.shields.io/badge/k6-7D64FF?logo=k6&logoColor=white" alt="k6" />
        <img src="https://img.shields.io/badge/Supertest-000000?logo=supertest&logoColor=white" alt="Supertest" />
      </td>
    </tr>
    <tr>
      <td><b>Code quality</b></td>
      <td>
        <img src="https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white" alt="ESLint" />
        <img src="https://img.shields.io/badge/Prettier-F7B93E?logo=prettier&logoColor=black" alt="Prettier" />
      </td>
    </tr>
  </tbody>
</table>

---

## 🏛️ Architecture

The platform is structured around **Domain-Driven Design** with the same bounded contexts on both sides
of the wire, glued together by a shared kernel:

```
@intra/web (Next.js)   app → widgets → features → entities → shared   (FSD layers)
        │  uses DTOs / enums of
        ▼
@intra/shared-kernel   pure TS: DTOs, enums, constraints, rules — the single contract
        ▲
        │  implements the contract
@intra/api (NestJS)    domain → application (ports/services/listeners)
        │              → infrastructure (Prisma) → presentation (HTTP)
        ▼  Prisma Client
@intra/database        schema.prisma + migrations + seeders → generated client
        ▼
PostgreSQL
```

Key cross-cutting decisions:

- **Hexagonal backend.** Application services depend on repository **ports** (DI tokens); concrete Prisma
  repositories are wired per NestJS module via `{ provide: TOKEN, useExisting: ... }`.
- **Choreography over orchestration.** Cross-context interactions go through `EventEmitter2`. Stage
  changes in `feedback360` trigger listeners in `notifications` and `reporting` independently.
- **Feature-Sliced frontend.** Strict downward dependency `app → widgets → features → entities → shared`
  with the per-slice `api / model / ui` triple.
- **Single contract.** The shared kernel exports DTOs as `XBaseDto<TDate>` with `XDto = XBaseDto<Date>`
  for the server and `XResponseDto = XBaseDto<string>` for the client — same shape, different temporal type.

### Bounded contexts

| Context        | Responsibility                                                                       |
| -------------- | ------------------------------------------------------------------------------------ |
| `identity`     | Users, roles (`ADMIN`, `HR`, `MANAGER`, `EMPLOYEE`), session/auth glue.              |
| `organisation` | Teams, positions and the position hierarchy.                                         |
| `library`      | Reusable competences, clusters and question templates with their relations.          |
| `feedback360`  | Cycles, reviews, respondents/reviewers, questions, answers, cluster scores.          |
| `reporting`    | Materialised individual and strategic reports, analytics, comments, insights.        |
| `notifications`| Stage-driven email notifications + delivery log (Gmail + Handlebars).                |

Each context exists in three places: the Prisma schema, the NestJS source tree
(`apps/api/src/contexts/<context>`) and the frontend slices
(`apps/web/src/{entities,features,widgets}/<context>`).

### Deployment

Production runs the frontend on **Vercel**, the API on **Render Web Service** and the database on
**Render Postgres**:

<div align="center">
    <img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/diagrams/deployment-diagram.png?raw=true" width="850" alt="Deployment diagram">
</div>

The event-driven generation of strategic reports (cycle stage listener → aggregation → analytics →
insights → publication) is documented in the
[activity diagram](https://github.com/InessaRepeshko/intra/blob/main/apps/docs/diagrams/activity-diagram-strategic-report-generation.png)
and described in [`apps/api/README.md`](apps/api/README.md).

---

## 🗃️ Data model

The logical data model is split by bounded context. Full ERD sources live in
`packages/database/src/prisma/dbml/schema.dbml` (auto-generated, viewable on dbdiagram.io).

### 360° feedback cycle & answer collection

<img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/diagrams/ERD-feedback.png?raw=true" width="850" alt="ERD — feedback360 context">

### Reporting & analytics

<img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/diagrams/ERD-reporting.png?raw=true" width="850" alt="ERD — reporting context">

<details>
<summary><b>Full schema</b> — all tables across every context</summary>

<img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/diagrams/ERD-all-tables.png?raw=true" width="850" alt="ERD — all tables">

</details>

---

## 🚀 Quick start

```bash
# 1. Clone and install
pnpm install

# 2. Copy environment templates
cp .env.development.example .env.development.local
cp .env.test.example         .env.test          # optional, for the test DB

# 3. Start PostgreSQL via Docker
pnpm docker:up

# 4. Reset + migrate + seed the development DB
pnpm db:refresh

# 5. Run the whole stack (API + Web in parallel)
pnpm dev

# 6. Open the app
#    Web:     http://localhost:3000
#    API:     http://localhost:8080
#    Swagger: http://localhost:8080/docs
```

Need only one app at a time?

```bash
pnpm dev:api      # NestJS only
pnpm dev:web      # Next.js only
pnpm start:api    # docker:up + start the API in dev mode
```

Docker helpers: `pnpm docker:up` / `docker:view` / `docker:stop` / `docker:down` (the last one also
removes volumes). The container is named `intra`, exposes `DATABASE_PORT` (default `5433`) and persists
data in the `postgres_data` named volume.

---

## ⚙️ Environment configuration

Copy the examples at the repo root; environment files are loaded through `dotenv-cli`
(`pnpm env:dev` / `env:test` / `env:prod`).

| Variable group                                                        | Purpose                                                  |
| --------------------------------------------------------------------- | -------------------------------------------------------- |
| `APP_NAME`, `APP_DOMAIN`, `APP_SUPPORT_EMAIL`                         | Display name, public domain, support address.            |
| `APP_PROTOCOL` / `APP_HOST` / `APP_PORT`                              | Backend URL components (dev). `PORT` overrides in prod.  |
| `APP_FRONTEND_PROTOCOL` / `APP_FRONTEND_HOST` / `APP_FRONTEND_PORT`   | Used to build links inside emails.                       |
| `APP_NODE_ENV`                                                        | `development` / `test` / `production` — toggles SSL etc. |
| `DATABASE_*`, `DATABASE_URL`                                          | Postgres connection (Docker + Prisma + `pg` Pool).       |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`                           | OAuth2 credentials for sign-in and Gmail API.            |
| `GOOGLE_GMAIL_USER` / `GOOGLE_GMAIL_API_REFRESH_TOKEN`                | Sender mailbox + long-lived refresh token.               |
| `BETTER_AUTH_URL` / `BETTER_AUTH_SECRET`                              | Better Auth base URL and signing secret.                 |

The frontend additionally reads `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8080`).

> ⚠️ This repo uses **Prisma 7 with a centralised `prisma.config.ts`**. Always run database tasks through
> the `pnpm db:*` scripts so the right config and `.env` file are loaded.

---

## 🐘 Working with the database

All `db:*` commands at the repo root delegate to `@intra/database` via Turbo and load the right `.env`
file. Full details (schema sections, migration list, seeder order) live in
[`packages/database/README.md`](packages/database/README.md).

```bash
# Development DB (.env.development.local)
pnpm db:generate                 # prisma generate
pnpm db:create -- --name <name>  # new migration
pnpm db:deploy                   # apply migrations
pnpm db:seed                     # run seeders
pnpm db:refresh                  # reset + generate + seed

# Test DB (.env.test) — same commands with the db:test: prefix
pnpm db:test:refresh

# Production DB — same commands with the :prod suffix
pnpm db:deploy:prod

# Prisma Studio
pnpm prisma:dev -- studio        # browse the dev DB
pnpm prisma:test -- studio       # browse the test DB
```

---

## 🧪 Testing

Four independent test layers cover the backend and the UI:

| Layer       | Location                    | Tooling            | Command            |
| ----------- | --------------------------- | ------------------ | ------------------ |
| Unit        | `apps/api/test/unit`        | Jest (ports mocked)| `pnpm test:unit`   |
| Integration | `apps/api/test/integration` | Jest + `.env.test` DB | `pnpm test:integ` |
| E2E (UI)    | `apps/api/test/web-e2e`     | Cypress            | `pnpm test:e2e`    |
| Load        | `apps/api/test/load`        | k6 in Docker       | `pnpm test:perf:*` |

Integration and e2e runs expect a freshly migrated test DB: `pnpm db:test:refresh`.
Coverage and HTML dashboards: `pnpm test:unit:cov` / `test:unit:dashboard` and the
`test:integ:*` equivalents.

### Unit & integration dashboards

<img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/tests/unit-tests-dashboard.png?raw=true" width="850" alt="Unit tests dashboard">

<img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/tests/integration-tests-dashboard.png?raw=true" width="850" alt="Integration tests dashboard">

### End-to-end UI tests (Cypress)

<img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/tests/end-to-end-tests-cypress.png?raw=true" width="850" alt="Cypress e2e run">

### Load testing (k6)

Scenarios live in `apps/api/test/load/scripts/scenarios/`; SLO budgets (interactive p95 < 500 ms,
error rate < 1 %) are defined once in `scripts/lib/config.js`. Measured against a locally running API:

| Scenario       | Max VUs | Requests | Avg rate  | p95     | Error rate |
| -------------- | ------- | -------- | --------- | ------- | ---------- |
| `smoke`        | 1       | 31       | 1 req/s   | 21 ms   | 0 %        |
| `baseline-p95` | 50      | 11 424   | 29 req/s  | 14.5 ms | 0 %        |
| `load-500vu`   | 500     | 261 423  | 256 req/s | 7.1 ms  | 16.9 %*    |
| `stress-1000vu`| 1 500   | 996 497  | 922 req/s | 579 ms  | 16.8 %*    |

`smoke` and `baseline-p95` pass every SLO threshold with wide margins. \*The high-concurrency scenarios
exceed the error-rate threshold — the failure pattern is systematic (a fixed share of one endpoint's
responses) and is under investigation. All figures are local-machine numbers, not production ones.

---

## 📜 Scripts cheatsheet

| Category   | Command                                                         | Description                                       |
| ---------- | --------------------------------------------------------------- | ------------------------------------------------- |
| Dev        | `pnpm dev` / `pnpm dev:api` / `pnpm dev:web`                    | Run everything or a single app in watch mode.     |
| Build      | `pnpm build` / `pnpm build:{shared,database,api,web}`           | Whole monorepo / single workspace.                |
| Lint/Fmt   | `pnpm lint` / `pnpm format`                                     | ESLint / Prettier across every workspace.         |
| Docker     | `pnpm docker:{up,view,stop,down}`                               | Manage local Postgres.                            |
| Database   | `pnpm db:{generate,create,deploy,seed,reset,refresh}`           | Dev DB (add `test:` or `:prod` for other envs).   |
| Tests      | `pnpm test:unit` / `test:integ` / `test:e2e`                    | Unit / integration / Cypress.                     |
| Tests      | `pnpm test:{unit,integ}:{cov,dashboard}`                        | Coverage reports and HTML dashboards.             |
| Load       | `pnpm test:perf:{smoke,baseline,load,stress,pdf}`               | k6 scenarios in Docker.                           |
| Production | `pnpm start:prod` / `start:prod:api` / `start:prod:web`         | Start built artifacts.                            |
| Cleanup    | `pnpm clean`                                                    | Wipe `node_modules`, `dist`, `.turbo`, `.next`.   |

Turbo's `build` task is wired with `dependsOn: ["^build", "^db:generate", ...]`, so the shared kernel
and the generated Prisma client are produced before any consumer is built.

---

## 📚 Documentation

| Resource                  | Location                                                        |
| ------------------------- | --------------------------------------------------------------- |
| Swagger UI (local)        | http://localhost:8080/docs                                      |
| OpenAPI JSON              | `apps/docs/api/openapi.json` (regenerated on every API boot)    |
| Postman collection        | `apps/docs/api/postman/collections/`                            |
| Diagrams & screenshots    | [`apps/docs/README.md`](apps/docs/README.md)                    |

Per-package READMEs go deep on each workspace:

- [`apps/api/README.md`](apps/api/README.md) — backend (NestJS, DDD + Hexagonal, six bounded contexts).
- [`apps/web/README.md`](apps/web/README.md) — frontend (Next.js 16, FSD, shadcn/ui, charts).
- [`apps/api/test/web-e2e/README.md`](apps/api/test/web-e2e/README.md) — Cypress e2e suite.
- [`packages/database/README.md`](packages/database/README.md) — Prisma schema, migrations, seeders.
- [`packages/shared-kernel/README.md`](packages/shared-kernel/README.md) — DTOs, enums, constraints, rules.

---

## ✅ Requirements

- Node.js **v18.x or higher** (LTS recommended).
- pnpm **10.x** (the repo pins `packageManager: pnpm@10.28.0`).
- Docker & Docker Compose (local PostgreSQL and k6 load tests).
- A Google Cloud project with OAuth2 credentials and Gmail API enabled (for sign-in + outbound email).

---

## 📄 License

[LICENSE](LICENSE) © Inessa Repeshko, 2026
