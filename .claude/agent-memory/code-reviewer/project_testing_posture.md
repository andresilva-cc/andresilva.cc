---
name: project_testing_posture
description: andresilva.cc has zero test infrastructure (no runner, no CI) — calibrate Testing reviews accordingly
metadata:
  type: project
---

andresilva.cc (personal site) has **no test runner, no test files, and no `.github/workflows/` CI** anywhere in the repo (confirmed by Glob for `*.test.*`/`*.spec.*` and `.github/workflows/*` — only matches live inside `node_modules`). `package.json` has no `test` script.

**Why:** This is a deliberate/inherited state, not a regression in any single PR — it's a personal portfolio site, not a team codebase with a testing mandate.

**How to apply:** In Testing reviews, state this plainly up front and calibrate findings to it — do not demand a test suite for presentational React components or content-only changes. Focus Testing findings on the few spots that behave like real release/build steps with a genuine failure mode: e.g. manual export/generation scripts (`scripts/**/generate.mjs`) whose output gets committed, and whether `pnpm build`'s static prerendering + type-check actually exercises a given route (it usually does, for routes with no `dynamic` export / no dynamic APIs — this acts as an incidental smoke test worth noting positively). See [[project_review_setup]] for the separate pre-commit review-marker mechanism (unrelated to actual test coverage).
