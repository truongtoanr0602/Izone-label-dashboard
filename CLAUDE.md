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

**Read `ARCHITECTURE.md` before touching these types, `dashboard/src/api/client.ts`'s mappers, or any business threshold.** It documents the real Postgres schema (`backend/prisma/schema.prisma`), the verified labeling / pass-chuẩn / pass-mềm rules and where their thresholds live (`system_configs` table), field-by-field mapping from DB columns to these TS interfaces, and — critically — the full list of fields the API client currently fakes instead of reading from the response.
- Components are presentational and take data + callbacks. `common/Header.tsx`, `dashboard/TopRibbon.tsx`, `dashboard/StudentTable.tsx`, `dashboard/LeadDashboard.tsx`, `modals/ZaloRemindModal.tsx`, `auth/Login.tsx` (new).
- Charts are **recharts** (sparklines in `StudentTable`, stacked bar + timeline in `LeadDashboard`).

### Business rules that are duplicated (edit all sites together)

Several rules (urgent-student predicates in `studentFilters.ts`, the "pass" filter tripled in `StudentTable.tsx`, threshold coloring in `App.tsx`, the three-condition Lead SQL filter repeated across `studentMetricRows`/`transitionRows`/`coverageStudentRows`, contact-coverage checkpoint logic, and Test-only label thresholds) exist in multiple places and must be edited together. Full detail — file-by-file, with the reasoning for each — is kept in the assistant's project memory (`izone-duplicated-business-rules`) rather than here; ask Claude to recall it, or see `ARCHITECTURE.md` §1/§2/§5/§6 for the underlying business rules.

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

See [`Design.md`](Design.md) before touching any component's classes or restyling anything — Tailwind v4 setup, the hardcoded color palette (light/dark), radii, and visual-weight conventions all live there.

## Skills

This repo has task-specific skills under `.claude/skills/` that wrap the code-review-graph MCP tools below into a repo-aware workflow — prefer invoking one of these over hand-rolling the same graph-tool sequence when the task matches:

| Skill | Use for |
|---|---|
| `code` | Building a new feature, component, endpoint, or function — the from-scratch counterpart to `debug-issue`. Walks orient (graph tools, `ARCHITECTURE.md` §4 hardcoded-fields, duplicated-rule sites) → plan → implement → the four gates → a bounded fix loop, tuned to this repo's no-workspace-tooling layout and DOM-less vitest setup. |
| `debug-issue` | Investigating a bug, a wrong-looking KPI/label/count, a field that's suspiciously always `0`/`false`/empty, a Lead-vs-Teacher mismatch, or a failing `tsc`/`lint`/`test`/`build` gate. Encodes this repo's actual known hazards as a symptom→hotspot table — the `client.ts` hardcoded-fields table, the three-condition Lead SQL filter repeated across `studentMetricRows`/`transitionRows`/`coverageStudentRows`, the triple-duplicated pass filter in `StudentTable.tsx` — so read it before concluding something is a new bug. |
| `explore-codebase` | Getting oriented in an unfamiliar part of the repo before changing it — architecture overview, module boundaries, execution flows. |
| `refactor-safely` | Planning a rename, dead-code removal, or restructure — previews blast radius via the graph before files are touched. |
| `review-changes` | Structured review of a diff using change detection + impact radius instead of re-reading whole files. |
| `sync-docs` (`.claude/skills/sync-docs/SKILL.md`) | `CLAUDE.md`/`ARCHITECTURE.md` may have drifted from the codebase since they were last synced (new/removed modules, dead code that came back, newly-duplicated business logic). Finds and closes that gap with structural graph analysis, edits narrowly, and logs the run under `.claude/memory/`. It's a periodic sync, not a substitute for updating docs as part of a PR that already knows what it changed. |
| `deploy-vps` (`.claude/skills/deploy-vps/SKILL.md`) | Deploying the latest `backend`/`dashboard` code to the production VPS (`izone_vps`, Docker Compose). Confirms `origin/main` actually has what's meant to ship, rereads `.claude/agents/memory/debug/` for known deploy pitfalls (wrong compose project directory, `depends_on: postgres` cascade, `nest build` output-path drift, SPA-fallback masking a broken asset path), deploys, then logs anything new that broke. |

<!-- code-review-graph MCP tools -->
## Tool priority order

When exploring or reasoning about this codebase, work through these in order and only fall through to the next one when the current tier doesn't cover what you need:

1. **code-review-graph MCP tools** — structural code questions (callers, dependents, impact radius, test coverage, architecture). See below.
2. **agentmemory** (`recall` / `memory_smart_search` / other `mcp__agentmemory__*` tools) — prior decisions, business-rule rationale, VPS/DB state, and other non-derivable context from past sessions (e.g. the duplicated-business-rules writeup, VPS credentials, DB schema ERD, ingestion decisions). Prefer this over re-deriving something from git history or asking the user again.
3. **context-mode** (`ctx_batch_execute` / `ctx_search` / `ctx_execute*`) — processing/searching large command output, file contents, or fetched docs without pulling raw bytes into the conversation.
4. **Grep/Glob/Read built-ins** — last resort, when none of the above cover it (e.g. a one-off file that isn't in the graph or memory, or you need exact bytes to hand to `Edit`).

## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

If the graph doesn't cover it, check **agentmemory** (`recall`/`memory_smart_search`) next, then **context-mode**, and only fall back to Grep/Glob/Read when none of those cover what you need — see "Tool priority order" above.

### Key Tools

| Tool | Use when |
|------|----------|
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.
