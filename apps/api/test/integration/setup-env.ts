import * as dotenv from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';
import { Client } from 'pg';

const envFile = resolve(__dirname, '../../../../.env.test');

if (!existsSync(envFile)) {
    throw new Error(
        `Integration tests require ${envFile} with DATABASE_* credentials.`,
    );
}

// `quiet: true` suppresses dotenv 17.x's "tip" log line that otherwise
// shows up in every spec via the Jest console reporter.
dotenv.config({ path: envFile, quiet: true });

// Fallback: when this file is loaded directly by Jest (not through
// `dotenv-cli -e ...`) the `${DATABASE_USER}`/`${DATABASE_PASSWORD}`/...
// placeholders inside DATABASE_URL are not expanded by `dotenv` itself.
// Re-build the URL from the individual variables in that case so the
// integration suite works either with or without the dotenv-cli wrapper.
if (process.env.DATABASE_URL?.includes('${DATABASE_')) {
    const {
        DATABASE_USER,
        DATABASE_PASSWORD,
        DATABASE_HOST,
        DATABASE_PORT,
        DATABASE_NAME,
    } = process.env;

    if (
        DATABASE_USER &&
        DATABASE_PASSWORD &&
        DATABASE_HOST &&
        DATABASE_PORT &&
        DATABASE_NAME
    ) {
        process.env.DATABASE_URL = `postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;
    }
}

/**
 * Auto-creates the test database in the configured Postgres instance if
 * it doesn't exist yet. Idempotent and cached per process — multiple
 * spec files can call it freely; only the first call actually talks to
 * Postgres.
 *
 * Why: integration tests live in their own DB (e.g. `intra_test`) so
 * they can TRUNCATE freely without touching dev data. Asking developers
 * to run `CREATE DATABASE intra_test` by hand is friction; doing it
 * inline keeps the workflow to "spin up Postgres → run tests".
 *
 * The schema itself is NOT created here — run `pnpm db:test:refresh`
 * (or `pnpm test:integration:refresh`) once to apply Prisma migrations
 * after the database is created. Subsequent test runs only need
 * `pnpm test:integration`.
 */
let dbReadyPromise: Promise<void> | null = null;

export function ensureTestDatabaseExists(): Promise<void> {
    if (dbReadyPromise) return dbReadyPromise;

    dbReadyPromise = (async () => {
        const {
            DATABASE_USER,
            DATABASE_PASSWORD,
            DATABASE_HOST,
            DATABASE_PORT,
            DATABASE_NAME,
        } = process.env;

        if (
            !DATABASE_USER ||
            !DATABASE_PASSWORD ||
            !DATABASE_HOST ||
            !DATABASE_PORT ||
            !DATABASE_NAME
        ) {
            throw new Error(
                'DATABASE_USER/PASSWORD/HOST/PORT/NAME must be set ' +
                    'for integration tests (see .env.test).',
            );
        }

        // Connect to the `postgres` admin DB to inspect / create the
        // target database — you cannot `CREATE DATABASE` while
        // connected to the database being created.
        const admin = new Client({
            host: DATABASE_HOST,
            port: Number(DATABASE_PORT),
            user: DATABASE_USER,
            password: DATABASE_PASSWORD,
            database: 'postgres',
        });

        try {
            await admin.connect();
        } catch (error) {
            throw new Error(
                `Failed to reach Postgres at ${DATABASE_HOST}:${DATABASE_PORT} ` +
                    `as user "${DATABASE_USER}". Is Docker running? ` +
                    `(\`pnpm docker:up\`)\nUnderlying error: ${
                        (error as Error).message
                    }`,
            );
        }

        try {
            const { rows } = await admin.query(
                `SELECT 1 FROM pg_database WHERE datname = $1`,
                [DATABASE_NAME],
            );

            if (rows.length === 0) {
                // CREATE DATABASE doesn't accept parameters — quote the
                // identifier instead. The name comes from .env.test, which
                // we control, so injection isn't a concern here.
                await admin.query(`CREATE DATABASE "${DATABASE_NAME}"`);
                // eslint-disable-next-line no-console
                console.log(
                    `[integration] Created test database "${DATABASE_NAME}"`,
                );
            }
        } finally {
            await admin.end();
        }
    })();

    return dbReadyPromise;
}

if (process.env.DATABASE_URL?.includes('${DATABASE_')) {
    const {
        DATABASE_USER,
        DATABASE_PASSWORD,
        DATABASE_HOST,
        DATABASE_PORT,
        DATABASE_NAME,
    } = process.env;

    if (
        DATABASE_USER &&
        DATABASE_PASSWORD &&
        DATABASE_HOST &&
        DATABASE_PORT &&
        DATABASE_NAME
    ) {
        process.env.DATABASE_URL = `postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;
    }
}
