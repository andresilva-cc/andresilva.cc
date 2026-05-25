# Architecture Rules — Risk Catalog

**Read on-demand when the task involves enumerating technical risks and their mitigations — for the "Technical Risks & Mitigations" section of an architecture document, or any design review.**

This file is a methods catalog of the recurring technical risks that show up in almost every system, with the mitigations that reduce them. It is a prompt list, not an exhaustive register — work through it for every architecture, assess each risk's likelihood and impact *for this specific project*, and apply the mitigations that fit. A risk named at design time is cheap to mitigate; the same risk discovered in production is not.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

---

## Using this catalog

For each risk: state what could go wrong, rate **impact** (High/Medium/Low) and **likelihood** for this project, then list concrete mitigations. Treat any risk that is both high-impact and plausible as a design input, not a footnote — it should shape a real architecture decision. A mitigation that no one will actually do is not a mitigation.

---

## Data risks

### Technique: Guard against data loss

**What it is:** Permanent loss or corruption of user data — from accidental deletion, a bad migration, storage failure, or a buggy write path.
**When to apply:** Every system that stores data the user cannot trivially recreate. For most products this is the single highest-impact risk.
**How:**
- Use a managed datastore with automated, point-in-time backups — confirm the retention window and that it covers a realistic detection-to-discovery gap.
- **Test restores, not just backups.** An untested backup is a hope, not a control. Restore to a scratch environment and verify the data periodically.
- Make destructive migrations reversible or, where they cannot be, take an explicit snapshot immediately before. Apply schema changes additively where possible (add a column, backfill, switch reads, then drop later).
- Use soft delete for user-facing records where accidental loss is costly (see `data-modeling.md`).
- Constrain blast radius: least-privilege database credentials so application code cannot drop tables; separate the account that can run destructive operations.

### Technique: Protect data integrity and consistency

**What it is:** Data drifts into an invalid state — orphaned references, duplicated facts that disagree, broken invariants, partial writes from a failed multi-step operation.
**When to apply:** Any system with related entities, denormalized copies, or operations that touch multiple records or services.
**How:**
- Push integrity into the database — foreign keys, `NOT NULL`, `UNIQUE`, `CHECK` constraints. Application-only integrity drifts.
- Wrap multi-step writes that must all-or-nothing in a transaction.
- For state that genuinely spans services (no shared transaction), design the consistency model explicitly — idempotent operations, a reconciliation job, or a saga with compensating actions. Do not leave it implicit.
- Where data is denormalized, define exactly what keeps the copies in sync and what happens if that path fails.

---

## Dependency and lock-in risks

### Technique: Bound vendor and platform lock-in

**What it is:** A managed service, framework, or platform becomes hard to leave — through proprietary APIs, a proprietary data format, or deep coupling — exposing the project to the vendor's pricing changes, capability changes, or shutdown.
**When to apply:** Every architecture built on managed services (i.e. nearly all of them). The goal is *bounded, deliberate* lock-in, not zero lock-in — some lock-in is the price of leverage and worth paying.
**How:**
- Distinguish reversible from irreversible lock-in. Hosting and compute are usually cheap to change. The datastore and the data format are not — scrutinize those hardest.
- Prefer services built on portable foundations (a standard SQL engine, an open protocol, an open data format) over fully proprietary ones, when the choice is otherwise close.
- Keep an exit path in mind: confirm the data can be exported in a usable form, and isolate vendor-specific calls behind a thin internal interface so a swap touches few files.
- Accept deep lock-in deliberately when the leverage is large and the alternative is real operational burden — but write down that the decision was made with eyes open.

### Technique: Manage third-party dependency and supply-chain risk

**What it is:** A library, API, or service the system depends on introduces a vulnerability, breaks compatibility, suffers an outage, or is abandoned.
**When to apply:** Every system — all of them have dependencies.
**How:**
- Prefer well-maintained dependencies with active development and a healthy community; an abandoned library is a latent liability.
- Use a lockfile to pin transitive dependency versions, paired with automated dependency-update PRs (Dependabot, Renovate) so security patches don't stagnate. Unilateral version pinning without an update mechanism leaves stale CVEs unpatched. Detail in `_shared/rules/secrets-and-supply-chain.md`.
- For a critical third-party API, design for its failure — timeouts, retries with backoff, a circuit breaker, and a defined degraded behavior when it is down. Do not assume it is always available.
- Minimize the dependency count. Every dependency is attack surface, upgrade burden, and a potential breakage.

---

## Performance and availability risks

### Technique: Find performance bottlenecks before they find you

**What it is:** The system slows or fails under load — most often the database (unindexed queries, N+1 patterns, connection-pool exhaustion), but also unbounded result sets, slow third-party calls on the request path, or memory growth.
**When to apply:** Every system, with attention proportional to expected load. The most common bottleneck is the database.
**How:**
- Design the indexes for the known query patterns up front (see `data-modeling.md`); the most frequent "scaling crisis" is a missing index.
- Eliminate N+1 query patterns by design — load related data in batches.
- Paginate every collection endpoint and bound page size (see `api-design.md`); an unbounded list is a latency cliff as data grows.
- Keep slow or unreliable work off the synchronous request path — move it to a background job.
- Cache measured read hot-spots and put a CDN in front of static assets (see `cost-and-scaling.md`).
- Add basic performance observability — request latency, database query time, error rate — from launch, so the real bottleneck is visible rather than guessed.

### Technique: Plan for partial failure and graceful degradation

**What it is:** A dependency — database, third-party API, queue, cache — is slow or down, and the failure cascades into a full outage instead of a contained degradation.
**When to apply:** Any system with an external dependency on the request path.
**How:**
- Set explicit timeouts on every outbound call; a call with no timeout can hang a worker indefinitely and exhaust the pool.
- Retry only idempotent operations, with exponential backoff and a cap; blind retries amplify an overload.
- Define degraded behavior: what the product does when a non-critical dependency is down (serve stale cache, hide a feature, queue the work) versus a critical one (a clear error beats a hang).
- Fail closed for security-relevant checks, fail gracefully for everything else.

### Technique: Eliminate single points of failure proportionate to the availability target

**What it is:** One component — a single database instance, a single VM, a single region — whose failure takes the whole system down.
**When to apply:** Every system, calibrated to its real availability requirement. An indie MVP does not need multi-region; it does need backups and a known recovery procedure.
**How:**
- Be explicit about the availability target — "best effort with fast recovery" is a legitimate, cheap choice for an early product; do not pay for five-nines a product does not need.
- Use managed services with built-in redundancy where it is included at no real extra cost.
- Make application instances stateless so a failed one is simply replaced.
- Have a written, tested recovery procedure for the components that are *not* redundant — recovery time is the real metric for a single-instance design.

---

## Process and design risks

### Technique: Track and contain technical debt from MVP shortcuts

**What it is:** Deliberate Phase-1 simplifications — a skipped abstraction, a hardcoded value, a deferred edge case — that are reasonable now but become a hazard if forgotten.
**When to apply:** Every project that ships an MVP, which is every project.
**How:**
- Distinguish *prudent, deliberate* debt (a conscious shortcut, documented, with a known payback trigger) from *reckless* debt (a mess from inattention). Take the first; never the second.
- Write down each shortcut and the condition that should trigger paying it back ("revisit when tenant count exceeds X", "extract this service when a second team forms").
- Keep shortcuts reversible. A shortcut that is cheap to undo later is fine; one that bakes a bad assumption into the data model or a public API contract is not — those are the places to *not* cut corners.

### Technique: Surface and resolve requirement and scope risk early

**What it is:** The architecture is built on an ambiguous, missing, or volatile requirement, and a wrong assumption becomes expensive to undo once code depends on it.
**When to apply:** Every architecture derived from a product spec.
**How:**
- Flag architecturally-significant ambiguities in the spec explicitly; state the assumption made and mark it as an assumption.
- Identify the requirements most likely to change and keep the design flexible exactly there (a flexible query model, a thin interface) — without over-engineering everywhere else.
- Where a wrong guess would be very expensive (data model, tenancy model, public API contract, auth model), get explicit confirmation rather than assuming. These are the decisions that are painful to reverse after launch.

### Technique: Scope security risk at design time (cross-reference)

**What it is:** A missing security control — authn, authz, validation, data protection — designed in too late or not at all.
**When to apply:** Every architecture.
**How:** Threat-model anything touching money, credentials, PII, or a trust boundary, and design controls in from the start. The architectural security decisions are catalogued in `security-baseline.md` and implementation detail in `_shared/rules/security.md` — this entry exists so security is not omitted from the risk pass, not to duplicate them.

---

## Sources

- [Martin Fowler — Technical Debt](https://martinfowler.com/bliki/TechnicalDebt.html)
- [Martin Fowler — Technical Debt Quadrant](https://martinfowler.com/bliki/TechnicalDebtQuadrant.html)
- [Martin Kleppmann — Designing Data-Intensive Applications (Ch. 1: reliability, faults vs failures)](https://dataintensive.net/)
- [AWS Well-Architected Framework — Reliability Pillar](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html)
- [Google — Site Reliability Engineering (handling overload, addressing cascading failures)](https://sre.google/sre-book/table-of-contents/)
- [Microsoft Azure Architecture Center — Reliability patterns (Retry, Circuit Breaker, Bulkhead)](https://learn.microsoft.com/en-us/azure/architecture/patterns/category/resiliency)
- [OWASP — Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html)
- [Chris Richardson — Microservices.io: Saga pattern](https://microservices.io/patterns/data/saga.html)
