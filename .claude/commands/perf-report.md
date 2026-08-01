---
description: Summarise the latest k6 load-test results against the declared SLO budgets
argument-hint: "[scenario] (default: all)"
allowed-tools: Bash, Read
---

Summarise the k6 results in `apps/api/test/load/results/`. If `$1` names a scenario, report only
that one; otherwise report every scenario found.

## Where the data is

- Results: `apps/api/test/load/results/<scenario>.summary.json` (the `.html` siblings are the full
  interactive reports — do not parse those).
- SLO budgets: `apps/api/test/load/scripts/lib/config.js` — `INTERACTIVE_P95_MS`, `PDF_BUDGET_MS`,
  `ERROR_RATE`.
- Load profiles: `apps/api/test/load/scripts/scenarios/<scenario>.js` — read `options.scenarios[].stages`
  for the VU ramp and `options.thresholds` for what the run actually asserted.

Metrics in `summary.json` sit directly under `metrics.<name>` (`avg`, `min`, `max`, `p(90)`, `p(95)`),
not under a `values` key. In the `thresholds` map, **`true` means the threshold was breached**.

## What to report

A table with one row per scenario: max VUs, total requests, request rate, `http_req_duration` p95 and
p99, error rate, and pass/fail per threshold — with the measured value next to the budget it was
compared against, so the margin is visible.

Then a short reading of the numbers. Call out anything that contradicts a naive interpretation, for
example:

- A p95 that *improves* under higher load usually means fast failures (4xx / refused connections)
  pulling the distribution down, not a faster server.
- An error rate that stays flat as VUs grow is not saturation — saturation scales with load. A
  constant share points at one endpoint failing systematically; compare it against the endpoint
  weights in `scripts/lib/endpoints.js`.
- `iteration_duration` is dominated by the scripted `sleep()` think-time, not by server latency.
  Never present it as a response time.

## Hard constraints

- Report failed thresholds explicitly. A breached SLO is the point of a load test, not something to
  soften.
- State that these are local-machine numbers: `BASE_URL` defaults to
  `http://host.docker.internal:8080`. Do not present them as production figures.
- Do not re-run the scenarios — this command only reads existing results.
