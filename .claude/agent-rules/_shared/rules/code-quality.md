# Code Quality Rules — Correctness, Performance, and Maintainability

**Read on-demand when writing or reviewing implementation code — to avoid defects while authoring, or to judge a diff for logic correctness, performance, resource handling, complexity, and naming.**

This domain governs code *quality*: correctness bugs, performance anti-patterns, resource leaks, complexity thresholds, and maintainability. It does not cover security (see `security.md`) or test quality (see `testing.md`).

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

---

## Logic correctness

### Rule: Check loop and slice boundaries for off-by-one errors
**Applies to:** Index arithmetic, ranges, slicing, pagination offsets, `<` vs `<=`.
**Why:** Off-by-one is among the most common defect classes. Verify the first and last iteration explicitly: does the loop touch index 0? Does it run past the last element or stop one short?

### Rule: Handle null/undefined/empty before dereferencing
**Applies to:** Any value from a function return, map lookup, API response, optional field, or array access.
**Why:** Null-pointer/`undefined is not an object` errors are a leading runtime crash. Guard, use optional chaining/null-coalescing, or make the type non-nullable — do not assume a value is present.

### Rule: Distinguish absent, empty, and zero/false
**Applies to:** Conditionals on numbers, strings, and collections.
**Why:** `if (count)` treats `0` as absent; `if (!name)` treats `""` as missing. When zero, empty string, or `false` are valid values, test explicitly for `null`/`undefined` instead of relying on truthiness.

### Rule: Guard against race conditions on shared mutable state
**Applies to:** Concurrent code, async handlers mutating shared variables, check-then-act sequences, non-atomic read-modify-write.
**Why:** Time-of-check-to-time-of-use gaps and interleaved updates produce intermittent corruption that is hard to reproduce. Use atomic operations, locks, transactions, or immutable data; never assume two async operations run in a fixed order.

### Rule: Make every branch and switch exhaustive — handle the default
**Applies to:** `switch`/`match`, `if/else if` chains, enum handling.
**Why:** An unhandled enum variant or missing `else` silently falls through, producing wrong results rather than errors. Add an explicit default that throws or logs; in typed languages, use exhaustiveness checking.

### Rule: Verify boolean and operator precedence in compound conditions
**Applies to:** Conditions mixing `&&`/`||`/`!`, bitwise vs logical operators, negation.
**Why:** Mixed-operator conditions without parentheses are a frequent source of inverted logic. Parenthesize for intent; a condition that is hard to read is hard to verify.

### Rule: Store and compute time in UTC; use monotonic clocks for measuring elapsed durations
**Applies to:** Timestamps stored in databases, times compared in business logic, durations measured for performance/timeouts, scheduled jobs, recurring events.
**Why:** Date/time bugs are among the most painful defect classes — DST transitions, time-zone offsets, locale-default conversions, naive datetimes silently treated as UTC or local. Store in UTC, convert to the user's zone only at display, and use the platform's timezone-aware datetime type (never naive). For *measuring elapsed time* (timeouts, latency, deduplication windows) use a monotonic clock (`time.monotonic`, `performance.now`, `System.nanoTime`) — wall-clock time can jump backward on NTP correction or DST, breaking duration comparisons. Use `Date.now()` only for human-meaningful timestamps, never for "how long did this take."

### Rule: Never represent money as `float`/`double` — use integer minor units or a decimal type
**Applies to:** Prices, balances, charges, refunds, fees, tax — any computed monetary value.
**Why:** Binary floating-point cannot exactly represent decimal fractions: `0.1 + 0.2 !== 0.3` is the canonical example, and the rounding errors compound across operations. The result is wrong balances, mis-billed customers, and reconciliation drift that is hard to trace. Use integer minor units (cents/centavos), a fixed-point `Decimal`/`BigDecimal` type, or a money library (`dinero.js`, `py-moneyed`). When formatting for display, round with explicit `ROUND_HALF_EVEN` (banker's rounding) or `ROUND_HALF_UP` per regulatory requirement — never let the language default decide.

### Rule: Make retry-safe operations idempotent — use an idempotency key for non-idempotent side effects
**Applies to:** Payment charges, webhook handlers, message-queue consumers, "create" endpoints retried on network error, anything the caller might re-invoke.
**Why:** Network flakiness, message-queue at-least-once delivery, and client retries mean a side-effecting call will sometimes execute more than once. Without an idempotency mechanism, the user gets double-charged, the webhook fires the action twice, or the consumer creates duplicate records. Accept an idempotency key from the caller (e.g. `Idempotency-Key` header — Stripe convention), persist (key → result), and on repeat return the stored result. Stateless idempotency via natural keys (e.g. `customer_id + invoice_period`) works too. Even *internal* retry loops must be idempotent end-to-end, not just at the top.

### Rule: Watch for integer overflow in arithmetic on bounded numeric types
**Applies to:** Strongly typed languages (Rust, Go, C, C++, Java `int`/`long`), counters and accumulators in long-running processes, conversions between integer types of different widths.
**Why:** Integer overflow wraps silently in some languages (Go: wraps; C unsigned: wraps; C signed: undefined behavior) or panics in others (Rust debug; Java throws on `Math.addExact`). Either way, a count that exceeds the type's range produces wrong results — and the wrong-result form often surfaces as a security bug (CWE-190). In typed languages, pick explicit checked/wrapping/saturating arithmetic for sensitive paths. In dynamically-typed languages, beware integer-to-float coercion at large values (JavaScript `Number.MAX_SAFE_INTEGER` is 2^53 − 1; beyond that, integer precision is lost — use `BigInt` for IDs/counters above that range).

---

## Performance anti-patterns

### Rule: Eliminate N+1 queries — load related data in one query
**Applies to:** ORM access inside loops, rendering lists with associated records.
**Why:** Fetching N rows then issuing one query per row turns 1 query into N+1; at 1,000 rows that is 1,001 round trips and response time grows linearly. Use eager loading (`includes`, `select_related`/`prefetch_related`, `JOIN`, `preload`). The N+1 is the most common ORM performance defect.

### Rule: Index columns used in filter/join/sort predicates on tables that grow
**Applies to:** `WHERE`, `JOIN`, `ORDER BY` columns on tables that grow over time. Skip for tiny lookup tables (the planner will table-scan anyway) and low-cardinality boolean/enum columns (an index buys little and costs write throughput).
**Why:** Without an index the database does a full table scan; performance degrades silently as data grows and is fine in dev with small tables. Add indexes for filter/join/sort columns and composite indexes for multi-column predicates. Indexes cost on every write — don't pre-index speculatively.

### Rule: Beware catastrophic regex backtracking (ReDoS)
**Applies to:** Any regex applied to user input — validation, parsing, scanning, search.
**Why:** Patterns with nested or overlapping quantifiers (`(a+)+b`, `(a|a)+b`, `(.*)+$`) run in exponential time on adversarial input — a well-known DoS vector (Cloudflare's 2019 global outage). Avoid nested quantifiers; prefer atomic groups, possessive quantifiers, or non-backtracking engines (RE2, Rust `regex`); set a regex timeout where the platform supports it (Node `RegExp.timeout` or external execution).

### Rule: Bound every query and collection fetch
**Applies to:** List endpoints, `SELECT` without `LIMIT`, loading a full table/collection into memory.
**Why:** An unbounded query is correct with 100 rows and an outage with 1,000,000. Paginate, cap result sets, and stream large reads. Assume any table can grow.

### Rule: Watch algorithmic complexity — avoid accidental quadratic work
**Applies to:** Nested loops over the same/related collections, repeated linear `.find`/`.includes`/`in` inside a loop, string concatenation in a loop.
**Why:** O(n²) is invisible at small n and catastrophic at scale. Replace inner linear scans with a hash set/map lookup (O(1)); build strings with a buffer/join.

### Rule: Do not do per-item I/O inside a loop
**Applies to:** Network calls, DB writes, file operations inside iteration.
**Why:** Per-item I/O multiplies latency and connection overhead. Batch the operation (bulk insert, batched API call) or parallelize with a bounded concurrency limit.

### Rule: Cache expensive pure computations — but bound the cache
**Applies to:** Repeated expensive deterministic work; memoization.
**Why:** Recomputing the same result wastes cycles, but an unbounded cache is a memory leak. Use an LRU/TTL-bounded cache and invalidate on input change.

---

## Resource leaks and cleanup

### Rule: Close every resource you open
**Applies to:** DB connections, file handles, sockets, streams, cursors.
**Why:** Unclosed resources exhaust connection pools and file-descriptor limits, causing outages under load. Use language-level scoped cleanup (`with`, `try-with-resources`, `defer`, RAII, `using`) so cleanup runs even on exceptions.

### Rule: Clear every timer and cancel every subscription
**Applies to:** `setInterval`/`setTimeout`, intervals, watchers, event listeners, observables, background tasks.
**Why:** An uncleared timer or unremoved listener keeps its closure — and everything it references — alive forever, leaking memory and firing stale callbacks. Pair every `set`/`subscribe`/`addListener` with a `clear`/`unsubscribe`/`removeListener` in the matching teardown/unmount path.

### Rule: Release resources on the error path, not just the success path
**Applies to:** Any function that acquires a resource and can throw before releasing it.
**Why:** Cleanup that only runs after the happy path leaks whenever an exception occurs mid-function. Put release in `finally`/`defer`/scoped-cleanup so it runs unconditionally.

### Rule: Do not let collections, caches, or static fields grow without bound
**Applies to:** Module-level/static collections, accumulating buffers, in-memory caches, event-handler registries.
**Why:** Unbounded caches, static collections, and unclosed resources are the three classic memory-leak anti-patterns. Long-lived references prevent garbage collection. Bound size, set TTLs, and remove stale entries.

---

## Error handling at boundaries

### Rule: Handle errors at every system boundary
**Applies to:** Network calls, DB access, file I/O, parsing, external SDK calls, deserialization.
**Why:** Boundaries are where failure is expected, not exceptional. Code that assumes a fetch/parse/query succeeds will crash or corrupt state on the inevitable failure. Anticipate timeouts, malformed data, and partial responses.

### Rule: Never swallow an exception silently
**Applies to:** `catch`/`except` blocks.
**Why:** A catch block that does nothing leaves the caller assuming success while state is invalid, and produces no log to diagnose. Error swallowing is the worst exception anti-pattern. Always log, rethrow, or convert to a meaningful result — and never `catch (e) {}`.

### Rule: Catch specific exceptions, not the broadest type
**Applies to:** `catch (Exception)`, `except:`, catch-all handlers.
**Why:** Over-broad catches hide bugs you did not anticipate (a typo throwing `TypeError`, an `OutOfMemory`) by treating them as the handled case. Catch the narrowest type that the block actually knows how to handle; let the rest propagate.

### Rule: Fail fast and loud — surface meaningful errors, not generic ones
**Applies to:** Error propagation across layers.
**Why:** A quiet failure or generic 500 destroys traceability. Apply explicit timeouts to network calls, validate inputs early, and propagate errors with enough context (what failed, with what input) to diagnose without a debugger.

### Rule: Do not use exceptions or errors for normal control flow
**Applies to:** Expected outcomes — "not found", validation failure, empty result.
**Why:** Exceptions for routine cases obscure real errors, are slow on some runtimes, and make code hard to follow. Return a result/option type or an explicit status for expected outcomes; reserve exceptions for the genuinely exceptional.

---

## Complexity and structure

### Rule: Keep functions short and single-purpose
**Applies to:** All functions and methods.
**Why:** Long functions ("Long Method" smell) hide duplicate code, are hard to test, and resist understanding. The real test is the "and" heuristic: a function that needs an "and" to describe it is doing two things — extract the second. Specific line-count thresholds vary (Clean Code argues "20 lines or so"; Google's C++ style suggests reconsidering at ~40 lines; Linux kernel style imposes no specific cap) — use them as cues to look harder at structure, not as a universal rule.

### Rule: Limit nesting depth
**Numeric baseline:** Keep nesting ≤3-4 levels.
**Applies to:** Conditionals and loops.
**Why:** Deep nesting (the "arrow anti-pattern") makes control flow unreadable and signals high cyclomatic complexity. Use guard clauses / early returns, invert conditions, and extract inner blocks.

### Rule: Keep cyclomatic complexity below the threshold
**Numeric baseline:** McCabe's original paper proposes 10 as the threshold above which testability degrades; 15 is a common compromise; ESLint's `complexity` default of 20 is a generous hard ceiling, not a target.
**Applies to:** Functions with many branches.
**Why:** Each independent path is a path to test and a place for bugs. High complexity correlates with defect density. Split decision logic into smaller functions or a lookup/strategy table.

### Rule: Keep parameter lists short
**Numeric baseline:** 0–2 preferred (Clean Code, chapter 3); 3 needs a clear reason; 4+ is a smell.
**Applies to:** Function and method signatures.
**Why:** "Long Parameter List" smell — long lists are hard to call correctly and easy to transpose. Group related parameters into an object/struct, or split the function. Boolean flag parameters are an extra smell: they mean the function does two things — split into two named functions or accept an enum/strategy.

### Rule: Avoid duplicated logic — extract the third occurrence
**Applies to:** Repeated code blocks, parallel conditional structures.
**Why:** Duplication multiplies the cost of every change and lets copies drift out of sync, causing bugs fixed in one place but not another. Extract shared logic to a single named unit (rule of three: refactor on the third copy).

---

## Dead code and hygiene

### Rule: Delete dead code rather than commenting it out
**Applies to:** Unreachable code, unused functions/variables/exports, commented-out blocks.
**Why:** Dead code adds cognitive load, misleads readers about what runs, and rots silently. Version control preserves history — there is no reason to keep commented-out code.

### Rule: Remove unused imports, exports, and dependencies
**Applies to:** Import statements, public exports, package manifests.
**Why:** Unused imports bloat bundles and obscure real dependencies; unused exports imply a public API that is not actually used. Lint for them and keep the dependency graph honest.

### Rule: Keep imports ordered and grouped consistently
**Applies to:** Import/`use`/`require` blocks.
**Why:** A consistent order (stdlib, third-party, local) makes dependencies scannable and reduces merge conflicts. Match the project's existing convention or its lint config.

---

## Naming and comments

### Rule: Use intention-revealing names; length should match scope
**Applies to:** Variables, functions, classes, modules.
**Why:** "If a name requires a comment, the name does not reveal its intent" (Clean Code). A descriptive name removes the need for a comment. Single-letter names are acceptable only for tiny scopes (loop index); wider scope warrants a fuller name.

### Rule: Comment the WHY, not the WHAT
**Applies to:** All code comments.
**Why:** A comment restating what the code does duplicates the code and rots when the code changes. Comments earn their place by explaining intent, a non-obvious tradeoff, a workaround for an external bug, or a warning of consequences — context the code cannot express.

### Rule: Name functions for what they do; name booleans/predicates as questions
**Applies to:** Function and variable naming.
**Why:** Functions are verbs (`calculateTotal`), booleans read as predicates (`isExpired`, `hasAccess`). A function named like a noun, or a boolean named ambiguously, misleads every caller.

### Rule: Avoid misleading names and inconsistent vocabulary
**Applies to:** All identifiers.
**Why:** A name that says less or more than the code does (`getUser` that also writes to the DB; `list` that is a Set) actively deceives. Use one word per concept consistently across the codebase.

---

## Conformance

### Rule: Match the style and patterns of adjacent code
**Applies to:** Every change to an existing file or module.
**Why:** Consistency within a file outweighs personal preference. Mixed styles within one module increase cognitive load and signal carelessness. Follow the surrounding conventions for naming, error handling, structure, and formatting unless deliberately refactoring the whole unit.

### Rule: Do not introduce a new pattern when an established one exists
**Applies to:** Choosing how to do something the codebase already does elsewhere.
**Why:** A second way to do the same thing fragments the codebase and forces readers to learn both. Find the existing helper/utility/pattern and reuse it; introduce a new approach only with a deliberate, communicated migration.

---

## Sources

- Robert C. Martin — *Clean Code: A Handbook of Agile Software Craftsmanship*
- Martin Fowler & Kent Beck — *Refactoring: Improving the Design of Existing Code*, 2nd ed.
- [refactoring.guru — Code Smells catalog](https://refactoring.guru/refactoring/smells)
- [refactoring.guru — Long Method](https://refactoring.guru/smells/long-method)
- [refactoring.guru — Large Class](https://refactoring.guru/smells/large-class)
- [refactoring.guru — Long Parameter List](https://refactoring.guru/smells/long-parameter-list)
- [refactoring.guru — Primitive Obsession](https://refactoring.guru/smells/primitive-obsession)
- [ESLint — complexity rule](https://eslint.org/docs/latest/rules/complexity)
- [ESLint — max-depth rule](https://eslint.org/docs/latest/rules/max-depth)
- [ESLint — max-params rule](https://eslint.org/docs/latest/rules/max-params)
- [Rust Clippy — lint catalog](https://rust-lang.github.io/rust-clippy/master/)
- [PlanetScale — What is the N+1 Query Problem](https://planetscale.com/blog/what-is-n-1-query-problem-and-how-to-solve-it)
- [Scout APM — Understanding N+1 Database Queries](https://www.scoutapm.com/blog/understanding-n1-database-queries)
- [Studying the Prevalence of Exception Handling Anti-Patterns (arXiv 1704.00778)](https://arxiv.org/pdf/1704.00778)
- [Wikipedia — Error hiding](https://en.wikipedia.org/wiki/Error_hiding)
- [HeapHero — Unbounded Caches, Static Collections, and Unclosed Resources](https://blog.heaphero.io/unbounded-caches-static-collections-and-unclosed-resources-the-3-killer-anti-patterns-causing-memory-leaks/)
