# Intra Shared Kernel

Pure TypeScript **shared kernel** for the Intra 360° Feedback monorepo. The package contains the building blocks that must be in lock-step between the backend (`@intra/api`) and the frontend (`@intra/web`): wire-format DTOs, enums, validation constraints, and a tiny set of pure business rules.

It is intentionally **dependency-free at runtime** (the only production dependency is `decimal.js`) — no NestJS, React, Prisma, axios or any framework code lives here. That guarantees both apps see the same shapes and rules at compile time, with zero risk of one side drifting.

---

## Table of contents

- [Tech stack](#tech-stack)
- [Why a shared kernel?](#why-a-shared-kernel)
- [Project structure](#project-structure)
- [Naming & conventions](#naming--conventions)
- [Module overview](#module-overview)
  - [Common](#common)
  - [Identity](#identity)
  - [Organisation](#organisation)
  - [Library](#library)
  - [Feedback360](#feedback360)
  - [Reporting](#reporting)
  - [Auth](#auth)
- [Public API](#public-api)
- [Available scripts](#available-scripts)
- [Usage from other packages](#usage-from-other-packages)
- [Path aliases](#path-aliases)

---

## Tech stack

| Area              | Technology                                                          |
| ----------------- | ------------------------------------------------------------------- |
| Language          | TypeScript 5 (strict)                                               |
| Build             | `tsc` → `dist/` (ESM/CJS-safe single entrypoint)                    |
| Numeric precision | `decimal.js` (used in reporting accumulator types)                  |
| Lint / format     | ESLint + Prettier (configured at the monorepo root)                 |

---

## Why a shared kernel?

In a Domain-Driven Design sense, the **shared kernel** is the small, carefully curated set of types and rules that two bounded contexts agree to share verbatim. In this monorepo it solves three concrete problems:

1. **Wire-format parity.** The backend serialises domain models into HTTP responses; the frontend deserialises them. Both sides import the same `*Dto` / `*ResponseDto` interfaces, so the request/response contract is type-checked end-to-end.
2. **Single source for enums.** `IdentityRole`, `CycleStage`, `ReviewStage`, `RespondentCategory`, `CommentSentiment` etc. are declared once and imported by both apps (and indirectly mirrored by the Prisma schema's enums).
3. **Business rules and constraints in one place.** Validation lengths (`USER_CONSTRAINTS.NAME.LENGTH.MAX`), the anonymity threshold (`CYCLE_CONSTRAINTS.ANONYMITY_THRESHOLD.MIN`), the score range, etc. — all live in one file each, so changing a rule changes both sides.

Anything domain-specific that is **not** shared between the two apps belongs in `@intra/api` or `@intra/web`, not here.

---

## Project structure

```
packages/shared-kernel/
├── package.json          # main/types: ./dist/index.{js,d.ts}; only dep: decimal.js
├── tsconfig.json         # outDir: dist, declaration + sourceMap
├── dist/                 # Compiled output (generated)
└── src/
    ├── index.ts          # Single barrel — the package's entire public API
    ├── common/
    │   ├── constants/constants.ts          # SYSTEM_ACTOR
    │   ├── constraints/global.constraints.ts  # GLOBAL_CONSTRAINTS (title/desc/score/percentage/full_name/anonymity)
    │   └── enums/sort-direction.enum.ts    # SortDirection (asc/desc)
    ├── auth/
    │   └── dto/auth-dto.interface.ts       # AuthUser, AuthSession, AuthDto
    ├── identity/
    │   ├── constraints/{role,user}.constraints.ts
    │   ├── dto/role/role-dto.interface.ts
    │   ├── dto/user/{user-dto.interface, create-user-payload, update-user-payload, user-search-query}.ts
    │   └── enums/{identity-role, identity-status, user-sort-field}.enum.ts
    ├── organisation/
    │   ├── constraints/{position,team}.constraints.ts
    │   ├── dto/
    │   │   ├── position/{position-dto.interface, create-…, update-…, position-search-query}
    │   │   ├── team/{team-dto.interface, create-…, update-…, team-search-query}
    │   │   └── team-member/{team-member-dto.interface, add-member-payload}
    │   └── enums/{position-sort-field, team-sort-field}.enum.ts
    ├── library/
    │   ├── constraints/{cluster,competence,question}.constraints.ts
    │   ├── dto/
    │   │   ├── cluster/{cluster-dto.interface, create-…, update-…, cluster-search-query}
    │   │   ├── competence/{competence-dto.interface, create-…, update-…, competence-search-query}
    │   │   └── question-template/{question-template-dto.interface, create-…, update-…, question-template-search-query}
    │   └── enums/{answer-type, question-template-status, *-sort-field}.enum.ts
    ├── feedback360/
    │   ├── constraints/{answer, cluster-score, cluster-score-analytics,
    │   │                 cycle, question, respondent,
    │   │                 review, review-question-relation, reviewer}.constraints.ts
    │   ├── dto/
    │   │   ├── answer/{answer-dto.interface, create-…, answer-search-query}
    │   │   ├── cluster-score/{cluster-score-dto.interface,
    │   │   │                  cluster-score-with-relations-dto.interface,
    │   │   │                  upsert-cluster-score-payload, cluster-score-search-query}
    │   │   ├── cluster-score-analytics/{…-dto.interface, upsert-…, update-…, …-search-query}
    │   │   ├── cycle/{cycle-dto.interface, create-…, update-…, cycle-search-query}
    │   │   ├── question/{question-dto.interface, create-…, add-question-to-review-payload, question-search-query}
    │   │   ├── respondent/{respondent-dto.interface, add-…, update-…, respondent-search-query}
    │   │   ├── review/{review-dto.interface, create-…, update-…, review-search-query}
    │   │   ├── reviewer/{reviewer-dto.interface, add-…, reviewer-search-query}
    │   │   └── review-qiestion-relation/{…-dto.interface, …-search-query}
    │   ├── enums/{cycle-stage, review-stage, response-status,
    │   │           respondent-category, *-sort-field}.enum.ts
    │   └── rules/anonymity.rules.ts        # isAnonymityThresholdMet(responses, threshold?)
    └── reporting/
        ├── constraints/{report, report-analytics,
        │                 report-comments, report-insights}.constraints.ts
        ├── dto/
        │   ├── analytics/{report-analytics-dto.interface, report-analytics-search-query}
        │   ├── strategic-analytics/{strategic-analytics-dto.interface,
        │   │                         strategic-report-analytics-search-query}
        │   ├── strategic-report/{strategic-report-dto.interface,
        │   │                      strategic-report-insight-dto.interface,
        │   │                      strategic-report-search-query}
        │   ├── report/{report-dto.interface, report-insight-dto.interface, report-search-query,
        │   │            competence/{report-competence-summary-dto.interface, competence-accumulator},
        │   │            question/{report-question-summary-dto.interface, question-accumulator}}
        │   ├── report-comments/{report-comment-dto.interface, create-report-comment-payload}
        │   ├── report-text-answers/report-text-answer-dto.interface
        │   ├── entity-average-insight-dto.interface.ts
        │   ├── entity-insight-summary-dto.interface.ts
        │   ├── entity-summary-metrics-dto.interface.ts
        │   ├── entity-summary-totals.type.ts
        │   └── report-entity-summary-totals-dto.interface.ts
        └── enums/{comment-sentiment, entity-type, insight-type,
                    report-sort-field, report-analytics-sort-field,
                    strategic-report-sort-field, strategic-report-analytics-sort-field}.enum.ts
```

---

## Naming & conventions

Every domain area follows the same conventions, which makes the package predictable to navigate.

### File suffixes
- `*-dto.interface.ts` — the canonical wire-format interface for an entity. Almost always declared as a generic `XBaseDto<TDate>` plus two aliases:
  - `XDto = XBaseDto<Date>` — server-side shape (dates as `Date`).
  - `XResponseDto = XBaseDto<string>` — JSON-serialised shape (dates as ISO strings).
- `create-*-payload.type.ts`, `update-*-payload.type.ts`, `add-*-payload.type.ts`, `upsert-*-payload.type.ts` — request bodies for create / update / add-member / upsert flows.
- `*-search-query.type.ts` — query-string filters for list endpoints (pagination, sort field/direction, free-text filters).
- `*.constraints.ts` — `const` objects with `LENGTH.MIN/MAX`, `PATTERN`, numeric ranges, etc., used by both `class-validator` decorators on the API and by `zod` schemas on the web.
- `*.enum.ts` — a TypeScript `enum` plus a sibling `XS = Object.values(X)` array, useful for runtime iteration / `zod.nativeEnum` / Swagger.
- `*.rules.ts` — pure functions that encode invariants (e.g. `isAnonymityThresholdMet`).

### Layering
- No imports from `@intra/api`, `@intra/web` or `@intra/database`. The only allowed cross-imports are intra-package (e.g. `feedback360/rules/*.ts` re-using `feedback360/constraints/*.ts`, or any constraint file pulling from `common/constraints/global.constraints.ts`).
- No NestJS / React / decorators / runtime validators here — those live with their consumers.

### Generic date typing
Most DTO interfaces are generic in their date type:

```ts
export interface UserBaseDto<TDate = Date> { /* … */ createdAt: TDate; updatedAt: TDate; }
export type UserDto         = UserBaseDto<Date>;
export type UserResponseDto = UserBaseDto<string>;
```

The backend works with `Date`, the frontend with serialised ISO strings — same shape, different temporal type.

---

## Module overview

### Common

- **`SYSTEM_ACTOR`** (`{ ID: 0, NAME: 'System' }`) — used as the actor in stage history rows for automated transitions (e.g. the cycle scheduler).
- **`GLOBAL_CONSTRAINTS`** — the cross-context numeric/length defaults: `TITLE.LENGTH` (1–255), `DESCRIPTION.LENGTH` (1–1000), `FULL_NAME.LENGTH` (1–302), `SCORE` (0–5), `PERCENTAGE` (0–100), `ANONYMITY_THRESHOLD.MIN` (3). Other contexts compose their own constraints on top of these.
- **`SortDirection`** — `ASC` / `DESC`, the standard direction enum used by every `*SearchQuery`.

### Identity

- **Constraints:** `USER_CONSTRAINTS` (NAME / FULL_NAME / EMAIL — lengths and Latin-letter regex patterns), `ROLE_CONSTRAINTS`.
- **Enums:** `IdentityRole` (`ADMIN`, `HR`, `MANAGER`, `EMPLOYEE`), `IdentityStatus` (`ACTIVE`, `INACTIVE`), `UserSortField`.
- **DTOs:** `RoleDto`, `UserDto`/`UserResponseDto`, `CreateUserPayload`, `UpdateUserPayload`, `UserSearchQuery`.

### Organisation

- **Constraints:** `POSITION_CONSTRAINTS`, `TEAM_CONSTRAINTS`.
- **Enums:** `PositionSortField`, `TeamSortField` (and their `*_SORT_FIELDS` arrays).
- **DTOs:** `PositionDto/ResponseDto` + `Create…/Update…/…SearchQuery`, `TeamDto/ResponseDto` + `Create…/Update…/…SearchQuery`, `TeamMemberDto/ResponseDto` + `AddTeamMemberPayload`.

### Library

Reusable assessment building blocks — clusters, competences, question templates.

- **Constraints:** `CLUSTER_CONSTRAINTS`, `COMPETENCE_CONSTRAINTS`, `QUESTION_TEMPLATE_CONSTRAINTS`.
- **Enums:** `AnswerType`, `QuestionTemplateStatus`, `ClusterSortField`, `CompetenceSortField`, `QuestionTemplateSortField`.
- **DTOs:** `Cluster*`, `Competence*`, `QuestionTemplate*` (the same `*Dto` / `*ResponseDto` / `Create*Payload` / `Update*Payload` / `*SearchQuery` quintuple for each entity).

### Feedback360

The most data-heavy context — cycles, reviews, respondents, questions and scores.

- **Constraints (one per aggregate):** `CYCLE_CONSTRAINTS`, `REVIEW_CONSTRAINTS`, `QUESTION_CONSTRAINTS`, `ANSWER_CONSTRAINTS`, `RESPONDENT_CONSTRAINTS`, `REVIEWER_CONSTRAINTS`, `REVIEW_QUESTION_RELATION_CONSTRAINTS`, `CLUSTER_SCORE_CONSTRAINTS`, `CLUSTER_SCORE_ANALYTICS_CONSTRAINTS`.
- **Enums:** `CycleStage`, `ReviewStage`, `ResponseStatus`, `RespondentCategory`, plus all `*SortField` variants.
- **Rules:** `isAnonymityThresholdMet(responses, threshold?)` — single source for the "show aggregated answers only if at least N respondents answered" guarantee. Defaults to `CYCLE_CONSTRAINTS.ANONYMITY_THRESHOLD.MIN`.
- **DTOs:** the full lifecycle for cycles, reviews, questions, answers, respondents, reviewers, review-question relations, cluster scores (including `ClusterScoreWithRelationsDto`) and cluster-score analytics — each with its `Create…/Update…/Add…/Upsert…/…SearchQuery` companions where applicable.

### Reporting

Materialised reports, analytics, comments and insights.

- **Constraints:** `REPORT_CONSTRAINTS`, `REPORT_ANALYTICS_CONSTRAINTS`, `REPORT_COMMENT_CONSTRAINTS`, `REPORT_INSIGHTS_CONSTRAINTS`.
- **Enums:** `EntityType`, `CommentSentiment`, `InsightType`, `ReportSortField`, `ReportAnalyticsSortField`, `StrategicReportSortField`, `StrategicReportAnalyticsSortField` (the `_SOFT_FIELDS` array names follow the existing codebase).
- **DTOs:**
  - Individual: `ReportDto/ResponseDto`, `ReportSearchQuery`, `ReportInsightDto/ResponseDto`, `ReportAnalyticsDto/ResponseDto`, `ReportAnalyticsSearchQuery`, `ReportCommentDto/ResponseDto`, `CreateReportCommentPayload`, `ReportTextAnswerDto`.
  - Per-competence / per-question summaries: `ReportCompetenceSummaryDto`, `ReportQuestionSummaryDto`, plus `CompetenceAccumulator` and `QuestionAccumulator` accumulator types used while building reports.
  - Strategic: `StrategicReportDto/ResponseDto`, `StrategicReportSearchQuery`, `StrategicReportAnalyticsDto/ResponseDto`, `StrategicReportAnalyticsSearchQuery`, `StrategicReportInsightDto/ResponseDto`.
  - Cross-cutting helpers: `EntityAverageInsightsDto`, `EntityInsightSummaryDto`, `EntitySummaryMetricsDto`, `EntitySummaryTotals`, `ReportEntitySummaryTotalsDto`.

### Auth

Auth surface mirrored from Better Auth, kept here so the frontend can type the session it persists in `localStorage` and the backend can shape its responses identically.

- `AuthUser`, `AuthSession` (with `token`, `user`, `redirect`), `AuthDto` (`{ userId: number; session: AuthSession }`).

---

## Public API

Everything the package exposes is re-exported from `src/index.ts`, in this order: `common` → `organisation` → `identity` → `library` → `feedback360` → `reporting` → `auth`. Some highlights:

```ts
// Constants & enums
export { SYSTEM_ACTOR } from './common/constants/constants';
export { SortDirection } from './common/enums/sort-direction.enum';
export { IDENTITY_ROLES, IdentityRole } from './identity/enums/identity-role.enum';
export { IDENTITY_STATUSES, IdentityStatus } from './identity/enums/identity-status.enum';
export { CYCLE_STAGES, CycleStage } from './feedback360/enums/cycle-stage.enum';
export { REVIEW_STAGES, ReviewStage } from './feedback360/enums/review-stage.enum';
export { RESPONSE_STATUSES, ResponseStatus } from './feedback360/enums/response-status.enum';
export { RESPONDENT_CATEGORIES, RespondentCategory } from './feedback360/enums/respondent-category.enum';
export { ANSWER_TYPES, AnswerType } from './library/enums/answer-type.enum';
export { COMMENT_SENTIMENTS, CommentSentiment } from './reporting/enums/comment-sentiment.enum';
export { ENTITY_TYPES, EntityType } from './reporting/enums/entity-type.enum';
export { INSIGHT_TYPES, InsightType } from './reporting/enums/insight-type.enum';

// Constraints
export { USER_CONSTRAINTS } from './identity/constraints/user.constraints';
export { CYCLE_CONSTRAINTS } from './feedback360/constraints/cycle.constraints';
// … one per aggregate, see src/index.ts for the full list

// Rules
export { isAnonymityThresholdMet } from './feedback360/rules/anonymity.rules';

// DTOs (type-only)
export type { UserDto, UserResponseDto } from './identity/dto/user/user-dto.interface';
export type { CycleDto, CycleResponseDto } from './feedback360/dto/cycle/cycle-dto.interface';
export type { ReportDto, ReportResponseDto } from './reporting/dto/report/report-dto.interface';
export type { AuthDto, AuthSession, AuthUser } from './auth/dto/auth-dto.interface';
// … and many more
```

The barrel pattern keeps imports flat for consumers:

```ts
import { CycleStage, USER_CONSTRAINTS, isAnonymityThresholdMet, type UserDto } from '@intra/shared-kernel';
```

---

## Available scripts

| Script      | Description                                                  |
| ----------- | ------------------------------------------------------------ |
| `build`     | `tsc` — compiles `src/` to `dist/` (with `.d.ts` and source maps). |
| `typecheck` | `tsc --noEmit` — type-only verification, used in CI.         |
| `format`    | `prettier --write "src/**/*.ts"`.                            |
| `lint`      | `eslint "src/**/*.ts"`.                                      |

Run from the workspace (`pnpm <script> -w @intra/shared-kernel`) or via Turbo from the repo root.

---

## Usage from other packages

Add a workspace dependency and import directly from the package root:

```jsonc
// package.json of a consumer
"dependencies": {
  "@intra/shared-kernel": "workspace:*"
}
```

```ts
import {
    IdentityRole,
    CycleStage,
    USER_CONSTRAINTS,
    CYCLE_CONSTRAINTS,
    isAnonymityThresholdMet,
    type UserDto,
    type UserResponseDto,
    type CreateCyclePayload,
    type ReportResponseDto,
} from '@intra/shared-kernel';
```

Specifically:

- **`@intra/api`** uses the constraints in `class-validator` decorators (`@MaxLength(USER_CONSTRAINTS.NAME.LENGTH.MAX)`), the enums in DTOs and Swagger docs, and the rules in domain services.
- **`@intra/web`** uses the same enums in TypeScript types and `zod.nativeEnum`, the constraints in `zod` schemas to mirror the backend's validation, and the response DTOs to type React Query results.
- **`@intra/database`** does not import the shared kernel at runtime — its enums are re-declared in `schema.prisma` and kept in sync by convention. The shared kernel, however, mirrors the Prisma enum string values exactly.

The Next.js frontend transpiles this package on-the-fly (`transpilePackages: ['@intra/shared-kernel']` in `apps/web/next.config.ts`), so you can also import the source directly during development without rebuilding.

---

## Path aliases

`tsconfig.json` defines:

| Alias                       | Resolves to       |
| --------------------------- | ----------------- |
| `src/*`                     | `src/*`           |
| `@intra/shared-kernel`      | `src/index.ts`    |
| `@intra/shared-kernel/*`    | `src/*`           |

External consumers use the package's `exports` map (`./dist/index.js` / `./dist/index.d.ts`) and never reach into `dist/` or `src/` subpaths directly.

---

© Inessa Repeshko, 2026
