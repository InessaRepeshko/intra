import type { Config } from 'jest';

/**
 * Jest configuration for unit tests.
 *
 * Lives next to the unit test files so it travels with them.
 * `rootDir` points back at `apps/api/` so `<rootDir>/src/...` mappings
 * keep working as if Jest were invoked from there. Used via
 * `pnpm test:unit` / `pnpm test:unit:cov` from `apps/api/`.
 *
 * The `testRegex` matches `*.spec.ts` but NOT `*.integration-spec.ts`,
 * so integration tests stay in their own suite.
 */
const config: Config = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    // The config file is at apps/api/test/unit/, so two levels up
    // lands at apps/api/ — the directory that holds src/.
    rootDir: '../..',
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
    },
    // Match `*.spec.ts` only; `\.spec\.ts$` requires a literal dot before
    // `spec`, so `foo.integration-spec.ts` (which ends in `-spec.ts`) is
    // intentionally excluded.
    testRegex: '\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    testEnvironment: 'node',
    verbose: false,
    // Silence NestJS Logger output (see setup-jest.ts for the reasoning).
    // `setupFilesAfterEnv` runs AFTER Jest's test environment is installed,
    // so `jest.spyOn` etc. are available inside setup-jest.ts.
    setupFilesAfterEnv: ['<rootDir>/test/unit/setup-jest.ts'],
    // Coverage (enabled via `--coverage` / `pnpm test:unit:cov`).
    // Scope: application services / listeners — the layers unit tests
    // actually exercise. The integration-test config covers infrastructure
    // from a different angle, so the two reports complement each other.
    coverageDirectory: 'test/unit/coverage',
    collectCoverageFrom: [
        'src/contexts/*/application/**/*.ts',
        '!src/contexts/*/application/**/*.spec.ts',
    ],
};

export default config;
