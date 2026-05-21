---
name: patterns-image-containers
description: Image-container treatment convention for andresilva.cc redesign — transparent generative art vs opaque photography
metadata:
  type: project
---

# Image-container convention (andresilva.cc redesign)

The site has two kinds of image media, treated differently on purpose:

- **Transparent generative art** (e.g. Stipple ASCII/dot art via `<stipple-art>` Web
  Component): rendered as monospace glyphs in `text-fg-muted`, NOT a raster. Negative
  space dominates — whatever surface is behind shows through. Treatment:
  `bg-canvas` (same as page `--bg`) + `border border-rule`. Never `bg-surface` —
  a lighter panel sits between the dark page and the art, flattens dot contrast, and
  makes it read as a UI chip rather than artwork. Border stays: it is the site's
  structural-rule vocabulary (matches `border-b border-rule` rows, GridFrame), and it
  reserves the slot for slow/un-upgraded embeds.
- **Opaque photography** (e.g. About `Portrait`, `me.jpg`): full-bleed `next/image`
  with `object-fit: cover`, duotone filter + CRT-scanline overlay, NO border. Container
  background never visible, so it is irrelevant.

**Shared principle:** the container fill must never sit between the dark page and the
artwork. Opaque photo achieves this by being opaque; transparent art achieves it with
`bg-canvas`.

**Why:** verdict given 2026-05-17 on the `/articles` stipple-thumbnail treatment in
`src/components/article-card.tsx` (line 56 wrapper was `border border-rule bg-surface` →
should be `bg-canvas`).

**How to apply:** when any new image surface is added, classify it as transparent
generative art or opaque media and apply the matching treatment. `docs/ui-spec.md`
(article-illustration section, ~line 216) describes the article thumbnail as stipple art,
matching the shipped implementation.

## Border vs frameless (orthogonal axis — added 2026-05-20)

Whether a surface carries `border border-rule` depends on whether prose introduces it:

- **Identity surfaces (bordered):** hero art on `/`, stipple article cover, stipple card
  thumbnails, About profile picture. No surrounding prose explains them — they sit in
  page-level regions (above `<hr>`, inside a card grid, beside a bio section). The
  hairline says "deliberate object, not stray asset."
- **Referential surfaces (frameless):** `<Figure>`, `<YouTube>`, `ImageMdx` inside MDX
  prose. The paragraph before and the caption row already supply the boundary; a frame
  would double it and read as editorial-magazine content card — the register this site
  rejects.

**The test:** does running prose introduce this image? Yes → frameless. No → hairline.

This is consistent with the [[no-object-impersonation]] / editorial-magazine veto: framing
prose-embedded figures is the failure mode; framing standalone identity art is not.
