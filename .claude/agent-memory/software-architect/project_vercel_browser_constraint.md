---
name: vercel-browser-constraint
description: Vercel's build container cannot run any Playwright browser — never propose build-time browser rendering (OG, PDF, screenshots) for this project
metadata:
  type: project
---

No Playwright browser can run on this project's Vercel build container. WebKit is missing ~40 system libs (libgtk-4, libgstreamer, libvulkan, libgraphene, …) and `apt install` is not permitted; Chromium is not installed at all. `postinstall` short-circuits on `$VERCEL` and installs no browsers there.

**Why:** discovered when wiring grafex OG generation into `prebuild`; the same wall was hit again for the `/resume` PDF export. The standing workaround is: generate locally, commit the artifact, serve it as a static file (`public/og/**`, `public/resume.pdf`), and gate the build step (`SKIP_OG_BUILD=1` in Vercel env vars).

**How to apply:** if a task implies rendering something with a headless browser (OG cards, PDFs, screenshots, visual diffs), assume it must be a manual local script producing a committed artifact — not a build step. Always name the drift hazard that creates: the committed artifact silently goes stale unless a human re-runs the script (this has already bitten once on `public/resume.pdf`). See `docs/architecture.md` §11–§12 for the current wiring. Related: [[architecture-doc-conventions]].

Enforcement caveat: the repo's commit-time gates (including the resume-PDF drift guard) live in `.claude/hooks/` as Claude Code `PreToolUse` hooks on the Bash tool. There are no git hooks, no `core.hooksPath`, and no CI workflow — so those gates cover commits made through the agent pipeline only, and `--no-verify` bypasses them. Never describe such a guard as protecting the repository; say what it covers and what it doesn't.

Browser print-to-PDF findings (Type 3 fonts from variable-font masters, and why a two-column layout can't have linear `pdftotext` order) are written up in `.claude/agent-memory/engineer/pdf-generation.md` and summarized in `docs/architecture.md` §7–§8 — read those before proposing any layout or font change on a PDF-exporting route.
