#!/usr/bin/env node
/**
 * Reads `metrics.json` produced by Cypress runs and emits:
 *   - a console table (immediate feedback)
 *   - `metrics.md`  — markdown table ready to paste into the thesis
 *   - `metrics.csv` — for opening in Excel / Numbers / Google Sheets
 *
 * All output files are gitignored — they're scratch artefacts.
 */
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..', '..');
const METRICS = resolve(ROOT, 'metrics.json');
const MD_OUT = resolve(ROOT, 'metrics.md');
const CSV_OUT = resolve(ROOT, 'metrics.csv');

if (!existsSync(METRICS)) {
    console.error('No metrics.json — run "pnpm run" first.');
    process.exit(1);
}

const rows = JSON.parse(readFileSync(METRICS, 'utf-8'));
if (rows.length === 0) {
    console.error('metrics.json is empty.');
    process.exit(1);
}

// ───────────────────────────────── console table ─────────────────────────────
const pad = (s, n) => String(s).padEnd(n);
const lpad = (s, n) => String(s).padStart(n);

const cols = [
    ['Scenario', 40],
    ['Steps', 6],
    ['Duration (s)', 13],
    ['Success', 8],
];

console.log(cols.map(([h, w]) => pad(h, w)).join(' | '));
console.log(cols.map(([, w]) => '-'.repeat(w)).join('-+-'));

for (const r of rows) {
    console.log(
        [
            pad(r.scenario, 40),
            lpad(r.stepCount, 6),
            lpad((r.durationMs / 1000).toFixed(2), 13),
            pad(r.success ? 'yes' : 'no', 8),
        ].join(' | '),
    );
}

const successRate = (rows.filter((r) => r.success).length / rows.length) * 100;
const avgSteps = rows.reduce((s, r) => s + r.stepCount, 0) / rows.length;
const avgDuration = rows.reduce((s, r) => s + r.durationMs, 0) / rows.length / 1000;
const totalDuration = rows.reduce((s, r) => s + r.durationMs, 0) / 1000;

console.log('');
console.log(`Scenarios     : ${rows.length}`);
console.log(`Success rate  : ${successRate.toFixed(1)}%`);
console.log(`Avg steps     : ${avgSteps.toFixed(1)}`);
console.log(`Avg duration  : ${avgDuration.toFixed(2)} s`);
console.log(`Total runtime : ${totalDuration.toFixed(2)} s`);

// ───────────────────────────────── markdown ──────────────────────────────────
const mdLines = [
    `# Usability metrics — generated ${new Date().toISOString().slice(0, 19).replace('T', ' ')}`,
    '',
    'Captured by Cypress E2E suite (`@intra/web-e2e`). Each row corresponds to',
    'a `cy.startScenario(...)` / `cy.endScenario(...)` block in a spec.',
    '',
    '## Per-scenario results',
    '',
    '| Scenario | Steps | Duration (s) | Success | Notes |',
    '| --- | ---: | ---: | :---: | --- |',
    ...rows.map(
        (r) =>
            `| \`${r.scenario}\` | ${r.stepCount} | ${(r.durationMs / 1000).toFixed(2)} | ${
                r.success ? '✓' : '✗'
            } | ${r.notes ?? ''} |`,
    ),
    '',
    '## Summary',
    '',
    `- **Scenarios executed**: ${rows.length}`,
    `- **Success rate (effectiveness)**: ${successRate.toFixed(1)}%`,
    `- **Average steps per scenario (efficiency)**: ${avgSteps.toFixed(1)}`,
    `- **Average duration per scenario**: ${avgDuration.toFixed(2)} s`,
    `- **Total suite runtime**: ${totalDuration.toFixed(2)} s`,
    '',
    '## Reading guide',
    '',
    '- **Steps** — count of `cy.step(...)` markers inside the scenario.',
    '  A high step count for one task signals a friction point in the UI.',
    '- **Duration** — wall-clock time inside the scenario. Includes UI',
    '  hydration, animations and network round-trips, so it overestimates',
    '  what a real user would feel by 1.5–2× on a fast machine, but the',
    '  relative ordering between scenarios is stable.',
    '- **Notes** — qualitative observations the spec emits when an empty',
    '  state or a degraded branch is exercised (e.g. `no finished cycles in',
    '  seed`).',
    '',
];
writeFileSync(MD_OUT, mdLines.join('\n'));

// ───────────────────────────────── csv ───────────────────────────────────────
const csvHeader = 'scenario,steps,duration_seconds,success,notes';
const csvRows = rows.map((r) => {
    const notes = (r.notes ?? '').replace(/"/g, '""');
    return `${r.scenario},${r.stepCount},${(r.durationMs / 1000).toFixed(2)},${
        r.success ? 'yes' : 'no'
    },"${notes}"`;
});
writeFileSync(CSV_OUT, [csvHeader, ...csvRows].join('\n') + '\n');

console.log('');
console.log(`Wrote ${MD_OUT}`);
console.log(`Wrote ${CSV_OUT}`);
