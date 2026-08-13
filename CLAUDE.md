# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo layout — this is a monorepo now (no workspace tooling)

A 2026-08-05 merge turned this from a single frontend repo into three independent npm projects sharing one git repo, with **no** npm workspaces / Turborepo / Lerna gluing them together:

- `dashboard/` — the React app. This used to live at repo root; every path below that previously started `src/…` now starts `dashboard/src/…`, and every command below must run from inside `dashboard/`, not root.
- `backend/` — a real NestJS + Prisma + Postgres API the dashboard now talks to.
- `database/`, `google_sheets/`, `report/`, `docs/` — infra/planning, not application code.

Root `package.json` only has a `gh-pages` devDependency — there is nothing to `npm run` from repo root. **Read `ARCHITECTURE.md` first** for the full picture (Postgres schema, backend endpoints, and — importantly — which fields the frontend still hardcodes because the backend integration is only partial).

## Commands

Run from `dashboard/`:

```bash
npm run dev        # Vite dev server (HMR)
npm run build      # tsc -b (typecheck, noEmit) THEN vite build → dist/
npm run lint       # oxlint (react + typescript + oxc plugins)
npm test           # vitest run (node environment, config in vitest.config.ts)
npm run preview    # serve dist/ locally
npm run deploy     # predeploy runs build, then gh-pages -d dist
```

There are **four** automated gates and all four must be clean: `npx tsc -b`, `npm run lint`, `npm test`, `npm run build`. `tsc -b` is the strictest: `noUnusedLocals`, `noUnusedParameters`, and `erasableSyntaxOnly` are on, so an unused import fails the build.

**Tests are vitest, run in the plain node environment — there is no jsdom, no React Testing Library, and no component rendering.** They live next to what they test as `*.test.ts`:

- `dashboard/src/data/selectors/{aggregates,deltas,labelFlow,contactLog}.test.ts` — the aggregation/period layer, which is where the business rules actually live. (`periods.test.ts` was deleted in the backend-migration pass even though `periods.ts` itself is still there and untested — and the newer `studentFilters.ts`, §business-rules-duplication below, has no test file either.)
- `dashboard/src/components/dashboard/kpiFormat.test.ts` — the pure formatting helpers extracted out of `KpiCard` precisely so they could be tested without a DOM.
- `dashboard/src/data/messageScripts.test.ts` — asserts the Zalo message scripts always mention both attendance and homework numbers. This is load-bearing for the "đóng hộ" (auto-close) rule in `ARCHITECTURE.md` — don't delete it.

If you add logic worth testing, extract it into a pure module (a selector or a formatter) rather than reaching for a DOM testing stack.

Deployment target is GitHub Pages, which is why `dashboard/vite.config.ts` sets `base: '/Izone-label-dashboard/'`. Do not remove that base — assets 404 on Pages without it. Note the deployed build's API base URL is currently **hardcoded to `http://localhost:3000/api`** in `dashboard/src/api/client.ts` — it will not reach a real backend from a Pages deploy until that's made configurable.

For the backend (`backend/`, NestJS + Prisma): `npm run start:dev` for a watch-mode server, `npm run build`/`start:prod` to run compiled. No `migrate`/`seed` npm script exists — seeding is ad hoc via `node backend/seed.js` against a hardcoded local connection string. See `ARCHITECTURE.md` §1/§3 before touching `backend/prisma/schema.prisma` or adding an endpoint.

## What this app is

An internal IZONE (Vietnamese English-language center) dashboard for **student labeling & early warning**. It surfaces at-risk students to two audiences via one SPA:

- **Lead Khối Dashboard** (`activeTab === 'lead'`) — cross-class aggregate KPIs, label distribution, drill-down into a class.
- **Teacher / class view** (`activeTab === 'teacher'`) — one class's student roster, "30-second intervention" cards, per-student detail.

UI copy is Vietnamese; code identifiers are English. Keep that split.

## Architecture

**No longer a frontend-only mock prototype.** `dashboard/` now calls a real backend (`backend/`, NestJS + Prisma + Postgres) over axios. `dashboard/src/data/mockData.ts` and its whole generator subsystem (`data/generator/*`, `data/contactStore.ts`) were deleted outright in the backend-integration pass — there is no offline/demo fallback anymore. See `ARCHITECTURE.md` §0/§4 for the full current-vs-target picture; the short version is: the backend and schema are real, but there is still no real data-ingestion pipeline behind them (everything in Postgres today is synthetic seed data), and the frontend's API mapper (`dashboard/src/api/client.ts`) currently hardcodes several "smart" fields (`riskScore`, `healthScore`, `isAlarmTriggered`, pass-mềm status, cheating flags) to `0`/`false` even where the backend already returns real values for some of them — check that table in `ARCHITECTURE.md` §4 before assuming a field on `StudentDetail`/`ClassSummary` reflects live data.

- `dashboard/src/App.tsx` is still the single stateful component, now larger: on top of the original `selectedClass`, `activeTab`, `tableFilter`, `isDarkMode`, and modal flags, it owns `currentUser`, `isLoading`, `classes`, `students`, `labelEvents`, `contactLogs` — all fetched via API effects. Still no context, no store, no router (despite `zustand`/`@tanstack/react-query` sitting in `package.json` unused — see below). A login gate (`currentUser` truthy) now sits in front of the same tab-state dashboard shell; there is no router, just a boolean check in `App.tsx`.
- `dashboard/src/data/types.ts` is the **schema contract** now (mockData.ts is gone, but it re-exported these same interfaces before deletion, so the contract didn't change shape). Treat these types as the integration contract with the backend.

  **Read `ARCHITECTURE.md` before touching these types, `dashboard/src/api/client.ts`'s mappers, or any business threshold.** It documents the real Postgres schema (`backend/prisma/schema.prisma`), the verified labeling / pass-chuẩn / pass-mềm rules and where their thresholds live (`system_configs` table), field-by-field mapping from DB columns to these TS interfaces, and — critically — the full list of fields the API client currently fakes instead of reading from the response.
- Components are presentational and take data + callbacks. `common/Header.tsx`, `dashboard/TopRibbon.tsx`, `dashboard/StudentTable.tsx`, `dashboard/LeadDashboard.tsx`, `modals/ZaloRemindModal.tsx`, `auth/Login.tsx` (new).
- Charts are **recharts** (sparklines in `StudentTable`, stacked bar + timeline in `LeadDashboard`).

### Known dead code — don't assume it's wired up

- `modals/CallParentModal.tsx` and `review/ReviewCenter.tsx` are **fully deleted**, not just unmounted (commits `319bc24`, `3ac769b`). If asked to bring either back, it's a rewrite, not a remount — same for the now-orphaned `PendingReviewEnriched` type in `data/types.ts`, which has no consumer left.
- `dashboard/src/App.css` (184 lines) is **still never imported**. Only `src/index.css` is, via `main.tsx`.
- These dependencies are installed but **completely unused**: `@tanstack/react-query`, `@tanstack/react-table`, `zustand`, `clsx`, `tailwind-merge`. Their presence is not evidence of a pattern to follow — `StudentTable` is a hand-rolled table, not a TanStack Table, and API state is plain `useState` in `App.tsx`, not react-query.
- `@/*` → `./src/*` alias is configured in `vite.config.ts`, but **still no file uses it**; all imports remain relative.

### Business rules that are duplicated (edit all sites together)

The old "urgent student" predicate (`suggestedAction === 'call_parent' || currentLabel === 'red' || attendance < 80`) is **gone, deliberately** — not merely deduplicated. It's been redesigned into three non-overlapping, single-criterion predicates in `dashboard/src/data/selectors/studentFilters.ts` (`isHabitReminderStudent`, `isRedFollowUpStudent`, `isRelearnAdviceStudent`), with extensive doc-comments explaining why a red label is no longer treated as "urgent." See `ARCHITECTURE.md` §5/§6 before changing these — they're referenced by section number from the code comments themselves.

The "pass" filter (`passChuanStatus === 'Có khả năng pass' || passMemStatus === 'Đạt pass mềm'`) is still duplicated — now **three times within `StudentTable.tsx` alone** (a filter predicate, a count badge, and a slightly different badge-rendering check that also matches `'Đạt tiêu chuẩn'`). There is no shared selectors module for this one — if you touch one site, grep for the other two.

Threshold coloring (`>= 80` emerald / `>= 70` amber / else brand red) is likewise inlined per metric in `App.tsx`'s sidebar.

**Lead Dashboard aggregate filters (backend, `backend/src/dashboards/dashboards.service.ts`) are three non-negotiable conditions repeated across four raw SQL queries** — `snapshot_stage IS NULL`, `s.registration_status = 'on_going'`, and (implicitly, via `COUNT`/`AVG` semantics) excluding `NULL` attendance/homework rows from denominators while keeping `0%`. Drop any one of them from a new or edited query and the Lead KPIs silently go wrong again — see `ARCHITECTURE.md` §1 "Hai hạt trộn trong `student_daily_records`" for why. The `registration_status = 'on_going'` condition is itself a duplicate of a rule that already exists as `effectiveRegistrationStatus()` (`dashboards.service.ts`) — "a `queuing` student in an `on_going` class counts as dropped" — but that helper is only wired into the Teacher dashboard query path; the Lead query path re-implements the simpler `= 'on_going'` check directly in SQL instead of calling it. If the two ever need to agree on edge cases (e.g. `on_hold`, `transferred`), update both.

`contactCoverageByClass` (`backend/src/dashboards/contact-coverage.ts`) deliberately does **not** port the frontend's `COVERED_BY` cross-trigger "đóng hộ" rule (`dashboard/src/data/selectors/contactLog.ts`) — it counts one episode per student because `classifyStudent` (`labeling-engine.ts`) already puts each student in exactly one `interventionLevel`, so the three trigger groups are mutually exclusive today. If the business ever allows a student to open multiple simultaneous triggers, `COVERED_BY` MUST be ported into `contact-coverage.ts` or the Lead's contact-coverage numbers will silently diverge from what the Teacher dashboard shows for the same students.

## Domain glossary

Needed to read the code at all:

| Term | Meaning |
|---|---|
| Label (`red` / `yellow` / `grey` / `no_data`) | Student risk label; `labelDistribution` aggregates it per class |
| `netMomentum` | Net label movement (up-transitions minus down-transitions) between checkpoints. **The KPI card is gone from the UI** (`KpiRow.tsx`, dropped 2026-08-13 — too few transitions in a real reporting period to be actionable) but the field is still in the Lead Dashboard API contract (`kpis.netMomentum`), unchanged, so nothing downstream breaks. On real data it now resolves to `null` (not `0`) every time: the query that feeds it filters to `snapshot_stage IS NULL` (see the Lead aggregate filters note above), and every row with a real label transition lives on a `snapshot_stage` row instead — so the live-only query always sees zero transitions. Don't "fix" this by dropping the filter; that reintroduces the double-counting bug the filter exists to prevent. |
| **Pass chuẩn** | "Standard pass" — hard course output criteria (`passChuanStatus`, `passChuanRate`) |
| **Pass mềm** | "Soft pass" — teacher-reviewable exception path, bucketed into `Nhóm 1/2/3` (`passMemStatus`, `passMemGroup`) |
| `isEligibleForReview` / `reviewStatus` | Backend model (`pass_reviews` table, real endpoints exist) for the teacher-approval workflow: `Chờ GV` → `GV Đồng ý` / `GV Từ chối` / `Quá hạn → Lead`. The old Review Center *UI* that surfaced this is deleted, and the API client currently hardcodes both fields to `false`/`''` regardless of what the backend has — see `ARCHITECTURE.md` §4 |
| **BTVN** | Bài tập về nhà = homework (`homework.percentage`) |
| **GVCN** | Giáo viên chủ nhiệm = homeroom teacher |
| `riskScore` | Nominally 0–100, meant to drive the default descending sort of the student table — but the API client currently hardcodes it to `0` for every student (`ARCHITECTURE.md` §4), so sort order is not actually risk-based right now |
| Zalo | Vietnamese messaging app; `ZaloRemindModal` generates copy-paste **student**-reminder scripts (not parent — the call-parent flow was removed, Zalo-to-student is now the only channel) |

`ZaloRemindModal` generates **Vietnamese message scripts** to `navigator.clipboard`. When editing it, the copy is real operator-facing text — keep the tone and the `${teacherName}` / `${className}` interpolation intact.

## Styling conventions

Tailwind **v4** via the `@tailwindcss/vite` plugin. There is **no `tailwind.config.js`** — all configuration lives in `dashboard/src/index.css`:

- `@theme { ... }` defines tokens (`--color-primary: #db0829`, label colors, `--font-heading: 'Geologica'` loaded from Google Fonts in `index.html`).
- `@custom-variant dark (&:where(.dark, .dark *))` enables **class-based** dark mode. `App.tsx` toggles `.dark` on `document.documentElement` in a `useEffect` (needed for `body`/global rules) *and* applies it on the root `<div>`. Both are load-bearing; removing the `useEffect` breaks global dark styles.

**Components do not use the `@theme` tokens.** They hardcode hex literals with explicit `dark:` pairs. Match the existing palette exactly rather than introducing new colors or switching to token classes mid-file:

| Role | Light | Dark |
|---|---|---|
| Brand (IZONE red) | `#DB0829` | same |
| Page background | `#f3f4f6` | `#18181b` |
| Surface / card | `white` | `#27272a` |
| Border | `#f3f4f6` | `#3f3f46` |
| Text primary | `#404040` | `#e4e4e7` |
| Text muted | `#404040/60–70` | `#a1a1aa` |

Radii are literal (`rounded-[8px]`, `rounded-[12px]`, `rounded-[16px]`), not the Tailwind scale. Semantic status colors use Tailwind's `emerald` / `amber` / `red` scales.

Recent history (`e84c649` "Giảm nhiệt thị giác", `34a65ac`, `9cb0240`) is a deliberate push toward *lower visual heat*: flat surfaces, thin 1px borders, minimal shadows, no gradients. Don't reintroduce heavy shadows or saturated fills.

The layout is a fixed sidebar + scrollable main; the sidebar becomes an off-canvas drawer below the `xl` breakpoint (`isMobileMenuOpen`).
