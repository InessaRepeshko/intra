import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: "./schema.prisma",
  migrations: {
    path: "./migrations",
    seed: "npx ts-node ../prisma/seeds/seeds.ts"
  },
  datasource: {
    url: process.env.DATABASE_URL
  }
});
