# Codex agents and skills adapters

## Goal

Make the repository's Claude agents and skills available to Codex while keeping `.claude` as the only source of workflow and domain instructions.

## Source-of-truth rule

- Canonical agent instructions remain in `.claude/agents/*.md`.
- Canonical skills remain in `.claude/skills/*/SKILL.md` and their sibling resources.
- No canonical instruction text is copied into `.codex` or `.agents`.
- Changes to agent behavior or skill workflows must be made in `.claude` only.

## Structure

### Skills

Create `.agents/skills/`, the repository skill discovery location supported by Codex. Each child is a directory link to the matching directory under `.claude/skills/`.

This lets Codex load the canonical `SKILL.md` and any future sibling resources directly. A source edit is therefore visible to both Claude and Codex without synchronization.

### Agents

Create one project-scoped `.codex/agents/<name>.toml` adapter for each top-level `.claude/agents/<name>.md` definition. Each adapter contains only the Codex-required fields:

- `name`
- `description`
- `developer_instructions`

`developer_instructions` identifies the corresponding canonical Markdown path, requires the agent to read it completely before acting, and states that the Markdown file overrides the adapter. It does not reproduce the canonical workflow.

Descriptions are limited to short routing metadata needed for Codex to select an agent. They must not contain operational or domain guidance.

The `.claude/agents/memory/` tree is not converted into agents. Canonical agent instructions may continue to load that memory as directed by their Markdown source.

## Validation

Add a repository-local validation script that fails when:

- a top-level Claude agent has no Codex adapter;
- a Claude skill has no Codex-visible directory link;
- an expected link is missing, broken, or targets a non-matching source directory;
- an adapter does not point to its matching canonical agent file;
- an adapter is missing a required Codex field.

The validator reads metadata and link targets only. It does not generate or copy canonical instructions.

Validation will be tested against the completed structure and by a controlled negative case using a temporary fixture, leaving the repository unchanged afterward.

## Compatibility and failure handling

Directory links are used because Codex officially follows linked skill directories. On Windows, creation may require Developer Mode or elevated symlink privileges. If symbolic directory links cannot be created, use Windows directory junctions, which retain the same single-source behavior for local repository use.

Agent adapters fail loudly through their mandatory instruction when the canonical Markdown file cannot be read. The validator catches missing source paths before use.

## Non-goals

- Do not modify `.claude` content.
- Do not duplicate Claude instructions in Codex files.
- Do not add models, reasoning levels, MCP configuration, or sandbox overrides unless they already follow unambiguously from the canonical source and are required for compatibility.
- Do not convert memory files into standalone agents or skills.
