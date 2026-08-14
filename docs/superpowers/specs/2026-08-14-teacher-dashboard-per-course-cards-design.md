# Teacher Dashboard Per-Course Card Configuration (Preliminary)

**Date:** 2026-08-14

**Status:** Idea-level, not yet detailed. Captures the agreed direction before a full implementation plan.

**Scope:** Teacher Dashboard (`activeTab === 'teacher'`) card visibility varying by `courseId`, starting with an "encouragement" card for khóa 67 (`courseId = 5`).

## 1. Decision summary

Per-course dashboard differences are expected to be rare (khóa 67 today, possibly khóa 56 later) — not a recurring pattern across many courses. Given that, the design favors the lightest mechanism over a general-purpose one:

- A small **hardcoded config map** (`courseId -> extra card keys`) that a developer edits and redeploys when a new special case appears. No admin UI, no DB-backed config table.
- New cards follow the **existing TopRibbon/predicate/Zalo-template pattern** (`habit_reminder` / `red_followup` / `relearn_advice`) rather than a new generic card registry — a registry abstraction isn't justified for 1-2 instances (YAGNI).

## 2. First instance: "encouragement" card (khóa 67)

- **Criteria:** student has `interventionLevel === 'none'` AND meets pass chuẩn/pass mềm (reusing the condition already tripled in `StudentTable.tsx`). Mutual exclusion confirmed: a student already flagged in another card should not also appear here.
- **Data:** no backend/API changes needed. Both `interventionLevel` and `passEvaluation.standardStatus`/`softPassStatus` are already returned per-student by the Teacher endpoint — the new predicate is a pure frontend computation over data already fetched.
- **Messaging:** reuses the existing Zalo copy-to-clipboard pattern (`ZaloRemindModal` + `messageScripts.ts`), not a new send-integration. New template text only.

## 3. Rough shape of the change (not final)

- `dashboard/src/config/courseCardConfig.ts` (new) — `courseId -> extra card keys` map.
- `dashboard/src/data/selectors/studentFilters.ts` — add `isEncouragementStudent` alongside the existing three predicates.
- `dashboard/src/data/messageScripts.ts` — add an encouragement message template.
- `dashboard/src/components/dashboard/TopRibbon.tsx` + `App.tsx` — render the 4th card/quick-action button conditionally, based on the config map for the current class's `courseId`.

## 4. Open for the detailed plan later

- Exact prop shape for making `TopRibbon` config-driven.
- Whether the count for the new card also needs to move off backend `actionSummary` conceptually, or just be computed alongside it client-side.
- Test coverage for the new predicate (repo convention: pure selector logic gets a `*.test.ts`).
- Copy/tone for the encouragement Zalo template.

## 5. Non-goals (for now)

- Admin-configurable card visibility UI.
- Real message-sending backend integration.
- A general card-registry abstraction for hypothetical future courses beyond khóa 67/56.
