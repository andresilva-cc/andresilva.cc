---
name: patterns-case-and-ornament
description: Role governs case (not size) on andresilva.cc, and the system has no ornamental marks — two rules I got wrong on the resume spec
metadata:
  type: project
---

# Case is governed by ROLE, not by size

**Rule:** uppercase + `tracking-eyebrow` (0.16em) is reserved for **subordinate
metadata**. Titles are always sentence case, at every size.

Verified in source:

- Uppercase treatments, all `variant="micro"` subordinate labels:
  - `src/components/eyebrow.tsx:24` — `uppercase tracking-eyebrow text-accent`
  - `src/app/(site)/about/page.tsx:117` — Facts *keys*, `uppercase tracking-eyebrow text-fg-subtle`
  - `src/styles/globals.css` `.article-prose th` — table headers
- Section titles, all sentence case: `src/app/(site)/about/page.tsx:41, 100, 113,
  125` render `title="Bio"`, `"Education"`, `"Facts"`, `"Resume"`.

**Why this is worth remembering:** on the resume print spec I set the section
headings UPPERCASE and justified it from their *size* — at 10.5pt they needed
help reading above 9.5pt job titles. André's counter, which is correct: the
heading's **role** is a section title, and role governs case. It shrank for print
economy, and **shrinking a thing does not demote what it is.**

Corollary: `--tracking-eyebrow` exists to open up uppercase runs. If the
uppercase goes, the tracking goes with it — it has no independent justification.
Do not leave tracking on sentence-case text.

# The system has no ornamental marks

`src/components/section-head.tsx:34–35, 39–41` is the whole section-marking
language: `<Eyebrow>` + `<Text variant="h2">` + `border-b border-rule`. No
squares, no glyphs, no bullets, no rules-with-ticks.

**When a component is subtracted for a new medium, do not invent carriers for
the properties you removed.** On the resume I dropped the eyebrow and then tried
to rehome its colour (onto a lime square) and its case/tracking (onto the
heading). Both inventions were wrong. The correct move was pure subtraction: drop
the eyebrow, keep the h2, keep the rule — the rule was already doing the marking
on the site and carries on doing it.

Watch for the tell: if I find myself writing "X's *case and colour* migrate
onto Y," I am inventing lineage rather than tracing it.

# On print/ATS artifacts, decoration is never a text node

**Rule:** on `/resume` (and any PDF meant to be machine-read), decorative marks
must be CSS-drawn or vector. Never a text glyph.

**Why:** anything rendered as text becomes ATS input. A `//` prefix on a heading
would make `pdftotext` emit `// Experience`, and heading strings are among the
few things a parser reads *structurally* (section detection) rather than as
keywords. Polluting them is a functional regression, not a stylistic one. This is
why the `//` eyebrow register cannot cross over to the resume even in a
compressed form.

Related: a pure-vector QR or SVG contributes nothing to the text layer and can be
placed anywhere freely — see [[patterns-light-substrate]].

# Date convention

`src/lib/format-date.ts:1–4, 17–19, 27–28` — lowercase three-letter months
(`jan`…`dec`), spaced **em dash** (not en dash), open-ended label via an
`openLabel` param defaulting to `'now'`.

`/career` keeps `now` (brand voice). `/resume` passes `'present'`
(`src/app/resume/page.tsx:100`) because ATS parsers pattern-match that word — but
**lowercase**, because that matching is case-insensitive so the case costs
nothing and the site's convention is kept. Education dates are **years only**
(`2024 — 2025`), matching `src/app/(site)/about/page.tsx:23`.
