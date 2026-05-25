# Architecture Rules — Stack Selection

**Read on-demand when the task involves choosing a frontend framework, backend language/runtime, datastore class, hosting model, or authentication approach.**

Stack selection is almost entirely contextual — there is no universally correct framework or runtime, only one that fits a project's scale, team size, latency budget, and operational appetite. This file is a tradeoff map: each entry names a *class* of option (never a single named product, which dates fast), what it optimizes, what it sacrifices, and the conditions that favor or rule it out. Pick the criterion that matches the project; the specific product is then an implementation detail.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

---

## Selection discipline (read first)

- **Pick the boring option unless a force demands otherwise.** A proven technology with a deep ecosystem, current documentation, and a large hiring pool removes whole categories of risk. Novelty is a cost; it must be paid for by a concrete, named advantage.
- **Minimize the number of distinct technologies.** Every added language, datastore, or runtime is a separate thing to learn, deploy, secure, monitor, and upgrade. For a solo developer this overhead compounds fast.
- **Detect-and-conform.** If a spec or existing codebase already commits to a stack, work within it. Do not introduce a parallel system.
- **Favor consolidation for small teams.** One language across frontend and backend, one datastore that covers the primary access patterns, one hosting platform — fewer context switches, one mental model.
- **Match the option to the load, not the aspiration.** Design for the traffic the project will plausibly have in its near-term planning horizon, with a documented path beyond — not for hypothetical hyperscale. For an indie or solo build, 6–12 months is a typical horizon; for an enterprise sale or a regulated platform, the horizon is longer. State the horizon explicitly so capacity decisions can be evaluated against it.

---

## Frontend rendering model

### Server-rendered (SSR / multi-page, server-driven HTML)

**Optimizes:** Fast first paint and time-to-interactive on content; minimal client JavaScript; SEO and link-preview correctness for free; simple mental model — the server owns state. Lower client-device requirements.
**Sacrifices:** Full-page navigation feels less fluid than a client app; rich client-side interactivity requires extra layering; server does rendering work on every request.
**Choose when:** Content-led products (marketing, docs, commerce, publishing), SEO matters, the UI is mostly forms and reads, or the team is small and wants the simplest model.
**Avoid when:** The product is a highly interactive app (editor, dashboard, real-time collaboration) where the UI behaves more like a desktop application.

### Single-page application (SPA, client-rendered)

**Optimizes:** Fluid in-app navigation with no full reloads; rich, stateful client interactivity; clean separation between a frontend and a backend API consumed by multiple clients.
**Sacrifices:** Larger JavaScript bundle and slower first paint; SEO and link previews need extra work; client and server state can drift; more moving parts.
**Choose when:** The product is an interactive application behind a login (dashboards, editors, tools) where SEO is irrelevant and interactivity is the point.
**Avoid when:** The product is content-led and discoverability matters, or the team wants to avoid maintaining a separate API surface for one client.

### Hybrid meta-framework (SSR + hydration, server components, streaming)

**Optimizes:** Per-route choice of rendering strategy — static where possible, server-rendered where dynamic, client-interactive where needed. Good defaults for SEO *and* interactivity in one codebase.
**Sacrifices:** A more complex mental model (server/client boundary, hydration, caching layers); rendering bugs are harder to reason about; tighter coupling to the framework's conventions.
**Choose when:** The product genuinely mixes content pages and interactive app surfaces, and the team can absorb the framework's complexity.
**Avoid when:** The product is clearly all-content or all-app — a focused tool beats a hybrid you only half-use. Also avoid if the team is new to the framework's server/client model.

---

## Backend language and runtime

### Single language across frontend and backend

**Optimizes:** One mental model, one toolchain, shared types and validation logic across the wire, easy context switching for a solo developer; the largest hiring pool for web work.
**Sacrifices:** Single-threaded runtimes handle CPU-bound work poorly; raw compute throughput trails compiled languages.
**Choose when:** I/O-bound web apps (the common case — most requests wait on a database or an API), small teams, fast iteration matters more than peak compute.
**Avoid when:** The workload is genuinely CPU-bound (media processing, simulation, heavy data crunching) — isolate that work in a compiled-language service or a managed processing service.

### Managed-runtime, batteries-included framework (convention-heavy, full-stack)

**Optimizes:** Productivity — ORM, migrations, auth scaffolding, admin, background jobs included; strong conventions mean fewer decisions; mature, well-trodden upgrade paths.
**Sacrifices:** Runtime performance per request trails leaner stacks; the framework's conventions are hard to fight when you need to; heavier baseline resource use.
**Choose when:** CRUD-heavy products, solo developers who benefit from decisions made for them, projects where shipping speed dominates.
**Avoid when:** Latency budgets are tight at scale, or the product's shape fights the framework's conventions hard enough to spend the productivity gain on workarounds.

### Compiled, statically-typed systems language

**Optimizes:** Raw throughput and low, predictable latency; low memory footprint (cheaper to run at scale); compile-time guarantees catch a class of bugs early.
**Sacrifices:** Slower iteration; smaller web ecosystem and hiring pool; more ceremony for ordinary CRUD work.
**Choose when:** Latency or compute cost is a first-class requirement, the workload is CPU-bound, or a hot path needs to be carved out of an otherwise higher-level stack.
**Avoid when:** The product is an ordinary I/O-bound web app and the team is small — the productivity tax rarely pays back for a solo developer.

---

## Primary datastore class

> Relational vs document modeling tradeoffs are covered in depth in `data-modeling.md`. This entry is about the *operational* class of datastore.

### Managed relational database (SQL, single-node primary)

**Optimizes:** ACID transactions, strong consistency, mature tooling, the most flexible query model (joins, aggregates, ad-hoc analytics), and the widest hiring pool. A managed offering removes backups, patching, and failover toil.
**Sacrifices:** Vertical scaling has a ceiling; horizontal write scaling requires sharding, which is genuinely hard; schema migrations need care.
**Choose when:** The default for almost every product. Relational fits most domains, and "we might outgrow it" is a problem for a much later, much larger version of the product.
**Avoid when:** The access pattern is genuinely non-relational at large scale (extreme write throughput, simple key lookups at massive volume) — and only once that scale is real, not anticipated.

### Managed document / NoSQL store

**Optimizes:** Flexible, schema-light documents; horizontal scaling and high write throughput as built-in properties; natural fit for self-contained aggregates read and written as a unit.
**Sacrifices:** No cross-document transactions or joins in the general case; consistency is often eventual; ad-hoc querying and analytics are weak; the application must own data integrity the database would otherwise enforce.
**Choose when:** The data is naturally a self-contained document, access is by key, the schema varies per record, or write scale genuinely exceeds what a relational primary can serve.
**Avoid when:** The domain is relational (entities with many cross-cutting relationships and reporting needs) — forcing it into documents pushes join logic and integrity into application code.

### Backend-as-a-service / integrated data platform

**Optimizes:** Speed to first launch — database, auth, file storage, and auto-generated APIs in one managed bundle; minimal operational surface for a solo developer.
**Sacrifices:** Coupling to one vendor's model; less control over query tuning and scaling; pricing and capability changes are outside your control; an exit later means real migration work.
**Choose when:** Early-stage products and MVPs where time-to-launch dominates and the data model is mainstream.
**Avoid when:** The product has unusual data or query needs the platform does not serve well, or long-term vendor independence is a hard requirement. (See `risk-catalog.md` on lock-in.)

### Adding a cache or in-memory store

**Optimizes:** Latency on hot reads, offloading the primary database, and serving ephemeral state (sessions, rate-limit counters, queues).
**Sacrifices:** A second datastore to operate and reason about; cache invalidation is a genuine hard problem; stale data if invalidation is wrong.
**Choose when:** A measured read hot-spot exists, or you need ephemeral shared state that does not belong in the primary store.
**Avoid when:** It is added speculatively. Do not introduce a cache before a measured need — it adds a consistency problem in exchange for a latency win you have not confirmed you need.

---

## Hosting and compute model

### Platform-as-a-service (managed app hosting, git-push deploy)

**Optimizes:** Developer time — deploy from a git push, managed TLS, environments, logs, and scaling controls; no servers to patch. The lowest operational burden for a small team.
**Sacrifices:** Less infrastructure control; pricing above generous tiers can exceed raw compute; some lock-in to the platform's build and runtime conventions.
**Choose when:** The default for indie and small-team web apps. Developer time is the scarcest resource; PaaS spends money to save it.
**Avoid when:** The workload has unusual infrastructure needs the platform cannot express, or scale is large enough that raw-compute economics clearly win.

### Serverless functions (event-triggered, scale-to-zero)

**Optimizes:** No server management, automatic scale-out, pay-per-use billing that suits spiky or low-baseline workloads, and fast shipping of small event-driven units.
**Sacrifices:** Cold-start latency; execution-time, memory, and payload limits; harder local testing; vendor lock-in to the platform's runtime and event model; cost can exceed always-on compute at sustained high volume.
**Choose when:** Webhook handlers, scheduled jobs, glue between services, and spiky workloads where scale-to-zero saves real money.
**Avoid when:** Traffic is steady and high-volume (always-on is cheaper and faster), latency budgets cannot absorb cold starts, or work is long-running or stateful. (See `architecture-patterns.md` for the serverless architectural tradeoff.)

### Containers on managed orchestration

**Optimizes:** Portability and environment parity; fine-grained control over runtime and resources; a credible path to scale and multi-service deployment.
**Sacrifices:** Real operational complexity — orchestration, networking, and rollout strategy become your concern; overkill for a single small app.
**Choose when:** The team already has the operational maturity, the system is genuinely multi-service, or portability across providers is a hard requirement.
**Avoid when:** It is a single solo-developer app — a PaaS delivers the same outcome with a fraction of the operational surface.

### Self-managed virtual machines

**Optimizes:** Maximum control and often the lowest raw compute cost per unit; no platform conventions to fight.
**Sacrifices:** You own OS patching, security hardening, TLS, backups, monitoring, and uptime. For a solo developer this is a large, recurring, low-leverage time sink.
**Choose when:** A specific compliance, cost, or control requirement genuinely demands it, and someone will own the operational work.
**Avoid when:** The default indie case — the time cost of running your own machines almost always exceeds the money saved.

---

## Authentication approach

### Managed authentication / identity provider

**Optimizes:** Offloads the highest-risk security surface — password hashing, MFA, session handling, social login, account recovery, and breach monitoring are built and maintained by specialists. Fast to integrate.
**Sacrifices:** Per-user or tiered cost that grows with the user base; coupling to the provider's model; user-identity data lives partly outside your database.
**Choose when:** The default for most products. Authentication is security-critical and easy to get subtly wrong; a managed provider is the highest-leverage outsourcing decision available.
**Avoid when:** Per-user pricing is untenable at the expected scale, or a hard data-residency or independence requirement forbids a third party holding identity data.

### Framework-native / self-hosted authentication

**Optimizes:** Full control, no per-user cost, all identity data in your own database, no third-party dependency on a critical path.
**Sacrifices:** You own every security detail — correct password hashing, MFA, session fixation defense, secure recovery flows, throttling. Mistakes here are breaches.
**Choose when:** A mature, well-audited auth library exists for the stack, the team understands the security requirements, and per-user pricing or data-residency rules out a managed provider.
**Avoid when:** The team would be assembling auth from primitives — hand-rolled authentication is a frequent source of critical vulnerabilities. (See `security-baseline.md`.)

### Session cookies (server-held session, cookie credential)

**Optimizes:** Simplicity and instant revocability for browser-facing apps — the server holds session state, so logout is immediate and a compromised session can be killed centrally; `HttpOnly` + `Secure` + `SameSite` cookies resist XSS and CSRF when set correctly; the credential lifecycle is fully under the server's control.
**Sacrifices:** Server-side session state (a store to operate and scale); awkward for non-browser, cross-domain, or service-to-service clients; cross-domain use needs explicit CORS and cookie configuration.
**Choose when:** A single browser-facing web app or a small set of first-party subdomains — the simpler, safer default for most products.
**Avoid when:** Multiple independent services or non-browser clients must verify identity without a shared session store, or fully stateless verification is a requirement.

### Stateless tokens (JWT-style, self-contained credential)

**Optimizes:** Statelessness — any service can verify the token using a shared key or JWKS without consulting a session store; clean fit for service-to-service, mobile/native clients, and federated multi-domain setups.
**Sacrifices:** Revocation is hard — a valid token works until expiry unless a denylist is added (which reintroduces server state); easy to misuse (`localStorage` exposes tokens to XSS, long lifetimes amplify breach impact); per-token validation is more error-prone than checking a session.
**Choose when:** Multiple independent services or non-browser clients must verify identity without a shared session store; mobile or federated SSO scenarios; deliberately stateless API designs.
**Avoid when:** A single browser-facing app where session cookies would suffice — the operational complexity does not pay back. If chosen, pair with short access-token lifetimes and a refresh-token rotation mechanism, and store tokens in a way that does not expose them to XSS.

---

## Sources

- [Martin Fowler — Software Architecture Guide](https://martinfowler.com/architecture/)
- [Martin Fowler — Patterns of Enterprise Application Architecture](https://martinfowler.com/eaaCatalog/)
- [Martin Kleppmann — Designing Data-Intensive Applications (Ch. 1–3: data models, storage engines)](https://dataintensive.net/)
- [AWS Well-Architected Framework — Performance Efficiency Pillar](https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/welcome.html)
- [Google Cloud Architecture Framework](https://cloud.google.com/architecture/framework)
- [Microsoft Azure Well-Architected Framework](https://learn.microsoft.com/en-us/azure/well-architected/)
- [The Twelve-Factor App](https://12factor.net/)
- [OWASP Cheat Sheet — Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [OWASP Cheat Sheet — JSON Web Token for Java / token security](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
- [Baeldung — REST vs GraphQL vs gRPC](https://www.baeldung.com/rest-vs-graphql-vs-grpc)
