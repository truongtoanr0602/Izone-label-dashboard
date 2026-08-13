# IZONE Label Dashboard User Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a Vietnamese user guide that explains how to operate the dashboard and how every displayed KPI, label, filter, warning, and pass result is derived from the current codebase.

**Architecture:** Produce one standalone Markdown document under `docs/` with a user-facing workflow first, followed by metric definitions, formulas, thresholds, interpretation rules, and known prototype limitations. Ground every business rule in the current React components, selectors, generator, and type/schema comments.

**Tech Stack:** Markdown, React + TypeScript + Vite source inspection.

## Global Constraints

- Preserve the current UI vocabulary in Vietnamese while retaining code terms where they clarify the source logic.
- State explicitly that the current app is a frontend-only prototype backed by frozen/generated mock data.
- Distinguish percentages, people counts, and label-change events.
- Explain `null`/“—” as unavailable data rather than zero.
- Explain that the selected report period does not currently filter the Master Table and Label Distribution sections.

---

### Task 1: Write the Vietnamese user guide

**Files:**
- Create: `docs/IZONE-Label-Dashboard-Huong-dan-su-dung.md`

**Interfaces:**
- Consumes: UI behavior from `src/App.tsx` and dashboard components; calculation rules from `src/data/selectors/*`, `src/data/generator/generate.ts`, and `src/data/types.ts`.
- Produces: A standalone guide for Lead Khối and giáo viên, including operating steps, formulas, thresholds, interpretation guidance, action workflows, and limitations.

- [ ] **Step 1: Organize the guide around the two user journeys**

Include navigation, report-period selection, Lead view, class drill-down, and Teacher/class view before the metric reference.

- [ ] **Step 2: Document all business formulas and thresholds**

Cover label bands, attendance, homework, test averages, risk score, health score, warning status, pass chuẩn, pass mềm, label momentum, deltas, dropout, and urgent/reminder predicates.

- [ ] **Step 3: Document interpretation caveats**

Explain weighted averages, eligible test samples, comparable classes for deltas, cumulative dropout, event-vs-person counting, missing data, and current-vs-selected-period sections.

- [ ] **Step 4: Review the document against the code**

Run searches for every user-visible KPI and threshold name, then check that the guide does not claim functionality absent from the current UI.
