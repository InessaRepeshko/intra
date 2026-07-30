import type { Config } from 'jest';

/**
 * Jest configuration for integration tests.
 *
 * Lives next to the integration test files so it travels with them.
 * `rootDir` points back at `apps/api/` so `<rootDir>/src/...` mappings
 * keep working as if Jest were invoked from there. Used via
 * `pnpm test:integ` / `pnpm test:integ:cov` from `apps/api/`.
 */
const config: Config = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    // The config file is at apps/api/test/integration/, so two levels up
    // lands at apps/api/ — the directory that holds src/.
    rootDir: '../..',
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
    },
    testRegex: '\\.integration-spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    testEnvironment: 'node',
    verbose: false,
    // Silence NestJS Logger output (see setup-jest.ts for the reasoning).
    // `setupFilesAfterEnv` runs AFTER Jest's test environment is installed,
    // so `jest.spyOn` etc. are available inside setup-jest.ts.
    setupFilesAfterEnv: ['<rootDir>/test/integration/setup-jest.ts'],
    // Integration tests share a single Postgres database, so they must
    // run in-band to avoid interleaved TRUNCATEs.
    maxWorkers: 1,
    testTimeout: 30000,
    // Coverage (enabled via `--coverage` / `pnpm test:integ:cov`).
    // Scope: application services + infrastructure (repositories,
    // mappers) — the layers integration tests actually exercise. The
    // unit-test config covers application services from a different
    // angle, so the two reports complement each other.
    coverageDirectory: 'test/integration/coverage',
    collectCoverageFrom: [
        'src/contexts/*/application/services/**/*.ts',
        'src/contexts/*/application/listeners/**/*.ts',
        'src/contexts/*/infrastructure/prisma-repositories/**/*.ts',
        '!src/contexts/*/**/*.spec.ts',
    ],
};

export default config;
