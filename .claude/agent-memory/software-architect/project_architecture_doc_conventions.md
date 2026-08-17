---
name: architecture-doc-conventions
description: How docs/architecture.md is written and updated — descriptive "what is" doc, incremental edits, and the sections a new route must touch
metadata:
  type: project
---

`docs/architecture.md` is a **descriptive snapshot** ("what is, not what should be"), not a design proposal. Its own stated policy: treat the code as the source of truth and update the doc when a task materially changes the architecture. Edits are incremental and must match the existing voice — dense prose, bolded lead-ins on bullets, tables for stack/routes/scripts, ASCII flow diagrams for pipelines, and explicit "deliberate / accepted / not a bug" framing for known limitations.

**Why:** the doc is mature and gets reviewed for staleness after change sets; rewrites destroy accumulated rationale. The load-bearing part is the *why* behind non-obvious choices (why a duplication exists, why a file can't move) — without it a future reader "cleans up" the deliberate part and breaks something silently.

**How to apply:** when a change set adds a route, walk this checklist — §1 purpose line, §2 stack table, §3 tree + directory-role bullets, §4 route table + rendering/layout notes, §5 if it adds styling scope, §7 if it adds a repository or pipeline, §11 scripts + generated artifacts, §12 deployment, §13 conventions, §14 deliberately-absent. Deeper rationale for a whole subsystem lives in its own decision log (`docs/articles-decision-log.md`, `docs/redesign-log.md`, `docs/resume-print-theme.md`); architecture.md links to those rather than absorbing them. Note: §2's version numbers and some `tsconfig` details drift from the actual files — do not fix them opportunistically inside an unrelated change set; report them instead.

When a review flags the doc as stale, re-read every source file the affected sections name before editing. A rebuild invalidates adjacent claims too, not just the itemized ones (on the `/resume` rebuild: the styling approach, a repository's file extension rationale, a deleted component, and the `@page` value were all wrong in ways the review didn't list). And verify claimed tooling exists before documenting it — a hook or guard described in a task brief may not be in the tree yet. Related: [[vercel-browser-constraint]], [[styling-convention-utilities-first]].
