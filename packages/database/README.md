## Intra Database (Prisma)

Цей пакунок містить схему Prisma, міграції та сіди. Команди треба запускати з кореня (npm workspace) — вони автоматично читають `prisma.config.ts`.

### Оточення
- DEV: `.env.development.local`
- TEST: `.env.test`
- PROD (за потреби): `.env.production`

Перед виконанням db-команд переконайся, що потрібний `.env` існує та БД запущена (`npm run docker:up`).

### Основні команди (DEV)
```bash
npm run prisma:config -w @intra/database   # простий виклик Prisma з конфігом
npm run prisma:dev -w @intra/database      # Prisma з .env.development.local

npm run db:generate -w @intra/database     # prisma generate
npm run db:create -w @intra/database       # migrate dev
npm run db:deploy -w @intra/database       # migrate deploy
npm run db:seed -w @intra/database         # prisma db seed
npm run db:reset -w @intra/database        # migrate reset --force
npm run db:refresh -w @intra/database      # reset + generate + seed
```

### Команди для TEST
```bash
npm run prisma:test -w @intra/database
npm run db:test:generate -w @intra/database
npm run db:test:deploy -w @intra/database
npm run db:test:seed -w @intra/database
npm run db:test:reset -w @intra/database
npm run db:test:refresh -w @intra/database
```

### Де лежить конфіг
- `packages/database/prisma.config.ts` — шлях до `schema.prisma`, міграцій і сід-скрипту.
- Сід виконується через `npx tsx prisma/seeds/seeds.ts` (з цього пакету).

### Підказки
- Для роботи з DEV використовуй `.env.development.local`, для TEST — `.env.test`. Не змішуй бази.
- Якщо запускаєш через Turbo з кореня, можна використовувати скорочення:
  - `npm run db:generate`
  - `npm run db:refresh`
  - `npm run db:test:refresh`
