# DevOps Rules — Deploy & Build Failure Debugging

**Read on-demand when a build, deploy, or pipeline run has failed and you need to diagnose it — or when a deployed service is misbehaving.**

This is a **methods catalog**: procedures and heuristics to run, not pass/fail rules. Operational safety constraints that bound what you may do while debugging live in `safety.md`.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

The core discipline: deployment failures almost always have a clear root cause already written in a log. Debugging is reading and reasoning, not guessing and retrying. These techniques are stack-agnostic.

---

## Evidence gathering

### Technique: Read the logs first — before changing anything
**What it is:** Treating the build/deploy log as the primary evidence and reading it fully before forming any hypothesis.
**When to apply:** The instant a build or deploy fails, before touching config, before retrying, before searching the web.
**How:**
1. Open the full log of the *failed* run — not a summary, not the dashboard's status badge.
2. Find the **first** error, not the last. Cascading failures bury the root cause; the earliest error is usually the real one.
3. Read the lines immediately *before* the error — they carry the context (which step, which file, which command, what input).
4. Distinguish a fatal error from noise: warnings, deprecations, and retryable hiccups are not the cause unless the run failed *because* of them.
5. Quote the exact error text. Vague paraphrase ("the build broke") loses the information that solves the problem.

### Technique: Locate the failing stage precisely
**What it is:** Pinning the failure to one specific pipeline stage and step before reasoning about why.
**When to apply:** Any multi-stage pipeline failure.
**How:**
- Identify which stage failed: install, build, test, containerize, deploy, post-deploy health check. Each has a different class of cause.
- Install/build failures → dependency, version, or environment issues. Test failures → code or flaky-gate issues. Deploy failures → config, credentials, platform, or capacity. Post-deploy failures → runtime config or the application itself.
- Do not debug "the pipeline" — debug the *one step* that failed.

### Technique: Build a change timeline
**What it is:** Listing everything that changed between the last known-good run and the failure.
**When to apply:** Something that previously worked now fails.
**How:**
1. Confirm it *did* work before, and identify the last green run.
2. List every candidate change since: code commits, dependency updates (including transitive — a lockfile or floating range can change with no code commit), platform/runtime upgrades, config edits, expired credentials or certificates, quota/billing changes, an upstream service or API change.
3. "No code changed" rarely means "nothing changed." Time-based causes — a renewed token, an auto-upgraded runtime, a newly published dependency version — change behavior with an untouched repository.
4. The most recent change intersecting the failing stage is the first suspect.

---

## Diagnosis

### Technique: Reproduce before you fix
**What it is:** Confirming you can trigger the failure on demand before attempting a remedy.
**When to apply:** Before committing any fix — especially for intermittent failures.
**How:**
- Re-run the failed job. If it passes, the failure is non-deterministic — a flaky test, a race, a transient platform issue, or a timeout. Treat flakiness as its own bug; do not "fix" a flaky failure with an unrelated change. **The re-run is diagnostic, not remedial:** a re-run that passes does not close the failure — it confirms the failure is flaky. File the flake per `cicd-pipeline.md § Gates must be deterministic` and remove the step from the blocking path until fixed. A pipeline that needs re-runs to go green is a broken pipeline, not a working one.
- Reproduce in the cheapest faithful environment: a local build that mirrors CI, a CI re-run with debug logging, a staging deploy — never production.
- If you cannot reproduce it, you cannot know your fix worked. Acknowledge that explicitly rather than declaring victory on a green re-run.

### Technique: Root-cause discipline — fix the cause, not the symptom
**What it is:** Driving past the surface error to the underlying reason, instead of suppressing the symptom.
**When to apply:** Every failure. Especially resist the shortcut when under pressure.
**How:**
- Ask "why" repeatedly until you reach a cause that, if fixed, prevents recurrence. *Build out of memory → bundle too large → a dependency was added that shouldn't be in the production bundle* — the dependency is the root cause; raising the memory limit only masks it.
- Reject symptom-suppression reflexes: bumping timeouts, adding retries around a deterministic failure, raising resource limits, pinning around an error without understanding it. Each hides the problem and lets it regrow.
- A legitimate fix explains *why the failure happened* and *why this change prevents it*. If you cannot articulate both, you have not found the root cause.
- Distinguish trigger from cause: the deploy that surfaced the bug is rarely the bug.

### Technique: Confirm the assumption with documentation, not guesswork
**What it is:** Verifying platform/tool behavior against official docs instead of inferring it.
**When to apply:** The error involves an unfamiliar platform, CLI, config key, or message; or your mental model and the observed behavior disagree.
**How:**
- Search the exact error string — quoted — against official documentation and issue trackers first.
- Confirm the *meaning* of config keys and flags before changing them; conventions differ across platforms.
- When docs and observed behavior conflict, trust the observed behavior and the logs — but figure out *why* they diverge rather than ignoring it.

---

## Remediation

### Technique: One change at a time
**What it is:** Applying exactly one fix, verifying it, then reassessing — never batching speculative changes.
**When to apply:** Every debugging cycle, without exception.
**How:**
1. Form one hypothesis about the root cause.
2. Make the single change that tests it.
3. Re-run; read the logs again.
4. If fixed — stop. If not — *revert that change* before trying the next hypothesis.
- Stacking changes makes it impossible to know which one worked (or which introduced a new failure). Reverting failed attempts keeps the state clean and the diff honest.
- This is both a debugging method and a safety rule (see `safety.md`).

### Technique: Verify the fix against the original symptom
**What it is:** Confirming the fix resolved the *actual* failure, not merely that the pipeline went green.
**When to apply:** After every applied fix.
**How:**
- Re-run the full failing scenario and confirm the original error is gone — not replaced by a different one, not skipped.
- For a deploy fix, check the deployed service's health and logs, not just the deploy step's exit code (see `cicd-pipeline.md`).
- A green run after an unrelated change, or a flaky test that passed on retry, is not a verified fix. Be honest about the difference between "passed" and "fixed."

### Technique: Know the rollback before you experiment
**What it is:** Ensuring there is a path back before trying a fix that touches a live or production-capable environment.
**When to apply:** Any debugging that modifies production or shared infrastructure.
**How:**
- Prefer reproducing and fixing in a non-production environment so rollback is irrelevant.
- If you must touch production, confirm the rollback path first (redeploy previous release, traffic switch, restore) — see `safety.md`.
- If a hypothesis-testing change is itself risky or destructive, stop and surface it for confirmation rather than running it to "see."

### Technique: Capture the learning
**What it is:** Recording the root cause and resolution so the same failure is not re-debugged from scratch.
**When to apply:** After resolving any non-trivial or platform-specific failure.
**How:**
- Note what failed, the actual root cause (not the symptom), and the fix. Platform-specific learnings go in `.claude/agent-memory/devops/MEMORY.md`; project-specific ones go in the project's infrastructure docs.
- If the failure could recur, consider whether a pipeline gate, a config validation, or a check would catch it earlier next time, and propose it.

---

## Sources

- [Site24x7 — Root Cause Analysis: A Strategic Guide for Engineers](https://www.site24x7.com/learn/root-cause-analysis-guide.html)
- [Jit — Step-by-Step Guide to Root Cause Analysis](https://www.jit.io/resources/devsecops/step-by-step-guide-to-root-cause-analysis)
- [12-Factor App — XI. Logs](https://12factor.net/logs)
- [OWASP Cheat Sheet — CI/CD Security](https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html)
- [Google SRE Book — Effective Troubleshooting](https://sre.google/sre-book/effective-troubleshooting/)
- [NIST SP 800-218 — Secure Software Development Framework (SSDF) v1.1](https://csrc.nist.gov/pubs/sp/800/218/final)
