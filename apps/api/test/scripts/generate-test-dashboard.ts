/* eslint-disable */
/**
 * Generates an HTML dashboard from Jest's AggregatedResult JSON.
 *
 * Usage:
 *   tsx generate-test-dashboard.ts <results.json> <output.html> <suite-label>
 *
 * The script aggregates results per bounded context (identity,
 * organisation, library, feedback360, reporting, notifications) by
 * walking each spec file path and pulling the segment that comes
 * after `contexts/`. Anything outside `contexts/` is bucketed under
 * "other".
 *
 * The rendered page uses Chart.js via CDN and stays self-contained
 * (no JSON fetches, the data is inlined into the HTML).
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

type JestTestResult = {
    testFilePath: string;
    numFailingTests: number;
    numPassingTests: number;
    numPendingTests: number;
    numTodoTests: number;
    perfStats: { runtime: number };
    testResults: Array<{ status: string }>;
};

type JestAggregatedResult = {
    /**
     * Jest's own `success` flag is unreliable when serialised from
     * `onRunComplete` of a custom reporter — it's the intermediate
     * value, not the final one Jest computes AFTER reporters run.
     * The dashboard derives a trustworthy `success` from the numeric
     * fields below (see `isRunSuccessful`).
     */
    success: boolean;
    numTotalTestSuites: number;
    numPassedTestSuites: number;
    numFailedTestSuites: number;
    numPendingTestSuites: number;
    numRuntimeErrorTestSuites?: number;
    numTotalTests: number;
    numPassedTests: number;
    numFailedTests: number;
    numPendingTests: number;
    numTodoTests: number;
    startTime: number;
    testResults: JestTestResult[];
};

function isRunSuccessful(results: JestAggregatedResult): boolean {
    return (
        results.numFailedTests === 0 &&
        results.numFailedTestSuites === 0 &&
        (results.numRuntimeErrorTestSuites ?? 0) === 0
    );
}

type ContextStats = {
    name: string;
    suites: number;
    passedSuites: number;
    failedSuites: number;
    tests: number;
    passed: number;
    failed: number;
    pending: number;
    durationMs: number;
};

const CONTEXT_ORDER = [
    'identity',
    'organisation',
    'library',
    'feedback360',
    'reporting',
    'notifications',
];

// Soft palette tuned for projection — high enough contrast on white,
// no harsh saturated red/green clashes.
const CONTEXT_COLORS: Record<string, string> = {
    identity: '#6366f1',
    organisation: '#06b6d4',
    library: '#10b981',
    feedback360: '#f59e0b',
    reporting: '#8b5cf6',
    notifications: '#ec4899',
    other: '#94a3b8',
};

function extractContext(filePath: string): string {
    const match = filePath.match(/\/contexts\/([^\/]+)\//);
    return match ? match[1] : 'other';
}

function aggregate(results: JestAggregatedResult): ContextStats[] {
    const map = new Map<string, ContextStats>();
    for (const r of results.testResults) {
        const ctx = extractContext(r.testFilePath);
        const stats =
            map.get(ctx) ??
            ({
                name: ctx,
                suites: 0,
                passedSuites: 0,
                failedSuites: 0,
                tests: 0,
                passed: 0,
                failed: 0,
                pending: 0,
                durationMs: 0,
            } as ContextStats);
        stats.suites += 1;
        const suiteFailed = r.numFailingTests > 0;
        if (suiteFailed) stats.failedSuites += 1;
        else stats.passedSuites += 1;
        stats.tests +=
            r.numPassingTests + r.numFailingTests + r.numPendingTests;
        stats.passed += r.numPassingTests;
        stats.failed += r.numFailingTests;
        stats.pending += r.numPendingTests;
        stats.durationMs += r.perfStats?.runtime ?? 0;
        map.set(ctx, stats);
    }
    return [...map.values()].sort((a, b) => {
        const ia = CONTEXT_ORDER.indexOf(a.name);
        const ib = CONTEXT_ORDER.indexOf(b.name);
        if (ia === -1 && ib === -1) return a.name.localeCompare(b.name);
        if (ia === -1) return 1;
        if (ib === -1) return -1;
        return ia - ib;
    });
}

function formatDuration(ms: number): string {
    if (ms < 1000) return `${ms} ms`;
    const seconds = ms / 1000;
    if (seconds < 60) return `${seconds.toFixed(2)} s`;
    const minutes = Math.floor(seconds / 60);
    const restSec = (seconds - minutes * 60).toFixed(1);
    return `${minutes}m ${restSec}s`;
}

function renderHtml(
    title: string,
    suiteLabel: string,
    results: JestAggregatedResult,
    stats: ContextStats[],
): string {
    const totalDuration = stats.reduce((acc, s) => acc + s.durationMs, 0);
    const passRate = results.numTotalTests
        ? ((results.numPassedTests / results.numTotalTests) * 100).toFixed(1)
        : '0.0';
    const generatedAt = new Date().toLocaleString('uk-UA', {
        dateStyle: 'long',
        timeStyle: 'short',
    });
    const labels = stats.map((s) => s.name);
    const colors = stats.map((s) => CONTEXT_COLORS[s.name] ?? '#64748b');

    const data = {
        labels,
        colors,
        suites: stats.map((s) => s.suites),
        passed: stats.map((s) => s.passed),
        failed: stats.map((s) => s.failed),
        durations: stats.map((s) => Math.round(s.durationMs)),
    };

    return `<!doctype html>
<html lang="uk">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono&display=swap"
        rel="stylesheet"
    />
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
    <style>
        * { box-sizing: border-box; }
        :root {
            --bg: #f8fafc;
            --card: #ffffff;
            --text: #0f172a;
            --muted: #64748b;
            --border: #e2e8f0;
            --green: #10b981;
            --red: #ef4444;
            --amber: #f59e0b;
        }
        body {
            margin: 0;
            padding: 32px;
            background: var(--bg);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
            color: var(--text);
            line-height: 1.5;
        }
        header {
            max-width: 1200px;
            margin: 0 auto 32px;
        }
        header h1 {
            font-size: 28px;
            font-weight: 700;
            margin: 0 0 6px;
            letter-spacing: -0.5px;
        }
        header .subtitle {
            color: var(--muted);
            font-size: 14px;
        }
        header .pill {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 999px;
            background: ${isRunSuccessful(results) ? '#dcfce7' : '#fee2e2'};
            color: ${isRunSuccessful(results) ? '#166534' : '#991b1b'};
            font-size: 12px;
            font-weight: 600;
            margin-left: 12px;
            vertical-align: middle;
        }
        .grid {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
        }
        .card {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
        }
        .card .label {
            color: var(--muted);
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
        }
        .card .value {
            margin-top: 6px;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: -0.5px;
        }
        .card .delta {
            margin-top: 4px;
            color: var(--muted);
            font-size: 13px;
        }
        .card.pass .value { color: var(--green); }
        .card.fail .value { color: var(--red); }
        .charts {
            max-width: 1200px;
            margin: 24px auto;
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 16px;
        }
        .chart-card {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 24px;
        }
        .chart-card h2 {
            margin: 0 0 16px;
            font-size: 16px;
            font-weight: 600;
        }
        .chart-card .chart-wrap {
            height: 320px;
            position: relative;
        }
        table {
            max-width: 1200px;
            margin: 24px auto;
            width: 100%;
            border-collapse: collapse;
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 12px;
            overflow: hidden;
        }
        thead { background: #f1f5f9; }
        th, td {
            text-align: left;
            padding: 12px 16px;
            font-size: 14px;
            border-bottom: 1px solid var(--border);
        }
        th {
            font-weight: 600;
            color: var(--muted);
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.5px;
        }
        tbody tr:last-child td { border-bottom: 0; }
        td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
        .swatch {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 2px;
            margin-right: 8px;
            vertical-align: middle;
        }
        .green { color: var(--green); font-weight: 600; }
        .red { color: var(--red); font-weight: 600; }
        footer {
            max-width: 1200px;
            margin: 32px auto 0;
            text-align: center;
            color: var(--muted);
            font-size: 12px;
        }
        @media (max-width: 900px) {
            .grid { grid-template-columns: repeat(2, 1fr); }
            .charts { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <header>
        <h1>
            ${title}
            <span class="pill">${isRunSuccessful(results) ? 'PASS' : 'FAIL'}</span>
        </h1>
        <div class="subtitle">
            ${suiteLabel} · згенеровано ${generatedAt}
        </div>
    </header>

    <section class="grid">
        <div class="card">
            <div class="label">Test suites</div>
            <div class="value">${results.numTotalTestSuites}</div>
            <div class="delta">
                <span class="green">${results.numPassedTestSuites} passed</span>${
                    results.numFailedTestSuites
                        ? ` · <span class="red">${results.numFailedTestSuites} failed</span>`
                        : ''
                }
            </div>
        </div>
        <div class="card pass">
            <div class="label">Tests</div>
            <div class="value">${results.numTotalTests}</div>
            <div class="delta">
                <span class="green">${results.numPassedTests} passed</span>${
                    results.numFailedTests
                        ? ` · <span class="red">${results.numFailedTests} failed</span>`
                        : ''
                }${
                    results.numPendingTests
                        ? ` · ${results.numPendingTests} pending`
                        : ''
                }
            </div>
        </div>
        <div class="card">
            <div class="label">Pass rate</div>
            <div class="value">${passRate}%</div>
            <div class="delta">${results.numPassedTests}/${results.numTotalTests} tests</div>
        </div>
        <div class="card">
            <div class="label">Duration</div>
            <div class="value">${formatDuration(totalDuration)}</div>
            <div class="delta">cumulative across suites</div>
        </div>
    </section>

    <section class="charts">
        <div class="chart-card">
            <h2>Tests per context</h2>
            <div class="chart-wrap"><canvas id="testsBar"></canvas></div>
        </div>
        <div class="chart-card">
            <h2>Distribution by context</h2>
            <div class="chart-wrap"><canvas id="testsPie"></canvas></div>
        </div>
    </section>

    <section class="charts">
        <div class="chart-card">
            <h2>Suites per context</h2>
            <div class="chart-wrap"><canvas id="suitesBar"></canvas></div>
        </div>
        <div class="chart-card">
            <h2>Duration per context</h2>
            <div class="chart-wrap"><canvas id="durationBar"></canvas></div>
        </div>
    </section>

    <table>
        <thead>
            <tr>
                <th>Context</th>
                <th class="num">Suites</th>
                <th class="num">Tests</th>
                <th class="num">Passed</th>
                <th class="num">Failed</th>
                <th class="num">Duration</th>
            </tr>
        </thead>
        <tbody>
            ${stats
                .map(
                    (s) => `<tr>
                <td>
                    <span class="swatch" style="background:${
                        CONTEXT_COLORS[s.name] ?? '#64748b'
                    }"></span>${s.name}
                </td>
                <td class="num">${s.suites}</td>
                <td class="num">${s.tests}</td>
                <td class="num green">${s.passed}</td>
                <td class="num ${s.failed ? 'red' : ''}">${s.failed}</td>
                <td class="num">${formatDuration(s.durationMs)}</td>
            </tr>`,
                )
                .join('\n')}
        </tbody>
    </table>

    <footer>
        Згенеровано із Jest <code>AggregatedResult</code> ·
        ${results.testResults.length} spec files
    </footer>

    <script>
        const data = ${JSON.stringify(data)};

        const baseOpts = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#0f172a',
                    titleFont: { family: 'Inter', weight: '600' },
                    bodyFont: { family: 'Inter' },
                    padding: 10,
                    cornerRadius: 6,
                },
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { font: { family: 'Inter', size: 12 } },
                },
                y: {
                    beginAtZero: true,
                    grid: { color: '#e2e8f0' },
                    ticks: { font: { family: 'Inter', size: 12 } },
                },
            },
        };

        new Chart(document.getElementById('testsBar'), {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Passed',
                        data: data.passed,
                        backgroundColor: '#10b981',
                        borderRadius: 4,
                        stack: 'tests',
                    },
                    {
                        label: 'Failed',
                        data: data.failed,
                        backgroundColor: '#ef4444',
                        borderRadius: 4,
                        stack: 'tests',
                    },
                ],
            },
            options: {
                ...baseOpts,
                plugins: {
                    ...baseOpts.plugins,
                    legend: { display: true, position: 'bottom' },
                },
                scales: {
                    x: { ...baseOpts.scales.x, stacked: true },
                    y: { ...baseOpts.scales.y, stacked: true },
                },
            },
        });

        new Chart(document.getElementById('testsPie'), {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        data: data.passed.map((p, i) => p + data.failed[i]),
                        backgroundColor: data.colors,
                        borderWidth: 2,
                        borderColor: '#ffffff',
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: { family: 'Inter', size: 12 },
                            padding: 12,
                            usePointStyle: true,
                        },
                    },
                    tooltip: baseOpts.plugins.tooltip,
                },
            },
        });

        new Chart(document.getElementById('suitesBar'), {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Suites',
                        data: data.suites,
                        backgroundColor: data.colors,
                        borderRadius: 4,
                    },
                ],
            },
            options: baseOpts,
        });

        new Chart(document.getElementById('durationBar'), {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Duration (ms)',
                        data: data.durations,
                        backgroundColor: data.colors,
                        borderRadius: 4,
                    },
                ],
            },
            options: baseOpts,
        });
    </script>
</body>
</html>`;
}

function main(): void {
    const [, , inputArg, outputArg, ...rest] = process.argv;
    if (!inputArg || !outputArg) {
        console.error(
            'Usage: tsx generate-test-dashboard.ts <results.json> <output.html> [suite-label]',
        );
        process.exit(1);
    }
    const inputPath = resolve(inputArg);
    const outputPath = resolve(outputArg);
    const suiteLabel = rest.join(' ') || 'Test run';
    const title = suiteLabel.includes('Unit')
        ? 'Unit Tests Dashboard'
        : suiteLabel.includes('Integration')
          ? 'Integration Tests Dashboard'
          : 'Tests Dashboard';

    const raw = readFileSync(inputPath, 'utf8');
    const results = JSON.parse(raw) as JestAggregatedResult;
    const stats = aggregate(results);
    const html = renderHtml(title, suiteLabel, results, stats);
    writeFileSync(outputPath, html, 'utf8');
    console.log(`Dashboard written to ${outputPath}`);
}

main();
