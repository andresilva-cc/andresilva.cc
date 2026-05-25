# Security Rules — Application Security

**Read on-demand when the task involves handling untrusted input, authentication, authorization, cryptography, data persistence, outbound requests, error handling, logging, or any code that crosses a trust boundary.**

This domain governs how an application defends against attackers. Secret management and dependency/supply-chain hygiene live in `secrets-and-supply-chain.md`.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

Rules are mapped to OWASP Top 10:2025 categories (`A01`–`A10`), OWASP ASVS 5.0, and CWE IDs where applicable. Treat OWASP categories as the canonical taxonomy; CWE IDs identify the concrete weakness. **A03 (Software Supply Chain Failures)** is covered in `secrets-and-supply-chain.md`. **A10 (Mishandling of Exceptional Conditions)** rules appear below under their own section and overlap with code-quality error-handling rules (`code-quality.md`).

---

## Injection (A05:2025 — Injection)

### Rule: Use parameterized queries / prepared statements for every SQL query
**Applies to:** All database access. No exception for "internal" or "admin-only" queries. ORMs that build queries from bound parameters satisfy this; raw string interpolation into SQL never does.
**Why:** Concatenating user input into SQL strings (CWE-89) lets an attacker alter query structure — read arbitrary tables, bypass auth, drop data. Parameterization sends data and code on separate channels so input can never become executable SQL. This is the only complete defense; input validation is a secondary layer, not a substitute.

### Rule: Never interpolate user input into shell commands — pass arguments as an array
**Applies to:** Any subprocess invocation. Prefer a library API over shelling out at all (e.g. a file-copy function, not `cp`).
**Why:** Command injection (CWE-78) is critical-severity: a single unescaped `;`, `|`, `$()`, or backtick yields remote code execution. Passing args as a list to `execve`-style APIs (no shell) removes the shell's metacharacter parsing entirely. Never use `shell=True`, `system()`, `eval`, or string-built command lines with untrusted data.

### Rule: Encode output contextually to prevent XSS — HTML, attribute, JS, URL, and CSS contexts each need their own encoding
**Applies to:** Every place untrusted data reaches an HTML response.
**Why:** Cross-site scripting (CWE-79) was #1 on the 2024 CWE Top 25 (the ranking shuffles annually — verify against the current list). A value safe in HTML body context is dangerous in a `<script>` or attribute context. Output encoding is the primary defense — rely on the framework's auto-escaping (React JSX, Angular, templating engines) and never defeat it (`dangerouslySetInnerHTML`, `v-html`, `|safe`, `innerHTML`) without sanitizing through a vetted library (DOMPurify). Content Security Policy is a secondary, defense-in-depth layer.

### Rule: Treat NoSQL query objects as injectable — never pass raw request bodies as query filters
**Applies to:** MongoDB, DynamoDB, and other document-store queries.
**Why:** NoSQL injection (CWE-943) happens when an attacker submits an object (e.g. `{"$gt": ""}`) where a string was expected, turning a lookup into a match-all. Validate that query parameters are scalars of the expected type before they reach the driver; cast/coerce explicitly.

### Rule: Never render user input as a template — keep the template and the data strictly separate
**Applies to:** Any server-side template engine (Jinja, Twig, Freemarker, ERB, Handlebars, Velocity).
**Why:** Server-side template injection (CWE-1336) escalates to remote code execution because template languages expose object introspection and method calls. User input is always *data passed to* a template, never *part of* the template string.

### Rule: Escape special characters in LDAP filters and DNs
**Applies to:** LDAP/Active Directory authentication and directory lookups.
**Why:** LDAP injection (CWE-90) lets an attacker alter filter logic — e.g. `*)(uid=*` to match all users — bypassing authentication. Use the platform's LDAP-encoding function for both the search filter and distinguished-name components.

### Rule: Disable external entity resolution in XML parsers
**Applies to:** Any XML parsing of untrusted input (SOAP, SVG uploads, OOXML/ODF, RSS, SAML assertions).
**Why:** XML External Entity (XXE — CWE-611) lets an attacker read arbitrary files (`file:///etc/passwd`), perform SSRF, or trigger billion-laughs DoS through entity expansion. Disable DOCTYPE declarations and external entities explicitly — most modern parsers require an opt-out (`disallow-doctype-decl`, `feature_external_general_entities=false`, libxml2 `XML_PARSE_NONET`). Defaults vary; never rely on them.

### Rule: Validate input at the trust boundary — allowlist by type, length, format, and range
**Applies to:** Every external input: request bodies, query strings, headers, file uploads, webhook payloads, message-queue items, third-party API responses.
**Why:** Defense in depth. Validation is a *secondary* control behind parameterization/encoding, but it shrinks the attack surface and catches malformed input early. Allowlist (define what is valid and reject everything else); never blocklist (enumerating bad input always misses cases). Reject — do not silently sanitize — when feasible.

---

## Broken access control (A01:2025 — Broken Access Control)

### Rule: Deny by default — every endpoint and resource requires an explicit grant
**Applies to:** All routes, RPC methods, GraphQL resolvers, file/object access. Public endpoints are the explicit, justified exception.
**Why:** A01 is the #1 OWASP risk. A new endpoint added without an authorization check is exposed the moment it ships. The default answer to "can this principal do this?" must be *no*; access is granted only by an affirmative, reviewed decision (CWE-862 Missing Authorization).

### Rule: Enforce object-level authorization on every request that references a resource by ID
**Applies to:** Any handler that takes a user-supplied identifier (integer, UUID, slug, filename) and loads a record.
**Why:** Insecure Direct Object Reference / IDOR (CWE-639) is broken access control's most common form: the handler authenticates the user but never checks the record *belongs to* them. Verify ownership/permission for the specific object on every read, write, and delete — UUIDs are not a substitute (they are guessable from leaks, logs, and referers).

### Rule: Return minimal data — never serialize an entire object when the client needs a subset
**Applies to:** API responses, especially auto-generated serializers.
**Why:** Over-fetching is an access-control failure dressed as convenience: a serialized full row leaks fields the client should never see — password hashes, internal flags, other users' data, soft-deleted rows (CWE-213). Define explicit response DTOs; do not return the database model directly. (Overlaps A04 sensitive-data-exposure and A09 logging when the leak surfaces in logs.)

### Rule: Check authorization server-side on every request — never trust client-supplied roles or the absence of a UI control
**Applies to:** All privileged operations.
**Why:** Hidden buttons, disabled fields, and client-side route guards are UX, not security. An attacker calls the API directly. Role/permission must be re-derived server-side from the authenticated session on every request (CWE-602 — client-side enforcement of server-side security).

### Rule: Enforce authorization centrally and reuse it — do not reimplement checks per handler
**Applies to:** Authorization architecture (software-architect, engineer).
**Why:** Per-handler ad-hoc checks drift; one forgotten check is a breach. A single enforced mechanism (middleware, policy engine, decorator) applied uniformly makes "did we check?" answerable by inspection rather than by auditing every handler.

### Rule: Validate SSRF-style and path inputs against an allowlist, not a blocklist
**Applies to:** File paths derived from user input; URLs the server will fetch. (SSRF in OWASP 2025 is folded into A01.)
**Why:** Path traversal (CWE-22) via `../` reaches files outside the intended directory. SSRF (CWE-918) lets an attacker pivot the server into internal networks and cloud metadata endpoints (`169.254.169.254`). Resolve the canonical path / final IP *after* decoding all encoding layers, then check it falls inside the allowed set. Blocklists miss encodings, redirects, DNS rebinding, and IPv6 forms.

### Rule: Set restrictive CORS — never reflect arbitrary origins or pair `*` with credentials
**Applies to:** Any API exposed to browser clients.
**Why:** `Access-Control-Allow-Origin` reflecting the request's `Origin` header, or a wildcard with `Allow-Credentials: true`, lets any site read authenticated responses (CWE-942). Allowlist specific origins.

### Rule: Protect state-changing endpoints from CSRF
**Applies to:** Every non-idempotent endpoint (`POST`, `PUT`, `PATCH`, `DELETE`) authenticated via cookies or any other ambient credential.
**Why:** Cross-site request forgery (CWE-352) lets a malicious site cause an authenticated browser to issue requests to your API with the user's credentials attached. `SameSite=Lax` (or `Strict`) cookies cut most cases but are not sufficient alone — combine with one of: anti-CSRF tokens (synchronizer pattern), the double-submit-cookie pattern, or strict `Origin`/`Referer` header validation. Pure token APIs called from JS that read a non-cookie credential (`Authorization` header) are not CSRF-vulnerable, but cookie-auth APIs always are.

### Rule: Allowlist redirect destinations — never redirect to an arbitrary user-supplied URL
**Applies to:** `?redirect=`, `?next=`, OAuth `redirect_uri`, post-login routing, password-reset return URLs, any handler that issues an HTTP redirect with a value influenced by the request.
**Why:** Open redirect (CWE-601) lets attackers craft a link on your domain that bounces the victim to a phishing page — the victim trusts the visible domain on hover and falls for the landing page. Validate the destination is on an allowlist of paths or hosts; reject scheme-bearing values that point off-site. OAuth `redirect_uri` in particular must be checked against a registered exact-match allowlist, not a prefix match (CWE-601 / CWE-1390).

---

## Authentication failures (A07:2025 — Authentication Failures)

### Rule: Hash passwords with Argon2id (or scrypt/bcrypt) — never store them reversibly
**Numeric baseline:** Argon2id: ≥19 MiB memory, iterations ≥2, parallelism 1 (OWASP Password Storage Cheat Sheet minimum; raise per environment). Scrypt: `N=2^17` (CPU/memory cost factor), `r=8` (block-size factor), `p=1`. Bcrypt (legacy only): work factor ≥10 (prefer ≥12 on modern hardware), 72-byte input limit.
**Applies to:** All password storage.
**Why:** Plaintext, reversible encryption, or fast hashes (MD5, SHA-1, SHA-256) make a database leak an instant credential dump (CWE-916, CWE-256). Slow, memory-hard, per-password-salted hashes make offline cracking economically infeasible. Salt is per-password and handled by the library — never reuse it.

### Rule: Require MFA on authentication for any account with access to sensitive data
**Applies to:** Admin accounts always; user accounts for sensitive applications. Step-up MFA for high-risk operations.
**Why:** MFA is the single highest-leverage control against credential-stuffing and password-spray account takeovers — passwords leak, are reused, and are phished at scale, and an attacker who acquires one factor still cannot complete authentication. Prefer phishing-resistant factors (WebAuthn/passkeys, hardware tokens) over SMS, which is susceptible to SIM swap and interception.

### Rule: Regenerate the session identifier on every privilege change (login, role elevation)
**Applies to:** Session-based authentication.
**Why:** Reusing a pre-login session ID enables session fixation (CWE-384) — an attacker plants a known session ID, the victim authenticates into it, and the attacker is now logged in. Issue a fresh ID at login and on any privilege boundary.

### Rule: Store session tokens in `Secure`, `HttpOnly`, `SameSite` cookies — never in URLs or `localStorage`
**Applies to:** Session and auth-token transport.
**Why:** `HttpOnly` blocks token theft via XSS; `Secure` prevents transmission over plaintext HTTP; `SameSite` mitigates CSRF. Tokens in URLs leak through browser history, server logs, and `Referer` headers (CWE-598). `localStorage` is readable by any script on the page.

### Rule: Throttle and lock authentication endpoints against brute force
**Numeric baseline:** Per-account *and* per-source rate limit on failed attempts, with progressive delay or temporary lockout. Tune the threshold to the threat: tight limits resist targeted brute force but enable account-lockout DoS — NIST SP 800-63B allows up to 100 consecutive failed attempts when paired with rate limiting and risk-based controls.
**Applies to:** Login, password reset, MFA verification, token endpoints.
**Why:** Unthrottled auth endpoints allow unlimited credential guessing (CWE-307). Rate-limit per account *and* per source to resist both targeted brute force and distributed password spraying. Always return a generic failure message — never reveal whether the username or the password was wrong (user enumeration).

### Rule: Make password-reset and email-verification tokens single-use, short-lived, and high-entropy
**Numeric baseline:** ≥128 bits of CSPRNG entropy; short-lived (single-digit minutes for high-risk flows such as magic-link sign-in, up to ~1 hour for password reset); invalidated on use.
**Applies to:** All out-of-band verification flows.
**Why:** Predictable, long-lived, or reusable reset tokens (CWE-640) are an account-takeover path. Generate from a cryptographically secure RNG, store hashed, and expire aggressively.

### Rule: Verify JWT algorithm explicitly and validate every standard claim
**Applies to:** Every code path that accepts a JWT, including ID tokens, access tokens, and webhook signatures.
**Why:** JWT pitfalls are a well-known class of auth bypass. Specifically: (1) explicitly enumerate accepted algorithms (`HS256`, `RS256`) and **reject `alg: none`** (CWE-345) — many libraries previously accepted it silently; (2) prevent **algorithm confusion** where an HS256 token is verified using a public RSA key as the HMAC secret (CWE-347) by binding the verifier to the expected key type; (3) **validate `exp`, `nbf`, `iss`, `aud`** on every verification — token expiry alone is not enough; (4) **rotate refresh tokens on use** and revoke on logout; (5) prefer short-lived access tokens with refresh rotation over long-lived bearer tokens.

---

## Cryptographic failures (A04:2025 — Cryptographic Failures)

### Rule: Encrypt all data in transit with TLS 1.2+ and enable HSTS
**Numeric baseline:** TLS ≥1.2 (prefer 1.3); forward-secrecy cipher suites; HSTS with a long `max-age`.
**Applies to:** All network communication, including service-to-service and internal traffic.
**Why:** Plaintext protocols (HTTP, FTP, plain SMTP/LDAP) expose credentials and data to network attackers (CWE-319). HSTS prevents downgrade and strips the plaintext-first request. Drop CBC ciphers, SSLv3, and TLS 1.0/1.1.

### Rule: Encrypt sensitive data at rest with an AEAD cipher — prefer AES-256-GCM or ChaCha20-Poly1305
**Numeric baseline:** AES-128 minimum (NIST-approved), AES-256 preferred; AEAD mode required — **AES-GCM**, **AES-CCM**, or **ChaCha20-Poly1305** (the latter on platforms without AES hardware acceleration). Never use ECB or unauthenticated CBC.
**Applies to:** PII, credentials, payment data, health data, secrets, anything subject to regulation.
**Why:** Authenticated encryption (GCM/CCM/ChaCha20-Poly1305) provides confidentiality *and* integrity in one step; unauthenticated modes (ECB, raw CBC) leak structure or permit tampering (CWE-327, CWE-326). ECB must never be used — it reveals plaintext patterns.

### Rule: Generate all keys, IVs, nonces, tokens, and salts from a cryptographically secure RNG
**Applies to:** Every security-sensitive random value.
**Why:** `Math.random`, `rand()`, time-seeded or PID-seeded generators are predictable (CWE-330, CWE-338). An attacker who predicts a token or key defeats the cryptography entirely. Use the platform CSPRNG (`crypto.randomBytes`, `secrets`, `SecureRandom`, `/dev/urandom`). Never reuse a nonce/IV with the same key.

### Rule: Use vetted cryptographic libraries — never hand-roll crypto primitives or protocols
**Applies to:** All cryptographic operations.
**Why:** Correct cryptography is subtle; custom implementations leak through padding oracles, timing side channels, and mode misuse (CWE-327). Use the platform/standard library or a well-reviewed package; use high-level constructions (libsodium, `cryptography`'s Fernet) over assembling primitives by hand.

### Rule: Compare secrets and signatures with constant-time equality
**Applies to:** HMAC/signature verification, token comparison, password-hash verification.
**Why:** Ordinary `==` short-circuits on the first differing byte; the timing difference leaks the secret byte-by-byte (CWE-208). Use `hmac.compare_digest`, `crypto.timingSafeEqual`, or the language equivalent.

---

## Insecure design (A06:2025 — Insecure Design)

### Rule: Threat-model features that handle money, credentials, PII, or trust boundaries before implementation
**Applies to:** software-architect and engineer at design time.
**Why:** Insecure design is a flaw in *what was built*, not *how it was coded* — no amount of clean implementation fixes a missing control. Enumerate what can go wrong (STRIDE or abuse-case analysis) and design the control in. Distinguish missing controls (design) from buggy controls (implementation).

### Rule: Enforce business-logic limits server-side — quantities, amounts, state transitions, ownership
**Applies to:** Checkout, transfers, redemptions, workflow state machines.
**Why:** Attackers exploit logic, not just code: negative quantities, replayed requests, skipped workflow steps, race conditions on balance checks. Every invariant ("amount > 0", "can only ship after pay", "one coupon per order") must be enforced and re-checked server-side, not assumed from UI flow.

### Rule: Apply rate limiting and resource quotas to every externally reachable endpoint
**Numeric baseline:** Per-principal and per-IP request budgets; bounded request body size (reject oversize with HTTP 413); bounded pagination page size.
**Applies to:** All public APIs, auth flows, expensive operations (search, export, report generation), and resource-creating endpoints.
**Why:** Missing rate limiting (CWE-770 — uncontrolled resource consumption) enables denial of service, brute force, scraping, and cost-amplification attacks. Limits are a design requirement, not an afterthought.

### Rule: Fail closed — when a security check errors or a dependency is unavailable, deny
**Applies to:** Authorization checks, token validation, feature flags gating security, external auth services.
**Why:** A check that throws and is caught into an "allow" path is no check at all. Security decisions default to denial on any error or timeout.

---

## Security misconfiguration (A02:2025 — Security Misconfiguration)

### Rule: Change or remove all default credentials and sample/test accounts before deployment
**Applies to:** Databases, admin panels, message brokers, cloud consoles, framework scaffolding (devops).
**Why:** Security Misconfiguration is the #2 OWASP risk for 2025. Default passwords are public knowledge and scanned for continuously (CWE-1392, CWE-1188).

### Rule: Disable debug mode, verbose errors, and stack traces in production
**Applies to:** All production deployments.
**Why:** Debug pages and stack traces expose framework versions, file paths, SQL, and config (CWE-489, CWE-209). Return a generic error to the user; log full detail server-side, never to the response body.

### Rule: Disable or remove unused features, services, ports, endpoints, and accounts
**Applies to:** Application configuration and infrastructure (devops, software-architect).
**Why:** Every enabled-but-unused component is attack surface with no compensating value (CWE-1004 family). Start from the most restrictive configuration and open only what is needed.

### Rule: Set security response headers
**Applies to:** All HTTP responses from web applications.
**Why:** A baseline of `Content-Security-Policy` (defense-in-depth against XSS), `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`, and a restrictive `Referrer-Policy` closes whole classes of browser-side attacks. CSP is a secondary layer — output encoding remains the primary XSS defense.

### Rule: Run application processes and containers as a non-root, least-privilege principal
**Applies to:** Deployment configuration (devops).
**Why:** Least privilege bounds the blast radius of any compromise (CWE-250). A process that does not need root, file-write, or network egress should not have it. Apply the same to database accounts, cloud IAM roles, and service tokens.

### Rule: Validate file uploads — allowlist by extension AND content-type sniffing, store outside the web root
**Applies to:** Every endpoint that accepts user-supplied files (avatars, attachments, document import, image uploads).
**Why:** File uploads are a recurring high-impact vector: executable extensions in misconfigured servers (CWE-434 — unrestricted file upload), MIME-type spoofing, image-bomb / zip-bomb denial of service, and path traversal in user-supplied filenames. Enforce: (1) an extension allowlist; (2) content-type sniffing of the actual bytes (`file(1)`, libmagic) — never trust the client's `Content-Type` header; (3) a hard size limit; (4) randomize the stored filename and strip directory components from the input; (5) store uploads outside the web/serve root and serve them through a handler that sets `Content-Disposition: attachment` and a safe `Content-Type`; (6) optionally scan with an AV engine for binary uploads; (7) re-encode user images (resize/strip metadata) where the upload is meant to be a picture.

---

## Mishandling of exceptional conditions (A10:2025 — Mishandling of Exceptional Conditions)

A10 (new in OWASP 2025) covers failures in error handling, fallback logic, and exception flow — failing open, swallowing errors that should fail closed, returning verbose errors to the user. The "Fail closed" rule in **Insecure Design** above and the "Disable debug mode" rule in **Security Misconfiguration** both map to A10. The rule below adds the application-error class explicitly. See also the error-handling rules in `code-quality.md` (`A10` overlap).

### Rule: Don't swallow security-relevant exceptions — surface, log, and fail closed
**Applies to:** Any try/catch around authentication, authorization, signature verification, decryption, token validation, or external auth/security service calls.
**Why:** An exception in a security check that is silently caught and treated as success becomes an authentication or authorization bypass (CWE-755 — improper handling of exceptional conditions; the cluster A10 collects). Catch narrowly, log the failure with enough context to investigate, and return a denial — never an allow. A timeout reaching the identity provider is a denial, not an "assume valid".

---

## Logging and audit (A09:2025 — Security Logging & Alerting Failures)

### Rule: Never log secrets, credentials, tokens, full PANs, or session identifiers
**Applies to:** All logging, error reporting, APM traces, and analytics events.
**Why:** Logs are widely accessible, long-retained, shipped to third parties, and rarely access-controlled to the standard of the primary datastore (CWE-532). A secret in a log is a secret leaked. Mask, redact, or omit; redact at the logging boundary so it cannot be bypassed.

### Rule: Mask or pseudonymize PII in logs and non-production data
**Applies to:** Application logs, analytics, and any copy of production data used in dev/test/staging.
**Why:** Personal data in logs is a confidentiality breach and a regulatory exposure (GDPR/CCPA). De-identify (delete, hash, pseudonymize) sensitive fields; production data copied to lower environments must be scrubbed.

### Rule: Log security-relevant events without logging sensitive payloads
**Applies to:** Authentication outcomes, authorization denials, input-validation failures, privilege changes, admin actions.
**Why:** A09 covers *insufficient* logging — without an audit trail, breaches go undetected and unrecoverable. Log who/what/when for security events; ensure logs are tamper-resistant and time-synchronized. Balance against the "never log secrets" rule above.

---

## Software or data integrity (A08:2025 — Software or Data Integrity Failures)

### Rule: Bind input to explicit DTOs — never mass-assign request bodies onto domain/database objects
**Applies to:** Create/update handlers, ORM model binding.
**Why:** Mass assignment (CWE-915) lets an attacker set fields the form never exposed — `isAdmin`, `role`, `accountBalance`, `ownerId` — by adding them to the request body. Bind only an allowlist of editable fields via a dedicated input object.

### Rule: Verify the integrity of data and code from untrusted sources before acting on it
**Applies to:** Deserialization of untrusted data, webhook payloads, auto-update mechanisms, externally sourced configuration.
**Why:** Deserializing untrusted data into live objects (CWE-502) can execute code; unverified updates and unsigned webhook payloads let an attacker inject content. Verify signatures (HMAC for webhooks); never deserialize untrusted input into arbitrary types.

---

## Sources

- [OWASP Top 10:2025 — Introduction and category list](https://owasp.org/Top10/2025/0x00_2025-Introduction/)
- [OWASP Top 10:2025 — A01 Broken Access Control](https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/)
- [OWASP Top 10:2025 — A02 Security Misconfiguration](https://owasp.org/Top10/2025/A02_2025-Security_Misconfiguration/)
- [OWASP Top 10:2025 — A04 Cryptographic Failures](https://owasp.org/Top10/2025/A04_2025-Cryptographic_Failures/)
- [OWASP Top 10:2025 — A05 Injection](https://owasp.org/Top10/2025/A05_2025-Injection/)
- [OWASP Top 10:2025 — A06 Insecure Design](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/)
- [OWASP Top 10:2025 — A07 Authentication Failures](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/)
- [OWASP Top 10:2025 — A08 Software or Data Integrity Failures](https://owasp.org/Top10/2025/A08_2025-Software_or_Data_Integrity_Failures/)
- [OWASP Top 10:2025 — A09 Security Logging & Alerting Failures](https://owasp.org/Top10/2025/A09_2025-Security_Logging_and_Alerting_Failures/)
- [OWASP Top 10:2025 — A10 Mishandling of Exceptional Conditions](https://owasp.org/Top10/2025/A10_2025-Mishandling_of_Exceptional_Conditions/)
- [OWASP Application Security Verification Standard (ASVS) 5.0](https://owasp.org/www-project-application-security-verification-standard/)
- [CWE Top 25 Most Dangerous Software Weaknesses — 2024](https://cwe.mitre.org/top25/archive/2024/2024_cwe_top25.html)
- [OWASP Cheat Sheet — SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [OWASP Cheat Sheet — Query Parameterization](https://cheatsheetseries.owasp.org/cheatsheets/Query_Parameterization_Cheat_Sheet.html)
- [OWASP Cheat Sheet — Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html)
- [OWASP Cheat Sheet — Cross Site Scripting Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [OWASP Cheat Sheet — Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP Cheat Sheet — Insecure Direct Object Reference Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html)
- [OWASP Cheat Sheet — Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Cheat Sheet — Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [OWASP Cheat Sheet — Cryptographic Storage](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [OWASP Cheat Sheet — Server Side Request Forgery Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)
- [OWASP Cheat Sheet — Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [OWASP Cheat Sheet — Mass Assignment](https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html)
- [OWASP Cheat Sheet — REST Security](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)
- [OWASP Cheat Sheet — Cross-Site Request Forgery Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [OWASP Cheat Sheet — File Upload](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
- [OWASP Cheat Sheet — JSON Web Token for Java](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
- [OWASP Cheat Sheet — Unvalidated Redirects and Forwards](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html)
- [OWASP Cheat Sheet — XML External Entity Prevention](https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html)
- [NIST SP 800-63B — Digital Identity Guidelines: Authentication](https://pages.nist.gov/800-63-3/sp800-63b.html)
