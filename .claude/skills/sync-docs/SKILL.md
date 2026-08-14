---
name: sync-docs
description: Use when CLAUDE.md or ARCHITECTURE.md may have drifted from the actual codebase — new or removed modules, changed dependency structure, dead code that came back to life, newly-duplicated business logic — and you want to close that gap using structural graph analysis instead of a manual reread of the whole repo.
---

# Sync Docs

## Overview

Uses the `code-review-graph` MCP server's knowledge graph of this repo to find where structure has moved since `CLAUDE.md`/`ARCHITECTURE.md` were last synced, then makes narrow, targeted edits to close the gap — plus a dated log of what changed and why.

## When to use

- Invoked manually (e.g. `/sync-docs`), typically after a batch of merges, or before onboarding someone to the docs.
- Not for every commit — this is a periodic sync, not a pre-commit hook.
- Not a substitute for updating docs as part of a PR that already knows what it changed — this is for drift that accumulated unnoticed.

## Workflow

0. **Gate on the MCP server, before anything else.** Run `claude mcp list` (or check `.mcp.json`) and confirm `code-review-graph` is connected. Not connected → stop immediately, tell the user, and go no further. Do NOT substitute Grep/Read of the repo tree for the graph "just this once" — a manual skim is not the same analysis this skill exists to do, and downstream steps assume graph output.
1. **Refresh the graph** — call `build_or_update_graph_tool` so it reflects HEAD.
2. **Find the review window** — `ls .claude/memory/*-doc-sync.md | sort | tail -1` (filenames are `YYYY-MM-DD-*`, so lexical sort is chronological); read that file's recorded commit SHA as the range start. No prior log, or the recorded SHA is no longer reachable (force-push/rebase) → treat as a first run and review the whole repo.
3. **Detect structural change** — `detect_changes_tool` is the primary source of findings; call it first, scoped to the range from step 2 (before calling, inspect the tool's own parameter schema for whatever it calls its since/base/range argument — don't guess a name). Only reach for `get_architecture_overview_tool`, `query_graph_tool`, `list_communities_tool`, `get_hub_nodes_tool`, `get_bridge_nodes_tool`, `get_surprising_connections_tool` to explain or scope a specific finding `detect_changes_tool` already surfaced — they are not a checklist to run every time.
4. **Cross-check against the docs** — Read `CLAUDE.md` and `ARCHITECTURE.md`. For each structural finding, check whether an existing claim in these files is now stale, contradicted, or missing entirely. Drop findings that don't map to any documented claim — this is a sync, not a rewrite. If either file has moved/been renamed since the last log, ask the user rather than guessing the new path.
5. **Edit narrowly** — Edit (never Write/overwrite) only the stale sections, matching each file's existing voice: `CLAUDE.md` is dense, specific, uses `file:line` references; `ARCHITECTURE.md` is the schema/business-rule reference. Leave everything the graph didn't flag untouched.
6. **Log the run** — create `.claude/memory/YYYY-MM-DD-doc-sync.md` using this skeleton:
   ```markdown
   # Doc sync YYYY-MM-DD
   Range reviewed: <start SHA or "full repo"> → <HEAD SHA>
   Graph findings: <bullet list>
   Edits made: <file — section — why, or "none">
   ```
   This is a plain project log local to this repo, separate from Claude Code's own cross-session memory system.
7. **Stop — do not commit.** Leave the edits as an uncommitted working-tree diff; the user reviews with `git diff` and commits themselves.

## Common mistakes

- Rewriting whole sections or files instead of editing only what the graph flagged as stale — these docs are hand-curated; wholesale regeneration destroys nuance a human wrote in.
- Skipping the MCP connectivity gate (step 0) and discovering mid-run that the server is missing, then quietly falling back to a manual repo read instead of stopping.
- Running every graph tool "to be thorough" instead of letting `detect_changes_tool` drive — burns tokens and produces findings with no clear provenance.
- Sorting `.claude/memory/*-doc-sync.md` by mtime instead of filename — an edited older log will look newest by mtime and give the wrong range start.
- Auto-committing the changes — the user reviews via `git diff` first, always.
- Treating every graph finding as doc-worthy — only findings that contradict or are missing from an *existing* claim in `CLAUDE.md`/`ARCHITECTURE.md` qualify; novel-but-undocumented trivia isn't in scope.
