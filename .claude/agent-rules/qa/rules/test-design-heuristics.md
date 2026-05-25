# QA Rules — Test Design Heuristics

**Read on-demand when the task involves deciding *which* test cases to write — covering an acceptance criterion, an input-processing function, a multi-condition rule, a stateful flow, or a parameterized feature.**

This domain governs how to *generate* a test set: turning a large or infinite input space into a small, justified set of cases that maximizes defect-finding per test. It does not cover what makes an individual test well-written (`_shared/rules/testing.md`) or how to recognize a failure (`oracles.md`).

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

---

## How to use this catalog

Exhaustive testing is impossible — even a single 32-bit integer input has 4 billion values. These techniques are *systematic sampling strategies*: each one models the input space a particular way and tells you which samples carry the most information. Pick the technique that matches the *shape* of what you are testing, not a favorite. Most real features need two or three techniques layered (e.g. equivalence partitioning to find the partitions, then boundary-value analysis on each, then error guessing for the gaps).

The goal is **coverage you can justify** — for every test, you can name the partition, boundary, rule, transition, or risk it exists to exercise. A test you cannot justify this way is usually redundant or arbitrary.

---

## Specification-based techniques

### Technique: Equivalence Partitioning
**What it is:** Divide each input (and output) domain into partitions where every value in a partition is expected to be processed the same way; test one representative value per partition. If a value in a partition reveals a defect, every value in that partition should reveal it — so one is sufficient.
**When to apply:** Any input with a range, set, or category of accepted/rejected values — numeric ranges, enums, string-length limits, account types, status codes. The first technique to run on almost any input-processing function.
**How:**
1. For each input, identify *valid* partitions (values the spec accepts) and *invalid* partitions (values it must reject) — invalid partitions are where bugs hide.
2. Do the same for outputs: partition by each distinct result the feature can produce, then find inputs that land in each.
3. Pick one representative (a "normal" middle value) per partition.
4. Cover every valid partition; cover every invalid partition — but test invalid partitions *one at a time* so one rejection cannot mask another.
**Numeric baseline:** One test per partition. A field with 3 valid + 4 invalid partitions needs ~7 tests, not 7 × all-values.

### Technique: Boundary-Value Analysis (BVA)
**What it is:** Test the edges of each equivalence partition, not just its interior. Defects cluster at boundaries because off-by-one errors (`>=` vs `>`, `<` vs `<=`, fencepost loops) land exactly there.
**When to apply:** Immediately after equivalence partitioning, on every partition with an *ordered* boundary — numeric ranges, date ranges, length/size limits, counts, pagination, quotas, timeouts.
**How:** Use **3-value BVA** (ISTQB v4) per boundary: test the boundary value itself, the value immediately before it, and the value immediately after it. For a field accepting 1–100: test 0, 1, 2 at the low boundary and 99, 100, 101 at the high boundary. 2-value BVA (boundary + nearest value on the other side) is the lighter alternative when test budget is tight. Always include the *empty/zero/min* and *max/overflow* boundaries — empty string, empty list, 0, MAX_INT, max field length, max upload size.
**Numeric baseline:** 3 values per boundary (3-value BVA); 2 per boundary (2-value, lighter).
**Why:** A bug introduced as `if (age > 18)` instead of `>= 18` is invisible to interior tests and certain to be caught by a boundary test at 18.

### Technique: Decision Table Testing
**What it is:** A table enumerating combinations of input conditions and the action/output each combination must produce. Each column is a *rule* — a distinct combination — and becomes one test case.
**When to apply:** Business logic where the result depends on a *combination* of conditions: pricing tiers, discount eligibility, permission/role checks, feature gating, insurance/loan rules, validation with interacting fields. Use it whenever a spec reads "if A and B but not C, then…".
**How:**
1. List the input conditions (rows, top section) and the actions/outputs (rows, bottom section).
2. Enumerate combinations as columns. With *n* boolean conditions there are 2ⁿ combinations — collapse infeasible or "don't care" combinations to keep the table minimal.
3. Each remaining column is one test case: set the inputs, assert the action.
4. Watch for combinations the spec *omits* — an undefined combination is a spec gap and a likely bug; surface it rather than guessing.
**Why:** Combination bugs ("works alone, breaks together") are invisible to one-input-at-a-time testing. The table also exposes contradictory or missing rules in the spec itself.

### Technique: State Transition Testing
**What it is:** Model the feature as states and the events that move between them; test that valid transitions work, produce the right output, and that *invalid* transitions are rejected.
**When to apply:** Anything with a lifecycle or mode — order status (cart → paid → shipped → delivered), auth session (logged-out → logged-in → locked), wizards/multi-step forms, media players, subscription states, draft/published content, connection state machines.
**How:**
1. Draw the state diagram or state table: states × events, each cell = resulting state (or "invalid").
2. Cover every *valid* transition at least once (0-switch coverage).
3. Test *invalid* events from each state — trigger "ship" on an unpaid order, "pause" on a stopped player. These must be rejected cleanly, not crash or silently corrupt state.
4. Test sequences: back/forward, re-entry, refresh mid-flow, double-submit. Many defects only appear across two consecutive transitions (n-switch coverage).
**Why:** State bugs — illegal transitions accepted, state lost on refresh, double-submit — are the classic source of data corruption and are invisible to single-action tests.

### Technique: Pairwise / Combinatorial Testing
**What it is:** When a feature has many independent parameters, testing every combination explodes (5 params × 4 values = 1024 cases). Pairwise generates a much smaller set in which *every pair* of parameter values appears together at least once.
**When to apply:** Configuration-heavy features — settings matrices, browser × OS × locale grids, feature-flag combinations, form with many independent dropdowns. Use it when full combinatorial coverage is infeasible but combinations matter.
**How:** Use a pairwise/orthogonal-array tool (PICT, ACTS, `allpairspy`) — do not hand-build. Feed it the parameters and their values; it emits a covering array. Add back any specific combination known to be high-risk or required by spec. The rationale: empirically, the majority of combination defects are triggered by an interaction of just *two* factors, so all-pairs coverage finds most of them at a fraction of the cost.
**Numeric baseline:** All-pairs typically cuts large grids substantially while retaining most combination-defect detection; savings depend on grid size (negligible for small grids like 3×3×3, dramatic for 5+ parameters with 4+ values each).

---

## Experience-based techniques

### Technique: Error Guessing
**What it is:** Deliberately design tests around how this kind of software *typically fails* — using experience, defect history, and known weak spots — rather than the spec alone.
**When to apply:** As a final layer after the systematic techniques, and earliest when testing a category you have failure data for. Drives the "think adversarially" mandate.
**How:** Enumerate likely failure inputs and exercise them: empty / null / undefined / whitespace-only; zero, negative, very large numbers; numeric overflow and division by zero; strings at and past max length; unicode, emoji, RTL text, leading/trailing spaces; SQL/HTML/script metacharacters in text fields; duplicate submissions and double-clicks; concurrent edits; missing required fields; wrong content types; expired tokens; back-button after submit; slow or dropped network. Keep a checklist in agent memory and grow it with every real defect found.
**Why:** Systematic techniques cover the spec; error guessing covers what the spec forgot. Defects cluster — code that failed one way tends to fail nearby.

### Technique: Exploratory Testing
**What it is:** Simultaneous test design, execution, and learning — explore the feature, form hypotheses about where it breaks, and follow the evidence, rather than running a pre-written script.
**When to apply:** New or unfamiliar features, after fixing a cluster of bugs, when the spec is thin, or to probe areas the scripted tests left thin. Time-box it (a "session").
**How:** Pick a charter (a focused mission, e.g. "probe file-upload error handling for 40 minutes"). Vary one thing at a time and observe. When something looks off, narrow it to a minimal reproduction. Take notes — capture every anomaly, not just confirmed bugs — and afterward convert reproducible findings into permanent automated tests so the regression cannot recur silently.
**Why:** Scripted tests only find the defects you anticipated. Exploration finds the ones you did not — and feeds them back into the systematic suite.

---

## Choosing and combining techniques

| What you are testing | Primary technique(s) |
|---|---|
| A single input with a range or value set | Equivalence partitioning + boundary-value analysis |
| Logic depending on a combination of conditions | Decision table |
| A feature with states / a lifecycle | State transition |
| Many independent configuration parameters | Pairwise / combinatorial |
| Error handling, robustness, the unhappy path | Error guessing |
| A new or under-specified feature | Exploratory (time-boxed), then formalize findings |

Layer them: partition the inputs, boundary-test each partition, decision-table the interacting conditions, state-test the lifecycle, then error-guess the gaps. A single acceptance criterion often needs cases from three of these.

---

## Sources

- [ISTQB — Certified Tester Foundation Level Syllabus v4.0 (§4 Test Analysis and Design)](https://www.istqb.org/certifications/certified-tester-foundation-level)
- [ISTQB — 4.2 Black-Box Test Techniques](https://astqb.org/4-2-black-box-test-techniques/)
- [ISTQB — Boundary Value Analysis white paper](https://istqb.org/wp-content/uploads/2025/10/Boundary-Value-Analysis-white-paper.pdf)
- Glenford J. Myers, Tom Badgett, Corey Sandler — *The Art of Software Testing*, 3rd ed. (Wiley) — equivalence partitioning, boundary-value analysis, cause-effect graphing, error guessing
- Cem Kaner, James Bach, Bret Pettichord — *Lessons Learned in Software Testing* (Wiley)
- [NIST — Practical Combinatorial (Pairwise) Testing, SP 800-142](https://csrc.nist.gov/publications/detail/sp/800-142/final)
- [Microsoft PICT — Pairwise Independent Combinatorial Testing tool](https://github.com/microsoft/pict)
- [Elisabeth Hendrickson — Exploratory Testing / *Explore It!*](https://pragprog.com/titles/ehxta/explore-it/)
- [James Bach — Exploratory Testing Explained](https://www.satisfice.com/download/exploratory-testing-explained)
