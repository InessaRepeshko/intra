// import { defineConfig } from 'prisma/config';

// export default defineConfig({
//   schema: "./schema.prisma",
//   migrations: {
//     path: "./migrations",
//     seed: "npx tsx packages/database/prisma/seeds/seeds.ts"
//   },
//   datasource: {
//     url: process.env.DATABASE_URL!, 
//     shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL!
//   }
// });

import type { PrismaConfig } from "prisma";

export default ({
  schema: "./schema.prisma",
  migrations: {
    path: "./migrations",
    seed: "npx tsx prisma/seeds/seeds.ts"
  },
  datasource: {
    url: process.env.DATABASE_URL!, 
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL!
  }
}) satisfies PrismaConfig;
