# Engineer Rules — Verification

**Read on-demand when finishing a task, before reporting it complete, or whenever you need to decide what "done" means.**

This domain governs the gap between "I wrote code" and "the task is done." Code that compiles is not verified code. Verification is the act of producing evidence that the change works, breaks nothing, and matches its specification.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

---

## The completion bar

### Rule: A task is not done until verification produces evidence, not belief
**Applies to:** Every task, every acceptance criterion.
**Why:** "It should work" is a hypothesis. "Done" requires an observation: a passing test, a clean type-check, an actual run. Reporting a task complete on the strength of having written the code — without running anything — is the single most common failure mode. Treat unverified code as unfinished code.

### Rule: Run the full relevant test suite, not only the tests you added
**Applies to:** Every task that touches shared code, exported functions, or modules with existing tests.
**Why:** New tests prove the new behavior; the existing suite proves you did not break old behavior. A change can make its own tests green while silently breaking a caller. Kent Beck's standard for a finished TDD cycle is explicit: "everything that used to work still works" — that is a claim only the full suite can support.

### Rule: Run lint and type-check before reporting complete, when the project has them
**Applies to:** Projects with a linter (ESLint, Ruff, Clippy, golangci-lint) or a type system (TypeScript, mypy, Sorbet).
**Why:** A lint or type error that lands in the branch becomes the reviewer's problem and often the CI's red build. These tools are fast and deterministic — there is no reason to let a human or CI find what `tsc --noEmit` or `ruff check` finds in seconds. Find the command in the project's `package.json` scripts, `Makefile`, `pyproject.toml`, or CI config.

### Rule: Run the code, not just the tests
**Applies to:** New entry points, CLI commands, scripts, API routes, UI flows, migrations.
**Why:** Tests exercise units in isolation; they routinely miss wiring failures — an unregistered route, an uninvoked worker, a bad import path, a config that fails to load. Execute the actual code path a user or caller would hit. If it is a server, start it and hit the endpoint. If it is a CLI, invoke it. Tests passing while the app fails to boot is a real and frequent outcome.
**Scope:** For UI flows beyond a smoke check, QA owns in-browser verification — see `qa/rules/browser-testing.md`. The engineer's bar here is: the server starts, the route responds, the entry point fires.

---

## Regression and integration checks

### Rule: After a bug fix, grep for every other instance of the same pattern
**Applies to:** Bug fixes, especially copy-paste bugs, missing guards, missing `await`, off-by-one patterns.
**Why:** Bugs that arose from a repeated pattern almost always recur elsewhere in the same codebase. Fixing one occurrence and stopping leaves the same defect live in N−1 places. Search the whole tree for the pattern before marking the fix done.

### Rule: Verify new functions are wired into a live entry point
**Applies to:** New workers, handlers, triggers, routes, event listeners, scheduled jobs, exported utilities.
**Why:** A function that nothing calls is dead code that passes its unit tests. After implementing a unit of behavior, trace it back to a real invocation point — registration, route table, dependency-injection container, export barrel — and confirm it is reachable.

### Rule: Verify the actual API/data shape before trusting an interface
**Applies to:** Tasks that consume an API response, a DB row, a message payload, or any cross-boundary data.
**Why:** Frontend interfaces and backend responses drift. An assumed shape that is wrong produces `undefined` reads and silent bugs that no type-checker catches (the type was a lie). Inspect the route handler's return value, the schema, or make a real request before defining or trusting the type.

### Rule: Confirm the negative case is also covered
**Applies to:** Any function with branches, validation, filtering, or error handling.
**Why:** Happy-path-only verification confirms the code runs, not that it is correct. Before reporting complete, confirm an existing or new test exercises the failure / edge path (empty input, missing field, wrong-key retrieval, FK-constrained delete with related rows present). Test *design* — what to assert, how to structure the test — lives in `_shared/rules/testing.md § Assert error paths`; this rule is the verification-side check that such a test exists.

---

## Configuration and schema verification

### Rule: Verify config values and defaults against the actual schema file
**Applies to:** Any task that reads, sets, or documents a config field or its default.
**Why:** Plans, READMEs, and comments lag behind code. The schema (Zod, Pydantic, JSON Schema, env-var loader, struct tags) is the source of truth for field names, types, and defaults. Trust the schema, not the prose describing it.

### Rule: Confirm config actually loads in the target environment
**Applies to:** New or changed config keys, env vars, feature flags.
**Why:** A config key that is read but never set, or set with the wrong name, fails silently — falling back to a default or `undefined`. Verify the value is present and correctly typed at the point the code reads it, not just that the schema permits it.

---

## Reporting

### Rule: State what you ran and what you observed, not "done"
**Applies to:** Every task completion report.
**Why:** A useful completion report names the verification performed: which test command ran, the pass count, the lint/type result, the manual run and its observed output. This lets the orchestrator and reviewer trust the result without re-deriving it. "Task complete" with no evidence forces a full re-verification downstream.

### Rule: Never weaken a test, mock away a failure, or skip a check to get to green
**Applies to:** All verification work.
**Why:** Deleting an assertion, broadening a mock, adding `.skip`, or loosening a type to silence a failure converts a real signal into a false "done." If a test fails, the code or the test is wrong — fix the cause. If a check genuinely cannot pass for a legitimate reason, that is a blocker to escalate, not a check to suppress.

---

## Sources

- [Kent Beck — Test-Driven Development: By Example (Addison-Wesley, 2002)](https://www.oreilly.com/library/view/test-driven-development/0321146530/)
- [Kent Beck — Canon TDD](https://tidyfirst.substack.com/p/canon-tdd)
- [Martin Fowler — Test Driven Development (bliki)](https://martinfowler.com/bliki/TestDrivenDevelopment.html)
- [Robert C. Martin — The Cycles of TDD](https://blog.cleancoder.com/uncle-bob/2014/12/17/TheCyclesOfTDD.html)
- [Google Engineering Practices — The Standard of Code Review](https://google.github.io/eng-practices/review/reviewer/standard.html)
- [Robert C. Martin — Clean Code: A Handbook of Agile Software Craftsmanship](https://www.oreilly.com/library/view/clean-code-a/9780135398586/)
