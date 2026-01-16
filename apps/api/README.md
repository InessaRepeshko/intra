## Intra API (NestJS)

Цей пакунок містить бекенд. Команди можна запускати через Turbo з кореня або напряму з workspace.

### Підготовка
1. З кореня зроби `.env.development.local` (і `.env.test` за потреби).
2. Підніми БД: `pnpm docker:up`.
3. Ініціалізуй базу (у корені): `pnpm db:refresh` або `pnpm db:test:refresh`.

### Запуск
- `pnpm start:dev -w @intra/api` — dev режим з watch (`NODE_ENV=development`).
- `pnpm start -w @intra/api` — звичайний старт у dev env.
- `pnpm start:test -w @intra/api` — запуск із `.env.test`.
- `pnpm start:debug -w @intra/api` — debug + watch.
- `pnpm start:prod -w @intra/api` — запуск з `dist/apps/api/src/main.js` і `.env.production` (попіклуйся про файл).

Через Turbo з кореня еквівалентні команди:
- `pnpm start:dev`
- `pnpm start`
- `pnpm start:test`
- `pnpm start:debug`
- `pnpm start:prod`

### База даних (делеговано @intra/database)
- `pnpm refresh` — викликає `db:refresh` у `@intra/database` та стартує API.
- `pnpm refresh:test` — те саме для тестового середовища.
За потреби можна викликати будь-яку `db:*` чи `db:test:*` команду напряму:
```bash
pnpm db:generate -w @intra/database
pnpm db:test:refresh -w @intra/database
```

### Якість коду
- `pnpm lint -w @intra/api` — ESLint для `src` і `test`.
- `pnpm format -w @intra/api` — Prettier для `src` і `test`.

### Тести (Jest)
- `pnpm test -w @intra/api` — очистити кеш + повний запуск.
- `pnpm test:unit -w @intra/api` — watch для unit.
- `pnpm test:e2e -w @intra/api` — watch для e2e.
- `pnpm test:cov -w @intra/api` — coverage.
- `pnpm test:debug -w @intra/api` — відлагодження у Jest.

### Збірка
- `pnpm build -w @intra/api` — `nest build` у `dist/apps/api`.



@ Inessa Repeshko 2026
