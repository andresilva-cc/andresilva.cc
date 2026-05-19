---
name: hero-art-sizing
description: Settled sizing for the home hero stipple art — desktop box and mobile band — and why each value was chosen
metadata:
  type: project
---

Home hero stipple art (`src/components/hero-art.tsx` + `--hero-art-*` tokens in `src/styles/globals.css`) renders two responsive instances.

**Desktop box (`>= lg`):** `--hero-art-w: 296px` / `--hero-art-h: 200px` (1.48:1). Settled.
**Why:** the box sits beside the ~162px hero text column; its height is a peer of the text, not of article thumbnails. 200 = 162 + deliberate breathing room. Was once 400x270 (270 dwarfed the text), cut to 296x200. A later round rejected 16:9 (would be 296x166, re-collapsing the defended gap).
**How to apply:** do NOT raise the desktop height — taller re-opens the art-vs-text imbalance. 1.48:1 is final.

**Mobile band (`< lg`):** `--hero-art-h-mobile: 180px` — raised from 130px (2026-05-19).
**Why:** 130 was set when no other mobile stipple element existed. Article-card thumbnails were later set to full-width 16:9, so on mobile they render ~360x200 directly below the fold — making the 130px hero band the thinnest stipple element on the page and inverting hierarchy (identity mark looked starved next to a content card). 180px clears the starved look while staying a landscape band (~2.0:1, vs thumbnail 1.78:1) so the two read as different kinds of object — a horizon strip vs a content thumbnail.
**How to apply:** keep the mobile band below thumbnail height (~200) so it stays decisively wider-than-tall and reads as a horizon strip rather than a content thumbnail. 180px is the settled value. Plasma is `fit="cover"`, so height only crops the field; no grid retune needed.
