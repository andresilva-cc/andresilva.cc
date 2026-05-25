# QA Rules — Oracles: Recognizing a Bug

**Read on-demand when the task involves deciding whether observed behavior is *correct* — judging a test result, evaluating an exploratory finding, or arguing that something is a defect when no acceptance criterion explicitly covers it.**

A test only finds a bug if you can *recognize* the bug. An **oracle** is the principle or mechanism by which you decide a result is wrong. This file catalogs oracles; `test-design-heuristics.md` covers how to generate the tests an oracle then judges.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

---

## Why oracles matter

Running a test produces a result. Calling that result a *pass* or *fail* is a separate, judgment-laden step — and it is where most missed bugs are lost. A test with a weak oracle ("it didn't crash") passes broken software. The most dangerous assumption in QA is that the *only* oracle is the written acceptance criterion: criteria are incomplete, and a feature can satisfy every AC while still being clearly broken.

**Every oracle is a heuristic — fallible and context-dependent.** An oracle does not prove correctness; it flags a *plausible problem* worth investigating. When an oracle fires, you have found an inconsistency, not necessarily a bug — but an inconsistency you must explain or escalate, never silently dismiss. Use multiple oracles: a result that passes the AC but violates three consistency oracles is very likely a defect, and a strong report says so.

---

## The core principle: a bug is an inconsistency

James Bach and Michael Bolton define a bug as *a problem that threatens the value of the product* — and you most often perceive one as an **inconsistency**: the product disagrees with something it ought to agree with. The **FEW HICCUPPS** mnemonic enumerates those somethings. Treat each as a question to ask of any observed behavior.

## Consistency oracles — FEW HICCUPPS

### Technique: Familiarity — consistent with the pattern of known bugs
**What it is:** The product should *not* be consistent with the family of failures we already know about.
**When to apply:** Always — pair with error guessing.
**How:** Ask: does this behavior resemble a defect class I have seen before — an off-by-one, an unescaped input, a race, a lost-on-refresh state? Resemblance to a known bug pattern is itself a signal. Keep a defect-pattern list in agent memory.

### Technique: Explainability — consistent with a sensible explanation
**What it is:** The product's behavior should be explainable; behavior you cannot account for is suspect.
**When to apply:** When a result is technically "allowed" but you cannot say *why* it happens.
**How:** Ask: can I explain this behavior to a developer in one sentence without saying "I don't know why"? If the only explanation is a guess, treat it as a finding and investigate the code path.

### Technique: World — consistent with how the world works
**What it is:** The product should match real-world facts and reasonable expectations about its domain.
**When to apply:** Domain logic — dates, money, addresses, names, units, geography, physics.
**How:** Ask: is a negative quantity, a 13th month, a February 30, a future birthdate, or a $0.001 rounding sensible in the real world? Reality is an oracle even when the spec is silent.

### Technique: History — consistent with past versions
**What it is:** Absent a deliberate change, the product should behave as it did before. This is the **regression oracle**.
**When to apply:** Every QA pass over a phase that touches existing code.
**How:** Compare current behavior against the previous version's behavior and output. If something changed and no task in the phase intended that change, it is a regression — flag it even if no AC mentions it. The full pre-existing test suite is a partial automation of this oracle.

### Technique: Image — consistent with the image the project wants to project
**What it is:** Behavior should match the quality, tone, and brand the product means to convey.
**When to apply:** Error messages, empty states, copy, polish, visual finish.
**How:** Ask: does a raw stack trace, a "lorem ipsum" leftover, or `console.log` debris contradict the product's intended image? Sloppiness is a defect against the brand. (Tone and copy quality — "brusque" vs "polished" wording — is taste rather than a hard oracle; flag only when the spec or copy guide explicitly defines the standard.)

### Technique: Comparable products — consistent with comparable products
**What it is:** Behavior should be consistent with similar features in comparable or competing products (and with sibling features inside the same product).
**When to apply:** Common interaction patterns — search, pagination, forms, sorting, keyboard shortcuts.
**How:** Ask: does every other product do this differently in a way users will expect? Inconsistency with a near-universal convention is a usability defect. Internal consistency counts too — two date pickers in the same app should behave alike.

### Technique: Claims — consistent with what we said it does
**What it is:** The product must do what the spec, docs, marketing copy, tooltips, and UI labels *claim* it does.
**When to apply:** Against the product spec, the architecture doc, the implementation plan's acceptance criteria, and any user-facing text.
**How:** Treat every claim — including a button label, a placeholder, a help tooltip — as an assertion to verify. A "Save" button that does not persist contradicts its own label.

### Technique: User expectations — consistent with what a reasonable user wants
**What it is:** The product should be consistent with what a reasonable user will expect and desire — even when no claim or spec covers it.
**When to apply:** Always, especially for behavior the spec leaves undefined.
**How:** Ask: would a reasonable user be surprised, confused, or frustrated here? Data loss on back-button, no confirmation before a destructive action, a silent failure — all violate user expectations regardless of the spec.

### Technique: Product — internally consistent with itself
**What it is:** Each part of the product should be consistent with comparable parts of the same product.
**When to apply:** Multi-screen or multi-component features.
**How:** Ask: does this screen format dates, sort lists, label actions, or handle errors the same way the rest of the app does? Internal contradiction is a defect.

### Technique: Purpose — consistent with the product's intended use
**What it is:** The product should be consistent with the purposes — explicit and implicit — for which it exists.
**When to apply:** When a feature technically meets its AC but does not actually serve the job the user came to do.
**How:** Ask: does this fulfill the *purpose* of the feature, not just the letter of the criterion? A search that returns results but is too slow to be usable meets "returns results" and fails its purpose.

### Technique: Standards and statutes — consistent with relevant standards and laws
**What it is:** The product should comply with applicable external standards, regulations, and laws.
**When to apply:** Accessibility, security, privacy, data-handling, financial, and industry-specific surfaces.
**How:** Ask: does this meet WCAG 2.2 AA, relevant security baselines, privacy law (consent, data retention), and any domain regulation? See `_shared/rules/accessibility.md` and `_shared/rules/security.md` for the concrete criteria. Non-compliance is a defect even with a green AC.

---

## Beyond consistency: independent and statistical oracles

### Technique: Computable / independent oracle
**What it is:** A second, independent way to compute the expected result — a known-correct value, a hand calculation, a reference implementation, an inverse operation.
**When to apply:** Deterministic logic — calculations, transforms, encoders/decoders, parsers.
**How:** Compute the expected answer independently of the code under test, then assert equality. For invertible operations, apply the inverse and check you get the original input (encode→decode, serialize→deserialize, create→read). Never derive the "expected" value by running the code you are testing — that is a tautology, not a test.

### Technique: Statistical / heuristic oracle
**What it is:** When the exact answer is unknown, assert *properties* the answer must hold — ranges, invariants, monotonicity, counts, conservation laws.
**When to apply:** Non-deterministic output, large outputs, ML results, generated content, fuzzing.
**How:** Assert what must always be true: a sorted list has the same length and the same multiset of elements as its input; a total equals the sum of its parts; a probability is in [0, 1]; output count matches input count. Property-based testing frameworks (fast-check, Hypothesis) automate this.

---

## Adversarial input techniques

When no acceptance criterion names a specific input surface, QA still actively probes for breakage. These are the concrete payload classes to try against any input that reaches code, storage, or another system — they are the protocol behind the FEW HICCUPPS questions when judging robustness, security, and consistency oracles.

### Technique: Injection meta-characters
**What it is:** Inputs that change meaning when interpreted by a downstream parser.
**How:** SQL meta-characters (`'`, `--`, `;`, `/*`, `*/`); shell metacharacters (`` ` ``, `$()`, `|`, `&&`); template/expression syntax (`{{7*7}}`, `${...}`); path traversal (`../`, `..\\`, encoded variants `%2e%2e%2f`); LDAP/XPath wildcards (`*`, `)(|`). The oracle: input that should be data but executes is a defect — even on internal surfaces.

### Technique: Cross-site scripting payloads
**What it is:** Inputs that, when rendered, execute as script.
**How:** `<script>alert(1)</script>`, `"><img src=x onerror=alert(1)>`, `javascript:alert(1)` in URL fields, `<svg onload=alert(1)>`, event-handler attributes, encoded variants. Try in every field that later renders to HTML or is reflected in error messages.

### Technique: Size and volume extremes
**What it is:** Inputs at and beyond declared or implied limits.
**How:** 10 MB string, 10,000-item array, deeply nested JSON (100+ levels), empty string vs empty list vs null, a single space, max field length and max+1, large file uploads, a request with thousands of repeated parameters.

### Technique: Numeric edge values
**What it is:** Boundary numbers a happy-path test will not exercise.
**How:** Negative numbers where positive is expected; zero where a divisor is expected; `MAX_INT`, `MIN_INT`, `MAX_INT+1` (overflow); `NaN`, `+Infinity`, `-Infinity`; very small positive (`1e-308`); high-precision decimals (`0.1 + 0.2`); leading zeros, leading `+`, exponential notation.

### Technique: Concurrency and ordering
**What it is:** Same-resource operations issued in parallel or out of order.
**How:** Double-submit (click "Pay" twice before the first response); two tabs editing the same record; create-then-immediately-delete; out-of-order webhook delivery; the same token used from two devices simultaneously; refresh during a submit. The oracle: a race that produces duplicate records, lost updates, or split state is a defect.

### Technique: Auth-context confusion
**What it is:** Credentials of one principal used against resources of another.
**How:** Token of user A used to read/write user B's resource (IDOR); expired token replayed; token issued for environment X used against environment Y; admin token on a user endpoint and vice versa; role downgraded mid-session; cookie scope crossed between subdomains.

### Technique: Encoding and normalization tricks
**What it is:** Equivalent inputs that bypass naive validators.
**How:** URL-encoded (`%2e`, `%00`), double-encoded (`%252e`), Unicode-normalized variants (full-width digits, mathematical alphanumerics), homoglyphs (Cyrillic `а` vs Latin `a`), zero-width characters (U+200B, U+FEFF byte-order mark), CRLF injection (`%0d%0a`), null bytes (`%00`) to truncate strings in C-backed code, mixed-case keywords (`SeLeCt`).

When the spec is silent on an input surface, run a representative sample from each technique above and report violations against the relevant oracle (Familiarity, Standards, World, User expectations).

---

## Using oracles in a QA pass

1. For each behavior you observe, run it past the FEW HICCUPPS questions — not just the acceptance criterion.
2. When an oracle fires, narrow to a minimal reproduction and confirm it is not your own test error.
3. Report the inconsistency naming *which* oracle it violates ("contradicts the product spec — Claims" / "regression from Phase 2 — History"). This makes the finding concrete and hard to wave away.
4. A finding that violates several oracles, or violates one strongly, is a defect even with no failing AC — say so in the report and let the go/no-go rubric classify its severity.

---

## Sources

- [Michael Bolton — FEW HICCUPPS (DevelopSense)](https://developsense.com/blog/2012/07/few-hiccupps)
- [Association for Software Testing — Heuristics & Oracles](https://associationforsoftwaretesting.org/2016/04/12/heuristics-oracles/)
- [James Bach — Heuristic Test Strategy Model (Satisfice)](https://www.satisfice.com/download/heuristic-test-strategy-model)
- [Michael Bolton — Testing Without a Map / Oracles from the Inside Out series](https://developsense.com/articles)
- Cem Kaner, James Bach, Bret Pettichord — *Lessons Learned in Software Testing* (Wiley) — origin of the consistency-heuristics list
- [Ministry of Testing — Cultivate Your Credibility With Oracles and Heuristics](https://www.ministryoftesting.com/articles/cultivate-your-credibility-with-oracles-and-heuristics)
- [Doug Hoffman — A Taxonomy of Test Oracles](https://www.softwarequalitymethods.com/papers/oracles.pdf)
