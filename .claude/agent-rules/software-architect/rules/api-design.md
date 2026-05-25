# Architecture Rules — API Design

**Read on-demand when the task involves choosing an API style (REST, GraphQL, RPC) or settling API conventions — versioning, pagination, error format, idempotency.**

This file has two sections. The **Tradeoff Map** governs *style selection* — REST vs GraphQL vs RPC is contextual, driven by who consumes the API and how. The **Checklist** governs *conventions* — decidable choices (versioning, pagination, errors) that are right or wrong once the style is fixed, and should be settled once and applied uniformly.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

---

## Tradeoff Map — API style

The right style depends on the consumer. A first-party web frontend, a public third-party API, and an internal service-to-service call have different needs and may justify different styles in the same system. Default to REST unless a concrete force points elsewhere.

### REST over HTTP (resource-oriented, JSON)

**Optimizes:** Universality — every developer, tool, and language already speaks it; HTTP caching, status codes, and intermediaries work for free; easy to debug with ordinary tools (browser, `curl`); a forgiving, low-risk choice; great for public APIs because consumers need no special client.
**Sacrifices:** Over-fetching (the endpoint returns more than a client needs) and under-fetching (a screen needs several round trips); the resource shape is fixed by the server, so diverse clients compromise; no built-in schema or type contract unless you add one (OpenAPI).
**Choose when:** The default. Public-facing APIs, first-party apps with straightforward data needs, CRUD-shaped domains, and any case where broad compatibility and debuggability matter most.
**Avoid when:** Many distinct clients need sharply different data shapes from the same data (chatty round trips dominate), or a strict typed contract and binary efficiency are first-class requirements.

### GraphQL (client-specified queries against a typed schema)

**Optimizes:** The client asks for exactly the fields it needs in one request — no over- or under-fetching; one endpoint serves many client shapes; a strongly-typed, introspectable schema is the contract; front-end and back-end can iterate against the schema in parallel.
**Sacrifices:** HTTP caching no longer works out of the box (queries are POSTed and variable); a malicious or careless deep/expensive query can hammer the backend unless query cost is bounded; the N+1 query problem must be actively managed (batching/dataloader); more server-side machinery and a steeper learning curve.
**Choose when:** Multiple clients (web, mobile, partners) need different slices of the same data; the UI is data-rich and changes often; front-end and back-end teams collaborate closely on the schema.
**Avoid when:** The domain is simple CRUD (the machinery does not pay back), the API is public and caching/predictable cost matter, or the team is small and REST would just ship.

### RPC (procedure-call style — including binary/contract-first like gRPC)

**Optimizes:** Action-oriented APIs that map to operations rather than resources; with a binary contract-first protocol: a strict typed schema, code-generated clients, compact payloads, and low latency over HTTP/2 — efficient for high-volume internal calls and streaming.
**Sacrifices:** Less of HTTP's resource and caching model; binary protocols are not browser-native without a proxy layer and are harder to debug by hand; tight coupling to the generated contract; weaker ecosystem of generic tooling than REST.
**Choose when:** Internal service-to-service communication where performance, a strict contract, and code-gen matter more than universal reach; action-heavy APIs that resist a clean resource model.
**Avoid when:** The API is public or browser-facing (reach and debuggability lose to REST), or the team is small and a single REST API would cover every consumer.

### Practical guidance

These are complements, not rivals. A common pattern: REST for the public API, an internal binary RPC between services, and GraphQL where a data-rich first-party client benefits. For a solo developer or small team, **one REST API is almost always the right answer** — add a second style only when a specific consumer's need is proven, not anticipated.

---

## Checklist — API conventions

Once the style is chosen, these are decidable. Settle each one once and apply it uniformly across the API — inconsistency here is a permanent tax on every consumer.

### Rule: Version the API explicitly from day one

**Applies to:** Any API with consumers you do not deploy in lockstep (public APIs, mobile apps, partner integrations).
**Why:** A breaking change with no version is an outage for every consumer. Choose one scheme and commit. The two mainstream options trade off differently and both are defensible:
- **URL-path versioning (`/v1/...`)** is the most visible to humans and tooling, trivially testable with `curl` or a browser, and the simplest mental model — used by Twilio, GitHub's REST API, and most public APIs. It implies the resource itself is versioned, which is a slight conceptual stretch.
- **Header-based versioning** (a custom header, a date-stamped header like Stripe's, or an `Accept` media-type version like GitHub's GraphQL API) keeps the URL stable and lets the resource evolve independently. Invisible to URL-based tooling and easier for consumers to miss or forget, but cleaner conceptually and the right choice when many fine-grained version transitions are expected.
Pick based on consumer profile: URL-path for broad public APIs where discoverability and ease of debugging dominate; header/date-based when fine-grained, frequent evolution matters and consumers are sophisticated. Within a version, evolve only backward-compatibly — add optional fields, never remove or repurpose existing ones. A breaking change requires a new version and a documented migration window for the old one. (See "no contract drift" in `architecture-patterns.md`.)

### Rule: Paginate every collection endpoint — never return an unbounded list

**Applies to:** Every endpoint returning a list.
**Why:** An unbounded list is a latency cliff and a denial-of-service vector as data grows (CWE-770). Enforce a default and a maximum page size server-side; reject oversize page requests. Choose the pagination model deliberately: **cursor/keyset** pagination is stable under concurrent inserts and performs consistently at any depth — prefer it for large, append-heavy, or real-time data; **offset/limit** is simpler and allows jumping to an arbitrary page but skips or repeats rows when the underlying data shifts and degrades on deep pages — acceptable only for small, slow-changing datasets.

### Rule: Use a single, consistent, structured error format

**Applies to:** Every error response across the API.
**Why:** Inconsistent error shapes force every consumer to special-case each endpoint. Adopt one structured format (a recognized standard such as RFC 9457 Problem Details, or one documented house format) and use it everywhere. Each error carries: a stable machine-readable code (the client branches on this, never on the human message), a human-readable message, and where useful a field-level breakdown for validation failures. Never leak stack traces, SQL, or internal paths in an error body (CWE-209) — log detail server-side, return a generic message.

### Rule: Use HTTP status codes for their defined meaning

**Applies to:** REST and HTTP-based APIs.
**Why:** Status codes are a contract intermediaries, clients, and monitoring tools rely on. `2xx` success, `4xx` the caller's fault (do not retry unchanged), `5xx` the server's fault (retry may help). Never return `200` with an error payload — it defeats client error handling, caching, and alerting. Distinguish `401` (not authenticated) from `403` (authenticated but not allowed). For semantic invalidity (well-formed request body that fails business validation) both `400` and `422` are defensible: `422` is the older convention and is still common, but RFC 9110 defines `400` broadly as "cannot or will not process due to malformed request" and the IETF httpapi working group's discussion concluded `400` is correct for most cases. Pick one convention and apply it consistently across the API — inconsistency is the real cost, not the choice itself.

### Rule: Make mutating operations idempotent or idempotency-keyed

**Applies to:** `PUT` and `DELETE` (idempotent by definition) and `POST` operations that create resources or move money.
**Why:** Networks retry. Without idempotency a retried request double-charges a card or creates a duplicate record. `PUT`/`DELETE` must be safe to repeat. For non-idempotent `POST`, accept a client-supplied idempotency key and de-duplicate on it server-side so a retry returns the original result instead of acting twice.

### Rule: Authenticate and authorize every endpoint; default to deny

**Applies to:** Every route, resolver, and RPC method.
**Why:** Mandated as the architecture's deny-by-default control — see `security-baseline.md` and `_shared/rules/security.md` for the full rule and rationale.

### Rule: Rate-limit every externally reachable endpoint

**Applies to:** All public endpoints; stricter limits on auth, search, export, and resource-creating operations.
**Why:** Missing rate limits enable brute force, scraping, denial of service, and cost-amplification (CWE-770). Budget requests per principal and per source IP; signal limits to clients with standard headers (`RateLimit-*` / `Retry-After`) so well-behaved consumers can back off.

### Rule: Bind request bodies to explicit input schemas — never mass-assign

**Applies to:** Every create and update endpoint.
**Why:** Binding a raw request body onto a domain or database object lets an attacker set fields the form never exposed — `role`, `isAdmin`, `ownerId` (CWE-915). Define an explicit input DTO/schema with an allowlist of editable fields, and validate type, length, format, and range at the boundary.

### Rule: Document the API contract as a machine-readable schema

**Applies to:** Any API with more than one consumer or more than one developer.
**Why:** A schema (OpenAPI for REST, the GraphQL SDL, a `.proto` for gRPC) is the single source of truth — it generates clients, drives contract tests, and prevents producer/consumer drift. Hand-written prose docs go stale; a schema checked in CI does not.

---

## Sources

- [Roy Fielding — Architectural Styles and the Design of Network-based Software Architectures (REST, Ch. 5)](https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)
- [Microsoft — REST API design best practices](https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design)
- [RFC 9457 — Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html)
- [MDN — HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [GraphQL — Best Practices](https://graphql.org/learn/best-practices/)
- [GraphQL — Pagination](https://graphql.org/learn/pagination/)
- [gRPC — Core concepts, architecture and lifecycle](https://grpc.io/docs/what-is-grpc/core-concepts/)
- [Stripe API — Idempotent requests](https://docs.stripe.com/api/idempotent_requests)
- [OWASP API Security Top 10:2023](https://owasp.org/API-Security/editions/2023/en/0x11-t10/)
- [OWASP Cheat Sheet — REST Security](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)
- [Baeldung — REST vs GraphQL vs gRPC](https://www.baeldung.com/rest-vs-graphql-vs-grpc)
