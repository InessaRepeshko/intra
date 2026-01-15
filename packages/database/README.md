## Intra Database (Prisma)

Цей пакунок містить схему Prisma, міграції та сіди. Команди треба запускати з кореня (pnpm workspace) — вони автоматично читають `prisma.config.ts`.

### Оточення
- DEV: `.env.development.local`
- TEST: `.env.test`
- PROD (за потреби): `.env.production`

Перед виконанням db-команд переконайся, що потрібний `.env` існує та БД запущена (`pnpm docker:up`).

### Основні команди (DEV)
```bash
pnpm prisma:config -w @intra/database   # простий виклик Prisma з конфігом
pnpm prisma:dev -w @intra/database      # Prisma з .env.development.local

pnpm db:generate -w @intra/database     # prisma generate
pnpm db:create -w @intra/database       # migrate dev
pnpm db:deploy -w @intra/database       # migrate deploy
pnpm db:seed -w @intra/database         # prisma db seed
pnpm db:reset -w @intra/database        # migrate reset --force
pnpm db:refresh -w @intra/database      # reset + generate + seed
```

### Команди для TEST
```bash
pnpm prisma:test -w @intra/database
pnpm db:test:generate -w @intra/database
pnpm db:test:deploy -w @intra/database
pnpm db:test:seed -w @intra/database
pnpm db:test:reset -w @intra/database
pnpm db:test:refresh -w @intra/database
```

### Де лежить конфіг
- `packages/database/prisma.config.ts` — шлях до `schema.prisma`, міграцій і сід-скрипту.
- Сід виконується через `npx tsx prisma/seeds/seeds.ts` (з цього пакету).

### Підказки
- Для роботи з DEV використовуй `.env.development.local`, для TEST — `.env.test`. Не змішуй бази.
- Якщо запускаєш через Turbo з кореня, можна використовувати скорочення:
  - `pnpm db:generate`
  - `pnpm db:refresh`
  - `pnpm db:test:refresh`



@ Inessa Repeshko 2026
