/**
 * Minimal Jest reporter that writes the run's `AggregatedResult` to a
 * JSON file at the end of the run. The default reporter is left in
 * place by passing `--reporters=default --reporters=this-file` on the
 * CLI, so the console output you normally see is unchanged — this
 * reporter just adds a structured artifact that the dashboard
 * generator can consume.
 *
 * Output path comes from the `JEST_RESULTS_OUTPUT` env var (resolved
 * relative to the current working directory). If unset, defaults to
 * `jest-results.json` in the CWD.
 *
 * Reason for env var instead of reporter options: Jest's CLI
 * `--reporters` flag does not support inline option payloads, only
 * the `reporters: [name, options]` tuple syntax inside a config file.
 * Using an env var keeps the reporter usable from both CLI and config.
 */
const fs = require('fs');
const path = require('path');

class JsonResultsReporter {
    constructor(_globalConfig, options) {
        const target =
            process.env.JEST_RESULTS_OUTPUT ??
            options?.outputFile ??
            'jest-results.json';
        this._outputFile = path.resolve(target);
    }

    onRunComplete(_contexts, results) {
        fs.mkdirSync(path.dirname(this._outputFile), { recursive: true });
        fs.writeFileSync(
            this._outputFile,
            JSON.stringify(results, null, 2),
            'utf8',
        );
    }
}

module.exports = JsonResultsReporter;
