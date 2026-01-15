![Intra Logo](apps/docs/public/1.png)
# Intra Monorepo (Turbo + npm workspaces)

У репозиторії три основні частини:
- `apps/api` — бекенд на NestJS
- `apps/web` — фронтенд на Next.js
- `packages/database` — схема Prisma, міграції й сіди

Запускати можна як разом через Turbo, так і окремо через workspace-скрипти.

## Попередні вимоги
- Node.js 18+ і npm
- Docker + Docker Compose

## Підготовка середовища
1) Скопіюй `.env.development.example` у `.env.development.local`
2) За потреби підготуй тестове середовище:
```bash
cp .env.test.example .env.test
```
3) Встанови залежності:
```bash
npm install
```

## Інфраструктура (Docker)
```bash
npm run docker:up     # підняти БД та сервіси
npm run docker:view   # переглянути контейнери
npm run docker:stop   # зупинити контейнери
npm run docker:down   # зупинити + почистити volumes/orphans
```

## База даних (через Turbo, пакунок @intra/database)
Усі команди автоматично підхоплюють `packages/database/prisma.config.ts` і читають змінні з `.env.development.local` або `.env.test`.
```bash
# DEV
npm run db:generate   # prisma generate
npm run db:create     # migrate dev
npm run db:deploy     # migrate deploy
npm run db:seed       # prisma db seed
npm run db:reset      # migrate reset --force
npm run db:refresh    # reset + generate + seed

# TEST
npm run db:test:generate
npm run db:test:deploy
npm run db:test:seed
npm run db:test:reset
npm run db:test:refresh
```

## Бекенд (через Turbo, пакунок @intra/api)
```bash
npm run start:dev     # Nest + watch, NODE_ENV=development
npm run start         # Nest без watch
npm run start:test    # запуск із .env.test
npm run start:debug   # debug mode
npm run start:prod    # node dist/apps/api/src/main.js

npm run refresh       # db:refresh (@intra/database) + start:dev
npm run refresh:test  # db:test:refresh + start:test

npm run lint          # eslint для src і test
npm run format        # prettier по src і test
npm run test          # jest (clear cache + run)
npm run test:unit     # jest --watch для unit
npm run test:e2e      # jest --watch для e2e
npm run test:cov      # coverage
npm run test:debug    # jest у debug режимі
```

## Фронтенд (через Turbo, пакунок @intra/web)
```bash
npm run dev:web       # next dev
# або працюй без Turbo
npm run dev -w @intra/web
npm run build -w @intra/web
npm run start -w @intra/web
npm run lint -w @intra/web
```

## Режими роботи
- Розробка всього разом: `npm run dev` (Turbo підніме потрібні dev-цілі паралельно)
- Лише бекенд: `npm run start:dev`
- Лише база: `npm run db:refresh` (або будь-яка інша db-команда)
- Лише фронт: `npm run dev:web`

## Запуск скриптів без Turbo (workspace)
Якщо потрібно виконати команду напряму в пакеті, використовуй прапорець `-w`:
```bash
npm run start:dev -w @intra/api
npm run db:refresh -w @intra/database
npm run dev -w @intra/web
```

## Корисні посилання
- API: http://localhost:3000
- Swagger: http://localhost:3000/docs
