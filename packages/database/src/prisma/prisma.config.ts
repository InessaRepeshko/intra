import type { PrismaConfig } from "prisma";

export default ({
    schema: "./schema.prisma",
    migrations: {
        path: "./migrations",
        seed: "pnpm tsx ./seeds/seeds.ts"
    },
    datasource: {
        url: process.env.DATABASE_URL!,
        shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL!
    }
}) satisfies PrismaConfig;
