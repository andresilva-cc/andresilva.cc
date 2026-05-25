# Agent Knowledge Library

This directory holds the **knowledge files** that agents read to do craft work — codified, sourced, reusable rules and reference material. It is the generalization of the `ui-ux-designer/rules/` system to the whole agent roster.

## Layout

```
.claude/agent-rules/    # toolkit-managed, static rule libraries
  _shared/
    rules/              # cross-cutting knowledge — consumed by multiple agents
    README.md           # this file
  <agent>/
    rules/              # agent-specific knowledge

docs/agents/            # project-customizable scaffolding
  <agent>/
    <agent>.md          # the agent's entry doc (routing block + project-customizable scaffolding)
```

Rule libraries live under `.claude/agent-rules/` to keep `docs/` purely project-owned. Entry docs stay under `docs/agents/<agent>/` because they carry project-customizable scaffolding (Common Pitfalls, Additional Reading) alongside the routing block.

- **Shared files** (`_shared/rules/`) are authored once and consumed by several agents — e.g. `security.md` is read by code-reviewer, engineer, devops, and software-architect.
- **Agent-specific files** (`<agent>/rules/`) hold knowledge unique to one agent.
- Each agent's **entry doc** (`<agent>/<agent>.md`) carries a **routing block**: "read file X only when the task involves domain Y." Agents load knowledge **on-demand** — never all files at once.

## Static vs project-owned — the load-bearing rule

These files are **toolkit-managed and static** — identical across every project using the toolkit, updated only here, never edited per-project. Project-specific *decisions* (a project's chosen palette, its architecture, its pricing model) belong in **project-owned docs** (`design-system.md`, `architecture.md`, `copy-guide.md`, `revenue-architecture.md`, …) — never in a rules file.

Every rules file repeats this as a callout directly after its intro. Two variants are acceptable:

- **Canonical short form:**
  > **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

- **Extended agent-specific form** (preferred when the agent maps to a single named project-owned doc):
  > **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific design decisions (brand fonts, palette values, …) belong in the project's own `design-system.md` and `ui-spec.md` — never here.

Either form is acceptable; the extended form is preferred when the agent maps to a single named project-owned doc.

## Artifact formats

Different knowledge needs different shapes. Pick the format that matches the knowledge — do not force everything into a checklist.

### 1. Checklist — for *decidable* knowledge (true/false at the point of application)

```
### Rule: <imperative statement>
**Numeric baseline:** <if quantifiable; omit the line otherwise>
**Applies to:** <contexts; note exceptions>
**Why:** <rationale>
```

### 2. Tradeoff map — for *contextual* choices ("which option, when")

```
### <Pattern / option name>
**Optimizes:** <what it gains>
**Sacrifices:** <what it costs>
**Choose when:** <conditions that favor it>
**Avoid when:** <conditions that rule it out>
```

### 3. Methods catalog — for *procedures and heuristics* the agent runs

```
### Technique: <name>
**What it is:** <one line>
**When to apply:** <triggers>
**How:** <steps / procedure>
```

### 4. Knowledge base — for *facts* (lookup tables)

Dated reference tables. Head the file with `**Last verified:** <YYYY-MM-DD>` and instruct the agent, in the routing block, to **web-verify any fact before relying on it** — a stale fact file is a starting point, not ground truth. Used where the knowledge is factual and time-sensitive (tax/fiscal, locale data, provider capabilities).

> Anti-patterns are written as `### Rule:` blocks with a negative imperative ("Never X", "Don't Y") — do not introduce a separate Anti-pattern format. Keeping the catalog to four formats keeps the library scannable.

## Entry doc skeleton

Each agent's entry doc (`<agent>/<agent>.md`) follows one of two structures:

**Standard form** (most agents): H1 + "Read this file at the start of every task." + `## Core inline rules — always-on guardrails` (brief bullets) + `## Routing block — rule files` + optional `## Pre-delivery checklist`.

**Workflow-router form** (code-reviewer, qa): the agent definition template already owns the workflow rules, so the entry doc is just `## Routing block` and a "How the pieces fit" overview. Use this only when the agent template carries the workflow itself.

Both forms end with the static-vs-project-owned reminder.

## Conventions

- Group entries under thematic `## H2` headings.
- End every file with `## Sources` — authoritative references (standards bodies, canonical books, vendor docs).
- Keep entries concise; the agent reads these into a working context.
- A file may mix formats if its domain genuinely spans decidable and contextual knowledge — label the sections.

## Severity vocabulary

Where rule files reference a finding's severity, use the standard rubric defined in `code-reviewer/rules/severity-rubric.md`: **Critical / Warning / Suggestion**. The QA agent uses a parallel rubric (Critical / Major / Minor / Trivial) for test-run findings, which maps cleanly to the same impact × likelihood model. Do not introduce additional severity vocabularies.
