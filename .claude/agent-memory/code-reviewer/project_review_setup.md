---
name: Project review setup
description: How the pre-commit review gate works in andresilva.cc — marker files, hash, 30-min staleness window
type: project
---

The pre-commit hook at `.claude/hooks/pre-commit-review-check.sh` blocks `git commit` unless:
1. All 4 marker files exist in `.reviews/`: `marker-code-quality.json`, `marker-security.json`, `marker-testing.json`, `marker-architecture.json`
2. Each marker has a `timestamp` less than 30 minutes old
3. `.reviews/review-hash.json` contains the SHA256 of `git diff --cached` (computed via `shasum -a 256`)

**Why:** Enforces that all four reviewers have signed off on the exact staged content before commit.

**How to apply:** When writing marker files, use a current UTC timestamp. The `review-hash.json` hash must match the current staged diff — if the staged diff hasn't changed since the last reviewer ran, the existing hash remains valid; just update the timestamp. Source files (`.ts`, `.tsx`, `.js`, etc.) require all 4 review types. Test files only require code-quality + testing. Docs/config-only changes skip reviews entirely.
