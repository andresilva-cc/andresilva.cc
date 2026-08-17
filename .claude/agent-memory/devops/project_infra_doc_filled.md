---
name: project-infra-doc-filled
description: docs/infrastructure.md filled in from placeholder template (2026-08-17); stale FOREM env vars found in .env.example
metadata:
  type: project
---

`docs/infrastructure.md` was an unfilled toolkit template (every field a `{placeholder}`) until 2026-08-17, when it was filled in against the live system on branch `worktree-docs-drift-cleanup`. It is now this project's operational source of truth for the devops agent role — read it first for deploy targets, env vars, CI/CD, monitoring, and operational gotchas instead of re-deriving from `docs/architecture.md` §11–13 each time.

**Found during that fill-in, still true:** `.env.example` lists `FOREM_API_URL` / `FOREM_API_KEY`, but neither is referenced anywhere in `src/`, `scripts/`, or `tools/` (verified by grep) — stale, likely a leftover from an earlier dev.to integration approach superseded by the current manual-syndication convention. The two env vars actually in use are `SKIP_OG_BUILD` (required on Vercel, set via `vercel.json` → `build.env`) and `RESUME_PDF_PORT` (optional, local-only, for `pnpm resume:pdf`). `.env.example` was intentionally left untouched — out of scope for the doc-fill task — so it still needs correcting.

**Why:** the doc-fill task was scoped to `docs/infrastructure.md` only; fixing `.env.example` would have been out-of-scope file drift.

**How to apply:** if a future task touches `.env.example` or env-var config, fix this drift then. Don't assume `FOREM_API_*` is real config for this project.
