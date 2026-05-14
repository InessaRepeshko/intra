/**
 * Jest setup file for the unit suite.
 *
 * Silences NestJS Logger output globally so specs that hit
 * swallow-error / log-on-failure branches don't drown the Jest
 * reporter. Per-spec `jest.spyOn(Logger.prototype, ...)` still works
 * — those spies override the global mock for the duration of the
 * spec — so existing tests that assert on the Logger are unaffected.
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
