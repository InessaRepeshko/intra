import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: "./schema.prisma",
  migrations: {
    path: "./migrations",
    seed: "npx tsx packages/database/prisma/seeds/seeds.ts"
  },
  datasource: {
    url: process.env.DATABASE_URL!, 
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL!
  }
});
