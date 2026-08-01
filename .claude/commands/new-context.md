---
description: Scaffold a new bounded context in the API following the project's DDD layering
argument-hint: "<context-name> [aggregate-name]"
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

Scaffold the `$1` bounded context under `apps/api/src/contexts/$1/`, with `$2` as the first aggregate
if given.

**Read an existing context first** — `apps/api/src/contexts/library/` is the smallest complete
example. Match its file layout, naming and import style rather than inventing a variant.

## Layers to create

```
contexts/$1/
├── domain/<aggregate>.domain.ts                 plain class, no Nest or Prisma imports
├── application/
│   ├── ports/<aggregate>.repository.port.ts     interface + injection token
│   ├── services/<aggregate>.service.ts          use cases, depends on the port only
│   ├── events/                                  domain event payloads (if the context emits any)
│   └── listeners/                               handlers for other contexts' events
├── infrastructure/
│   ├── prisma-repositories/<aggregate>.repository.ts
│   └── mappers/<aggregate>.mapper.ts            domain ↔ persistence
├── presentation/http/
│   ├── controllers/<aggregates>.controller.ts   plural name
│   ├── dto/                                     request DTOs with class-validator
│   ├── models/                                  response models
│   └── mappers/                                 domain ↔ HTTP
└── $1.module.ts
```

## Rules that must hold

- The domain layer imports nothing from `@nestjs/*`, `@prisma/client` or `@intra/database`.
- The service injects the port token; the module wires the concrete repository with
  `{ provide: TOKEN, useExisting: ConcreteRepo }`.
- The controller validates via DTO, calls one service method, maps to a response model. No business
  logic, no branching on domain state.
- **No direct imports from another context.** Cross-context interaction happens through
  `EventEmitter2` — emit an event, let the other side listen.
- Shared DTOs, enums and constraints go in `packages/shared-kernel/src/$1/`, not in the context.
- Files are kebab-case with a role suffix; controllers plural, services singular.

## After scaffolding

1. Register the module in `apps/api/src/app.module.ts`.
2. Add the matching `constraints/`, `dto/`, `enums/` folders in `@intra/shared-kernel` and export
   them from `src/index.ts`.
3. Add Prisma models with `@@map("$1_<table>")` — the table prefix must match the context name.
4. Say explicitly which steps you did **not** do (migration, seeders, frontend slices) so nothing
   looks finished when it is not.

Do not run any database command — schema changes are the author's call.
