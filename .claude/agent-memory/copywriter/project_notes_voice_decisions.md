---
name: project-notes-voice-decisions
description: Locked decisions for /notes copy — kind taxonomy, title rules, body discipline, anti-patterns
metadata:
  type: project
---

# /notes copy decisions (locked 2026-05-21)

Codified in `docs/copy-guide.md` §7 (microcopy inventory subsection "Notes") and §8 (Notes — authoring rules).

**Why:** New content surface launching alongside Articles. Distinct register: short, unpolished, no scaffolding. Rules guard against drift into "small articles."

**How to apply:** When reviewing or writing note content, the rules below are the source of truth — do not loosen them without a copy-guide update.

## Kind taxonomy — closed set of 4

- `til` — thing learned ("I learned X about Y")
- `take` — opinion ("I think X about Y")
- `snippet` — small code fragment with context ("Here’s how to do X")
- `aside` — meta/site notes, announcements, observations ("By the way…")

Most-specific-fits rule. `aside` is the catch-all only when none of the other three apply. Always lowercase in frontmatter and rendered meta.

## Title rules

- Required, 2–7 words, sentence case, no terminal period.
- Don't prefix with the kind ("TIL:", "Hot take:") — the badge does that.
- Readable beats clever.

## Body discipline

- Brevity over completeness. No intro, no transition, no conclusion.
- First-person `I` is allowed (more freely than About/Career) when subject-less feels stilted.
- If it needs scaffolding, it's an article — move it.

## Meta line format

`{YYYY.MM.DD} · {kind}` — ISO date period-separated (matches brutalist-mono cadence), middle dot `·` (U+00B7), lowercase mono kind word.

Example: `2026.05.21 · til`

## Empty state

`No notes yet.` — exact match for articles empty-state pattern.

## Page titles

Unified rule (supersedes prior split convention, locked 2026-05-25):

- Index `<title>`: `Notes · André Silva` (title-first, middle dot — same form site-wide).
- Paginated index: `Notes (Page 2) · André Silva` (parens for sub-page, avoids `· · ·` ambiguity).
- Detail `<title>`: `{Note Title} · André Silva` (same unified form). The pipe is dropped entirely.

## Detail page eyebrow and no prev/next

- Detail page carries `<Eyebrow>// note</Eyebrow>` — exact source `// note`, lowercase, mirrors `// article` on article detail (decided 2026-05-26, supersedes prior "no eyebrow on detail" rule). The eyebrow does NOT echo the kind (`// til` etc.) — the kind label lives in the meta line; the eyebrow frames the surface as a note for cold-link visitors who don't know the taxonomy.
- List surface (`/notes`) carries no eyebrow — the `<NOTES />` page-head already frames it.
- Detail page has back-link only (top + bottom: `back to notes`). No prev/next labels at the bottom — removed 2026-05-21.

Related: [[project_hero_pitch_rule]] (sibling content-surface copy lock).
