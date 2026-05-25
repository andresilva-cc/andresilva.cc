# Code Review Rules — Severity Rubric

**Read on-demand at the start of every review, regardless of review type.** This is the one file that applies to all four review types. The decidable detectors (what counts as a bug, a vuln, a missing test, a layer violation) live in the shared rules files — this file decides *how loudly to flag what those detectors found*.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

Severity is not a property of a finding in isolation. It is a function of two axes — **impact** (how bad the outcome) and **likelihood** (how reachable the outcome). A SQL injection on an unauthenticated public endpoint and a SQL injection behind a feature flag disabled in production are the *same defect* with *different severities*. Classify the finding, then classify its context, then read the matrix.

---

## The two axes

### Axis 1 — Impact (how bad is the worst credible outcome)

| Level | Meaning | Examples |
|---|---|---|
| **High** | Irreversible or system-wide harm. Data loss/corruption, auth bypass, full account takeover, RCE, production outage, money moved incorrectly, secrets leaked. | Dropped table, attacker reads other tenants' rows, payment double-charged. |
| **Medium** | Contained, recoverable harm. Wrong result for one feature, degraded performance, partial outage, error surfaced to user, recoverable state corruption. | N+1 query slows a list page, one endpoint 500s on bad input, a flaky test masks a real bug. |
| **Low** | Cosmetic or local harm. Confusing-but-correct code, minor inefficiency, missing edge-case handling on a non-critical path, weaker-than-ideal structure. | Unused import, a 60-line function that should be split, a test name that lies. |

Impact is judged on the **worst *credible* outcome**, not the worst *imaginable* one. "Could theoretically cause X" without a real path to X is not High impact.

### Axis 2 — Likelihood / Exploitability (how reachable is that outcome)

| Level | Meaning | Drivers |
|---|---|---|
| **High** | Triggered by normal use or trivially reachable by an attacker. | On the happy path; unauthenticated; needs no special timing; default config. |
| **Medium** | Reachable but needs a condition. | Requires an authenticated user, a specific input shape, a race window, a non-default flag, or an edge case real users hit occasionally. |
| **Low** | Reachable only under contrived conditions. | Needs privileged/internal access, an implausible input, a dependency to also be compromised, or a code path no current caller reaches. |

For **security** findings, this axis is *exploitability*: who can reach it, what they need, what skill/access it costs. For **non-security** findings, it is *probability the bad path executes in normal operation*. The matrix below uses one axis for both — read it as exploitability for security reviews, likelihood for the rest.

---

## The decision matrix

Cross the two axes. The cell gives the severity.

| Impact \ Likelihood | **High** likelihood | **Medium** likelihood | **Low** likelihood |
|---|---|---|---|
| **High impact** | **Critical** | **Critical** | **Warning** |
| **Medium impact** | **Warning** | **Warning** | **Suggestion** |
| **Low impact** | **Suggestion** | **Suggestion** | **Suggestion** |

Read the result against these definitions:

- **Critical** — Must fix before merge. Blocks the PR. Exploitable vulnerabilities, data loss, auth bypass, system failure on a reachable path.
- **Warning** — Should fix. Does not hard-block, but the orchestrator should weigh it seriously: likely bugs, performance degradation, architecture drift, error-handling gaps, high-impact issues that are currently hard to reach.
- **Suggestion** — Nice to fix. Concrete, real value, but safe to defer. Never invent these to pad a review.

### Modifiers — apply after reading the cell

These shift severity by one level. Apply at most one modifier total — they do not stack. An escalator and a de-escalator do not cancel. When both seem to apply: pick the dominant one and apply it once. When neither is clearly dominant (the categorical signal and the compensating control are roughly equally weighted), apply neither and let the matrix cell stand — document both signals in the finding so the reader sees the tension.

- **Escalate one level** if: the finding is in security-, auth-, payment-, or privacy-critical code; *or* it is silent (fails without error, corrupts data without a signal); *or* it is irreversible (no rollback, no recovery).
- **De-escalate one level** if: a compensating control genuinely blocks the path (validated upstream, behind a kill switch, gated by an auth check you have *confirmed* exists); *or* the affected code is dev-only / test-only / never shipped.
- **Never de-escalate below the floor:** a confirmed exploitable vulnerability, confirmed data-loss path, or confirmed auth bypass on a reachable path is **Critical** regardless of modifiers. Modifiers refine; they do not override a confirmed catastrophe.
- **Uncertainty is not a downgrade.** If you cannot confirm whether a path is reachable, do not assume it is safe. Classify on the worst credible reading and say in the finding what you could not verify.

---

## Worked examples

### Critical — High impact × High likelihood

> A login endpoint builds its query by string-concatenating the `username` field. The endpoint is unauthenticated and public.

Impact: High (auth bypass, full DB read). Likelihood: High (unauthenticated, happy path, trivial payload). Matrix → **Critical**. Security-critical code modifier would escalate, but it is already at the ceiling. Blocks merge.

### Critical — High impact × Medium likelihood

> A background job deletes records older than a cutoff. An off-by-one makes it also delete records *exactly at* the cutoff. The job runs nightly.

Impact: High (irreversible data loss). Likelihood: Medium (only bites rows on the boundary, only at run time). Matrix → **Critical**. The "irreversible" modifier reinforces it. Even though not every row is hit, the destruction is unrecoverable — blocks merge.

### Warning — High impact × Low likelihood

> A stored XSS payload renders in an admin-only audit-log viewer. Only `superadmin` accounts (two internal staff) can view that page, and the payload triggers in the same admin context; no customer-facing surface renders it.

Impact: High (admin session compromise). Likelihood: Low (needs an already-trusted privileged account to view). Matrix → **Warning**. Two modifiers are in tension: the security-critical category would escalate, and the verified admin-only bounding would de-escalate. Per the modifier rule above, they do not cancel — when neither is clearly dominant, neither applies and the matrix cell stands. Net: **Warning**, with both signals (security-critical + admin-bounded blast radius) called out in the finding so the reviewer sees why it isn't Critical *or* Suggestion.

**Note on what does NOT qualify:** SQL injection, authentication bypass, and remote code execution are **Critical regardless** of whether the surfacing route is admin-only — `_shared/rules/security.md` treats parameterization as "no exception for 'internal' or 'admin-only' queries", and the floor clause above applies. The admin-gating only enters the modifier discussion for classes where the privileged context bounds blast radius (rendering, viewing, formatting). It does not enter the discussion for classes that can pivot or destroy the database.

### Warning — Medium impact × High likelihood

> A product list page issues one query per row to fetch each item's category — a classic N+1. The page is the app's most-visited route.

Impact: Medium (slow page, recoverable, no data harm). Likelihood: High (every page load). Matrix → **Warning**. No modifier applies. Should fix; does not block merge unless the orchestrator treats latency as a release gate.

### Warning — Medium impact × High likelihood, escalated to Critical

> The same N+1 above, but the per-row query has no timeout and the table is unbounded; under load the page exhausts the DB connection pool and takes the whole service down.

Re-judge impact: now High (system-wide outage, not one slow page). Likelihood: High. Matrix → **Critical**. The example shows why you classify the *worst credible outcome*, not the first one you think of.

### Warning — High impact × High likelihood, de-escalated by a confirmed kill-switch

> A privilege-check bug in an admin-impersonation feature would let any signed-in user assume another user's session. The feature is gated by a kill-switch flag that is **confirmed `false` in production config** (verified in the deploy config, not assumed).

Impact: High (account takeover) if reachable. Likelihood: zero in production because the kill-switch is off — confirmed. The de-escalation modifier applies because the kill-switch is a *verified* compensating control. Matrix would say Critical; modifier drops one level → **Warning**. Not Suggestion: the bug must still be fixed before the kill-switch is ever flipped, and "confirmed off" must be re-verified at flip time.

**What does NOT qualify:** "I assume this is behind auth" or "I think there's a flag" without reading the config does **not** qualify for de-escalation. Uncertainty is not a downgrade (see floor rule above). The kill-switch only de-escalates when you have read the config and named the file/flag in the finding.

### Suggestion — Medium impact × Low likelihood

> An error handler catches a parse failure but logs it at `debug` level, so a malformed-config case would be hard to diagnose. The config is operator-supplied and rarely malformed.

Impact: Medium (slower debugging, no user harm). Likelihood: Low (config rarely malformed). Matrix → **Suggestion**.

### Suggestion — Low impact × High likelihood

> A 70-line function with four nesting levels handles request validation. It works correctly and is well-tested.

Impact: Low (maintainability only). Likelihood: High (runs on every request) — but high *frequency* of correct execution is not high *likelihood of harm*. Matrix → **Suggestion**. Report it once, concisely; do not inflate it because the function is hot.

### Not a finding at all

> A helper function returns early instead of using an `else` branch. Equivalent behavior, consistent with the rest of the file.

No impact, no harm path. This is style/preference — **do not report it**. Zero findings is a valid review outcome; manufacturing Suggestions to look thorough is a defect in the review, not in the code.

---

## Calibration checks

Before finalizing the severity table in a review, sanity-check:

- **Every Critical can name a concrete, reachable bad outcome and who/what triggers it.** If you cannot, it is a Warning.
- **No Warning is actually a Critical hiding from a hard conversation.** Reachable data loss / auth bypass / outage is Critical even when inconvenient.
- **No Suggestion is padding.** If removing it from the review loses nothing, remove it.
- **Severity reflects *this* PR's reachability**, not a generic CVSS score copied from a database. The same CWE is Critical or Warning depending on where it sits in this codebase.

---

## Sources

- [FIRST — CVSS v4.0 Specification: Qualitative Severity Rating Scale](https://www.first.org/cvss/v4-0/specification-document)
- [FIRST — CVSS v3.1 Specification Document](https://www.first.org/cvss/v3-1/specification-document)
- [OWASP — Risk Rating Methodology](https://owasp.org/www-community/OWASP_Risk_Rating_Methodology)
- [OWASP — Threat and Safeguard Matrix / risk = likelihood × impact](https://owasp.org/www-community/Threat_Modeling)
- [NIST — SP 800-30r1 Guide for Conducting Risk Assessments (likelihood × impact)](https://csrc.nist.gov/pubs/sp/800/30/r1/final)
- [MITRE — CWE: Common Weakness Enumeration](https://cwe.mitre.org/)
