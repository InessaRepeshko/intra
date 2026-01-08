import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "packages/database/prisma/schema.prisma",
  migrations: {
    path: "packages/database/prisma/migrations",
    seed: "npx ts-node packages/database/prisma/seeds/seeds.ts"
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL")
  }
});
