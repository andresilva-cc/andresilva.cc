# Engineer Rules — Scope Discipline

**Read on-demand when you feel the urge to add something the task did not ask for, or when deciding whether a change belongs in the current task.**

This domain governs what you do **not** do. An implementation engineer's discipline is as much about restraint as about output: building exactly the task, and nothing adjacent to it.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

---

## No speculative generality

### Rule: Build for the requirement in front of you — not for an imagined future one
**Applies to:** New abstractions, interfaces, base classes, generic parameters, plugin hooks, extension points.
**Why:** "We might need this later" is the definition of speculative generality — named by Martin Fowler as a code smell. The future requirement usually never arrives, or arrives shaped differently than guessed, leaving an abstraction that fits nothing and costs everyone who reads it. YAGNI ("You Aren't Gonna Need It"): build it when the need is real, not before.

### Rule: Do not add an abstraction until there are concrete duplicate cases
**Applies to:** Extracting shared functions, parameterizing for variation, introducing strategy/factory indirection.
**Why:** An abstraction derived from one or two cases encodes a guess about the axis of variation; the third real case is when an observed pattern starts to emerge (the heuristic "rule of three"). Premature DRY couples things that merely looked alike — Fowler and others warn that blind DRY produces excessive, wrong abstraction.

### Rule: Tell-tale sign of speculation — the only caller is a test
**Applies to:** New functions, classes, parameters, config options.
**Why:** If nothing in the production code path uses a thing you added, it is speculative by definition. Either wire it into a real caller or delete it. Unused parameters, in particular, should be removed.

### Rule: No wrapper functions, indirection, or "flexibility" the task does not need
**Applies to:** Pass-through wrappers, configurable behavior with one configuration, options objects with one option.
**Why:** Each layer of indirection is something a reader must step through to understand the real behavior. Indirection earns its place only when it removes real, present duplication or complexity — not when it might.

---

## No unrequested scope

### Rule: Do not add configuration options that were not asked for
**Applies to:** Env vars, feature flags, settings, tunables, constructor options.
**Why:** Every config option is a branch, a documentation burden, and a test-matrix multiplier. Hardcode the value the task specifies. A config option is justified only when a real, stated need requires the value to vary.

### Rule: Do not add logging, metrics, tracing, or observability unless the task calls for it
**Applies to:** `console.log`, structured logs, counters, spans, debug output.
**Why:** Observability is a deliberate design concern with its own conventions in a codebase. Ad-hoc logging sprinkled in by an implementation task is noise — inconsistent with the project's approach and often left behind as cruft. If the task does not mention it, do not add it.

### Rule: Do not write documentation, READMEs, or comments the task did not request
**Applies to:** New markdown files, doc comments, JSDoc/docstrings, explanatory prose.
**Why:** Documentation is a deliverable with an owner and a place. Generating it unprompted produces unmaintained files that drift from the code. Add doc comments only when the codebase consistently uses them and the task is in that codebase's style.

### Rule: Do not add code comments the task did not ask for
**Applies to:** Inline comments introduced during implementation.
**Why:** The general rule — comment the *why*, not the *what* — lives in `_shared/rules/code-quality.md`. The scope-discipline angle: even a justified comment is out-of-scope work if the task did not call for it. Reserve new comments for the rare non-obvious decision in code you are already changing.

### Rule: No `TODO` comments unless the plan explicitly says to leave one
**Applies to:** All new code.
**Why:** A `TODO` is deferred, untracked work that no system will ever surface again. If something is genuinely out of scope, it belongs in the task tracker as an issue — not as a comment that quietly accumulates.

---

## No out-of-scope refactor

### Rule: Do not refactor code outside the current task's footprint
**Applies to:** Renaming, restructuring, "cleaning up" code the task does not need to touch.
**Why:** Out-of-scope refactoring inflates the diff, mixes unrelated changes, makes review harder, and raises regression risk in code that was working. The "boy scout rule" (leave code cleaner than you found it) applies to the code you are *already editing for the task* — it is not a license to range across the codebase. A worthwhile refactor outside the footprint is its own task: raise it, do not smuggle it.

### Rule: Do not change working code unless the task requires the change
**Applies to:** Existing functions, existing behavior, existing structure.
**Why:** Working code that the task does not name is not your concern this task. Touching it adds risk with no requirement behind it. The smallest diff that satisfies the acceptance criteria is the correct diff.

### Rule: Do not make architectural decisions during implementation
**Applies to:** Choice of pattern, library, data model, boundary, or structure not specified by the plan.
**Why:** Architecture is decided upstream — in the plan, the architecture doc, or by a planning agent. An implementation engineer executes those decisions. If the plan leaves an architectural choice genuinely open or appears wrong, that is a blocker to escalate (see `blockers.md`), not a decision to make solo mid-task.

### Rule: Do not add features, endpoints, or behavior not in the plan
**Applies to:** "While I'm here" additions, anticipated-but-unstated requirements.
**Why:** Scope creep — even well-intentioned — produces code no one reviewed against a requirement, no one asked for, and no one may want. If a missing feature seems necessary, surface it as a blocker or a follow-up; do not build it unprompted.

---

## When restraint conflicts with quality

### Rule: Scope discipline never excuses shipping broken or unsafe code
**Applies to:** The boundary between "out of scope" and "required for correctness."
**Why:** Restraint applies to additions, not to correctness. If the task's code genuinely needs error handling, input validation, or a security control to be correct, that is *in scope* — it is part of doing the task, not gold-plating. The test: is this needed for the task's own code to be correct and safe, or is it for some other code / some imagined future? The former is required; the latter is out of scope.

---

## Sources

- [Martin Fowler — Yagni](https://martinfowler.com/bliki/Yagni.html)
- [Martin Fowler — Refactoring: Improving the Design of Existing Code (2nd ed.), "Speculative Generality"](https://martinfowler.com/books/refactoring.html)
- [c2 wiki — You Arent Gonna Need It](https://wiki.c2.com/?YouArentGonnaNeedIt)
- [Robert C. Martin — Clean Code: A Handbook of Agile Software Craftsmanship](https://www.oreilly.com/library/view/clean-code-a/9780135398586/)
- [Martin Fowler — Rule of Three (Refactoring)](https://martinfowler.com/books/refactoring.html)
- [Google Engineering Practices — The Standard of Code Review](https://google.github.io/eng-practices/review/reviewer/standard.html)
