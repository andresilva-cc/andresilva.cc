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

---

Version-range override **keys** also need a lower bound when a package ships parallel major-version release lines (e.g. brace-expansion has independent 1.x/2.x/3.x/4.x/5.x lines, each paired to a different consumer major — minimatch@3 needs brace-expansion 1.x, newer minimatch@10 needs brace-expansion 5.x). A key like `"brace-expansion@<5.0.7": ">=5.0.7"` matches semver order, so it also matches `1.1.15` (1.x is numerically "less than" 5.0.7) and force-upgrades minimatch@3's dependency across majors, breaking its API — the exact same trap as above, just in the override *key* instead of the *value*.

**Why:** pnpm's `<version>` key selector is a plain semver comparison against the pre-override resolved version, with no awareness of "which major-version line was this."

**How to apply:** When a vulnerable package has multiple parallel major lines in the tree (check with `pnpm why <pkg>`), write one bounded key per line: `"pkg@>=1.0.0 <2.0.0": "^1.x.y"` and `"pkg@>=5.0.0 <5.0.7": "^5.0.7"`, never an unbounded `<latest-patched>` key that spans every lower major.
