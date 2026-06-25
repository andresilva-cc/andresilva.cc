---
name: pnpm-override-range-keys
description: pnpm overrides — range-key selectors vs path selectors, and the brace-expansion major-bump trap
metadata:
  type: feedback
---

Range-keyed override selectors like `"picomatch@>=4.0.0 <4.0.4": ">=4.0.4"` do NOT reliably match in pnpm when the consumer declares a different semver range (e.g. `^4.0.0`). Use a **path selector** instead: `"micromatch>picomatch": ">=4.0.4"`.

**Why:** pnpm matches the key against the declared range string, not the resolved version, so mismatches silently fall through.

**How to apply:** When a ranged key override fails to eliminate a vuln, switch to a `"parent>package"` path selector.

---

`"brace-expansion@<1.1.13": ">=1.1.13"` upgraded brace-expansion from v1 to v2 for minimatch@3, breaking its `expand` API and crashing ESLint.

**Why:** `>=1.1.13` has no upper bound and pnpm resolved it to v2.x. minimatch@3 expects brace-expansion v1 API.

**How to apply:** Always use same-major upper-bound in override values: `"^1.1.13"` not `">=1.1.13"`.
