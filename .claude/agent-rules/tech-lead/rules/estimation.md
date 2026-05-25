# Planning Rules — Complexity Estimation

**Read on-demand when the task involves assigning complexity to work items — sizing tasks Small/Medium/Large, calibrating estimates, or sanity-checking a plan's totals.**

The tech-lead estimates *complexity*, not a precise schedule — a coarse S/M/L size that flags risk and signals when a task is too big. Every rule below is decidable: a size assignment either follows it or it does not.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

---

## The size scale

> **Starter hour ranges — recalibrate per team and project.** The three sizes below carry default hour ranges as a starting point: **Small** ≈ under ~2 hours of focused work, **Medium** ≈ ~2–6 hours, **Large** ≈ 6+ hours with a hard ceiling of roughly 2 days. These ranges are *defaults to anchor a first plan*, not universal truths — actual hour-per-size varies by team, codebase, and stack. The load-bearing rule is the calibration rule below: recalibrate against actuals after each phase and update the ranges (and the reference tasks) to match what this team and codebase actually produce.

### Rule: Small — well-understood, mechanical, minimal decision-making

**Applies to:** Tasks with a known shape and no open design questions — a config value, a simple utility, a basic CRUD endpoint with no special logic, a copy change, adding a field to an existing form.
**Why:** Small means the *how* is already obvious; the work is execution, not discovery. If a task labelled Small turns out to need a design decision, it was mis-sized — it is at least Medium.

### Rule: Medium — non-trivial logic or some design judgment

**Applies to:** Tasks needing a few design decisions or integration across components — a business-logic module, auth middleware, a validated form with non-trivial rules, wiring a third-party API with a known contract.
**Why:** Medium is the default for real feature work. The engineer must make choices, but the choices are bounded and the unknowns are small. Most well-decomposed tasks land here.

### Rule: Large — significant complexity, multiple moving parts, deep system understanding

**Applies to:** A complex state machine, a real-time sync mechanism, a caching layer, a non-trivial migration — work with several interacting parts or meaningful unknowns.
**Why:** Large is a warning label, not a size. Each Large task should prompt the question "can this be split?" — and usually it can, via the SPIDR techniques in `decomposition.md`. A plan that is mostly Large tasks is under-decomposed; revisit it.

### Rule: Anything bigger than Large must be split, never labelled "XL"

**Applies to:** Any task that estimates beyond the Large ceiling (the starter ceiling is roughly 2 days; recalibrate per the rule below).
**Why:** Estimate error grows super-linearly with size — a 4-day task is far more than twice as uncertain as a 2-day task. There is no "Extra Large": a task that big is two or more tasks that have not been separated yet. Decompose it until every piece is Large or smaller, then re-estimate the pieces.

---

## Calibration and consistency

### Rule: Size by comparison to known reference tasks, not by absolute guessing

**Applies to:** Every size assignment.
**Why:** Humans estimate *relative* size far more reliably than absolute duration — "this is about as big as that auth task we sized Medium" beats "this feels like four hours." Pick one or two completed tasks per size as anchors and judge each new task against them. Relative sizing also resists anchoring bias: it does not depend on whatever number was spoken first.

### Rule: Recalibrate against actuals after each phase

**Applies to:** The S/M/L hour ranges and the reference tasks, reviewed at phase boundaries.
**Why:** Estimation only improves with feedback. If the last phase's "Medium" tasks consistently took 8 hours, the band is wrong for this team and codebase — adjust it, or adjust which tasks count as Medium. Estimates calibrated on this project's own history beat any generic table. Record the adjustment in agent memory so the next phase starts calibrated.

### Rule: Apply sizes consistently across the whole plan

**Applies to:** The full task list of a phase.
**Why:** Two tasks of genuinely similar effort must carry the same size. Inconsistent sizing makes the plan's totals meaningless and erodes trust in every estimate. After drafting, scan the list and check that all the Smalls really are comparably small, all the Mediums comparably medium — fix any outlier.

### Rule: Size the realistic case, not the best case

**Applies to:** Every estimate.
**Why:** The honest estimate assumes ordinary friction — some debugging, a code review round, a test that needs adjusting. An estimate that only holds if nothing goes wrong is not an estimate, it is a best case, and best cases do not happen back-to-back across a whole phase. Size what the task will *actually* take, including the normal cost of doing it well.

---

## Common traps

### Rule: Treat an unknown as a sizing red flag, not a small number

**Applies to:** Tasks touching unfamiliar tech, undocumented third-party behavior, or vague requirements.
**Why:** Estimation error comes mostly from *uncertainty*, not from size — the cone of uncertainty is widest when least is known. The instinct to put a small number on a vague task is exactly backwards. If a task's size depends on an unanswered question, do not guess the answer: split off a timeboxed spike (see `decomposition.md`), let it resolve the unknown, then size the real task.

### Rule: Never sum best-case (or worst-case) estimates across tasks

**Applies to:** Rolling individual task sizes up into a phase total.
**Why:** A statistical error McConnell calls out directly: adding a column of best-case estimates produces a phase best case that is wildly optimistic, because every task hitting its best case at once is vanishingly unlikely. Roll up *realistic* per-task estimates; the aggregate of realistic cases is itself realistic, while the aggregate of optimistic cases is fiction.

### Rule: Do not omit the invisible work

**Applies to:** Every estimate — especially tasks framed as "just" a feature.
**Why:** Under-estimation usually comes from forgetting work that is real but unglamorous: writing the tests, handling the error paths, code review and its rework, updating docs, data migration, edge cases. The visible happy-path code is often a minority of the effort. Size the *whole* task as its acceptance criteria define it, not just the part that demos.

### Rule: Resist optimism and external pressure on the number

**Applies to:** The final size, especially when a small plan would "look good."
**Why:** Estimates exist to inform, not to please. Shrinking a Large to a Medium because the schedule is tight does not make the work smaller — it just moves the surprise to delivery time and burns trust. State the honest size; if it is unwelcome, that is information the project needs, not a number to negotiate down.

### Rule: Don't fake precision the inputs can't support

**Applies to:** The granularity of the estimate itself.
**Why:** S/M/L is deliberately coarse because the inputs — a spec and an architecture doc, before any code — cannot support more. Converting to false precision ("3.5 hours") implies a confidence that does not exist and invites schedules built on sand. Keep the estimate as coarse as the uncertainty demands; precision is earned by knowledge, not asserted.

---

## Sources

- [Steve McConnell — Software Estimation: Demystifying the Black Art](https://www.oreilly.com/library/view/software-estimation-demystifying/0735605351/)
- [Steve McConnell — Software Estimation's Cone of Uncertainty (chapter PDF)](https://athena.ecs.csus.edu/~buckley/CSc231_files/McConell_ConeofUncertainty.pdf)
- [Steve McConnell — 17 Theses on Software Estimation](https://stevemcconnell.com/17-theses-software-estimation/)
- [Daniel Kahneman & Amos Tversky — the planning fallacy](https://en.wikipedia.org/wiki/Planning_fallacy)
- [Mountain Goat Software — Agile Estimating and Planning (Mike Cohn)](https://www.mountaingoatsoftware.com/books/agile-estimating-and-planning)
- [Easy Agile — Agile Estimation Techniques: T-Shirt Sizing](https://www.easyagile.com/blog/agile-estimation-techniques)
