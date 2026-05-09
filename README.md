<h1 align="center">"Intra" — 360° Feedback Service</h1>

<div align="center">
    <img src="apps/docs/public/1.png" width="700" alt="Intra 360° Feedback Service">
</div>

<p align="center">
    A full-stack platform for running, monitoring and analysing 360° feedback cycles in an organisation —
    structured as a Turborepo + pnpm workspaces monorepo with a NestJS backend, a Next.js frontend, a
    Prisma-managed PostgreSQL database and a shared TypeScript kernel.
</p>

---

## Table of contents

- [Overview](#overview)
- [Monorepo layout](#monorepo-layout)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Bounded contexts](#bounded-contexts)
- [Quick start](#quick-start)
- [Environment configuration](#environment-configuration)
- [Docker infrastructure](#docker-infrastructure)
- [Working with the database](#working-with-the-database)
- [Development workflows](#development-workflows)
- [Testing](#testing)
- [Linting & formatting](#linting--formatting)
- [Build & production](#build--production)
- [Useful URLs](#useful-urls)
- [Per-package READMEs](#per-package-readmes)
- [Repository scripts cheatsheet](#repository-scripts-cheatsheet)
- [Requirements](#requirements)
- [License](#license)

---

## Overview

**Intra** is a 360° feedback service that lets HR, managers and employees plan assessment cycles, collect
multi-source feedback (self, manager, peers, subordinates), review answers anonymously and consume results
as both individual and strategic reports with rich analytics. The system supports the full lifecycle:

- **HR / Admin** — define organisational structure (teams, positions, hierarchy), maintain a library of
  competences and question templates, plan and run feedback cycles.
- **Managers** — drive their direct reports through reviews, see team-level analytics.
- **Employees (ratees / reviewers)** — complete self-assessments, answer surveys, read their personal
  reports and leave reactions/comments.

The platform handles authentication (Google OAuth2 via Better Auth), email notifications (Gmail OAuth2 +
Handlebars templates), automatic stage transitions on a schedule, anonymity rules, decimal-precise
analytics, and printable reports.

---

## Monorepo layout

```
intra/
├── apps/
│   ├── api/                  # NestJS REST API (@intra/api)
│   ├── web/                  # Next.js 16 frontend (@intra/web)
│   └── docs/                 # Static assets (logo/favicon) + generated openapi.json
│       ├── api/openapi.json  # Written on every API boot
│       └── public/           # Served by the API at /public
├── packages/
│   ├── database/             # Prisma schema, migrations, seeders (@intra/database)
│   └── shared-kernel/        # Pure TS DTOs, enums, constraints, rules (@intra/shared-kernel)
├── docker-compose.yml        # Postgres 18 service used in local dev
├── turbo.json                # Turborepo task graph and caching rules
├── pnpm-workspace.yaml       # Workspace declaration
├── package.json              # Root scripts (Turbo entrypoints) + shared dev tooling
├── tsconfig.json             # Base TS config inherited by every package
├── eslint.config.mjs         # Shared ESLint base
├── LICENSE                   # MIT
└── README.md                 # You are here
```

The root `package.json` is intentionally a **thin orchestrator**: it owns the pnpm/Turbo plumbing and
shared dev dependencies; every concrete script delegates to a workspace via Turbo (`turbo run <task>
--filter=@intra/<pkg>`).

---

## Tech stack

| Layer            | Technologies                                                                              |
| ---------------- | ----------------------------------------------------------------------------------------- |
| Monorepo tooling | Turborepo, pnpm workspaces, dotenv-cli                                                    |
| Backend          | NestJS 11, Better Auth, `@nestjs-modules/mailer` (Gmail OAuth2 + Handlebars), `@nestjs/event-emitter`, `@nestjs/schedule`, `class-validator` + `class-transformer`, Swagger / OpenAPI |
| Frontend         | Next.js 16 (App Router, RSC), React 19, Tailwind CSS 4, shadcn/ui (Radix + Base UI), TanStack Query 5, axios, react-hook-form + zod, recharts, sonner, nuqs, next-themes |
| Database         | PostgreSQL 18 (Docker), Prisma 7 + `@prisma/adapter-pg` over `pg` Pool, `prisma-dbml-generator` |
| Shared kernel    | TypeScript-only DTOs / enums / constraints / rules; `decimal.js` for analytics primitives |
| Testing          | Jest, ts-jest, supertest                                                                  |
| Tooling          | ESLint 9, Prettier (with `prettier-plugin-tailwindcss` and `prettier-plugin-organize-imports`), TypeScript 5.9 |

---

## Architecture

The platform is structured around **Domain-Driven Design** with the same bounded contexts on both sides
of the wire, glued together by a shared kernel:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              @intra/web (Next.js)                            │
│   App Router pages → widgets → features → entities → shared (FSD layers)     │
│                              uses ↓ DTOs / enums                             │
└──────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                            @intra/shared-kernel                              │
│   Pure TS: DTOs, enums, constraints, rules — single source of contract       │
└──────────────────────────────────────────────────────────────────────────────┘
                                       ▲
                                       │
┌──────────────────────────────────────────────────────────────────────────────┐
│                              @intra/api (NestJS)                             │
│   Bounded contexts (DDD + Hexagonal):                                        │
│     domain → application (ports/services/listeners) → infrastructure (Prisma)│
│                            → presentation (HTTP)                             │
└──────────────────────────────────────────────────────────────────────────────┘
                                       │ Prisma Client
                                       ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                            @intra/database (Prisma)                          │
│   schema.prisma + migrations + seeders → generated client (dist/generated)   │
└──────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
                             PostgreSQL 18 (Docker)
```

Key cross-cutting decisions:

- **Hexagonal backend.** Application services depend on repository **ports** (DI tokens). Concrete Prisma
  repositories are wired in each NestJS feature module via `{ provide: TOKEN, useExisting: ... }`.
- **Choreography over orchestration.** Cross-context interactions go through `EventEmitter2`. Stage
  changes in `feedback360` trigger listeners in `notifications` and `reporting` independently.
- **Feature-Sliced frontend.** `app → widgets → features → entities → shared` strict downward dependency
  with the per-slice `api / model / ui` triple.
- **Single contract.** The shared kernel re-exports DTOs as `XBaseDto<TDate>` plus `XDto = XBaseDto<Date>`
  for the server and `XResponseDto = XBaseDto<string>` for the client — same shape, different temporal type.

---

## Bounded contexts

| Context        | Responsibility                                                                       |
| -------------- | ------------------------------------------------------------------------------------ |
| `identity`     | Users, roles (`ADMIN`, `HR`, `MANAGER`, `EMPLOYEE`), session/auth glue.              |
| `organisation` | Teams, positions and the position hierarchy.                                         |
| `library`      | Reusable competences, clusters and question templates with their relations.          |
| `feedback360`  | Cycles, reviews, respondents/reviewers, questions, answers, cluster scores.          |
| `reporting`    | Materialised individual and strategic reports, analytics, comments, insights.        |
| `notifications`| Stage-driven email notifications + delivery log (Gmail + Handlebars).                |

Each context exists in three places: the Prisma schema (`schema.prisma`), the NestJS source tree
(`apps/api/src/contexts/<context>`) and the frontend slices (`apps/web/src/{entities,features,widgets}/<context>`).

---

## Quick start

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
pnpm start:web    # Next.js only (alias of dev:web)
```

---

## Environment configuration

Two example files live at the repo root:

- `.env.development.example` → copy to `.env.development.local` for local dev.
- `.env.test.example`        → copy to `.env.test` for the test database.
- `.env.production`          → injected through your deploy environment.

Required variables (see `.env.development.example` for the full template):

| Variable                                                              | Purpose                                                  |
| --------------------------------------------------------------------- | -------------------------------------------------------- |
| `APP_NAME`, `APP_DOMAIN`, `APP_SUPPORT_EMAIL`                         | Display name, public domain, support address.            |
| `APP_PROTOCOL` / `APP_HOST` / `APP_PORT`                              | Backend URL components (dev). `PORT` overrides in prod.  |
| `APP_FRONTEND_PROTOCOL` / `APP_FRONTEND_HOST` / `APP_FRONTEND_PORT`   | Used to build links inside emails.                       |
| `APP_NODE_ENV`                                                        | `development` / `test` / `production` — toggles SSL etc. |
| `DATABASE_HOST` / `PORT` / `USER` / `PASSWORD` / `NAME`               | Postgres connection components (also used by Docker).    |
| `DATABASE_URL`                                                        | Composed connection string used by Prisma + `pg` Pool.   |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`                           | OAuth2 credentials for sign-in and Gmail API.            |
| `GOOGLE_GMAIL_USER` / `GOOGLE_GMAIL_API_REFRESH_TOKEN`                | Sender mailbox + long-lived refresh token.               |
| `MAIL_FROM` (optional)                                                | Override the `From` header.                              |
| `BETTER_AUTH_URL` / `BETTER_AUTH_SECRET`                              | Better Auth base URL and signing secret.                 |

The frontend additionally reads `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8080` if unset).

Environment files are loaded with `dotenv-cli`:

| Helper        | Loads file                              |
| ------------- | --------------------------------------- |
| `pnpm env:dev`  | `.env.development.local` + `NODE_ENV=development` |
| `pnpm env:test` | `.env.test` + `NODE_ENV=test`           |
| `pnpm env:prod` | `.env.production` + `NODE_ENV=production` |

> ⚠️ This repo uses **Prisma 7 with a centralised `prisma.config.ts`**. Always run database tasks through
> the `pnpm db:*` scripts so the right config and `.env` file are loaded.

---

## Docker infrastructure

`docker-compose.yml` declares a single `postgres:18` service. Environment substitution comes from
`.env.development.local` (loaded via `dotenv-cli`).

```bash
pnpm docker:up      # start Postgres in the background
pnpm docker:view    # docker ps -a
pnpm docker:stop    # stop containers
pnpm docker:down    # stop + remove volumes + remove orphan containers
```

The container is named `intra`, exposes the configured `DATABASE_PORT` (default `5433`) and persists data
in the `postgres_data` named volume.

---

## Working with the database

All `db:*` commands at the repo root delegate to `@intra/database` via Turbo and load the right `.env` file.
Full details (schema sections, migration list, seeder order) live in
[`packages/database/README.md`](packages/database/README.md).

### Development DB (`.env.development.local`)
```bash
pnpm db:generate                 # prisma generate (writes dist/generated)
pnpm db:create -- --name <name>  # prisma migrate dev (creates a new migration)
pnpm db:deploy                   # prisma migrate deploy
pnpm db:seed                     # prisma db seed (orchestrated tsx script)
pnpm db:reset                    # prisma migrate reset --force
pnpm db:refresh                  # reset + generate + seed
```

### Test DB (`.env.test`)
```bash
pnpm db:test:generate
pnpm db:test:deploy
pnpm db:test:seed
pnpm db:test:reset
pnpm db:test:refresh
```

### Production DB
```bash
pnpm db:deploy:prod
pnpm db:generate:prod
pnpm db:reset:prod
pnpm db:seed:prod
pnpm db:refresh:prod
```

### Convenience combos
```bash
pnpm refresh        # @intra/api: db:refresh + start:dev
pnpm refresh:test   # @intra/api: db:test:refresh + start:test
```

### Prisma Studio
```bash
pnpm prisma:dev -- studio        # browse the dev DB
pnpm prisma:test -- studio       # browse the test DB
```

---

## Development workflows

### Run the full stack (parallel)
```bash
pnpm dev
```
Turbo runs every workspace's `dev` task in parallel (`--parallel`), with each task marked `persistent` in
`turbo.json`.

### Run a single app
```bash
pnpm dev:api          # NestJS in watch mode (.env.development.local)
pnpm dev:web          # Next.js dev server
pnpm start:api        # docker:up && API dev
pnpm start:web        # alias of dev:web
```

### Other common tasks
```bash
pnpm start:dev        # alias for `pnpm dev`
pnpm start:test       # API against .env.test
pnpm start:debug      # API in --debug --watch mode
pnpm start:prod       # production start (API + Web)
pnpm start:prod:api   # production start (API only)
pnpm start:prod:web   # production start (Web only)
```

### Bypassing Turbo
You can always go straight into a workspace with pnpm's `-w` flag:
```bash
pnpm start:dev -w @intra/api
pnpm dev      -w @intra/web
pnpm db:refresh -w @intra/database
pnpm build    -w @intra/shared-kernel
```

---

## Testing

Jest is configured at the repo root and rooted in `apps/api`:

```jsonc
"jest": {
    "rootDir": "apps/api",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": { "^.+\\.(t|j)s$": "ts-jest" },
    "testEnvironment": "node"
}
```

Common test commands (delegate to `@intra/api`):

```bash
pnpm test          # jest --clearCache + full run
pnpm test:unit     # jest --watch over *.spec.ts
pnpm test:e2e      # jest --watch over *.e2e-spec.ts
pnpm test:watch    # generic watch mode
pnpm test:cov      # coverage report
pnpm test:debug    # node --inspect-brk + jest --runInBand
```

Tests that hit the database expect a freshly migrated test DB:

```bash
pnpm db:test:refresh
```

---

## Linting & formatting

```bash
pnpm lint          # turbo run lint   (ESLint per workspace)
pnpm format        # turbo run format (Prettier per workspace)
```

ESLint and Prettier baselines are at the repo root (`eslint.config.mjs`, `.prettierrc*`,
`.prettierignore`). Each workspace adds the configuration it needs (Next.js rules in `apps/web`, NestJS-
friendly rules in `apps/api`).

---

## Build & production

```bash
pnpm build              # Turbo: builds every workspace in dependency order
pnpm build:shared       # @intra/shared-kernel
pnpm build:database     # @intra/database (also runs prisma generate)
pnpm build:api          # @intra/api      (NestJS → dist/)
pnpm build:web          # @intra/web      (Next.js → .next/)
```

Turbo's `build` task is wired with `dependsOn: ["^build", "^db:generate", "^format", "format"]`, so the
shared kernel and the generated Prisma client are produced before any consumer is built.

Production start commands:

```bash
pnpm start:prod         # API + Web
pnpm start:prod:api     # API only (node dist/src/main.js)
pnpm start:prod:web     # Web only (next start)
```

Cleanup:

```bash
pnpm clean              # rm -rf node_modules / dist / .turbo / .next across the monorepo
```

---

## Useful URLs

| Resource                  | URL                                                |
| ------------------------- | -------------------------------------------------- |
| Web (Next.js)             | http://localhost:3000                              |
| API (NestJS)              | http://localhost:8080                              |
| Swagger UI / OpenAPI docs | http://localhost:8080/docs                         |
| OpenAPI JSON              | `apps/docs/api/openapi.json` (regenerated on boot) |
| Static assets (logo etc.) | http://localhost:8080/public                       |
| Postman collection        | `apps/docs/public/api/postman/`                    |

---

## Per-package READMEs

Each workspace has a focused README that goes deep on its own architecture and scripts:

- [`apps/api/README.md`](apps/api/README.md) — backend (NestJS, DDD + Hexagonal, all six bounded contexts).
- [`apps/web/README.md`](apps/web/README.md) — frontend (Next.js 16, FSD, shadcn/ui, charts).
- [`packages/database/README.md`](packages/database/README.md) — Prisma schema, migrations, seeders.
- [`packages/shared-kernel/README.md`](packages/shared-kernel/README.md) — DTOs, enums, constraints, rules.

---

## Repository scripts cheatsheet

| Category   | Command                                                         | Description                                       |
| ---------- | --------------------------------------------------------------- | ------------------------------------------------- |
| Dev        | `pnpm dev` / `pnpm start:dev`                                   | Run every workspace's `dev` task in parallel.     |
| Dev        | `pnpm dev:api` / `pnpm dev:web`                                 | Run a single app.                                 |
| Dev        | `pnpm start:api`                                                | `docker:up` + API dev.                            |
| Build      | `pnpm build` / `pnpm build:{shared,database,api,web}`           | Whole monorepo / single workspace.                |
| Clean      | `pnpm clean`                                                    | Wipe `node_modules`, `dist`, `.turbo`, `.next`.   |
| Lint/Fmt   | `pnpm lint` / `pnpm format`                                     | Across every workspace.                           |
| Docker     | `pnpm docker:{up,view,stop,down}`                               | Manage local Postgres.                            |
| Database   | `pnpm db:{generate,create,deploy,seed,reset,refresh}`           | Dev DB.                                           |
| Database   | `pnpm db:test:{generate,deploy,seed,reset,refresh}`             | Test DB.                                          |
| Database   | `pnpm db:{deploy,generate,reset,seed,refresh}:prod`             | Production DB.                                    |
| Combo      | `pnpm refresh` / `pnpm refresh:test`                            | DB refresh + start API.                           |
| Tests      | `pnpm test` / `:unit` / `:e2e` / `:watch` / `:cov` / `:debug`   | Jest in `apps/api`.                               |
| Production | `pnpm start:prod` / `start:prod:api` / `start:prod:web`         | Start built artifacts.                            |
| Env        | `pnpm env:dev` / `env:test` / `env:prod`                        | Inject the right `.env` via dotenv-cli.           |

---

## Requirements

- Node.js **v18.x or higher** (LTS recommended).
- pnpm **10.x** (the repo pins `packageManager: pnpm@10.28.0`).
- Docker & Docker Compose (for the local PostgreSQL service).
- Git.
- A Google Cloud project with OAuth2 credentials and Gmail API enabled (for sign-in + outbound email).

---

## License

[MIT](LICENSE) © Inessa Repeshko, 2026
