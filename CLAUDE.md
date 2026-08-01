# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

**Intra** — a 360° feedback service. Turborepo + pnpm monorepo: NestJS API, Next.js 16 frontend,
Prisma-managed PostgreSQL, and a framework-free shared kernel holding the contract between them.

```
apps/api                 @intra/api             NestJS REST API — DDD bounded contexts
apps/web                 @intra/web             Next.js frontend — Feature-Sliced Design
apps/docs                —                      Static assets, generated openapi.json, diagrams, screenshots
packages/database        @intra/database        Prisma schema, migrations, seeders
packages/shared-kernel   @intra/shared-kernel   DTOs, enums, constraints, rules
```

Detailed docs live in the root `README.md` and one README per package — prefer reading those over
re-deriving structure from the tree.

## Before running anything destructive

`DATABASE_URL` in `.env.development.local` points at a **remote Render database**, not a local
container — the Docker URL on the line above it is commented out. "Development" here means shared
and destructible.

Ask for explicit confirmation before running or proposing:

- `pnpm db:reset`, `pnpm db:refresh`, `pnpm db:seed`
- any `*:prod` database script
- `pnpm docker:down` (includes `-v`)
- `pnpm clean` (wipes every `node_modules` and `dist`)

`db:test:*` variants target `.env.test` and are safe.

## Commands

```bash
pnpm dev:api           # API in watch mode, port 8080
pnpm dev:web           # frontend, port 3000
pnpm db:generate       # regenerate Prisma client
pnpm db:create         # new migration from schema changes
pnpm test:unit         # Jest, no DB
pnpm test:integ        # Jest against .env.test DB
pnpm test:e2e          # Cypress
pnpm lint              # ESLint across the workspace
```

pnpm only — never `npm` or `yarn`. Prefer root scripts; they delegate through Turbo with the right
filter. Drop to `pnpm --filter @intra/api <script>` only when no root script exists.

## Architecture

### API — DDD, six bounded contexts

`identity`, `organisation`, `library`, `feedback360`, `reporting`, `notifications`, each under
`apps/api/src/contexts/<context>/`:

```
domain/                    *.domain.ts — plain classes, no Nest or Prisma imports
application/ports/         repository interfaces + injection tokens
application/services/      use cases
application/events/        domain event payloads
application/listeners/     in-process handlers
infrastructure/            prisma-repositories/ and mappers/
presentation/http/         controllers, dto, models, mappers
```

Non-negotiables:

- Domain layer stays framework-free.
- Services depend on **ports**, not on Prisma repositories. Concrete adapters are wired in the module
  with `{ provide: TOKEN, useExisting: ConcreteRepo }`.
- Controllers are thin: validate, call one service, map the response.
- **Contexts talk through events, not imports.** `reporting` and `notifications` listen to
  `cycle.stage.processed`; neither imports a `feedback360` service. Do not add a direct
  cross-context service dependency.
- One global `PrismaService`. Never instantiate `PrismaClient` elsewhere.

### Web — Feature-Sliced Design

Layers depend strictly downward: `app → widgets → features → entities → shared`. An upward import is
an architecture violation.

Every `entities/<context>/<entity>/` and `features/<context>/<entity>/<flow>/` slice carries the same
triple: `api/` (axios + react-query), `model/` (types, zod, mappers), `ui/`. Keep it — do not flatten
a slice into one file.

Server Components by default; `'use client'` only where hooks or interactivity require it. UI
primitives come from `shared/ui` (shadcn). Shared types come from `@intra/shared-kernel`.

### Shared kernel

Pure TypeScript — no NestJS, no Prisma, no React. It is bundled into both a Node server and a browser
bundle, so anything runtime-specific breaks one of them.

Enums here mirror the Prisma schema. When a Prisma enum gains a value, update the shared-kernel copy
in the same change, then `pnpm build:shared`.

## Database

Prisma 7 with the `@prisma/adapter-pg` adapter. Schema at
`packages/database/src/prisma/schema.prisma`.

**Never call the `prisma` CLI directly** — the schema is not in the default location and the
datasource URL is injected from the environment. Go through the package scripts, which wrap
`prisma --config ./src/prisma/prisma.config.ts` and load env via `dotenv-cli`:
`pnpm prisma:dev -- <cmd>`, `pnpm prisma:test -- <cmd>`, `pnpm prisma:config -- <cmd>`.

Conventions: PascalCase models mapped to context-prefixed snake_case tables
(`feedback360_cycles`, `reporting_individual_reports`, `identity_users`, `org_teams`,
`library_competences`); camelCase fields with `@map`; `Decimal` for every score and analytic value,
never `Float`; stage changes recorded in `CycleStageHistory` / `ReviewStageHistory`.

## Testing

| Layer | Location | Env |
| --- | --- | --- |
| Unit | `apps/api/test/unit` | none — ports are mocked |
| Integration | `apps/api/test/integration` | `.env.test` |
| E2E | `apps/api/test/web-e2e` | `.env.test` |
| Load (k6) | `apps/api/test/load` | `BASE_URL`, default localhost:8080 |

A unit test that needs Prisma belongs in `integration/`. k6 SLO budgets live in
`test/load/scripts/lib/config.js`; results in `test/load/results/` are gitignored and are
local-machine numbers — do not present them as production figures.

## Conventions

- Files kebab-case with a role suffix: `cycle.service.ts`, `cycle.repository.port.ts`,
  `cycles.controller.ts`, `cycle-stage.listener.ts`.
- API path aliases: `@intra/api/*` → `src/contexts/*`. Web: `@/*`, `@entities/*`, `@features/*`,
  `@widgets/*`, `@shared/*`.
- Read env through the typed loaders in `apps/api/src/config/`, never `process.env` inline.
- Generated artefacts are not hand-edited: `apps/docs/api/openapi.json` (rewritten on API boot),
  coverage reports, test dashboards, `dbml/schema.dbml`.
- Never inline real credentials into code, docs, or commit messages.
