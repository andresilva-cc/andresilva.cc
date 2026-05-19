---
name: patterns-aspect-ratio-consistency
description: A shared rendering medium makes art read as one system; a shared aspect ratio does not. Don't force a showcase element to inherit a list element's ratio.
metadata:
  type: feedback
---

When stipple/dither art appears in multiple places on andresilva.cc (home hero + article thumbnails), do NOT force a single aspect ratio across all of them for "consistency."

**Why:** Cross-site visual cohesion comes from the shared *rendering medium* — same dot algorithm, brand-tinted palette, edge treatment. That is what the eye registers as "one system." Aspect ratio is a *layout* decision, and layout is legitimately context-specific. Viewers cannot perceive that two images share a ratio; they can perceive the medium.

**How to apply:**
- A *repeating list element* (article thumbnails) wants a fixed ratio (16:9 / `aspect-video`) — repetition needs predictable rhythm, alignment, and a known crop target.
- A *singular showcase element* (home hero art) wants dimensions tuned to its actual neighbors, not a generic ratio.
- The home hero art is locked at 296x200 (1.48:1). 16:9 at 296px width = 296x166 — only ~4px taller than the 162px text column, which would delete the deliberate 38px "breathing room" gap (a defended, ratified decision: matching the text height exactly was rejected as "cramped and timid").
- Mobile home art stays a full-width x 180px band — NOT 16:9. A full-bleed 16:9 block at mobile widths becomes a ~200-240px banner that pushes identity content below the fold.

Decision recorded 2026-05-19. See [[feedback-meaningful-imagery]] for the related rule on stipple-art content.
