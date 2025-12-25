# intra-backend

Backend сервіс для Intra, побудований на **NestJS** та **Prisma**.

## Швидкий старт

1) Встановити залежності:

```bash
npm install
```

2) Підготувати змінні середовища (приклад):

```bash
cp .env.development.example .env.development.local
```

3) Підняти інфраструктуру (якщо використовуєте Docker):

```bash
npm run docker:up
```

4) Міграції/генерація Prisma та старт:

```bash
npm run migrate:generate
npm run migrate
npm run start:dev
```

## Корисні команди

- **Docker**
  - `npm run docker:up` — підняти контейнери
  - `npm run docker:down` — опустити контейнери та видалити volumes
- **Prisma**
  - `npm run migrate:create` — створити/застосувати міграцію (dev)
  - `npm run migrate:deploy` — застосувати міграції (prod-like) *(якщо налаштовано)*
  - `npm run migrate:generate` — `prisma generate`
  - `npm run migrate:reset` — скинути БД та прогнати міграції
- **Розробка**
  - `npm run start:dev` — запуск у watch mode
  - `npm run lint` / `npm run format`
