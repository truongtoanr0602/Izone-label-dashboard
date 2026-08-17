# AGENTS.md Claude Source-of-Truth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make root `AGENTS.md` a concise pointer that treats root `CLAUDE.md` as the repository's only project-instruction source of truth.

**Architecture:** Keep all detailed guidance in `CLAUDE.md`. `AGENTS.md` contains only precedence, mandatory-read, referenced-document, and update-location rules.

**Tech Stack:** Markdown, PowerShell verification, Git.

## Global Constraints

- Preserve `CLAUDE.md` byte-for-byte.
- Do not copy detailed project rules into `AGENTS.md`.
- Preserve higher-priority system/developer instructions and the latest direct user request.
- Modify only `AGENTS.md` during implementation.

---

### Task 1: Add the source-of-truth pointer

**Files:**
- Modify: `AGENTS.md`
- Verify unchanged: `CLAUDE.md`

**Interfaces:**
- Consumes: root `CLAUDE.md` and its relative references.
- Produces: root agent bootstrap instructions.

- [ ] **Step 1: Run the failing content check**

```powershell
$text = Get-Content -Raw -Encoding UTF8 AGENTS.md
$ok = $text -match '\[CLAUDE\.md\]\(CLAUDE\.md\)' -and
      $text -match 'single source of truth' -and
      $text -match 'Read.*CLAUDE\.md' -and
      $text -match 'system.*developer.*user'
if (-not $ok) { exit 1 }
```

Expected: FAIL because `AGENTS.md` is currently empty.

- [ ] **Step 2: Record the pre-edit CLAUDE.md hash**

```powershell
$claudeHash = (Get-FileHash CLAUDE.md -Algorithm SHA256).Hash
$claudeHash
```

- [ ] **Step 3: Write the minimal AGENTS.md pointer**

```markdown
# Agent Instructions

## Single source of truth

[`CLAUDE.md`](CLAUDE.md) is the single source of truth for all repository-level
project instructions.

- Read all of `CLAUDE.md` before exploring code, editing files, running commands,
  or reviewing changes.
- Read documents and project skills referenced by `CLAUDE.md` when relevant to
  the task, including `ARCHITECTURE.md` and `Design.md`.
- Do not duplicate detailed project rules in this file. Update `CLAUDE.md` when
  repository guidance changes.
- If this file conflicts with `CLAUDE.md`, follow `CLAUDE.md`.
- System and developer instructions, followed by the latest direct user request,
  take precedence over repository documentation.
```

- [ ] **Step 4: Run content and integrity checks**

```powershell
$text = Get-Content -Raw -Encoding UTF8 AGENTS.md
$ok = $text -match '\[CLAUDE\.md\]\(CLAUDE\.md\)' -and
      $text -match 'single source of truth' -and
      $text -match 'Read.*CLAUDE\.md' -and
      $text -match 'System and developer instructions'
if (-not $ok) { exit 1 }
if ((Get-FileHash CLAUDE.md -Algorithm SHA256).Hash -ne $claudeHash) { exit 1 }
if ((Get-Content AGENTS.md).Count -gt 20) { exit 1 }
git diff --check -- AGENTS.md
```

Expected: PASS; link/rules are present, file is concise, `CLAUDE.md` hash is unchanged, and no whitespace errors exist.

- [ ] **Step 5: Review the exact diff**

```powershell
git diff -- AGENTS.md
git status --short -- AGENTS.md CLAUDE.md
```

Expected: only `AGENTS.md` is modified; `CLAUDE.md` is clean.

- [ ] **Step 6: Commit if requested**

```powershell
git add -- AGENTS.md
git commit -m "docs: make Claude instructions canonical"
```
