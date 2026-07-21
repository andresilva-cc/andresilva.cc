---
name: project-pnpm11-vercel-deploy
description: pnpm 11 migration on Vercel — config now lives in pnpm-workspace.yaml, postinstall/prebuild guards for the Vercel build container
metadata:
  type: project
---

pnpm 11 (bumped from 10.27.0, packageManager pin `pnpm@11.15.1`) no longer reads the `"pnpm"` field in `package.json` — that field has been fully removed from `package.json`. `onlyBuiltDependencies` was replaced by `allowBuilds`, and `strictDepBuilds` now defaults to `true` (ignored build scripts are a hard install error, `ERR_PNPM_IGNORED_BUILDS`, not a warning).

**Current state (fixed 2026-07-21):**
- `pnpm-workspace.yaml` at repo root is now the source of truth for `overrides:` (CVE pins) and `allowBuilds:` (grafex, playwright, @playwright/test, esbuild, sharp, unrs-resolver). See [[pnpm-override-range-keys]] for override-key pitfalls.
- Root `"postinstall": "[ -n \"$VERCEL\" ] || playwright install webkit"` — WebKit is only needed locally (to render OG PNGs); Vercel's build container can't satisfy Playwright's Linux host-requirement validation, so postinstall is a no-op there.
- Root `"prebuild": "node scripts/og/generate.mjs"` renders OG images via grafex/WebKit and is skipped on Vercel via `vercel.json` → `build.env.SKIP_OG_BUILD: "1"` (the script has a built-in `SKIP_OG_BUILD` escape hatch, documented in the script's own header comment). OG PNGs are committed to the repo and regenerated locally only.

**Known quirk:** `scripts/og/generate.mjs`'s idempotency check (skip PNGs newer than source MDX/template) is unreliable right after a fresh git checkout/worktree — git doesn't preserve mtimes, so all files can appear equally fresh and every PNG regenerates instead of skipping. Not a bug to fix; verify via `git diff` (grafex render is deterministic, so a true no-op run produces zero byte diff on existing PNGs even if the console logs "wrote" for all of them).

**Why:** a previously-passing `pnpm-workspace.yaml` was lost in a git revert, silently making the CVE overrides inert and reintroducing `esbuild@0.24.2` + a stale `brace-expansion` line into the lockfile.

**How to apply:** Any future pnpm-related Vercel deploy failure on this repo — check `pnpm-workspace.yaml` exists and is not accidentally reverted/gitignored before assuming a pnpm version regression.
