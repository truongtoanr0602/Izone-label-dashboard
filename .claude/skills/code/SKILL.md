---
name: code
description: Use when building a new feature, component, endpoint, or function in this repo — from a task description to working, gate-verified code across dashboard/ (React) and backend/ (NestJS/Prisma).
---

## Code

Workflow for implementing new features in the Izone-label-dashboard monorepo. There is **no workspace tooling** — `dashboard/` (React SPA) and `backend/` (NestJS/Prisma) are independent npm projects; every command below runs from inside one of them, never repo root.

### Phase 1 — Orient before coding

- Use `code-review-graph` MCP tools (`get_minimal_context`, `semantic_search_nodes`, `query_graph`, `get_architecture_overview`) before Grep/Read — faster and gives callers/tests context Grep can't. `detail_level="minimal"`, target ≤5 calls before escalating.
- Read `ARCHITECTURE.md` for the real Postgres schema, backend endpoints, and — critically — §4's list of fields `dashboard/src/api/client.ts` still hardcodes instead of reading from the API. Don't build a feature on top of a field that's actually faked.
- Touching pass-chuẩn/pass-mềm status, labels, urgent-student logic, or contact-coverage? Read CLAUDE.md's "Business rules that are duplicated" section first, and ask to recall the `izone-duplicated-business-rules` project memory — these rules live in multiple files and must be edited together.
- Touching component classes or visual styling? Read `Design.md` first (Tailwind v4 setup, color palette, radii, visual-weight conventions).

### Phase 2 — Plan minimal implementation

- State the exact success criteria before editing ("add filter X" → "table shows only matching rows, existing filters still compose"), and name which of the four gates (below) proves it.
- If the feature touches a duplicated-rule site, list every site it must be edited in *before* starting, not after — grep once, edit once, in the same change.
- Vietnamese UI copy, English code identifiers — keep that split; don't translate one into the other.
- If the new logic is worth testing, plan to extract it into a pure module first — tests are vitest in a **plain node environment, no jsdom, no component rendering**. Business logic goes in `dashboard/src/data/selectors/*.ts` (see `aggregates`/`deltas`/`labelFlow`/`contactLog` for the pattern), pure formatting in a file like `kpiFormat.ts`, both tested next to the source as `*.test.ts`. Don't reach for a DOM testing stack.

### Phase 3 — Implement

- Frontend components stay presentational — data + callbacks in, no business logic; that logic belongs in a selector.
- Backend: match existing NestJS/Prisma module patterns under `backend/src/<domain>/`; check `ARCHITECTURE.md` §1/§3 before touching `backend/prisma/schema.prisma` or adding an endpoint. There's no `migrate`/`seed` npm script — seeding is ad hoc via `node backend/seed.js`.
- Match existing style even where you'd prefer different; don't refactor code the task doesn't touch.
- New field on the API contract? Trace it through: Prisma schema → NestJS DTO/service → `client.ts` mapper → TS interface — a field can silently stop at any one of these and still "compile."

### Phase 4 — Verify (four gates, all must be clean)

```bash
cd dashboard
npx tsc -b       # noUnusedLocals/noUnusedParameters/erasableSyntaxOnly are on — a stray import fails this
npm run lint     # oxlint
npm test         # vitest run, node env
npm run build    # tsc -b again, then vite build
```

If `backend/` changed: `npm run build` there too, and smoke-test a changed/new endpoint with `npm run start:dev` + a real request (curl/httpx) — this repo has no separate integration-test runner for the API.

If the change touched a duplicated-rule site, re-open the other listed sites and confirm they still agree — fixing one and silently leaving the others stale is the most common regression shape in this repo (see `debug-issue` skill's hotspot table).

### Phase 5 — Fix loop

On gate failure: read the actual error text, fix, re-run. After ~3 attempts still failing, stop and report the exact error rather than guessing further — never bypass a gate (`--no-verify`, commenting out a failing assertion, silencing `tsc` with `any`) to make it pass.

### Common mistakes

- Building a feature on a field `client.ts` fakes (`riskScore`, `isEligibleForReview`, `reviewStatus`, etc.) without checking `ARCHITECTURE.md` §4 first — the UI will look correct against fake data and break against the real backend.
- Editing one of the three `StudentTable.tsx` pass-filter duplicates, one of the three Lead-dashboard SQL queries, or one `studentFilters.ts` predicate without checking the sibling sites.
- Writing a component test that needs a DOM — this repo's vitest config has no jsdom; extract the logic into a pure selector/formatter instead.
- Running `npm run <script>` from repo root instead of `dashboard/`/`backend/` — there's nothing to run at root.
- Forgetting `vite.config.ts`'s `base: '/Izone-label-dashboard/'` — required for GitHub Pages, don't remove it while touching build config.

## Token Efficiency Rules
- ALWAYS start with `get_minimal_context(task="<your task>")` before any other graph tool.
- Use `detail_level="minimal"` on all calls. Only escalate to "standard" when minimal is insufficient.
- Target: complete exploration in ≤5 tool calls and ≤800 total output tokens before moving to implementation.
