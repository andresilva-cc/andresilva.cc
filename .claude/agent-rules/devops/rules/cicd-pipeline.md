# DevOps Rules — CI/CD Pipeline Design

**Read on-demand when the task involves designing or modifying CI/CD pipelines, build/test/deploy stages, quality gates, release automation, or pipeline-as-code.**

This domain governs how code moves from commit to production reliably and reproducibly. Pipeline *security* (least-privilege tokens, pinned actions, provenance) lives in the shared `secrets-and-supply-chain.md`; operational safety lives in `safety.md`.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

A pipeline's job is to make releasing boring: every release built the same way, gated the same way, traceable to a commit. These rules are stack-agnostic — the specific runner, syntax, and platform are project decisions.

---

## Pipeline-as-code

### Rule: The pipeline definition lives in the repository, versioned with the code
**Applies to:** Every project with automated build/test/deploy.
**Why:** A pipeline defined in a UI or out-of-band is invisible, unreviewable, and unrecoverable — it cannot be diffed, code-reviewed, rolled back, or reproduced in a new environment. Pipeline-as-code means the pipeline evolves with the code under the same review process and the same history.

### Rule: Pipeline changes go through the same review as application code
**Applies to:** Edits to workflow/pipeline files.
**Why:** The pipeline holds deploy credentials and decides what reaches production — a malicious or careless pipeline edit is as dangerous as a malicious code change. Require PR review on pipeline files; never let them be edited without the same scrutiny as the code they ship.

### Rule: Keep the pipeline definition DRY — factor shared steps into reusable units
**Applies to:** Multi-job or multi-environment pipelines.
**Why:** Copy-pasted stages drift apart and the staging pipeline stops matching production. Use the platform's reusable workflows / templates / shared jobs so the build is defined once and parameterized per environment.

### Rule: Pipelines must be reproducible — same commit produces the same result
**Applies to:** All build and release jobs.
**Why:** A pipeline whose outcome depends on *when* it ran (floating dependency versions, mutable base images, `latest` tags) cannot be trusted or debugged. Pin inputs: lockfile-based installs, digest-pinned base images, pinned tool versions. (See shared `secrets-and-supply-chain.md` for lockfiles and SHA-pinned actions.)

---

## Stage design and build/release/run separation

### Rule: Separate build, release, and run as distinct stages
**Applies to:** Every deployment pipeline.
**Why:** The 12-Factor model: **build** compiles code + dependencies into an immutable artifact; **release** binds that artifact to an environment's config; **run** executes a release. Keeping them distinct means one artifact is promoted unchanged across environments — the thing tested in staging is byte-identical to the thing in production.

### Rule: Build the artifact once, promote it across environments
**Applies to:** Multi-environment deployment flows.
**Why:** Rebuilding per environment means staging and production run different bytes — any "works in staging, fails in production" bug becomes unattributable. Build a single immutable artifact, then promote *that artifact* through staging to production. Config changes per environment; the artifact does not.

### Rule: Each release is immutable and uniquely identified
**Numeric baseline:** Every release carries a unique ID (timestamp, incrementing number, or commit SHA) and is never mutated after creation.
**Applies to:** Release/deploy stages.
**Why:** Releases are an append-only ledger. A unique, immutable release ID makes "what is running in production?" and "roll back to what?" precise questions with precise answers. A change is always a *new* release, never an edit to an existing one.

### Rule: Order stages fail-fast — cheapest and most-likely-to-fail checks first
**Applies to:** Pipeline stage ordering.
**Why:** Lint, format, type-check, and unit tests are fast and catch the most common errors — run them before slow integration tests, builds, and deploys. Failing in 30 seconds instead of 30 minutes tightens the feedback loop and saves runner cost. Parallelize independent stages.

### Rule: A deploy stage runs only after every gate upstream of it has passed
**Applies to:** Pipelines with a deploy step.
**Why:** Deploy is the stage with consequences. It must be strictly downstream of build, test, and security gates — never racing them, never reachable when an upstream stage failed or was skipped. The pipeline topology, not convention, enforces this.

### Rule: Deploys must be automated and repeatable — no manual steps
**Applies to:** The deploy stage.
**Why:** A deploy that requires a human to run commands in order is a deploy that will eventually be done wrong, especially under incident pressure. The pipeline performs the deploy; a human may *approve* it, but does not *execute* it. This also makes rollback a pipeline action, not an improvisation.

---

## Quality gates

### Rule: Every pipeline runs automated tests as a blocking gate
**Applies to:** All projects with a test suite.
**Why:** Tests that run but do not block merge/deploy are decoration — broken code ships anyway. The test stage must fail the pipeline and block promotion. (Test strategy and coverage are in the shared `testing.md`.)

### Rule: Run lint, format, and type checks as blocking gates
**Applies to:** Every pipeline.
**Why:** These are cheap, deterministic, and catch a wide class of errors before review. As blocking gates they keep the main branch consistently clean instead of relying on every contributor's local setup. (Engineer-side counterpart: `engineer/rules/verification.md` — the engineer runs these locally before reporting complete; the pipeline is the backstop, not the only place they run.)

### Rule: Security scanning runs in the pipeline and fails on actionable findings
**Applies to:** Every pipeline. SAST, dependency/SCA scanning, secret scanning, IaC scanning as applicable.
**Why:** Security gates catch vulnerable dependencies, leaked secrets, and insecure IaC before they reach production. Configure them to *fail* on actionable severity — a scan whose findings are only advisory gets ignored. (Detail in shared `secrets-and-supply-chain.md`.)

### Rule: A failed gate blocks promotion — never skip, override, or ignore it to "unblock"
**Applies to:** All quality and security gates.
**Why:** A gate that can be bypassed under pressure is not a gate. If a gate is wrong, fix the gate in a reviewed change; if a finding is a false positive, suppress it explicitly and with a recorded reason. Silently skipping a gate to ship defeats its entire purpose.

### Rule: Gates must be deterministic — eliminate flaky steps
**Applies to:** Tests and checks used as blocking gates.
**Why:** A flaky gate trains the team to re-run until green, which destroys trust in *every* gate and lets real failures through. A non-deterministic gate is a bug: fix it or quarantine it out of the blocking path — never leave the team rerunning red builds.

### Rule: Verify the deploy after it completes — health checks, not assumptions
**Applies to:** The deploy stage and any post-deploy step.
**Why:** "The deploy command exited 0" does not mean the application is healthy. Follow every deploy with a smoke test or health check against the running release; on failure, fail the pipeline and trigger rollback. An unverified deploy is a hope, not a release.

---

## Branching, environments, and artifacts

### Rule: Production deploys come only from a protected source per the project's branching model
**Applies to:** Deploy-stage triggers.
**Why:** Tying production deploys to a protected source — the `main` branch (trunk-based), a release branch (release-train), or a signed tag (tag-based release) — ensures everything in production passed branch/tag protection and review. Deploys from arbitrary branches or local state bypass the gate that makes the pipeline trustworthy. Which source is "the" protected source is a project decision; that there *is* one is not. (See `safety.md`.)

### Rule: Staging mirrors production as closely as practical
**Applies to:** Pre-production environments.
**Why:** A staging environment that differs from production in runtime, configuration shape, or topology lets bugs slip through the gate it exists to be. The closer staging mirrors production, the more a green staging run actually means.

### Rule: Store build artifacts and logs with retention; tie each to its commit
**Applies to:** Build outputs, deploy logs, test reports.
**Why:** When production breaks, you need the exact artifact and the logs from its build to debug and to roll back. Retain artifacts and logs, and make each traceable to the commit and release ID it came from.

### Rule: Make rollback a first-class pipeline action
**Applies to:** Deploy pipelines.
**Why:** Rollback under incident pressure must be a known, tested, one-action path — redeploy the previous release, switch traffic, or run a down-migration. If rollback is improvised during an incident, it will be slow and error-prone exactly when that is most costly. (See `safety.md` on rollback paths.)

---

## Sources

- [12-Factor App — V. Build, release, run](https://www.12factor.net/build-release-run)
- [12-Factor App — III. Config](https://12factor.net/config)
- [OWASP Top 10 CI/CD Security Risks](https://owasp.org/www-project-top-10-ci-cd-security-risks/)
- [OWASP Cheat Sheet — CI/CD Security](https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html)
- [NIST SP 800-218 — Secure Software Development Framework (SSDF) v1.1](https://csrc.nist.gov/pubs/sp/800/218/final)
- [CICD-SEC-1 — Insufficient Flow Control Mechanisms](https://owasp.org/www-project-top-10-ci-cd-security-risks/CICD-SEC-01-Insufficient-Flow-Control-Mechanisms)
- [Spacelift — CI/CD Security: Risks & Best Practices](https://spacelift.io/blog/ci-cd-security)
