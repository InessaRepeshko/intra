/**
 * Jest setup file for the integration suite.
 *
 * Silences NestJS Logger output during the run. The integration tests
 * deliberately exercise paths that log errors: async listeners that
 * fire after a `resetXxxTables()` truncated the database in the next
 * `beforeEach`, the MailerStub throwing on demand to drive the failure
 * branch, and so on. These errors are caught by their try/catch blocks
 * — the tests still pass — but the raw Nest log output drowns the
 * actual Jest result summary.
 *
 * Errors that genuinely fail a test still surface through Jest's own
 * reporter (expect rejections, thrown assertions, etc.), so silencing
 * the Logger here does not hide real failures.
 */
import { Logger } from '@nestjs/common';

const noop = () => undefined;

jest.spyOn(Logger.prototype, 'error').mockImplementation(noop);
jest.spyOn(Logger.prototype, 'warn').mockImplementation(noop);
jest.spyOn(Logger.prototype, 'log').mockImplementation(noop);
jest.spyOn(Logger.prototype, 'debug').mockImplementation(noop);
jest.spyOn(Logger.prototype, 'verbose').mockImplementation(noop);
