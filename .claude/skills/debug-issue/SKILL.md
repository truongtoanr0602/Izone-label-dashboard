---
name: debug-issue
description: Use when investigating a bug, a wrong-looking KPI/label/count, a field that's suspiciously always 0/false/empty, a Lead vs Teacher dashboard mismatch, or a failing tsc/lint/test/build gate in this repo.
---

## Debug Issue

Systematic debugging for the Izone-label-dashboard monorepo (`dashboard/` React SPA + `backend/` NestJS/Prisma API). Most "bugs" here are one of three shapes: a field the API client fakes instead of reading, a business-rule predicate duplicated across files that only got fixed in one place, or a SQL filter dropped from one of three near-identical Lead-dashboard queries. Check the hotspot table below before reading code line-by-line — it's usually faster than grepping cold.

### Phase 1 — Triage

- Which surface: Lead Khối Dashboard, Teacher/class view, or an API/backend response directly?
- Repro: does it happen every load, or only for specific classes/students/periods?
- Evidence: browser console error, Network tab response body, or `tsc`/`lint`/`test`/`build` output — get the exact text, don't paraphrase it.

### Phase 2 — Investigate with the graph first

Per this repo's CLAUDE.md, use `code-review-graph` MCP tools (`semantic_search_nodes`, `query_graph` callers_of/callees_of, `get_impact_radius`, `detect_changes`) before Grep/Read. Start with `get_minimal_context(task=...)`, use `detail_level="minimal"`, target ≤5 tool calls / ≤800 output tokens before escalating.

Then match the symptom against known hotspots (all documented in `CLAUDE.md`/`ARCHITECTURE.md` — read the referenced section before concluding it's a new bug):

| Symptom | Check first |
|---|---|
| A field (`riskScore`, `healthScore`, `isAlarmTriggered`, pass-mềm status, cheating flags) is always `0`/`false`/`''` regardless of data | `dashboard/src/api/client.ts` mapper — it hardcodes these even when the backend already returns real values for some. See `ARCHITECTURE.md` §4's field table before assuming the backend is broken. |
| Lead Khối KPI numbers look off (counts, averages, coverage) | The three non-negotiable conditions repeated across `studentMetricRows`, `transitionRows`, `coverageStudentRows` in `backend/src/dashboards/dashboards.service.ts` (`snapshot_stage IS NULL`, `registration_status = 'on_going'`, NULL-excluded-but-0%-kept denominators). Missing one in exactly one query is the classic silent-regression shape here — diff the three queries against each other. |
| `kpis.netMomentum` is `null` | Expected on real data, not a bug — the `snapshot_stage IS NULL` filter means no row ever has both. Don't "fix" by dropping the filter. |
| Lead's contact-coverage number disagrees with what Teacher shows for the same students | Check `resolveCountMetric()` usage, the class-level test checkpoint (`Chưa có test` fallback), and whether the roster join enforces `students.class_id = student_daily_records.class_id`. Also check whether `contactCoverageByClass` (`contact-coverage.ts`) still safely assumes one `interventionLevel` per student — if a student can now open multiple simultaneous triggers, `COVERED_BY` from `dashboard/src/data/selectors/contactLog.ts` needs porting in, and it currently isn't. |
| Pass filter/badge behaves inconsistently within the student table | It's duplicated **three times** in `StudentTable.tsx` (filter predicate, count badge, badge-render check that also matches `'Đạt tiêu chuẩn'`) — grep all three, there's no shared selector. |
| "Urgent" / red-label student list looks wrong, or a red label isn't showing as urgent | `studentFilters.ts`'s three single-criterion predicates deliberately replaced the old `red-label-is-always-urgent` rule — that's intentional, read the doc-comments before "restoring" it. |
| Works in `npm run dev` locally, breaks after `npm run deploy` to Pages | `dashboard/src/api/client.ts` hardcodes the API base to `http://localhost:3000/api` — it isn't configurable yet, so a Pages deploy can't reach a real backend. |
| A command fails outright (`npm run` finds nothing, wrong module resolution) | Confirm you're running it from `dashboard/` or `backend/`, not repo root — there's no workspace tooling gluing them together. |
| Dark mode partially applies (some elements stay light) | The `.dark` class is toggled in **two** places in `App.tsx` (a `useEffect` on `document.documentElement`, and directly on the root `<div>`) — both are load-bearing; a change that drops the `useEffect` breaks global (non-component) dark styles. |

### Phase 3 — Root-cause, referencing the doc

State the mechanism, not just the symptom, and cite the `CLAUDE.md`/`ARCHITECTURE.md` section that already documents it (the code comments themselves reference section numbers — e.g. studentFilters.ts points at §5/§6).

### Phase 4 — Fix

- Edit at the actual site(s). If it's one of the duplicated-business-rule spots above, update **every** listed site in the same change — fixing one silently reintroduces the bug for the others.
- Run the four gates from `dashboard/`: `npx tsc -b`, `npm run lint`, `npm test`, `npm run build` (all four must be clean — `noUnusedLocals`/`noUnusedParameters` will fail the build on a stray import). If `backend/` changed, run its build too.
- If the fix touched one of the three Lead-dashboard SQL queries, re-read the other two — they should still agree on the same three conditions.

### Phase 5 — Prevention

If the bug came from CLAUDE.md/ARCHITECTURE.md being stale or the hotspot table above missing a case, don't just patch code — flag it (or run the `sync-docs` skill) so the next debug pass doesn't rediscover the same thing from scratch.

### Common mistakes

- Concluding "backend bug" for a field that's actually hardcoded client-side in `client.ts` — always check `ARCHITECTURE.md` §4 first.
- Fixing one of the three `StudentTable.tsx` pass-filter duplicates or one of the three Lead SQL queries without checking the other two/three.
- "Fixing" `netMomentum: null` by relaxing the `snapshot_stage` filter — that reintroduces double-counting.
- Running `npm run <script>` from repo root instead of `dashboard/`/`backend/`.

## Token Efficiency Rules
- ALWAYS start with `get_minimal_context(task="<your task>")` before any other graph tool.
- Use `detail_level="minimal"` on all calls. Only escalate to "standard" when minimal is insufficient.
- Target: complete any review/debug/refactor task in ≤5 tool calls and ≤800 total output tokens.
