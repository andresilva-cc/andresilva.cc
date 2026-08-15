---
name: Security conventions
description: andresilva.cc security-relevant conventions — PII/indexing precedent, existing public-contact-info baseline
metadata:
  type: project
---

## Indexing convention for non-content/utility routes

`src/app/design-system/page.tsx` sets `export const metadata = { robots: { index: false } }` for
its non-content utility route. This is the established pattern in this codebase for pages that
should be directly reachable but not search-indexed (living reference surfaces, direct-link-only
distribution pages like `/resume`). When reviewing a new route that isn't meant for search
discovery, check whether it uses this pattern before flagging missing `noindex` as novel — but
also check it's actually applied, since it's opt-in per-route, not a global default.

## Baseline PII exposure already on the site (pre-existing, not introduced by any single PR)

- `src/components/footer.tsx` / `StaticFooterRepository` already publish `hello@andresilva.cc` in
  plaintext, site-wide, on every indexed page (no noindex, no obfuscation). Any future finding
  about "email address exposed in plaintext" should note this existing baseline rather than
  treating email exposure as novel.
- `public/resume.pdf` is a pre-existing, publicly linked (from `/about`, `target="_blank"`, no
  `nofollow`), indexable static asset containing name/phone/`jobs@andresilva.cc` — the source of
  truth `StaticResumeRepository` was transcribed from (see PR #18 / issue #18, the `/resume` HTML
  route). Phone number exposure via this PDF predates the HTML route; a new HTML `/resume` route
  duplicating that same data in plaintext HTML is an incremental (more scrapable) exposure, not a
  wholly new category — factor this into severity when reviewing that surface again.

## /resume noindex fix — verified effective (issue #18, 2026-08-15)

`robots: { index: false }` in `src/app/resume/page.tsx` reaches the rendered
`<meta name="robots">` tag: root `layout.tsx` sets no `robots` field at all, so
there's no metadata-merge conflict, and the pattern mirrors the proven
`design-system/page.tsx` precedent exactly. `/resume` is confirmed absent
from `src/app/sitemap.ts` staticRoutes. Don't re-litigate this from scratch on
future resume-route reviews — just confirm layout.tsx still doesn't add a
conflicting `robots` field.

## Subprocess invocation pattern — execFileSync with array args (safe)

`scripts/resume/generate.mjs` (`runPopplerTool`) calls `execFileSync(cmd, args,
{...})` with `cmd` a fixed literal (`pdfinfo`/`pdffonts`/`pdftotext`) and args
an array containing only `OUT_PATH` — a hardcoded constant
(`join(ROOT, 'public', 'resume.pdf')`), never derived from user/env/CLI input.
`execFileSync` does not spawn a shell by default, so this is not
shell-injectable even in principle. This is the reference-good pattern for
local dev/export scripts in this repo that shell out to CLI tools — no
finding, cite as precedent if a similar pattern shows up elsewhere.

Related: [[design_system_conventions]]
