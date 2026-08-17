---
name: resume-route-conventions
description: Architecture/data-flow facts about the /resume + /career pipeline useful across all code-reviewer types — shared dataset, PDF export, drift guards
metadata:
  type: project
---

`/resume` and `/career` render the same `EMPLOYMENT_HISTORY` dataset (`src/repositories/implementations/employment-history.ts`), unified so the two surfaces can't drift independently. Each bullet has both a `short` and a `text` form — `/resume` renders `short ?? text` (print-compressed), `/career` renders `text` (full form). A regression that swaps which field a route reads is the exact defect the `FORBIDDEN_TEXT`/`CAREER_REQUIRED_TEXT` checks in `scripts/resume/generate.ts` exist to catch.
**Why:** Before unification, `/career` had no content guard beyond manual screenshots, giving it a shared-data blast radius from any `/resume`-focused edit.
**How to apply:** Any change touching `employment-history.ts`, `static-resume-repository.ts`, `format-date.ts`, or `src/repositories/index.ts` is resume-source for the purposes of `.claude/hooks/pre-commit-review-check.sh`'s `RESUME_SOURCE_PATTERN` — expect `public/resume.pdf` to need re-export alongside such changes. See [[security-conventions]] for the noindex/PII baseline and the script's trust boundary.

`public/resume.pdf` is a manually-exported, committed artifact (`pnpm resume:pdf`) — no build step regenerates it automatically. `docs/resume-print-theme.md` is the governing spec for print layout/type-scale decisions (e.g. `EXPECTED_PAGE_COUNT = 2` in `generate.ts` is a pinned, deliberate acceptance of current reality per that spec, not a bug).
**Why:** The PDF silently drifting from live data already happened once in practice (the motivation for the pre-commit drift guard added around issue #18).
**How to apply:** Don't flag `EXPECTED_PAGE_COUNT` or similar pinned constants as magic numbers without checking the adjacent comment/spec reference first — they're often deliberate baselines, not oversights.

Known pre-existing date-label bug (as of the resume-route work): open-role date labels have drifted casing/wording before (`"present"` vs `"Present"` on `/resume`, `"now"` vs `"present"` on `/career` — the two routes intentionally use different open-role labels). `REQUIRED_TEXT`/`CAREER_REQUIRED_TEXT` in `generate.ts` pin the exact expected strings specifically because this already regressed once.
**Why:** Worth knowing this is a recurring drift point, not a one-off, if it resurfaces in a future diff.
**How to apply:** Treat any change to date-label formatting (`format-date.ts` or inline label strings near `EMPLOYMENT_HISTORY`) as needing extra scrutiny against this known history.
