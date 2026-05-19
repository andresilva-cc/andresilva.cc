---
name: Meaningful per-project imagery beats generative pattern libraries
description: When a design direction uses featured-project imagery, each image must evoke that specific project's purpose — not be drawn from a shared generative pattern library.
type: feedback
---

When a design direction puts imagery on featured-project cards, each image must *mean something specific about that project*. Generative / abstract / interchangeable patterns (dot fields, spirals, ray fields, sphere fields) read as meaningless decoration and have been rejected in multiple rounds.

**Why:** The user's phrasing was literal: "featured projects get a pure-css image that relates to what the project is about." Generative patterns don't relate to anything — they're decoration pretending to be content. Three thumbnails that differ only in composition read as three variations of one filter, not three projects.

**How to apply:** For each featured project, read its one-line description and design an illustration that evokes that specific mechanic. Example mappings that worked for direction 12:
- Grafex ("Images as code. Write JSX, export as images.") → split panel: JSX syntax on the left, pixel mosaic on the right, bridging arrow.
- Calcloak ("Syncs personal calendar events as busy blocks to work calendars") → week calendar grid with solid event blocks and yellow hatched "busy / redacted" blocks.
- Injektion ("Decorator-less DI for JS/TS") → centered DI graph: yellow ROOT container node with dashed lines radiating to 10 purple consumer nodes.

Each illustration stays on the brand palette (purple + yellow on dark), keeps a secondary halftone/dot texture to maintain visual system coherence, and is rendered in pure CSS + inline SVG at ~220px so it's a substantial card element rather than a postage-stamp corner decoration.

**Also applies to "mesmerizing" or "textural" marks on Home pages:** the mark must be (a) properly sized and composed as a primary element, not a corner afterthought; (b) visually compelling enough to hold the eye; and (c) conceptually connected to the person — not abstract for its own sake. For a senior platform/tooling/multi-agent engineer, "Feedback Field" (two concentric systems at differing strides, producing moiré beating — "emergent structure from composed primitives") lands; a 120px concentric-ring sticker in the top-right corner does not.
