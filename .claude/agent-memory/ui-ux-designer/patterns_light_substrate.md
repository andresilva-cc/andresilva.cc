---
name: patterns-light-substrate
description: Carrying the brutalist-mono identity onto white/light substrates (print, resume PDF) without inverting the dark site — plus PDF text-layer and measure constraints
metadata:
  type: project
---

# Light-substrate derivation (print / white backgrounds)

Settled while writing `docs/resume-print-theme.md` (the light theme for
`public/resume.pdf`, shipped on branch `worktree-resume-route` / PR #19).
Applies to **any** future light or printed artifact — email signature, slides,
alternate light theme, printed collateral.

**Why:** `#C8FF3D` measures **1.18 : 1 against white**. It is unusable as text,
as a heading, and even as a 0.5pt rule (WCAG non-text floor is 3 : 1). Naively
inverting the dark site produces an unreadable page.

**How to apply:**

1. **Accent is fill-only on light.** Lime never becomes text, a stroke, or a rule
   on a light substrate. It appears as a solid fill with `#0B0F0A` on top —
   which measures **16.40 : 1**, byte-identical to `--accent` on `--bg` on the
   site. Same pair, read from the other side.
2. **Never darken the lime to make it legible.** `#4A5D0C` reaches 7.34 : 1 but
   reads as military olive (chartreuse is a high-lightness hue by construction),
   and it collapses to ~69% K in greyscale — within 10 points of the body ink.
   Rejected twice over.
3. **Canvas becomes ink.** `#0B0F0A` is reused verbatim as the primary ink
   (19.32 : 1 on white). The whole ink ramp is **hue-locked to 108°**, the site
   canvas hue, with saturation falling as lightness rises. The green cast lives
   in the letterforms, never in a paper tint.
4. **Do not tint the paper.** A green-cast off-white forces a full-bleed fill
   that office lasers band, costs toner, and disappears when "print background
   graphics" is off. Paper is `#FFFFFF`.
5. **Hierarchy moves from hue to value.** Standing rule 1 (accent lands on the
   primary noun) survives verbatim — only the carrier changes. Value survives
   photocopiers, 200dpi ATS scans, and low-toner lasers; hue does not.
6. **Always report a greyscale value.** Rec. 601 luma
   (`0.299R + 0.587G + 0.114B`). Two colours that land within ~10 points of K are
   a failure on a B&W printer. The shipped ladder is 0 / 15 / 45 / 61 / 79 / 95% K.
7. **Non-ports:** `--color-accent-strong` (hover, no print analogue),
   `--color-accent-tint` (8% lime on white = 1.02 : 1, invisible and still costs
   toner), `--color-surface` (no panels; use rules).

## VT323 is banned on print

Verified: VT323 is a **scalable TTF** whose outlines were auto-traced by
FontForge from a Python-generated monochrome PNG emulating a VT320 CRT's
horizontal beam smear. It does **not** blur at print DPI — it reproduces the
stair-stepping with total fidelity, which on paper reads as a bad scan rather
than as a retro reference (no pixel grid for the reference to land against).
Also single-weight 400, thin auto-traced stems, no hinting. Coverage is *not* the
issue: it covers Latin-1 Supplement, so é / í / ã are fine.

Its identity role transfers to scale + weight (name in JetBrains Mono 700) plus
the lime fill. If a display gesture is genuinely needed, standing rule 12 already
answers it: a print artifact inherits the `<Wordmark />` pixel "A" as a *vector
mark*. A mark may be jagged by design; type may not.

## Weight discipline on print

The site permits 400 / 500 / 600 only. The print theme extends this by exactly
one step at exactly one element — **700 on the name** — because the display
*face* that carried identity heft on screen (VT323) is gone, so the weight axis
absorbs what the face axis gave up. One documented extension, not drift.

---

# PDF / ATS text-layer constraints

Verified by the engineer during the PR #19 build, and load-bearing for any future
PDF artifact. **Do not re-litigate these.**

- **No two-column layout survives default-mode `pdftotext`.** CSS Grid, Flexbox,
  `<table>`, CSS multi-column (both forced-break and balanced), `position:
  absolute`, and `pdf-lib` compositing all interleave identically. Chromium
  writes the content stream in DOM order (`pdftotext -raw` proves it); Poppler's
  default heuristic re-sorts by Y and cannot reconstruct columns. This is a wall,
  not a CSS mistake. **Single column is the only safe format.**
- **Two spans on one line are safe** (same Y → sorted by X → DOM order). So
  `Role @ Employer · Dates` on one line extracts correctly.
- **But a right-aligned rail across many rows is risky.** A consistent wide
  whitespace gap plus a consistent right-hand text band over 6–8 rows is exactly
  the signature the column heuristic looks for. Prefer an inline `·` separator;
  if a rail is wanted, it must be tested with default-mode `pdftotext` first.
- **A pure-vector QR (or any textless SVG) is invisible to `pdftotext`** and can
  be placed anywhere without touching the text layer.

## Measure limits protect the *return sweep*

Reusable principle, and the one that unlocked the single-column resume: the
classical 65–75ch ceiling exists to protect the eye's jump from end-of-line to
start-of-next-line. **A block that occupies exactly one line has no return
sweep**, so the ceiling does not apply to it. A wide measure is safe precisely to
the degree that it *eliminates* wrapping rather than lengthening it.

Corollary: leading rationales that cite line-tracking (e.g. "mono needs more
leading than a proportional face") are also return-sweep arguments and can be
relaxed for lists of single-line items — but not for running prose in the same
document.

## Monospace density math (reusable)

JetBrains Mono advances **600 design units** per glyph. At 9pt that is 5.4pt per
character; at 8pt, 4.8pt. Use this to check any fixed-width column before
committing to a size. Allow ~7% ragged loss for word wrap (no hyphenation, fixed
advance).

A4 = 841.89 × 595.28pt. At 11mm margins: 779.5pt printable height, 532.9pt
column, 96 characters per line at 9pt after a 1.3em bullet indent.

See [[patterns-middot-separator]] for the `·` rule (it is a within-a-value
conjunction — correct for `Role @ Employer · Dates` and for an inline tech list,
wrong between sibling destinations), and `docs/resume-print-theme.md` for the
shipped spec plus the §5 single-column height budget.
