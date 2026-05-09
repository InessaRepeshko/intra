# Intra Database

Shared persistence layer for the **Intra 360° Feedback** platform. The package owns the Prisma schema, the migration history, the generated `PrismaClient`, and the deterministic seeders that bootstrap a working development / test database. It is consumed by the rest of the monorepo (notably `@intra/api`) as `@intra/database`.

---

## Table of contents

- [Tech stack](#tech-stack)
- [Package responsibilities](#package-responsibilities)
- [Project structure](#project-structure)
- [Schema overview](#schema-overview)
- [Generated client & adapter](#generated-client--adapter)
- [Migrations](#migrations)
- [Seeders](#seeders)
- [Configuration](#configuration)
- [Prerequisites](#prerequisites)
- [Available scripts](#available-scripts)
- [Usage from other packages](#usage-from-other-packages)
- [Common workflows](#common-workflows)
- [Path aliases](#path-aliases)

---

## Tech stack

| Area              | Technology                                                          |
| ----------------- | ------------------------------------------------------------------- |
| ORM               | [Prisma 7](https://www.prisma.io/)                                  |
| Database          | PostgreSQL                                                          |
| DB driver         | `pg` (node-postgres) used through `@prisma/adapter-pg`              |
| Generated client  | `@prisma/client` (output: `dist/generated`)                         |
| Schema visualisation | `prisma-dbml-generator` (writes to `src/prisma/dbml/`)            |
| Numeric precision | `decimal.js` (used by seeders for analytics-grade numbers)          |
| Seed runner       | `tsx`                                                               |
| Env loading       | `dotenv-cli` (`.env.development.local` / `.env.test`)               |
| Build             | `tsc` + `prisma generate`                                           |

---

## Package responsibilities

This package is the **single source of truth** for the database. It exposes:

1. **The Prisma schema** (`src/prisma/schema.prisma`) — all models, enums, indexes and relations across every bounded context (Identity, Organisation, Library, Feedback360, Notifications, Reporting, plus Better Auth tables).
2. **The migration history** (`src/prisma/migrations/`) — chronological SQL migrations that take an empty DB to the current schema.
3. **A regenerated TypeScript client** (`dist/generated`) — exported as the package's `main` / `types`, so other workspace packages do `import { PrismaClient } from '@intra/database'`.
4. **A DBML mirror** (`src/prisma/dbml/schema.dbml`) — produced by `prisma-dbml-generator`, useful for diagrams (e.g. dbdiagram.io).
5. **Seeders** (`src/prisma/seeds/*`) — deterministic, dependency-ordered population of every context, runnable via `prisma db seed`.

Everything else in the monorepo treats this package as opaque: only the published exports and `db:*` scripts should be used.

---

## Project structure

```
packages/database/
├── package.json              # Scripts + Prisma + adapter-pg + decimal.js
├── tsconfig.json             # outDir = dist, declaration: true
├── dist/                     # Generated client + compiled output
│   └── generated/            # Prisma Client (entrypoint of the package)
└── src/
    └── prisma/
        ├── prisma.config.ts  # Prisma 7 config: schema, migrations dir, seed cmd, datasource
        ├── schema.prisma     # ~957 lines, six bounded contexts + Better Auth tables
        ├── migrations/       # 38 timestamped migration folders + migration_lock.toml
        ├── dbml/
        │   └── schema.dbml   # Auto-generated DBML mirror of the schema
        └── seeds/
            ├── seeds.ts      # Orchestrator (Pool + PrismaPg + ordered context seeding)
            ├── identity/
            │   ├── user-roles.ts
            │   └── users.ts
            ├── organisation/
            │   ├── positions.ts
            │   ├── position-hierarchy.ts
            │   ├── teams.ts
            │   └── team-heads.ts
            ├── library/
            │   ├── clusters.ts
            │   ├── competences.ts
            │   ├── question-templates.ts
            │   ├── competence-question-template-relations.ts
            │   ├── position-competence-relations.ts
            │   └── position-question-template-relations.ts
            ├── feedback360/
            │   ├── cycles.ts
            │   ├── reviews.ts
            │   ├── questions.ts
            │   ├── review-question-relations.ts
            │   ├── respondents.ts
            │   ├── reviewers.ts
            │   ├── answers.ts
            │   ├── cluster-scores.ts
            │   ├── cluster-score-analytics.ts
            │   ├── static-review.ts
            │   ├── verify-seeds.sql
            │   └── README.md
            └── reporting/
                ├── individual-reports.ts
                ├── startegic-reports.ts
                └── report-comments.ts
```

---

## Schema overview

The schema is divided into six commented sections that match the application's bounded contexts.

### 1. Identity
Users, roles and the user↔role join.

- **Models:** `User`, `Role`, `UserRole`.
- **Enums:** `IdentityRole` (`ADMIN`, `HR`, `MANAGER`, `EMPLOYEE`), `IdentityStatus` (`ACTIVE`, `INACTIVE`).
- `User` participates in nearly every other context (managed cycles/reviews, ratee/reviewer roles, cluster scores, stage history actor, team head), so most relations originate here.

### 2. Organisation
Org structure consumed by reviews and reports.

- **Models:** `Team`, `TeamMembership`, `Position`, `PositionHierarchy`.
- `User.managerId` provides a self-referential people hierarchy in addition to the position hierarchy.

### 3. Library
Reusable assessment building blocks.

- **Models:** `Competence`, `Cluster`, `QuestionTemplate`, plus three relation tables — `PositionQuestionTemplateRelation`, `PositionCompetenceRelation`, `CompetenceQuestionTemplateRelation`.
- **Enums:** `AnswerType`, `QuestionTemplateStatus`.

### 4. Feedback360
The largest and most interconnected context — actual cycles and reviews, the questions snapshotted into them, and the per-respondent answers/scores.

- **Models:** `Cycle`, `CycleStageHistory`, `Review`, `ReviewStageHistory`, `Question`, `ReviewQuestionRelation`, `Answer`, `Respondent`, `Reviewer`, `ClusterScore`, `ClusterScoreAnalytics`.
- **Enums:** `CycleStage`, `ReviewStage`, `ResponseStatus`, `RespondentCategory`.
- Stage history tables persist who/when triggered each transition, so audits and notifications can replay the timeline.

### 5. Notifications
Cross-context delivery log of emails sent by the platform.

- **Models:** `NotificationLog`.
- **Enums:** `NotificationKind`, `NotificationChannel`.

### 6. Reporting
Materialised individual and strategic reports plus their analytics and comments.

- **Models:** `Report`, `ReportAnalytics`, `ReportInsights`, `ReportComment`, `StrategicReport`, `StrategicReportAnalytics`, `StrategicReportInsights`.
- **Enums:** `EntityType`, `CommentSentiment`, `InsightType`.
- Numeric metrics use Prisma `Decimal` to preserve precision; seeders use `decimal.js` to populate them.

### Auth (Better Auth)
The backend's [Better Auth](https://better-auth.com/) integration persists into the same database.

- **Models:** `AuthUser`, `AuthSession`, `AuthAccount`, `AuthVerification`.

All tables and enums are explicitly mapped to snake_case via `@@map` / `@map`, while TypeScript-side identifiers stay camelCase.

---

## Generated client & adapter

- The Prisma Client is generated into `dist/generated` and re-exported as the package entrypoint:

  ```jsonc
  // package.json
  "main": "./dist/generated/index.js",
  "types": "./dist/generated/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/generated/index.d.ts",
      "import": "./dist/generated/index.js",
      "default": "./dist/generated/index.js",
      "require": "./dist/generated/index.js"
    }
  }
  ```

- A second generator (`prisma-dbml-generator`) writes a DBML mirror to `src/prisma/dbml/schema.dbml`.

- Consumers wire Prisma over `pg` Pool through the official adapter:

  ```ts
  import { PrismaClient } from '@intra/database';
  import { PrismaPg } from '@prisma/adapter-pg';
  import { Pool } from 'pg';

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
  ```

  This is exactly what `apps/api/src/database/prisma.service.ts` and `seeds/seeds.ts` do (with `ssl.rejectUnauthorized = false` enabled when `APP_NODE_ENV === 'production'`).

---

## Migrations

The full migration history lives under `src/prisma/migrations/` and is applied chronologically. As of writing there are **38 migrations** (`migration_lock.toml` pins the provider to `postgresql`). Highlights:

- `20260115203439_init` — initial schema.
- Renames and refactors stabilising context boundaries (`*_rename_competence_context_to_library`, `*_refactor_naming_in_all_contexts`, `*_refactor_clusters_to_library_templates`).
- Feedback360 evolution: `add_feedback_snapshots_and_fix_relations`, `anonymous_feedback_refactor`, `add_review_statuses`, `add_review_stage_history`, `decimal_precision_for_feedback_metrics`.
- Reporting maturity: `add_report_analytics_metrics`, `add_strategic_report_and_analytics`, `add_reports_insights_tables`, `add_cluster_bounds_to_cluster_analytics`.
- Notifications: `add_notification_logs`, `add_cycle_strategic_report_notification`, `add_user_welcome_notification`.
- Auth: `add_auth_tables` (Better Auth schema).
- Latest (`20260509104605_update_cluster_score_analytics_employee_density`).

Apply them with `pnpm db:create` (interactive `migrate dev`) for new local changes or `pnpm db:deploy` (non-interactive `migrate deploy`) for CI / production.

---

## Seeders

Seeders live in `src/prisma/seeds/` and are orchestrated by `seeds.ts`. Prisma's `db seed` is wired to invoke them via `pnpm tsx ./src/prisma/seeds/seeds.ts` (see `prisma.config.ts`).

The orchestrator runs in a strict order so foreign keys always resolve:

1. **Organisation** — `positions` → `position-hierarchy` → `teams`.
2. **Identity** — `user-roles` → `users` → `team-heads` (assigns the `Team.headId` after users exist).
3. **Library** — `competences` → `question-templates` → `competence-question-template-relations` → `position-competence-relations` → `position-question-template-relations` → `clusters`.
4. **Feedback360** — `cycles` → `reviews` → `questions` → `review-question-relations` → `respondents` → `reviewers` → `answers`.
5. **Reporting** — `individual-reports` → `strategic-reports` → `report-comments`.
6. **Static review** (`feedback360/static-review.ts`) — a deterministic showcase review used by demos and tests.

`feedback360/verify-seeds.sql` contains queries for spot-checking the seeded state. `feedback360/cluster-scores.ts` and `feedback360/cluster-score-analytics.ts` exist but are commented out in the orchestrator — uncomment them in `seeds.ts` if you need pre-computed analytics in the DB after seeding.

---

## Configuration

`src/prisma/prisma.config.ts` is the Prisma 7 config that the CLI loads via `prisma --config ...`. It is environment-agnostic — datasource URLs come from environment variables:

| Variable                | Purpose                                                        |
| ----------------------- | -------------------------------------------------------------- |
| `DATABASE_URL`          | Primary connection string used by Prisma + `pg` Pool.          |
| `SHADOW_DATABASE_URL`   | Shadow DB used by `migrate dev` for safe diffing.              |
| `APP_NODE_ENV`          | When `production`, seeders enable `ssl.rejectUnauthorized = false`. |

Environment files (located at the repo root):

- `.env.development.local` — used by every `*:dev` script and by `db:*` shortcuts (via `pnpm prisma:dev`).
- `.env.test` — used by every `*:test` script (via `pnpm prisma:test`).
- `.env.production` — used by the bare `*:prod` scripts (via `pnpm prisma:config`); inject through your deploy environment instead of committing it.

`prisma.config.ts` is invoked through `dotenv-cli`, so the chosen `.env` file is loaded into `process.env` before Prisma reads it.

---

## Prerequisites

- Node.js (LTS recommended)
- pnpm
- A reachable PostgreSQL instance — for local development run `pnpm docker:up` from the repo root.
- A populated `.env.development.local` (and `.env.test` if you need a separate test DB) with at least `DATABASE_URL` and `SHADOW_DATABASE_URL`.

---

## Available scripts

All scripts live in `package.json` and can be invoked from this workspace (`pnpm <script> -w @intra/database`) or via Turbo from the repo root.

### Core helpers
| Script           | Description                                                                |
| ---------------- | -------------------------------------------------------------------------- |
| `prisma:config`  | Run any Prisma command with the package config (`prisma --config ./src/prisma/prisma.config.ts`). |
| `prisma:dev`     | Same, but with `.env.development.local` loaded via `dotenv-cli`.           |
| `prisma:test`    | Same, but with `.env.test` loaded.                                         |

### Development DB (`.env.development.local`)
| Script        | Description                                        |
| ------------- | -------------------------------------------------- |
| `db:schema`   | `prisma validate` + `prisma format` on the schema. |
| `db:create`   | `prisma migrate dev` (creates a new migration).    |
| `migrate` / `db:migrate` | Aliases for `db:create`.                |
| `db:deploy`   | `prisma migrate deploy` (apply existing migrations).|
| `db:generate` | Regenerate the Prisma Client.                      |
| `db:seed`     | Run the seed orchestrator.                         |
| `db:reset`    | `prisma migrate reset --force` (drops + replays).  |
| `db:refresh`  | `db:reset` → `db:generate` → `db:seed`.            |

### Test DB (`.env.test`)
| Script              | Description                                      |
| ------------------- | ------------------------------------------------ |
| `db:test:deploy`    | Apply migrations to the test DB.                 |
| `db:test:generate`  | Regenerate the client against the test DB.       |
| `db:test:reset`     | Reset the test DB.                               |
| `db:test:seed`      | Seed the test DB.                                |
| `db:test:refresh`   | Reset + generate + seed for the test DB.         |

### Production DB (env injected by the runtime)
| Script               | Description                                 |
| -------------------- | ------------------------------------------- |
| `db:deploy:prod`     | `migrate deploy` against `DATABASE_URL`.    |
| `db:generate:prod`   | Regenerate the client.                      |
| `db:reset:prod`      | `migrate reset --force` (use with care).    |
| `db:seed:prod`       | Run the seed script.                        |
| `db:refresh:prod`    | Reset + generate + seed.                    |

### Build & format
| Script   | Description                                                              |
| -------- | ------------------------------------------------------------------------ |
| `build`  | `tsc` + `prisma generate`. Produces `dist/` and the generated client.    |
| `format` | `db:schema` + `prettier --write "src/**/*.ts"`.                          |

---

## Usage from other packages

Add a workspace dependency and import the generated client directly:

```jsonc
// package.json of a consumer (e.g. apps/api/package.json)
"dependencies": {
  "@intra/database": "workspace:*"
}
```

```ts
import { PrismaClient, Prisma } from '@intra/database';
```

The recommended runtime wiring (used by `apps/api`):

```ts
import { PrismaClient } from '@intra/database';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
```

Because the package's `main`/`types` point at `dist/generated/index.{js,d.ts}`, consumers must run `pnpm build -w @intra/database` (or `pnpm db:generate -w @intra/database`) at least once after cloning, so the client exists. The repo root scripts (e.g. `pnpm install` postinstall, Turbo `build`) take care of this in CI.

---

## Common workflows

### First-time local setup
```bash
# 1. From the repo root: spin up Postgres
pnpm docker:up

# 2. Build the client + apply migrations + seed
pnpm db:refresh -w @intra/database
# or, via Turbo from the repo root
pnpm db:refresh
```

### Add a new migration
```bash
# Edit src/prisma/schema.prisma, then:
pnpm db:schema   -w @intra/database   # validate + format
pnpm db:create   -w @intra/database   # interactive migrate dev (asks for a name)
pnpm db:generate -w @intra/database   # refresh dist/generated for consumers
```

### Reset and reseed (dev)
```bash
pnpm db:refresh -w @intra/database
```

### Prepare the test database
```bash
pnpm db:test:refresh -w @intra/database
```

### Apply pending migrations in CI / production
```bash
pnpm db:deploy:prod -w @intra/database
pnpm db:generate:prod -w @intra/database
```

### Inspect or visualise the schema
```bash
pnpm prisma:dev -w @intra/database -- studio       # Prisma Studio against dev DB
# or open src/prisma/dbml/schema.dbml in dbdiagram.io
```

---

## Path aliases

`tsconfig.json` defines:

| Alias                  | Resolves to             |
| ---------------------- | ----------------------- |
| `src/*`                | `src/*`                 |
| `@intra/database`      | `dist/generated`        |
| `@intra/database/*`    | `dist/generated/*`      |

Inside the package itself, seeders import the generated client through `@intra/database` (e.g. `import { PrismaClient } from '@intra/database'` in `seeds.ts`), so they go through the same entry point external consumers use.

---

© Inessa Repeshko, 2026
