# Security Rules — Secrets and Supply Chain

**Read on-demand when the task involves credentials, API keys, environment configuration, dependency management, lockfiles, CI/CD pipelines, build/release processes, or any code that touches secret material or third-party software.**

This domain governs how secrets are stored and how third-party code enters the build. Application-level vulnerabilities (injection, auth, crypto) live in `security.md`.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

Rules map to OWASP Top 10:2025 A03 (Software Supply Chain Failures), the OWASP Top 10 CI/CD Security Risks (`CICD-SEC-n`), the SLSA framework, NIST SP 800-218 (SSDF), and CWE IDs where applicable.

---

## Secret storage and hygiene

### Rule: Never hardcode secrets — no keys, tokens, passwords, or connection strings in source code
**Applies to:** All committed files: source, config, infrastructure-as-code, test fixtures, notebooks, documentation, commit messages.
**Why:** Hardcoded credentials (CWE-798) are the most common cause of mass credential leaks. Source is copied, forked, shared, and indexed; a secret in code is a secret published. Secrets are supplied at runtime from the environment or a secret manager — never baked into the artifact.

### Rule: Treat any secret committed to git history as compromised and rotate it immediately
**Applies to:** Any high-entropy string, recognizable key prefix (`AKIA`, `ghp_`, `sk-`, `xoxb-`, `-----BEGIN ... PRIVATE KEY-----`), or `password=`/`token=` assignment found in tracked files or any past commit.
**Why:** A secret in git history persists in every clone, fork, CI cache, and backup; removing the file in a later commit does not remove it from history. Rotation is the only real remediation — history rewriting (BFG, `git filter-repo`) is cleanup, not a fix. Treat exposure as critical and rotate before doing anything else.

### Rule: Load secrets from environment variables or a secret manager at runtime
**Applies to:** All application secrets and credentials.
**Why:** Environment injection (or a dedicated secret manager — Vault, AWS Secrets Manager, GCP Secret Manager, Doppler) keeps the secret out of the artifact and allows rotation without a rebuild. A secret manager is preferred over raw env vars for sensitive material: it adds access control, audit logging, versioning, and centralized rotation.

### Rule: `.env` files are git-ignored and never committed — only `.env.example` is tracked
**Applies to:** Every project using dotenv-style config.
**Why:** `.env` holds real secrets; `.env.example` documents the *required keys* with placeholder values. Confirm `.env`, `.env.*`, and equivalents are in `.gitignore` before any commit (CWE-538 — file/directory information exposure).

### Rule: Prefer short-lived, federated credentials over long-lived static secrets
**Applies to:** CI/CD-to-cloud authentication, service-to-service auth, deployment pipelines (devops, software-architect).
**Why:** A long-lived static key, once leaked, is valid until someone notices and rotates it. Workload identity / OIDC federation (GitHub Actions OIDC to AWS/GCP/Azure, IAM roles, workload identity) issues credentials that expire in minutes and are never stored. This is the strongest single control against credential theft.

### Rule: Rotate secrets on a defined schedule and immediately on suspected exposure
**Applies to:** All long-lived secrets that cannot be made short-lived.
**Why:** Rotation bounds the useful lifetime of a leaked credential. Design systems so rotation is routine and non-disruptive (support overlapping valid credentials during cutover) — rotation that requires downtime gets skipped.

### Rule: Scope each secret to the minimum privilege and environment it needs
**Applies to:** API keys, database users, cloud IAM principals, deployment tokens.
**Why:** A read-only key cannot be used to write; a staging credential cannot touch production. Least privilege (CWE-250) bounds the blast radius of any single leaked secret. Never share one credential across environments or services.

### Rule: Run automated secret scanning in pre-commit hooks and in CI
**Applies to:** Every repository (devops to configure; engineer and code-reviewer to rely on).
**Why:** Pre-commit scanning (ggshield, gitleaks, trufflehog, detect-secrets) stops a secret *before* it enters history — the only place it is cheap to fix. CI scanning is the backstop for commits made without the hook and for pull requests. Run both: the hook is the primary gate, CI is defense in depth.

### Rule: Never expose secrets in CI/CD logs, build output, or error messages
**Applies to:** Pipeline configuration and build scripts (devops). Maps to CICD-SEC-6 (Insufficient Credential Hygiene).
**Why:** Build logs are broadly readable — across an org, in PRs from forks, in artifact storage. An `echo $SECRET`, a debug dump, or a tool printing its config leaks the credential (CWE-532). Use the CI platform's masked-secret mechanism, never print secrets, and treat any leaked-in-logs secret as compromised.

---

## Dependency and supply-chain hygiene (A03:2025 — Software Supply Chain Failures)

### Rule: Commit a lockfile and install from it deterministically
**Numeric baseline:** `package-lock.json` / `pnpm-lock.yaml` / `yarn.lock`, `poetry.lock` / `uv.lock` / `requirements.txt` with hashes, `Cargo.lock`, `go.sum` — committed and used.
**Applies to:** Every project with third-party dependencies.
**Why:** A lockfile pins the exact resolved version *and hash* of every transitive dependency, so every install — local, CI, production — gets identical, verified bytes. Without it, a malicious or broken release of a transitive dependency silently enters the next build. Use the deterministic install command (`npm ci`, `pnpm install --frozen-lockfile`, `pip install --require-hashes`) — not the resolving one — in CI and release. Note that `pip install --require-hashes` only works against a hash-pinned requirements file produced by `pip-compile` or `uv pip compile`; a bare `requirements.txt` without `--hash=` entries will fail.

### Rule: Pin dependency versions — avoid floating ranges for direct dependencies
**Applies to:** Direct dependency declarations; especially anything in the production/runtime set.
**Why:** Floating ranges (`^`, `~`, `*`, `latest`) mean the version installed depends on *when* you install. Pinning plus a lockfile makes builds reproducible and makes dependency updates an explicit, reviewable change rather than an invisible one.

### Rule: Verify checksums and signatures for artifacts fetched outside the package manager
**Applies to:** Container base images, prebuilt binaries, installer scripts, model weights, and any tarball/zip pulled at build time by `curl`/`wget`/Dockerfile `ADD`. (Package-manager hash pinning is covered by the lockfile rule above.)
**Why:** The lockfile rule covers npm/pnpm/pip/etc., but a build step that fetches a binary or runs a remote install script with no verification is a blind trust in the network and the upstream host. Verify a published checksum (and a signature where available — cosign, GPG, Sigstore) before executing or installing the artifact. Pin container images by digest (`image@sha256:...`), not by tag. Defeats registry compromise, MITM, and mirror tampering (CWE-494 — download of code without integrity check).

### Rule: Scan dependencies for known vulnerabilities in CI and fail on actionable findings
**Applies to:** Every project; runs on every PR and on a schedule (devops to wire up; code-reviewer to interpret).
**Why:** Known-vulnerable dependencies are exploited at scale. SCA tooling (`npm audit`, `pip-audit`, `osv-scanner`, Dependabot, Snyk, Trivy) cross-references the lockfile against vulnerability databases. Run on a schedule too — a dependency is safe at install time and vulnerable a week later when a new CVE lands.

### Rule: Vet new dependencies before adding them — maturity, maintenance, popularity, and necessity
**Applies to:** Any proposed new dependency (engineer to propose, code-reviewer to challenge).
**Why:** Every dependency is code you run with your privileges and a maintainer you trust transitively. Before adding one, ask: is it actively maintained, widely used, reasonably aged, and does the value justify the added attack surface? A few lines of first-party code often beats a package. This is the SSDF "minimize dependency surface" practice.

### Rule: Guard against typosquatted and confused dependency names
**Applies to:** Any newly added dependency, and to every private/internal package name that could collide with a public registry name.
**Why:** A name that is a near-miss of a popular package (`crossenv` vs `cross-env`, `python-dateutil` vs `dateutil`) frequently carries malware; a private package whose name is *not* namespace-scoped can be shadowed by a public package of the same name, yielding silent code execution in your build (dependency confusion). Verify the exact name against the official package before adding. Scope all internal packages (`@org/name`) and reserve the scope on the public registry. Pin the registry/index for private packages (`.npmrc` `@org:registry=`, pip `--index-url`) so a higher-version public package can never be substituted.

### Rule: Disable dependency lifecycle/install scripts by default
**Applies to:** CI installs and audits of untrusted code. Maps to CICD-SEC-3 (Dependency Chain Abuse).
**Why:** `postinstall` and similar hooks run arbitrary code with your privileges the moment a package installs — the primary payload delivery mechanism in npm supply-chain attacks. Install with `--ignore-scripts` where the dependency set permits it; for the packages that genuinely need build scripts (native modules), allowlist them explicitly rather than enabling scripts globally.

### Rule: Generate an SBOM for every release
**Applies to:** Release/build pipeline (devops, software-architect). Aligns with SSDF practice PS.3 and SLSA.
**Why:** A Software Bill of Materials (CycloneDX or SPDX) is the inventory of every component in a build. When the next widely-used CVE drops, the SBOM answers "are we affected?" in seconds instead of an audit. Regenerate it on every dependency change and every release.

### Rule: Apply dependency updates promptly but with a cooldown on brand-new releases
**Applies to:** Dependency update policy (devops).
**Why:** Two opposing risks: stale dependencies accumulate known CVEs; a just-published version may be a compromised release that has not yet been caught. Automate updates (Dependabot/Renovate) but configure a cooldown/quarantine — 3–7 days for typical direct dependencies; longer for libraries whose compromise would be high-blast-radius and hard to roll back from (auth, crypto, build tooling, anything that runs at install time). See Renovate/Dependabot cooldown defaults. The cooldown gives malicious publishes time to be detected and yanked before they reach your build.

---

## Build, release, and CI/CD pipeline security

### Rule: Treat the CI/CD pipeline as production — apply least privilege to every job
**Applies to:** Pipeline configuration (devops, software-architect). Maps to CICD-SEC-2 and CICD-SEC-5.
**Why:** The pipeline has the credentials to deploy; compromising it compromises everything downstream. Default workflow tokens to read-only and grant write/deploy scopes only to the specific jobs that need them. Over-permissive pipeline identity is a top OWASP CI/CD risk.

### Rule: Pin third-party CI actions/plugins to a full-length commit SHA
**Applies to:** GitHub Actions, GitLab includes, and any externally sourced pipeline component (devops).
**Why:** A version *tag* is mutable — an attacker who compromises the action's repo can repoint `v4` to malicious code, and every consumer pulls it on the next run (the 2025 `tj-actions` compromise). A full commit SHA is immutable. Pin to SHA, prefer first-party/verified actions, and keep an explicit reviewed allowlist of third-party actions.

### Rule: Require review and approval gates before code reaches a production pipeline
**Applies to:** Branch protection and deployment workflows. Maps to CICD-SEC-1 (Insufficient Flow Control) and CICD-SEC-4 (Poisoned Pipeline Execution).
**Why:** Without enforced review, an attacker with limited repo access — or a malicious PR from a fork — can push code straight to a privileged pipeline. Require PR review, protect release branches, and never expose secrets or privileged runners to workflows triggered by untrusted (fork) PRs.

### Rule: Generate signed build provenance — target SLSA Build Level 2+, Level 3 for high-trust artifacts
**Numeric baseline:** SLSA Build L0 = none; L1 = provenance exists; L2 = hosted build + signed provenance; L3 = hardened, isolated build platform.
**Applies to:** Release artifacts: packages, container images, binaries (devops, software-architect).
**Why:** Provenance is signed, verifiable metadata stating *what was built, from which source, by which builder*. It lets a consumer confirm an artifact was produced by the expected pipeline from the expected commit and not tampered with. L2 (hosted builds + signed provenance) is a realistic baseline; L3 (build isolation) is the target for artifacts others depend on.

### Rule: Build releases only in CI from a clean checkout — never publish from a developer machine
**Applies to:** All published artifacts.
**Why:** A developer machine has uncommitted changes, local tooling, and broad credentials — its build is neither reproducible nor attestable. Building only in a controlled, hosted CI environment from a clean checkout of a tagged commit is a precondition for meaningful provenance (SLSA) and reproducibility.

### Rule: Sign published artifacts and verify signatures before deployment
**Applies to:** Container images, packages, release binaries (devops).
**Why:** Signing (Sigstore/cosign, GPG) plus verification at the deployment boundary ensures only artifacts produced by your pipeline are deployed — closing the gap between "built securely" and "this is the thing we built" (CWE-347 — improper verification of cryptographic signature).

### Rule: Follow a defined secure-development process — SSDF practices PO, PS, PW, RV
**Applies to:** Project-level process (software-architect, devops).
**Why:** NIST SP 800-218 (SSDF) frames supply-chain security as four practice groups: **P**repare the **O**rganization, **P**rotect the **S**oftware, **P**roduce **W**ell-secured software, **R**espond to **V**ulnerabilities. The concrete rules above are instances; the framework ensures coverage is systematic — including a defined path to receive, triage, and remediate reported vulnerabilities (RV).

---

## Sources

- [OWASP Top 10:2025 — Introduction (A03 Software Supply Chain Failures)](https://owasp.org/Top10/2025/0x00_2025-Introduction/)
- [OWASP Top 10 CI/CD Security Risks](https://owasp.org/www-project-top-10-ci-cd-security-risks/)
- [OWASP Cheat Sheet — Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [OWASP Cheat Sheet — CI/CD Security](https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html)
- [OWASP Cheat Sheet — NPM Security](https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html)
- [SLSA — Supply-chain Levels for Software Artifacts (v1.0 specification)](https://slsa.dev/spec/v1.0/)
- [SLSA — Build track security levels](https://slsa.dev/spec/v1.0/levels)
- [OpenSSF — SLSA v1.0 release announcement](https://openssf.org/press-release/2023/04/19/openssf-announces-slsa-version-1-0-release/)
- [NIST SP 800-218 — Secure Software Development Framework (SSDF) v1.1](https://csrc.nist.gov/pubs/sp/800/218/final)
- [NIST — Secure Software Development Framework project](https://csrc.nist.gov/projects/ssdf)
- [GitHub Docs — Secure use reference for GitHub Actions](https://docs.github.com/en/actions/reference/security/secure-use)
- [GitHub Well-Architected — Securing GitHub Actions Workflows](https://wellarchitected.github.com/library/application-security/recommendations/actions-security/)
- [GitGuardian — Pre-commit secret scanning with ggshield](https://docs.gitguardian.com/ggshield-docs/reference/secret/scan/pre-commit)
- [GitGuardian — Detecting secrets with git hooks](https://blog.gitguardian.com/setting-up-a-pre-commit-git-hook-with-gitguardian-shield-to-scan-for-secrets/)
- [MITRE CWE — CWE-798 Use of Hard-coded Credentials](https://cwe.mitre.org/data/definitions/798.html)
- [Wiz — New GitHub Action supply-chain attack: reviewdog/action-setup (tj-actions postmortem)](https://www.wiz.io/blog/new-github-action-supply-chain-attack-reviewdog-action-setup)
- [Renovate — Cooldown / minimumReleaseAge documentation](https://docs.renovatebot.com/configuration-options/#minimumreleaseage)
