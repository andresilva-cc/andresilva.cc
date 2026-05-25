# DevOps Rules — Operational Safety

**Read on-demand when the task involves destructive operations, production environments, deleting or modifying live services, databases, DNS, secrets, or any change that cannot be cheaply undone.**

This domain governs how to act without causing irreversible damage. Pipeline design lives in `cicd-pipeline.md`; secret storage mechanics live in the shared `secrets-and-supply-chain.md`.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

The single failure mode this file exists to prevent: a confident, well-intentioned command that deletes production data, leaks a credential, or breaks live traffic with no path back. When in doubt, stop and confirm — a missed rule here can delete a production database.

---

## Destructive operations — confirm before acting

### Rule: Never run a destructive operation on production without explicit, scoped confirmation
**Applies to:** Deleting or recreating services, databases, volumes, buckets, container registries; dropping tables or schemas; `terraform destroy`, `terraform apply` on a plan that shows deletions; `kubectl delete`; DNS record removal; deleting branches, tags, or releases.
**Why:** Destructive operations have no undo. "Confirmation" means the orchestrator (or user) has seen the *specific* resource names and the *specific* command, and approved that exact action — not a general "yes, proceed." A blanket approval given before the blast radius was known is not informed consent.

### Rule: Read the plan/diff before applying any infrastructure change
**Numeric baseline:** Every `terraform apply`, `pulumi up`, `cdk deploy`, or equivalent is preceded by a reviewed `plan`/`diff`/`preview`.
**Applies to:** All infrastructure-as-code changes.
**Why:** The plan output is the only reliable preview of what will be created, changed, and **destroyed**. A change that looks additive in the source file can force-replace a resource (destroy + create) because of an immutable attribute. Never apply a plan you have not read line by line for the word "destroy" / "replace" / "delete."

### Rule: Treat resource replacement as a destructive operation
**Applies to:** IaC changes that show `-/+` (replace) on stateful resources — databases, disks, persistent volumes, load balancers with stable addresses.
**Why:** Replacement destroys the old resource and its data before creating the new one. An innocuous-looking attribute edit (instance type, region, name) can trigger it. If a plan shows replacement of anything that holds state or has a stable address, stop and confirm — this is a delete in disguise.

### Rule: Back up or snapshot stateful resources before any operation that could affect them
**Applies to:** Databases, persistent volumes, object storage, before migrations, version upgrades, restores, or risky config changes.
**Why:** A verified, recent backup converts an irreversible mistake into a recoverable one. Take the snapshot *before* the change, and confirm it completed — a backup you assumed exists but never verified is not a backup.

### Rule: Scope every destructive command as narrowly as the tooling allows
**Applies to:** Deletes, prunes, force operations, bulk updates.
**Why:** A wildcard or unscoped selector turns "delete this one stale thing" into "delete everything matching." Target by explicit name/ID, never by glob, when the operation is destructive. Prefer commands that fail closed (require an explicit target) over ones that default to "all."

### Rule: Never use a destructive command to "test" or "see what happens"
**Applies to:** `delete`, `destroy`, `drop`, `prune`, `--force`, `reset --hard`, `rm -rf`, and other irreversible commands invoked exploratorily rather than as a deliberate, planned step.
**Why:** Exploratory destruction is how production gets deleted. Use read-only inspection (`plan`, `--dry-run`, `describe`, `get`, `status`, log reads) to understand state. Only run the destructive command once the exact effect is known, the blast radius stated, and the action approved.

---

## Production protections

### Rule: Never force-push to a production or protected branch
**Applies to:** `main`, `master`, release branches, and any branch wired to an auto-deploy pipeline.
**Why:** Force-push rewrites shared history — it discards commits other people and the deploy pipeline depend on, and can trigger a deploy of an unintended state. Production branches must be protected (no force-push, no deletion, required review). If history genuinely needs correcting, do it through a normal reviewed commit, not a rewrite.

### Rule: Production changes go through the pipeline, never direct from a local machine
**Applies to:** Deployments, migrations, config changes to production.
**Why:** A local machine has uncommitted edits, ad-hoc tooling, and broad credentials — its actions are unreviewed, unaudited, and unreproducible. Routing every production change through the CI/CD pipeline guarantees it is built from a known commit, passed the quality gates, and left an audit trail. Manual hotfixes bypass every safety net the pipeline provides.

### Rule: One change at a time when touching production
**Applies to:** Production deploys, config edits, infrastructure changes, debugging live failures.
**Why:** Stacking multiple untested changes makes it impossible to attribute a regression or know what to roll back. Apply one change, verify it (logs, health checks, metrics), then proceed. If something breaks, you know exactly which change caused it. This is also a debugging discipline — see `deploy-debugging.md`.

### Rule: Every production change must have a known rollback path before it ships
**Applies to:** Deployments, migrations, infrastructure changes, feature rollouts.
**Why:** "How do we undo this?" is answered *before* shipping, not during an incident. Know whether rollback is a redeploy of the previous release, a traffic switch, a down-migration, or a restore — and that it actually works. A change with no rollback path is a one-way door and must be treated with the caution that implies.

### Rule: Make schema and data migrations backward-compatible (expand/contract)
**Applies to:** Database migrations deployed alongside or ahead of application code.
**Why:** During any non-atomic deploy, old and new application code run against the same database simultaneously. A migration that drops or renames a column the old code still reads breaks the old code instantly and blocks rollback. Split into phases: expand (add the new, additive only), migrate code to use it, then contract (remove the old) in a *later* release once nothing references it.
**Enforcement detail:** Three releases minimum. (1) Add new schema/column + dual-write old and new; (2) cut reads over to the new path and verify; (3) drop the old schema/column — only after monitoring confirms zero readers of the old path. Skipping a stage to "save a release" is how migrations break rollback.

### Rule: Verify which environment you are targeting before every operation
**Numeric baseline:** Confirm the active context/profile/project before each command in a production-capable session.
**Applies to:** CLI tools with ambient context (`kubectl` context, cloud CLI profile/project, environment selector).
**Why:** A command intended for staging that runs against production because the shell's active context was wrong is one of the most common serious outages. Check the context explicitly; prefer per-command context flags over relying on ambient state; use visibly distinct prompts/profiles per environment.

### Rule: Prefer disable/scale-to-zero over delete when removing something
**Applies to:** Decommissioning services, routes, scheduled jobs, feature flags.
**Why:** Disabling or scaling to zero is reversible and observable for a cooling-off period; deletion is final. Remove the resource for good only after a window confirms nothing depended on it. This converts "we think this is unused" into "we proved this is unused."

---

## Secret and credential safety

### Rule: Never print, echo, or log a secret
**Applies to:** Debugging sessions, build scripts, pipeline steps, CLI commands.
**Why:** Build logs and terminal output are broadly readable and frequently retained. An `echo $TOKEN`, a config dump, or a verbose tool that prints its environment leaks the credential. Use the platform's masked-secret mechanism. If a secret reaches a log, treat it as compromised and rotate it — deletion of the log is not remediation. (See shared `secrets-and-supply-chain.md`.)

### Rule: Never paste a secret into a file the agent will write or a command the agent will run inline
**Applies to:** All agent-authored config, IaC, CI workflows, and Bash commands.
**Why:** A secret in a written file risks being committed; a secret on a command line is captured in shell history and process listings. Reference secrets by name from the platform's secret store or environment — never inline the value.

### Rule: Preserve the full existing environment-variable set on platforms that replace-on-update
**Applies to:** Platforms and APIs where setting environment variables replaces the entire set rather than merging — notably the Vercel project-env API, AWS Lambda `UpdateFunctionConfiguration` env updates, and similar "PUT the whole config" APIs. Other platforms (Heroku config:set, Fly secrets set, Render env-var UI) merge — confirm your platform's behavior in the docs before submitting.
**Why:** On a replace-on-update platform, submitting only the new variable silently deletes every existing one, breaking the service. Read the current full set first, add to it, and submit the complete list — or use a merge-style update if the platform offers one.

### Rule: Use least-privilege, environment-scoped credentials for every operation
**Applies to:** Deployment tokens, CLI credentials, CI-to-cloud auth, service accounts.
**Why:** A credential scoped to staging cannot harm production; a read-only credential cannot delete. Scoping bounds the blast radius of both a leak and a mistake. Never reuse one powerful credential across environments. Prefer short-lived federated credentials (OIDC) over long-lived static keys. (See shared `secrets-and-supply-chain.md`.)

---

## Working discipline

### Rule: When unsure of a platform's behavior, read its docs before acting — never guess
**Applies to:** Unfamiliar platforms, CLIs, config formats, or error messages.
**Why:** Platform conventions vary in ways that matter (does this command merge or replace? is this delete soft or hard? does this flag mean what it means elsewhere?). Guessing wrong on a destructive or production operation is the failure this whole file guards against. Use WebSearch/WebFetch to confirm behavior from official documentation first.

### Rule: State the blast radius before requesting confirmation
**Applies to:** Any operation requiring orchestrator/user approval.
**Why:** A confirmation request that says only "proceed?" gives the approver nothing to evaluate. State plainly: what resource, what environment, what happens, whether it is reversible, and what the rollback is. Informed approval requires that the approver can see the worst case.

### Rule: Stop and surface the decision rather than picking a default on irreversible choices
**Applies to:** Anything destructive, production-affecting, cost-significant, or security-relevant where the right answer is genuinely ambiguous.
**Why:** The agent's job on a one-way door is to *surface* the tradeoff for a human decision, not to resolve it silently. Reversible choices can be made and corrected; irreversible ones must be escalated. Defaulting through an irreversible decision removes the human from a loop they need to be in.

---

## Sources

- [12-Factor App — V. Build, release, run](https://www.12factor.net/build-release-run)
- [OWASP Top 10 CI/CD Security Risks](https://owasp.org/www-project-top-10-ci-cd-security-risks/)
- [OWASP Cheat Sheet — CI/CD Security](https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html)
- [NIST SP 800-218 — Secure Software Development Framework (SSDF) v1.1](https://csrc.nist.gov/pubs/sp/800/218/final)
- [Microsoft Learn — What is Infrastructure as Code?](https://learn.microsoft.com/en-us/devops/deliver/what-is-infrastructure-as-code)
- [Octopus Deploy — Blue/Green vs Canary Deployments](https://octopus.com/devops/software-deployments/blue-green-vs-canary-deployments/)
- [Google Cloud — Database schema migrations with expand/contract](https://cloud.google.com/architecture/database-migration)
- [Site24x7 — Root Cause Analysis: A Strategic Guide for Engineers](https://www.site24x7.com/learn/root-cause-analysis-guide.html)
