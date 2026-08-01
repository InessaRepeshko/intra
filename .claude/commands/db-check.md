---
description: Inspect the configured database read-only — tables, row counts, size
argument-hint: "[dev|test|prod] (default: dev)"
allowed-tools: Bash, Read
---

Report the current state of the database for the `$1` environment (default `dev`) **read-only**.

Environment → connection string:

- `dev` → `DATABASE_URL` from `.env.development.local` — **a remote Render database, not a local
  container**. Treat it as shared data.
- `test` → `DATABASE_URL` from `.env.test`
- `prod` → `DATABASE_URL` from `.env.production`

## How to run it

`psql` is not installed. Use the `pg` driver that already ships with the workspace — run a Node
script with `NODE_PATH` pointing at the repo's `node_modules`, and connect with
`ssl: { rejectUnauthorized: false }` (Render rejects non-SSL connections).

Load the connection string with `dotenv-cli` rather than pasting it: credentials must never appear in
command output or in the transcript.

## What to report

1. Database name, server version, total size.
2. Whether any tables exist at all — if `pg_stat_user_tables` is empty, say plainly that migrations
   have not been applied.
3. A table of every table with its exact row count (`SELECT count(*)`, not `n_live_tup` — the
   planner estimate lags and reads as zero on a freshly seeded database).
4. A one-line verdict: empty / schema only, no data / populated.

## Hard constraints

- **SELECT only.** No `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, `DROP`, and no migration commands.
- Never print the password or the full connection string.
- Delete any temporary script when finished.
