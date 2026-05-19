---
name: project-project-card-descriptions
description: /projects card descriptions — fixed two-line length target at the 38ch card measure, plus the em-dash convention
metadata:
  type: project
---

The /projects grid renders each project `description` in a card capped at `--max-width-prose-card: 38ch` (≈38 monospace chars/line). Descriptions should all land on the SAME line count or the tech badges and links misalign across a grid row.

**Why:** Uneven 1/2/3-line descriptions push the badge/link rows to different vertical offsets within a row, breaking the grid's horizontal rhythm.

**How to apply:** Target TWO lines. The 38ch measure is optimistic — cards break around ~37 chars and word boundaries push long strings onto a 3rd line. Practical band is 60–72 chars, and you must mentally word-wrap each string (first line breaks near ~37 chars) to confirm it lands on exactly 2 lines. Observed: ~73 chars is the longest that still fits 2 lines; 78–80 char strings spill to a 3rd line. `andresilva.cc`'s description ("The personal website that you are seeing right now") is protected verbatim data copy (copy-guide §5) — never edit it.

**Card-description conventions (shipped):** subject-less, state-fact-and-stop, no terminal period (§9.3), present tense for living projects / past tense for archived work. No mid-string sentence-ending period — use a spaced em-dash for asides (e.g. Grafex: "Images as code — write JSX compositions, export as images"). Drop a trailing parenthetical acronym when it duplicates the card title (CRCMG, CONFEA, OAC).

These conventions are reflected in the shipped descriptions; follow them when adding or editing any project card.
