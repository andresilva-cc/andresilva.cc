# Architecture Rules — Patterns and Anti-Patterns

**Read on-demand when the task involves choosing or evaluating an architectural style, structuring modules and dependencies, defining service boundaries, or reviewing code for structural defects.**

This file has two sections. The **Tradeoff Map** governs *pattern selection* — which architectural style fits a given system. Selection is contextual: there is no universally correct pattern, only one that fits a project's scale, team, and constraints. The **Checklist** governs *structural smells* — defects that are wrong regardless of the chosen pattern. Smells are decidable: true or false at the point of review.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

---

## Tradeoff Map — architectural styles

Pattern selection is a tradeoff exercise, not a checklist. Each style buys a property at the price of another. Match the style to the system's actual constraints — team size, scale, domain complexity, deployment cadence — not to fashion. Most systems are best served by a monolith; reach for distribution only when a concrete force demands it.

### Monolith (single-deployable application)

**Optimizes:** Simplicity — one codebase, one build, one deploy, one process to debug. In-process calls are fast and reliable. Refactoring across boundaries is a compiler-checked operation. Lowest operational overhead; no network, no distributed transactions, no service discovery.
**Sacrifices:** Independent scalability (the whole app scales as a unit), independent deployability (any change redeploys everything), and technology heterogeneity. Without internal discipline it erodes into a big ball of mud.
**Choose when:** New products and startups with unproven domains; small teams (one to two squads); systems where the bounded contexts are not yet understood. "Monolith first" is the common default — start here and extract services only once boundaries prove stable. The counter-case (Stefan Tilkov, "Don't start with a monolith"): organizations already operating microservices proficiently, or whose domain has obvious large-scale independent contexts from day one, may legitimately start distributed; the rule of thumb is not absolute.
**Avoid when:** Many independent teams need to deploy on independent cadences, or distinct subsystems have order-of-magnitude-different scaling profiles that an in-process app cannot satisfy economically.

### Modular monolith (single deployable, enforced internal modules)

**Optimizes:** Most of the monolith's simplicity *plus* explicit module boundaries with their own APIs and (ideally) their own data ownership. Keeps in-process performance and atomic transactions while making the structure that would later become services visible and enforced today. A well-built modular monolith is the cheapest path to microservices later — and often removes the need for them.
**Sacrifices:** Still one deployable: no independent deploy or scale per module. Boundary enforcement depends on tooling and review discipline; nothing physical stops a cross-module shortcut.
**Choose when:** The domain has identifiable bounded contexts but the team and scale do not yet justify distributed-systems cost. This is the correct default for most non-trivial systems.
**Avoid when:** The system is genuinely small (a plain monolith suffices) or teams already require independent deployment (go to microservices).

### Microservices (independently deployable services per capability)

**Optimizes:** Independent deployability and team autonomy — each service ships on its own cadence with its own pipeline. Independent scaling per service. Fault isolation (one service degrading need not take down others). Technology heterogeneity per service. Reinforces modular boundaries because crossing them requires a network call.
**Sacrifices:** Trades in-process simplicity for distributed-systems complexity — remote calls are slow and can fail, there is no atomic cross-service transaction, debugging requires distributed tracing, and there is no single place to see overall behavior. Demands mature CI/CD, observability, and on-call practice. Refactoring a boundary is now a cross-repo, cross-team migration.
**Choose when:** Multiple teams need to deploy independently; subsystems have sharply different scaling or availability needs; the organization already has the operational maturity (automated deploy, monitoring, on-call) to run a fleet.
**Avoid when:** The team is small, the domain boundaries are still unproven, or operational maturity is absent — distributing an unclear domain produces a distributed monolith, the worst of both worlds.

### Event-driven architecture (components communicate via asynchronous events)

**Optimizes:** Loose coupling between producer and consumer — the producer need not know who consumes. Easy to add new consumers without touching producers. Natural buffering and resilience: a slow or down consumer does not block the producer. Good fit for fan-out, integration, and reactive workflows.
**Sacrifices:** No single statement of overall behavior — control flow is implicit and scattered, making the system hard to reason about end-to-end. Eventual consistency is the default. Demands handling of duplicate, out-of-order, and failed messages; ordering and exactly-once delivery are hard. Debugging spans broker, producers, and consumers.
**Choose when:** Workflows are naturally asynchronous; many consumers react to the same fact; producer and consumer must be decoupled in time and deployment; spiky load needs buffering.
**Avoid when:** A request needs an immediate synchronous answer, strong consistency is required, or the workflow is a simple linear request/response — an event bus there only adds opacity.

### CQRS (separate read model from write model)

**Optimizes:** Independent optimization and scaling of reads versus writes — reads can use denormalized, query-shaped projections while writes enforce the domain model. Resolves read/write asymmetry (common 10:1+ read-heavy ratios). Lets a complex write model stay clean while queries stay fast.
**Sacrifices:** Two models to build and keep in sync; the read side is typically eventually consistent with the write side, so the UI may show stale data. A significant jump in design complexity and risk.
**Choose when:** A *specific bounded context* has a genuinely complex domain plus a large read/write asymmetry — not the whole system. Apply surgically.
**Avoid when:** The domain fits a CRUD mental model, data volumes are modest, or there is no read/write asymmetry. CQRS on a simple domain is a frequent cause of systems getting into serious trouble — most CQRS adoptions are not the minority case that benefits.

### Event sourcing (persist state as an append-only log of events)

**Optimizes:** A complete, immutable audit log by construction; full temporal queries ("what did this look like on date X"); the ability to rebuild state or derive new projections by replaying events; natural fit with event-driven integration and CQRS read models.
**Sacrifices:** Large complexity increase — event schema versioning and migration is hard and permanent; querying current state requires a projection; "deleting" data conflicts with an append-only log (a real concern under GDPR-style erasure rules); the learning curve is steep and tooling is specialized.
**Choose when:** Audit trail or temporal history is a first-class domain requirement (finance, ledgers, regulated workflows) within a *specific* bounded context.
**Avoid when:** The domain has no audit or history requirement, or the team has not used it before. Do not event-source a whole system; scope it to the context that needs it.

### Layered / N-tier architecture (horizontal layers: presentation → business → data)

**Optimizes:** Familiarity and low cognitive cost — matches the conventions of nearly every web framework. Fast to start; clear, conventional separation of concerns. Minimal abstraction overhead.
**Sacrifices:** Business logic depends (transitively) on the data layer, so it is coupled to infrastructure and harder to test in isolation. Tends to accrete "fat" service layers and anemic domain models. Layers can become change-amplifiers — one feature touches every layer.
**Choose when:** CRUD-centric apps, MVPs, and systems where delivery speed and developer familiarity outweigh long-term isolation of business rules.
**Avoid when:** The domain has complex business rules that must remain testable and insulated from database/framework churn — use hexagonal or clean architecture instead.
**Note:** Used loosely here for logical layers within a single process; N-tier originally meant physically separated tiers (presentation, application, data) on different hosts.

### Hexagonal / clean architecture (domain core isolated behind ports/adapters; dependencies point inward)

**Optimizes:** Business logic fully isolated from infrastructure — the domain depends on nothing external; databases, UIs, and frameworks are pluggable adapters. Highly testable core (no DB or network needed for domain tests). Infrastructure decisions can be deferred or swapped.
**Sacrifices:** More indirection — ports, adapters, and mapping between domain and infrastructure models. Up-front design cost and a real learning curve; misapplied, the abstractions add complexity without payoff.
**Choose when:** Complex, long-lived business domains that need a testable core insulated from infrastructure change — and the team has senior engineers who have shipped this style before.
**Avoid when:** The app is simple or CRUD-shaped, or no engineer on the team has run this style in production — start layered and adopt ports selectively where complexity justifies it.

### Serverless (functions-as-a-service, managed event-triggered compute)

**Optimizes:** No server management; automatic scale-to-zero and scale-out; pay-per-use billing that suits spiky or low-baseline workloads; fast to ship small, event-triggered units of work.
**Sacrifices:** Cold-start latency; hard limits on execution time, memory, and payload size; vendor lock-in to the platform's runtime and event model; local testing and debugging are harder; cost can exceed always-on compute at sustained high volume; statelessness forces external state for anything durable.
**Choose when:** Event-driven glue, scheduled jobs, webhook handlers, and spiky or unpredictable workloads where scale-to-zero saves real money.
**Avoid when:** Workloads are steady and high-volume (always-on compute is cheaper and faster), latency budgets cannot absorb cold starts, or long-running/stateful processing is required.

---

## Checklist — structural smells and anti-patterns

These defects are wrong under *any* chosen pattern. They are decidable: at review time each is present or absent. The software-architect prevents them; the code-reviewer enforces them; the tech-lead sequences work to avoid introducing them.

### Rule: Dependencies must point inward — toward stable abstractions, never toward volatile detail

**Applies to:** Every layered, hexagonal, or clean architecture. Domain/business code must not import from infrastructure, frameworks, or UI.
**Why:** The Dependency Rule: source-code dependencies point only inward, toward higher-level policy. When business logic depends on a database driver or web framework, every infrastructure change ripples into the domain and the domain cannot be tested in isolation. Invert the dependency — the inner layer defines an interface, the outer layer implements it.

### Rule: No layer-skipping — the presentation layer must not call the data layer directly

**Applies to:** Layered architectures; any controller, view, route handler, or UI component reaching past the business layer into a repository, ORM, or raw SQL.
**Why:** Skipping the business layer bypasses validation, authorization, and domain invariants, and scatters data-access logic into the UI. Each layer may only call the layer directly beneath it (or its declared inward port).

### Rule: No business logic in controllers, routes, views, or UI components

**Applies to:** HTTP controllers, route handlers, GraphQL resolvers, React/Vue components, serverless function entrypoints.
**Why:** Controllers are adapters — their job is to translate transport (HTTP, events) to and from domain calls. Domain rules (calculations, validation, workflow, invariants) placed there cannot be unit-tested without the transport layer, cannot be reused by another entrypoint, and get silently duplicated. Push logic into domain/service objects.

### Rule: Code lives in the module that owns its concern, not where it was convenient to type

**Applies to:** All modules, packages, and services. Watch for utility/helper/common dumping grounds and logic placed in the first file the author had open.
**Why:** Misplaced code breaks the boundary it nominally belongs to, creates accidental coupling, and makes the same concept impossible to find. A function operating on a domain concept belongs with that concept. A generic `utils` bag with cross-domain functions is a smell — split it by owning concern.

### Rule: No circular dependencies between modules, packages, or services

**Applies to:** Module/package import graphs and inter-service call graphs. The dependency graph must be acyclic (Acyclic Dependencies Principle).
**Why:** Components in a cycle must be understood, changed, tested, deployed, and reused as one inseparable unit — destroying the modularity the boundaries were meant to provide. Between services, a cycle of synchronous calls risks cascading failure and deadlock. Break cycles by extracting the shared abstraction, inverting one dependency, or merging genuinely-inseparable modules.

### Rule: Depend in the direction of stability — stable modules must not depend on volatile ones

**Numeric baseline:** Instability `I = outgoing / (incoming + outgoing)`; `0` = maximally stable, `1` = maximally unstable. Depend in the direction of decreasing `I`.
**Applies to:** Module dependency direction (Stable Dependencies Principle).
**Why:** A module that many others depend on is hard to change; if it in turn depends on something volatile, every churn in the volatile module destabilizes the whole graph. Stable, widely-depended-on modules should contain stable abstractions; volatile detail should sit at the leaves.

### Rule: No hub-like module that everything depends on and that depends on everything

**Applies to:** Module and service graphs — a single node with both high fan-in and high fan-out (god module, god service, shared "core" that accreted unrelated concerns). Concretely: a module sitting in the top decile of both fan-in and fan-out within its package graph, or the one most teams must touch to ship most features.
**Why:** A hub couples otherwise-independent parts of the system through itself: any change to it risks the whole system, and it cannot be reasoned about, tested, or deployed independently. Split it along the distinct concerns it has absorbed.

### Rule: API contracts must stay in sync with both producer and consumers — no contract drift

**Applies to:** REST/GraphQL/gRPC schemas, event payload schemas, shared DTOs, OpenAPI/AsyncAPI specs, and the code on both sides of them.
**Why:** When the implementation diverges from the published contract — or producer and consumer assume different versions — integration breaks at runtime in ways tests on either side alone will not catch. The contract is the source of truth: version it explicitly, evolve it backward-compatibly, and verify both sides against it (contract tests, schema validation in CI). A breaking change without a version bump and consumer migration is a defect.

### Rule: Do not let internal models leak across a module or service boundary

**Applies to:** Public APIs, events, and inter-module interfaces — exposing ORM entities, database rows, or another module's internal domain objects directly.
**Why:** Leaking an internal model makes every consumer depend on an implementation detail; the model can no longer change without breaking them, and the boundary stops being a boundary. Expose a deliberate, owned contract (DTO, public schema) and map to it.

### Rule: No distributed monolith

**Applies to:** Microservice architectures — any system claiming to be microservices but exhibiting one or more of: services that must be deployed together to work, services sharing a database or schema, services sharing domain types via a common runtime library that forces lockstep upgrades, or chains of long synchronous service-to-service calls on the request path.
**Why:** A distributed monolith pays every cost of distribution — network latency, partial failure, serialization, cross-service debugging, deployment coordination — without buying any of the benefits (independent deploy, independent scale, fault isolation, team autonomy). It is strictly worse than the monolith it replaced. Either collapse the services back into a properly-modular monolith, or break the coupling: separate databases, contract-versioned APIs, asynchronous communication where synchronous chains form, and per-service deploy independence.

### Rule: No anemic domain model

**Applies to:** Domain modeling in layered, hexagonal, or clean architectures — entities reduced to public-getter/setter data bags with all behavior pushed into "service" or "manager" classes operating on them from outside.
**Why:** The Anemic Domain Model (Fowler) looks object-oriented but is procedural — domain logic is separated from the data it operates on, breaking encapsulation. Invariants cannot be enforced at the entity level (any caller can mutate state into an illegal shape), the same logic gets duplicated across service classes, and the model becomes a thin layer over the database rather than a model of the domain. Push behavior onto the entity (or aggregate) that owns the data; reserve services for orchestration across entities, not for logic that belongs *to* an entity.

---

## Sources

- [Martin Fowler — Microservice Trade-Offs](https://martinfowler.com/articles/microservice-trade-offs.html)
- [Martin Fowler — Microservices Guide](https://martinfowler.com/microservices/)
- [Martin Fowler — MonolithFirst](https://martinfowler.com/bliki/MonolithFirst.html)
- [Martin Fowler — Don't start with a monolith](https://martinfowler.com/articles/dont-start-monolith.html)
- [Martin Fowler — CQRS](https://martinfowler.com/bliki/CQRS.html)
- [Martin Fowler — Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html)
- [Martin Fowler — The Many Meanings of Event-Driven Architecture (GOTO 2017)](https://www.youtube.com/watch?v=STKCRSUsyP0)
- [Martin Fowler — Software Architecture Guide](https://martinfowler.com/architecture/)
- [Robert C. Martin — The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Khalil Stemmler — The Dependency Rule](https://khalilstemmler.com/wiki/dependency-rule/)
- [Alistair Cockburn — Hexagonal Architecture (Ports and Adapters)](https://alistair.cockburn.us/hexagonal-architecture/)
- [Chris Richardson — Microservices.io Pattern Language](https://microservices.io/patterns/)
- [Chris Richardson — Microservice Architecture pattern](https://microservices.io/patterns/microservices.html)
- [Wikipedia — Acyclic Dependencies Principle](https://en.wikipedia.org/wiki/Acyclic_dependencies_principle)
- [O'Reilly — Principles of Package Design: The Stable Dependencies Principle](https://www.oreilly.com/library/view/principles-of-package/9781484241196/html/471891_1_En_10_Chapter.xhtml)
- [Arcan — What Are Architectural Smells](https://www.arcan.tech/blog/what-are-architectural-smells/)
- [Microsoft Azure Architecture Center — CQRS pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs)
- [Microsoft Azure Architecture Center — Event Sourcing pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing)
- [C4 model — Software architecture diagramming](https://c4model.com/)
- [SEI — Architecture Tradeoff Analysis Method (ATAM)](https://www.sei.cmu.edu/library/architecture-tradeoff-analysis-method-collection/)
