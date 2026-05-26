# Design System — andresilva.cc

> Concise primer for orientation. The **source of truth** is the shipped code in `src/` — tokens in `src/styles/globals.css`, components in `src/components/` — live-rendered at the `/design-system` route. Decision rationale lives in `docs/redesign-log.md`. Page-level usage is documented in `docs/ui-spec.md`.

---

## Aesthetic register

A **brutalist mono** design system in service of a quiet personal site. The register is professional, terse, and craft-forward: JetBrains Mono carries everything except the identity moment on each page, where VT323 — a pixel-display face — takes over. Lime-on-near-black, square corners everywhere, hairline rules instead of shadows, chips wear borders not fills. Accent (`#C8FF3D`) lands on the **primary noun** of the surface — André's name on Home, the company on Career, the project title on Projects — and only there. The layout reads top-to-bottom like a structured document: page-head, banded sections, lists of items. No cards-with-elevation, no glass, no gradients.

---

## Token families

All tokens live in `src/styles/globals.css` — 39 in the `@theme inline` block (registered as Tailwind utilities) plus 5 raw `:root` CSS variables that stay un-tokenized (see "Stay as raw CSS variables" below). **44 primary tokens total.** Count convention: each named CSS variable counts once; the seven `--text-*--line-height` sub-tokens are bundled with their size tokens per Tailwind v4 syntax and are not counted separately.

### Colors

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#0B0F0A` | Page base (near-black) |
| `--surface-2` | `#0F1410` | Hover/raised cell |
| `--rule` | `#1F2A1F` | 1px dividers |
| `--rule-2` | `#2C3A2C` | Decorative SVG strokes only |
| `--hi` | `#D7E5D0` | Primary text (14.7:1 on `--bg`, AAA) |
| `--mid` | `#9DAA95` | Body prose (7.92:1, AAA) |
| `--lo` | `#7E8E76` | Muted, meta (5.53:1, AA body) |
| `--accent` | `#C8FF3D` | Brand emphasis — the primary noun (16.4:1, AAA) |
| `--accent-hi` | `#DEFF6B` | Hover state of accent (17.1:1) |
| `--accent-mute` | `#3D4F18` | Chip and badge borders only (2.14:1, decorative) |
| `--accent-tint` | `rgba(200,255,61,0.08)` | CTA hover wash |

No semantic warning/success palette — the site has no state machinery that needs one.

### Typography

| Token | Stack | Role |
|---|---|---|
| `--ff-mono` | `'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` | Body, UI, code |
| `--ff-display` | `'VT323', 'JetBrains Mono', ui-monospace, monospace` | Pixel display headings |

| Token | Size | Face / Weight | Line-height | Used for |
|---|---|---|---|---|
| `--t-display` | 56px | VT323 / 400 | 1.10 | Home hero name |
| `--t-h1` | 28px | VT323 / 400 | 1.10 | Page-head title (`<ABOUT />`) |
| `--t-h2` | 18px | Mono / 600 | 1.30 | Section heads (Bio, Latest, etc.) |
| `--t-h3` | 16px | Mono / 600 | 1.30 | Card titles, role titles |
| `--t-body` | 14px | Mono / 400 | 1.65 | Body prose, bullets |
| `--t-meta` | 12px | Mono / 500 | 1.55 | Meta lines, chip text, nav |
| `--t-micro` | 11px | Mono / 600 | 1.50 | Eyebrows, badges, footer |

Three weights only: **400** (prose), **500** (meta), **600** (headings, emphasis, CTAs). No weight below 400 is used at any size.

### Spacing

A 4px base. Non-linear so jumps feel deliberate: **4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80** (tokens `--s1` through `--s20`). `section.band` separators use `--s8` (32px) top/bottom plus a 1px rule. Same-component gaps stay tight (`--s1`–`--s2`); cross-component breaks use `--s4` or larger.

Prose widths cap the readable column in `ch` units (not px) so they survive user font-size overrides:

| Token | Value | Used for |
|---|---|---|
| `--prose-w-narrow` | 56ch | Statements — short single-unit lines (home hero pitch, education descriptions) |
| `--prose-w-bio` | 60ch | The About-page biography |
| `--prose-w` | 68ch | Flowing prose — multi-sentence narrative the reader scans paragraph-by-paragraph (home Now paragraph, career role bullets, article body) |
| `--prose-w-figure` | 80ch | Captioned figures (`<Figure>`, `<YouTube>`) — wider than prose so diagrams and embeds breathe without breaking out of the article column |
| `--prose-w-card` | 38ch | Card descriptions — the card column caps the measure, not the text's role (project cards, 3 per row) |

### Motion

Two easing curves, two durations. **Animate only `transform` and `opacity`** — every other property forces layout/paint.

| Token | Value | Role |
|---|---|---|
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Enter motion, hover transitions, press release |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Exits (reserved; mirrored for parity) |
| `--d-fast` | 120ms | Default hover/press feedback |
| `--d-mod` | 200ms | Compound transitions |

Press feedback is `transform: scale(0.97)`, gated by `prefers-reduced-motion: no-preference`. Hover effects are also gated by `@media (hover: hover)` to prevent sticky-hover on touch.

### Photo filter

| Token | Value | Role |
|---|---|---|
| `--photo-filter` | `grayscale(1) contrast(0.95) brightness(1.02)` | About portrait — desaturates the photo to monochrome |
| `--photo-filter-soft` | `grayscale(1) contrast(0.9) brightness(1.04)` | Touch-device fallback (hover unreachable) |

The portrait's green-grey duotone is *not* in the filter — it's a separate `.portrait::before` layer: a solid `--color-fg-muted` fill with `mix-blend-mode: multiply` over the grayscale photo, an exact, drift-free recolour. Focus/hover fades the tint and the scanline overlay to reveal the natural-colour photo.

---

## Tailwind v4 token mapping

The canon tokens above use terse semantic names (`--hi`, `--accent-hi`, `--rule-2`) tuned for hand-written CSS. Translating those names directly into a Tailwind v4 `@theme inline` block would produce awkward utilities — `bg-bg`, `text-hi`, `border-rule-2` — that read poorly in component code. This section pins the names the rebuild will register inside `@theme`, so utilities stay legible and a future engineer doesn't have to re-derive them.

The rule: Tailwind v4 generates utilities from the token suffix after the namespace, so `--color-canvas` yields `bg-canvas` / `text-canvas` / `border-canvas`. Names below were chosen to (a) avoid stutters, (b) read sensibly in component code, (c) avoid collisions with Tailwind built-in utilities (notably `text-base`, which is a built-in font-size, not a color), (d) keep the original canon token names traceable — the `@theme` names are a translation layer over the source palette, recorded in `docs/redesign-log.md`.

### Colors — `--color-*` namespace

| Canon token | `@theme` token | Example utility |
|---|---|---|
| `--bg` | `--color-canvas` | `bg-canvas` |
| `--surface-2` | `--color-surface` | `bg-surface` |
| `--hi` | `--color-fg` | `text-fg` |
| `--mid` | `--color-fg-muted` | `text-fg-muted` |
| `--lo` | `--color-fg-subtle` | `text-fg-subtle` |
| `--accent` | `--color-accent` | `text-accent`, `bg-accent`, `border-accent` |
| `--accent-hi` | `--color-accent-strong` | `text-accent-strong` |
| `--accent-mute` | `--color-accent-muted` | `border-accent-muted` |
| `--accent-tint` | `--color-accent-tint` | `bg-accent-tint` |
| `--rule` | `--color-rule` | `border-rule` |
| `--rule-2` | `--color-rule-strong` | `border-rule-strong` |

`--color-fg` follows the foreground/background convention rather than carrying the `hi`/`mid`/`lo` shorthand; `text-fg` reads cleanly, `text-hi` does not. The accent pair becomes `accent-strong` / `accent-muted` so the emphasis axis is explicit and symmetric — "strong" is the higher-contrast hover variant, "muted" is the low-contrast border tone. Same axis applied to rules: `rule` for 1px dividers, `rule-strong` for the decorative SVG stroke colour.

### Typography — `--text-*` and `--font-*` namespaces

| Canon token | `@theme` token | Example utility |
|---|---|---|
| `--t-micro` | `--text-micro` | `text-micro` |
| `--t-meta` | `--text-meta` | `text-meta` |
| `--t-body` | `--text-body` | `text-body` |
| `--t-h3` | `--text-h3` | `text-h3` |
| `--t-h2` | `--text-h2` | `text-h2` |
| `--t-h1` | `--text-h1` | `text-h1` |
| `--t-display` | `--text-display` | `text-display` |
| `--ff-mono` | `--font-mono` | `font-mono` |
| `--ff-display` | `--font-display` | `font-display` |

`--font-mono` deliberately overrides Tailwind's built-in stack — JetBrains Mono is the body face here, not a code-block exception. `--font-display` registers VT323. No `--font-sans` is defined; the design has no sans-serif track.

### Motion — `--ease-*` and `--duration-*` namespaces

| Canon token | `@theme` token | Example utility |
|---|---|---|
| `--ease-out` | `--ease-out` | `ease-out` (overrides Tailwind built-in) |
| `--ease-in` | `--ease-in` | `ease-in` (overrides Tailwind built-in) |
| `--d-fast` | `--duration-fast` | `duration-fast` |
| `--d-mod` | — (use Tailwind built-in) | `duration-200` |

The 200ms compound-transition value matches Tailwind's default `duration-200` byte-for-byte, so no override is registered for it. The 120ms value has no built-in equivalent and needs the `--duration-fast` token.

### Prose widths — `--max-width-*` namespace

| Canon token | `@theme` token | Example utility |
|---|---|---|
| `--prose-w-narrow` | `--max-width-prose-narrow` | `max-w-prose-narrow` |
| `--prose-w-bio` | `--max-width-prose-bio` | `max-w-prose-bio` |
| `--prose-w` | `--max-width-prose-wide` | `max-w-prose-wide` |
| `--prose-w-figure` | `--max-width-prose-figure` | `max-w-prose-figure` |
| `--prose-w-card` | `--max-width-prose-card` | `max-w-prose-card` |
| (hero plasma) | `--max-width-hero-plasma` | `max-w-hero-plasma` |

`--prose-w` becomes `prose-wide`, not `prose`, on purpose — Tailwind's built-in `max-w-prose` is `65ch` and the canon `--prose-w` is `68ch`. Naming ours `prose-wide` keeps both available without one shadowing the other.

### Spacing — no overrides

The canon spacing scale (4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80 px) is byte-aligned with Tailwind v4's default 4px-base scale: `p-1` through `p-20` cover every value the design uses. Defining a custom `--spacing-*` scale would force ugly utilities (`p-s1`, `gap-s4`) and gain nothing. Components consume Tailwind's default scale directly; the `--s1`..`--s20` tokens remain in `:root` for parity with the canon files but are not registered in `@theme`.

### The `grid-cols-article-card` utility (`240px 1fr`) is used for article cards with illustrations; `grid-cols-article` (`200px 1fr`) is used for the About bio grid.

### Stay as raw CSS variables (do not tokenize)

Five tokens are consumed inside component-scoped CSS (in `globals.css`), not as Tailwind utilities. They are deliberately kept out of `@theme`:

- `--photo-filter` and `--photo-filter-soft` — multi-function `filter` chains (`grayscale → contrast → brightness`) that Tailwind v4 has no namespace for. Composing them out of utilities would mean a class per function with no way to ensure they stay in the canonical order, and the soft variant is kept in step with the primary per standing rule 8. They only land on the About portrait, so keeping them as raw `:root` variables is both the cleanest expression and the safest place to enforce that pairing.
- `--hero-art-w`, `--hero-art-h`, and `--hero-art-h-mobile` — the `<stipple-art>` embed has no intrinsic size, so the host box must be sized explicitly. These dimensions are consumed via `var()` in `hero-art.tsx`; Tailwind has no clean namespace for embed-box dimensions that must be read as CSS variables.

---

## Component vocabulary

25 components, all rendered live at the `/design-system` route. Each one is one line below; see that route for markup and behavior.

1. **Skip link** — first focusable element; jumps focus to `#main`. Visible only on focus.
2. **Header bar** — wordmark left, primary nav right; stacks at ≤ 480px (no hamburger).
3. **Wordmark** — pixel-SVG "A" glyph in `--accent` + `andresilva.cc` text in `--hi`; always links home.
4. **Primary nav** — active page wears literal `[brackets]` AND `aria-current="page"` for `--accent` color.
5. **Page-head** — `<X />` brace pattern: `<` and `/>` in `--lo`, noun in `--accent`, VT323 28px.
6. **Section head** — eyebrow comment-tag + H2; `.sec-head--flush` zeros bottom border/margin to avoid doubled 2px seams.
7. **Comment-tag eyebrow** — `// 02 / what i'm doing now` style label; 11px mono 600, accent, uppercase, tracked.
8. **Tags & badges** — outlined chips (`.tag.tag--chip`), corner badges (`.pr__badge`), row badges (`.row__badge`). All use `--accent` text on `--accent-mute` border. Chip strips wrap with a **symmetric 6px gap** on both axes (`gap-1.5`) — the border on each chip already supplies edge definition, so equal negative space lands cleaner than an asymmetric row/column rule.
9. **Status dot** — 6px static lime square with a static `--shadow-status-dot` glow ring (no animation). Appears only on `/career`, marking the current role in the work-history list against the past roles.
10. **Link arrow** — inline accent link + `→` SVG that nudges 2px right on hover.
11. **Inline link** — prose hyperlink; body color at rest, lifts to accent with 1px underline on hover/focus. See standing rule 14.
12. **Button CTA** — outlined accent button; hover fills with `--accent-tint`; active inverts to solid `--accent` on `--bg`.
13. **Card patterns** — project card (`.pr`), career role (`.role`), article (`.art`), Latest row (`.row`); each is an `<li>` directly, no inner `<article>`.
14. **Grid frame** — closed-corner grid where outer cells have no outside borders, only internal `1px` rules.
15. **Photo wrap** — monochrome photo + a `--color-fg-muted` multiply duotone + a CRT scanline overlay; the tint and scanlines clear on focus/hover to reveal natural colour, soft fallback on touch.
16. **Hero plasma** — Home only; ASCII plasma field rendered into a `<pre>`, accent chars stand out, static frame under reduced-motion.
17. **Footer** — single row of lowercase social links separated by `·` dots; thin top border.
18. **StippleArt** — `<stipple-art>` web component wrapper; renders a parametric ASCII stipple field from a `params` string; used in article covers and the home hero.
19. **FigureCaption** — numbered figure label row (`Figure N — caption text`) in mono small; shared by `Figure`, `YouTube`, and any future captioned-figure component.
20. **Figure** — MDX image figure with optional numbered caption; frameless per standing rule 18.
21. **ImageMdx** — MDX inline image; frameless, full prose width, no caption.
22. **YouTube** — click-to-load YouTube embed; static thumbnail façade on load (LCP-safe), swapped for `<iframe>` on click; grayscale at rest, color on hover.
23. **PreShiki** — syntax-highlighted code block rendered by Shiki on the server; includes a `CopyButton` client island.
24. **CopyButton** — thin client island that copies the adjacent code block's text to the clipboard; accent checkmark confirmation on success.
25. **NoteBlock** — server component; renders one note as an inline stream block, not a card. Anatomy on the `/notes` index: a meta line using `<Text variant="meta">` (matching `ArticleCard` exactly — `<time dateTime>` in `text-fg-muted`, then a `·` middle-dot, then `kind` in `text-fg-subtle`; no comment-tag eyebrow, no `//` prefix, no accent), followed by a title as a `<p>` rendered in the `h3` visual variant (`text-h3`, sentence case, no terminal period; the title is **plain text, not a link** — the trailing permalink ArrowLink carries the navigation/citation load), followed by the compiled MDX body styled by the same `.article-prose` rules used on `/articles/[slug]`, followed by a trailing `<ArrowLink>` reading `permalink` and pointing to `/notes/{slug}`, sitting **below the body**, left-aligned, accent at rest with the standard 2px arrow nudge on hover — same shape and placement as the `read article` ArrowLink at the foot of `ArticleCard`, separated from the body by `mt-4`. Keep this affordance visually prominent: it is the **only** navigation affordance on the index block (the title is not clickable), so it must carry the full citation/share load. Anatomy on the `/notes/{slug}` detail page: an `<Eyebrow>// note</Eyebrow>` sits above the title (matching `/articles/[slug]`'s `<Eyebrow>// article</Eyebrow>` rhythm: eyebrow → h1 → meta, with the eyebrow and h1 cadence inheriting the article-detail spacing), then the title as a real `<h1>` rendered in the `h1` visual variant (VT323 display font, matching `/articles/[slug]` — the title IS the document h1 on the detail page; font asymmetry between articles and notes detail titles reads as sloppiness rather than register signal), then the meta line beneath it, then the MDX body. **No trailing permalink** on detail (the reader is already at the permalink). The eyebrow is detail-only: a cold-link visitor landing on `/notes/{slug}` doesn't have the index page-head's framing, and the `til | take | snippet | aside` kind labels in meta aren't self-identifying as "kinds of notes" to an uninitiated reader, so the explicit `// note` does the framing the meta can't (category → instance: generic `// note` above, specific kind in meta below). The list surface keeps **no** eyebrow — the page-head `<NOTES />` already frames the stream, so a per-note eyebrow on the list would triplicate. The block accepts a `surface` prop (`'list' | 'detail'`, default `'list'`) that gates eyebrow presence, title element/variant, title/meta order, and permalink presence in one switch. No cover art, no tags, no reading time, no card border, no numeric badge. The block wraps in `<article id="{slug}">` so `/notes#{slug}` deep-links to it. Between consecutive NoteBlocks on the index, a single `border-rule` hairline rule separates them (the rule belongs to the list shell, not the block itself, so the last block has no trailing border).

---

## Standing rules

Twenty load-bearing rules. Removing any would compromise consistency, accessibility, or affordance hygiene.

1. **Accent lands on the surface's primary noun.** One rule globally; only the referent changes per page.
2. **Chip hover is texture, not affordance.** Border-color nudge only — no fill, no underline. Chips are labels, not buttons.
3. **Card lists are `<ul>/<li>`; card titles are non-heading elements.** Outline is `page-h1 → list-of-items`. Card titles are `<p>`, not `<h3>`.
4. **Card lists use `<li class="card-class">` directly.** No inner `<article>`. One landmark per visual card.
5. **Tabular figures are unnecessary in monospace stacks.** JetBrains Mono and VT323 are fixed-width by construction. `tabular-nums` is a no-op here.
6. **`:root` token blocks are canonical mirrors across all 5 pages.** No shared stylesheet. Tokens not consumed on a page are kept for parity, not pruned.
7. **`.sec-head--flush` zeros both margin-bottom and border-bottom.** Prevents a doubled 2px line where the next element already provides a top rule.
8. **`--photo-filter-soft` is the touch-device variant of `--photo-filter`.** Slightly softer `contrast` / `brightness`; keep the two in step — re-tune both together.
9. **Prose uses curly quotes and apostrophes.** `U+2019` for apostrophes, `U+201C / U+201D` for double quotes. Straight `'` and `"` are reserved for HTML attributes, CSS strings, and code.
10. **Grid for identifier rows, list for content rows.** A row earns a grid when its value is being one of many comparable items at a glance — career, projects, education cells, facts cells. A row earns a list when its value is its own internal content — articles, where shrinking an item to fit a peer damages the read. The article surface stays flush-to-shell intentionally; wrapping it to match career exposes asymmetric internal whitespace instead of aligning the two.
11. **Inline connector glyphs in a heading — `@`, `·`, `—`, `/`, `×` — inherit the parent's size and line-height; differentiate them by color and weight only.** Reserve size shifts for content that lives on its own line or in its own slot (metadata rows, eyebrows, captions), not for glyphs sharing a baseline with display text. This is why home and career both render the `@` at h3 scale despite the career mock originally specifying meta-sized.
12. **Brand mark — single source.** The pixel-SVG "A" in `<Wordmark />` is the site's singular identity mark. It appears in three places only: the header wordmark, the favicon (and platform icon variants), and OG/social cards. Everywhere else — including PageHead titles like `<ARTICLES />` — uses VT323 typeset text, which is *type*, not the mark. If a new surface needs identity (e.g. an email signature, a print artifact), it inherits the Wordmark A; it does not redraw an A in another font.
13. **System chrome (scrollbars, selection highlight, focus rings, caret, autofill backgrounds) inherits canvas tokens and is never left to OS defaults.** Each surface must be explicitly themed to the dark canvas palette. A pale-grey native scrollbar or a Chrome-blue selection band on `--bg` reads as a leak from the host OS and breaks the brutalist mono register; treat every UA-painted surface as in-scope for tokenisation.
14. **Inline prose links default to body color (`text-fg`) and lift to `text-accent` with a 1px underline on hover/focus.** Accent-at-rest is reserved for identity affordances (`<ArrowLink>`, `<Wordmark>`, page-title accents) — links embedded in running prose are not identity moments and must not compete with them. Use `<InlineLink>` for any hyperlink that sits inside a sentence or paragraph; never apply `text-accent` directly to prose anchors at rest.
15. **Prose measure follows the text's role, not its font size.** A short terminal identity line meant to land as a single unit (the home hero pitch) takes `--max-width-prose-narrow` (56ch); multi-sentence narrative the reader scans paragraph-by-paragraph (the home Now paragraph, career role bullets) takes `--max-width-prose-wide` (68ch); the About-page biography takes `--max-width-prose-bio` (60ch); a card description takes `--max-width-prose-card` (38ch) because the card's column — not the text's role — caps it. Two body-text blocks set at different widths is a considered signal that the blocks have different jobs, not drift. The hero pitch's narrow measure is contingent on it staying a single statement — if it grows to multiple sentences it changes role and moves to 68ch (the one-sentence constraint itself is a copy rule the copywriter owns).
16. **Section heads delimit subdivisions, not pages.** A `SectionHead` (eyebrow + h2) is used only on pages with two or more content sections (About). A single-section page (Career, Projects, Articles, Notes) goes straight from the `PageHead` h1 into its content; the lone `<section>` is named with `aria-label`, never a visible h2 that would duplicate the h1 (a WCAG 2.4.6 regression). The 404 page is the deliberate exception — it has one section but keeps a `SectionHead` because its h2 carries real, non-duplicating information.
17. **`display` variant is reserved for the home hero name — one instance on `/`.** Single-page hero titles use the `h1` variant instead. `display` carries the identity gesture (the blinking cursor); applying it elsewhere makes every page compete with Home for the "this is André" moment.
18. **Captioned-figure surfaces never carry a hairline frame.** This applies to `<Figure>`, `<YouTube>`, and any future captioned-figure component. The caption row (`FigureCaption`) is the only thing that distinguishes them from prose; a hairline around the figure doubles the boundary the content already has and demotes the figure to "content card" — the editorial-magazine register the system rejects.
19. **Image-container framing is determined by whether prose introduces the surface.** *Identity surfaces* (hero art, stipple article cover, stipple card thumbnails, About profile picture) carry `border border-rule` — no surrounding prose explains them; the hairline says "deliberate object, not stray asset." *Referential surfaces* (`<Figure>`, `<YouTube>`, `ImageMdx` inside MDX prose) are frameless — the paragraph before and the caption row already supply the boundary; a frame would double it. The test: does running prose introduce this image? Yes → frameless. No → hairline.
20. **Notes are stream blocks, not cards.** The Notes index is a chronological feed where every note renders inline, in full, separated by hairline `border-rule` rules — never as cards. Note titles on the index follow standing rule 03 like every other list item: a `<p>` rendered in the `h3` visual variant, not a semantic `<h3>` (the visual treatment is identical; only the element changes). The index block's only meta is `{ISO date} · {kind}` rendered with `<Text variant="meta">` matching `ArticleCard` exactly — date in `text-fg-muted`, kind in `text-fg-subtle`, separated by a `·` middle-dot — not the comment-tag eyebrow register. The index carries **no** per-note eyebrow: the page-head `<NOTES />` already frames the stream, so a per-note `// note` on the list would triplicate. No tags, no reading time, no cover art, no numeric badge. The same `<NoteBlock>` server component renders both `/notes` and `/notes/{slug}` so the feed and the canonical permalink target share one shape, with a single `surface` prop (`'list' | 'detail'`) gating the render differences. The detail surface diverges in four coordinated ways: (1) an `<Eyebrow>// note</Eyebrow>` sits above the title (matching `/articles/[slug]`'s eyebrow → h1 → meta rhythm) — a cold-link visitor landing on `/notes/{slug}` lacks the index page-head's framing, and the kind labels in meta aren't self-identifying as "kinds of notes" to an uninitiated reader, so the explicit `// note` does the framing the meta can't (generic `// note` as category, specific kind in meta as instance); (2) the title becomes a real `<h1>` rendered in the `h1` visual variant (VT323 display font, matching `/articles/[slug]`) because the note title IS the document h1 on its own page — font asymmetry between articles and notes detail titles would read as sloppiness, not register signal; (3) the meta line drops beneath the title (inverted from the index — on the index meta sits above so the reader scans date/kind across a stream of items, on detail the title is the destination and earns top placement, with meta in a supporting caption role); (4) the trailing `permalink` ArrowLink is suppressed (the reader is already at the canonical URL). No element on the block is right-floated; on the index the permalink sits below the body, left-aligned and accent-coloured — the same shape as the `read article` arrow at the foot of `ArticleCard`.

---

## Accessibility floor

WCAG 2.2 AA throughout. Highlights from the contrast matrix (full table in the canon page):

| Foreground | Background | Ratio | Verdict |
|---|---|---|---|
| `--hi` | `--bg` | 14.7 : 1 | AAA |
| `--mid` | `--bg` | 7.92 : 1 | AAA |
| `--lo` | `--bg` | 5.53 : 1 | AA (body) |
| `--lo` | `--surface-2` | 5.33 : 1 | AA (body) |
| `--accent` | `--bg` | 16.4 : 1 | AAA |
| `--accent-hi` | `--bg` | 17.1 : 1 | AAA |
| `--accent-mute` | `--bg` | 2.14 : 1 | Decorative borders only |

Additional floor:

- **Focus indicator** — 2px solid `--accent` outline with 2px offset, square corners. Default browser outlines suppressed only where replaced.
- **Touch targets** — nav links and CTAs ≥ 32px min-height (clears WCAG 2.5.8 AA 24×24 minimum).
- **Skip link** — first focusable on every page; jumps to `#main`.
- **Reduced motion** — global rule zeros `animation-duration` and `transition-duration` to `0.01ms`; press-scale rules and the hero plasma are additionally gated with `@media (prefers-reduced-motion: no-preference)` (plasma renders one static frame instead of looping).
- **`hover: hover` gating** — hover-only states (chip border, photo reveal) are gated to prevent sticky-hover on touch.
- **Color is never the only signal** — accent is paired with brackets (`[home]`), badges (`Featured`), status dots, or `aria-current`.

---

## See also

- `/design-system` route — the live visual reference. 24 components rendered from production code, all tokens, every standing rule.
- `docs/redesign-log.md` — the redesign decision log. Rationale and revision history for every token, principle, and component choice.
- `docs/ui-spec.md` — page-level structure, content sources, and responsive/accessibility annotations.
