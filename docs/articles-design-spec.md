# Articles — Design spec

> Visual + interaction spec for `/articles/[slug]` — the article *reading* surface. Where the existing `/articles` index design ends (cards) is where this document begins (the body). Read alongside [`docs/design-system.md`](./design-system.md) for tokens and components, and [`docs/articles-decision-log.md`](./articles-decision-log.md) for the data contract.
>
> This document covers three deliverables in one file:
>
> - **§1–§9** — Article page layout, header, cover art, prose styles, footer, edge cases, responsive, motion.
> - **§10** — Custom Shiki theme spec (token-to-scope mapping).
> - **§11** — OG image visual brief.
>
> Tokens referenced throughout are the Tailwind v4 `@theme` names from `globals.css` (`text-fg`, `bg-canvas`, `max-w-prose-wide`, etc.). The canon token equivalents live in `docs/design-system.md`.

---

## 1. Page composition

### 1.1 The shell and where the article slots in

The article page is a route inside the `(site)` group, so it inherits the shared shell verbatim from `docs/ui-spec.md` §"Shared shell": skip link, `.shell` (max-width 1240px, 32px horizontal padding), `Header`, `<main id="main">`, `Footer`. The article body lives in `<main>` like every other route. No new layout primitive.

There is **no `<PageHead>`** on this page. The brace-head pattern (`<ARTICLE_NAME />`) is reserved for the five inner pages whose name is a noun-category (`<ABOUT />`, `<CAREER />`, `<NOT_FOUND />`). An article's identity is its title — typesetting that title in the brace pattern would (a) wrap awkwardly at any non-trivial length, (b) force-uppercase the title, and (c) implicitly demote real titles to abstract category labels. The article gets its own h1 in VT323 (see §2), and the **back to articles** affordance restores the orientation that `<PageHead>` would otherwise provide.

### 1.2 Vertical order

```
┌── Header (shared) ──────────────────────────────────────────────────────┐
│                                                                         │
│  «back to articles»                ← orienting backlink                 │
│                                                                         │
│  // article · 2024.08.14 · 6 min   ← eyebrow + meta strip               │
│                                                                         │
│  How I Achieved a 74%               ← h1 (VT323, accent on title)       │
│  Performance Increase on a Page                                         │
│                                                                         │
│  Tracking down the long-tail of     ← summary / lede (optional)         │
│  slow renders…                                                          │
│  ─────────────────────────────                                          │
│                                                                         │
│  ┌──────────────────────────────┐                                       │
│  │                              │   ← cover art (optional, banded)      │
│  │     stipple-art motif        │                                       │
│  │                              │                                       │
│  └──────────────────────────────┘                                       │
│                                                                         │
│  ─────────────────────────────                                          │
│                                                                         │
│  Body prose                         ← MDX-rendered article body         │
│  Body prose continues for many                                          │
│  paragraphs at --max-width-prose-wide                                   │
│  …                                                                      │
│  ─────────────────────────────                                          │
│                                                                         │
│  Tags: [react] [performance]        ← chip strip                        │
│                                                                         │
│  ── Also on dev.to → ─────────      ← syndication callout (optional)    │
│                                                                         │
│  ── ↑ back to articles ──────       ← terminal backlink                 │
│                                                                         │
└── Footer (shared) ──────────────────────────────────────────────────────┘
```

Order, with rationale per slot:

1. **Orienting backlink** — `← back to articles`, an `<ArrowLink>` rotated for direction (see §3.2). Top of `<main>`, above the meta strip. Replaces the role `<PageHead>` plays elsewhere (telling the reader *where in the site they are*). Without it, the reader lands inside an article with no visible nav-anchor beyond the header bar.
2. **Eyebrow + meta strip** — one line. `// article` eyebrow on the left, `publishedAt · readingTime · tags` on the right (or stacked below at mobile, see §7). Mirrors the `// 01 / current focus` pattern from sectional eyebrows on Home, but the second clause replaces the section number with the date/duration. Reading-time and date sit *here*, not in the footer — the reader makes the "should I invest the next N minutes" decision before they start reading, not after.
3. **Title (h1)** — VT323 display face, large. Accent color applied to the **first sentence-cased line of the title**, not just one word (see §2.1 for why). Wraps to 1–3 lines.
4. **Summary / lede** — the `summary` field rendered as a single de-emphasized paragraph in `text-fg-muted`, capped at `max-w-prose-wide`. Same prose the OG card uses and that the dev.to mirror uses as its excerpt. Optional only insofar as `summary` is *required* in frontmatter — every article will have one.
5. **1px `border-rule` hairline** — separates the head block from the body. The brutalist-mono pattern uses hairlines as structure; this is where one earns its keep.
6. **Cover art** — optional. Renders only when `article.coverArt` is set. Full content-width banded slot (see §3). Sits *above* body prose and *below* the title, so the visual lands as part of the head identity, not as a body illustration. (Rationale: putting it above the title pushes the title below the fold on smaller laptops; putting it inside the prose makes it compete with the article's own images.)
7. **1px `border-rule` hairline** — separates cover art from body. Omitted when there is no cover art (the head→body hairline above already serves).
8. **Body prose** — MDX-compiled article content, with the prose styles spec'd in §4. Capped at `max-w-prose-wide` (68ch).
9. **Tags chip strip** — the same `<Tag>` chips the article-card uses. They live *here* (not in the head meta strip) because (a) the head's `tags` segment is a compact textual list, designed for scanning; (b) the chip strip is a fuller commitment of vertical space that pairs with the "this article is over, what was it about?" moment.
10. **Syndication callout** — `Also on dev.to →` as a quiet `<ArrowLink>`, prefixed by a short `//` comment-tag, on a line of its own. Only renders when `devtoUrl` is set. See §5.
11. **Terminal backlink** — `↑ back to articles`. Last interactive element on the page before the footer. Catches the reader at end-of-read and points them to "another one of these," which is the only sensible next-action.

The two backlinks at top and bottom are intentional and not duplicates: one is a wayfinding affordance available *before* the reader commits, the other is a continuation affordance offered *after* they finish.

### 1.3 Container widths

| Block | Width token | Why |
|---|---|---|
| Backlink, eyebrow + meta, title, summary, body prose, tags, syndication callout, terminal backlink | `max-w-prose-wide` (68ch) | Long-form prose needs a comfortable mono read measure. JetBrains Mono at 14px lands ~9px per character; 68ch ≈ 612px — within the optimal 45–75 character read-comfort window for monospace. |
| Cover art slot | `max-w-prose-wide` (68ch) | Aligns the art's left edge with the prose. A wider art breaks the column and reads as a separate composition; a narrower one floats orphaned. |
| Code blocks | `max-w-prose-wide` + horizontal overflow (`overflow-x-auto`) | Code does not wrap. Long lines scroll horizontally inside the prose column; the column edges stay aligned with the rest of the body. See §4.7. |
| Tables | `max-w-prose-wide` + horizontal overflow | Same — tables that exceed the column scroll inside it rather than break the page rhythm. |
| Wide figures (full-bleed images) | `max-w-shell` permitted via an `<ImageMdx wide>` opt-in | Most images sit at `max-w-prose-wide`. The rare diagram or screenshot that needs the room can opt into the shell-width container; this is a follow-up, not a v1 deliverable. **For v1: all images cap at `max-w-prose-wide`.** |

**On the choice of `prose-wide` (68ch) over `prose-bio` (60ch) or `prose-narrow` (56ch):** The About bio sits at 60ch because it is a *block of identity prose* meant to feel intimate. The hero pitch sits at 56ch because it is *one short statement*. An article is long-form narrative that the reader scans paragraph-by-paragraph — which is exactly the role `--prose-w` (68ch) was defined for, in standing rule 15. Career bullet paragraphs and the home "Now" paragraph already use it. Narrowing the article body to 60ch would make code blocks (which can't soft-wrap) feel pinched, and would push the article into a smaller percentage of the viewport than the index cards beneath it. 68ch is the right answer.

### 1.4 Vertical rhythm

Between blocks in the head:

| From → To | Gap | Notes |
|---|---|---|
| Header bottom rule → Backlink | `py-8` (32px) like other page tops | Same as `PageHead`'s `pt-12` *minus* the visible h1 weight — backlink is lighter, so 32px instead of 48px. |
| Backlink → Eyebrow+meta | `mt-8` (32px) | Section-band rhythm. |
| Eyebrow+meta → Title | `mt-3` (12px) | Eyebrow is a label for the title; gap stays tight, matching `<SectionHead>` internal spacing. |
| Title → Summary | `mt-4` (16px) | A grown-up gap, but not band-sized — summary is a continuation of the head, not its own section. |
| Summary → hairline → Cover art | `mt-8` above hairline, `mt-8` below (32px each) | Banded rhythm; hairline owns the seam. |
| Cover art → hairline → Body | `mt-8` above hairline, `mt-8` below | Same. |
| Body → Tags | `mt-12` (48px) | Larger gap signals end-of-prose. |
| Tags → Syndication callout | `mt-6` (24px) | Group these — they are both "this article in context" affordances. |
| Syndication → Terminal backlink | `mt-8` (32px) | Lighter "you are done" close. |
| Terminal backlink → Footer top rule | `pb-12` (48px) | Generous tail, matching the page-top opener. |

These numbers are deliberate, not arbitrary. The pattern: tight gaps inside a logical group (eyebrow→title, tags→syndication), band gaps between groups (head→art→body), generous gaps at start and end (`pt-8` top, `pb-12` bottom).

---

## 2. Title and meta header

### 2.1 The title

- **Element**: `<h1>` (the page's only h1).
- **Component**: `<Text variant="h1">` *or* `<Text variant="display">`, depending on the article length tier (see below).
- **Face**: VT323 — the design system's display face, used in `PageHead` titles and the home hero name. The article title is the same kind of identity moment.
- **Size — two-tier**:
  - **Default tier**: VT323 at 40px (between `--text-h1` 28px and `--text-display` 56px, but using the existing `--text-h1` token at a custom scale is *not* permitted because no such token exists). Therefore: use the **`--text-display` (56px) token** for short titles (≤ 40 characters), and the **`--text-h1` (28px) token** for medium-to-long titles (41–80 characters). This is a binary choice driven by character count, applied at build time via a class branch — no extra tokens needed.
  - Articles longer than 80 chars: still use `--text-h1` 28px. The system *never* synthesizes new sizes; it picks between the two existing display sizes based on length.
- **Weight**: VT323 ships at 400; no override.
- **Line-height**: tied to the token (1.10 for both `--text-display` and `--text-h1`).
- **Color**: the title noun pattern from `PageHead` does not apply — there is no single noun to highlight. Instead:
  - **Whole title in `text-accent`** (`--color-accent`, `#C8FF3D`).
  - VT323 at high contrast on canvas — the accent is the system's identity color and lands here for the same reason the company name lands on Career and the project name lands on Projects: it is the surface's primary noun. Standing rule 01 is satisfied.
- **Brace decoration**: **no** `<X />` braces. The title is the title — VT323 + accent is already the typographic identity moment. Wrapping the title in braces would (a) compete with the eyebrow's `// article` comment-tag for "this is a typographic affordance, not content," (b) force a uniform brace-frame around prose-shaped text that doesn't read as a JSX-tag identifier, and (c) consume horizontal width the title's own characters need.
- **Curly quotes**: titles use `U+2018`/`U+2019` for apostrophes and `U+201C`/`U+201D` for double quotes (standing rule 09). Authored straight in MDX, transformed at parse via remark's smartypants (the `remark-gfm` pipeline already does this).

### 2.2 The eyebrow + meta strip

A single `<div>` that arranges two clusters horizontally on desktop, stacks them at mobile:

```
<div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
  <Eyebrow>// article</Eyebrow>
  <Text variant="meta" as="span" class="inline-flex flex-wrap items-baseline gap-2 text-fg-subtle">
    <time datetime="2024-08-14" class="text-fg-muted">2024.08.14</time>
    <span aria-hidden="true">·</span>
    <span>6 min</span>
    <span aria-hidden="true">·</span>
    <span>react · performance · profiling</span>
  </Text>
</div>
```

- **Eyebrow**: `<Eyebrow>// article</Eyebrow>`. Identical to the section eyebrows on every other page, except the second clause says `article` instead of `01 / current focus`. The slash is omitted because there is no numbering on a one-section page; following the standing convention from sectional pages with a single content section.
- **Date**: ISO-formatted lowercase as `YYYY.MM.DD` (matches `formatArticleDate` already used on article cards). Wrapped in a `<time datetime="ISO">` element for machine readability. Elevated to `text-fg-muted` so the date — the primary scannable metadata — stands proud of the comments-style subtle text around it.
- **Reading time**: `${n} min` (singular even at 1 minute — copy convention from cards). `text-fg-subtle` like the rest.
- **Tag list (textual, not chips)**: tags joined by ` · ` separators, brand-cased the way they ship in frontmatter. **This is the only place tags appear textually.** The chip strip at page foot uses the `<Tag>` component. Reason: the head meta strip is dense single-line scannable; chips here would inflate the strip and steal visual weight from the title. Tags do not link anywhere — there is no tag-archive route in v1.
- **Updated date** (when set): appended as a second `<Text variant="meta">` line *below* the meta strip, italicized and in `text-fg-subtle`: `// last updated 2024.09.02`. The `//` comment-tag prefix marks it as ambient metadata, not first-class content. The updated date is **never** substituted in place of `publishedAt`; both surfaces stay.

### 2.3 The summary / lede

- One paragraph (`<p>`), `<Text variant="body">`.
- **Color**: `text-fg-muted` — a step down from body prose, signaling that this is a precis, not the start of the article. The body prose itself opens at `text-fg`.
- **Width**: capped at `max-w-prose-wide`.
- **Font weight**: 400 (the default for `<Text variant="body">`).
- **No quotes**, no italics, no eyebrow framing. The summary just is the summary.

---

## 3. Cover art slot

### 3.1 Where it lives

Below the head's hairline, above the body's hairline. Within the `max-w-prose-wide` column.

```html
<section aria-label="Cover art">
  <div class="border border-rule bg-canvas overflow-hidden" style="aspect-ratio: 16 / 7;">
    <StippleArt config={article.coverArt.params} />
  </div>
</section>
```

### 3.2 Dimensions

- **Desktop**: aspect-ratio `16 / 7` (a wide cinematic band, ~290 px tall at 660 px wide). This is wider than the article-card's `240/144` (≈ `5/3`) on purpose — the article page has more vertical room to spare and a generous band reads as a page-level identity moment, where the index card's `5/3` reads as a thumbnail.
- **Tablet/narrow desktop** (760–1024px): same `16 / 7`.
- **Mobile** (≤ 640px): `4 / 3` (squarer). The 16:7 band collapses to barely 100px tall at narrow widths and the stipple field loses its character. 4:3 is the article-card's mobile aspect-ratio (`240/180`) and lands the same way here.

### 3.3 Container

- `border border-rule` — 1px hairline, matching the article-card illustration container.
- `bg-canvas` — **not** `bg-surface`. Stipple art is transparent ASCII glyphs; the container fill *is* the perceived background. Canvas keeps the art reading against the page void. This matches the explicit rule in `docs/ui-spec.md` §"Articles" for the card-version of the same component.
- `overflow-hidden` — the embed's grid is derived from the container, so clipping is belt-and-braces.
- No padding inside the border; the art fills the box edge-to-edge.

### 3.4 Component

The same `<stipple-art>` web component (`src/components/stipple-art.tsx`) used in the article card and the home hero. `config` is passed verbatim from `article.coverArt.params`. The `preset` field is decorative-only — it's already embedded as `p=...` inside `params`.

### 3.5 Animation

The stipple field animates on a fixed loop. `prefers-reduced-motion: reduce` causes a single static frame to render (the component already honors this). No additional gating from this design — inherits the component's existing motion contract.

### 3.6 When `coverArt` is null/absent

The cover art section is **omitted entirely**, including its containing hairlines. The vertical order becomes: head → 1px hairline → body. The page does not synthesize a placeholder, an illustration of "no art," or a wider summary block. The hairline-and-body sequence is sufficient. (Both migrated articles ship with `coverArt`, so this branch will be rare initially — but it is a real branch the engineer must implement.)

### 3.7 What the cover art is *not*

- Not a hero. The title is the hero.
- Not a thumbnail. The card on `/articles` already plays that role, at smaller dimensions and 5:3.
- Not a clickable region. There is no link affordance attached to the cover art — it is decorative, `aria-hidden="true"` on the container's outer element (the wrapping `<section>` has `aria-label="Cover art"` so the section landmark itself is announced, but the visual is not given alt-text — it has no semantic content beyond "set decoration matching the article subject").

---

## 4. Prose styles

The MDX renderer maps standard HTML elements (`h1`–`h6`, `p`, `ul`, `ol`, `blockquote`, etc.) onto styled defaults. This section is the spec for each.

The container for all article body content is a `<div class="article-prose">` (or equivalent) with `max-w-prose-wide` applied at the outer block. **Tailwind's `prose` plugin is not used** — it carries opinions about spacing, font-stack (serif), and link styling that fight the design system. The article-prose styles are bespoke and live as a small set of scoped rules.

### 4.1 Headings inside body (h2 → h4)

The article body **does not use h1** — the page h1 is the article title itself. Markdown `#` at the top of a body would collide. Authors author body sections with `##` (h2), `###` (h3), etc.

| Element | Token | Face / Weight | Color | Top margin | Bottom margin |
|---|---|---|---|---|---|
| `h2` | `text-h2` (18px / 1.30) | JetBrains Mono / 600 | `text-fg` | `mt-12` (48px) | `mt-4` (16px) before next block |
| `h3` | `text-h3` (16px / 1.30) | JetBrains Mono / 600 | `text-fg` | `mt-8` (32px) | `mt-3` (12px) |
| `h4` | `text-body` (14px / 1.65) | JetBrains Mono / 600 (the body face at body size, but bolder than its surroundings) | `text-fg` | `mt-6` (24px) | `mt-2` (8px) |

No h5/h6 in v1. If a post needs deeper nesting, the post needs restructuring.

**No leading hash glyph, no `//` comment-tag eyebrow on body headings.** Those affordances belong to navigational chrome (eyebrows, brace heads); applying them to article-body headings would read as the article *quoting* the site, not authoring inside it.

Headings get `id` attributes auto-generated by the MDX pipeline (slugified) for in-page deep linking and the future TOC. No visible anchor link icon on hover in v1; deep-link by copying URL+`#id`.

### 4.2 Body paragraphs

- `<Text variant="body">` equivalent: `font-mono`, `text-body` (14px / 1.65).
- **Color**: `text-fg` for primary prose (note: muted on the *summary* in the head, but full-strength inside the body).
- **Top margin**: `mt-4` (16px) between consecutive paragraphs. **First paragraph** in body has no top margin (the hairline above carries the seam).
- **Bottom margin**: zero; spacing owned by the next element's top.

### 4.3 Inline text — strong, em, inline `code`

- **`<strong>`**: `text-fg`, `font-semibold` (600). Already the global `@layer base` style in `globals.css`. Used for emphasis nouns, magnitudes (`74% increase`), and the same patterns the rest of the site uses inside prose.
- **`<em>`**: `italic` (browser default), no color change. Italic JetBrains Mono is a real cut (the font has true italics, not synthesized).
- **Inline `<code>`** (Markdown `` ` ``): `font-mono` (no-op since the whole site is mono — but it costs nothing to declare), `text-fg`, `bg-surface` (a hair lighter than canvas), `border border-rule`, `px-1 py-0` (2px vertical, 4px horizontal), `text-[0.9em]` (a hair smaller so the border doesn't make it loom above the line). No syntax highlighting on inline code (it's typically a single identifier — Shiki on one-token strings is wasted CPU and ugly).

### 4.4 Inline links inside body prose

Reuse `<InlineLink>` verbatim. The MDX components map binds `a` → `<InlineLink>`:

- Default `text-fg`, hover lifts to `text-accent` with a 1px underline at 3px offset.
- External links auto-apply `target="_blank" rel="noopener noreferrer"`.
- No special "external" icon affixed — the underline-on-hover plus the standing convention is enough.

Internal links (relative paths or `https://andresilva.cc/*`) open in the same tab.

### 4.5 Lists — `<ul>`, `<ol>`, nested

- **`<ul>`**: `list-none` (no disc marker). Each `<li>` carries a leading **`+` glyph** in `text-accent` (same pattern as career bullets — `.role__bullets` in the design system). The glyph is rendered via CSS `::before` content: `+` with `mr-2` spacing, *not* as authored text in the MDX. This keeps the markdown source clean.
- **`<ol>`**: `list-none` too. The number is rendered via CSS counter, formatted as `01.`, `02.`, `03.` (zero-padded to 2 digits — VT323-flavored numerics). `text-fg-subtle` color so the numbers don't compete with the prose. Padding via `pl-8` (32px) on the `<ol>`; counter rendered at the left edge.
- **Nested lists**: indent by `pl-6` (24px). The same `+` or counter pattern applies at the next level. Visual hierarchy by indent only — no different glyph shape per level. (Mixed ul-inside-ol or ol-inside-ul: the child's glyph follows the child's element type — `+` for nested ul under ol, etc.)
- **Spacing**: `<li>` to `<li>`: `mt-2` (8px). List to surrounding prose: `mt-4 mb-4` (16px each, treated as a block).
- **Item content**: a list item is itself a paragraph; the same body-prose styles apply. Inline `<strong>` and `<em>` work inside `<li>` exactly as in `<p>`.

### 4.6 Blockquotes

- **Element**: `<blockquote>`.
- **Container**: `border-l-2 border-accent-muted pl-4 my-6`.
- **Text**: `text-fg-muted italic` — the muted color signals "this is not in André's voice." Italic adds a typographic hand on top.
- **Nested paragraph spacing**: same `mt-4` between paragraphs as body prose, but the whole block sits inside the muted treatment.
- **Citations**: if the blockquote ends with an `— Name` line, the author can mark it `<cite>`. Style: `block mt-2 text-fg-subtle not-italic`. Optional — many quotes won't carry one.

The left rule is the brutalist-mono structural vocabulary; it's the same hairline the section bands use, just rotated 90° and accent-muted instead of `rule`.

### 4.7 Code blocks

This is heavy real estate in a developer's article. The treatment must read as *part of the page*, not as a transplanted IDE pane.

```
┌────────────────────────────────────────────────┐
│ ts                                         ↗   │   ← optional language label, no copy button v1
├────────────────────────────────────────────────┤
│                                                │
│  const foo = 'bar';                            │
│  function baz(): number {                      │
│    return 42;                                  │
│  }                                             │
│                                                │
└────────────────────────────────────────────────┘
```

**Container** (`<pre>`):

- `border border-rule` — the same 1px hairline used everywhere.
- `bg-surface` — one step lighter than canvas, gives the block presence without making it feel like a separate card. Tinted-not-floored.
- `overflow-x-auto` — long lines scroll horizontally inside the prose column. No soft wrap. Scrollbar is themed via the global scrollbar styles already in `globals.css`.
- **Padding**: `py-4 px-5` (16px / 20px). Slightly more horizontal than vertical so the leading character has room from the rule but lines aren't pushed too far from the top edge.
- **Margin**: `my-6` (24px above and below).
- **Width**: `max-w-prose-wide`. Code does not get a wider container in v1.
- **No radius**: square corners, like everything else.
- **No box-shadow**.

**Language label**: When the fence carries a language (`​```ts`, `​```bash`), render the lang token in the top-right corner of the code block, *outside* the `<pre>` border:

- A small header strip *above* the `<pre>`: `border border-rule border-b-0`, `bg-surface`, `px-5 py-1.5`, with the language label inside.
- Label typography: `text-micro font-mono font-semibold uppercase tracking-eyebrow text-fg-subtle`. Same recipe as the eyebrow comment-tags.
- When the fence has no language, the header strip is omitted; the code block stands alone.
- Visually this creates a two-cell vertical sandwich: header strip (1px borders on top/left/right), `<pre>` (1px borders on all sides — top edge will overlap with header bottom, that's fine; CSS `margin-top: -1px` on the `<pre>` collapses the doubled rule).

**No copy button in v1**. The "copy to clipboard" affordance is convenient but it is *also* the kind of pseudo-app-UI chrome the design system principles veto ("texture not affordance"; "app-UI chrome a portfolio doesn't need"). Modern browsers support text selection + cmd-C fine; readers who want the code can take it. Reconsider in a future revision if a real user need surfaces.

**No line numbers in v1**. Same rationale — they add visual noise. The reader who needs to reference "line 12" of an in-article code block has bigger orientation problems.

**Highlighted lines** (rehype-pretty-code supports `{1,3-5}` after the fence): see §4.7.1 below.

**Code content typography**:
- `font-mono`, `text-body` (14px / 1.65) — same as body. Code that's smaller than surrounding prose reads as a footnote; same-size reads as integral.
- `text-fg` as the default token color (Shiki overrides per token — see §10).
- Tab width: the rehype-pretty-code pipeline normalizes to 2 spaces. No `tab-size` CSS needed.

#### 4.7.1 Highlighted lines

rehype-pretty-code supports per-line emphasis via `data-highlighted-line` attributes. The treatment:

- **Container**: each highlighted line gets a `bg-accent-tint` background (the existing `rgba(200, 255, 61, 0.08)` wash used on CTA hovers).
- **Left rule**: 2px solid `border-l-2 border-accent` on the highlighted line, sitting *inside* the `<pre>`'s padding so the rule lands tight against the line's leading character. The line's `padding-left` is reduced by 2px to keep characters aligned with non-highlighted lines.
- **Multiple consecutive highlighted lines**: each gets its own background; the left rule is continuous (no gap between rules of adjacent highlights, since each line's rule abuts the next).
- **Accent here is intentional**: highlighted lines are the article author saying "look at this." That's the texture-not-affordance principle's *exception clause* — the highlight *is* the editorial signal. The accent is doing the work of emphasis, not "this is a button."

**Ship in v1**: yes. The feature is one rehype config option and the CSS is two rules. Worth shipping.

### 4.8 Tables

- **`<table>`**: `w-full max-w-prose-wide border-collapse my-6`.
- **`<thead>`**: `bg-surface`, `border-y border-rule`, `text-fg`. Header row is structurally distinct.
- **`<th>`**: `text-left px-4 py-2 text-meta font-semibold uppercase tracking-eyebrow text-fg-subtle`. Header cells use the eyebrow recipe — they are labels, not headlines.
- **`<tbody>`**: no zebra striping. Rules carry the row separation.
- **`<tr>`**: `border-b border-rule`. Last row drops its border (CSS `:last-child`).
- **`<td>`**: `px-4 py-2 text-body align-top`. Body color `text-fg-muted` (one step down from prose) — table data is meant to be scanned, not read prose-style; the muted color says "scan, don't dwell."
- **Alignment**: left-aligned by default. Numeric columns: author opts in via Markdown's `:--:` syntax, which rehype maps to `<td align="right">`; the renderer adds `text-right`.
- **Mobile behavior**: tables that exceed the prose column scroll horizontally inside the column. `overflow-x-auto` on a wrapping `<div>`; the `<table>` itself does not collapse to stacked rows. (Stacked-row "responsive tables" require knowing which column is the row identifier, which Markdown doesn't carry. Horizontal scroll is honest.)

### 4.9 Images and figures

The MDX components map binds `img` → `<ImageMdx>`, which wraps `next/image` and consumes Velite's emitted width/height.

- **Container**: `<figure class="my-6">`.
- **Image**: `block max-w-prose-wide w-full h-auto border border-rule`. The 1px hairline frames every article image — same vocabulary as the cover art slot, the code block, the article card.
- **Caption** (when MDX has `![alt](url "title")` — the title becomes the caption): `<figcaption class="mt-2 text-meta text-fg-subtle">`. Italic to differentiate from body text.
- **Alt text**: required. The MDX pipeline can warn (not fail) on missing alt; Velite's image schema requires it for production builds.
- **Hover behavior**: no grayscale-on-rest reveal-on-hover. The About portrait pattern is identity-photo specific. Article images are content illustrations — they ship in their natural color, full strength, no filter, no transition. Quiet.
- **Lazy loading**: `loading="lazy"` for any image below the fold (next/image's default for non-priority images). The cover art slot is *not* a `next/image` — it's the stipple component — so this rule applies to in-body images only.

### 4.10 Horizontal rules — `<hr>`

- Authored as `---` in MDX between paragraphs.
- Rendered as `<hr class="my-8 border-0 border-t border-rule">` — a single 1px hairline, full-width-of-prose-column, 32px vertical breathing room.
- No decorative motif (no `* * *`, no center-justified glyph). The rule is the rule.

### 4.11 Embedded YouTube

The MDX component `<YouTube id="..." />` (§3.7 of the architecture doc) renders a thumbnail-button façade that swaps to the iframe on click.

**At rest** (no JS, no interaction):

- `<figure class="my-6">` outer container, same as images.
- A `relative` div with `aspect-ratio: 16 / 9`, capped at `max-w-prose-wide`, `border border-rule`, `bg-canvas`.
- Inside: the YouTube thumbnail (`https://i.ytimg.com/vi/<id>/hqdefault.jpg`) as an `<img>` (or `<Image>`), full-bleed, `object-cover`. **Grayscale filter** at rest (`filter: grayscale(1) contrast(0.95)`) — the same recipe as `--photo-filter` minus the brightness boost. This keeps the page palette quiet; YouTube thumbnails ship with whatever colors creators chose, often dramatic, and unfiltered they'd punch through the canvas like a foreign body.
- Centered on top: a play-button overlay — a 64×64 square in `bg-canvas border border-accent`, with a `▶` glyph inside in `text-accent`. **Square, not round** (no circles in the system).

**On hover/focus**:

- Grayscale filter dissolves (`filter: none`) over 200ms ease-out.
- Play button border thickens to `border-accent-strong`.
- Same `motion-safe:hover:` gating as the rest of the system.

**On click**:

- Façade is replaced by the real `<iframe>`, which inherits the same `aspect-ratio` container with the border. No new mount animation — just an instantaneous swap (the iframe carries its own loading state).

**Optional caption** (props `caption?: string`): rendered the same as `<figcaption>` on images.

### 4.12 Callouts / Asides (deferred from v1, designed now)

The architect's allowlist for in-content MDX components is `<YouTube>` only in v1. `<Aside>` is flagged as a future candidate. **Designing the visual now lets it land cleanly the day the engineer enables the seam.**

`<Aside type="note" | "warn" | "tip">`:

- **Container**: `<aside class="my-6 border-l-2 border-{type-color} pl-4 py-2 bg-surface">`.
- **Left rule color** per type:
  - `note` (default): `border-fg-subtle` — neutral; for tangents and parentheticals.
  - `tip`: `border-accent-muted` → `border-accent` on focus (none for static read). For "here's a trick."
  - `warn`: `border-fg` — the brightest neutral. The site has no red/yellow semantic palette by design; warnings escalate by using the *strongest* neutral instead of a colored signal. (For genuinely dangerous content, authors should use blockquotes labeled "Warning:" — Asides are advisory, not operationally critical.)
- **Eyebrow inside aside**: optional `<Eyebrow>` at the top with the type word: `// note`, `// tip`, `// warn`. Uses the same comment-tag recipe.
- **Body**: `text-fg-muted` (a hair down from prose) inside, paragraphs and lists work normally.

This is the seam, ready for the engineer when they add Aside to the allowlist. Not implemented in v1.

---

## 5. Footer block

### 5.1 Tag chip strip

- `<ul class="flex flex-wrap gap-1.5 list-none p-0 m-0">` — the same gap rule the design system uses everywhere (`gap-1.5`, the symmetric 6px chip pattern from standing rule 08).
- `<li>` wraps each `<Tag>` — same component as career chips and article card tags. Brand-cased per `docs/copy-guide.md` (LLMs, React, Next.js, etc.).
- Tags here are **not links**. There is no tag-archive route in v1, and giving the chips a hover affordance they can't satisfy would be a lie.

### 5.2 Syndication callout — "Also on dev.to"

Render only when `article.devtoUrl` is set:

```html
<div class="mt-6">
  <ArrowLink href={article.devtoUrl}>also on dev.to</ArrowLink>
</div>
```

- **Component**: `<ArrowLink>` — reused verbatim.
- **Label**: `also on dev.to` (lowercase, no period). Three words say what the link is: a syndicated mirror, not "the canonical version."
- **Position**: own line, below tags, above the terminal backlink.
- **No accompanying explanatory prose**. The reader who follows the link to dev.to lands on the dev.to copy, which itself carries `<link rel="canonical">` pointing back to the site. The site doesn't need to disclaim or annotate; the link goes to the mirror, and that mirror's HTML self-discloses where the real article lives.
- **No "discuss on dev.to," no "share this article" social-affordance row, no comment-count CTA.** The strategy doc treats dev.to as a discovery surface, not the engagement loop. The syndication callout is a *signpost*. The brand register rejects engagement theater (likes counts, share rows, comments-driven CTAs). The reader who wants to discuss will email André (the footer carries `email` as a primary social link).

### 5.3 Terminal backlink

```html
<div class="mt-8">
  <ArrowLink href="/articles" class="rotate-arrow-back">↑ back to articles</ArrowLink>
</div>
```

- **Component**: `<ArrowLink>`, with an **arrow direction modifier**. The default `<ArrowLink>` renders a right-pointing arrow that nudges right on hover. The article page needs a left-pointing arrow for "back to articles." Two ways the engineer can do this:
  - Add a `direction="back"` prop to `<ArrowLink>` that swaps the SVG and flips the hover nudge (`translate-x-0.5` → `-translate-x-0.5`).
  - Use a CSS class that applies `transform: scaleX(-1)` to the existing arrow SVG and inverts the hover translate.
  Either is acceptable; the prop approach is cleaner and the engineer can decide. **The visual contract is**: arrow on the *left* of the label (so it precedes the words it's pointing back to), label `back to articles`, on hover the arrow nudges left.
- **The label**: `back to articles` (lowercase). Mirrors the orienting backlink at top of page. Whether top and bottom use the *same* label or differ ("← back to articles" / "↑ back to articles") is a copy decision — the design provides for either by leaving the label string flexible. **Recommendation for v1**: both use `back to articles` for terseness; differentiation is via position alone.

### 5.4 What's *not* in the footer

- No author bio block (the page's identity is the article title; the site itself is `andresilva.cc` — author identity is two clicks away at `/about` and one click away in the header wordmark).
- No "related articles" recommendation list (no algorithmic recommendation engine; manual curation would mean every article carries hand-picked sibling links that go stale; defer entirely).
- No newsletter signup (the site has no newsletter).
- No "edit this page on GitHub" link (the site is André's; community contribution is not a goal). If the project ever opens to PRs, this can be added.
- No reaction/heart count (intentionally — see architecture §2: "Drop reactions/comments — they were Forem-only metadata. No equivalent on a self-hosted post").
- No comments thread (same reason).

The footer is deliberately thin. The reader finishes the article, sees what it was about (tags), can jump to the mirror if they want to engage on a social platform (syndication callout), and is offered the next-natural action (back to the list). Three affordances total.

---

## 6. Edge cases

### 6.1 No `coverArt` configured

Already handled in §3.6: cover art section and its containing hairlines are omitted entirely. Head→body sequence becomes: head → 1px hairline → body.

### 6.2 Very short article (< 200 words)

The body is short; the head and footer take their normal space. Result: a tall-ish head, ~150–250px of body prose, a normal-sized footer. Layout still balances because the head and footer are anchored by the same prose-column width — they don't expand to fill empty space.

**No special treatment** for short articles. The system reads identically whether the body is 200 or 2000 words. Reading time still renders (`1 min`), tags still render, syndication callout still renders. Brevity is not a state the design needs to mark.

If a piece is so short it doesn't earn an article-page treatment (a 50-word hot take), that piece is a *note*, not an article — and the notes section is explicitly deferred.

### 6.3 Very long article (> 3000 words)

The page just goes long. A reader who's 70% down the page can scroll back to the top — browsers handle this — or use the terminal backlink at the bottom.

**Table of contents (TOC)**: **not in v1.** Justification:

- The 68ch prose column leaves no natural right-rail real estate at any viewport (the column is centered in `.shell`, with symmetric whitespace each side that's needed for breathing, not for chrome).
- The two migrated articles are 1200 and 800 words respectively — TOC is overkill for the current corpus.
- The pattern's natural home (left-rail or floating right) would either (a) shrink the prose column, breaking standing rule 15, or (b) add a sticky positioning concern this design has zero of.

When/if articles grow past 3000 words consistently, revisit. Headings already get `id` slugs, so the future TOC has its anchors waiting.

### 6.4 `updatedAt` set

Rendered in §2.2: a second `<Text variant="meta">` line below the meta strip, italicized `text-fg-subtle`, prefixed `// last updated YYYY.MM.DD`.

**`updatedAt` is informational, not stamped over publishedAt.** A reader scanning a long-old article should see "Published 2018, last updated 2024" — both dates matter (the publish date dates the *thinking*, the update date dates the *current accuracy*).

### 6.5 Empty `tags` array

The tag chip strip renders nothing. Its containing block is omitted (not rendered empty) — the `mt-12` gap moves to the next block (syndication callout or terminal backlink, whichever comes next).

### 6.6 No `devtoUrl` set (the article never appeared on dev.to)

Syndication callout is omitted entirely. New articles authored on the site will start without `devtoUrl`; the field gets populated only after a syndicated mirror exists.

### 6.7 Article carries an inline image with very wide aspect ratio (panoramic screenshot)

The image renders at `max-w-prose-wide` with `h-auto`. The panoramic shrinks to fit the column; vertical height is small. The 1px frame holds. No special panoramic treatment in v1.

### 6.8 Article carries a code block over 200 lines

The `<pre>` renders the full block with `overflow-x-auto`. The page becomes long; nothing collapses. Whether to collapse-by-default with a "show more" toggle is rejected: (a) toggles add interactive chrome; (b) JS gating defeats the static-render simplicity; (c) authors who include 200-line code blocks chose to include them — design should not second-guess. If a code block is too long, the author splits it.

### 6.9 Article has zero code blocks

Page renders as normal prose with no `<pre>` blocks. No special prose treatment; the code-block styles simply don't apply. This is the common case for opinion-shaped articles.

---

## 7. Responsive behavior

### 7.1 Breakpoints in use

The design system declares two non-default breakpoints in `globals.css`: `--breakpoint-xs: 30rem` (480px), plus Tailwind's default `md` (768px). The article page uses three states:

- **Mobile** (< 768px): single-column, narrowed gutter padding from `.shell` (already 32px → no change), all blocks flow in DOM order.
- **Tablet** (768–1024px): the prose column already caps at `max-w-prose-wide` (≈ 612px), so there's natural side margin at this breakpoint; no other change.
- **Desktop** (> 1024px): same. The article page is single-column at every breakpoint — there is no two-column "sidebar + body" layout to reflow.

### 7.2 What changes at mobile

| Element | Desktop | Mobile (< 768px) |
|---|---|---|
| Backlink | own row, top of `<main>` | unchanged |
| Eyebrow + meta strip | horizontal: eyebrow left, meta right, single-line meta cluster | `flex-wrap`: eyebrow on its own line, meta cluster wraps to next line(s). The `flex-wrap items-baseline justify-between gap-x-4 gap-y-2` already handles this — no extra rules. |
| Title | up to 3 lines at 56px or 28px | same sizes; wraps to more lines naturally |
| Summary | 68ch | reads at the viewport width (which is narrower than 68ch on phones); the cap still applies but doesn't activate |
| Cover art | 16:7 aspect-ratio | switches to **4:3** at `< 640px` (mobile-first cover-art aspect ratio per §3.2) |
| Body prose | 68ch | reads at viewport width minus shell padding (32px × 2 = 64px) |
| Code blocks | `overflow-x-auto` inside 68ch column | `overflow-x-auto` inside viewport-minus-padding; same behavior |
| Tables | same | same |
| Tag chip strip | wraps at 68ch | wraps at viewport width |
| Syndication + terminal backlink | single row each | single row each — no change |

### 7.3 The 480px breakpoint

At `< 480px` (Tailwind `xs`):

- The header bar stacks (wordmark first row, nav wrapping below) — this is shared shell behavior, already documented in `docs/ui-spec.md`.
- The article page itself has no additional sub-480 treatment. The cover art's 4:3 ratio still works at 320px viewport (240×180 at typical 3:4 → manageable).

### 7.4 Touch-specific

- The `<YouTube>` thumbnail-button façade is fully touch-targetable (the 64×64 play button clears the 44×44 minimum touch target).
- Code blocks scroll horizontally on touch via native overflow scrolling — no JS scroll-handlers.
- All interactive elements (backlinks, syndication callout, tags-that-aren't-links) carry adequate touch hit-areas (the inherited `min-height: 32px` from CTAs and ArrowLinks).

---

## 8. Motion and interaction

### 8.1 Link hovers

- **`<InlineLink>` in body prose**: color lift `text-fg` → `text-accent`, underline appears at 3px offset, 1px decoration. `duration-fast` (120ms) `ease-out`. Inherited from the component.
- **`<ArrowLink>` (backlinks, syndication callout)**: color lift to `text-accent-strong`, underline appears, arrow nudges. Same duration. Inherited.

### 8.2 Tag chip strip hover

- Border `border-accent-muted` → `border-accent` on hover. Texture, not affordance — no fill, no underline. Inherited from `<Tag>`.

### 8.3 YouTube façade hover

- See §4.11. Grayscale dissolves; play-button border thickens.
- `motion-safe:` gated. `prefers-reduced-motion: reduce` skips the dissolve — the at-rest state retains its grayscale filter and the iframe still loads on click.

### 8.4 Cover art

- Stipple animation loop is component-internal. `prefers-reduced-motion: reduce` causes a single frame to render (component default).
- No hover state on the cover art container (it is not interactive).

### 8.5 Code blocks

- **No hover affordance.** Texture not affordance — code is content, not a button.
- **No focus-on-click reveal.** Authors who care about per-line attention use rehype-pretty-code's `{1,3-5}` highlight syntax (§4.7.1), rendered statically at build time.
- The horizontal-scroll behavior is native and produces no JS-driven motion.

### 8.6 Images in body

- No hover transform. No grayscale-reveal. Static throughout.
- Native browser focus ring (the global `:focus-visible` from `globals.css`: 2px accent outline, 2px offset) appears when an image is reached by keyboard focus inside a link.

### 8.7 Reduced motion

- The global `prefers-reduced-motion: reduce` rule already zeros all `animation-duration` and `transition-duration` to 0.01ms (see `globals.css`).
- The stipple animation gates itself.
- The YouTube façade's grayscale dissolve is `motion-safe:`-gated.
- No other motion on the page.

### 8.8 Focus order

```
Skip link
  ↓
Wordmark
  ↓
5 nav links
  ↓
Orienting backlink (back to articles, top)
  ↓
[Body inline links + YouTube buttons in DOM order]
  ↓
Syndication callout (also on dev.to)
  ↓
Terminal backlink (back to articles, bottom)
  ↓
6 footer links
```

No tab traps. The article body's natural element flow handles tab order; nothing is `tabindex="-1"` or `tabindex` over 0.

---

## 9. Accessibility floor

- **Document outline**: `<h1>` is the article title; body uses `<h2>`–`<h4>`. The page outline is `page-h1 → body-h2 → body-h3 → ...`. No `<h1>` inside the article body.
- **Landmarks**:
  - `<main id="main">` (shared shell).
  - The article body is wrapped in `<article>` (not just a `<div>`). Inside `<article>`, `<header>` wraps the title + meta + summary block, and `<footer>` wraps the tags + syndication + terminal backlink. The article gets a proper semantic structure.
  - Cover art is wrapped in `<section aria-label="Cover art">`.
- **`<time>` elements**: both `publishedAt` and `updatedAt` are wrapped in `<time datetime="YYYY-MM-DD">…</time>` for machine readability.
- **Focus indicators**: inherited global `:focus-visible` rule (2px accent outline, 2px offset, square corners).
- **Color contrast** (from `docs/design-system.md` §"Accessibility floor"):
  - Title: `text-accent` on `bg-canvas` → 16.4:1 (AAA).
  - Body prose: `text-fg` on `bg-canvas` → 14.7:1 (AAA).
  - Muted body (summary, table cells, asides): `text-fg-muted` on `bg-canvas` → 7.92:1 (AAA).
  - Code block surface: `text-fg` on `bg-surface` (close to canvas) — still AAA; Shiki token colors (see §10) are calibrated for the same surface.
- **Reduced motion**: honored as above.
- **Touch targets**: backlinks, syndication callout, YouTube button all ≥ 32px in their hit area (the global CTA/ArrowLink baseline).
- **Skip link** delivers focus to `#main`; the article page's main content starts there.
- **Curly quotes** in titles and prose (standing rule 09). The MDX pipeline (remark-gfm + remark-smartypants) handles transformation at build.
- **Page title** (`<title>`): `${article.title} | André Silva` — set in `generateMetadata` (architect's spec §6.4).
- **`aria-current="page"`** does NOT appear on any nav item for `/articles/[slug]` — none of the five primary nav items matches this URL exactly. The `articles` nav item *could* carry an `aria-current="true"` (truthy non-"page" value to indicate "current section, not current page"), but the existing `<Nav>` component does not implement that and it's a stretch for the brutalist-mono aesthetic. **Decision: no `aria-current` on `/articles/[slug]`.** The header's `articles` link remains plain; the reader knows where they are from the article title.

---

## 10. Custom Shiki theme spec

The architect deferred this to the designer. Shiki accepts TextMate-format theme JSON; the engineer translates this token-to-scope table into the JSON file.

### 10.1 Palette and principles

Theme name: `brutalist-mono` (or `andresilva-mono` — engineer's choice; not load-bearing).

**Available colors** (no new tokens; use the design system palette only):

| Token | Hex | Contrast on `bg-surface` (#0F1410) |
|---|---|---|
| `--color-fg` | `#D7E5D0` | 13.9:1 (AAA) |
| `--color-fg-muted` | `#9DAA95` | 7.50:1 (AAA) |
| `--color-fg-subtle` | `#7E8E76` | 5.24:1 (AA body) |
| `--color-accent` | `#C8FF3D` | 15.4:1 (AAA) |
| `--color-accent-strong` | `#DEFF6B` | 16.1:1 (AAA) |
| `--color-rule` | `#1F2A1F` | decorative — not text |
| `--color-rule-strong` | `#2C3A2C` | decorative — not text |

**Background**: `--color-surface` (`#0F1410`) — code blocks use the surface fill, not canvas, so the block reads as a slightly elevated panel. The Shiki theme's `colors.editor.background` is set to `#0F1410`.

**Principles**:

1. **Accent (`#C8FF3D`) is used sparingly in code.** Standing rule 01 says accent lands on a surface's primary noun. The primary noun on the article page is the title. Sprinkling accent on every `keyword` and `function` in every code block would dilute the title's emphasis and overload visual texture (the design system explicitly warns about this).
2. **Accent lands on exactly one token group: `entity.name.function` (function name in declarations and calls).** Function names are the highest-signal noun in code — they are *what the code does*. Accent on functions makes code blocks readable-at-a-glance ("which functions does this block call?"). Other tokens use the `fg` / `fg-muted` / `fg-subtle` ramp for differentiation.
3. **No semantic warning/error palette.** The site has no red/yellow tokens; the `invalid` Shiki scope therefore gets a deviation: italic + `text-fg-subtle`. No color signal — italic + subdued is the "this is wrong" mark.
4. **Three colors carry the work**: `fg` (default), `fg-muted` (secondary), `fg-subtle` (tertiary / comments). Accent is the one exception (function names). Everything else is differentiated by **weight and italic**, not hue.
5. **No font-weight bolding inside code**. Code is already mono; bolding individual tokens makes the block visually noisy. **Italic** is permitted (JetBrains Mono has true italics) for keyword classes that benefit from it.

### 10.2 Scope mapping

| TextMate scope | Color token | Style | Rationale |
|---|---|---|---|
| `comment`, `comment.line`, `comment.block` | `--color-fg-subtle` | italic | De-emphasized; mono-tone. Italic separates ambient prose from code without color shift. |
| `comment.line.documentation` (JSDoc / Rustdoc) | `--color-fg-muted` | italic | One step brighter than line comments — doc comments are content the reader should be able to read; ambient comments are aside. |
| `string`, `string.quoted` | `--color-fg-muted` | — | Strings are data, not control flow. Muted color signals "this is a value the program will see," distinct from the operative tokens around it. |
| `string.template`, `meta.template.expression` (the `${…}` inside template strings) | `--color-fg` | — | Interpolation expressions are code in disguise — lift them back to default fg so the eye can read past the string-color band. |
| `string.regexp` | `--color-fg-muted` | italic | Same as strings, italicized because regex is opaque-by-construction and the italic flags "this is a different mini-language." |
| `keyword`, `keyword.control` (if, else, for, return, etc.) | `--color-fg` | italic | Control-flow keywords italicized for visual differentiation without color shift. They land at full strength — they ARE the control flow. |
| `keyword.operator` (arithmetic, comparison, logical) | `--color-fg-subtle` | — | Operators are connective tissue; subdued so the operands they connect read as primary. |
| `keyword.operator.assignment` (`=`, `+=`, etc.) | `--color-fg-muted` | — | A step brighter than other operators — assignment is *the* primary code action and earns visibility above arithmetic. |
| `storage.type` (let, const, var, function, class, fn) | `--color-fg` | italic | Storage declarations carry semantic weight — same treatment as keywords. |
| `storage.modifier` (public, async, static, mut, etc.) | `--color-fg-muted` | italic | Modifiers qualify declarations; one step muted so the declaration itself reads as primary. |
| `variable`, `variable.other` | `--color-fg` | — | Default identifier color. Variables are the most common token; they get the most readable color. |
| `variable.parameter` (function arguments) | `--color-fg` | italic | Italic differentiates parameters from variables-in-scope without color shift. Reader scanning a function head can see argument names at a glance. |
| `variable.language` (`this`, `self`, `super`) | `--color-fg-muted` | italic | Language-magic identifiers — distinguishable from user-named variables. |
| `entity.name.function` (function declarations *and* function calls) | `--color-accent` | — | **The single accent token.** Function names are the highest-signal noun in code; one color signal makes code scannable-at-a-glance. |
| `entity.name.type`, `entity.name.class`, `support.type` | `--color-fg` | italic | Type names are nouns too, but secondary to function names. Italic separates them from variables without competing with the accent on functions. |
| `entity.name.tag` (HTML/JSX tag names) | `--color-fg-muted` | — | JSX tags read like punctuation in component code — muted color, but not italic (italics on tag names look broken). |
| `entity.other.attribute-name`, `meta.tag.attribute-name` | `--color-fg-subtle` | — | Attribute names are tertiary structural markers in JSX/HTML. Most de-emphasized. |
| `constant.numeric` (literals: `42`, `3.14`) | `--color-fg-muted` | — | Numeric literals are data — same treatment as strings (both are values, not operations). |
| `constant.language` (`true`, `false`, `null`, `undefined`, `None`) | `--color-fg-muted` | italic | Language-defined constants — same color as numeric literals (they're literal values too), italicized to flag "this is a language keyword, not a user identifier." |
| `constant.character.escape` (`\n`, `\t` inside strings) | `--color-fg-subtle` | italic | Escape sequences inside strings — they're meta-characters, not data; subdued. |
| `constant.other` (uppercase enum members, e.g. `FOO_BAR` in JS) | `--color-fg-muted` | — | User-defined constants — same brightness as language constants for consistency. |
| `support.function` (built-in functions: `console.log`, `Math.max`) | `--color-fg-muted` | — | Built-in callables — one step down from user-defined functions (which get accent). The accent-on-function rule applies to *the function being declared/called by user code*; library calls are connective tissue. |
| `support.class` (built-in classes: `Array`, `Map`, `Set`) | `--color-fg-muted` | italic | Same logic — library types, italicized to match `entity.name.type`. |
| `punctuation` (default catch-all) | `--color-fg-subtle` | — | Brackets, commas, semicolons. Tertiary — the eye should read past them. |
| `punctuation.definition.string` (the `"` quotes around a string) | `--color-fg-subtle` | — | Subdued so the string content reads as the operative token. |
| `punctuation.section.embedded` (`${` / `}` template-string boundaries, `{}` in JSX expressions) | `--color-fg-subtle` | — | Boundary markers between languages — quiet. |
| `markup.bold` (in Markdown code blocks if any) | `--color-fg` | bold (semibold per JetBrains Mono) | Honored, but rare in code blocks. |
| `markup.italic` | `--color-fg-muted` | italic | Same. |
| `markup.heading` (Markdown headings if highlighting Markdown source) | `--color-fg` | semibold | Same. |
| `markup.inline.raw`, `markup.fenced_code` (Markdown code inside Markdown) | `--color-fg-muted` | — | Code-within-code; muted to keep the outer markdown reading. |
| `markup.list.unnumbered`, `markup.list.numbered` | `--color-fg-subtle` | — | List markers. |
| `markup.quote` | `--color-fg-muted` | italic | Block-quote content. |
| `invalid`, `invalid.illegal` | `--color-fg-subtle` | italic + underline (`text-decoration-style: wavy`) | No red. Italic + wavy underline marks "broken" without the system's missing semantic-error color. Will land subtle but distinguishable. |
| `invalid.deprecated` | `--color-fg-subtle` | italic + line-through | Strike-through marks deprecation; subtle color. |

### 10.3 Theme-wide settings (`colors.*` in the theme JSON)

| Theme property | Token | Notes |
|---|---|---|
| `editor.background` | `--color-surface` (#0F1410) | Code block surface. |
| `editor.foreground` | `--color-fg` (#D7E5D0) | Default text. |
| `editorLineNumber.foreground` | `--color-fg-subtle` (#7E8E76) | If/when line numbers are enabled (not in v1; future-proofing). |
| `editor.selectionBackground` | `--color-accent` (#C8FF3D) with alpha | At ~20% alpha. The site-wide `::selection` is full-accent on canvas; inside a code block, lower alpha keeps the highlighted code readable. |
| `editor.findMatchHighlightBackground` | `--color-accent-tint` (rgba(200,255,61,0.08)) | Matches the highlighted-line treatment. |

### 10.4 What Shiki does *not* style (left to CSS)

- Code block container (border, padding, margin) — owned by §4.7.
- Line-highlight backgrounds and left rules — owned by §4.7.1.
- Inline `<code>` styling — owned by §4.3 (Shiki doesn't highlight inline code in v1).
- Language label — owned by §4.7.

### 10.5 Theme deliverable shape

The engineer translates the table above into a TextMate theme JSON (`tools/shiki-themes/brutalist-mono.json` or equivalent) with the structure:

```json
{
  "name": "brutalist-mono",
  "type": "dark",
  "colors": {
    "editor.background": "#0F1410",
    "editor.foreground": "#D7E5D0"
  },
  "tokenColors": [
    { "scope": ["comment", "comment.line", "comment.block"],
      "settings": { "foreground": "#7E8E76", "fontStyle": "italic" } },
    { "scope": "comment.line.documentation",
      "settings": { "foreground": "#9DAA95", "fontStyle": "italic" } },
    // ...one entry per row in §10.2
  ]
}
```

Hex values resolve from the design system tokens; the JSON contains literal hex (Shiki does not consume CSS variables). The engineer cross-references the table; this design specifies *which* hex per scope.

---

## 11. OG image visual brief

OG images render at **1200 × 630** (the standard OpenGraph card aspect, ~1.91:1). Generated at build time by grafex against `tools/og-article.tsx`, fed the article frontmatter.

### 11.1 Composition (ASCII sketch)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │ ← 64px top margin
│  ┌─[A]  andresilva.cc                                                        │ ← header: 56px tall
│  │                                                                           │
│  ──────────────────────────────────────────────────────────────────────────  │ ← 1px hairline #1F2A1F at y≈140
│                                                                              │
│   // ARTICLE                                                                 │ ← eyebrow comment-tag (40px)
│                                                                              │
│                                                                              │
│   How I Achieved a 74%                                                       │ ← title (VT323, ~96px, accent)
│   Performance Increase on a Page                                             │   wraps to 2-3 lines
│                                                                              │
│                                                                              │
│   2024.08.14  ·  6 min  ·  react · performance · profiling                   │ ← meta line (24px)
│                                                                              │
│                                                                              │
│                                                            ┌─────────────┐   │
│                                                            │             │   │
│                                                            │  stipple    │   │ ← cover art motif
│                                                            │  motif      │   │   (~280×240, bottom-right)
│                                                            │             │   │
│                                                            └─────────────┘   │
│                                                                              │ ← 64px bottom margin
└──────────────────────────────────────────────────────────────────────────────┘
   ←64px→                                                          ←64px→
```

### 11.2 Composition specifics

- **Canvas**: 1200 × 630, `#0B0F0A` background. Square corners (the OG image doesn't appear with rounded corners; platforms control their own corner radius).
- **Outer margins**: 64px all sides. This is the same margin pattern as the home OG card (`tools/og.tsx`).
- **Header row** (`y: 64 → 120`):
  - Pixel-A wordmark glyph at `x: 64`, 48×48 in accent — identical to the wordmark's pixel-A SVG.
  - "andresilva.cc" text immediately right of the glyph, JetBrains Mono 24px, weight 500, `#D7E5D0`, baseline-aligned with the glyph's bottom edge.
- **Hairline**: 1px solid `#1F2A1F`, full-width minus the 64px outer margins (so `x: 64 → 1136`), at `y: 140`.
- **Eyebrow** (`y: 200 → 230`): `// ARTICLE` in JetBrains Mono 18px, weight 600, uppercase, letter-spaced `0.16em`, color `#C8FF3D`. Same recipe as the on-site eyebrow comment-tag.
- **Title** (`y: 260 → 440`, depending on line count):
  - VT323, **96px**, line-height 1.10, color `#C8FF3D` (accent).
  - Width-constrained to ~720px (so it doesn't crash into the cover-art slot at the right). 96px × 9px-per-char-approx = ~80 chars across — most titles fit on 1–2 lines; long ones wrap to 3.
  - **Why 96px, not the architect's suggested 88px**: VT323 at 96px on a 1200-wide canvas reads as the dominant element from a thumbnail-sized preview (where these cards live on social timelines and link-preview cards). 88px is a hair too small; the title needs to dominate, especially when it's competing with the cover-art motif for attention at the right.
  - **Width-cap, not font-size step**: even on 80-character titles, the renderer keeps 96px and lets the title wrap to a third line rather than shrinking the type. The card grows vertically gracefully; long titles take the full available space.
- **Meta line** (`y: 480 → 510`): JetBrains Mono 22px, weight 500, color `#9DAA95` (with the date itself in `#D7E5D0` — same elevation pattern as the on-site meta strip). Separators `·` in `#7E8E76`.
- **Cover-art motif** (`y: 380 → 580`, `x: 836 → 1136`):
  - 300 × 200 (3:2 aspect-ratio — different from the on-site 16:7 because the OG card has different real-estate constraints).
  - `bg: #0B0F0A` (canvas), `border: 1px solid #1F2A1F`.
  - Renders the stipple motif statically (one frame — OG is a static image; the animated loop doesn't translate). Same `coverArt.params` config drives a single-frame snapshot.
  - **When `coverArt` is null**: the motif slot is omitted; the title and meta line take the freed horizontal real estate (width-cap relaxes from ~720 to ~1072px). This produces a cleaner card for articles without an art config — the title gets even more room to breathe.

### 11.3 Hierarchy

Eye-path on first glance:

1. **Title** (96px accent VT323) — the visual anchor, lower-left-quadrant centerpiece.
2. **Cover-art motif** (300×200 in the right margin) — visual texture; ties the OG card to the article-page identity.
3. **Eyebrow `// ARTICLE`** (lime accent at smaller scale) — tells the platform-context this is a long-form post, not a tweet/note.
4. **Meta line** (publish date, reading time, tags) — tertiary scan-line; the reader who needs "should I bother?" answers it here.
5. **Wordmark + andresilva.cc** (top) — site identity; the smallest commitment of attention because the social platform's surrounding chrome (Twitter/LinkedIn shows the URL too) reduces what this needs to do.

### 11.4 Color treatment

Strictly monochrome on canvas, accent lands on:

1. The wordmark's pixel-A glyph (identity — same place as on-site).
2. The `// ARTICLE` eyebrow.
3. The title in its entirety.

Three accent moments, one card. The summary text, meta line, and wordmark-text-portion are all neutral (`#D7E5D0`/`#9DAA95`/`#7E8E76`). The stipple motif renders in its native palette (`palette=mono` per the existing configs — also monochrome, just a different chroma).

### 11.5 Typography summary table

| Element | Face | Size | Weight | Color | Letter-spacing |
|---|---|---|---|---|---|
| Wordmark text | JetBrains Mono | 24px | 500 | `#D7E5D0` | normal |
| Eyebrow `// ARTICLE` | JetBrains Mono | 18px | 600 | `#C8FF3D` | 0.16em |
| Title | VT323 | 96px | 400 | `#C8FF3D` | -0.01em (tracking-display) |
| Meta line | JetBrains Mono | 22px | 500 | `#9DAA95` (date `#D7E5D0`, separators `#7E8E76`) | normal |

### 11.6 Why no summary text on the OG card

The architect's brief proposed reserving summary for `<meta name="description">` and JSON-LD; the title + meta line is enough for an OG card. **Agreed.**

Rationale: at 1200×630, viewed in social-media-feed thumbnail sizes (typically 600×314 in feed, sometimes smaller), a multi-line summary block becomes illegible. The title carries the most weight in the smallest preview; piling summary text onto the card reduces title legibility without giving the reader new information at thumbnail scale. The summary works in the `<meta>` slot precisely because the platforms that use it render it as a separate text line below the image preview — not inside the image itself.

### 11.7 Fallback / no-cover-art variant

When `article.coverArt` is null:

- Motif slot omitted.
- Title width-cap relaxes to ~1072px.
- Title and meta line shift slightly right-ward in lower-left composition (still left-aligned to `x: 64`, just with more room).
- Card composition is otherwise identical.

### 11.8 What the OG card does *not* show

- No author photo / portrait (the home OG card has no portrait either; consistency).
- No "by André Silva" attribution string (the wordmark *is* the byline at this scale).
- No reading-time icon (text says `6 min`; no clock glyph).
- No tag chips (textual tags only, in the meta line).
- No "Read on andresilva.cc" CTA-style strip (the wordmark says where; the platform metadata says the URL).

### 11.9 Deliverable

The engineer implements `tools/og-article.tsx` against this spec. Production-quality refinement happens in PR review with screenshots. The architect's data contract (props shape) is preserved verbatim.

---

## 12. Open follow-ups

These are deliberately out of v1 scope but flagged here so future work has a record:

- **TOC for long articles** (>3000 words). Pattern is unclear (right-rail steals from prose column; floating overlay needs JS). Defer until the corpus has 3+ articles that would benefit.
- **`<Aside>` callout component** in the MDX allowlist. Design exists in §4.12; engineer adds the component + extends the allowlist when an article needs it.
- **Inline copy-to-clipboard button on code blocks**. Rejected for v1 as pseudo-app-UI; revisit if a real reader-need surfaces.
- **Tag-archive routes** (`/articles/tag/[slug]`). Would let the foot-of-page chips become links. Out of scope; would require the tags to be linkable across the index and the body footer.
- **Article-to-article navigation** ("previous / next article"). Would require time-ordering UX inside individual articles. Out of scope.
- **`<ImageMdx wide>` opt-in for full-shell-width figures**. Useful for occasional architecture diagrams; not in v1 because no migrated article needs it.

---
