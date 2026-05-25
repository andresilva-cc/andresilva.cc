# Delivery Rules — Acceptance Criteria

**Read on-demand when the task involves writing, reviewing, testing, or verifying acceptance criteria for a work item — issue, story, or task.**

Acceptance criteria (ACs) are the contract for a work item: the conditions that must hold for it to be considered done. This file defines what makes an AC good. The tech-lead writes ACs, the engineer implements and tests against them, the code-reviewer checks the change satisfies them, and QA verifies them. Every rule below is decidable — an AC either meets it or it does not.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

---

## Verifiability

### Rule: Every AC must be objectively testable — pass/fail with no judgment call

**Applies to:** Every acceptance criterion on every work item.
**Why:** An AC exists to be verified. If two reasonable people can disagree on whether it passed, it cannot gate "done." Each AC must map to a concrete check — automated test, manual step, or observable system state — that yields an unambiguous pass or fail.

### Rule: Replace subjective adjectives with measurable thresholds

**Numeric baseline:** Any quantifiable criterion states a number and unit — "responds within 300 ms at p95," not "responds fast."
**Applies to:** Performance, capacity, limits, timeouts, counts, sizes, and any criterion tempted toward words like "fast," "intuitive," "robust," "user-friendly," "scalable."
**Why:** Subjective words are not testable — they defer the argument to verification time. A measurable threshold settles it up front and gives the engineer a target and QA a check.

### Rule: Each AC must be verifiable independently of the others

**Applies to:** All ACs on a work item.
**Why:** ACs are checked one at a time. If verifying criterion 3 requires assuming criterion 5 already passed, a failure cannot be localized. Each criterion stands as its own self-contained check.

---

## Form and structure

### Rule: Prefer the Given-When-Then form for behavioral criteria

**Applies to:** Criteria describing system behavior in response to an action or event. Pure constraints (e.g., "the export file is UTF-8 encoded") may be stated as a plain rule.
**Why:** Given (starting context/state) — When (the action or trigger) — Then (the observable outcome) forces every behavioral AC to name its precondition, its trigger, and its expected result. Missing any of the three is the most common source of ambiguous criteria, and Given-When-Then makes the gap visible. It also maps directly onto an automated test's arrange/act/assert.

### Rule: One behavior per acceptance criterion

**Applies to:** Every AC. An AC with "and" joining two outcomes, or multiple When/Then pairs, is two criteria.
**Why:** A criterion covering several behaviors cannot fail cleanly — when it fails you do not know which behavior broke, and it maps to several tests rather than one. Split it. One AC, one behavior, one verdict.

### Rule: State the trigger and the actor explicitly — no implied subject

**Applies to:** The "When" of every behavioral criterion.
**Why:** "When the order is cancelled" hides *who or what* cancels it (the customer? an admin? a timeout job?) — and the behavior often differs by actor. Name the actor and the exact action so the criterion is unambiguous and the test sets up the right path.

---

## Coverage

### Rule: Every must-have behavior is its own explicit AC — never buried in a note, description, or comment

**Applies to:** The full work item. Scan the description and any "Notes" for behavioral requirements that are not in the AC list.
**Why:** A *must-have* is a behavior whose absence makes the item incomplete (as opposed to nice-to-have or future work, which belongs in a separate item). Anything not listed as an AC is not part of the "done" contract — it will not be implemented reliably, tested, or checked in review. Prose notes get skimmed and forgotten. If a behavior must hold for the item to be complete, promote it to an explicit AC. Notes are for context, not requirements.

### Rule: Cover the happy path, the error paths, and the edge cases

**Applies to:** Every work item with non-trivial behavior.
**Why:** ACs that describe only the success scenario leave failure behavior undefined — the engineer guesses and QA cannot verify it. Explicitly specify: invalid input, unauthorized access, missing/absent data, empty and maximum boundary values, concurrency and duplicate actions, and downstream-dependency failure. Each gets its own criterion.

### Rule: Define behavior for every distinct user role or permission level the item touches

**Applies to:** Work items whose behavior varies by role, permission, plan tier, or feature flag.
**Why:** "The user can edit the record" is incomplete if an unauthorized user must instead be denied. Each distinct actor's expected outcome — permitted, denied, partially permitted — is a separate, explicit criterion.

### Rule: Consider non-functional acceptance criteria per item

**Applies to:** Every work item, at AC-writing time.
**Why:** Functional ACs say *what* the system does; non-functional ACs constrain *how well*. For each item, walk the NFR axes and add an explicit AC where one applies: performance (latency/throughput budget at a stated percentile), security (authn/authz boundary, input handling, data exposure), accessibility (the floor the change must meet — e.g., WCAG level, keyboard reachability), and observability (the specific log line, metric, or alert the change must emit). Axes that genuinely do not apply can be skipped, but the decision must be deliberate — silently omitting NFRs is how regressions in performance, security, accessibility, and operability ship.

---

## Boundaries — what an AC must not contain

### Rule: ACs state observable behavior, not implementation detail

**Applies to:** Every AC. Reject criteria naming specific functions, classes, table names, libraries, or algorithms.
**Why:** An AC is a contract about *what* the system does, observable from outside; *how* it is built is the engineer's decision and may change without changing the behavior. Implementation detail in an AC over-constrains the engineer and makes the criterion break on harmless refactors. "Passwords are stored hashed, not in plaintext" is observable; "passwords are hashed with the bcrypt npm package in `auth/hash.ts`" is implementation.

### Rule: ACs describe the work item's own scope — not the whole feature or unrelated behavior

**Applies to:** The AC list of each individual work item.
**Why:** ACs that reach beyond the item's scope make it un-completable and un-estimable. Each criterion must be satisfiable by the change this item delivers. Cross-item behavior belongs to the parent epic or its own item.

### Rule: ACs are item-specific behavior, not the team's Definition of Done

**Applies to:** Every work item. Reject ACs that restate team-wide gates (tests passing, code reviewed, deployed, docs updated, lint clean).
**Why:** ACs are the *item-specific* behavioral conditions that distinguish this work from any other. The team's Definition of Done — tests pass, code reviewed, merged, deployed, documentation updated — is a separate, global gate that applies to every item identically and lives in the team's process docs, not in the AC list. Restating it per item is noise, hides the real item-specific criteria in a sea of boilerplate, and lets the team drift into thinking "DoD met" is "ACs met."

---

## Item-level quality (INVEST)

### Rule: The work item itself must be Independent, Negotiable, Valuable, Estimable, Small, and Testable

**Applies to:** The work item as a whole, before its ACs are finalized. If it fails a letter, reword or split it.
**Why:** ACs cannot rescue a badly-scoped item. INVEST is the checklist: **I**ndependent — completable without waiting on another item; **N**egotiable — the *what* is fixed but the detail stays open to discussion; **V**aluable — delivers a discernible slice of user or business value; **E**stimable — the team can size it (if not, it is too vague or too big); **S**mall — completable within the team's standard cycle without further splitting; **T**estable — has clear, verifiable ACs. An item that is not Small or not Estimable must be split.

### Rule: Each AC maps to at least one named verification path; each must-have behavior maps to at least one AC

**Applies to:** The handoff from tech-lead to engineer and QA.
**Why:** This is the traceability chain that makes "done" mean something: behavior → AC → verification. Every AC must have at least one explicitly identified verification path — an automated test, a manual QA step, or an observable production check (log, metric, dashboard, alert). Not every AC needs an automated test (some behaviors are not economically automatable, or are infrastructure/operational), but the verification mechanism must exist and be named, not assumed. If a behavior has no AC it will not be built reliably; if an AC has no named verification path it cannot gate "done." The engineer should be able to point from each AC to the verification covering it, and the reviewer should check that mapping exists.

### Rule: Finalize ACs before implementation starts, and re-baseline them on scope change

**Applies to:** The work item lifecycle — ACs are defined up front, not reverse-engineered from the built code.
**Why:** ACs written after the fact describe what was built, not what was needed — they cannot catch a missed requirement. Define them before work begins so they shape the implementation and the tests. If scope legitimately changes mid-flight, update the ACs explicitly and deliberately; never let the code silently redefine "done."

---

## Sources

- [ISTQB — Foundation Level Syllabus](https://www.istqb.org/certifications/certified-tester-foundation-level)
- [Agile Alliance — INVEST glossary entry](https://agilealliance.org/glossary/invest/)
- [Bill Wake — INVEST in Good Stories, and SMART Tasks](https://xp123.com/articles/invest-in-good-stories-and-smart-tasks/)
- [Wikipedia — INVEST (mnemonic)](https://en.wikipedia.org/wiki/INVEST_(mnemonic))
- [Cucumber — Gherkin Reference](https://cucumber.io/docs/gherkin/reference/)
- [Cucumber — Behaviour-Driven Development](https://cucumber.io/docs/bdd/)
- [Martin Fowler — Given-When-Then](https://martinfowler.com/bliki/GivenWhenThen.html)
- [Martin Fowler — Specification by Example](https://martinfowler.com/bliki/SpecificationByExample.html)
- [Gojko Adzic — Specification by Example](https://gojko.net/books/specification-by-example/)
- [Agile Alliance — Acceptance Criteria glossary entry](https://agilealliance.org/glossary/acceptance/)
- [Mountain Goat Software (Mike Cohn) — Acceptance Criteria](https://www.mountaingoatsoftware.com/agile/user-stories)
