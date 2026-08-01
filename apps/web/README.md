# Intra Web

The web client for the **Intra 360° Feedback** platform — a Next.js 16 / React 19 application that lets HR, managers and employees run, monitor and analyse 360° feedback cycles. The package is part of a Turborepo monorepo and is published internally as `@intra/web`.

---

## 📑 Table of contents

- [📸 Screenshots](#-screenshots)
- [🛠️ Tech stack](#-tech-stack)
- [🏛️ Architecture overview (Feature-Sliced Design)](#-architecture-overview-feature-sliced-design)
- [🗂️ Project structure](#-project-structure)
- [🗺️ Routing & pages](#-routing--pages)
- [🧩 Domain modules](#-domain-modules)
- [🔄 State management & data fetching](#-state-management--data-fetching)
- [🔐 Authentication](#-authentication)
- [🎨 UI system](#-ui-system)
- [📝 Forms & validation](#-forms--validation)
- [📊 Charts & analytics](#-charts--analytics)
- [⚙️ Configuration](#-configuration)
- [📋 Prerequisites](#-prerequisites)
- [📜 Available scripts](#-available-scripts)
- [🚀 Running locally](#-running-locally)
- [🧹 Linting & formatting](#-linting--formatting)
- [📦 Build & production](#-build--production)
- [🧭 Path aliases](#-path-aliases)

---

## 📸 Screenshots

The dashboard, the survey answering experience and an individual report:

<img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/screens/dashboard.png?raw=true" width="850" alt="Dashboard">

<img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/screens/360-feedback-survey-form.png?raw=true" width="850" alt="Survey form">

<img src="https://github.com/InessaRepeshko/intra/blob/main/apps/docs/screens/reporting-individual-report.png?raw=true" width="850" alt="Individual report">

The full gallery — cycles, reviews, library, organisation, strategic reports and analytics — lives in
the root [README](../../README.md#-screenshots).

---

## 🛠️ Tech stack

<p>
    <img src="https://img.shields.io/badge/Next.js_16-000000?logo=nextdotjs&logoColor=white" alt="Next.js 16" />
    <img src="https://img.shields.io/badge/React_19-61DAFB?logo=react&logoColor=black" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
    <img src="https://img.shields.io/badge/shadcn%2Fui-000000?logo=shadcnui&logoColor=white" alt="shadcn/ui" />
    <img src="https://img.shields.io/badge/Radix_UI-161618?logo=radixui&logoColor=white" alt="Radix UI" />
    <img src="https://img.shields.io/badge/Lucide-F56565?logo=lucide&logoColor=white" alt="Lucide" />
    <img src="https://img.shields.io/badge/TanStack_Query-FF4154?logo=reactquery&logoColor=white" alt="TanStack Query" />
    <img src="https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=white" alt="Axios" />
    <img src="https://img.shields.io/badge/nuqs-000000?logo=nuqs&logoColor=white" alt="nuqs" />
    <img src="https://img.shields.io/badge/React_Hook_Form-EC5990?logo=reacthookform&logoColor=white" alt="React Hook Form" />
    <img src="https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=white" alt="Zod" />
    <img src="https://img.shields.io/badge/date_fns-770C56?logo=datefns&logoColor=white" alt="date-fns" />
    <img src="https://img.shields.io/badge/Recharts-8884D8?logo=recharts&logoColor=white" alt="Recharts" />
    <img src="https://img.shields.io/badge/sonner-000000?logo=sonner&logoColor=white" alt="sonner" />
    <img src="https://img.shields.io/badge/decimal.js-4B5562?logo=decimal-js&logoColor=white" alt="decimal.js" />
    <img src="https://img.shields.io/badge/Turborepo-EF4444?logo=turborepo&logoColor=white" alt="Turborepo" />
    <img src="https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white" alt="pnpm" />
    <img src="https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white" alt="ESLint" />
    <img src="https://img.shields.io/badge/Prettier-F7B93E?logo=prettier&logoColor=black" alt="Prettier" />
</p>

Notable details behind the badges: App Router with RSC and `experimental.authInterrupts`; shadcn/ui
in the `new-york` style on top of Radix UI + Base UI; `next-themes` for dark/light theming;
`tailwind-merge` + `class-variance-authority` + `clsx` for class composition; `react-day-picker`,
`embla-carousel-react`, `vaul`, `react-resizable-panels` for interaction primitives; and
`react-to-print` for printable report exports.

---

## 🏛️ Architecture overview (Feature-Sliced Design)

The codebase follows a **Feature-Sliced Design (FSD)**-inspired layering. Layers depend strictly downward (`app → widgets → features → entities → shared`), which keeps domain features isolated and the UI tree composable.

| Layer        | Responsibility                                                                                          |
| ------------ | ------------------------------------------------------------------------------------------------------- |
| `app/`       | Next.js App Router routes, root layout, global providers, error/auth boundary pages.                    |
| `widgets/`   | Page-level compositions: dashboards, sidebar+layout, landing sections, detail pages, comment threads.   |
| `features/`  | Single user-flow units (create cycle, archive cycle, post comment). Each owns its own `api/model/ui/`.  |
| `entities/`  | Domain primitives by bounded context. Each entity owns its `api/`, `model/` (types, mappers, ctx) and `ui/` (cards, tables, badges). |
| `shared/`    | Cross-cutting code: HTTP client, hooks, utils, the shadcn primitive library, app-wide UI compositions.  |

Inside every `entities/<context>/<entity>/` and `features/<context>/<entity>/<flow>/` slice the same triple appears:

```
api/        # axios call sites + react-query hooks (queries / mutations)
model/      # TS types, zod schemas, mappers, contexts, mocks
ui/         # presentational components specific to the slice
```

---

## 🗂️ Project structure

```
apps/web/
├── components.json          # shadcn/ui config (style: new-york, RSC, Lucide icons)
├── next.config.ts           # transpiles @intra/shared-kernel, enables authInterrupts
├── postcss.config.mjs       # Tailwind v4 PostCSS plugin
├── eslint.config.mjs        # next/core-web-vitals + next/typescript
├── tsconfig.json            # strict TS, baseUrl + extensive path aliases
├── tsconfig.build.json      # build-only TS config
├── next-env.d.ts
├── public/                  # logo, favicons, mock user avatars
└── src/
    ├── app/                 # Next.js App Router
    │   ├── layout.tsx                     # Root: <QueryProvider>, Sonner Toaster
    │   ├── page.tsx                       # Public landing page (composed widgets)
    │   ├── globals.css                    # Tailwind layers + CSS variables
    │   ├── error.tsx / not-found.tsx /
    │   │   forbidden.tsx / unauthorized.tsx  # Next.js boundaries
    │   ├── providers/
    │   │   ├── query-provider.tsx         # React Query client factory (SSR-safe)
    │   │   └── theme-provider.tsx         # next-themes wrapper
    │   ├── (auth)/                        # Route group: signin + Google callback
    │   ├── (error)/                       # Route group: bad-request, conflict, forbidden, not-found, unauthorized
    │   ├── dashboard/                     # /dashboard
    │   ├── profile/                       # /profile
    │   ├── identity/users/                # /identity/users
    │   ├── organisation/{teams,positions}/
    │   ├── library/{clusters,competences,question-templates}/
    │   ├── feedback360/
    │   │   ├── cycles/                    # /feedback360/cycles
    │   │   ├── reviews/                   # /feedback360/reviews
    │   │   └── surveys/{,list,[id]}/      # answering surveys
    │   └── reporting/
    │       ├── individual-reports/{,[id],comments,[id]/comments}
    │       ├── strategic-reports/{,[id]}
    │       └── cluster-score-analytics/
    │
    ├── widgets/             # Page-level compositions
    │   ├── layout/
    │   │   ├── conditional-main-layout.tsx  # Picks public layout vs. authed shell
    │   │   └── main-layout.tsx              # AuthProvider + sidebar + main content
    │   ├── landing/ui/      # Landing page sections (Header, Hero, …, Footer)
    │   ├── dashboard/dashboard-content.tsx
    │   ├── profile/profile-content.tsx
    │   ├── identity/users/
    │   ├── organisation/{team,position}/
    │   ├── library/{cluster,competence,question-template}/
    │   ├── feedback360/{cycle,review,survey}/
    │   └── reporting/{individual-report,strategic-report,cluster-score-analytics,
    │                  individual-report-comment}/
    │
    ├── features/            # User-flow slices
    │   ├── identity/user/
    │   ├── organisation/{team,position}/
    │   ├── library/{cluster,competence,question-template}/
    │   ├── feedback360/
    │   │   ├── cycle/{archive,create,delete,force-finish,form}/
    │   │   ├── review/…
    │   │   └── survey/…
    │   └── reporting/{cluster-score-analytics,individual-report,
    │                  individual-report-comment,strategic-report}/
    │
    ├── entities/            # Domain primitives (types, queries, presentational UI)
    │   ├── identity/user/
    │   ├── organisation/{position,team,team-member}/
    │   ├── library/{cluster,competence,question-template,
    │   │             competence-question-template-relation,
    │   │             position-competence-relation,
    │   │             position-question-template-relation}/
    │   ├── feedback360/{answer,cluster-score,cycle,question,
    │   │                respondent,review,reviewer,survey}/
    │   └── reporting/{cluster-score-analytics,individual-report,
    │                  individual-report-comment,strategic-report}/
    │
    ├── shared/              # Cross-cutting
    │   ├── api/api-client.ts            # Axios instance (Bearer fallback for dev)
    │   ├── components/ui/               # shadcn primitives (~56 components)
    │   ├── ui/                          # App-wide compositions (sidebar, charts,
    │   │                                #   data-table, status-badge, …)
    │   ├── hooks/use-mobile.ts, use-toast.ts
    │   └── lib/
    │       ├── hooks/use-draggable-columns.ts, use-mobile.ts
    │       └── utils/{cn, format-number, calculate-average,
    │                   compare-arrays, get-valid-averages,
    │                   get-user-initials-from-full-name,
    │                   parse-param-to-positive-number, mappers, utils}
```

---

## 🗺️ Routing & pages

The App Router is organised by feature with two unauthenticated route groups.

### Public

| Route                              | Description                                                       |
| ---------------------------------- | ----------------------------------------------------------------- |
| `/`                                | Landing page (Hero, Overview, How it works, Features, Security, CTA, Footer). |
| `/(auth)/signin`                   | Sign-in page (kicks off Google OAuth2 on the API).                |
| `/(auth)/google/callback`          | OAuth2 redirect target; persists the session token client-side.   |
| `/(error)/{bad-request, conflict, forbidden, not-found, unauthorized}` | Friendly error boundary pages. |

### Authenticated

| Route                                                  | Description                                  |
| ------------------------------------------------------ | -------------------------------------------- |
| `/dashboard`                                           | Aggregated overview of cycles, reviews, KPIs.|
| `/profile`                                             | Current user profile.                        |
| `/identity/users`                                      | User directory + role/status management.     |
| `/organisation/teams`                                  | Teams CRUD + memberships.                    |
| `/organisation/positions`                              | Positions + hierarchy + competence mapping.  |
| `/library/clusters`                                    | Competence clusters.                         |
| `/library/competences`                                 | Competences and their question templates.    |
| `/library/question-templates`                          | Reusable question templates.                 |
| `/feedback360/cycles`                                  | Cycle list, filters, lifecycle actions.      |
| `/feedback360/reviews`                                 | Reviews list (per ratee).                    |
| `/feedback360/surveys`                                 | Survey hub.                                  |
| `/feedback360/surveys/list`                            | Surveys assigned to the current respondent.  |
| `/feedback360/surveys/[id]`                            | Answering UI for a single survey.            |
| `/reporting/individual-reports`                        | Individual reports list.                     |
| `/reporting/individual-reports/[id]`                   | Individual report detail with charts.        |
| `/reporting/individual-reports/comments`               | All comments across reports.                 |
| `/reporting/individual-reports/[id]/comments`          | Comments for a single report.                |
| `/reporting/strategic-reports` / `[id]`                | Strategic (cycle-level) reports.             |
| `/reporting/cluster-score-analytics`                   | Cross-cycle competence analytics.            |

The chrome (sidebar + main area) is added by `MainLayout`. `ConditionalMainLayout` swaps it out for the bare layout on `/`, `/signin`, `/signup`, `/google`, `/signout`, so the landing and auth flows render full-bleed.

---

## 🧩 Domain modules

The frontend mirrors the backend's bounded contexts. Each context has matching slices in `entities/`, `features/` and `widgets/`.

### `identity`
Users and authentication context. `entities/identity/user` exposes `auth.api.ts`, `user.api.ts`, the `AuthProvider` context (`model/auth-context.tsx`), role/status badges and the users table.

### `organisation`
Teams, positions and the position hierarchy. Entity slices for `team`, `position` and `team-member`; feature slices wrap CRUD flows.

### `library`
Reusable assessment building blocks: `cluster`, `competence`, `question-template` plus three relation entities (`position-competence`, `position-question-template`, `competence-question-template`) that materialise the many-to-many links from the backend.

### `feedback360`
The largest context: `cycle`, `review`, `respondent`, `reviewer`, `question`, `answer`, `cluster-score`, `survey`. Cycle features include `create`, `form`, `archive`, `delete`, `force-finish`. The survey widgets render the answering experience for a respondent.

### `reporting`
`individual-report`, `individual-report-comment`, `strategic-report`, `cluster-score-analytics`. Widgets compose detail pages with insight cards, competence radar/radial charts, deltas, heatmaps and printable views (`react-to-print`).

---

## 🔄 State management & data fetching

- **Server state.** All backend data flows through `@tanstack/react-query`. A single `QueryClient` is created per browser session (`src/app/providers/query-provider.tsx`); queries default to `staleTime: 30s` and `retry: 1`. The factory is SSR-safe and creates a fresh client for each server render.
- **HTTP client.** `shared/api/api-client.ts` exports a configured `axios` instance with `withCredentials: true`. In the browser, a request interceptor attaches `Authorization: Bearer <session_token>` from `localStorage` — this is required in cross-origin dev environments where `SameSite=Lax` cookies are not forwarded by the browser on XHR/fetch.
- **Per-entity queries.** Every entity owns an `api/<entity>.api.ts` (raw axios calls) and `api/<entity>.queries.ts` (typed `useQuery` / `useMutation` hooks with stable query keys). Mutations invalidate the relevant query keys to keep the UI in sync.
- **URL-driven state.** Filters, pagination and tab state are typed via [`nuqs`](https://nuqs.47ng.com/) so deep links survive refresh and SSR.
- **Local UI state.** `useState`/`useReducer` inside slices; cross-slice context is reserved for auth (`AuthProvider`) and theming (`next-themes`).

---

## 🔐 Authentication

- The authenticated shell is opted in by `MainLayout`, which wraps the page in `<AuthProvider>` (from `entities/identity/user/model/auth-context.tsx`).
- Sign-in flow: `/(auth)/signin` → backend `GET /auth/google` → Google OAuth2 → backend `GET /auth/google/callback` → frontend `/(auth)/google/callback` → token persisted to `localStorage` (`session_token`) and used as Bearer by `apiClient`.
- Next.js `experimental.authInterrupts` is enabled in `next.config.ts`; `forbidden.tsx` and `unauthorized.tsx` at the root render the corresponding interrupt screens, with friendlier error pages under `(error)/`.

---

## 🎨 UI system

- **Primitives:** shadcn/ui (`new-york` style) is installed under `src/shared/components/ui/` — ~56 ready-to-use components (Button, Dialog, Drawer, Sheet, Sidebar, Form, Table, Tabs, Calendar, Combobox, Sonner, Chart wrappers, etc.) on top of Radix UI primitives and `@base-ui/react`.
- **App compositions:** `src/shared/ui/` contains larger, opinionated compositions reused across pages — `app-sidebar`, `data-table`, `table-pagination`, `sortable-table-column-header`, `multi-select`, `date-range-picker`, `status-badge`, `user-badge-with-position`, `error-page-layout`, plus all the analytics charts (`competence-radar-chart`, `competencies-radial-chart(-s-group)`, `competence-bar-chart`, `competence-deltas-bar-chart`, `competence-matrix-heatmap`, `competence-insight-card`, `cluster-distribution-chart`, `corridor-vs-real-rating-chart`, `team-performance-chart`, `cycle-stats-card(s)`, `entity-insight-cards`, `analytics-table-entity-insights`, `statistics-card`, `ratee-horisontal-card`, `avatar-group-list`, `avatar-group-with-count`).
- **Tailwind CSS 4:** configured via PostCSS (`postcss.config.mjs` → `@tailwindcss/postcss`). Design tokens and base layers live in `src/app/globals.css`. `cn` from `@shared/lib/utils/cn` (Tailwind-merge wrapper) is the canonical class-merging helper.
- **Icons:** `lucide-react` (declared as the icon library in `components.json`).
- **Toasts:** `sonner` (`<Toaster richColors position="top-right" />` is mounted once in the root layout).
- **Theming:** `next-themes` is wired through `theme-provider.tsx`; CSS variables in `globals.css` drive light/dark palettes.
- **Responsive helpers:** `useMobile()` (in `shared/hooks` and `shared/lib/hooks`) and `useDraggableColumns()` for table column DnD.

---

## 📝 Forms & validation

Every editable feature uses a `react-hook-form` + `zod` pattern:

- Form state and submission live in `features/<context>/<entity>/<flow>/model/` (types & schemas) and `ui/` (the form component).
- `@hookform/resolvers/zod` bridges schemas into RHF.
- Submission triggers a mutation hook from the corresponding `api/` folder; on success, the relevant React Query keys are invalidated and a `sonner` toast is shown.

---

## 📊 Charts & analytics

Reporting and analytics views combine `recharts` with custom shells in `shared/ui/`:

- `competence-radar-chart` — comparative radar of self vs. respondent groups.
- `competencies-radial-chart(-s-group)` — radial KPI tiles per competence.
- `competence-bar-chart`, `competence-deltas-bar-chart` — bar visualisations including Δ self vs. peers.
- `competence-matrix-heatmap` — competence × cluster matrix.
- `cluster-distribution-chart`, `corridor-vs-real-rating-chart` — distribution & corridor visuals.
- `team-performance-chart` — strategic-report rollups.
- `cycle-stats-card(s)`, `statistics-card`, `entity-insight-cards`, `competence-insight-card` — KPI cards used across dashboards and reports.

Numerical aggregation helpers live in `shared/lib/utils/` (`calculate-average`, `get-valid-averages`, `format-number`); `decimal.js` is used wherever exact rounding matters. `react-to-print` powers printable report exports.

---

## ⚙️ Configuration

| Variable                | Purpose                                                       |
| ----------------------- | ------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`   | Base URL of the `@intra/api` backend. Defaults to `http://localhost:8080` if unset. |
| `NODE_ENV`              | Set automatically by the `env:dev` / `env:test` scripts and by `build` (`production`). |

Environment files are loaded with `dotenv-cli`:

- `pnpm env:dev` → `../../.env.development.local` + `NODE_ENV=development`
- `pnpm env:test` → `../../.env.test` + `NODE_ENV=test`

`NEXT_PUBLIC_*` variables are inlined at build time, so add them before `pnpm build` if you need to point production builds at a non-default API URL.

---

## 📋 Prerequisites

- Node.js (LTS recommended)
- pnpm
- A running `@intra/api` backend (default: `http://localhost:8080`) and PostgreSQL behind it (use `pnpm docker:up` from the repo root)

---

## 📜 Available scripts

All scripts live in `package.json` and can be invoked from the workspace (`pnpm <script> -w @intra/web`) or via Turbo from the repo root.

| Script        | Description                                                          |
| ------------- | -------------------------------------------------------------------- |
| `start:dev`   | `next dev` against `.env.development.local`. Hot reload + Turbopack. |
| `build`       | `NODE_ENV=production next build`. Produces `.next/`.                 |
| `start:prod`  | `next start` (serves the output of `build`).                         |
| `lint`        | `eslint . --cache` (Next + TypeScript configs).                      |
| `format`      | Prettier over all `.ts` / `.tsx` / `.css` / `.js` files.             |
| `env:dev`     | Helper used by `start:dev` to inject the dev env file.               |
| `env:test`    | Same for the test env file.                                          |

---

## 🚀 Running locally

1. Make sure the backend is running and reachable at `NEXT_PUBLIC_API_URL`. From the repo root:
   ```bash
   pnpm docker:up
   pnpm db:refresh           # apply schema + seed
   pnpm start:dev            # starts API and web together via Turbo
   ```
2. To start only the web app:
   ```bash
   pnpm start:dev -w @intra/web
   ```
3. Open [http://localhost:3000](http://localhost:3000). The landing page is public; click **Sign in** to start the Google OAuth2 flow against the backend.

---

## 🧹 Linting & formatting

```bash
pnpm lint -w @intra/web      # eslint . --cache
pnpm format -w @intra/web    # prettier --write
```

ESLint uses `eslint-config-next` (`core-web-vitals` + `typescript`) with `typescript-eslint` services enabled. Prettier is paired with `prettier-plugin-tailwindcss` so Tailwind class lists are auto-sorted.

---

## 📦 Build & production

```bash
pnpm build -w @intra/web
pnpm start:prod -w @intra/web
```

`next build` writes the production bundle to `.next/`. The package transpiles `@intra/shared-kernel` (`next.config.ts`) so workspace types and helpers ship without an extra build step.

For containerised deployments, build with `NEXT_PUBLIC_API_URL` set to the public backend URL — the value is inlined into the client bundle.

---

## 🧭 Path aliases

Defined in `tsconfig.json` and respected by ESLint, Tailwind, and shadcn:

| Alias            | Resolves to               |
| ---------------- | ------------------------- |
| `@/*`            | `src/*`                   |
| `@src/*`         | `src/*`                   |
| `@intra/web`     | `src/*`                   |
| `@public/*`      | `public/*`                |
| `@app/*`         | (Next.js App Router)      |
| `@entities/*`    | `src/entities/*`          |
| `@features/*`    | `src/features/*`          |
| `@widgets/*`     | `src/widgets/*`           |
| `@shared/*`      | `src/shared/*`            |
| `@lib/*`         | `src/lib/*`               |
| `@pages/*`       | `src/pages/*` (reserved)  |

shadcn aliases (`components.json`):

| Alias               | Resolves to                          |
| ------------------- | ------------------------------------ |
| `components` / `ui` | `@/shared/components/ui`             |
| `utils`             | `@/shared/lib/utils/cn`              |
| `lib`               | `@/shared/lib`                       |
| `hooks`             | `@/shared/lib/hooks`                 |

---

© Inessa Repeshko, 2026
