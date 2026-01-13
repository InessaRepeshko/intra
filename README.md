![Intra Logo](apps/docs/public/1.png)
# Intra

## ⚡ Quick Start
| Step | DEV | TEST |
|-----:|-----|------|
| 1. Start infrastructure | ```npm run docker:up``` | ```npm run docker:test:up``` |
| 2. Apply migrations | ```npm run migrate``` | ```npm run migrate:test:reset``` |
| 3. Generate Prisma Client | ```npm run migrate:generate``` | - |
| 4. Optional: seed database | ```npm run migrate:seed``` | - |
| 5. Start application | ```npm run start:dev``` | ```npm run start:test``` |

## 🚀 How to Run the Intra Backend
This paragraph describes how to **set up, migrate, and run** the Intra backend application in **development** and **test** environments.

### 📦 Prerequisites
Make sure the following tools are installed:
- Node.js (LTS)
- npm
- Docker & Docker Compose
- MySQL (via Docker)
- Git

### 1️⃣ Clone the Repository
```bash
git clone <repository-url> intra-backend
cd intra-backend
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Environment Configuration
#### 🟢 Development Environment
Create `.env.development.local` file:
```bash
cp .env.development.example .env.development.local
```

#### 🟡 Test Environment
Create `.env.test` file:
```bash
cp .env.test.example .env.test
```

> ⚠️ DEV and TEST environments must use different databases

### 4️⃣ Run Infrastructure
Start Docker containers:
```bash
npm run docker:up
```
Check running containers:
```bash
npm run docker:view
```

### 5️⃣ Database Migrations (DEV)
Create and apply migrations (only in DEV):
```bash
npm run migrate:create
```
Generate Prisma Client:
```bash
npm run migrate:generate
```
(Optional) Seed database with initial data:
```bash
npm run migrate:seed
```

### 6️⃣ Build the Project
```bash
npm run build
```

### 7️⃣ Start the Application
```bash
npm run start:dev
```
The API will be available at 👉 http://localhost:8080/api

### 8️⃣ Prepare Test Database
Reset and apply all migrations to the test database:
```bash
npm run migrate:test:reset
```
(Optional) Seed test database:
```bash
npm run seed:test
```

### 9️⃣ Run Tests
```bash
npm run test
```
Run unit tests only:
```bash
npm run test:unit
```
Run e2e tests only:
```bash
npm run test:e2e
```

## 📚 Useful Commands

- **Docker**
  - `npm run docker:up` — start containers
  - `npm run docker:view` — view running containers
  - `npm run docker:down` — stop containers and remove volumes
- **Prisma**
  - `npm run migrate:create -- --name <migration-name>` — create/apply migration (dev)
  - `npm run migrate:deploy` — apply migrations
  - `npm run migrate:generate` — prisma generate
  - `npm run migrate:reset` — reset DB and apply migrations
- **Running**
  - `npm run start:dev` — run in watch mode
  - `npm run start:test` — run in test mode
  - `npm run start:debug` — run in debug mode
- **Linting and Formatting**
  - `npm run lint` - lint and auto fix with ESLint
  - `npm run format` - format with Prettier


