# DevOps Rules — Configuration Discipline

**Read on-demand when the task involves platform configuration, environment variables, infrastructure-as-code, build/deploy settings, or deciding how much config a project needs.**

This domain governs how configuration is structured, minimized, and separated from code. Secret *storage* mechanics are in the shared `secrets-and-supply-chain.md`; pipeline structure is in `cicd-pipeline.md`.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

The governing instinct: the best configuration is the configuration you did not write. Every line of config is a line that can drift, conflict, and break. These rules are stack-agnostic.

---

## Minimal configuration

### Rule: Start from platform defaults — add config only when a default is actually wrong
**Applies to:** Every new deployment, build, or platform setup.
**Why:** Platforms auto-detect framework, build command, runtime version, and ports far more than expected. Config that restates a default adds nothing and creates a second source of truth that drifts from the platform's evolving defaults. Add a setting only when you have observed the default failing — not preemptively.

### Rule: Never carry over config copied from a tutorial, another project, or an AI suggestion "to be safe"
**Applies to:** Settings in the config file that nothing in the project demonstrably needs — speculative build flags, redundant runtime declarations, unused service blocks.
**Why:** Cargo-culted config works until it silently conflicts with a platform default or masks a real problem — and then the debugger has to figure out which inherited line is the cause. Remove every setting you cannot tie to a concrete, observed requirement. If unsure whether a setting is load-bearing, remove it and verify the deploy still works. Config is a liability; keep only what earns its place.

### Rule: Let the platform auto-detect before declaring config explicitly
**Applies to:** Build command, install command, runtime/language version, start command, output directory, port.
**Why:** Most modern platforms detect these from the repository (lockfile, framework manifest, conventional file layout). Explicit declarations override detection and must then be maintained by hand forever. Declare explicitly only what detection gets wrong.

### Rule: Every config setting must have a discoverable reason
**Applies to:** All committed config and IaC.
**Why:** A future reader (or agent) must be able to tell why a non-obvious setting exists. Where the reason is not self-evident, a one-line comment stating *why* (not *what*) prevents the setting from being cargo-culted forward or deleted blindly. Config without rationale becomes untouchable.

### Rule: Pin runtime and tool versions explicitly where the platform allows
**Applies to:** Language runtime, build tool, and key CLI versions.
**Why:** This is the one place explicitness beats auto-detection: an unpinned runtime silently upgrades under you, turning a passing build into a failing one with no code change. Pin the runtime version (via the project's conventional mechanism — `.nvmrc`, `.python-version`, `runtime.txt`, manifest field) so builds are reproducible across machines and time.

---

## Config / code separation (12-Factor)

### Rule: Strictly separate config from code — config is everything that varies per environment
**Applies to:** Anything that differs between dev, staging, and production: credentials, hostnames, resource handles, endpoints, feature toggles, tuning values.
**Why:** Code is identical across deploys; config is not. Mixing them means you cannot promote one artifact across environments and you risk committing an environment's specifics into the shared codebase. The test: could the repository be open-sourced this moment without leaking credentials? If not, config and code are entangled.

### Rule: Supply config through environment variables (or an equivalent injected source)
**Applies to:** Application and deployment configuration.
**Why:** Environment variables are language-agnostic, OS-standard, and easy to change per deploy without editing code or rebuilding. They avoid the failure mode of config files accidentally committed or grouped into named "environments" that multiply combinatorially. A secret manager is preferred for sensitive values (see shared `secrets-and-supply-chain.md`).

### Rule: One artifact, many environments — never bake environment specifics into the build
**Applies to:** Build and release stages.
**Why:** If the build embeds environment-specific values, you need a separate build per environment and lose the guarantee that staging and production run identical code. The artifact is environment-agnostic; the release binds it to an environment's config. (See `cicd-pipeline.md`.)

### Rule: Document every required config key in a tracked example file
**Numeric baseline:** A committed `.env.example` (or equivalent) lists every key the app reads, with placeholder — never real — values.
**Applies to:** Every project that reads environment configuration.
**Why:** Otherwise the required configuration is tribal knowledge and a new environment is provisioned by trial and error. The example file is the contract; the real `.env` stays git-ignored (see shared `secrets-and-supply-chain.md`).

### Rule: Validate required config at startup and fail fast on missing or malformed values
**Applies to:** Application boot and deploy scripts.
**Why:** A missing or malformed config value should stop the process immediately with a clear message naming the key — not surface later as a confusing runtime failure deep in a request path. Fail-fast validation turns a production mystery into a deploy-time error.

### Rule: Keep config flat — avoid named environment groups inside the codebase
**Applies to:** Configuration structure.
**Why:** Named groups (`development`, `staging`, `production` blocks in a committed file) do not scale: every new deploy needs a new group, and groups drift. Independent environment variables per deploy scale cleanly to any number of environments without combinatorial explosion.

---

## Infrastructure as code

### Rule: Define infrastructure declaratively — describe the desired state, not the steps
**Applies to:** Provisioning of services, networking, databases, DNS, and platform resources.
**Why:** A declarative definition lets the tool compute the diff from current to desired state and is naturally idempotent. An imperative script ("create X, then Y") produces a different result depending on the starting state and cannot self-correct. Declarative IaC is the basis for drift detection and safe re-runs.

### Rule: Infrastructure changes are idempotent — applying twice yields the same state
**Applies to:** All IaC and provisioning automation.
**Why:** Idempotence means a re-run after a partial failure, or a routine reapply, converges to the desired state without duplicating resources or erroring on things that already exist. This is what makes IaC safe to run in pipelines and during recovery.

### Rule: Commit all infrastructure definitions to version control
**Applies to:** IaC files, platform config, pipeline definitions.
**Why:** Infrastructure in version control is reviewable, diffable, revertable, and reproducible — the same properties that make application code manageable. Infrastructure configured by hand in a console is invisible and unrecoverable.

### Rule: Manage IaC state remotely with locking; never edit state by hand
**Applies to:** IaC tools that maintain a state file (Terraform, Pulumi, and similar).
**Why:** The state file is the tool's record of reality. Shared remote state with locking prevents two runs from corrupting it concurrently; hand-editing it desynchronizes the tool from actual infrastructure and causes destructive plans on the next apply.

### Rule: Detect drift and reconcile it through code, never by manual console fixes
**Applies to:** Any infrastructure managed by IaC.
**Why:** A manual console change makes reality diverge from the code; the next IaC apply will revert or destroy it unexpectedly. Run drift detection regularly, and route every fix through the IaC definition so code stays the single source of truth.

### Rule: Factor repeated infrastructure into reusable modules — DRY
**Applies to:** Multi-environment or multi-resource IaC.
**Why:** Copy-pasted infrastructure blocks drift apart, so staging stops matching production. A parameterized module defined once and instantiated per environment keeps them structurally identical and changes consistent.

### Rule: Make infrastructure changes small, reviewed, and reverting-friendly
**Applies to:** All IaC changes.
**Why:** A large infrastructure change has an unreadable plan and an unclear blast radius. Small, single-purpose changes produce reviewable plans and contain failure. Always read the plan before applying (see `safety.md`).

---

## Sources

- [12-Factor App — III. Config](https://12factor.net/config)
- [12-Factor App — V. Build, release, run](https://www.12factor.net/build-release-run)
- [Microsoft Learn — What is Infrastructure as Code?](https://learn.microsoft.com/en-us/devops/deliver/what-is-infrastructure-as-code)
- [Spacelift — Infrastructure as Code: Best Practices](https://spacelift.io/blog/infrastructure-as-code)
- [NIST SP 800-218 — Secure Software Development Framework (SSDF) v1.1](https://csrc.nist.gov/pubs/sp/800/218/final)
- [OWASP — CICD-SEC-7: Insecure System Configuration](https://owasp.org/www-project-top-10-ci-cd-security-risks/CICD-SEC-07-Insecure-System-Configuration)
