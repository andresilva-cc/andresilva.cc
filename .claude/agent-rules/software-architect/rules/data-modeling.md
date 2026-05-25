# Architecture Rules — Data Modeling

**Read on-demand when the task involves designing a data model — choosing relational vs document, a multi-tenancy strategy, a soft-delete approach, indexing, or how far to normalize.**

The data model is the hardest thing to change after launch — code is refactored constantly, schemas migrate slowly and dangerously. Most modeling decisions are tradeoffs, not rules: this file is a tradeoff map. Each entry names what an option optimizes, what it sacrifices, and the conditions that favor it. The one near-universal rule: model for the access patterns the application actually has, not for an abstract notion of "correct" structure.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

---

## Modeling discipline (read first)

- **Model the access patterns, not the entities in isolation.** How data is read and written — by key, by relationship, in aggregate, by time range — determines the right shape. List the queries first, then design.
- **The schema outlives the code.** A bad table is migrated under load with users depending on it. Spend design effort here proportional to that cost.
- **Relational is the default.** Most domains are relational; reach for a document or specialized model only when the access pattern genuinely demands it.
- **Make integrity the database's job where you can.** Foreign keys, `NOT NULL`, `UNIQUE`, and `CHECK` constraints catch bugs the application would otherwise let through. Application-only integrity drifts.

---

## Relational vs document model

### Relational model (normalized tables, foreign keys, joins)

**Optimizes:** Integrity enforced by the engine (foreign keys, constraints); flexible querying — joins and aggregates answer questions you did not anticipate at design time; no update anomalies, because each fact is stored once; mature tooling and the widest expertise pool.
**Sacrifices:** An aggregate spanning many tables needs joins to assemble; horizontal write scaling requires sharding; rigid schema means migrations for structural change.
**Choose when:** Entities have many cross-cutting relationships, the same data is queried many different ways, reporting and analytics matter, or requirements are still moving (a flexible query model absorbs change cheaply). This is the default.
**Avoid when:** The data is genuinely a self-contained document accessed only as a whole, *and* write scale exceeds what a relational primary can serve.

### Document model (self-contained nested documents)

**Optimizes:** Locality — an entire aggregate is read or written in one operation, no joins; schema flexibility per record; a natural fit when the application object maps one-to-one to a stored document; horizontal scaling as a built-in property.
**Sacrifices:** No engine-enforced cross-document integrity; joins are weak or absent, so related data is either duplicated (denormalized) or stitched in application code; many-to-many relationships are awkward; ad-hoc analytics are hard.
**Choose when:** The data is a tree-shaped aggregate read and written as a unit (a document, a config blob, an event payload), relationships within the aggregate dominate relationships across them, and the schema varies per record.
**Avoid when:** The domain is a graph of related entities — modeling that as documents forces join logic and integrity rules into application code, where they rot.

### Polyglot persistence (more than one datastore class)

**Optimizes:** Each datastore serves the access pattern it is best at — relational for the transactional core, search index for full-text, cache for hot reads, object store for blobs.
**Sacrifices:** Every added store is a separate thing to operate, secure, back up, and keep consistent; data synchronized across stores can drift.
**Choose when:** A specific, measured access pattern is genuinely poorly served by the primary store (full-text search, blob storage, geospatial at scale).
**Avoid when:** It is speculative. Start with one store; add a second only when a real, measured need appears. For a solo developer, each extra store is a recurring tax.

---

## Multi-tenancy strategy

### Shared schema, tenant-discriminator column (`tenant_id` on every tenant-scoped row)

**Optimizes:** Lowest operational cost — one database, one schema, one migration to run; cross-tenant analytics are trivial; the most efficient use of connections and resources; onboarding a tenant is an `INSERT`.
**Sacrifices:** Isolation is purely logical and lives in application code — a single missing `WHERE tenant_id = ?` is a cross-tenant data leak; a heavy tenant can degrade others ("noisy neighbor"); per-tenant backup/restore and per-tenant data export are awkward.
**Choose when:** The default for SaaS, especially with many small tenants and a self-serve plan. Pair it with a defense that does not depend on remembering the filter — database row-level security, or a query layer that injects the tenant predicate centrally.
**Avoid when:** Customers contractually require physical data isolation, or per-tenant compliance/residency rules apply.

### Schema-per-tenant (shared database, one schema each)

**Optimizes:** A stronger logical boundary than a discriminator column; per-tenant backup/restore is cleaner; still one database to host.
**Sacrifices:** Every schema change must be applied to every schema — migrations get slow and risky as tenant count grows; operational overhead climbs and becomes prohibitive somewhere in the low thousands of schemas; cross-tenant queries are harder.
**Choose when:** A moderate number of larger tenants who want a clear boundary, where the migration fan-out is still manageable.
**Avoid when:** The product expects thousands-plus of small tenants — schema sprawl makes migrations untenable; use a shared schema instead.

### Database-per-tenant

**Optimizes:** The strongest isolation — separate credentials, separate backups, independent scaling and restore, straightforward data residency and per-tenant export; no noisy-neighbor effect.
**Sacrifices:** The highest operational cost — every migration runs N times, connection and resource overhead multiply, provisioning a tenant is heavyweight; cross-tenant analytics require aggregation across databases.
**Choose when:** Few, large, high-value tenants; regulated industries; or enterprise contracts that mandate physical isolation.
**Avoid when:** Many small tenants on a self-serve plan — the per-tenant overhead does not pay back.

### Hybrid (tier-based)

**Optimizes:** Matches isolation to willingness to pay — free and standard tiers share a schema; enterprise tenants get a dedicated database as a high-margin upsell.
**Sacrifices:** Two (or more) provisioning, migration, and routing paths to build and maintain; more application complexity.
**Choose when:** The product has a clear segmentation between many small self-serve tenants and a few large enterprise tenants with isolation demands.
**Avoid when:** Early stage — pick one model and ship. Add the second tier when an enterprise deal actually requires it. Decide the tenancy model before launch regardless; retrofitting `tenant_id` onto a live schema is painful.

---

## Soft delete vs hard delete

### Soft delete (`deleted_at` / `is_deleted` flag, row retained)

**Optimizes:** Reversibility — accidental deletes are recoverable; an audit trail and historical references survive; foreign keys to the deleted row do not break.
**Sacrifices:** Every query must remember to exclude soft-deleted rows — a forgotten filter shows deleted data, and over-fetching can leak it; unique constraints conflict with retained rows (a re-created record collides with the soft-deleted one); the table grows unbounded; it complicates a real "right to erasure" obligation.
**Choose when:** User-facing data where accidental deletion is costly and recovery is expected (documents, projects, accounts), or where references to the record must survive. When the table has unique constraints, use **partial unique indexes** (`UNIQUE ... WHERE deleted_at IS NULL`) so the uniqueness constraint applies only to live rows — a re-created record won't collide with the soft-deleted one. Enforce the deleted-row exclusion centrally (default scope, view, or row-level security) so it cannot be forgotten.
**Avoid when:** The data is genuinely transient, or regulation requires true erasure (GDPR / LGPD right to erasure).

### Hard delete (row removed)

**Optimizes:** Simplicity — queries need no filter, the table does not accumulate dead rows, unique constraints behave normally, and erasure obligations are satisfied directly.
**Sacrifices:** Irreversible — an accidental delete is gone; references break unless cascaded; no audit trail of what existed.
**Choose when:** Transient data, data with a true erasure requirement, or any case where retaining the row has no value.
**Avoid when:** Accidental loss would be costly and there is no separate backup or audit path.

### Archive table / event log (move deleted rows out, or record deletion as an event)

**Optimizes:** A clean live table *and* a recoverable history — the working set stays small while the audit trail is preserved elsewhere.
**Sacrifices:** More moving parts — an archive table or event store to maintain, and a restore path to build and test.
**Choose when:** High delete volume where soft-delete bloat is a real problem but history still matters (compliance audit, undo over a long window).
**Avoid when:** Volume is low — a soft-delete flag is simpler and sufficient.

---

## Normalization vs denormalization

### Normalized (each fact stored once, 3NF as the baseline)

**Optimizes:** Integrity — no update anomalies, because a fact has one home; the smallest storage footprint; the most flexible query model.
**Sacrifices:** Assembling a read-heavy view needs joins, which cost at high volume.
**Choose when:** The default, especially for the transactional write model. Start normalized; denormalize only against measured read pressure.
**Avoid when:** A specific, measured read path is too slow because of join cost — and only then, surgically.

### Denormalized (data duplicated to serve a read shape)

**Optimizes:** Read latency — a query-shaped, pre-joined record is read in one hit; fewer joins under load; the natural model for document stores and read projections.
**Sacrifices:** Duplicated data must be kept in sync on every write — miss one and the copies disagree; writes get more complex; storage grows.
**Choose when:** A measured, read-heavy hot path where join cost is the proven bottleneck; or a deliberate read model kept separate from the write model (see CQRS in `architecture-patterns.md`).
**Avoid when:** It is premature. Denormalizing before a measured need trades a guaranteed consistency problem for a latency win you have not confirmed you need.

---

## Indexing

### Index a column or column set

**Optimizes:** Read latency on the columns used to filter, join, sort, or enforce uniqueness — turns a full scan into a targeted lookup.
**Sacrifices:** Every index slows down writes (it must be updated on insert/update/delete) and consumes storage; unused indexes are pure cost.
**Choose when:** A column appears in a `WHERE`, `JOIN`, `ORDER BY`, or uniqueness constraint on a query path that matters. Index foreign keys — most engines do not do this automatically and unindexed FKs make joins and cascades slow. Use a composite index when queries filter on several columns together (column order matters: most-selective and equality-filtered columns first). Use a partial index to scope a constraint or index to a subset of rows (e.g. uniqueness over live, non-soft-deleted rows only).
**Avoid when:** The table is tiny (a scan is already fast), the column is low-cardinality and rarely filtered, the index duplicates the prefix of an existing composite index, or it is added speculatively. Index against observed query plans, not guesses — and remove indexes that no query uses.

---

## Identifiers and keys

### Sequential integer keys

**Optimizes:** Compact storage, fast index locality on insert, human-readable, simple.
**Sacrifices:** Guessable and enumerable — exposing them in URLs or APIs invites IDOR probing and leaks record counts and growth rate to competitors.
**Choose when:** Internal primary keys not exposed externally.
**Avoid when:** The identifier appears in a URL or public API — pair it with object-level authorization regardless (see `security-baseline.md`), and prefer a non-sequential public identifier.

### Random / UUID-style keys

**Optimizes:** Non-enumerable, safe to expose, generatable client-side and offline, no central coordination, no cross-shard collision.
**Sacrifices:** Larger than an integer; fully-random versions hurt index locality and fragment B-tree pages on insert.
**Choose when:** Identifiers are exposed externally or generated in a distributed/offline setting. Prefer a time-ordered variant (sortable UUID) over a fully-random one to preserve insert locality.
**Avoid when:** The key is purely internal and never exposed — a sequential integer is smaller and faster. A non-guessable identifier is never a substitute for an authorization check.

---

## Sources

- [Martin Kleppmann — Designing Data-Intensive Applications (Ch. 2–3: data models, storage and retrieval)](https://dataintensive.net/)
- [Eric Evans — Domain-Driven Design: aggregates and bounded contexts](https://www.domainlanguage.com/ddd/)
- [Martin Fowler — Patterns of Enterprise Application Architecture (data mapping patterns)](https://martinfowler.com/eaaCatalog/)
- [PostgreSQL Documentation — Indexes](https://www.postgresql.org/docs/current/indexes.html)
- [PostgreSQL Documentation — Row Security Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Microsoft — Multitenant SaaS database tenancy patterns](https://learn.microsoft.com/en-us/azure/azure-sql/database/saas-tenancy-app-design-patterns)
- [AWS — SaaS tenant isolation strategies](https://docs.aws.amazon.com/whitepapers/latest/saas-architecture-fundamentals/tenant-isolation.html)
- [Use The Index, Luke — SQL indexing and tuning](https://use-the-index-luke.com/)
- [OWASP Cheat Sheet — Insecure Direct Object Reference Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html)
