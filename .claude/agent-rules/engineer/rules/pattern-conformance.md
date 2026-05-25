# Engineer Rules — Pattern Conformance

**Read on-demand before writing new code in an existing codebase, when adding a file, or when deciding how to structure something.**

This domain governs detect-and-conform: the discipline of studying how the codebase already does a thing and matching it, rather than introducing a second way of doing the same thing.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

---

## Detect before you write

### Rule: Find the existing pattern before inventing a new one
**Applies to:** Error handling, data access, validation, logging, async patterns, env-var guards, test setup — any cross-cutting concern.
**Why:** Almost every concern a task touches has already been solved somewhere in the codebase. Grep for an analogous case first — a sibling route, an adjacent worker, another model — and copy the established approach. Inventing a parallel solution creates two systems where one would do, and the reviewer will ask you to unify them anyway.

### Rule: Read an adjacent file in full before adding a sibling
**Applies to:** New files placed beside existing ones — a new route next to routes, a new component next to components, a new test next to tests.
**Why:** The neighbor file encodes the local conventions: import order, export style, naming, file layout, what helpers exist. Reading it prevents reimplementing a utility that already exists three lines away and prevents structural drift between files that should look alike.

### Rule: When extending or extracting from a file, read the source file completely first
**Applies to:** Tasks that move, split, or build on existing code.
**Why:** Utilities, helpers, constants, and types already in the source file must be reused, not reimplemented. Partial reading leads to duplicate helpers with slightly different behavior — a long-lived maintenance hazard.

---

## Conform to what you found

### Rule: Match the codebase's naming conventions exactly
**Applies to:** Variables, functions, files, types, test names, commit-adjacent identifiers.
**Why:** Robert Martin's "meaningful names" rule is about communication; consistency is half of it. If the codebase uses `getUser`, do not add `fetchUser`. If files are `kebab-case`, do not add a `camelCase` one. Mixed conventions force every reader to hold two vocabularies.

### Rule: Match the local error-handling style
**Applies to:** New operations added to existing functions, loops, handlers.
**Why:** A codebase has a way of handling errors — throw, return a `Result`, log-and-continue, error boundary. New code must use the same one. When adding an operation to an existing loop, mirror how surrounding operations handle failure: if the loop continues past one failure, the new operation should too. Inconsistent error semantics in one block produce surprising partial-failure behavior.

### Rule: Use the project's data access layer — never bypass it
**Applies to:** Any code touching the database or an external store.
**Why:** If the project routes DB access through repositories, services, or query builders, raw ORM or SQL calls bypass the established pattern — losing shared validation, transaction handling, and the seam future refactors depend on. Use the layer that exists.

### Rule: Match the project's typing conventions and strictness
**Applies to:** TypeScript, Python type hints, Go interfaces, Rust traits.
**Why:** If the codebase annotates every function, annotate yours. If it uses branded types, discriminated unions, or a particular generics style, follow it. Do not introduce `any`/`unknown` escape hatches into a strict codebase, and do not over-annotate a codebase that stays light.

### Rule: Follow the existing import and module conventions
**Applies to:** Import ordering, grouping, relative vs. absolute paths, barrel files.
**Why:** Import style is enforced by tooling in many projects; deviating produces lint noise. Even where it is not enforced, consistency keeps diffs clean and reviewable.

### Rule: Match the existing test patterns — structure, fixtures, assertions
**Applies to:** Every new test file or test case.
**Why:** Read an existing test in the same directory before writing one. Reuse the established setup/teardown, factory/fixture helpers, mocking approach, and assertion style. A test that works but looks foreign is friction for everyone who maintains the suite.

---

## Principle of least surprise

The "match adjacent code" and "do not introduce a new pattern when one exists" rules live in `_shared/rules/code-quality.md § Conformance`. They apply to every agent that writes code, not only the engineer. Read that section once; the engineer-specific detection process above is how you find the pattern *before* writing.

### Rule: The style guide outranks local code; local code outranks personal preference
**Applies to:** Any conflict between conventions.
**Why:** Google's code-review standard sets the precedence: an explicit style guide or linter config is the authority. Where no rule covers the case, conform to the surrounding code. Personal preference is never the tiebreaker. If you believe a convention is genuinely wrong, that is a project decision to raise — not a thing to silently deviate from.

---

## Sources

- [Google Engineering Practices — The Standard of Code Review](https://google.github.io/eng-practices/review/reviewer/standard.html)
- [Google Engineering Practices — What to Look For in a Code Review](https://google.github.io/eng-practices/review/reviewer/looking-for.html)
- [Robert C. Martin — Clean Code: A Handbook of Agile Software Craftsmanship](https://www.oreilly.com/library/view/clean-code-a/9780135398586/)
- [Martin Fowler — Refactoring: Improving the Design of Existing Code (2nd ed.)](https://martinfowler.com/books/refactoring.html)
- [The Principle of Least Astonishment](https://en.wikipedia.org/wiki/Principle_of_least_astonishment)
