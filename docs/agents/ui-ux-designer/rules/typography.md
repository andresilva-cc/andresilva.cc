# UI Design Rules — Typography

**Read on-demand when the task involves text rendering, font choice, type scales, line-height, measure, headings, numerals, or any text-heavy layout.**

This domain governs how text is sized, spaced, weighted, and rendered — contrast and color are in `color.md`.

---

## Contrast and accessibility floor

### Rule: Body text ≥ 4.5:1 contrast (WCAG 1.4.3 AA)
**Numeric baseline:** 4.5:1 against background.
**Applies to:** Body text, labels, inline text below 18pt / 14pt-bold.
**Why:** Readability threshold for users with 20/40 vision. Legal baseline in WCAG-referencing jurisdictions.

### Rule: Large text may drop to 3:1 (≥18pt, or ≥14pt bold)
**Numeric baseline:** 3:1; definition per WCAG 2.2.
**Applies to:** H1/H2 display text, hero headlines, oversized numerals.
**Why:** Larger stroke widths resolve at lower contrast without losing glyph identity.

### Rule: AAA body text uses 7:1 contrast
**Numeric baseline:** 7:1 body / 4.5:1 large text.
**Applies to:** Government, healthcare, finance, senior-user surfaces.
**Why:** Serves ~20/80 vision without assistive tech.

### Rule: Text must resize to 200% without loss of content or functionality
**Numeric baseline:** 200% zoom; reflow at 320 CSS px.
**Applies to:** Every text container.
**Why:** WCAG 1.4.4 + 1.4.10. Low-vision users rely on browser zoom. Never use fixed `px` heights on text-containing blocks.

### Rule: Text spacing overrides must not break layout
**Numeric baseline:** line-height ≥1.5×, paragraph spacing ≥2×, letter-spacing ≥0.12×, word-spacing ≥0.16×.
**Applies to:** All text-bearing containers.
**Why:** WCAG 1.4.12. Dyslexic / low-vision users apply reader-stylesheet spacing; fixed-height containers clip text.

---

## Measure and line-height

### Rule: Body text measure 45–75 characters per line
**Numeric baseline:** 45–75 cpl (66 ideal for single-column); 40–50 for multi-column.
**Applies to:** Article body, documentation prose, long-form marketing copy. Dense UI tables exempt.
**Why:** Longer lines cost saccade accuracy on line return — reading speed drops. Bringhurst's "perfect measure" is 66 characters.

### Rule: Body line-height 1.20–1.45 (unitless)
**Numeric baseline:** 1.2–1.45 for body at 14–18px.
**Applies to:** Body text.
**Why:** Tight leading causes lines to visually merge; loose leading breaks vertical rhythm and slows reading. Increase toward 1.5–1.6 for longer measures.

### Rule: Headlines use tighter line-height than body
**Numeric baseline:** Display 1.0–1.2; body 1.2–1.5.
**Applies to:** H1/H2/display sizes.
**Why:** As font size grows, whitespace within a line grows with it — less relative leading needed for visual separation.

### Rule: Let ideal measure go when it hurts font-size comfort on mobile
**Applies to:** Responsive prose layouts.
**Why:** Readability is multi-factor. When maintaining 65ch forces text below comfortable size, prioritize size.

---

## Weight, italic, emphasis

### Rule: No weights below 400 for text ≤24px
**Numeric baseline:** Weight ≥ 400 (Regular) at ≤24px. Light/Thin only for display ≥32px.
**Applies to:** All body and UI text.
**Why:** Thin strokes fail contrast at small sizes and degrade on sub-pixel rendering. They also break when users invoke text-spacing overrides.

### Rule: Prefer 2–3 total weights — 400/500 body + 600/700 emphasis
**Numeric baseline:** Body 400–500; emphasis 600–700.
**Applies to:** UI copy and editorial.
**Why:** More than 2–3 weights dilutes hierarchy. Small set forces intentional emphasis.

### Rule: Use bold, not italic, for UI emphasis
**Applies to:** UI labels, CTAs, inline emphasis in product copy.
**Why:** Italic indicates linguistic role (titles, foreign terms, stress); bold indicates visual prominence. Mixing muddies both.

### Rule: Typography hierarchy uses size AND weight AND color — not size alone
**Applies to:** All hierarchical text systems.
**Why:** Size-only hierarchy feels clunky (giant H1, tiny body). Weight and color give smoother visual steps.

---

## Caps, tracking, micro-typography

### Rule: Add 5–12% letterspacing to all-caps and small-caps
**Numeric baseline:** 0.05–0.12em.
**Applies to:** Section labels, tab labels, uppercase button text, eyebrow headings.
**Why:** Caps are drawn with tight sidebearings assuming mid-word placement; used as runs, they read cramped.

### Rule: Don't set paragraphs in ALL CAPS (≤1 line max)
**Numeric baseline:** ≤1 line of caps.
**Applies to:** Body copy, long-form prose, description text. Caps are fine for labels, tabs, eyebrow headings.
**Why:** Lowercase ascenders/descenders provide word-shape cues for skimming. Caps homogenize to rectangles — reading speed drops 13–20%.

### Rule: Large display type can use negative tracking; small text needs positive
**Numeric baseline:** Display: −0.5% to −2%. Caption/footnote: +5% to +6%.
**Applies to:** Hero headlines (tighten); captions (loosen).
**Why:** Display sizes become too loose at their proportional sidebearings; small type benefits from extra room for pixel-rendering clarity.

### Rule: Don't fake small caps — use OpenType or skip them
**Applies to:** Acronyms, abbreviations where designers reach for small caps.
**Why:** Browser-synthesized `font-variant: small-caps` scales down capitals, producing strokes thinner than real-body text — looks broken.

---

## Links, underlines, quotes

### Rule: Underlines are reserved for links
**Applies to:** All prose, UI labels, headings.
**Why:** Underline is the strongest surviving convention for clickable text. Using it elsewhere trains users to distrust it. Nav links are the exception — position/hover can signal clickability.

### Rule: Use curly quotes, not straight quotes
**Applies to:** All display text, body copy, button labels, product strings.
**Why:** Straight `"` and `'` are a typewriter artifact. In proper typography they read as rendering errors.

### Rule: Use the `…` character, not three periods
**Applies to:** Truncation, pauses in prose, loading states.
**Why:** The Unicode ellipsis is a single glyph that line-breaks correctly. Three periods can break across lines.

### Rule: Truncate with CSS `text-overflow: ellipsis` + the `…` glyph
**Applies to:** Table cells, list items, card titles — anywhere width is constrained.
**Why:** Clip by container width (responsive); character-count truncation clips at arbitrary sizes and breaks across locales.

---

## Numerals

### Rule: Use `font-variant-numeric: tabular-nums` in columns of numbers
**Numeric baseline:** `font-variant-numeric: tabular-nums` (OpenType `tnum`).
**Applies to:** Price columns, stats dashboards, timers, analytics tables, totals rows.
**Why:** Proportional figures shift column widths as values change (9 is wider than 1), producing jittering totals and misaligned tables.

### Rule: Leave prose figures proportional (default)
**Applies to:** Body copy, article prose, dates-in-sentences.
**Why:** Tabular figures have even sidebearings for alignment but read awkwardly in prose — they look monospaced in a proportional sentence.

---

## Font loading and system architecture (detect-and-conform)

### Rule: Declare a metric-matched fallback stack
**Numeric baseline:** Use `size-adjust`, `ascent-override`, `descent-override` when possible.
**Applies to:** Every project with a custom web font.
**Why:** Layout shift during font swap (FOUT) damages Core Web Vitals CLS and feels janky. Matched metrics prevent reflow.

### Rule: Use a ratio-based modular scale, not arbitrary sizes
**Numeric baseline:** Common ratios 1.125 (major 2nd), 1.2 (minor 3rd), 1.25 (major 3rd), 1.333 (perfect 4th), 1.5 (perfect 5th), 1.618 (golden).
**Applies to:** Type-scale definition.
**Why:** Ratio-based steps produce perceptually-even progressions. Arbitrary sizes (13, 14, 16, 18, 22, 28, 35…) feel noisy. Detect existing scale and conform.

### Rule: Use mono for code and data, sans for prose
**Applies to:** Code blocks, diffs, IDs, numeric data — never for captions or body.
**Why:** Monospace's fixed-width grid is for indentation and alignment. In prose it produces awkward inter-letter spacing.

---

## Sources

- [W3C — WCAG 2.2 1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [W3C — WCAG 2.2 1.4.4 Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)
- [W3C — WCAG 2.2 1.4.6 Contrast (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html)
- [W3C — WCAG 2.2 1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- [W3C — WCAG 2.2 1.4.12 Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)
- [Matthew Butterick — Practical Typography, Summary of Key Rules](https://practicaltypography.com/summary-of-key-rules.html)
- [Butterick — Line Length](https://practicaltypography.com/line-length.html)
- [Butterick — Line Spacing](https://practicaltypography.com/line-spacing.html)
- [Butterick — Bold or Italic](https://practicaltypography.com/bold-or-italic.html)
- [Butterick — All Caps](https://practicaltypography.com/all-caps.html)
- [Robert Bringhurst — Elements of Typographic Style (Rutter)](http://webtypography.net/2.1.2)
- [Emil Kowalski — Agents with Taste](https://emilkowal.ski/ui/agents-with-taste)
- [Apple HIG — Typography](https://developer.apple.com/design/human-interface-guidelines/typography)
- [Material Design 3 — Type scale tokens](https://m3.material.io/styles/typography/type-scale-tokens)
- [MDN — font-variant-numeric](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric)
- [Typenetwork — OpenType at Work: Figure Styles](https://typenetwork.com/articles/opentype-at-work-figure-styles)
- [Google Fonts — size-adjust knowledge](https://fonts.google.com/knowledge)
