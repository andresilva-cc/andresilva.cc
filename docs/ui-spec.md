# UI Spec — andresilva.cc

> Page-level structure for the five pages of the site. The shipped components in `src/` are the source of truth for markup. Token names, components, and standing rules referenced here are defined in `docs/design-system.md` and live-rendered at the `/design-system` route.

---

## Information architecture

Six pages, flat hierarchy, plus a 404 fallback:

```
/                       Home              — orienting page
/about                  About             — full bio, education, facts, résumé
/career                 Career            — full work history
/projects               Projects          — featured + all projects
/articles               Articles          — local article feed
/articles/[slug]        Article (detail)  — single article reading surface
/notes                  Notes             — chronological feed of short notes (page 1)
/notes/page/[n]         Notes (paged)     — pages 2..N of the notes feed
/notes/[slug]           Note (detail)     — canonical permalink for one note
*                       404               — fallback for any unmatched URL
```

Primary nav lives in the header and is identical on every page. The wordmark in the header always links to `/`. Active page wears literal `[brackets]` in the label string AND `aria-current="page"` (which colors it `--accent`). Nav order: `[home] · about · career · projects · articles · notes`.

No secondary nav, no breadcrumbs, no tabs. The flat structure reaches every page in one click from anywhere.

### Shared shell

Every page follows the same outer structure:

```
<a class="skip-link" href="#main">Skip to main</a>
<div class="shell">                              max-width 1240px, 32px horizontal padding
  <header class="bar">…</header>                 wordmark + primary nav, 1px bottom border
  <main id="main">
    {page content}
  </main>
  <footer>…</footer>                             social links row, 1px top border
</div>
```

Footer is verbatim across all pages: a centered, wrapping row of lowercase social text links (`github · linkedin · dev.to · x · instagram · email`) separated by spacing only — no inline `·` glyph between siblings (the dot belongs to within-a-value lists, not between sibling links). At rest, each link is `--fg-subtle`; on hover/focus it lifts to `text-accent` with a 1px underline (same prose-link treatment as `InlineLink`, *not* the `text-accent-strong` brand-emphasis tone). The five external links carry `target="_blank" rel="noopener noreferrer"`. Email link is `mailto:hello@andresilva.cc`.

---

## Page: Home (`/`)

**Purpose** — Orienting page. Quick identity statement plus pointers to the dedicated pages. Home does **not** replicate the content of other pages — it shepherds toward them.

**Audience moment** — First-time visitor or someone returning to find the latest. They need to know in 5 seconds: who he is, what he does, where to go next.

### Sections (in order)

1. **Hero** (`section`, `aria-labelledby="page-title"`)
   - Left column: name (`André Silva` in VT323 display scale `--accent`, plus a blinking cursor span), role line (status dot + `Senior Engineer @ MPA` — title in `--accent`, `@` in `--fg-subtle`, company in `--fg`), one-line pitch (`Software engineer with 9+ years of experience…` with `9+ years of experience` in `<strong>`).
   - Right column: hero plasma (`HeroPlasma`, lg+ only — `hidden lg:block`). Static frame under `prefers-reduced-motion: reduce`.
   - Source: `src/app/(site)/page.tsx` for hero copy; current role from `src/repositories/implementations/static-jobs-repository.tsx` (first entry).
2. **Now band** (`section`, `aria-labelledby="now-h"`)
   - Eyebrow: `// 01 / current focus`. H2: `Now`. No right-rail link.
   - One paragraph about André's current parallel builds — three projects in flight (`Calcloak`, `Infinity`, and the redesign of this site) plus a day-job framing (`MPA`, shipping features end-to-end with Claude Code). Two inline links (`InlineLink`) to `https://calcloak.com/` and `https://meet.agentairforce.com`; the project nouns inside those links are in `<strong>`, and `MPA` is in `<strong>` as a plain (non-link) noun.
3. **Latest band** (`section`, `aria-labelledby="latest-h"`)
   - Eyebrow: `// 02 / recent activity`. H2: `Latest`.
   - `<ul>` of up to four `<li>` items, one per category in this fixed order: a Career row (current role), a Project row (most recent featured project), an Article row (most recent article), a Note row (most recent note). The Article row is omitted entirely when no articles are published; the Note row is omitted entirely when no notes are published. The four are independent — a missing Article does not move Note up the category list; the order is `Career · Project · Article · Note` whenever each row is present.
   - Each row is a `LatestRow` (`<a>`) with a badge (`Career` / `Project` / `Article` / `Note`), the noun, and a trailing link-arrow icon (no visible "Read more" text — the badge names the category, the arrow carries the affordance, the whole row is the link surface). The Career and Project rows link to their list pages (`/career`, `/projects`); the Article and Note rows link straight to the detail page (`/articles/<slug>` and `/notes/<slug>` respectively), not the list — the latest item *is* the destination. The Note row reuses the existing `LatestRow` component verbatim; no new component is needed.
   - Sources: jobs repo → first entry; projects repo → first `featured` entry; articles repo → first entry from the local MDX feed; notes repo → first entry (most recent `publishedAt`) from the local MDX notes collection.

### Key interactions

- **Hero**: plasma animates while `prefers-reduced-motion: no-preference`; renders a single frame otherwise.
- **Now band inline links**: `InlineLink` hover treatment (color lift + underline) on the two external project links.
- **Latest rows**: entire row is the click target. Hover swaps a `::before` overlay opacity (`--surface-2` wash, transform/opacity only); arrow nudges; on press, only `.row__body` scales to 0.97 — the trailing `.row__cta` stays anchored so the hover overlay doesn't jitter.

### Mobile

- ≤ 760px: hero plasma stacks below hero-text (or hides — its column collapses).
- ≤ 480px: header stacks (wordmark first row, nav wrapping below); nav padding tightens to `--s1 --s2`.

### Accessibility

- Skip link target: `#main`.
- `aria-current="page"` on the `[home]` nav item.
- Hero plasma carries `aria-hidden="true"` on the `<aside>` and `role="presentation"` on the `<pre>` (belt-and-braces against screen readers that ignore parent `aria-hidden`).
- Status dot has `aria-label="current role"`.
- Each Latest row's `<a>` has an `aria-label` matching the noun (e.g., `Senior Engineer at MPA`). The Note row's `aria-label` is the note title.
- Focus order: skip-link → wordmark → 6 nav links → 2 Now-band inline links → up to 4 latest rows → 6 footer links.

---

## Page: About (`/about`)

**Purpose** — Full identity surface. Who André is, what he studied, where he lives, how to grab his résumé.

**Audience moment** — Recruiter, prospective collaborator, or curious reader who clicked through from Home wanting more than a one-line pitch.

### Sections (in order)

1. **Page-head** — `<h1 class="title t-pixel"><ABOUT /></h1>` in the brace pattern (VT323 28px, `--accent` noun, `--lo` braces).
2. **Bio band** (`aria-labelledby="bio-h"`)
   - Eyebrow: `// 01 / in my own words`. H2: `Bio`.
   - Two-column grid (`.about-grid`): portrait left (`.photo-wrap`, lime duotone with CRT scanline overlay, clears on focus/hover), three-paragraph bio right with technology nouns in `<strong>`.
   - Source: `src/app/about/page.tsx`. Portrait image: `public/me.jpg`.
3. **Education band** (`aria-labelledby="edu-h"`, `.sec-head--flush`)
   - Eyebrow: `// 02 / where i studied`. H2: `Education`.
   - `.grid-frame.grid-frame--2col` of 2 `.education-cell` items: BS in Computer Science (UNIVALI · 2015 — 2019) and Technical Leadership (Full Cycle · 2024 — 2025).
4. **Facts band** (`aria-labelledby="facts-h"`, `.sec-head--flush`)
   - Eyebrow: `// 03 / at a glance`. H2: `Facts`.
   - `.grid-frame.grid-frame--2col` of 4 `.facts-cell` items: location (Florianópolis, BR), timezone (UTC-03), languages, interests.
5. **Resume band** (`aria-labelledby="resume-h"`)
   - Eyebrow: `// 04 / full work history`. H2: `Resume`.
   - One `.button-cta` link: `Download résumé →` pointing to `/resume.pdf`.

### Key interactions

- **Photo wrap**: at rest, the portrait is in lime duotone with a scanline overlay. Focus or hover dissolves both filter and overlay over 400ms (ease-out). Touch devices get a permanent soft duotone (`--photo-filter-soft`).
- **Resume button**: outlined accent → fills with `--accent-tint` on hover → inverts to solid `--accent` background on press; `scale(0.97)` press-feedback.

### Mobile

- ≤ 760px: `.about-grid` collapses to single column (portrait stacks above prose, photo width capped).
- ≤ 760px: 2-col grid-frames (Education, Facts) collapse to single column with bottom borders instead of right borders.

### Accessibility

- `.photo-wrap` is `tabindex="0"` with `aria-label="Portrait of André Silva — focus or tap to reveal natural color"` so keyboard users can trigger the reveal.
- `.sec-head--flush` on Education and Facts prevents the section head's bottom border from doubling with the grid-frame's top border (standing rule 07).
- Focus order: skip-link → wordmark → 6 nav links → photo wrap → résumé button → footer links.

---

## Page: Career (`/career`)

**Purpose** — Full work history, reverse-chronological, with role descriptions, tech stacks, and external references where applicable.

**Audience moment** — Someone evaluating fit: a recruiter sourcing, a hiring manager doing due diligence, a peer reviewing depth of experience.

### Sections (in order)

1. **Page-head** — `<CAREER />` (same brace pattern as About).
2. **Career list** (`<section aria-label="Career" className="py-8">` — the page's only content section, so no `SectionHead`) — `<ul class="career-list">` of 6 `<li class="role">` items, reverse-chronological:
   - Senior Engineer @ **MPA** (apr 2025 — now, current; carries `// formerly Healthy Labs` line)
   - Senior Front-end Engineer @ Atlas Technologies (jan 2024 — apr 2025)
   - Front-end Engineering Consultant @ Atlas Technologies (mar 2022 — jan 2024)
   - Front-end Engineer @ Atlas Technologies (nov 2021 — mar 2022)
   - CEO & Co-Founder @ Nuxstep (jun 2018 — oct 2021) — has external ref to NativeScript Spotify plugin
   - Software Development Intern @ Grupo Gmaes (mar 2017 — dec 2018) — has external ref to CONFEA
   - Source: `src/repositories/implementations/static-jobs-repository.tsx` (6 real roles, no inventions).

### Role anatomy

Each `.role` is a 2-column grid: date gutter (left, 183px via Tailwind utility `grid-cols-role` — driven by `--grid-template-columns-role: 183px 1fr` in the `@theme inline` block) and content (right).

- **Date gutter**: `.role__dates` text in 12px mono 500 `--mid`, lowercase month abbreviations (e.g., `apr 2025 — now`). Current role additionally carries the pulsing `.status-dot` inline before the dates.
- **Content**:
  - `.role__title` — non-heading `<p>` (standing rule 03): `Title @ Company`. Title in `--hi`, `@` in `--lo`, company in `--accent` (the surface's primary noun on this page).
  - Optional `.role__formerly` line (italic `--lo`, `// formerly X` style) for MPA only.
  - `.role__bullets` — list of `<li>` with `+` lime prefix instead of disc/dash. Achievements in `<strong>`, magnitude metrics in `<strong class="acc">` (e.g., `74% increase`, `20 million monthly visits`).
  - `.role__chips` — wrapping `.tag.tag--chip` strip.
  - Optional `.role__refs` — `link-arrow` external links to a project artifact when one exists (Nuxstep, Grupo Gmaes).

### Key interactions

- Chips hover only nudges border color (standing rule 02 — chip hover is texture, not affordance).
- Status dot pulses unconditionally (`@keyframes pulse`, 2.4s) but is contained to a 6px square and gated by `prefers-reduced-motion`.
- External refs use the standard link-arrow nudge.

### Mobile

- ≤ 760px: 2-col `.role` collapses to single column. Date gutter becomes a horizontal strip above content (flex-direction: row, gap: --s3, padding: --s3 --s4, with `border-bottom: 1px solid --rule`).

### Accessibility

- `<ul class="career-list">` gives screen readers an item-count announcement ("6 items").
- Role titles are `<p>`, not `<h3>` (standing rule 03) — the document outline is `page-h1 → list-of-items`.
- All external refs carry `target="_blank" rel="noopener noreferrer"`.
- Focus order: skip-link → wordmark → 6 nav links → each role's external ref (if present) → footer links.

---

## Page: Projects (`/projects`)

**Purpose** — Complete catalog of side projects, OSS work, and built artifacts. Featured items lead; the rest follow in the same grid.

**Audience moment** — Someone gauging breadth and craft. They want to scan a wall of work and click into the few that catch their eye.

### Sections (in order)

1. **Page-head** — `<PROJECTS />`.
2. **Projects list** (`<section aria-label="Projects" className="py-8">` — the page's only content section, so no `SectionHead`) — `<ul class="grid grid-frame grid-frame--3col">` of 19 `<li class="pr">` items, featured first.
   - Featured items carry `.pr--is-featured` plus a `.pr__badge` reading `Featured` in the top-right corner.
   - Source: `src/repositories/implementations/static-projects-repository.ts` (19 real projects; the 3 featured are Grafex, Infinity, and Calcloak, in that order).

### Project card anatomy (`.pr`)

- `.pr__title` — non-heading `<p>` in `--hi` 16px mono 600. Featured cards apply Tailwind `pr-22` (88px right padding on the title row) so the corner badge clears.
- `.pr__desc` — one-line description in `--mid`, capped at `--prose-w-card` (38ch).
- `.pr__chips` — wrapping tech chips.
- `.pr__links` — `link-arrow` links to `site` and/or `github`.

### Key interactions

- Card hover: cell border thickens visually via the grid-frame's existing rules (no shadow); the link arrow inside the card responds on its own hover.
- Chips: border-color nudge on hover only.

### Mobile

- ≤ 760px: 3-col grid collapses to 2-col, with internal borders re-paired (last 2 cells lose bottom border, every 2nd cell loses right border).

### Accessibility

- `<ul>/<li>` for the project list (standing rule 03 — database rows).
- `.pr__title` is non-heading; the page's only `<h1>` is the page-head.
- Featured badges are decorative-looking but carry the `Featured` text label, so the categorization is conveyed without color alone (standing rule + WCAG 1.4.1).
- Focus order: skip-link → wordmark → 6 nav links → each project's site/github links in DOM order → footer.

---

## Page: Articles (`/articles`)

**Purpose** — Reader feed of André's self-hosted MDX posts. Each entry is a self-contained card with date, reading time, an optional stipple-art thumbnail, description, tags, and a "read article" link to the detail page.

**Audience moment** — Someone deciding whether to invest time reading. They scan the title, glance at the illustration, check tags and length, then either click through or move on.

### Sections (in order)

1. **Page-head** — `<ARTICLES />`.
2. **Articles list** (`<section aria-label="Articles" className="py-8">` — the page's only content section, so no `SectionHead`) — `<ul>` of `<ArticleCard>` items.
   - Source: `LocalArticlesRepository` — Velite-compiled MDX files in `src/content/articles/*.mdx`. Titles, dates, reading time, tags come from frontmatter; nothing is fetched at runtime.
   - Empty state: `<Text variant="body" className="text-fg-muted">No articles yet.</Text>` (rendered when `articles.length === 0`).

### Article card anatomy (`ArticleCard`)

A 2-column grid at `md+` (`grid-cols-article-card` — 240px left, body right) **only when an illustration is present**; single column otherwise. List items are separated by `border-b border-rule` (no last-row border).

- **Left (illustration)** — only when `article.coverArt` is set in frontmatter. Wraps an `<ArticleIllustration>` (which renders `<StippleArt>` configured via the `coverArt.params` permalink hash) in a `border border-rule bg-canvas overflow-hidden` frame, `aspect-video` on mobile and `md:aspect-auto md:min-h-44` (stretching to body height) on desktop. **Canvas-coloured, never `bg-surface`** — stipple art is transparent ASCII glyphs, so the container fill *is* the art's perceived background. The frame links to the article detail page. Honors `prefers-reduced-motion`.
- **Right (body)**:
  - **Meta line** — `Text variant="meta"`, inline-flex with `gap-2`. Date in `--fg-muted`, then `·`, then `${readingTime} min` in `--fg-subtle`. **No reactions, no comments** — those were Forem-only and dropped on migration. **No inline tags** — tags render as chips below (Q1 reversal, see `articles-decision-log.md` §16b).
  - **Title** — non-heading `Text variant="h3" as="p"` wrapping an `<InlineLink>` to `/articles/[slug]` (internal route, not external).
  - **Description** — `Text variant="body"` with `text-fg-muted max-w-prose-wide`, source is `article.summary` from frontmatter.
  - **Tag chips** — wrapping flex row of `<Tag>` chips, brand-cased per `tag.tsx`. Chips are **non-interactive** — there is no filter UI and no list-by-tag page (`articles-decision-log.md` §2).
  - **Trailing `ArrowLink`** — `read article` pointing to the same `/articles/[slug]`.

### Key interactions

- Title `InlineLink` uses the prose-link hover treatment (color lift + underline).
- Tail `ArrowLink` carries the standard chevron-nudge on hover.
- Card itself is not the click target — title, illustration frame, and trailing arrow all lead to the same URL; the description and meta strip stay passive.

### Mobile

- ≤ 760px: 2-col layout collapses to single column. Illustration (when present) goes above the body at `aspect-video`.

### Accessibility

- `StippleArt` illustrations are decorative — the title carries the meaning. Wrapping link exposes the article title as accessible name (see `ArticleIllustration`).
- `<ul>/<li>` for the list (standing rule 03).
- Title `<a>` exposes the full headline as link text (no "click here" buttons).
- Tags are rendered as plain `<span>` chips (non-interactive) — skipped in tab order.
- Focus order: skip-link → wordmark → 6 nav links → each article's illustration link + title link + tail arrow in DOM order → footer.

---

## Page: Article detail (`/articles/[slug]`)

**Purpose** — The reading surface for a single article. One MDX post rendered with the site's prose treatment, framed by an identity cluster (eyebrow / title / summary / meta) at the top and syndication + return affordances at the bottom.

**Audience moment** — A reader who clicked through from the feed (or landed via search / external link) and wants to read end-to-end without friction. Long-form attention — the page should disappear, the prose should carry.

### Sections (in order)

1. **Top return** — `ArrowLink` `direction="back"` reading `back to articles`, sitting above the identity cluster (`pt-8`). Gives keyboard and mouse users a one-tab exit before they commit to scrolling.
2. **Identity cluster** (page header)
   - **Eyebrow** — `// article` (authored as a string variable to dodge the `react/jsx-no-comment-textnodes` lint; lowercase string, uppercased via CSS), `--accent`.
   - **H1 title** — `Text variant="h1"` in `--fg`. **Not** `t-display` / VT323 — the display register is reserved for the Home identity moment (standing rule). Article titles get the standard h1 mono treatment so 50+ posts at varying lengths read consistently.
   - **Summary** — `Text variant="body"`, `--fg-muted`, capped at `--prose-w-wide` (matches the body column below).
   - **Meta strip** — single `<p>` with `<time dateTime>` (in `--fg-muted`) followed by `·` and `${readingTime} min` (in `--fg-subtle`). **No tags inline** (Q1 reversal — tags render as chips in the footer only). Optional second meta line `// last updated {date}` in italic `--fg-subtle` when `updatedAt` is set.
3. **Cover art** (optional — only when `article.coverArt` is present in frontmatter)
   - Preceded by a `<hr>` rule (8px top margin) to separate the identity cluster from the visual.
   - `<section aria-label="Cover art">` containing a `.article-cover-art` frame: `border border-rule bg-canvas`, `overflow-hidden`, `max-w-prose-wide`, aspect ratio `16 / 7` on desktop and `4 / 3` on mobile (set in `globals.css`). Standing rule 19 — identity surface keeps the border even though the art is transparent.
   - Inside the frame, `<StippleArt>` renders at its **native grid resolution** (no explicit `cols`/`rows`) so the cover gets stipple's signature fine grain (~180 × 46 cells at desktop). Configured via the `params` permalink hash from frontmatter. `mode="always"` (no scroll-gating on the detail page), `fit="cover"`, `link="none"`. Honors `prefers-reduced-motion`. Card thumbnails on `/articles` are a reduced preview, not a pixel-identical miniature (see `articles-decision-log.md` §16b).
4. **Article body** — `<hr>` separator, then `<div class="article-prose max-w-prose-wide">` containing the compiled MDX (`<Content components={mdxComponents} />`).
   - MDX component map: headings + paragraphs from `.article-prose` styles; `a` → `InlineLink`; `pre` → `PreShiki` (Shiki-highlighted code with a `CopyButton` action); `img` → `<ImageMdx>` for plain `![alt](src)`; `<Figure>` and `<YouTube>` for richer embeds (both wrap their content with `<FigureCaption>`).
   - Tables, ordered/unordered lists, blockquotes, inline code, and horizontal rules all inherit from `article-prose` — see the design-system prose section.
5. **Footer** (in DOM order)
   - **Tag chips** — `<ul>` of `Tag` chips (brand-cased per `tag.tsx`), wrapping, when `article.tags.length > 0`. Chips are the **only** surface where tags appear on this page (Q1 reversal).
   - **Syndication block** — when `article.devtoUrl` is present: `Eyebrow` reading `// elsewhere`, then an `ArrowLink` to the dev.to mirror reading `also on dev.to`. Omitted entirely for posts that never crossposted.
   - **Bottom return** — `ArrowLink` `direction="back"` reading `back to articles`, sitting in a `pb-12` block so the last interactive element clears the footer border by a comfortable margin.
6. **JSON-LD `BlogPosting`** — `<script type="application/ld+json">` block at the end of the `<article>` element. Carries `headline`, `description`, `datePublished`, `dateModified`, `author`, `url`, `image` (absolute `ogImage`), `keywords` (tags joined by `, `), `wordCount`, `timeRequired` (`PT{readingTime}M`), `inLanguage` (`en`), and `isPartOf` (`andresilva.cc/articles` Blog). The serialized JSON escapes any literal `</script>` substring (defensive — frontmatter strings can in principle contain it).

### Key interactions

- **Both return ArrowLinks** carry the standard `direction="back"` chevron-nudge on hover.
- **Stipple cover** loops at the framerate configured in the permalink params and pauses under `prefers-reduced-motion: reduce` (the StippleArt component handles this internally).
- **Code blocks** show a `CopyButton` on hover/focus that toasts on success — no separate visible toast tray, the button itself swaps label.
- **InlineLink prose links** use the prose-link treatment (color lift + underline on hover/focus), not the brand-emphasis `text-accent-strong` tone.

### Mobile

- ≤ 760px: identity cluster stays full-width within `--prose-w-wide`; cover-art frame swaps to `4 / 3` aspect ratio (set in `globals.css`) so portrait-oriented phones don't get a sliver of dot field.
- ≤ 480px: header stacks per the shared shell. Body prose stays at `max-w-prose-wide` (which naturally narrows to viewport width minus shell padding); code blocks scroll horizontally rather than wrapping; tables become scrollable in their wrapping container.

### Accessibility

- Document outline: `page-h1 (article title) → article-prose headings`. The eyebrow is a `<p>`, not a heading. The cover-art section is named with `aria-label`, never a visible h2.
- Cover-art `<section aria-label="Cover art">` so screen readers can skip the stipple field; the `<StippleArt>` itself is decorative.
- The two `ArrowLink direction="back"` instances are both reachable in the tab order — duplication is intentional (top for short-attention exit, bottom for end-of-read return).
- Code-block `CopyButton` is a real `<button>` with `aria-live` feedback for the copy result, focusable from keyboard.
- JSON-LD is invisible to AT (script-typed) but improves rich-result rendering and link previews — required by `architecture.md` §7.
- `<time dateTime>` carries the machine-readable ISO date; the visible string is human-formatted (`formatArticleDate`).
- Focus order: skip-link → wordmark → 6 nav links → top back-link → any cover-art links (none by default — `link="none"`) → in-prose links + code-block copy buttons in DOM order → tag chips (non-interactive, skipped) → syndication arrow → bottom back-link → footer links.

### Sources

- Article record: `articlesRepository.getBySlug(slug)` (Velite-compiled MDX from `content/articles/*.mdx`).
- Compiled MDX body: `article.body` (function-body string) is `run()` through `@mdx-js/mdx` at request time — build-time-trusted input, not user input.
- Frontmatter schema (title, summary, publishedAt, updatedAt, readingTime, wordCount, tags, devtoUrl, coverArt, ogImage): see `architecture.md` and `articles-decision-log.md` §4.

---

## Page: Notes (`/notes`, `/notes/page/[n]`)

**Purpose** — Chronological feed of short, unpolished pieces (TILs, hot takes, code snippets, asides). Distinct from `/articles`: notes are stream blocks, not cards. The reader scrolls a single linear column where every note appears in full, separated by hairline rules. Page 1 lives at `/notes`; pages 2..N at `/notes/page/<n>`.

**Audience moment** — A reader who follows André's thinking in fragments. They want the latest few items at a glance, not a feed they curate or filter. The detail page is for sharing one specific note out — the index is for reading.

### Sections (in order)

1. **Page-head** — `<PageHead name="NOTES" />` in the brace pattern (VT323 28px, `--accent` noun, `--lo` braces). No subtitle, no intro paragraph — the head is the whole identity gesture.
2. **Notes list** (`<section aria-label="Notes" className="py-8">` — the page's only content section, so no `SectionHead`) — a `<ul>` of up to 50 `<li>` items, each containing one `<NoteBlock>`, reverse-chronological by `publishedAt`. The `<ul>` carries `divide-y divide-rule` (or equivalent — a single 1px `border-rule` rule between items, no trailing rule on the last child). No outer card border, no grid frame.
   - **Pagination affordance**: when more than 50 notes exist, a paginator sits below the list. Treatment: two `link-arrow` instances on a single row, mono `text-meta`, separated by a `·` middle-dot. `← older notes` points to the next page (`/notes/page/{n+1}`); `newer notes →` points to the previous page (`/notes/page/{n-1}`, or `/notes` for page 2 → page 1). Either link is omitted entirely at the boundaries (no disabled state — absent affordance is the cleaner brutalist signal). Between them, a quiet `page {n} of {total}` label in `--lo` `text-meta` (non-interactive). The paginator pattern is mirrored on `/notes/page/[n]` — identical component, different params.
   - Source: `LocalNotesRepository.getAll()` — Velite-compiled MDX from `src/content/notes/*.mdx`. Already sorted by `publishedAt` descending; page slicing is `[(n-1)*50, n*50]`.
   - **Empty state** (only relevant on `/notes` itself; the paginated routes are unreachable when empty): `<Text variant="body" className="text-fg-muted">No notes yet.</Text>` — same construction as the articles empty state, no eyebrow, no illustration.

### Note block anatomy (`<NoteBlock>` — server component)

The single rendering unit, shared verbatim with the detail page. Layout is a vertical stack, no grid, full prose-wide column (`max-w-prose-wide` / 68ch); the wider 80ch `max-w-prose-figure` is still available to in-body figures via the existing MDX components.

- **Wrapping element**: `<article id="{slug}">` so `/notes#{slug}` deep-links into the block on the index. The `id` is `{slug}`, not `note-{slug}`, to keep permalink URLs short.
- **Meta line** — a single row, mono `text-micro` 600 lowercase, color `--lo`, in the existing comment-tag eyebrow register (the same one used for `// 01 / current focus`-style eyebrows elsewhere, minus the `//` prefix). Format: `{ISO date} · {kind}` where date is `YYYY.MM.DD` (e.g., `2026.05.21`) and `kind` is one of `til | take | snippet | aside` rendered lowercase. The separator is a `·` middle-dot with a single space on each side. The `<time dateTime>` carries the ISO date for machine readability; the visible string is dot-separated for the brutalist register. A trailing `<ArrowLink href="/notes/{slug}">permalink</ArrowLink>` sits on the same line at the right edge (push the arrow link to the right with `ml-auto` or a flex justify-between). The permalink arrow uses the standard link-arrow nudge; at rest it is `--lo` `text-micro`, on hover it lifts to `--accent` with the 2px arrow nudge.
- **Title** — `<h3>` in `text-h3` (mono 600, 16px, line-height 1.3), color `--fg`. Sentence case, no terminal period. The title is **not** a link in the index — the permalink affordance on the meta line carries that role, and the title visually is the block's own headline, not a CTA. (On the detail page, the title is also `<h3>` — see "On the detail page" below for why h1 is not used.)
- **Body** — the compiled MDX, styled by the same `.article-prose` rules as `/articles/[slug]`: paragraphs, headings (`h4`+ inside the note body — `h2`/`h3` are reserved for structure outside the body to keep the outline clean), code blocks (Shiki-themed via `PreShiki` with `CopyButton`), inline code, blockquotes, lists, tables, `<Figure>`, `<YouTube>`, `<ImageMdx>`. No restrictions. The body sits at `max-w-prose-wide` to match prose elsewhere.
- **No cover art, no tags, no reading time, no card border, no numeric badge.** The hairline rule between sibling blocks is the only separator.

### Heading-outline note

The document outline on `/notes` is `page-h1 (NOTES) → h3 per note`. The h2 level is intentionally skipped: per standing rule 16, single-section pages do not carry a `SectionHead`, and per standing rule 20 each note is genuinely a sub-article, not a card. The skipped level is a deliberate signal that there is no page-internal subdivision; the AT-announced structure is "page heading → list of articles," which matches how the reader consumes it.

### Key interactions

- **Permalink arrow** — standard link-arrow nudge on hover. Whole row is not the click target — only the arrow link is interactive on each block. The block intentionally has no hover surface; it is read, not clicked.
- **In-body affordances** — `InlineLink` (color lift + underline), `PreShiki` `CopyButton` (revealed on `group-hover/pre`), `YouTube` click-to-load — all behave identically to the article surface. The MDX components map is the same one used by `/articles/[slug]` (`YouTube`, `Figure`, `img → ImageMdx`, `a → InlineLink`, `pre → PreShiki`).
- **Pagination links** — standard link-arrow nudge on hover.
- **Reduced motion** — honored by every island the body may carry (`YouTube` façade, `StippleArt` if a note ever ships one). The block itself has no animation.

### Mobile

- ≤ 760px: layout is unchanged — the column was already a single-column prose stack. Meta line wraps if needed (date+kind stays together; permalink wraps to a second line at the right edge if the title plus date overflows). Code blocks scroll horizontally inside their MDX block; tables become scrollable in their wrapping container.
- ≤ 480px: header stacks per the shared shell.

### Accessibility

- Skip link target: `#main`.
- `<ul>/<li>` for the list — screen readers announce item count for the current page (e.g., "50 items," "8 items" on the last page).
- Each note is wrapped in `<article id="{slug}">` so AT announces a navigable landmark per block; the `<h3>` inside is the article's heading.
- Permalink `<ArrowLink>` carries the accessible name `permalink to {note title}` (`aria-label`), not just the visible `permalink` text — the visible text is too generic for an out-of-context AT readout.
- `<time dateTime="{ISO}">` provides machine-readable date; visible string is the brutalist `YYYY.MM.DD` form.
- Code-block `CopyButton` and `YouTube` swap follow their existing accessibility contracts.
- Focus order on page 1: skip-link → wordmark → 6 nav links → each note's permalink arrow + any in-body links + any in-body copy buttons + any `YouTube` façades in DOM order → paginator (when present: older link → newer link in DOM order; absent links skipped) → footer links.

### Sources

- Note records: `notesRepository.getAll()` (Velite-compiled MDX from `src/content/notes/*.mdx`).
- Compiled MDX body: `note.body` is `run()` through `@mdx-js/mdx` at request time — build-time-trusted input.
- Frontmatter schema (`title`, `publishedAt`, `kind`): see `architecture.md` §7.

---

## Page: Note detail (`/notes/[slug]`)

**Purpose** — Canonical permalink for a single note. Same `<NoteBlock>` rendering as on the index, plus chronological prev/next nav and a "back to notes" affordance. This is the page search engines and social previews land on; the index hash anchor (`/notes#{slug}`) is a convenience, not a canonical target.

**Audience moment** — Someone who followed a shared permalink, a search-engine result, or a syndicated link. They land mid-stream and want to read the one note, optionally step to the next or previous in the chronological feed, and return to the full index.

### Sections (in order)

1. **Top return** — `<ArrowLink direction="back">back to notes</ArrowLink>` pointing to `/notes`, sitting above the note block (`pt-8`). Mirrors the article-detail pattern; gives keyboard and mouse users a one-tab exit before they commit to reading.
2. **Note block** — a single `<NoteBlock>` rendered identically to its index appearance: meta line (`{ISO date} · {kind}` + permalink arrow), `<h3>` title, MDX body. The permalink arrow on the detail page is present and still points to `/notes/{slug}` (so it's a self-link); keeping it preserves visual parity with the index and gives readers a one-click "copy this URL" anchor.
3. **Prev/next chronological nav** — a single row below the block, separated from it by an `<hr class="border-rule" />` (the same hairline used between sibling blocks on the index, so the detail page reads as one entry plucked from the feed with the rule still in place above and below it). The row carries two `<ArrowLink>` instances on a flex row with `justify-between`:
   - **Left** — `<ArrowLink direction="back" href="/notes/{older.slug}">older · {older.title}</ArrowLink>` (chronologically older — earlier `publishedAt`). The title is truncated with CSS `text-overflow: ellipsis` if longer than ~40ch so the row never wraps to two lines.
   - **Right** — `<ArrowLink href="/notes/{newer.slug}">{newer.title} · newer →</ArrowLink>` (chronologically newer — later `publishedAt`).
   - Each is omitted entirely at the chronological boundaries (first or last note) — no disabled state, same brutalist absent-affordance pattern as the index paginator. Both labels carry the `·` middle-dot as the conjunction between the role word (`older`/`newer`) and the title.
4. **Bottom return** — `<ArrowLink direction="back">back to notes</ArrowLink>` again, sitting in a `pb-12` block so the last interactive element clears the footer border by a comfortable margin. Duplicating the top return is the same convention used on `/articles/[slug]` — top for short-attention exit, bottom for end-of-read return.
5. **JSON-LD `BlogPosting`** — `<script type="application/ld+json">` block at the end of the page. Carries `headline` (note title), `datePublished` (note `publishedAt`), `author`, `url` (canonical `/notes/{slug}`), `image` (absolute `/og/notes/default.png` — the single shared notes OG card, see `architecture.md` §7), `inLanguage` (`en`), and `isPartOf` (`andresilva.cc/notes`). No `description` (notes have no `summary`), no `wordCount` / `timeRequired` (notes have no reading-time metadata), no `keywords` (notes have no tags), no `dateModified` (notes have no `updatedAt`). Server Component, no client overhead.

### Heading note

The page's `<h3>` is the only heading on the surface — there is no page-head brace title (no `<NOTE_TITLE />` equivalent) because the note's own title carries the identity gesture and the brace pattern is reserved for **page** identity, not **content** identity. The document outline therefore is `h3 (note title) → in-body headings h4+`. This is an intentional outline shape: from an AT perspective the page is a single short article, not a structured page.

If the heading-skip from page-`<h1>`-implied to `<h3>` becomes a real concern (e.g., a third-party linter flags the outline), the alternative is to render the note's title as `<h1>` on the detail page only — but doing so means `<NoteBlock>` no longer renders identically on both surfaces, and the shared-component contract is the load-bearing decision. Status: documented and accepted.

### Key interactions

- **Both back-link ArrowLinks** carry the standard `direction="back"` chevron-nudge on hover.
- **Prev/next nav** — both arrows nudge on hover (chevron-left on older, chevron-right on newer). The truncation ellipsis on the title text is purely visual; the full title is available to AT via the link's accessible name.
- **Permalink self-link on the block** — same nudge; clicking it loads the same URL (effectively a no-op for the reader, but copy-link UI in most browsers shows the full URL on hover/focus).
- **In-body affordances** — identical to the index (`InlineLink`, `PreShiki` `CopyButton`, `YouTube` swap).
- **No related-notes section, no recommended-reading, no syndication block** (notes are not crossposted, per `architecture.md` §14).

### Mobile

- ≤ 760px: prev/next row stacks to two lines if either title's truncated length still overflows — older above, newer below, both still full-width. Otherwise unchanged from desktop. Code blocks and tables scroll horizontally per the article-detail rules.
- ≤ 480px: header stacks per the shared shell. Body prose stays at `max-w-prose-wide`.

### Accessibility

- `<link rel="canonical" href="{absolute /notes/{slug} URL}" />` in `<head>` so search engines treat the detail page as canonical and the index hash anchor as a navigational alias.
- `<title>` is `{note title} | André Silva`. Browser tab and back-button history label both communicate which note is open.
- Document outline: `h3 (note title) → h4+ in-body`. Detailed rationale above; no `aria-labelledby` is set on the body landmark (the `<article>` wrapper inside `<NoteBlock>` already exposes the heading).
- The two top/bottom back-links are both reachable in tab order — duplication is intentional, mirroring `/articles/[slug]`.
- Prev/next arrows: each carries an `aria-label` of `older note: {title}` and `newer note: {title}` so the AT readout includes the relationship even when the visible label is truncated.
- Focus order: skip-link → wordmark → 6 nav links → top back-link → permalink arrow on the block → any in-prose links + code-block copy buttons + YouTube façades in DOM order → older arrow (if present) → newer arrow (if present) → bottom back-link → footer links.

### Sources

- Note record: `notesRepository.getBySlug(slug)` (Velite-compiled MDX from `src/content/notes/*.mdx`).
- Prev/next: derived from `notesRepository.getAll()` (already sorted by `publishedAt` descending) — older = next index in the sorted array, newer = previous index. Computed in the page component, not a separate repository method.
- Compiled MDX body: `note.body` is `run()` through `@mdx-js/mdx` at request time.

---

## Page: 404 (Not Found)

**Purpose** — Fallback surface served by Next.js (`src/app/not-found.tsx`) for any URL that doesn’t match a defined route. Tells the visitor the URL didn’t match, and offers a single recovery affordance back to Home. The header nav stays on the page (it’s part of the shared shell) and carries the visitor to the other four sections in one click — no need to repeat those destinations inline.

**Audience moment** — Someone who mistyped a URL, followed a stale link, or hit a moved-but-not-redirected route. They need to know in 2 seconds: this address isn’t a page, and where to go from here.

### Sections (in order)

1. **Page-head** — `<h1 class="title t-pixel"><NOT_FOUND /></h1>` in the brace pattern. Authored in caps (`NOT_FOUND`); the underscore preserves token-style readability. Same VT323 28px and `.brace` decoration as `<ABOUT />`, `<CAREER />`, etc., so the 404 reads as a first-class interior page rather than a generic error frame.
2. **Status band** (`section.band`, `aria-labelledby="status-h"`)
   - Eyebrow: `// 01 / status 404`. H2: `Page not found.`
   - One short paragraph: `The URL didn’t match any page on this site. Try one of the surfaces below.`
   - One `ArrowLink` to `/` labeled `home`. Placed below the paragraph (not in the SectionHead `cta` slot — this is the page’s primary action, not a section header right-rail link).
   - This is the *only* section on the page. Numbering still uses `// 01` because eyebrow numbering restarts per page (per copy-guide §2).

### Pseudo-JSX

```tsx
<PageHead name="NOT_FOUND" />

<section aria-labelledby="status-h" className="band">
  <SectionHead
    eyebrow="// 01 / status 404"
    title="Page not found."
    id="status-h"
  />
  <Text variant="body" className="text-fg-muted max-w-prose">
    The URL didn’t match any page on this site. Try one of the surfaces below.
  </Text>
  <ArrowLink href="/">home</ArrowLink>
</section>
```

(Exact spacing, container classes, and prose-width tokens are implementation concerns — the engineer matches the banded-section rhythm used on Career and Articles. Body paragraph caps at `--prose-w` like every other prose block on the site.)

### Why the brace head reads `<NOT_FOUND />`, not `<404 />`

In JSX, tag names cannot lead with a digit — `<404 />` is invalid syntax. For a site whose typographic conceit *is* developer-flavored, a brace head that wouldn’t parse breaks the joke. `NOT_FOUND` (uppercase snake_case) reads like an HTTP/enum constant, parses as a valid identifier, and pairs with the eyebrow `// 01 / status 404` which carries the numeric code. Together they say "the HTTP status this page represents is 404 NOT FOUND", split across two lines of typographic register — code in the eyebrow, identifier in the brace head, status text in the H2. The number itself never gets a display-scale moment, by design: the 404 is *not* more important than the home hero or the page-head of any real page.

### Key interactions

- None beyond the shared header nav and the single ArrowLink. The page has no hover-revealed content, no decorative animation, no plasma — staying quiet is the point.
- Reduced-motion: nothing to gate. The ArrowLink’s 2px nudge on hover is already motion-safe.

### Mobile

- ≤ 760px: identical to every other banded section — single column, body prose stays at `--prose-w`, ArrowLink stays inline below the paragraph. Nothing to collapse since there is no multi-column layout on this page.
- ≤ 480px: header stacks (per the shared-shell rule), nav still reaches every other route in one tap. The 404 body is one short paragraph, so even at 320px viewport it’s a single fold.

### Accessibility

- Skip link target: `#main` (shared shell).
- `<h1>` is the brace head; `<h2>` is `Page not found.`. The document outline is `page-h1 → one-section-h2`, matching the structure of `/articles` and `/projects`.
- Body text contrast: `--mid` on `--bg` = 7.92:1 (AAA), well above floor.
- ArrowLink to `/` is keyboard-focusable, carries a visible focus indicator from the shared focus-ring rule, and uses a real anchor (no `onClick` button shim).
- No `aria-live` region — the 404 isn’t a dynamic state announcement, it’s a static page reached by navigation.
- `<title>` is `André Silva · Not Found`. The browser tab and the back-button history label both communicate the error clearly.
- Server response: route returns HTTP **404 Not Found** (Next.js `not-found.tsx` handles this automatically). The page must not return 200 — robots and link-checkers rely on the status code.

### Sources

- No data sources. The page is fully static; all strings live in `docs/copy-guide.md` §7 (the 404 microcopy block).

---

## Cross-page conventions

- **Section bands**: 32px top/bottom padding (`--s8`), 1px `--rule` bottom border; the last `.band` in `<main>` drops its bottom border.
- **Section head pattern**: a `SectionHead` (a `.comment-tag` eyebrow `// 01 / …` above an H2) delimits subdivisions *within* a page — it appears only on a page with two or more content sections (About, with Bio / Education / Facts / Resume). A single-section page (Career, Projects, Articles, Notes) omits the `SectionHead` entirely: it goes straight from the `PageHead` h1 into its content, and the lone `<section>` is named with `aria-label`, never a visible h2 that would duplicate the page h1. The 404 page is the deliberate exception — it has one section but keeps a `SectionHead` because its h2 (`Page not found.`) carries real, non-duplicating information. Where present, eyebrow numbering restarts per page.
- **Brace H1 pattern**: every inner page uses `<X />` (e.g., `<ABOUT />`); Home uses the name itself as the identity moment instead.
- **Curly quotes everywhere in prose** (standing rule 09). Straight quotes only inside attributes, code, and CSS strings.
- **Reduced motion** is honored globally; press-scale and looping animations are additionally gated with `@media (prefers-reduced-motion: no-preference)`.
