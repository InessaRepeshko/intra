# Intra Docs

Documentation assets for the **Intra 360° Feedback** monorepo: generated API artefacts, architecture
diagrams, UI screenshots and test-report captures. This package has no build step — it is a plain
asset folder consumed by the root [`README.md`](../../README.md), the per-package READMEs and the API's
static file server.

---

## 🗂️ Folder structure

```
apps/docs/
├── api/                          # Generated API artefacts (do not hand-edit)
│   ├── openapi.json              # OpenAPI document — rewritten on every API boot
│   └── postman/collections/      # Postman collection for manual API testing
├── diagrams/                     # Architecture, behaviour & data-model diagrams
│   ├── use-case-diagram.png      # User scenarios per role (Employee / Manager / Admin)
│   ├── package-diagram-monorepo.png   # Workspace dependencies across apps/ and packages/
│   ├── deployment-diagram.png    # Vercel + Render Web Service + Render Postgres
│   ├── class-diagram-feedback360.png  # DDD layers of the feedback360 context
│   ├── class-diagram-reporting.png    # DDD layers of the reporting context
│   ├── activity-diagram-strategic-report-generation.png
│   ├── sequence-diagram-review-creation.png
│   ├── sequence-diagram-survey-answers.png
│   ├── sequence-diagram-review-autocompletion.png     # Cron + reactive triggers
│   ├── sequence-diagram-individual-report-generation.png
│   ├── ERD-feedback.png          # Logical model: 360° cycle & answer collection
│   ├── ERD-reporting.png         # Logical model: reporting & analytics
│   └── ERD-all-tables.png        # Full schema across all bounded contexts
├── screens/                      # UI screenshots (1440px viewport, seeded demo data)
├── tests/                        # Captured test reports
│   ├── unit-tests-dashboard.png
│   ├── integration-tests-dashboard.png
│   ├── end-to-end-tests-cypress.png
│   ├── load-tests-smoke.png            # k6, 1 VU
│   ├── load-tests-baseline-p95.png     # k6, 50 VUs — the SLO reference run
│   ├── load-tests-load-500vu.png       # k6, 500 VUs
│   ├── load-tests-stress-1500vu.png    # k6, 1500 VUs — breaking point
│   └── performance-tests-lighthouse.png # Lighthouse audit of the Vercel deployment
└── public/                       # Runtime static assets — served by the API at /public
    ├── logo.png, favicon*        # Used by Swagger UI and the web app
    └── user-avatars/             # Seeded demo user avatars
```

## 🖼️ Two kinds of assets

- **`public/` is runtime.** The API serves this folder at `/public` (Swagger logo, favicons).
  Renaming files here breaks the running service.
- **Everything else is documentation.** `diagrams/`, `screens/` and `tests/` are referenced only from
  Markdown files; renaming is safe as long as the referencing READMEs are updated.

## 🔄 Generated artefacts

`api/openapi.json` is serialised to disk on every API boot (see `apps/api/src/config/swagger.ts`) —
never edit it by hand. The ERD diagrams are exported from
`packages/database/src/prisma/dbml/schema.dbml` (produced by `prisma-dbml-generator`) via
[dbdiagram.io](https://dbdiagram.io); regenerate them after schema changes.

## 🏷️ Conventions

- File names are **kebab-case** (`360-feedback-survey-form.png`, `deployment-diagram.png`).
- Screenshots are taken at a fixed 1440 px viewport with the sidebar expanded, against seeded demo
  data — no real user information.
- Markdown references use absolute GitHub URLs
  (`https://github.com/InessaRepeshko/intra/blob/main/apps/docs/...?raw=true`) so images render both
  on GitHub and in external viewers.

---

© Inessa Repeshko, 2026
