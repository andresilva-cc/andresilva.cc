---
name: Meaningful per-project imagery beats generative pattern libraries
description: Per-project stipple art must evoke that specific project's purpose — not be drawn from a shared generative pattern library.
type: feedback
---

When imagery appears on featured-project cards, each image must *mean something specific
about that project*. Generic / abstract / interchangeable patterns (dot fields, spirals,
ray fields, sphere fields) read as meaningless decoration.

**Why:** The user's intent was literal: featured projects should get art that relates to
what the project is about. Generative patterns don't relate to anything — they're
decoration pretending to be content. Three thumbnails that differ only in composition read
as three variations of one filter, not three projects. This principle informed the shipped
stipple-art thumbnails.

**How to apply:** For each featured project, read its one-line description and design
stipple/ASCII art that evokes that specific mechanic. Example mappings:
- Grafex ("Images as code. Write JSX, export as images.") → split panel: JSX syntax on one
  side, a pixel mosaic on the other.
- Calcloak ("Syncs personal calendar events as busy blocks to work calendars") → week
  calendar grid with solid event blocks and hatched "busy / redacted" blocks.
- Injektion ("Decorator-less DI for JS/TS") → centered DI graph: a root container node
  with lines radiating to consumer nodes.

Each illustration stays on the shipped brutalist-mono system — lime accent on near-black,
rendered as stipple / ASCII glyphs (the same dot medium as the rest of the site) — and is
sized as a substantial card element, not a postage-stamp corner decoration.

**Also applies to "mesmerizing" or "textural" marks on the Home page:** the mark must be
(a) properly sized and composed as a primary element, not a corner afterthought;
(b) visually compelling enough to hold the eye; and (c) conceptually connected to who André
is — not abstract for its own sake. For a senior platform/tooling/multi-agent engineer,
a mark evoking "emergent structure from composed primitives" lands; a small concentric-ring
sticker tucked in a corner does not.
