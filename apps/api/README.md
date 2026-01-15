## Intra API (NestJS)

Цей пакунок містить бекенд. Команди можна запускати через Turbo з кореня або напряму з workspace.

### Підготовка
1. З кореня зроби `.env.development.local` (і `.env.test` за потреби).
2. Підніми БД: `npm run docker:up`.
3. Ініціалізуй базу (у корені): `npm run db:refresh` або `npm run db:test:refresh`.

### Запуск
- `npm run start:dev -w @intra/api` — dev режим з watch (`NODE_ENV=development`).
- `npm run start -w @intra/api` — звичайний старт у dev env.
- `npm run start:test -w @intra/api` — запуск із `.env.test`.
- `npm run start:debug -w @intra/api` — debug + watch.
- `npm run start:prod -w @intra/api` — запуск з `dist/apps/api/src/main.js` і `.env.production` (попіклуйся про файл).

Через Turbo з кореня еквівалентні команди:
- `npm run start:dev`
- `npm run start`
- `npm run start:test`
- `npm run start:debug`
- `npm run start:prod`

### База даних (делеговано @intra/database)
- `npm run refresh` — викликає `db:refresh` у `@intra/database` та стартує API.
- `npm run refresh:test` — те саме для тестового середовища.
За потреби можна викликати будь-яку `db:*` чи `db:test:*` команду напряму:
```bash
npm run db:generate -w @intra/database
npm run db:test:refresh -w @intra/database
```

### Якість коду
- `npm run lint -w @intra/api` — ESLint для `src` і `test`.
- `npm run format -w @intra/api` — Prettier для `src` і `test`.

### Тести (Jest)
- `npm run test -w @intra/api` — очистити кеш + повний запуск.
- `npm run test:unit -w @intra/api` — watch для unit.
- `npm run test:e2e -w @intra/api` — watch для e2e.
- `npm run test:cov -w @intra/api` — coverage.
- `npm run test:debug -w @intra/api` — відлагодження у Jest.

### Збірка
- `npm run build -w @intra/api` — `nest build` у `dist/apps/api`.
