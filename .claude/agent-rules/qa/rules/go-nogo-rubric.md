# QA Rules — Go / No-Go Rubric

**Read on-demand when the task involves issuing a release verdict — deciding GO / GO-with-warnings / NO-GO for a phase, classifying a bug's severity, or judging whether a regression blocks shipping.**

This is the decision matrix that turns test findings into a verdict. `test-design-heuristics.md` and `oracles.md` produce the findings; this file decides what they *mean* for shipping the phase.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

---

## How to use this rubric

A QA pass produces a list of findings: AC results, test-suite results, bugs, regressions. The verdict is a *function* of those findings, not a vibe. Two principles govern it:

1. **The verdict is conservative.** A single qualifying blocker forces NO-GO regardless of how much else passes. You cannot average a critical bug away with passing criteria.
2. **The verdict is honest.** If a criterion could not be fully verified, it is not a pass — it is PARTIAL, and PARTIAL on a non-trivial criterion pulls the verdict down. Never round a PARTIAL up to GO to make the report look cleaner.

The orchestrator and the user act on this verdict. An over-optimistic GO that ships a critical bug is worse than a NO-GO that holds a phase one extra cycle.

---

## Step 1 — Classify every bug by severity

Severity is **impact on the user/business**, independent of how easy it is to fix. Classify each bug before computing the verdict.

**Core vs. non-core.** This distinction is load-bearing across Steps 1–3.

- **Core flow** = a primary product flow a user must complete for the product to deliver its value: signup/login, the product's primary action (the thing the user came to do), payment/checkout, auth state changes. If breaking this flow stops the user dead, it is core.
- **Non-core flow** = secondary feature, polish surface, admin-only path, edge case, or a flow with a viable workaround. Breaking it degrades the product without stopping the primary user journey.

When in doubt, ask: "Can a user complete the product's primary job without this?" If no, it is core.

| Severity | Definition | Examples |
|---|---|---|
| **Critical (blocker)** | Breaks a core flow, loses or corrupts data, exposes a security hole, or has no workaround. The phase cannot ship. | Crash on a primary flow; data loss on save; auth bypass; exposed secret/PII; payment charged incorrectly; a core acceptance criterion fails. |
| **Major** | Significant feature broken or wrong, but a workaround exists or the flow is non-core. Ships only with explicit acknowledgement. | A secondary feature throws; wrong result on an edge case; a flow works but only via an unobvious workaround; broken layout on a supported breakpoint. |
| **Minor** | Noticeable but does not block the user from completing any task. | Cosmetic misalignment; awkward copy; a non-blocking console warning; slow but functional interaction. |
| **Trivial** | Polish-level; near-zero user impact. | Pixel nudge; rare typo in a low-traffic string; ideal-but-not-required enhancement. |

**Severity vs. priority.** Severity is user impact; priority is fix urgency. QA owns *severity* — assign it honestly and let the orchestrator/user decide priority. Do not soften a Critical to Major because the deadline is close.

---

## Step 2 — Apply the regression policy

A **regression** is any behavior that worked in a previous phase and is now broken or changed without a task in the current phase intending the change. The History oracle (`oracles.md`) detects them; the full pre-existing test suite is its partial automation.

| Regression finding | Effect on verdict |
|---|---|
| Any regression in a **core** flow from a previous phase | **NO-GO.** A phase that breaks shipped functionality does not pass, regardless of its own ACs. |
| A regression in a **non-core** flow | At least **GO-with-warnings**; NO-GO if it has no workaround or is itself Critical-severity. |
| A pre-existing test now failing | Investigate first — is it an implementation regression or a stale/broken test? A real regression follows the rows above; a test-only bug is fixed and noted, not counted as a regression. |
| An *intended* behavior change (a task in the phase changed it on purpose) | Not a regression. Confirm it matches the task's intent and the spec; verify dependent flows still work. |

Run the **full** test suite, not just the current phase's tests — regressions are invisible to a phase-scoped run.

---

## Step 3 — Issue the verdict

Apply top-down; the first matching row wins.

| Verdict | Required conditions (all must hold) |
|---|---|
| **NO-GO** | Any one of: a core acceptance criterion FAILs; any Critical/blocker bug exists; a core-flow regression exists; the test suite has failures traced to implementation bugs; a core criterion is PARTIAL because it could not be verified at all. |
| **GO-with-warnings** | Every acceptance criterion PASSes (or PARTIAL with a real, documented reason and a non-core impact); no Critical bugs; no core-flow regressions; remaining issues are Major-with-workaround, Minor, or Trivial — each listed explicitly as a caveat. |
| **GO** | Every acceptance criterion PASSes; no Critical or Major bugs; no core-flow regressions and no Major non-core regressions (a Minor non-core regression resolves to GO-with-warnings, not GO); the full test suite is green; no unresolved PARTIALs. Minor/Trivial polish items may exist but are noted, not blocking. |

### Verdict rules

- **One blocker is decisive.** A single Critical bug or core-flow regression forces NO-GO even if every AC otherwise passes. Do not average it away.
- **PARTIAL is not PASS.** If a criterion cannot be fully verified (needs a live external API, a credential you do not have, a device you cannot emulate), mark it PARTIAL and say *why*. A PARTIAL on a core criterion is NO-GO; on a non-core criterion it is at best GO-with-warnings. Stating the limitation honestly is mandatory — guessing PASS is a defect in the report itself.
- **GO-with-warnings always enumerates its warnings.** A GO-with-warnings verdict with no listed caveats is malformed. Every caveat names the issue, its severity, and the file:line or flow.
- **NO-GO always lists its blockers.** Each blocker gets a concrete entry: what fails, severity, location, expected vs. actual. A NO-GO the orchestrator cannot act on is useless.
- **Security and accessibility findings count.** An auth bypass or exposed secret is Critical → NO-GO even if untouched by any AC. A WCAG 2.2 AA failure on a core flow is at least a Major caveat (see `_shared/rules/security.md`, `_shared/rules/accessibility.md`). The Standards-and-Statutes oracle makes these in-scope regardless of the written criteria.
- **Be adversarial, then be decisive.** Hunt bugs hard during testing; once findings are in, classify and verdict them mechanically against this matrix — do not let effort spent or deadline pressure tilt the call.

---

## Verdict at a glance

```
Core AC fails?  ──────────────┐
Critical bug?   ──────────────┤
Core-flow regression?  ───────┼──► NO-GO   (list every blocker)
Impl-traced suite failure?  ──┤
Unverifiable core AC?  ───────┘

All ACs pass, no Critical, no core regression,
but Major-with-workaround / Minor issues remain  ──► GO-WITH-WARNINGS  (list every caveat)

All ACs pass, no Major+, no regressions,
suite fully green, no open PARTIALs  ─────────────► GO  (note polish items)
```

---

## Sources

- [ISTQB — Certified Tester Foundation Level Syllabus v4.0 (defect/severity vs. priority, test completion criteria)](https://www.istqb.org/certifications/certified-tester-foundation-level)
- [IEEE 1044 — Standard Classification for Software Anomalies](https://standards.ieee.org/ieee/1044/4421/)
- [Google — Testing on the Toilet / release-gating practice (Testing Blog)](https://testing.googleblog.com/)
- Cem Kaner, James Bach, Bret Pettichord — *Lessons Learned in Software Testing* (Wiley) — bug advocacy, severity vs. priority
- [W3C — WCAG 2.2 Recommendation](https://www.w3.org/TR/WCAG22/)
