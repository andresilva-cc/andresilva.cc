# UI Spec — andresilva.cc

> Page-level structure for the five pages of the site. Pulls from the HTML mocks in `redesign/` (the source of truth for markup). Token names, components, and standing rules referenced here are defined in `docs/design-system.md` and live-rendered in `redesign/design-system.html`.

---

## Information architecture

Five pages, flat hierarchy, plus a 404 fallback:

```
/             Home       — orienting page
/about        About      — full bio, education, facts, résumé
/career       Career     — full work history
/projects     Projects   — featured + all projects
/articles     Articles   — dev.to feed
*             404        — fallback for any unmatched URL
```

Primary nav lives in the header and is identical on every page. The wordmark in the header always links to `/`. Active page wears literal `[brackets]` in the label string AND `aria-current="page"` (which colors it `--accent`). Nav order: `[home] · about · career · projects · articles`.

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

Footer is verbatim across all pages: `github · linkedin · dev.to · email` as lowercase text links separated by `·` (U+00B7) dots. All four external links carry `target="_blank" rel="noopener noreferrer"`. Email link is `mailto:hello@andresilva.cc`.

---

## Page: Home (`/`)

**Purpose** — Orienting page. Quick identity statement plus pointers to the dedicated pages. Home does **not** replicate the content of other pages — it shepherds toward them.

**Audience moment** — First-time visitor or someone returning to find the latest. They need to know in 5 seconds: who he is, what he does, where to go next.

### Sections (in order)

1. **Hero** (`section.hero`, `aria-labelledby="page-title"`)
   - Left column: name (`<h1 class="name t-pixel">André Silva</h1>` in VT323 56px `--accent`, plus a blinking cursor span), role line (status dot + `Senior Engineer @ MPA`), one-line pitch (`Software engineer with 9+ years of experience…`).
   - Right column: hero plasma (ASCII field rendered in a `<pre>`, `role="presentation"`, accent characters stand out from `--mid` characters). Static frame under `prefers-reduced-motion: reduce`.
   - Source: `src/app/page.tsx` for hero copy; current role from `src/repositories/implementations/static-jobs-repository.tsx` (first entry).
2. **Bio band** (`section.band`, `aria-labelledby="bio-h"`)
   - Eyebrow: `// 01 / who`. H2: `Bio`. Right-aligned link-arrow → `about.html` labeled `Full bio`.
   - One paragraph summary with technology nouns in `<strong>` (`TypeScript`, `Vue.js`, `Nuxt`, `React`, `Node.js`).
3. **Latest band** (`section.band`, `aria-labelledby="latest-h"`)
   - Eyebrow: `// 02 / what i'm doing now`. H2: `Latest`.
   - `<ul class="rows">` of exactly three `<li>` items, one per category: a Career row (current role), a Project row (most recent featured), an Article row (most recent dev.to post).
   - Each row is `<a class="row">` with a badge (`Career` / `Project` / `Article`), the noun in `<strong>`, and a trailing link-arrow icon (no visible "Read more" text — the badge names the category, the arrow carries the affordance, the whole row is the link surface).
   - Sources: jobs repo → first entry; projects repo → first featured entry; articles → first item from `https://dev.to/andresilva-cc` feed.

### Key interactions

- **Hero**: plasma animates while `prefers-reduced-motion: no-preference`; renders a single frame otherwise.
- **Bio "Full bio" link**: hover lifts color to `--accent-hi`, underline appears with 3px offset; arrow icon nudges 2px right.
- **Latest rows**: entire row is the click target. Hover swaps a `::before` overlay opacity (`--surface-2` wash, transform/opacity only); arrow nudges; on press, only `.row__body` scales to 0.97 — the trailing `.row__cta` stays anchored so the hover overlay doesn't jitter.

### Mobile

- ≤ 760px: hero plasma stacks below hero-text (or hides — its column collapses).
- ≤ 480px: header stacks (wordmark first row, nav wrapping below); nav padding tightens to `--s1 --s2`.

### Accessibility

- Skip link target: `#main`.
- `aria-current="page"` on the `[home]` nav item.
- Hero plasma carries `aria-hidden="true"` on the `<aside>` and `role="presentation"` on the `<pre>` (belt-and-braces against screen readers that ignore parent `aria-hidden`).
- Status dot has `aria-label="current role"`.
- Each Latest row's `<a>` has an `aria-label` matching the noun (e.g., `Senior Engineer at MPA`).
- Focus order: skip-link → wordmark → 5 nav links → bio "Full bio" link → 3 latest rows → 4 footer links.

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
   - `.grid-frame.grid-frame--2col` of 2 `.education-cell` items: BS in Computer Science (UNIVALI · 2015 — 2019) and Technical Leadership (Full Cycle · 2022 — 2023).
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
- Focus order: skip-link → wordmark → 5 nav links → photo wrap → résumé button → footer links.

---

## Page: Career (`/career`)

**Purpose** — Full work history, reverse-chronological, with role descriptions, tech stacks, and external references where applicable.

**Audience moment** — Someone evaluating fit: a recruiter sourcing, a hiring manager doing due diligence, a peer reviewing depth of experience.

### Sections (in order)

1. **Page-head** — `<CAREER />` (same brace pattern as About).
2. **Career list** (`section.band`, `aria-label="Career"`) — `<ul class="career-list">` of 6 `<li class="role">` items, reverse-chronological:
   - Senior Engineer @ **MPA** (apr 2025 — now, current; carries `// formerly Healthy Labs` line)
   - Senior Front-end Engineer @ Atlas Technologies (jan 2024 — apr 2025)
   - Front-end Engineering Consultant @ Atlas Technologies (mar 2022 — jan 2024)
   - Front-end Engineer @ Atlas Technologies (nov 2021 — mar 2022)
   - CEO & Co-Founder @ Nuxstep (jun 2018 — oct 2021) — has external ref to NativeScript Spotify plugin
   - Software Development Intern @ Grupo Gmaes (mar 2017 — dec 2018) — has external ref to CONFEA
   - Source: `src/repositories/implementations/static-jobs-repository.tsx` (6 real roles, no inventions).

### Role anatomy

Each `.role` is a 2-column grid: date gutter (left, `--gutter-date` 183px) and content (right).

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
- Focus order: skip-link → wordmark → 5 nav links → each role's external ref (if present) → footer links.

---

## Page: Projects (`/projects`)

**Purpose** — Complete catalog of side projects, OSS work, and built artifacts. Featured items lead; the rest follow in the same grid.

**Audience moment** — Someone gauging breadth and craft. They want to scan a wall of work and click into the few that catch their eye.

### Sections (in order)

1. **Page-head** — `<PROJECTS />`.
2. **Projects band** (`section.band`, `aria-label="Projects"`) — `<ul class="grid grid-frame grid-frame--3col">` of 18 `<li class="pr">` items, featured first.
   - Featured items carry `.pr--is-featured` plus a `.pr__badge` reading `Featured` in the top-right corner.
   - Source: `src/repositories/implementations/static-projects-repository.ts` (18 real projects; first 3 are featured: Grafex, Calcloak, Injektion).

### Project card anatomy (`.pr`)

- `.pr__title` — non-heading `<p>` in `--hi` 16px mono 600. Featured cards reserve `--badge-clearance` (88px) of right padding so the corner badge clears.
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
- Focus order: skip-link → wordmark → 5 nav links → each project's site/github links in DOM order → footer.

---

## Page: Articles (`/articles`)

**Purpose** — Reader feed of dev.to posts. Each entry is a self-contained card with date, reading time, reactions, comments, a hand-drawn SVG illustration, description, tags, and a "read on dev.to" link.

**Audience moment** — Someone deciding whether to invest time reading. They scan the title, glance at the illustration, check tags and length, then either click through or move on.

### Sections (in order)

1. **Page-head** — `<ARTICLES />`.
2. **Articles list** (`section.band`, `aria-label="Articles"`) — `<ul class="list">` of `<li class="art">` items.
   - Source: fetched from `https://dev.to/andresilva-cc`. Titles, dates, reading time, reactions, comments are **never invented** — if fetching fails at build time, fall back to a visible empty/error state, do not synthesize.

### Article card anatomy (`.art`)

A 2-column grid (`240px 1fr`):

- **Left (`.art__illo`)** — SVG illustration that **evokes the article's specific subject** (e.g., performance gauge for "74% Performance Increase", rendering-modes diagram for an SSR/SSG/CSR explainer). Decorative, generative-pattern illustrations are off-brief (project memory: meaningful per-project imagery).
- **Right (`.art__body`)**:
  - `.art__meta` — date, reading time, reactions, comments separated by `·` dots. Mono 500 12px `--lo`, date elevated to `--mid`.
  - `.art__title` — non-heading `<p>` containing the external `<a>` to dev.to (`target="_blank" rel="noopener noreferrer"`).
  - `.art__desc` — body prose summary capped at `--prose-w`. Magnitude metrics in `<strong class="acc">`.
  - `.art__tags` — wrapping chip strip.
  - `.art__lnk` — trailing `link-arrow` reading `read on dev.to →`.

### Key interactions

- Title link hover: color shifts `--hi → --accent`, underline appears with 3px offset.
- Tail link-arrow nudge on hover.
- Card itself is not the click target — the title and the trailing link-arrow both lead to the same URL; this is intentional so the illustration can be passive.

### Mobile

- ≤ 760px: 2-col `.art` collapses to single column. Illustration becomes full-width capped at 320px and goes above the body. Aspect ratio preserved at `240/144`.

### Accessibility

- Illustrations are `aria-hidden="true"` — they're decorative anchors, the title carries the meaning.
- `<ul>/<li>` for the list.
- Each title `<a>` exposes the full headline as link text (no "click here" buttons).
- Reaction/comment counts use `♥` and the word `comment` — meaning is not conveyed by an icon alone.
- Focus order: skip-link → wordmark → 5 nav links → each article's title link + tail link in DOM order → footer.

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
- **Eyebrow + H2 pattern**: every section opens with a `.comment-tag` eyebrow (`// 01 / …`) above the H2. Numbering restarts per page.
- **Brace H1 pattern**: every inner page uses `<X />` (e.g., `<ABOUT />`); Home uses the name itself as the identity moment instead.
- **Curly quotes everywhere in prose** (standing rule 09). Straight quotes only inside attributes, code, and CSS strings.
- **Reduced motion** is honored globally; press-scale and looping animations are additionally gated with `@media (prefers-reduced-motion: no-preference)`.
