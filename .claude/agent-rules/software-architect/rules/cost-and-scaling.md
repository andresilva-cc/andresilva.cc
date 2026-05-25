# Architecture Rules — Cost and Scaling

**Read on-demand when the task involves cost modeling, capacity planning, choosing between managed and self-hosted services, or deciding when and how to scale.**

This file has two sections. The **Tradeoff Map** governs *scaling and sourcing choices* — managed vs self-hosted, scale-up vs scale-out — which are contextual and depend on load shape, team size, and budget. The **Checklist** governs *cost discipline* — decidable practices that keep an indie project's bill from quietly growing. The governing principle: for a small team the scarcest resource is developer time, and the second scarcest is a predictable bill — design for both.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

---

## Cost and scaling discipline (read first)

- **Optimize developer time first, money second.** Paying a managed service to remove operational toil is usually the right trade for a small team — engineering hours cost more than the service.
- **Design for the load you will plausibly have, with a documented path beyond.** Not for hypothetical hyperscale. Premature scaling architecture is wasted money and complexity.
- **Scaling is a response to a measured bottleneck, not a guess.** Identify the actual constraint — CPU, memory, connections, I/O, a slow query — before changing the architecture. The most common "scaling problem" is an unindexed query, fixed for free.
- **Know the shape of each cost.** Fixed (always-on compute), usage-based (requests, bandwidth, function invocations), and per-unit (per user, per seat) costs scale differently. A free tier that ends in a per-user cliff can become the largest line item.

---

## Tradeoff Map — sourcing and scaling

### Managed service (database, auth, queue, search as a hosted product)

**Optimizes:** Developer time — provisioning, patching, backups, failover, scaling, and security updates are the vendor's job. Predictable, fast to adopt, and removes whole categories of operational risk.
**Sacrifices:** A higher unit price than raw infrastructure; pricing and capability changes are outside your control; some coupling to the vendor's model and an eventual migration cost.
**Choose when:** The default for a solo developer or small team. The time a managed service saves is worth more than the premium it charges.
**Avoid when:** Usage is large and stable enough that raw-infrastructure economics clearly win *and* someone will own the operational work — or a hard compliance/residency rule forbids the managed option.

### Self-hosted / self-managed equivalent

**Optimizes:** Lowest raw unit cost at scale; full control over configuration and tuning; no vendor pricing risk.
**Sacrifices:** You own provisioning, patching, security hardening, backups, monitoring, failover, and upgrades — a large, recurring, low-leverage time cost. Mistakes here cause outages and data loss.
**Choose when:** Scale makes the cost gap large, the team has genuine operational capacity, or a compliance requirement demands it.
**Avoid when:** The default indie case — the time cost almost always exceeds the money saved, and the reliability is usually worse.

### Scale up (vertical — a bigger instance)

**Optimizes:** Simplicity — no code or architecture change, often a config slider; no distributed-systems problems introduced; immediate relief for a CPU-, memory-, or connection-bound workload.
**Sacrifices:** A hard ceiling (the largest instance available); cost climbs steeply at the top of the range; usually a single point of failure unless paired with a standby.
**Choose when:** The first response to a capacity problem. It buys time cheaply and the bottleneck (especially a database) is often hard to scale any other way. A traditional single-primary SQL database is almost always scaled up first; horizontally-distributed datastores (DynamoDB, Spanner, Cassandra, CockroachDB) are designed to scale out and don't follow this default.
**Avoid when:** The ceiling is in sight, or the workload genuinely needs more availability than one instance can offer.

### Scale out (horizontal — more instances behind a balancer)

**Optimizes:** No fixed ceiling; commodity instances are cheaper per unit than the top of the vertical range; redundancy improves availability; elastic — add capacity for peaks, remove it after.
**Sacrifices:** Requires stateless application instances (session and uploaded state must move to a shared store); a load balancer and health checks to operate; the datastore often becomes the next bottleneck and does not scale out as easily.
**Choose when:** The application tier is stateless (or cheaply made so), traffic is variable, or vertical scaling has hit its ceiling.
**Avoid when:** The app holds local state that is expensive to externalize, or the real bottleneck is the database — adding app instances then just adds load to the constrained tier.

### Scale to zero (serverless / on-demand compute)

**Optimizes:** Pay only for actual use; idle costs nothing; automatic scale-out for spikes — ideal for low-baseline or spiky workloads.
**Sacrifices:** Cold-start latency on the first request after idle; per-invocation pricing can exceed always-on compute at sustained high volume; execution and statefulness limits.
**Choose when:** Spiky, low-baseline, or intermittent workloads — webhooks, scheduled jobs, side workloads, early-stage products with little traffic.
**Avoid when:** Traffic is steady and high (always-on is cheaper and avoids cold starts) or latency budgets cannot absorb the cold start.

### Caching / CDN as a scaling lever

**Optimizes:** Often the highest-leverage and cheapest scaling move — a CDN serves static assets and cacheable responses from the edge, and an application cache offloads hot reads from the database. Frequently removes a bottleneck for a fraction of the cost of scaling compute.
**Sacrifices:** Cache invalidation is a genuine hard problem; stale data if invalidation is wrong; another component to reason about.
**Choose when:** Read-heavy workloads, static or semi-static content, a measured database read hot-spot. Reach for caching before scaling the database.
**Avoid when:** Data is highly dynamic and per-user with no cacheable surface, or it is added speculatively before a measured need.

---

## Checklist — indie cost discipline

These are decidable practices that keep the bill predictable. Verify each at design time.

### Rule: Produce a written monthly cost estimate, itemized by service, before launch

**Applies to:** Every architecture document.
**Why:** A stack chosen without a cost model produces bill surprises. List each service, its pricing model (fixed / usage / per-unit), its free-tier limit, and the expected monthly cost at launch traffic. An estimate makes an expensive choice visible while it is still cheap to change.

### Rule: Know where every free tier ends — and what the first paid step costs

**Applies to:** Every free-tier service in the stack.
**Why:** Free tiers are excellent for launch but each has a cliff — a usage cap, a row limit, a per-user charge that begins at seat N. Document the limit and the cost of crossing it, so growth is a planned expense, not a shock.

### Rule: Identify the cost that scales with usage and confirm it scales sub-linearly with revenue

**Applies to:** Usage-priced services — bandwidth, function invocations, per-user auth/seats, third-party API calls.
**Why:** A cost that grows faster than the revenue it supports is a structural loss that worsens with success. For each usage-priced line, confirm revenue per unit comfortably exceeds cost per unit. (Unit economics: cross-reference the revenue-strategist's pricing model.)

### Rule: Set billing alerts and usage caps on every metered service

**Applies to:** Every account with usage-based billing.
**Why:** A runaway loop, a scraping attack, or a viral spike can multiply a bill overnight. Billing alerts give early warning; hard usage caps (where the provider offers them) prevent a catastrophic charge. This is a launch requirement, not a later task.

### Rule: Set data retention and cleanup policies — storage and logs grow unbounded by default

**Applies to:** Logs, metrics, soft-deleted rows, file storage, backups, analytics events.
**Why:** Storage costs accrete silently. Without a retention policy, log and backup storage becomes a growing line item with no corresponding value. Decide retention windows at design time.

### Rule: Right-size at launch — provision for launch traffic, not imagined scale

**Applies to:** Compute instance sizes, database tiers, reserved capacity.
**Why:** Over-provisioning "to be safe" pays for headroom no one uses. Start small, monitor real utilization, and scale on evidence. Most managed services scale up in minutes — the cost of starting small is near zero.

### Rule: Treat egress bandwidth and cross-region/cross-service traffic as a real cost line

**Applies to:** Architectures moving large volumes of data out of a provider or between regions/services.
**Why:** Inbound traffic is usually free; egress is usually metered and can become a dominant cost for media-heavy or data-export-heavy products. A CDN in front of static assets cuts egress; keeping chatty services in the same region avoids cross-region charges. Account for this when placing data and services.

---

## Sources

- [AWS Well-Architected Framework — Cost Optimization Pillar](https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/welcome.html)
- [AWS Well-Architected Framework — Reliability Pillar](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html)
- [Google Cloud Architecture Framework — Cost optimization](https://cloud.google.com/architecture/framework/cost-optimization)
- [Microsoft Azure Well-Architected Framework — Cost Optimization](https://learn.microsoft.com/en-us/azure/well-architected/cost-optimization/)
- [Martin Fowler — Designed for Scale (and scalability tradeoffs)](https://martinfowler.com/architecture/)
- [Martin Kleppmann — Designing Data-Intensive Applications (Ch. 1: scalability, load parameters)](https://dataintensive.net/)
- [The Twelve-Factor App — Stateless processes; concurrency](https://12factor.net/)
