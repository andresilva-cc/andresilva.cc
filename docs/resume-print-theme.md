# Resume Print Theme — palette & typography

> Scope: colour and type only, for `public/resume.pdf`. Layout, copy, and font
> embedding/subsetting are **not** specified here. Derived from
> `docs/design-system.md` and the live `@theme` block in `src/styles/globals.css`.
> Nothing in this document changes the website.

---

## 0. The problem, stated

The site accent `#C8FF3D` measures **1.18 : 1 against white** (computed, not
estimated). That is below the threshold at which a human eye separates two
surfaces at all. It is unusable for text, unusable for a heading, and unusable
even for a 0.5pt rule — WCAG's non-text floor is 3 : 1 and lime clears none of
it. In greyscale it lands at ~15% K, so a lime hairline is invisible on a black-
and-white printer too.

But the same lime carries **16.40 : 1 with `#0B0F0A` on top of it** — byte-for-byte
the ratio the site reports for `--accent` on `--bg`. The pair is not broken; only
its *direction* is. On screen the lime is the figure and the near-black is the
ground. On paper the near-black is the figure and the lime is the ground.

That is the whole theme: **the site's canvas becomes the resume's ink, and the
site's accent becomes a fill the ink sits on.** No colour is inverted, no hue is
invented, no ratio is degraded.

### Options evaluated and rejected

**Darkened lime as a text colour — rejected.** To reach 4.5 : 1 on white the lime
must drop to roughly `#4A5D0C` (7.34 : 1). Two failures, either one fatal:

1. *Hue identity is destroyed.* Chartreuse is a high-lightness hue by
   construction; removing the lightness removes the chroma that makes it read as
   lime. `#4A5D0C` reads as military olive. Nobody puts the resume next to the
   site and says "same colour."
2. *It collapses in greyscale.* `#4A5D0C` prints at ~69% K. The body ink
   (`#2E3A2B`) prints at ~79% K. On a B&W office laser those are a 10-point
   difference at 9pt — a "coloured heading" that is indistinguishable from body
   text on the printer most recruiters use. This is exactly the greyscale
   collapse the theme has to avoid.

**Lime-as-fill + dark ink for text emphasis — adopted.** Preserves the hue
exactly, preserves the 16.4 : 1 pairing, and moves the hierarchy load onto value
and type, which are the two axes that survive both a photocopier and a fax-grade
scan. The consequence is honest and stated up front: **the print resume has no
coloured text.** Hierarchy is carried by ink value, size, weight, case, tracking,
and rules. Lime appears twice, as a fill, and never carries information.

---

## 1. Palette

Six tokens. The current resume uses three (purple + two inks); six is the right
count because the light substrate needs one thing the dark one does not — a
**rule** value that is lighter than any text but darker than paper. On the dark
site that job is done by `--rule` (`#1F2A1F`), a near-black; on white it cannot
be borrowed from the ink ramp without becoming a text colour. The other addition
is a third ink stop, which the site already has (`fg` / `fg-muted` / `fg-subtle`)
and the resume currently lacks — the current PDF collapses dates, contact row,
and bullet text into effectively one grey, which is why the page reads flat.

### Hue lock

Every ink in the ramp is locked to **hue 108°**, the exact hue of the site canvas
`#0B0F0A`. Saturation falls as lightness rises (33% → 26% → 18% → 13%) so the
lighter stops do not turn minty. For reference, the site's *foreground* ramp runs
97–100° — within 11° of the lock, which is imperceptible at these chromas. The
green cast is therefore not a tint applied to the paper; it lives inside the ink,
which is why the theme reads as related to the site without the paper ever
carrying a background fill.

### Tokens

| Print token | Hex | Site lineage | vs `#FFFFFF` | Greyscale (8-bit / % K) |
|---|---|---|---|---|
| `paper` | `#FFFFFF` | — (inverse of `--color-canvas`) | 1 : 1 (ref) | 255 / 0% K |
| `ink` | `#0B0F0A` | `--color-canvas` verbatim | **19.32 : 1** | 13 / 95% K |
| `ink-body` | `#2E3A2B` | role of `--color-fg-muted` | **11.96 : 1** | 53 / 79% K |
| `ink-subtle` | `#5C6B58` | role of `--color-fg-subtle` | **5.68 : 1** | 100 / 61% K |
| `rule` | `#849380` | role of `--color-rule` | **3.25 : 1** | 140 / 45% K |
| `accent` | `#C8FF3D` | `--color-accent` verbatim | **1.18 : 1** | 216 / 15% K |

Greyscale values are Rec. 601 luma (`0.299R + 0.587G + 0.114B`), which is what
consumer B&W drivers use. The ladder is **0 → 15 → 45 → 61 → 79 → 95% K**:
monotonic, with no gap smaller than 15 points. Nothing collapses.

### Per-token detail

---

**`paper` — `#FFFFFF`**

Pure white, not a tinted near-white. Usage: the page. Nothing else.

*Do not use for:* a tinted "paper" sibling of `--color-canvas`. A green-cast
off-white (e.g. `#FAFCF8`) is the obvious inversion and it is wrong here — it
forces a full-bleed background fill on every printed copy, which banding-prone
office lasers render as visible streaks, costs toner on an artifact people print
casually, and is discarded entirely the moment someone prints "background
graphics off" (the default in several PDF viewers). The green cast is delivered
through the ink ramp instead, where it survives all three.

---

**`ink` — `#0B0F0A` · 19.32 : 1 · 95% K**

The site's canvas hex, unmodified. Usage: the name; section headings; employer
names; degree and institution names; bullet markers; QR modules; any text set on
an `accent` fill.

This is the emphasis token. On the site, emphasis is carried by `--color-accent`
landing on the surface's primary noun (standing rule 1). On paper that rule
survives intact — only the carrier changes from hue to value. Wherever the site
would have gone lime, the resume goes `ink`.

*Do not use for:* running body text or bullet text. Setting an entire resume at
19 : 1 flattens the page into a single value and destroys the only hierarchy
system available once colour is gone. `ink` must stay scarce to stay loud.

---

**`ink-body` — `#2E3A2B` · 11.96 : 1 · 79% K**

Usage: the summary paragraph; all bullet text; role titles in the
`Role @ Employer` line; education descriptions; the technologies list; contact-row
values.

The site sets body prose at `--color-fg-muted` (7.92 : 1). This token deliberately
lands **higher** at 11.96 : 1 rather than mirroring that ratio. Reason: dark-on-
light degrades differently from light-on-dark. A screen never loses a photon, but
a resume gets photocopied, scanned at 200dpi by an applicant-tracking pipeline,
faxed by a recruiter who still has a fax, and printed on a cartridge at 8% toner.
Every one of those lightens dark text. Mirroring 7.92 : 1 would have produced
`#4A5745`, which is inside spec but has no headroom left. 11.96 : 1 clears the
brief's 7 : 1 floor with roughly 70% margin and still sits a clear 16 greyscale
points below `ink`.

*Do not use for:* section headings or the name. The value gap to `ink` is
deliberate and small — it separates prose from structure, it does not create a
second emphasis level.

---

**`ink-subtle` — `#5C6B58` · 5.68 : 1 · 61% K**

Usage: date ranges (Experience and Education); contact-row icons; the `@`
connector in the `Role @ Employer` line; the QR caption.

Mirrors `--color-fg-subtle`'s 5.53 : 1 on the site almost exactly (5.68 vs 5.53).
Clears the brief's 4.5 : 1 secondary floor. It is the lowest ink permitted to
carry words.

*Do not use for:* anything below 8pt, and never for content that must survive a
photocopy generation-loss chain — dates and contact icons are recoverable from
context, a bullet's verb is not. Also not for rules; that is what `rule` is for,
and a 61% K hairline reads as a heavy border rather than a hairline.

---

**`rule` — `#849380` · 3.25 : 1 · 45% K**

Usage: every hairline on the page — section-heading underlines, column dividers,
any separator the layout pass introduces. Stroke weight **0.5pt** (never `0pt` or
"hairline": PDF renders those at device minimum, which is one dot at 2400dpi on a
platesetter and one dot at 300dpi on an inkjet — wildly inconsistent). The site
uses 1px, which is 0.75pt at 96dpi; 0.5pt is the correct print equivalent because
print resolution renders a true hairline that 96dpi cannot.

Clears the 3 : 1 non-text floor, so rules here are **structural, not decorative** —
they may carry grouping information.

*Do not use for:* text of any size (3.25 : 1 fails body contrast), and not as a
chip/badge border fill colour at scale. If the technologies list is ever rendered
as outlined chips rather than a plain list, `rule` is the border token (mapping
from `--color-accent-muted`, which is decorative-only on the site as well) — but
45 chip outlines is a toner-heavy, visually busy grid on paper and the plain list
is the right call.

---

**`accent` — `#C8FF3D` · 1.18 : 1 · 15% K**

The site accent, unmodified. **Fill only. Never text, never a stroke, never a
rule.** Two placements on the page, both specified in §2: the QR plate and the
section-heading square.

Contrast behaviour:
- `ink` on `accent` = **16.40 : 1** — identical to `--accent` on `--bg` on the site.
- `accent` on `paper` = **1.18 : 1** — invisible as a boundary in colour.
- In greyscale, `accent` prints at 15% K, so `ink` on it still measures
  **13.6 : 1**. Text on the fill survives a B&W printer perfectly.
- In greyscale, `accent` against `paper` measures **1.43 : 1** — a faint tint
  block, weak but present.

**Hard rule: no information may depend on the accent fill being visible.** Because
its edge against paper is sub-3 : 1 in both colour and greyscale, the fill is
formally decorative. Every element it sits behind must be independently legible
against white. The QR modules and the section headings both satisfy this — they
are `ink`, which reads at 19 : 1 on either substrate.

*Do not use for:* the name plate. A full lime rectangle behind a 30pt name is a
structural colour field, not a pointed accent, and it puts the single most
important string on the page on top of the page's most reproduction-fragile
surface — a low-toner laser bands a large flat tint badly, and it bands it right
under the name. Also not for a name underline bar, an underline thin enough to
read as a rule is thin enough to be invisible at 1.18 : 1, and one thick enough
to be visible is a fill in the wrong place.

### Deliberate non-ports

Three site tokens have **no print equivalent** and must not be invented:

| Site token | Why not ported |
|---|---|
| `--color-accent-strong` `#DEFF6B` | A hover state. Print has no hover. |
| `--color-accent-tint` `rgba(200,255,61,0.08)` | An 8% lime wash on white is `#FBFFF0` — 1.02 : 1, ~98% K. Invisible in colour, invisible in greyscale, and it still costs toner. |
| `--color-surface` `#0F1410` | A raised-cell background. The resume has no panels, and the site's own philosophy is hairline rules instead of fills. Use `rule`. |

The existing purple (`~#7C6BD9`) is **retired outright**. It has no successor
token; it was a pre-redesign colour and nothing in the current system maps to it.

---

## 2. Application map

Referenced against the current 1-page layout: full-width header (name, role,
contact row, summary), then a two-column body — main column with **Experience**,
sidebar with **Education** and **Technologies**, QR block bottom-right of the
sidebar.

| Element | Colour | Size / weight / leading | Tracking | Notes |
|---|---|---|---|---|
| **Name** — "André Luiz da Silva" | `ink` | 30pt / 700 / 1.05 | −0.01em | Was purple. Emphasis moves from hue to value + scale + weight. |
| **Role line** — "Software Engineer" | `ink-body` | 13pt / 500 / 1.20 | 0 | Second-most-important string; sits one ink stop below the name. |
| **Contact row — icons** | `ink-subtle` | 8pt equivalent | — | Glyph/vector icons, stroke or fill in `ink-subtle`. |
| **Contact row — values** | `ink-body` | 8pt / 500 / 1.40 | 0 | No colour is used to signal "link." If a link affordance is wanted on screen, a 0.5pt `ink-subtle` underline at 1.5pt offset — never a colour change. |
| **Summary paragraph** | `ink-body` | 9pt / 400 / 1.45 | 0 | Measure capped at **68ch** (`--max-width-prose-wide`, ported verbatim). See §3 for why this is a readability gain, not just lineage. |
| **Section headings** — Experience / Education / Technologies | `ink` | 10.5pt / 600 / 1.25 | **+0.16em**, UPPERCASE | Was ~15pt purple. See derivation below. |
| **Section-heading mark** | `accent` fill | 6pt × 6pt solid square | — | Sits before the heading text, baseline-aligned to cap height. Three instances. |
| **Section-heading rule** | `rule` | 0.5pt, full column width | — | Under the heading. Placement is the layout pass's call; stroke and colour are fixed here. |
| **Job title** — the role half of "Senior Engineer @ Healthy Labs" | `ink-body` | 9.5pt / 600 / 1.30 | 0 | |
| **`@` connector** | `ink-subtle` | 9.5pt / 400 / 1.30 | 0 | Standing rule 11: inline connector glyphs inherit the parent's size and line-height and differentiate by colour and weight only. |
| **Employer name** | `ink` | 9.5pt / 600 / 1.30 | 0 | The employer is the accent target on `/career`; on paper the accent target takes `ink`. |
| **Date ranges** | `ink-subtle` | 8pt / 500 / 1.40 | 0 | Currently these are the page's only mono text and that is what marks them as data. Once everything is mono that signal is gone — the size drop plus two ink stops replaces it. |
| **Bullet marker** | `ink` | 9pt / 600 | — | Glyph `+`, matching `.article-prose ul > li::before`. The site sets this marker in `--color-accent`; on paper it takes `ink`, preserving the figure/ground relationship (the marker is the only thing on the line darker than the text). If the layout keeps the current `–` en dash, colour and weight are unchanged. |
| **Bullet text** | `ink-body` | 9pt / 400 / 1.45 | 0 | Main column measure is ~65ch at this size — already inside the comfortable band, no cap needed. |
| **Degree / institution name** | `ink` | 9.5pt / 600 / 1.30 | 0 | Same treatment as employer names. |
| **Education description** | `ink-body` | 9pt / 400 / 1.45 | 0 | |
| **Technologies list** | `ink-body` | 8pt / 500 / 1.40 | 0 | Drops to 8pt for a hard width reason — see §3. |
| **Rules / dividers** | `rule` | 0.5pt | — | |
| **QR modules** | `ink` | — | — | Currently purple: `#7C6BD9` modules on white is 4.1 : 1, which is marginal for phone scanners and degrades badly in greyscale. `ink` on `accent` is 16.4 : 1 in colour and 13.6 : 1 in greyscale. |
| **QR plate** | `accent` fill | — | — | Solid lime rectangle behind the code, with a quiet zone of **≥4 modules** in `accent` on all four sides (the quiet zone must be the light value, which lime is). Square corners, no border. |
| **QR caption** (if present) | `ink-subtle` | 7pt / 600 / 1.35 | **+0.12em**, UPPERCASE | Ports `--tracking-badge`. |

### Section-heading derivation

The site's section head is a two-line component: an uppercase, `+0.16em`-tracked,
accent-coloured `//` comment-tag eyebrow, above a sentence-case 18px/600 H2, above
a bottom rule. On paper the eyebrow's accent colour is impossible. Rather than
drop the component, it **collapses to one line**:

- the eyebrow's *case and tracking* migrate onto the heading itself,
- the eyebrow's *accent colour* migrates onto the 6pt square,
- the bottom rule is retained in `rule`.

This is why section headings are 10.5pt — smaller than the current ~15pt — and
still read a clear level above the 9.5pt job titles. Four independent signals
separate them: case, tracking, the rule, and the lime square. That is more
differentiation than the current purple provides on its own, in less vertical
space, and it survives greyscale entirely (the square is the only element that
fades, and it carries nothing).

### Employer-vs-role emphasis

The map gives the **employer** `ink` and the **role** `ink-body`, matching
`/career`, where the company is the accent target. If André prefers role-first
scanning on the resume specifically, swap the two tokens — both clear 7 : 1 and
both are safe. It is a one-line change and the rest of the system is unaffected.

### Glyph notes

- Date ranges: en dash `U+2013`, spaced — matches current.
- Bullet marker: `+` (see above), not a hyphen-minus.
- Standing rule 9 applies to the resume's prose: curly apostrophe `U+2019`. Check
  "Spotify's SDK" in the Nuxstep block — it renders as a straight `'` in the
  current PDF and should be converted.

---

## 3. Typography

> **Revised by §5.** The single-column proposal changes four values in this
> section: the name size, the summary measure cap, bullet leading, and the
> technologies-list justification. Everything else below stands. §5 lists the
> deltas explicitly.

### Recommendation: all-mono. JetBrains Mono, four upright instances, nothing else.

**Stack:** `'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`
— identical to `--font-mono` in `globals.css`.

**Instances required:** 400, 500, 600, 700 — **upright only**. No italic. The
resume has no role for italic, and mono italic at 8–9pt loses more legibility
than it buys emphasis. Do not rely on synthetic bold: a PDF renderer faking a
weight by stroking Regular fattens the counters at 9pt and produces a visibly
muddier page than an embedded real instance.

Verified: JetBrains Mono ships **eight weights, 100–800, each with a matching
italic** (the jetbrains.com marketing page still says "5 weights" — that copy
predates v2.x). Every glyph advances **exactly 600 design units**, and the design
brief explicitly maximises lowercase height at fixed character width. That large
x-height is the single reason all-mono is viable at 9pt: it puts more ink into
the reading zone than a conventional mono at the same point size.

### Why all-mono, and what it costs

**Why.** Once colour is gone from the text, the letterform is the strongest
identity carrier left on the page. A resume set 80% in Fira Sans is not
recognisably the same artifact as andresilva.cc — it is a generic resume with a
lime QR code. Keeping the split would preserve the current readability at the
cost of the entire point of the exercise.

The readability objection to mono is real but it is an objection to *flowing
prose*. This resume is roughly 90% short scannable units: job titles, employers,
date ranges, technology names, and one-line bullets. Monospace is good at those —
it is fixed-pitch tabular content, which is what the sidebar and the date column
literally are. There is exactly one true prose block on the page, the four-line
summary, and §2 caps it at 68ch specifically to protect it.

ATS parsers read the PDF text layer, not the rendered glyphs, so the face choice
carries no parsing risk in either direction.

**What it costs, concretely.** JetBrains Mono at 9pt advances 5.4pt per character.
Measured against the current layout:

- **Main column (~354pt wide): 65 characters per line.** That is inside the
  60–75 comfortable band. No problem, and no measure cap needed on bullets.
- **Summary paragraph:** currently set full-width, which at 9pt mono would be
  ~97ch — well past the comfortable ceiling. Capping at 68ch (`--max-width-prose-wide`,
  ported verbatim) is therefore a **readability improvement**, not a lineage
  concession. It costs roughly 3–4 extra lines. This is the one block that grows.
- **Sidebar (~141pt wide, two internal columns ≈ 70pt each): 9pt mono breaks it.**
  "Windows Server" is 14 characters = 75.6pt at 9pt, which overflows a 70pt
  column. At 8pt the advance is 4.8pt, giving 67.2pt — it fits. This is why the
  technologies list is specified at 8pt in §2. It is a hard constraint, not a
  preference.

**Where the space comes back.** Section headings drop from ~15pt to 10.5pt across
three instances; the technologies list drops from 9pt to 8pt across ~29 entries;
body leading is set at 1.45 rather than porting the site's screen-luxurious 1.65.
Net, the mono switch is roughly break-even to slightly negative on the one-page
fit. If it lands negative, the fix is trimming bullet copy — a copywriter task,
not solvable by type.

### VT323: no place on this artifact

Four reasons, in descending order of severity.

1. **It reads as a defect on paper, not as a style.** VT323's outlines were
   auto-traced by FontForge from a monochrome PNG pixel grid that a Python script
   generated to emulate a VT320 CRT's horizontal beam smear. It is therefore a
   fully scalable TrueType font — the common assumption that it "blurs at print
   DPI" is **wrong**, it renders perfectly crisply. That is the problem. At
   600dpi the stair-stepping is reproduced with total fidelity, and a reader
   holding paper has no context that says "retro terminal"; they have a lifetime
   of context that says "this came off a bad scan." On a screen the pixel grid is
   the medium and the reference lands. On paper there is no pixel grid and the
   reference has nothing to land against.
2. **No weight axis.** VT323 is a single 400 weight with no italic. The name
   needs presence on a colourless page and VT323 has no mechanism to supply it —
   its stems are thin single-pixel traces that print spindly and grey.
3. **Register risk.** A pixel-display face on the name line of a hiring document
   is a large bet with an asymmetric payoff. The site can make that bet because
   the visitor already chose to be there; a resume in a stack of forty cannot.
4. **Auto-traced contours.** Uneven sidebearings and no hinting — irrelevant at
   screen sizes where the pixel aesthetic absorbs it, visible at 30pt on paper.

Character coverage is *not* a reason. This resume's charset is entirely Basic
Latin plus Latin-1 Supplement (é in André, í in Itajaí, ã in Beltrão), and VT323
covers Latin-1 Supplement in its 209 glyphs. The constraint is non-binding for
both faces.

**What replaces its role.** VT323's job on the site is the per-page identity
moment. On the resume that job is split: the **name at 30pt/700** carries the
scale gesture, and the **lime QR plate** carries the brand colour — placed, not
incidentally, at exactly the point where the paper hands the reader back to the
website, which is where VT323 actually lives. If a display gesture beyond that is
ever wanted, standing rule 12 already answers it: a print artifact inherits the
`<Wordmark />` pixel "A" as a *vector mark*. A mark is allowed to be jagged by
design because it is a logo. Type is not.

### Scale

All values in points. Line-height is unitless. All three tracking values are
ported from existing site tokens; none is invented.

| Print token | Size | Weight | Leading | Tracking | Site lineage | Applied to |
|---|---|---|---|---|---|---|
| `p-display` | 30pt | 700 | 1.05 | −0.01em (`--tracking-display`) | `--text-display` | Name |
| `p-h1` | 13pt | 500 | 1.20 | 0 | — | Role line |
| `p-h2` | 10.5pt | 600 | 1.25 | +0.16em (`--tracking-eyebrow`), UPPERCASE | `--text-h2` + eyebrow treatment | Section headings |
| `p-h3` | 9.5pt | 600 | 1.30 | 0 | `--text-h3` | Job titles, employers, degrees, institutions |
| `p-body` | 9pt | 400 | 1.45 | 0 | `--text-body` | Summary, bullets, education descriptions |
| `p-meta` | 8pt | 500 | 1.40 | 0 | `--text-meta` | Dates, contact row, technologies list |
| `p-micro` | 7pt | 600 | 1.35 | +0.12em (`--tracking-badge`), UPPERCASE | `--text-micro` | QR caption |

**Weight discipline.** The site permits exactly three weights — 400, 500, 600 —
and no weight below 400. This theme extends that ladder by **one step, at one
element**: 700 on the name. Justification: on screen the identity heft comes from
the display *face* (VT323); with that face removed, the weight axis has to absorb
what the face axis gave up. 700 rather than 800 keeps the counters open at 30pt
and avoids the shouty register. Every other element stays inside 400/500/600.

**Leading.** The site's `--text-body` line-height is 1.65, which is right for a
scrolling screen and wasteful on a one-page document. 1.45 is the print value:
monospace needs marginally more leading than a proportional face because the
uniform rhythm makes line-tracking harder, so 1.45 rather than the 1.35 a sans
would take here.

**Rendering notes.** The `.font-display` rule in `globals.css` that disables
antialiasing exists solely so VT323's pixel edges stay crisp on screen; since
VT323 is dropped, nothing carries over. If the PDF is generated from HTML, set
`text-rendering: geometricPrecision` so the renderer does not apply screen-size
hinting heuristics at print scale.

---

## 4. Rationale

The resume is not the dark site inverted, and it should not be — inverting a dark
UI produces a white page with a green cast and an unreadable accent, which is a
worse version of both artifacts. What carries across instead is the *system's
reasoning*, applied to a different substrate. The site's near-black canvas
becomes the resume's ink, hue-locked at 108° so the same green sits in every
letterform on the page rather than in a background nobody will print. The site's
one governing rule — accent lands on the surface's primary noun, and only there —
survives verbatim; only its carrier changes from hue to value, because value is
the axis that a photocopier, a 200dpi ATS scan, and a low-toner laser all
preserve and hue is the axis they all destroy. The lime is not diluted, darkened,
or approximated: it appears twice, at full strength, as a fill with `#0B0F0A` on
top of it at 16.40 : 1 — the identical ratio the site reports for accent on
canvas, because it is the identical pair, read from the other side. And it lands
on the QR block, so the one moment the paper turns lime is the moment it hands
the reader back to andresilva.cc. Set entirely in JetBrains Mono, with hierarchy
built from ink value, scale, case, tracking, and 0.5pt hairlines rather than from
colour, the page is recognisably the same designer's work — square, terse,
document-shaped, no shadows, no fills doing structural work — without ever
pretending that paper is a screen.

---

## Sources checked

Font facts were verified rather than assumed:

- [JetBrains Mono — Fontsource](https://fontsource.org/fonts/jetbrains-mono) — eight weights 100–800, italic axis present.
- [JetBrains Mono glyph structure — DeepWiki](https://deepwiki.com/JetBrains/JetBrainsMono/2.1-glyph-structure) — fixed 600-unit advance width; maximised lowercase height at standard character width.
- [JetBrains Mono — jetbrains.com/lp/mono](https://www.jetbrains.com/lp/mono/) — increased letter height design brief (note: its "5 weights" figure is stale).
- [VT323 — Google Fonts](https://fonts.google.com/specimen/VT323) and [VT323 — Font Squirrel](https://www.fontsquirrel.com/fonts/vt323) — single 400 weight; built by auto-tracing a Python-generated monochrome PNG pixel grid in FontForge, emulating the VT320 CRT's horizontal beam smear; distributed as scalable TTF/OTF.
- [VT323 character set — cufonfonts](https://www.cufonfonts.com/font/vt323) — 209 glyphs: Basic Latin, Latin-1 Supplement, Mathematical Operators, Box Drawing, Block Elements. No Latin Extended-A.

Contrast ratios and greyscale values in §1 were computed from the WCAG 2.x
relative-luminance formula and Rec. 601 luma respectively, not sampled from a
tool.

---

# 5. Single-column density proposal

> Layout and density only. The §1 palette ships unchanged. This section revises
> four values in §3 and supersedes nothing else.

## 5.0 Verdict, up front

**A single-column layout is the right format, and it gets to 809pt against 780pt
of printable page. It does not reach one page on its own — it is ~29pt over,
which is between two and three bullet lines.**

Single column is worth doing regardless of the page count: it is the only format
that keeps default-mode `pdftotext` linear, and it cuts the body from 37 rendered
bullet lines to 25 without touching a word of André's copy. That is a 146pt
reduction from line-length economics alone.

The last 29pt cannot be found in layout. I am not closing it by dropping below
9pt body, because §1's entire ink ramp is built on the assumption that this
document gets photocopied and scanned — shrinking the type to win the page count
undoes the reasoning the palette was built on. §5.5 names the three specific
bullets to cut instead. Cutting three lands one page with 13pt of slack.

If André cuts nothing, §5.7 has the honest fallback.

---

## 5.1 The governing insight

The 68ch summary cap and the 8pt technologies floor from §3 were both consequences
of narrow columns. Both are renegotiable — but not for the same reason, and not by
the same amount, so it is worth being precise about what a measure limit is
actually protecting.

**Measure limits exist to protect the return sweep** — the eye's jump from the end
of one line to the start of the next, which is where line-skipping and re-reading
errors happen. A text block that occupies exactly one line has no return sweep.
The classical 65–75ch ceiling therefore does not apply to single-line items at
all; it applies to the summary paragraph, and to bullets long enough to wrap.

This is what makes full-width single column safe rather than reckless. At a
96-character measure, **24 of André's 25 bullet lines are single-line items** —
the measure is wide precisely to the degree that it eliminates the return sweep
rather than lengthening it. The one bullet that still wraps is the one flagged for
trimming in §5.5.

The summary is the opposite case: five sentences of genuine running prose with
seven return sweeps. It gets a cap, and the cap is defended in §5.6.

---

## 5.2 The layout

Single column, full width, DOM order = reading order = extraction order.

**Structural compaction (no prose touched):**

1. **Role, employer, and dates collapse onto one line.** Currently the dates are a
   separate `<p>` costing `2pt + 11.2pt + 4pt` per job. Inline, they cost nothing:
   `Senior Engineer @ MPA (formerly Healthy Labs) · Apr 2025 – Present`. Saves
   17.2pt × 6 = **103pt**.
2. **Technologies becomes inline wrapped text**, not a two-column grid. 29 items,
   202 characters of names plus 28 `·` separators = 286 characters, which sets in
   3 lines at 8pt. The grid form was 15 rows.
3. **Education entries** collapse the same way as jobs: institution + dates on one
   line, detail beneath.
4. **The QR moves to the header's top-right** and costs **0pt of page height**. It
   is a pure-vector graphic with no text content, so it is invisible to
   `pdftotext` and cannot interleave anything, and at 60pt it fits inside the
   62pt name/role/contact stack it now sits beside. It also lands directly
   opposite the `andresilva.cc` contact line it encodes, which reads better than
   the orphaned bottom-right placement.
5. **Margins 14mm → 11mm.** Gains 17pt of height and widens the measure from 93 to
   96 characters, which is what pulls one more bullet onto a single line. 11mm is
   still clear of the 4–6mm unprintable margin on consumer and office lasers.

**Separator note.** The `·` in both the job header line and the technologies list
is correct per the site's established rule: the middle dot joins fragments *within
one field value* rendered in one element (as in the About page's
`agentic workflows · user-facing AI · developer tooling` and the article-card meta
strip), and is not used between sibling destinations. Role, employer, and dates
are fragments of one statement about one job. Technologies is one field.

**Why the dates are inline rather than right-aligned on a rail.** A right-aligned
date rail is visually cleaner and I would normally specify it. I am not, because
6 job rows plus 2 education rows with a consistent ~100pt whitespace gap and a
consistent right-hand text band is *precisely* the signature Poppler's default
block-detection heuristic looks for — the same heuristic that was verified to
break every two-column construction tried. The inline form has no gap, no band,
and no heuristic to trip. If someone wants the rail, it is a testable change:
render it, run default-mode `pdftotext`, and confirm the dates stay on the job's
line. Until that test passes, inline is the default.

---

## 5.3 Height budget

A4 = 841.89pt tall × 595.28pt wide. At 11mm (31.18pt) margins:
**printable height 779.53pt, column width 532.9pt.**

At 9pt, JetBrains Mono advances 5.4pt/character (600 design units). Column width
532.9pt − 11.7pt bullet indent = 521.2pt ÷ 5.4 = **96 characters per line.**

### Bullet line counts at 96ch

Character counts are of André's actual strings, unmodified.

| Role | Bullet lengths (chars) | Lines |
|---|---|---|
| Senior Engineer @ MPA | 78, 89, 50, 63 | 4 |
| Senior Front-end Engineer @ Atlas | 70, 37, 34, 56, 68 | 5 |
| Front-end Engineering Consultant @ Atlas | 63, 43, 89, 59 | 4 |
| Front-end Engineer @ Atlas | 96, 52, 51, 47 | 4 |
| CEO & Co-Founder @ Nuxstep | 60, 58, 74 | 3 |
| Software Development Intern @ Gmaes | 93, **99**, 76, 62 | 5 |
| **Total** | **24 bullets** | **25 lines** |

Only one bullet (99 chars) still wraps. The current two-column build renders the
same 24 bullets as **37 lines** with 13 wrapping. The format change alone removes
12 lines.

### Budget

| Block | Computation | pt |
|---|---|---|
| Name | 24pt × 1.05 | 25.20 |
| Role line | 2 + (13 × 1.20) | 17.60 |
| Contact row | 8 + (8 × 1.40) | 19.20 |
| Summary | 10 + (7 lines × 9 × 1.45) | 101.35 |
| QR (header top-right, 60pt) | fits inside the 62pt stack | 0.00 |
| *gap* | | 10.00 |
| **EXPERIENCE** head | (10.5 × 1.25) + 2 + 0.5 + 6 | 21.63 |
| 6 job header lines | 6 × ((9.5 × 1.30) + 3) | 92.10 |
| 25 bullet lines | 25 × (9 × 1.35) | 303.75 |
| 18 bullet gaps | 18 × 2 | 36.00 |
| 5 inter-job gaps | 5 × 6 | 30.00 |
| *gap* | | 10.00 |
| **EDUCATION** head | | 21.63 |
| 2 entries | 2 × ((9.5 × 1.30) + (9 × 1.35)) | 49.00 |
| 1 entry gap | | 6.00 |
| *gap* | | 10.00 |
| **TECHNOLOGIES** head | | 21.63 |
| Inline list | 3 lines × (8 × 1.40) | 33.60 |
| | **TOTAL** | **808.69** |
| | **Available** | **779.53** |
| | **Over by** | **29.16** |

For reference, the same content in the shipped two-column build measures ~966pt
(header 197 + Experience column 770). The proposal removes 157pt.

### What it would take to fit with zero cuts

- **Margins alone:** needs 841.89 − 808.69 = 33.2pt total, i.e. **5.9mm per side**.
  That is inside the unprintable margin on most office lasers — the page would
  clip or auto-scale. Not viable.
- **Type alone:** 9pt → 8.5pt body recovers ~17pt, still short, and breaks the
  floor. Rejected in §5.6.

---

## 5.4 Where the 29pt comes from

Three whole-bullet cuts, chosen because each is either a duplicate, a wrapping
outlier, or the lowest-signal line in its block. **These are deletions, not
rewrites** — no sentence of André's gets reworded.

Each cut bullet saves one line plus its item gap: **14.15pt.**

| # | Cut | Why | Saves |
|---|---|---|---|
| 1 | **Atlas Consultant** — "Analyzed and developed project improvements" | The weakest bullet on the page: generic, unmeasured, and boxed in by three specific siblings (mentoring, a Lerna component library, the Nuxt migration). | 14.15pt |
| 2 | **Atlas Senior FE** — "Migrated pages to a Nuxt 3 project" *or* **Atlas Consultant** — "Contributed to the migration of key pages to a Nuxt project" | Near-duplicates across two consecutive roles at the same employer. Keeping both reads as padding, not as range. Keep the Consultant one — it is the more specific of the two. | 14.15pt |
| 3 | **Atlas FE** — "Tracked and organized tasks in Jira using Scrum" | Table stakes in 2026; the lowest-signal line on the page and the only one that describes process rather than output. | 14.15pt |

**Three cuts = 42.45pt → 766.24pt against 779.53pt available. One page, 13.3pt of
slack.**

Two cuts lands at 780.39pt — 0.9pt over. That is not a fit; it is a coin flip on
font-metric rounding, and no print workflow should ship on it. **Cut three.**

If a different third bullet is preferred, the only requirement is that it saves a
full line. The one remaining candidate with a structural argument is the Gmaes
CONFEA bullet (99 chars, the single bullet that still wraps): deleting the
parenthetical `(CONFEA)` drops it to 90 characters and one line for 12.15pt. That
is technically a copy edit rather than a deletion, so it is listed last — but it
is the smallest possible edit that buys a line.

---

## 5.5 Questions posed, answered

**Does every section need equal typographic weight?** Yes — keep all three section
heads identical. Demoting Education and Technologies saves ~10pt each and costs
more than it returns: ATS section detection keys on those heading strings, and
inconsistent treatment risks one being skipped; and the section head is the one
composed component this document has (the collapsed eyebrow from §2), so breaking
two of its three instances breaks the component. 20pt does not change the verdict
anyway — cuts are still needed.

**Is the 8pt technologies floor renegotiable?** It is no longer *forced* — the
70pt sidebar column that forced it is gone — but it stays at 8pt, now by choice.
At 9pt the inline list runs 4 lines instead of 3 (+18.6pt) for a keyword index
that nobody reads linearly and that ATS extracts from the text layer regardless.
8pt/500 in `ink-body` is 11.96:1, inside every floor in §1. The constraint is the
same; the reason changed.

**Is the 68ch summary cap renegotiable?** Partly. See §5.6.

---

## 5.6 What I am not doing, and why

**Body stays at 9pt.** §1 sets the entire ink ramp on the premise that this
document gets photocopied, scanned at ~200dpi by an ATS pipeline, and printed at
low toner — that premise is why `ink-body` sits at 11.96:1 instead of mirroring
the site's 7.92:1. Sub-9pt monospace is where stroke dropout starts under exactly
those conditions. Shrinking the type to win a page count would invalidate the
reasoning the palette was built on. 8.5pt would recover ~17pt and still leave the
page 12pt over, so it does not even work.

**Summary leading stays at 1.45.** It is the only sustained-reading passage on the
page.

**Bullet leading drops to 1.35** — and this is not a quiet abandonment of the §3
floor, it is applying that floor correctly. §3's stated reason for 1.45 was that
"monospace needs marginally more leading than a proportional face because the
uniform rhythm makes line-tracking harder." Line-tracking is a return-sweep
problem. In this layout 24 of 25 bullet lines are single-line items with no return
sweep, each separated by its own 2pt item gap. The rationale does not apply to
them. It does apply to the summary, which keeps 1.45.

**Summary measure goes 68ch → 80ch, not to the full 96ch.** 80ch is the widest
measure I will defend for five sentences of running prose. Going to the full
column measure would buy exactly one more line (13pt) and would push the only
return-sweep-heavy block on the page past 95 characters. That is the one place
where the density push would cost real readability, so it does not happen. The
move from 68ch is justified: 68ch was chosen to relate the summary to a 63-char
main column that no longer exists.

---

## 5.7 If André cuts nothing

Then it is two pages, and that is an acceptable outcome — but make it *deliberately*
two pages rather than an overflow:

- Page 1: header, Experience through the Nuxstep role.
- Page 2: the Gmaes role, Education, Technologies.
- Keep `break-inside: avoid` on job blocks so no role splits across the fold.

Single column is still the right format in this case. The layout change fixes the
actual problem André raised — `pdftotext` reading order — independently of page
count, and a clean 2-page single-column resume extracts correctly where the
current 1.3-page two-column one does not.

Do not solve this by deleting the summary paragraph to save 101pt. It is the block
a human reader actually reads.

---

## 5.8 Deltas to §3

Four values change. Everything else in §3 — the face, the four weights, the
no-italic rule, the tracking values, the section-head derivation — stands.

| §3 value | Was | Now | Reason |
|---|---|---|---|
| `p-display` size | 30pt | **24pt** | 30pt was sized against a 4× body ratio borrowed from the screen scale. On a one-page document at this density it is disproportionate; 24pt is still 2.7× body and unambiguously dominant. |
| Summary measure | 68ch | **80ch** | 68ch related the summary to a 63-char main column that the single-column layout removes. 80ch is the defended ceiling for running prose. |
| Bullet leading | 1.45 | **1.35** | The 1.45 rationale is a return-sweep argument; single-line bullets have no return sweep. Summary keeps 1.45. |
| Technologies list | 2-col grid, 8pt | **inline wrapped, 8pt** | Same size, different justification — see §5.5. |

Palette: **unchanged.** All six tokens ship as specified in §1.
