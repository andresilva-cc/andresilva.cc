# Chromium print-to-PDF: known limitations (from issue #18, /resume route)

## next/font/google fonts get embedded as Type 3 in exported PDFs

`next/font/google` for families that Google only ships as a **variable font**
(JetBrains Mono is one) downloads the variable master and pins a weight via
`font-variation-settings` in the generated `@font-face` — it does NOT produce
a genuinely static per-weight file, even when you pass `weight: ['400','500']`.
Verified with fontTools: every JetBrains Mono `.woff2` next/font emits has an
`fvar` table (`'fvar' in TTFont(path)` → `True`).

Chromium's Skia PDF backend embeds a variable-font-instance (anything using
`font-variation-settings`) as **Type 3** (procedural/bitmap-ish glyphs) instead
of proper TrueType/CID — `pdffonts` shows `Type 3`, `sub = yes`, but the font
name carries a `_wght<N>` suffix. This is the exact defect a "Type 3, not
subsetted properly" PDF bug report describes.

**Fix**: for any route that exports to PDF, load genuinely static per-weight
`.woff2` files via `next/font/local` instead of `next/font/google`. Source:
`@fontsource/<family>` packages ship real static instances (verified no
`fvar` table) — `pnpm add @fontsource/jetbrains-mono`, copy the 4 weight
files you need from `node_modules/@fontsource/<family>/files/` into the
route's own `_fonts/` dir (so the print route doesn't depend on a node_modules
internal path at build time), then remove the fontsource package again (it
was only needed as a one-time file source). Result: `pdffonts` reports
`CID TrueType`, `emb: yes`, `sub: yes` — correct.

Also: a font-weight used only via CSS (e.g. `font-weight: 700` on one
element) but never explicitly loaded produces the SAME Type-3-via-synthesis
problem — the browser synthesizes the missing weight from whatever variable
font resource it can find. Always load every weight you actually use.

## Chromium's page.pdf() does NOT preserve DOM reading order for side-by-side content

For a genuinely 2-column visual layout (Experience left / sidebar right),
`pdftotext file.pdf -` (default, non-`-layout`, non-`-raw` mode — the command
real ATS parsers and Cmd+F effectively approximate) **interleaves the two
columns row-by-row by Y-position**, regardless of DOM/source order. Tested
exhaustively — ALL of these interleave identically:
- CSS Grid (`display: grid`, two explicit column tracks)
- Flexbox (`display: flex`)
- HTML `<table>` with two `<td>`s
- CSS multi-column (`columns: 2`), both forced-break and natural
  newspaper-style balanced flow (the textbook case poppler's column
  detection is supposedly built for)
- `position: absolute` sidebar (painted-order tricks don't help)
- PDF-level compositing via `pdf-lib` (`embedPdf` + `drawPage` to overlay a
  separately-rendered sidebar PDF as a Form XObject) — poppler still
  flattens to final glyph position and interleaves

`pdftotext -raw` (literal content-stream order) DOES read correctly for all
of the above — confirming Chromium writes the content stream in DOM order,
but Poppler's *default* reading-order heuristic re-sorts by Y-position and
cannot reconstruct column structure for Chromium-generated PDFs specifically.
`page.pdf({ tagged: true })` (Chromium's accessible/tagged PDF output) does
NOT fix this either — Poppler's default `pdftotext` doesn't consult the
structure tree.

**Conclusion**: a visually side-by-side 2-column layout and a linear
default-mode `pdftotext` reading order are **mutually exclusive** when the
PDF is generated via Chromium's print-to-PDF, for any CSS technique tried so
far. The only reliable way to guarantee linear `pdftotext` order is a
single-column stacked layout (no side-by-side content at all). This matches
why the ORIGINAL Figma-exported two-column resume PDF (issue #18's starting
point) had the same interleaving bug — it's not Chromium-specific, it's a
property of 2-column PDF layouts generally vs. naive text extraction.

If a future task needs both a 2-column visual AND correct linear
`pdftotext`, that requires either (a) accepting the interleaving as a known
limitation, (b) dropping to single-column, or (c) a completely different
PDF-generation pipeline that doesn't go through a browser's print engine
(e.g. an actual PDF-authoring library with full content-stream control) —
none of which are a CSS-only fix.
