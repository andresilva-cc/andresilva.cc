---
name: security-conventions
description: Recurring security baseline decisions for andresilva.cc — noindex precedent, accepted PII exposure, resume-pipeline trust boundary, subprocess pattern
metadata:
  type: project
---

Recurring security-relevant conventions confirmed across multiple review passes on this project.

**`/resume` noindex precedent:** `robots: { index: false }` (`src/app/resume/page.tsx`) plus deliberate absence from `src/app/sitemap.ts` is the accepted pattern for utility routes that render otherwise-public identity/contact info in a denser format than intended for search discovery. `/career` (a related route sharing the same `employment-history.ts` dataset) is intentionally indexed and present in the sitemap — the noindex choice is per-route, not per-dataset.
**Why:** André accepted the phone number / email on `/resume` as intentional, pre-existing surface — a resume is expected to carry that. It is not a leak to flag.
**How to apply:** Don't re-flag phone/email presence on `/resume` as a PII finding. Do flag if a *new* route renders the same PII without an equivalent noindex/sitemap-exclusion decision, or if `/resume`'s noindex/sitemap-exclusion is ever removed without discussion.

**`scripts/resume/generate.ts` trust boundary:** This is a manual, local-only script (`pnpm resume:pdf`) — never wired into the Vercel build (Chromium isn't installed there; see the file's own header comment). It builds the site locally, boots a loopback-only `next start` (`HOST = '127.0.0.1'`), and processes `pdftotext`/`pdfinfo`/`pdffonts` output that the *same script* just generated from the site's own static data in the same process run.
**Why:** No network-facing or user-submitted input ever reaches this script's regex/string operations — ReDoS and injection analysis on this file should note the input is not attacker-influenced, not just that the patterns happen to be safe shapes.
**How to apply:** When reviewing changes to this script, subprocess calls must stay `execFileSync`/`spawn`/`spawnSync` with array-form args and no `shell` option (confirmed pattern as of the resume-route work). Regex/string checks added here (`REQUIRED_TEXT`, `FORBIDDEN_TEXT`, whitespace-normalizing checks) are content-drift guards, not security controls — don't apply attacker-input severity reasoning to them.

**`.claude/hooks/pre-commit-review-check.sh` staged-diff pattern matching:** The hook greps `git diff --cached` output and staged filenames against static, script-authored regex patterns to decide which review types / re-export steps a commit requires. Staged content is always the *searched* data (piped into `grep -q`, or matched via `echo "$var" | grep -qE "$STATIC_PATTERN"`), never interpolated into an `eval`, backtick, or unquoted command position.
**Why:** This shape is immune to shell injection from staged file content by construction — worth confirming on every hook-pattern change rather than re-deriving from scratch each time.
**How to apply:** When the hook's regex patterns are widened (new file-path alternatives, new content-marker keywords), verify the new pattern is still consumed only as grep's search pattern/input (not shell-expanded) — that check is usually a one-line confirmation, not a deep audit. See [[resume-route-conventions]] for what the current pattern additions cover.
