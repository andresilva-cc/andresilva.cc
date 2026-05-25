# QA — Project-Specific Instructions

Read this file at the start of every QA pass.

You verify that a completed implementation phase meets its acceptance criteria, works end to end, and breaks nothing from earlier phases. The agent template (`templates/qa.md`) owns the *workflow* — gather context, extract criteria, run the suite, verify, browser-test, report. This file owns *what craft knowledge to load* for each step.

---

## Routing block — rule files

Read a file only when the current step actually needs that domain. Do NOT read all of them up front — load on-demand and avoid burning context on knowledge the phase does not touch.

- **Deciding which test cases to write** for a criterion or function → `.claude/agent-rules/qa/rules/test-design-heuristics.md`
- **Deciding whether observed behavior is a bug** — judging a result, an exploratory finding, or arguing a defect with no matching AC → `.claude/agent-rules/qa/rules/oracles.md`
- **Verifying UI work in a browser** — flows, responsive, console/network, the Chrome DevTools MCP procedure → `.claude/agent-rules/qa/rules/browser-testing.md`
- **Issuing the GO / GO-with-warnings / NO-GO verdict** or classifying a bug's severity → `.claude/agent-rules/qa/rules/go-nogo-rubric.md`
- **Writing a new test or judging whether existing coverage is real** — test quality, the test pyramid, mocks, flakiness → `.claude/agent-rules/_shared/rules/testing.md`
- **Running an accessibility audit** of a UI surface — the WCAG 2.2 AA criteria and the mandatory manual checks → `.claude/agent-rules/_shared/rules/accessibility.md`
- **Phase touches auth, payments, or PII** — running a security spot-check → `.claude/agent-rules/_shared/rules/security.md`

The first four files are QA-specific. The last three are **shared** — authored once, consumed by several agents. Apply them; never restate their content here or in the QA-specific files.

---

## How the pieces fit the workflow

1. **Extract acceptance criteria** (template Step 2) — each AC becomes a testable assertion.
2. **Run the existing suite** (Step 3) — a partial automation of the History (regression) oracle.
3. **Verify each AC** (Step 4) — where no test covers an AC, use `test-design-heuristics.md` to generate the cases (partition the inputs, boundary-test them, decision-table the interacting conditions, state-test the lifecycle, error-guess the gaps) and `_shared/rules/testing.md` to write them well.
4. **Judge what you observe** — use `oracles.md` (FEW HICCUPPS) to decide whether a result is a defect, including defects that satisfy every AC but violate a consistency oracle.
5. **Browser-test UI phases** (Step 5) — follow `browser-testing.md`; audit accessibility against `_shared/rules/accessibility.md`.
6. **Issue the verdict** (Step 6) — classify every bug's severity and apply `go-nogo-rubric.md` to produce GO / GO-with-warnings / NO-GO.

**The rule files are toolkit-managed and static.** Read and apply them — never edit them to fit a project. Project-specific conventions (this codebase's test stack, its core flows, its known-fragile areas) are project *decisions*: they live in the project docs and your agent memory, never in a rules file.
