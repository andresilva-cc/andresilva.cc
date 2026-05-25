# Testing Rules — What Makes a Test Good

**Read on-demand when the task involves writing tests, reviewing test code, or verifying test quality — TDD cycles, new test suites, mock/stub design, or judging whether existing coverage is real or false confidence.**

This domain governs test *quality*: meaningful assertions, the right test level, mock fidelity, edge-case coverage, isolation, and determinism. It does not cover what to ship — release gating belongs in the project's own docs.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

---

## What a test is for

### Rule: A test must be able to fail for the reason it claims to check
**Applies to:** Every test, especially regression tests added after a fix.
**Why:** A test that passes against broken code is worse than no test — it sells false confidence. After writing a test, break the production code (or write it before the fix exists) and confirm the test fails with a relevant message. xUnit Test Patterns documents this failure mode under the "Liar" smell (the test passes regardless of SUT correctness) and the related "no-assertion" / "Smoke Test" smells.

### Rule: Every test has at least one meaningful assertion on observable behavior
**Applies to:** All test levels.
**Why:** Tests that only exercise code without asserting outcomes ("smoke-only" tests) inflate coverage numbers while catching nothing but crashes. Assert on returned values, emitted events, persisted state, or rendered output — not merely "it did not throw."

### Rule: Test behavior and public contract, not implementation details
**Applies to:** Unit and integration tests.
**Why:** Testing Library's core principle: "the more your tests resemble the way your software is used, the more confidence they can give you." Tests bound to private methods, internal state, or call sequences break on every refactor even when behavior is unchanged — they punish improvement and erode trust in the suite.

### Rule: One test verifies one behavior
**Applies to:** Unit tests primarily; integration tests may span more.
**Why:** The "Eager Test" smell — one test exercising many production methods — makes failures ambiguous and the test fragile. A focused test names the exact behavior that broke and survives unrelated changes.

---

## Assertions

### Rule: Assert specific expected values, not loose predicates
**Applies to:** All assertions.
**Why:** `expect(result).toBeTruthy()` or `assert result is not None` passes for many wrong values. Assert the exact expected value, shape, or set so the test rejects regressions, not just nulls.

### Rule: Avoid Assertion Roulette — make every assertion identifiable
**Applies to:** Tests with more than one `assert`/`expect`.
**Why:** Multiple assertions are fine when they together describe one behavior — but each must be identifiable on failure. When several bare assertions share a test, a failure does not say which one broke (xunitpatterns.com "Assertion Roulette"). Give each assertion a descriptive message, assert on a whole object/structure in one call, or split into separate tests.

### Rule: No conditional logic inside a test
**Applies to:** Test bodies — `if`, loops with branching, `try/catch` used as control flow.
**Why:** "Conditional Test Logic" smell: branches mean some assertions silently never run, and the test can pass without checking anything. The test path must be straight-line. Use parameterized/table-driven tests instead of loops with embedded conditionals.

### Rule: No magic numbers or unexplained literals in tests
**Applies to:** Expected values, fixture inputs.
**Why:** "Magic Number Test" smell — a bare `42` or `"x7gT"` hides why that value matters. Name constants or derive expected values so the test documents intent.

### Rule: Assert error paths, not just the happy path
**Applies to:** Any code with failure modes — validation, I/O, parsing, network.
**Why:** Error handling is where bugs hide and where production breaks. Assert that the right exception/error type is raised, with the right message, for each invalid input — not just that "something" failed.

---

## The test pyramid — choosing the level

### Rule: Most tests are unit tests; fewer integration; fewest end-to-end
**Numeric baseline:** Rough guide ~70/20/10 (unit/integration/E2E); exact ratio varies by project.
**Applies to:** Overall suite composition.
**Why:** Mike Cohn's test pyramid. Unit tests are fast and pinpoint failures; E2E tests are slow, brittle, and give vague failures. An "ice-cream cone" (mostly E2E) suite is slow to run and expensive to maintain. Front-end SPAs often invert toward integration-heavy ("testing trophy", Kent C. Dodds) — the shape (broad base, narrow top), not the exact ratio, is the rule.

### Rule: Push each test to the lowest level that can verify the behavior
**Applies to:** Deciding where a new test belongs.
**Why:** A bug catchable by a unit test should not need an E2E test. Lower levels are faster, cheaper, and localize the failure. Reserve higher levels for behavior that genuinely emerges from integration.

### Rule: Use integration tests for boundary contracts, not for logic
**Applies to:** Database access, HTTP clients, message queues, file I/O.
**Why:** Integration tests exist to verify that components actually wire together — real serialization, real SQL, real schema. Pure business-logic branches belong in unit tests where they run in milliseconds.

### Rule: Keep E2E tests few and reserved for critical user journeys
**Applies to:** Browser/UI and full-stack flows.
**Why:** E2E tests are the slowest and flakiest layer. Cover only revenue/safety-critical paths (signup, checkout, auth) end-to-end; verify variations and edge cases at lower levels.

---

## Mocks, stubs, and test doubles

### Rule: A mock must match the real dependency's API surface
**Applies to:** Every hand-written or framework mock of an external module/service.
**Why:** A mock that returns a shape the real API never produces makes tests pass while production breaks. Mocks drift as the real API evolves. Where the boundary is critical, back mocks with contract tests (Pact, Spring Cloud Contract) or schema validation (OpenAPI) so drift is caught.

### Rule: Mock only what you do not own — boundaries, not your own code
**Applies to:** Choosing what to double.
**Why:** Mocking your own internal collaborators couples tests to internal structure (overlapping with "test implementation details"). Mock the network, clock, filesystem, and third-party SDKs; let your own units run for real.

### Rule: Prefer a fake or in-memory implementation over a deep mock
**Applies to:** Repositories, clocks, ID generators, queues.
**Why:** A fake (working simplified implementation) exercises real behavior across many tests without per-test stubbing. Deep mocks with hand-scripted return values are brittle and re-encode assumptions in every test.

### Rule: Verify interactions only when the interaction is the behavior
**Applies to:** `expect(mock).toHaveBeenCalledWith(...)` style assertions.
**Why:** Asserting "method X was called" tests *how*, not *what*. Use it only when the side effect is the contract (e.g. "an email was sent"). Otherwise assert on resulting state — over-specified call assertions break on harmless refactors.

### Rule: Do not mock the system under test
**Applies to:** The unit/module being tested.
**Why:** Partially mocking the class under test means the test verifies the mock, not the code. If a class is too entangled to test without self-mocking, that is a design smell — extract collaborators.

---

## Isolation and order-independence

### Rule: Each test builds its own fresh fixture
**Applies to:** All tests.
**Why:** xUnit Test Patterns "Fresh Fixture": a test that constructs its own state cannot be polluted by, or pollute, another test. Shared mutable fixtures cause "Interacting Tests" and order-dependent failures.

### Rule: Tests must pass in any order and in isolation
**Applies to:** The whole suite.
**Why:** Order-dependent tests are a top flakiness cause — research on JS suites traces order dependence to shared files and shared mocking state. Run the suite shuffled and run single tests alone; both must pass.

### Rule: Reset all shared and global state between tests
**Applies to:** Singletons, module-level caches, mock call history, env vars, registered listeners, the DOM.
**Why:** State leaking across tests produces "passes alone, fails in suite" bugs. Reset mocks and clear global state in setup/teardown — shared mock state in particular is a documented new source of order-dependent flakiness.

### Rule: Clean up every resource the test creates
**Numeric baseline:** Prefer cleanup at setup (next run) or via automated/guaranteed teardown over best-effort `afterEach`.
**Applies to:** DB rows, temp files, spawned processes, open connections, timers.
**Why:** Leaked resources accumulate and cause later failures or "Resource Optimism" smells. Use transaction rollback, automated teardown, or unique-per-test namespaces. Teardown that only runs on success leaves debris when a test throws.

### Rule: Tests must not depend on external network or live third-party services
**Applies to:** Unit and most integration tests.
**Why:** Uncontrolled external dependencies are a leading flakiness source. Stub the network; if a test genuinely needs a real service, isolate it in a separate, clearly-labeled suite.

---

## Determinism — no flaky tests

### Rule: Never use fixed `sleep` to wait for async work
**Applies to:** Async tests, UI tests, anything awaiting a future event.
**Why:** Async wait is the dominant flaky-test category in UI/E2E suites (~45% per Romano et al.) and a top-3 cause across general suites (Luo et al., FSE 2014). A fixed sleep is either too short (flaky) or too long (slow). Await the actual promise/signal, or poll a condition with a timeout (`waitFor`).

### Rule: Inject the clock — never let tests depend on real time
**Applies to:** Code using `now()`, dates, timeouts, TTLs, scheduling.
**Why:** Real-time dependence makes tests fail at midnight, month boundaries, or DST changes. Inject a controllable clock or use fake timers so time is an explicit input.

### Rule: Control all randomness with a fixed seed or injected generator
**Applies to:** Code using RNGs, UUIDs, shuffles.
**Why:** Unseeded randomness makes a test occasionally fail with no reproduction. Seed the generator or inject it so the test is deterministic and the failure reproducible.

### Rule: Do not assert on unordered collection iteration order
**Applies to:** Assertions over sets, maps, hash-backed structures, DB rows without `ORDER BY`.
**Why:** Iteration order of unordered structures is not guaranteed and varies across runtimes/runs. Sort before asserting, or assert set membership rather than sequence.

### Rule: Quarantine or fix flaky tests immediately — never ignore them
**Applies to:** Any test observed to fail intermittently.
**Why:** A tolerated flaky test trains the team to ignore red builds, masking real regressions. Within one working day of observing the flake, open a tracked ticket and either fix the root cause or move the test out of the gating suite (skip/quarantine). Never leave a known-flaky test in the green/red signal — it corrupts the meaning of every build that follows.

---

## Naming, structure, and readability

### Rule: A test name states the scenario and expected behavior
**Applies to:** Every test.
**Why:** A name like `test_works` documents nothing; `withdraw_fails_when_balance_below_amount` reads as a spec line and identifies the failure from the report alone. Given/When/Then or "method_condition_expectedResult" both work — pick one and apply it consistently.

### Rule: Structure tests as Arrange-Act-Assert (Given-When-Then)
**Applies to:** Test bodies.
**Why:** A consistent three-phase shape makes tests scannable: setup, the single action under test, then assertions. Blurring the phases (asserting mid-arrange, multiple act steps) signals the test is doing too much.

### Rule: Keep test setup visible — avoid the Mystery Guest
**Applies to:** Fixture data, shared helpers, external files.
**Why:** "Mystery Guest" smell: a test whose inputs/expected values live in an unseen external file or distant fixture cannot be understood in place. Keep the data relevant to the test near it, or behind a clearly-named builder.

### Rule: Use test data builders or factories for fixture construction
**Applies to:** Any test that needs a non-trivial object graph, or any object instantiated repeatedly across the suite.
**Why:** Builders/factories (Pryce & Freeman, *Growing Object-Oriented Software*; Schuchert's "Object Mother") give every test a local, readable construction site — sensible defaults supplied by the builder, with per-test overrides for only the fields that matter to that test. This removes the duplication of inline fixtures without hiding inputs in a distant shared fixture (the Mystery Guest trap). The values that matter to the test stay visible in the test; the irrelevant ones stay out of the way.

### Rule: Tests get the same code-quality bar as production code
**Applies to:** All test code.
**Why:** Tests are read far more than written and are the executable spec. Duplication, dead assertions, and unclear helpers ("Test Code Duplication", "Obscure Test" smells) make the suite a maintenance liability that gets deleted instead of fixed.

---

## What to test, what not to

### Rule: Cover edge cases and boundaries, not just the typical input
**Applies to:** Any input-processing code.
**Why:** Bugs cluster at boundaries: empty, null/undefined, zero, negative, off-by-one limits, max length, unicode, duplicates, and concurrent access. The typical-input test rarely catches real defects.

### Rule: Do not test the framework, the language, or third-party libraries
**Applies to:** Test scope decisions.
**Why:** Tests asserting that the ORM saves a row or the framework routes a request test code you do not own and will not change. They add maintenance cost and noise without catching your bugs.

### Rule: Do not write tests purely to hit a coverage number
**Applies to:** Coverage-driven test writing.
**Why:** Coverage measures lines executed, not behavior verified. Tests written to color a line green typically have weak or no assertions — false confidence. Coverage is a gap-finding tool, not a quality target.

### Rule: When fixing a bug, first add a test that reproduces it
**Applies to:** Every bug fix.
**Why:** A failing test proves the bug exists, proves the fix works when it goes green, and prevents regression. Fixing without a reproducing test risks fixing the wrong thing and re-breaking later.

---

## Sources

- Gerard Meszaros — *xUnit Test Patterns: Refactoring Test Code* (Addison-Wesley)
- [xUnitPatterns.com — Test Smells](http://xunitpatterns.com/TestSmells.html)
- [xUnitPatterns.com — Assertion Roulette](http://xunitpatterns.com/Assertion%20Roulette.html)
- [xUnitPatterns.com — Fresh Fixture](http://xunitpatterns.com/Fresh%20Fixture.html)
- [xUnitPatterns.com — Automated Teardown](http://xunitpatterns.com/Automated%20Teardown.html)
- [testsmells.org — Software Unit Test Smells](https://testsmells.org/pages/testsmells.html)
- [The Open Catalog of Test Smells](https://test-smell-catalog.readthedocs.io/en/latest/)
- [Martin Fowler — The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)
- [Martin Fowler — TestPyramid (bliki)](https://martinfowler.com/bliki/TestPyramid.html)
- [Martin Fowler — GivenWhenThen (bliki)](https://martinfowler.com/bliki/GivenWhenThen.html)
- Mike Cohn — *Succeeding with Agile* (origin of the test pyramid)
- [Testing Library — Guiding Principles](https://testing-library.com/docs/guiding-principles/)
- [Kent C. Dodds — Introducing the React Testing Library](https://kentcdodds.com/blog/introducing-the-react-testing-library)
- [Detecting and Evaluating Order-Dependent Flaky Tests in JavaScript (arXiv 2501.12680)](https://arxiv.org/pdf/2501.12680)
- [Romano et al. — An Empirical Analysis of UI-based Flaky Tests (arXiv 2103.02669)](https://arxiv.org/abs/2103.02669)
- [Google Testing Blog / flaky-test literature on async timing and shared state](https://testing.googleblog.com/)
- [Pact — Contract Testing](https://docs.pact.io/)
