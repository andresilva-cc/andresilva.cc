# Architecture Rules — Security Baseline

**Read on-demand when the task involves the security architecture of a system — the authn/authz model, input-validation strategy, secrets handling, transport, and security headers.**

This file is a checklist of *architectural* security decisions — the controls an architecture must mandate so that secure behavior is the default and insecure behavior takes deliberate effort. Each item is decidable at design-review time: the architecture either makes the control structural or it does not. This is the *what to mandate* layer; the *how to implement each control correctly* layer is `_shared/rules/security.md`, and secret storage and dependency hygiene are `_shared/rules/secrets-and-supply-chain.md`. Read those for detail — this file does not duplicate them.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

---

## Baseline discipline (read first)

- **Security is designed, not added.** A missing control is a *design* flaw — no amount of clean implementation fixes it. Decide the security architecture before implementation starts.
- **Make the secure path the default path.** A control that depends on every developer remembering it will eventually be forgotten. Structure the system so the secure behavior is what happens automatically and bypassing it is visible.
- **Threat-model anything touching money, credentials, PII, or a trust boundary** before it is built — enumerate abuse cases (STRIDE), then design the control in.

---

Each item below is a **structural mandate** the architecture must commit to, with a pointer to `_shared/rules/security.md` (or another shared file) for correct implementation. Read the shared file for *how*; this file is the *what to mandate* index.

## Authentication

- **Mandate an explicit authentication mechanism, preferring a managed provider** (see `_shared/rules/security.md` — authentication rules; tradeoffs in `stack-selection.md`). Architectural justification: authentication is high-risk and easy to get subtly wrong; outsourcing it to a specialist provider, or to a single mature audited library, is structurally safer than hand-assembling primitives across handlers.
- **Mandate MFA for privileged accounts and step-up for high-risk actions** (see `_shared/rules/security.md`). Architectural justification: MFA is the single highest-leverage control against credential-stuffing — making it a first-class capability at design time avoids the much harder retrofit later.
- **Specify session/token transport and lifetime in the design** (see `_shared/rules/security.md` — session and token handling). Architectural justification: where the credential lives determines its attack surface; the choice (cookie vs token) and expiry policy are architectural, not per-endpoint.

---

## Authorization

- **Mandate deny-by-default for every endpoint, resource, and operation** (see `_shared/rules/security.md` — authorization rules). Architectural justification: enforced as the framework-level default (router middleware, policy layer), not as a per-handler habit — a forgotten check is a breach.
- **Mandate a single, central authorization mechanism** (see `_shared/rules/security.md`). Architectural justification: one enforced mechanism — middleware, policy layer, decorator, or policy engine — so "did we check?" is answerable by inspection. Match the model to the domain: simple role checks for a fixed small role set; RBAC when permissions group cleanly into roles; ABAC/policy-based when access depends on attributes and relationships. Do not over-build.
- **Mandate object-level authorization for every resource referenced by a client-supplied ID** (see `_shared/rules/security.md` — IDOR). Architectural justification: in multi-tenant systems, prefer enforcing the tenant predicate structurally (database row-level security or a tenant-scoped query layer in `data-modeling.md`) so it cannot be omitted by an individual handler.

---

## Input validation and data handling

- **Mandate boundary input validation with allowlists** (see `_shared/rules/security.md` — input validation). Architectural justification: designate the trust boundary where untrusted input is validated; the boundary is an architectural artifact, not a per-handler choice.
- **Mandate explicit input DTOs — no mass assignment** (see `_shared/rules/security.md` — mass-assignment). Architectural justification: structurally enforced by the binding layer the architecture selects; not a discipline left to each handler.
- **Mandate parameterized queries and contextual output encoding as non-negotiable defaults** (see `_shared/rules/security.md` — injection and XSS). Architectural justification: prevented structurally by the data-access layer and the rendering layer the architecture chooses — the auto-escaping default must never be defeated.
- **Mandate explicit response DTOs — never serialize whole models** (see `_shared/rules/security.md` — minimal response data). Architectural justification: response shapes are part of the API contract; whole-model serialization leaks fields the client must not see (password hashes, internal flags, soft-deleted rows, other tenants' data).

---

## Secrets, transport, and configuration

- **Mandate how secrets are stored and injected — never in source or images** (see `_shared/rules/secrets-and-supply-chain.md`). Architectural justification: a managed secret store or runtime-injected env configuration; rotation must be possible without a code change.
- **Mandate TLS everywhere and HSTS** (see `_shared/rules/security.md` — transport security). Architectural justification: TLS 1.2+ (prefer 1.3) for every connection including service-to-service; no plaintext fallback path.
- **Mandate a security-header baseline for every web response** (see `_shared/rules/security.md` — security headers). Architectural justification: configured once globally — `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`, restrictive `Referrer-Policy` — not page by page.
- **Mandate restrictive CORS — allowlist specific origins** (see `_shared/rules/security.md` — CORS). Architectural justification: the allowed-origin list is a deliberate architectural artifact; never reflect arbitrary `Origin`, never pair `*` with credentials.
- **Identify regulated data classes and the obligations they carry.** Architectural justification: data residency, encryption-at-rest, retention limits, right-to-erasure, and breach-notification duties shape the datastore choice, the tenancy model, the logging design, and the soft-delete strategy — surface them at design time, not at audit time.

---

## Resilience and operability

- **Mandate fail-closed for security checks** (see `_shared/rules/security.md` — fail-closed). Architectural justification: framework-level convention that any error in an authz/token/feature-flag check denies; never an "allow on exception" path.
- **Mandate server-side enforcement of business-logic limits and rate limits** (see `_shared/rules/security.md` — server-side enforcement; `api-design.md` — rate limiting). Architectural justification: every invariant — quantities, amounts, state transitions, ownership — is enforced server-side, not assumed from UI flow. Rate limiting is a baseline design requirement on every public endpoint, stricter on auth and expensive operations.
- **Mandate security event logging with sensitive-data redaction at the logging boundary** (see `_shared/rules/security.md` — security logging). Architectural justification: structured who/what/when logging of authn outcomes, authz denials, validation failures, privilege changes, and admin actions; redaction of secrets/credentials/tokens/PII enforced at the logging boundary, not at each call site.

---

## Sources

- [OWASP Top 10:2025](https://owasp.org/Top10/2025/0x00_2025-Introduction/)
- [OWASP Application Security Verification Standard (ASVS) 5.0](https://owasp.org/www-project-application-security-verification-standard/)
- [OWASP — Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html)
- [OWASP — Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP — Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP — Secure Product Design Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Product_Design_Cheat_Sheet.html)
- [NIST SP 800-63B — Digital Identity Guidelines: Authentication](https://pages.nist.gov/800-63-3/sp800-63b.html)
- [AWS Well-Architected Framework — Security Pillar](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html)
- [Microsoft Azure Well-Architected Framework — Security](https://learn.microsoft.com/en-us/azure/well-architected/security/)
