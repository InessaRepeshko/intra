![Intra Logo](apps/docs/public/1.png)
# "Intra" 360° Feedback Service

## 🚀 Quick Start for local development
1. Setup environment

  Execute the following commands sequentially in the project root folder:
  ```bash
  cp .env.example .env.development.local
  ```

2. Install dependencies
  ```bash
  npm install
  ```

3. Start the database (Docker)
  ```bash
  npm run docker:up
  ```

4. Prepare database (Prisma)
  ```bash
  # Create tables, generate types, seed data
  npm run db:refresh
  ```

5. Launch the application
  ```bash
  npm run start
  ```

6. Browse
- 👉 API: http://localhost:3000
- 👉 Swagger Docs: http://localhost:3000/docs 
- 👉 Prisma Studio (UI для БД): 
  ```bash
  npm run prisma:base studio
  ```

## 📋 Prerequisites
Before you begin, ensure you have the following installed:
- Node.js (v18.x or higher)
- npm
- Docker & Docker Compose
- PostgreSQL (via Docker)
- Git

> ⚠️ Note: This project uses Prisma 7 with a centralized prisma.config.ts. Always use `npm run db:...` commands to ensure the correct configuration is loaded.

## 🛠 Step-by-Step Installation
1. Clone the Repository
  ```bash
  git clone <repository-url> intra
  cd intra
  ```

2. Environment Variables
The project uses specific `.env` files for different environments. Create your local development environment file:
  ```bash
  cp .env.example .env.development.local
  ```

3. Install Dependencies
  ```shell
  npm install
  ```

4. Start Infrastructure (Docker)
Launch the database and any other required services:
  ```bash
  npm run docker:up
  ```

5. Database Initialization
Run the migrations to create the database schema, generate the Prisma Client, and seed the initial data:
  ```bash
  # This will reset the DB, run migrations, generate types, and seed
  npm run db:refresh
  ```

6. Run the Application
Start the NestJS API in `development` mode with hot-reload:
  ```bash
  npm run start:dev
  ```

The API should now be running at 👉 http://localhost:3000 (or your configured port).

### Environment Configuration
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

> ⚠️ `DEV` and `TEST` environments must use different databases

### Run infrastructure
Start Docker containers:
  ```bash
  npm run docker:up
  ```
Check running containers:
  ```bash
  npm run docker:view
  ```

### Database Migrations (DEV)
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

### Build the Project
  ```bash
  npm run build
  ```

### Start the Application
  ```bash
  npm run start:dev
  ```
The API will be available at 👉 http://localhost:8080/api (or your configured port).

### Prepare Test Database
Reset and apply all migrations to the test database:
  ```bash
  npm run migrate:test:reset
  ```
(Optional) Seed test database:
  ```bash
  npm run seed:test
  ```

### Run Tests
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

## 🧪 Testing
To run the test suite, ensure the test database is ready:
```bash
# Start test database
npm run docker:up

# Run migrations and tests
npm run refresh:test
```

## 🛠 Useful Commands
- **Docker**
  - `npm run docker:up` — start containers
  - `npm run docker:view` — view running containers
  - `npm run docker:stop` - stop all running docker containers
  - `npm run docker:down` — stop containers and remove volumes
- **Prisma**
  - `npm rub db:generate` - regenerate Prisma Client types
  - `npm run db:create -- --name <migration-name>` — create a new migration after schema changes for dev env
  - `npm run db:deploy` — apply migrations
  - `npm run db:seed` - re-run the database seed script
  - `npm run db:reset` — reset DB and apply migrations
- **Running**
  - `npm run start:dev` — run in watch mode
  - `npm run start:test` — run in test mode
  - `npm run start:debug` — run in debug mode
- **Linting and Formatting**
  - `npm run lint` - lint and auto fix with ESLint
  - `npm run format` - format with Prettier



@ Inessa Repeshko 2026
