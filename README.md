<h1 align="center"> "Intra" 360° Feedback Service </h1>
<div align="center">
    <img src="apps/docs/public/1.png" width="700" height="700" alt="Intra">
</div>


## 🚀 Quick Start for local development
1. Setup environment

  Execute the following commands sequentially in the project root folder:
  ```bash
  cp .env.example .env.development.local
  ```

2. Install dependencies
  ```bash
  pnpm install
  ```

3. Start the database (Docker)
  ```bash
  pnpm docker:up
  ```

4. Prepare database (Prisma)
  ```bash
  # Create tables, generate types, seed data
  pnpm db:refresh
  ```

5. Launch the application
  ```bash
  pnpm start
  ```

6. Browse
- 👉 API: http://localhost:8080
- 👉 Swagger Docs: http://localhost:8080/docs 
- 👉 Prisma Studio (UI для БД): 
  ```bash
  pnpm prisma:base studio
  ```


# Intra Monorepo (Turbo + pnpm workspaces)

У репозиторії три основні частини:
- `apps/api` — бекенд на NestJS
- `apps/web` — фронтенд на Next.js
- `packages/database` — схема Prisma, міграції й сіди

Запускати можна як разом через Turbo, так і окремо через workspace-скрипти.

## 📋 Prerequisites
Before you begin, ensure you have the following installed:
- Node.js (v18.x or higher)
- pnpm
- Docker & Docker Compose
- PostgreSQL (via Docker)
- Git

> ⚠️ Note: This project uses Prisma 7 with a centralized prisma.config.ts. Always use `pnpm db:...` commands to ensure the correct configuration is loaded.

## Підготовка середовища
1) Скопіюй `.env.development.example` у `.env.development.local`
2) За потреби підготуй тестове середовище:
```bash
cp .env.test.example .env.test
```
3) Встанови залежності:
```bash
pnpm install
```

## Інфраструктура (Docker)
```bash
pnpm docker:up     # підняти БД та сервіси
pnpm docker:view   # переглянути контейнери
pnpm docker:stop   # зупинити контейнери
pnpm docker:down   # зупинити + почистити volumes/orphans
```

## База даних (через Turbo, пакунок @intra/database)
Усі команди автоматично підхоплюють `packages/database/prisma.config.ts` і читають змінні з `.env.development.local` або `.env.test`.
```bash
# DEV
pnpm db:generate                              # prisma generate
pnpm db:create -- --name <migration-name>     # migrate dev
pnpm db:deploy                                # migrate deploy
pnpm db:seed                                  # prisma db seed
pnpm db:reset                                 # migrate reset --force
pnpm db:refresh                               # reset + generate + seed

# TEST
pnpm db:test:generate
pnpm db:test:deploy
pnpm db:test:seed
pnpm db:test:reset
pnpm db:test:refresh
```

## Бекенд (через Turbo, пакунок @intra/api)
```bash
pnpm start:dev     # Nest + watch, NODE_ENV=development
pnpm start         # Nest без watch
pnpm start:test    # запуск із .env.test
pnpm start:debug   # debug mode
pnpm start:prod    # node dist/apps/api/src/main.js

pnpm refresh       # db:refresh (@intra/database) + start:dev
pnpm refresh:test  # db:test:refresh + start:test

pnpm lint          # eslint для src і test
pnpm format        # prettier по src і test
pnpm test          # jest (clear cache + run)
pnpm test:unit     # jest --watch для unit
pnpm test:e2e      # jest --watch для e2e
pnpm test:cov      # coverage
pnpm test:debug    # jest у debug режимі
```

## Фронтенд (через Turbo, пакунок @intra/web)
```bash
pnpm dev:web       # next dev
# або працюй без Turbo
pnpm dev -w @intra/web
pnpm build -w @intra/web
pnpm start -w @intra/web
pnpm lint -w @intra/web
```

## Режими роботи
- Розробка всього разом: `pnpm dev` (Turbo підніме потрібні dev-цілі паралельно)
- Лише бекенд: `pnpm start:dev`
- Лише база: `pnpm db:refresh` (або будь-яка інша db-команда)
- Лише фронт: `pnpm dev:web`

## Запуск скриптів без Turbo (workspace)
Якщо потрібно виконати команду напряму в пакеті, використовуй прапорець `-w`:
```bash
pnpm start:dev -w @intra/api
pnpm db:refresh -w @intra/database
pnpm dev -w @intra/web
```

## Корисні посилання
- API: http://localhost:8080
- Swagger: http://localhost:8080/docs



@ Inessa Repeshko 2026
