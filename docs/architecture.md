# Architecture

A snapshot of how andresilva.cc is built today, after the redesign. The site is a mature, one-developer marketing/portfolio site deployed to Vercel. It is fully static — every route is pre-rendered at build time, with no runtime HTTP fetches — and carries a small client-side surface for route-aware navigation, a hero animation, and a click-to-load YouTube embed.

This document describes **what is**, not what should be. Treat the code as the source of truth; update this doc when a task materially changes the architecture.

---

## 1. Overview

- **Domain**: https://andresilva.cc
- **Purpose**: Personal site — home, about, career, projects, articles, and notes authored in the repo.
- **Shape**: Next.js App Router app, Server Components by default, with four `'use client'` islands: `nav.tsx` (route-aware active highlighting), `stipple-art.tsx` (loads the external ASCII-art Web Component), `mdx/youtube-swap.tsx` (click-to-load YouTube embed inside article prose), and `mdx/copy-button.tsx` (code-block copy button with local clipboard state).
- **Visual reference**: the shipped code is the source of truth — the token block in `src/styles/globals.css` and the components in `src/components/`, live-rendered at the `/design-system` route. `docs/redesign-log.md` is the decision log.
- **Data**: Content is either hard-coded in "static" repositories or authored as MDX files in `src/content/articles/` and `src/content/notes/` and compiled at build time by Velite. The dev.to integration has been removed — `ForemArticlesRepository` and `axios` are no longer in the codebase. The site is the canonical home for articles; dev.to is a syndicated mirror (with `canonical_url` pointing back here). There is no database, no auth, no backend of our own, and no user-generated content.
- **Deployment**: Vercel, auto-deploy from `main`.

> Articles content pipeline: see `docs/articles-decision-log.md` for the rationale behind the MDX-in-repo design (collection schema, OG image generation, RSS, JSON-LD, content migration).

---

## 2. Tech Stack

| Area                    | Choice                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------ |
| Framework               | Next.js **16.2.6** (App Router, Turbopack dev server)                                      |
| UI library              | React **19.2.6** + React DOM 19.2.6                                                        |
| Language                | TypeScript **5.9.3** (`strict: true`, `moduleResolution: bundler`, `@/*` → `src/*`)        |
| Styling                 | Tailwind CSS **4.3.0** via `@tailwindcss/postcss` (CSS-first config, no `tailwind.config`) |
| Headless UI primitives  | `@radix-ui/react-slot` (for the `asChild` polymorphism in `Text`)                          |
| Icons                   | Hand-rolled inline SVG components (`icon-arrow.tsx`, `icon-heart.tsx`) — no icon-library dependency |
| HTTP client             | None — no runtime HTTP. All content is hard-coded or compiled from MDX at build time.      |
| Content pipeline        | **Velite** + **@mdx-js/mdx** + **rehype-pretty-code** + **shiki** (+ Velite's built-in GFM via `remark-gfm`) — MDX collections under `src/content/`, emitted to `.velite/` (devDeps) |
| OG image generation     | **grafex** (build-time WebKit rendering via Playwright) — runs in `prebuild` to emit per-article PNGs into `public/og/articles/` and per-note PNGs into `public/og/notes/`. Playwright/WebKit ships as a transitive dep of grafex. |
| Class utilities         | `clsx`                                                                                     |
| Analytics               | Vercel Analytics via `@vercel/analytics/next` — `<Analytics />` in root layout             |
| Fonts                   | **JetBrains Mono** (body) + **VT323** (pixel-display headings), via `next/font/google`     |
| Package manager         | pnpm **10.27.0**                                                                           |
| Lint                    | ESLint **9** flat config: `eslint-config-next/core-web-vitals` + `@stylistic/eslint-plugin`, airbnb base |
| Hosting                 | Vercel (auto-deploy from `main`)                                                           |

The `next.config.mjs` carries a single Next option — `turbopack.root` (pins the workspace root; see §5) — and one side-effecting top-level `await build()` call into Velite (skipped only when `NODE_ENV === 'test'`) so `.velite/` is materialized before any page module resolves the `@/.velite` alias. There is **no** `tailwind.config.*` (Tailwind 4 CSS-first via `@theme inline`), **no** Prettier, and **no** test framework configured in the repo.

---

## 3. Project Structure

```
andresilva.cc/
├── docs/
│   ├── status.md                  # project snapshot + conventions
│   ├── workflow.md                # agent pipeline workflow
│   ├── design-system.md           # token + component reference
│   ├── redesign-log.md            # redesign decision log
│   ├── articles-decision-log.md   # articles self-host decision log
│   ├── ui-spec.md                 # page-level structure spec
│   └── architecture.md            # this file
├── public/
│   ├── me.jpg                     # about-page portrait
│   ├── resume.pdf                 # /resume.pdf link target
│   ├── logo.svg
│   ├── robots.txt                 # allow-all
│   ├── docs/teseu.pdf
│   ├── og/articles/               # COMMITTED — grafex per-article OG PNGs (Vercel escape hatch active; regenerate locally and commit)
│   ├── og/notes/                  # COMMITTED — grafex per-note OG PNGs (same Vercel escape hatch)
│   └── static/                    # GENERATED (gitignored) — Velite-emitted hashed assets from MDX
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── layout.tsx             # bare root layout: <html>/<body> + fonts + GA
│   │   ├── not-found.tsx          # 404 — at root; replicates the shell — SkipLink + Header + Footer + container
│   │   ├── fonts.ts               # next/font loaders
│   │   ├── sitemap.ts             # dynamic sitemap: static routes + one entry per article + one entry per note
│   │   ├── favicon.ico
│   │   ├── articles/rss.xml/
│   │   │   └── route.ts           # articles RSS feed Route Handler (force-static)
│   │   ├── notes/rss.xml/
│   │   │   └── route.ts           # notes RSS feed Route Handler (force-static)
│   │   ├── (site)/                # route group — shared shell layout
│   │   │   ├── layout.tsx         # the shell: SkipLink + Header + main + Footer
│   │   │   ├── page.tsx           # / (home)
│   │   │   ├── about/page.tsx
│   │   │   ├── articles/
│   │   │   │   ├── page.tsx       # /articles (static — reads LocalArticlesRepository)
│   │   │   │   └── [slug]/page.tsx # /articles/<slug> (SSG via generateStaticParams)
│   │   │   ├── notes/
│   │   │   │   ├── page.tsx       # /notes (static — reads LocalNotesRepository; full inline render, paginated 50/page)
│   │   │   │   ├── page/[page]/page.tsx # /notes/page/<n> (paginated index)
│   │   │   │   └── [slug]/page.tsx # /notes/<slug> (canonical detail — SSG via generateStaticParams)
│   │   │   ├── career/page.tsx
│   │   │   └── projects/page.tsx
│   │   └── design-system/         # separate route — outside the (site) group
│   │       ├── layout.tsx         # bare shell: max-w-shell container + <main> only
│   │       ├── page.tsx           # /design-system — living reference page
│   │       └── _components/       # band sections, private to this route
│   ├── components/                # presentational + client components (the redesign vocabulary)
│   │   ├── note-block.tsx         # server component — renders one note (meta + body) inline
│   │   └── mdx/                   # custom MDX components used in article + note prose
│   │       ├── youtube.tsx        # server component — façade + noscript iframe
│   │       ├── youtube-swap.tsx   # 'use client' island — click-to-load swap
│   │       ├── figure.tsx         # numbered figure (next/image + caption)
│   │       ├── figure-caption.tsx # shared caption renderer for Figure + YouTube
│   │       ├── image-mdx.tsx      # bare flush image for the ![]() MDX path
│   │       ├── pre-shiki.tsx      # styled <pre> wrapper around rehype-pretty-code output
│   │       ├── copy-button.tsx    # 'use client' island — code-block copy button
│   │       └── rss/               # HTML-only mirrors used solely by the RSS renderer (no client JS)
│   │           ├── youtube.tsx
│   │           ├── figure.tsx
│   │           ├── image-mdx.tsx
│   │           ├── inline-link.tsx
│   │           └── pre-shiki.tsx
│   ├── content/
│   │   ├── articles/              # authored MDX, one folder per article (slug = folder)
│   │   │   └── <slug>/
│   │   │       ├── index.mdx
│   │   │       └── images/        # co-located media (hashed into public/static at build)
│   │   └── notes/                 # authored MDX, FLAT — one file per note (slug = filename)
│   │       ├── <slug>.mdx
│   │       └── _assets/<slug>/    # rare per-note media (only if a note ships an image)
│   ├── lib/
│   │   ├── safe-href.ts           # URL allowlist guard (http/https/relative/fragment/mailto/tel)
│   │   ├── format-date.ts         # formatMonthYear / formatDateRange / formatArticleDate
│   │   ├── reading-time.ts        # word count + reading-time estimator (220 WPM)
│   │   ├── config.ts              # SITE_ORIGIN — canonical origin for absolute URLs
│   │   ├── mdx-jsx-allowlist.ts   # MDX_JSX_ALLOWLIST — single source of truth for permitted MDX JSX components
│   │   ├── rss-url.ts             # absolutize(url, basePath) — URL absolutization helper for RSS HTML output
│   │   ├── rss-helpers.ts         # escapeXml / toRfc822 / escapeCdata — shared RSS feed serialization helpers
│   │   └── rss-renderer.tsx       # renderEntryHtml core + renderArticleHtml(article) / renderNoteHtml(note) wrappers — build-time MDX→HTML renderer for the RSS feeds
│   ├── repositories/
│   │   ├── index.ts               # getRepositories() — factory for all repositories
│   │   ├── *.ts                   # interfaces (ArticlesRepository, ...)
│   │   └── implementations/
│   │       ├── local-articles-repository.ts    # reads compiled MDX from .velite
│   │       ├── local-notes-repository.ts       # reads compiled MDX from .velite (notes collection)
│   │       ├── static-footer-repository.ts
│   │       ├── static-jobs-repository.tsx
│   │       ├── static-menu-repository.ts
│   │       └── static-projects-repository.ts
│   └── styles/
│       ├── globals.css            # Tailwind import + @theme inline token block
│       └── shiki/
│           └── brutalist-mono.json # custom Shiki theme for code blocks
├── tools/                         # grafex compositions (excluded from tsconfig — see §11)
│   ├── og.tsx                     # home OG card
│   ├── og-article.tsx             # per-article OG card
│   └── og-note.tsx                # per-note OG card
├── scripts/og/
│   └── generate.mjs               # prebuild step — iterates articles + notes + invokes grafex
├── .velite/                       # GENERATED (gitignored) — Velite compiled output (typed + JSON)
├── velite.config.ts               # Velite collection schema for articles + notes
├── eslint.config.mjs
├── next.config.mjs                # turbopack.root pin + top-level `await build()` for Velite
├── postcss.config.js              # @tailwindcss/postcss
├── tsconfig.json
├── package.json
└── README.md
```

Path alias: `@/*` resolves to `src/*`.

### Role of each top-level `src/` directory

- **`src/app/`** — App Router routes. The root `layout.tsx` is bare (`<html>`/`<body>` + fonts + GA only); the page shell lives one level down. The `(site)` route group holds the content routes under a shared shell `layout.tsx`; `design-system/` is a separate route with its own bare layout; `not-found.tsx` sits at the root and replicates the shell; `articles/rss.xml/route.ts` and `notes/rss.xml/route.ts` are static Route Handlers that live outside the `(site)` group because they return XML, not HTML. Each `page.tsx` is a Server Component unless explicitly marked `'use client'`. See §4.
- **`src/components/`** — Every UI component, from primitives (button, link, tag) to page sections (project-card, role-card, article-card, note-block). Names mirror the component vocabulary documented in `docs/design-system.md`. The `mdx/` subdirectory holds components that render inside article and note prose (`YouTube`, `Figure`, `FigureCaption`, `ImageMdx`, `PreShiki`, `CopyButton`). The nested `mdx/rss/` subdirectory holds HTML-only React mirrors of the page-side MDX components (`youtube`, `figure`, `image-mdx`, `inline-link`, `pre-shiki`) — no client JS, used solely by the RSS renderer to produce inert markup for feed readers.
- **`src/content/`** — Authored content. Two collections: `articles/<slug>/index.mdx` (one folder per article, with optional co-located `images/`) and `notes/<slug>.mdx` (flat — one file per note; rare local media goes in `notes/_assets/<slug>/`). Velite reads both trees at build time. See §7.
- **`src/lib/`** — Pure, framework-agnostic utility modules with no React or Next dependency (the one exception being `rss-renderer.tsx`, which uses React only at build time to stringify HTML). Eight modules today: `safe-href.ts` (a URL allowlist guard accepting only http/https, relative, fragment, `mailto:`, and `tel:` schemes), `format-date.ts` (the `formatMonthYear` / `formatDateRange` / `formatDate` date formatters), `reading-time.ts` (word count + reading-time estimator at 220 WPM, used by Velite's transform), `config.ts` (exports `SITE_ORIGIN`, the canonical origin used wherever absolute URLs are emitted — RSS items, sitemap entries, JSON-LD, OG meta), `mdx-jsx-allowlist.ts` (exports `MDX_JSX_ALLOWLIST` — the single source of truth for which MDX JSX components are permitted; enforced at Velite build time, mirrored in the RSS component map), `rss-url.ts` (exports `absolutize(url, basePath)` — the URL absolutization helper for RSS HTML output, where `basePath` is the full path segment `articles/<slug>` or `notes/<slug>`; handles `http(s):`, protocol-relative `//`, `mailto:` / `tel:`, absolute `/path`, fragment `#hash`, and relative `./` forms), `rss-helpers.ts` (exports `escapeXml` / `toRfc822` / `escapeCdata` — the shared serialization helpers used by both RSS Route Handlers), and `rss-renderer.tsx` (exports a shared `renderEntryHtml(body, basePath)` core plus two thin wrappers, `renderArticleHtml(article)` and `renderNoteHtml(note)` — the build-time MDX→HTML renderer used by both the articles and notes RSS feeds; runs the compiled MDX body through `@mdx-js/mdx`'s `run()` with an RSS-specific component map and stringifies via `react-dom/server.edge.renderToStaticMarkup`).
- **`src/repositories/`** — Data-access seam. `index.ts` exports the `getRepositories()` factory; interfaces at the top level; concrete implementations under `implementations/`. See §7.
- **`src/styles/`** — `globals.css` (Tailwind import + `@theme inline` token block) plus `shiki/brutalist-mono.json` (the custom Shiki theme loaded by `rehype-pretty-code`). There are no other CSS files in `src/` after the redesign — the multi-theme `themes/*.css` system has been removed.

---

## 4. Routing & Rendering

App Router. Three dynamic segments (`/articles/[slug]`, `/notes/[slug]`, `/notes/page/[page]`), two Route Handlers (`/articles/rss.xml` and `/notes/rss.xml`), no parallel/intercepting routes, no middleware. The `(site)` route group carries the content routes under a shared shell layout; `design-system` is a separate route outside that group with its own bare layout; the RSS Route Handlers live outside `(site)` because they return XML rather than the HTML shell.

| Path                  | File                                          | Rendering                                                |
| --------------------- | --------------------------------------------- | -------------------------------------------------------- |
| `/`                   | `src/app/(site)/page.tsx`                     | Server (static)                                          |
| `/about`              | `src/app/(site)/about/page.tsx`               | Server (static)                                          |
| `/articles`           | `src/app/(site)/articles/page.tsx`            | Server (static) — reads `LocalArticlesRepository`        |
| `/articles/[slug]`    | `src/app/(site)/articles/[slug]/page.tsx`     | Server (static) — SSG via `generateStaticParams`         |
| `/articles/rss.xml`   | `src/app/articles/rss.xml/route.ts`           | Static Route Handler (`export const dynamic = 'force-static'`) — full-content feed (`<content:encoded>` alongside summary `<description>`); body rendering via `src/lib/rss-renderer.tsx` |
| `/notes`              | `src/app/(site)/notes/page.tsx`               | Server (static) — reads `LocalNotesRepository` (page 1)  |
| `/notes/page/[page]`  | `src/app/(site)/notes/page/[page]/page.tsx`   | Server (static) — SSG via `generateStaticParams` (pages 2..N) |
| `/notes/[slug]`       | `src/app/(site)/notes/[slug]/page.tsx`        | Server (static) — SSG via `generateStaticParams`         |
| `/notes/rss.xml`      | `src/app/notes/rss.xml/route.ts`              | Static Route Handler (`export const dynamic = 'force-static'`) — full-content feed (`<content:encoded>` alongside summary `<description>`); body rendering via `src/lib/rss-renderer.tsx` |
| `/career`             | `src/app/(site)/career/page.tsx`              | Server (static)                                          |
| `/projects`           | `src/app/(site)/projects/page.tsx`            | Server (static)                                          |
| `/design-system`      | `src/app/design-system/page.tsx`              | Server (static)                                          |
| `*` (404)             | `src/app/not-found.tsx`                       | Server (static)                                          |

`/design-system` is a live public route but is an internal living-reference page (it renders every production component to validate the system). It is excluded from `sitemap.ts` and sets `robots: { index: false }` in its `metadata`, so it stays out of search indexes.

### Layout arrangement

The root `src/app/layout.tsx` is bare — `<html>` + `<body>` + fonts + `<Analytics />`, nothing else. The page shell (SkipLink + Header + `<main>` + Footer inside the `max-w-shell` container) lives in `src/app/(site)/layout.tsx`, so it wraps only the content routes inside the `(site)` group. `src/app/design-system/layout.tsx` is a separate bare layout — just the `max-w-shell` container and `<main>`, no Header/Footer/SkipLink — because the design-system page is a reference surface, not part of the site chrome. Since the root layout is bare and route-group layouts don't wrap root-level files, `src/app/not-found.tsx` replicates the shell (SkipLink + Header + Footer + container) itself.

### Server-first, client where needed

Pages and structural components stay server-rendered. Exactly four files carry `'use client'`, and only because they genuinely need a client hook or DOM access:

- **`nav.tsx`** — reads `usePathname()` to mark the active item with `aria-current="page"` and route-aware accent highlighting. The header itself stays a Server Component; it reflows responsively via CSS flex-wrap at the `xs` breakpoint, with no JS disclosure/hamburger.
- **`stipple-art.tsx`** — loads the external `<stipple-art>` Web Component (home hero + article-thumbnail ASCII art) via a `useEffect` script injection.
- **`mdx/youtube-swap.tsx`** — the click-to-load swap for in-prose `<YouTube />` embeds. The outer `<YouTube />` component is a Server Component that renders a static thumbnail façade plus a `<noscript>` iframe fallback; this small island only owns the post-click state that swaps the façade for the live iframe. The YouTube embed JS itself is never loaded until the user clicks.
- **`mdx/copy-button.tsx`** — code-block copy button; owns local `copied` state and the clipboard API call, revealed on `group-hover/pre`.

Everything else — header, footer, page heads, section heads, project cards, role cards, article cards, tags, status dots, link arrows, and the `ImageMdx` / `PreShiki` / outer `YouTube` / `Figure` / `FigureCaption` MDX components — is a Server Component.

### Article body rendering

Article bodies are compiled to a function-body string by Velite at build time (via `@mdx-js/mdx`'s `compile`). At request time, `/articles/[slug]/page.tsx` calls `@mdx-js/mdx`'s `run()` against the string, with `react/jsx-runtime` passed in, and renders the resulting default export through the page's MDX components map (`YouTube`, `Figure`, `img → ImageMdx`, `a → InlineLink`, `pre → PreShiki`). `PreShiki` mounts the `CopyButton` client island internally — the components map only allowlists the elements authors can name. Because the body string is build-time output — never runtime user input — `run()` is not dynamic code execution in the security sense; it is the standard MDX runtime pattern.

The article page also embeds a `BlogPosting` JSON-LD `<script type="application/ld+json">` (headline, description, dates, author, URL, image, keywords, `wordCount`, `timeRequired`, `inLanguage`, `isPartOf`) — Server Component, no client overhead.

### Note rendering

Notes use the same MDX compile/run pipeline as articles (Velite-compiled body string → `@mdx-js/mdx`'s `run()` against `react/jsx-runtime` → render through the MDX components map). There are no per-note component restrictions: the components map is identical to the article one (`YouTube`, `Figure`, `img → ImageMdx`, `a → InlineLink`, `pre → PreShiki`).

Two surfaces render notes:

- **`/notes` (index)** — every note on the current page is rendered in **full** inline as MDX, separated by hairline rules. Each note is wrapped in `<article id="<slug>">` so `/notes#<slug>` jumps to it in-page. Paginated at 50 notes/page; pages 2..N live at `/notes/page/<n>`. `<NoteBlock>` (server component) is the per-note renderer used here and on the detail page.
- **`/notes/[slug]` (detail)** — canonical SEO/share target for each note. Renders `<NoteBlock surface="detail">` (which prepends a `// note` eyebrow, escalates the title to `<h1>` + `h1` visual variant in VT323, and moves the meta below the title) plus top and bottom "back to notes" links. `<link rel="canonical">` points to itself (not to the index hash), and the page emits a `BlogPosting` JSON-LD block (headline = `title`, `datePublished` = `publishedAt`, `image` = the per-note `/og/notes/<slug>.png`; no `wordCount` / `timeRequired`).

**Perf watch-point**: at 50 notes per index page with multiple `<PreShiki>` blocks each, the index ships a large number of `CopyButton` client islands. Not a blocker today; if it bites, a future compact-mode flag on `PreShiki` (skip the copy island when rendered on the index) is the obvious fix. Tracked as a known watch-point, not work to do up front.

### Metadata

Each route page declares its own `metadata.title` (e.g. `"About | André Silva"`) via the Next.js Metadata API. The root layout sets the base `title` / `description` and any default OG/Twitter tags. There are **no API routes** (`app/api/*`) — the site has no backend endpoints of its own.

---

## 5. Styling System

### Tailwind 4, CSS-first

There is no `tailwind.config.js`. The entire token contract lives in `src/styles/globals.css` inside a single Tailwind 4 `@theme inline` block, which maps Tailwind class names onto CSS custom properties.

The token block is the canonical token contract and covers:

- **Semantic colors** — `base` (background), `surface-2` (raised surface), `fg` family (`hi`, `mid`, `lo` for high/mid/low-emphasis text), `accent` family (`accent`, `accent-hi`, `accent-mute`, `accent-tint`), `rule` family (`rule`, `rule-2` for dividers).
- **Type scale** — display, h1, h2, h3, body, meta, micro.
- **Spacing scale** — Tailwind's default 4px-based scale (`p-1` through `p-20`) covers every spacing value the design uses, so no custom `--spacing-*` tokens are registered. Component-specific layout values that don't fit the global spacing scale live as bespoke `@theme` tokens — the fixed-column grid templates (`--grid-template-columns-role` at `183px 1fr` for career role date columns, plus `--grid-template-columns-article` and `--grid-template-columns-article-card`). The hero-art box dimensions are raw CSS variables in `:root` (`--hero-art-w` etc.), consumed via `var()` — the embed needs explicit sizing Tailwind has no clean namespace for. One-off per-component values (e.g. the 2px vertical padding on chips, the 88px right-padding clearance on featured project cards) are expressed inline with Tailwind utilities (`py-0.5`, `pr-22`) rather than promoted to tokens.
- **Prose widths** — `--max-width-prose-narrow` (56ch), `--max-width-prose-bio` (60ch), `--max-width-prose-wide` (68ch), `--max-width-prose-figure` (80ch — wider than body prose so diagrams can breathe past the text column), `--max-width-prose-card` (38ch).
- **Photo filters** — `photo-filter` (primary) + `photo-filter-soft` (touch-device fallback for the about portrait).
- **Motion** — `ease-out`, `ease-in`, `d-fast` (120ms), `d-mod` (200ms).
- **Font families** — `ff-mono` (JetBrains Mono) and `ff-display` (VT323), wired into Tailwind's font family classes via the CSS variables exposed by `next/font`.

### Single palette, no theming

The multi-theme system (`src/styles/themes/*.css`, the `ThemeSelector` component, the `theme` cookie handling in `layout.tsx`, the `body.animate` easter-egg keyframe) **has been removed**. There is exactly one palette, and it lives in `globals.css`. `<html>` no longer carries a `data-theme` attribute.

### Class-only styling

The styling rule is unambiguous:

- **No CSS classes are defined outside `globals.css`.** Component styles compose Tailwind utility classes; ad-hoc CSS goes into `globals.css` only when a utility composition genuinely can't express it.
- **No arbitrary values anywhere in the codebase.** No `bg-[#0B0F0A]`, no `text-[14px]`, no `mt-[7px]`. Every size, color, and spacing reference resolves to a token in the `@theme` block. If a value isn't expressible with the existing tokens, the answer is to add a token, not to inline a literal.
- **Tokens are the only styling vocabulary.** When in doubt about which token to use for a given visual treatment, `docs/design-system.md` documents each one's intended use.

Tokens are documented (with names, intended use, and contrast notes) in `docs/design-system.md`.

---

## 6. Component Vocabulary

The component layer is a vocabulary of roughly 24 components, each a single visual concept:

- **Layout chrome**: `header`, `footer`, `wordmark`, `nav` (route-aware client component), `skip-link`.
- **Page structure**: `page-head`, `section-head`, `eyebrow`, `grid-frame`.
- **Inline primitives**: `tag` / `badge`, `status-dot`, `link-arrow`, `button-cta`.
- **Cards & rows**: `row` (home Latest), `project-card`, `role-card`, `article-card`, `note-block` (server component — renders one note inline; used on `/notes` and `/notes/[slug]`).
- **Media**: `photo-wrap` (about portrait with the filter token), `hero-art` / `stipple-art` (the ASCII-art embed — home hero + article thumbnails).
- **MDX in-prose components** (live under `src/components/mdx/`, used only inside article bodies): `youtube` (server façade with `<noscript>` iframe) + `youtube-swap` ('use client' click-to-load island), `figure` (numbered diagram — `next/image` + `FigureCaption`, falls back to a plain `<img>` when Velite emits no dimensions for an absolute-URL source), `figure-caption` (shared caption renderer powering both `<Figure>` and `<YouTube>`'s figure mode), `image-mdx` (bare flush image for the `![]()` markdown path — `next/image` with Velite-emitted dimensions, no caption; absolute-URL fallback as `<img>`), `pre-shiki` (styled `<pre>` wrapper around `rehype-pretty-code`'s output; mounts `CopyButton` internally), `copy-button` ('use client' code-block copy island, revealed on `group-hover/pre`). The MDX components map in `[slug]/page.tsx` is the allowlist (`YouTube`, `Figure`, `img → ImageMdx`, `a → InlineLink`, `pre → PreShiki`) — authors can only use components named there.

The component file listing in `src/components/` is the authoritative inventory; the `/design-system` route renders each one live as its visual contract.

### Composition conventions

- **Primitives accept an `asChild` prop** (via `@radix-ui/react-slot`) so wrappers like `Link` or `Button` can inherit a primitive's styling without nesting elements.
- **External links** are auto-detected in link primitives (`href.startsWith('http')` → `target="_blank"` + `rel="noopener noreferrer"`).
- **Card lists use `<li class="card-class">` directly** (no inner `<article>`). The `<li>` is the card. This matches the standing rule recorded in `docs/redesign-log.md` and applies to projects, career roles, and articles.

---

## 7. Data Layer

```mermaid
flowchart LR
    Page["App Router Page<br/>(Server Component)"] -->|getRepositories()| Factory["repositories/index.ts"]
    Factory --> Static["Static*Repository<br/>(hard-coded data)"]
    Factory --> LocalA["LocalArticlesRepository"]
    Factory --> LocalN["LocalNotesRepository"]
    LocalA -->|reads at module init| Velite[".velite/<br/>(built MDX + frontmatter)"]
    LocalN -->|reads at module init| Velite
    Velite -.->|build-time| MDXA[("src/content/articles/<br/>**/index.mdx")]
    Velite -.->|build-time| MDXN[("src/content/notes/<br/>*.mdx")]
    Static --> Page
    LocalA --> Page
    LocalN --> Page
    Page --> HTML[(Rendered HTML)]
```

No arrow leaves the build boundary. There is no runtime HTTP fetch from any repository.

### Repository pattern

`src/repositories/index.ts` exports `getRepositories()`, a plain factory function that returns fresh instances of every repository. Each page imports it (`from '@/repositories'`), destructures the repositories it needs, and calls `.getAll()` (or similar) on them.

There are two kinds of implementations:

1. **Static repositories** — data is hard-coded in the class. The content for the career page, projects page, footer social links, and site menu all live here. Changes ship as code commits.
   - `StaticJobsRepository` is written as `.tsx` because the `description` field is JSX (nested `<ul>`/`<li>`/`<p>`).
2. **Local file-system repositories** — `LocalArticlesRepository` and `LocalNotesRepository` both read pre-built MDX collections emitted by Velite (`.velite/article.json` and `.velite/note.json`, surfaced as the typed `article` and `note` arrays exported from `@/.velite`). Their interfaces are synchronous (`getAll(): Article[] | Note[]`, `getBySlug(slug): Article | Note | undefined`) — there is no async data source. `getAll()` sorts by `publishedAt` descending so callers don't re-sort.

### Why keep the repository pattern

The site has no database and most content is hard-coded — at first glance the abstraction looks like over-engineering for static data. It is kept deliberately:

- **It is the i18n seam.** When the site grows a second locale, the swap point is the repository — `StaticProjectsRepository` becomes `LocalizedProjectsRepository` (or a wrapper) without touching any page or component.
- **It is the content-source seam.** `LocalArticlesRepository` and `LocalNotesRepository` are the seam between pages and the build-time Velite output. If articles or notes ever move to a CMS, the interface lets pages stay agnostic about the underlying source.
- **It is the testing seam.** Pages depend on interfaces, not concrete classes; a future test suite can substitute fakes without monkey-patching.

This decision has been re-evaluated and ratified after the redesign — do not propose removing it without addressing these three roles.

### Articles content pipeline

```
src/content/articles/<slug>/index.mdx       (authored source)
            │
            ▼
       velite build  ──▶  .velite/article.json + article.d.ts   (typed array)
            │
            ▼
LocalArticlesRepository (sync)  ──▶  /articles, /articles/[slug], /articles/rss.xml, sitemap
```

- **Velite** runs at build time, driven by `velite.config.ts`. The `article` collection (`pattern: 'articles/**/index.mdx'`) validates frontmatter against a Zod schema (`title`, `summary` (max 200 chars), `publishedAt`, optional `updatedAt`, `tags`, optional `devtoUrl`, optional `coverArt: { params: string }` — a raw stipple-art param string consumed by `<StippleArt>` on the article page and the article-card thumbnail), compiles the MDX body to a function-body string (via `@mdx-js/mdx`), runs `rehype-pretty-code` with the custom `brutalist-mono` Shiki theme over fenced code blocks, and emits derived fields in `transform()`: `slug` (leaf folder name, validated against a lowercase kebab-case regex with a 60-char cap), `wordCount`, `readingTime` (220 WPM, min 1), and `ogImage` (`/og/articles/<slug>.png`). GFM (tables, task lists, strikethrough, autolinks) is enabled via Velite's built-in default — no explicit `remark-gfm` plugin entry. `rehype-unwrap-images` is registered first to strip the wrapping `<p>` that MDX generates around standalone images so `ImageMdx` can render as a block-level element without invalid nesting.
- **Velite's asset handler** copies MDX-referenced images (e.g. `./images/diagram.png`) into `public/static/` with content-hashed filenames, rewrites the URLs in the emitted body, and threads width/height/blurDataURL through the schema. `ImageMdx` consumes those dimensions when mapping `<img>` to `next/image`.
- **`next.config.mjs`** calls `await build({ silent: true })` at the top level (gated on `NODE_ENV !== 'test'`), so `.velite/` is populated before any module imports from `@/.velite`. The TS path alias `@/.velite` is configured in `tsconfig.json`.
- **Canonical URLs** — every absolute URL emitted by the site (RSS items, sitemap, JSON-LD, OG meta) is built from the `SITE_ORIGIN` constant in `src/lib/config.ts`. There is one canonical origin, defined in one place.
- **OG images (per-article and per-note)** — `scripts/og/generate.mjs` runs as a `prebuild` step. It re-runs Velite (idempotent, ~200ms), then iterates **both** the article and note collections: for each article it invokes `grafex.render(tools/og-article.tsx, { props: { title, publishedAt, readingTime, coverArt } })` and writes `public/og/articles/<slug>.png`; for each note it invokes `grafex.render(tools/og-note.tsx, { props: { title, publishedAt } })` and writes `public/og/notes/<slug>.png`. The script is idempotent per entry: it skips a PNG when its mtime is newer than the max of the source MDX mtime, the relevant template mtime (`tools/og-article.tsx` for articles, `tools/og-note.tsx` for notes), and the generator script's own mtime — so editing either template, or the generator, invalidates every PNG of that kind on the next run. Gated by `SKIP_OG_BUILD` — see §11–§12.
- **OG image (home/standard)** — `tools/og.tsx` is the home/site-wide OG card (wordmark + display name + bio paragraph; eyebrow has been dropped to match the home page). **It is not part of the prebuild pipeline.** Regenerating it is a one-shot manual operation (point grafex at `tools/og.tsx` and commit the PNG). The asymmetry is deliberate: the home card changes a few times a year, the per-article card changes on every new article.

### Notes content pipeline

Mirrors the article collection pattern, with these differences:

```
src/content/notes/<slug>.mdx        (authored source — flat, one file per note)
            │
            ▼
       velite build  ──▶  .velite/note.json + note.d.ts   (typed array)
            │
            ▼
LocalNotesRepository (sync)  ──▶  /notes, /notes/page/<n>, /notes/<slug>, /notes/rss.xml, sitemap
```

- **Collection**: a second Velite collection in `velite.config.ts` — `note` with `pattern: 'notes/*.mdx'` (flat, not folder-per-slug). The `_assets/` subdirectory is excluded from the pattern.
- **Frontmatter schema** (Zod):
  - `title: string` — required. Editorial 2-7 word target enforced by `docs/copy-guide.md`, **not** by the schema.
  - `publishedAt: ISO date` — required.
  - `kind: 'til' | 'take' | 'snippet' | 'aside'` — required, closed enum (`z.enum([...])`).
  - No `updatedAt`, no `tags`, no `coverArt`, no `summary`, no reading time.
  - `raw: s.raw()` — the unprocessed body text, read in-transform (for the JSX-allowlist check and `excerpt` derivation) and destructured out, so it is **not** present on the emitted type.
- **Derived fields in `transform()`**: `slug` (from filename via `s.path()`, validated against the same lowercase kebab-case `SLUG_RE` and `SLUG_MAX_LEN = 60` constants reused from the article collection), `excerpt` (a plaintext, markdown-stripped ~140-char preview of the body, used as the `<description>` in the notes RSS feed — falls back to the title when the body is code-only), and `ogImage` (`/og/notes/<slug>.png` — see below). No `wordCount` / `readingTime`.
- **Body compilation**: same MDX pipeline as articles — `@mdx-js/mdx` compile to function-body string; same rehype stack (`rehype-unwrap-images` first, then `rehype-pretty-code` with the `brutalist-mono` Shiki theme); GFM via Velite's built-in default. No component restrictions in the page-level MDX components map.
- **Assets**: rare per-note media lives in `src/content/notes/_assets/<slug>/`, picked up by Velite's asset handler and emitted under `public/static/` with content hashing (same path as article images).
- **OG image (per-note)**: `tools/og-note.tsx` is the per-note OG template — same brutalist-mono layout as `tools/og-article.tsx`, but with eyebrow `// note` and a simplified meta strip (date only, no read time, no cover art). Props: `{ title, publishedAt }`. Generated by the same `scripts/og/generate.mjs` prebuild step as articles (see §7 above) and written to `public/og/notes/<slug>.png`. Same idempotency rule, same `SKIP_OG_BUILD` escape hatch, same commit-the-PNGs decision (PNGs ship in git because Playwright/WebKit can't run on Vercel's build container — see §12).
- **Authoring ergonomics (optional)**: a `pnpm notes:new <slug>` scaffolder may create a stub `src/content/notes/<slug>.mdx` with today's date and a `kind` prompt. Author-side convenience only — no architectural significance, no counter, no slug allocator. Slugs are author-chosen kebab-case.

### Data fetching

- All article routes (`/articles`, `/articles/[slug]`, `/articles/rss.xml`) are statically generated at build time. `[slug]/page.tsx` uses `generateStaticParams` to pre-render every article. The RSS route handler sets `export const dynamic = 'force-static'`.
- All note routes (`/notes`, `/notes/page/[page]`, `/notes/[slug]`, `/notes/rss.xml`) are statically generated at build time. `[slug]/page.tsx` and `page/[page]/page.tsx` both use `generateStaticParams` (enumerating slugs and page numbers respectively from the `LocalNotesRepository`); the RSS route handler sets `export const dynamic = 'force-static'`.
- All other pages are fully static.
- **There is no runtime data fetching anywhere in the application.**

See `docs/articles-decision-log.md` for the rationale behind this pipeline (MDX vs Markdown, Velite vs alternatives, OG generation strategy, content migration).

---

## 8. Fonts

`src/app/fonts.ts` loads two Google fonts via `next/font/google` (which self-hosts them through Next's build pipeline — no runtime requests to fonts.googleapis.com):

- **JetBrains Mono** — body and UI text. Weights 400, 500, 600. Exposed as `--ff-mono` (matching the canonical token name).
- **VT323** — pixel-display headings. Single weight. Exposed as `--ff-display`.

Both CSS variables are forwarded to the Tailwind `@theme` block so any `font-mono` / `font-display` utility class resolves to the loaded face. The previous Fira Sans / Fira Code pair has been removed.

---

## 9. Accessibility

- **WCAG AA contrast at body size.** The token palette is sized so every text-on-background combination clears AA. The contrast notes are documented per token in `docs/design-system.md` and reflect the `--lo` bump (`#7E8E76`, 5.49:1 on `--base`, 5.30:1 on `--surface-2`).
- **Skip link.** Every page renders a visually-hidden "Skip to content" link that becomes visible on focus and jumps to `<main>`.
- **Focus-visible rings.** Two-pixel `--accent` outline with a two-pixel offset on every interactive element (`a`, `button`, `[tabindex]`). The default browser ring is disabled; the design-system ring replaces it.
- **`prefers-reduced-motion`.** Decorative motion (row press scale, hero cursor blink, any hover transitions on cards) is gated by `prefers-reduced-motion: no-preference` and falls back to static states otherwise.
- **Semantic structure.** Card lists are `<ul>`/`<li>`, card titles are `<p>` (not `<h3>`), and single-band pages label their lone `<section>` with `aria-label` rather than `aria-labelledby` (per the standing rule recorded in `docs/redesign-log.md`).
- **Prose punctuation.** User-facing copy uses U+2019 (curly apostrophe) and U+201C / U+201D (curly double quotes). Straight quotes are reserved for HTML attributes, CSS strings, and code.

---

## 10. Third-Party Integrations

| Service              | How it's used                                                        | Configuration                                  |
| -------------------- | -------------------------------------------------------------------- | ---------------------------------------------- |
| **Vercel Analytics** | Page-view and Web Vitals tracking via `@vercel/analytics/next`       | No configuration — Vercel project auto-detects  |
| **Google Fonts**     | JetBrains Mono + VT323, self-hosted by Next through `next/font`      | `src/app/fonts.ts`                             |
| **YouTube**          | Click-to-load embed for in-prose `<YouTube />`; thumbnails from `i.ytimg.com`, iframe from `youtube.com/embed/<id>` only after click | No keys, no SDK                                |

No other external services (no CMS, no database, no auth provider, no email, no payments). **dev.to** is a syndication target for articles (not an integration): published articles are manually mirrored to dev.to with `canonical_url` pointing back to this site. The site never reads from or writes to dev.to at runtime.

---

## 11. Build, Lint & Dev Tooling

### Scripts (`package.json`)

| Script             | Command                            | Notes                                                                                  |
| ------------------ | ---------------------------------- | -------------------------------------------------------------------------------------- |
| `pnpm dev`         | `next dev`                         | Velite is invoked from `next.config.mjs` via top-level `await build()` on dev startup. |
| `pnpm prebuild`    | `node scripts/og/generate.mjs`     | Runs automatically before `pnpm build`. Generates per-article and per-note OG PNGs via grafex. Skips work if `SKIP_OG_BUILD=1` (see §12). |
| `pnpm build`       | `next build`                       | Triggers `prebuild` first via npm's lifecycle hook.                                    |
| `pnpm start`       | `next start`                       |                                                                                        |
| `pnpm lint`        | `eslint .`                         |                                                                                        |
| `pnpm og:generate` | `node scripts/og/generate.mjs`     | Manual per-article and per-note OG regeneration. Idempotent — skips any PNG whose mtime is newer than the max of its source MDX, the relevant template (`tools/og-article.tsx` for articles, `tools/og-note.tsx` for notes), and this generator script. Editing either template or the generator therefore invalidates every PNG of that kind. The home/standard OG (`tools/og.tsx`) is **not** wired into this script — regenerate it manually when needed. |

### ESLint

Flat config (`eslint.config.mjs`):

- Extends `eslint-config-next/core-web-vitals` and the airbnb base.
- Adds `@stylistic/eslint-plugin` with `arrowParens: true`, `semi: true`.
- Re-applies the default ignores (`.next/**`, `out/**`, `build/**`, `next-env.d.ts`) because `globalIgnores()` resets them.

### TypeScript

`tsconfig.json`:
- `strict: true`
- `moduleResolution: bundler`, `module: esnext`
- `jsx: react-jsx`
- `resolveJsonModule: true` (the Shiki theme JSON is imported directly by `velite.config.ts`)
- `paths: { "@/*": ["./src/*"], "@/.velite": ["./.velite"] }`
- `target: es5` (Next's compiler downlevels; this target is essentially inert for modern Next builds)
- `exclude: ["node_modules", "tools"]` — grafex compositions in `tools/` use a different runtime resolution and are excluded from the main TS project. They are picked up by grafex at build time.

### Generated artifacts (gitignored)

Three trees under the repo root are build outputs, not source:

- **`/.velite`** — Velite's compiled content (typed `article.d.ts` + `article.json` + `note.d.ts` + `note.json`). Regenerated on every dev/build run. Never edit by hand.
- **`/public/static`** — content-hashed copies of MDX-referenced images, emitted by Velite's asset handler. Regenerated alongside `.velite`.
- **`/public/og/articles`** — per-article OG PNGs, emitted by `scripts/og/generate.mjs`. Regenerated by the `prebuild` step. Committed only if the grafex escape hatch is active (see §12).
- **`/public/og/notes`** — per-note OG PNGs, emitted by the same script alongside articles. Same regeneration and commit behavior.

All three are listed in `.gitignore`.

### Pre-commit hooks

There are no pre-commit hooks configured: no `lint-staged`, no Prettier, no `.husky/` directory. Lint enforcement happens via Vercel's CI on push and via the agent pipeline before commit.

---

## 12. Deployment

- **Platform**: Vercel, connected to the GitHub repo `andresilva-cc/andresilva.cc`. Auto-deploy from `main`; preview deploys per PR.
- **Build**: `pnpm install` → `pnpm build`, which fires the `prebuild` script (`scripts/og/generate.mjs`) and then `next build`. The `next.config.mjs` pins `turbopack.root` and calls `await build()` from Velite at the top level so `.velite/` is populated before any module resolves `@/.velite`. Otherwise default Next output, image optimization, and runtime.
- **OG generation on Vercel is currently disabled via the §6.1.2 escape hatch.** Vercel's build container is missing ~40 system libs that WebKit needs (libgtk-4, libgstreamer, libvulkan, libgraphene, …) and the container doesn't allow `apt install`. So `SKIP_OG_BUILD=1` is set in Vercel project env vars — the prebuild script exits before grafex is imported, and Vercel serves the per-article PNGs committed under `public/og/articles/` and the per-note PNGs committed under `public/og/notes/`. Local flow: regenerate after editing article/note frontmatter or either OG template (`tools/og-article.tsx`, `tools/og-note.tsx`) with `pnpm og:generate` (or `pnpm build` — both run the same script), then commit the updated PNGs.
- **Environment variables**: there are no required env vars for the site to build or render. Analytics has no config (Vercel auto-detects). Required on Vercel: `SKIP_OG_BUILD=1` (see above — disables the OG prebuild that can't run on Vercel's container).
- **Domain / DNS**: `andresilva.cc`, managed via Vercel.
- **CI**: deployment status is visible via the deployments badge in `README.md`; there is no `.github/workflows/` directory — CI is whatever Vercel runs on push/PR.

---

## 13. Notable Conventions

- **Server by default, client only where needed.** Pages and structural components stay server-rendered; only genuinely interactive islands carry `'use client'`.
- **Tokens-only styling.** Every visual value resolves to a token in `globals.css`. No arbitrary values, no inline literals.
- **The `/design-system` route is the visual contract.** When implementing or changing a component, it must render correctly on that route; it is the live reference each component implements.
- **Repository pattern is the data seam.** Pages depend on interfaces, never on concrete implementations.
- **Card lists are `<ul>`/`<li>`.** Card titles are non-heading elements; sections are labeled with `aria-label` on single-band pages.
- **Curly punctuation in prose.** U+2019 for apostrophes, U+201C/U+201D for double quotes.
- **External links auto-detected** in link primitives (`href.startsWith('http')` → `target="_blank"`).
- **Active menu highlighting** uses `usePathname()` plus an `isActivePath(itemPath, currentPath)` check in `nav.tsx`: an item is active when `currentPath === itemPath` or `currentPath.startsWith(itemPath + '/')`, with `/` special-cased to require an exact match. Sub-routes therefore keep their parent nav item highlighted without any per-item config.
- **Commits** follow Conventional Commits (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`).
- **Branch strategy**: feature branch per task → PR → merge to `main` → Vercel auto-deploys.

---

## 14. What's Deliberately Absent

Noting these so nobody goes hunting:

- No authentication, no user accounts, no sessions.
- No database, no ORM, no migrations.
- No API routes (`app/api/*`) and no server actions. The only Route Handlers in the app are `/articles/rss.xml` and `/notes/rss.xml` (both `force-static`), which exist because the RSS feeds must serve XML rather than the HTML shell — they are otherwise identical in spirit to static pages.
- No middleware.
- No multi-theme system, no theme selector, no theme cookie. The site is single-palette.
- No `tailwind.config.*` — Tailwind 4 is configured entirely via the `@theme inline` block in `globals.css`.
- No test suite or test runner.
- No i18n today (site is English-only). The repository pattern is the future seam for it.
- No CMS — content is either code-hard-coded or authored as MDX in `src/content/`.
- No image pipeline beyond Next's default `<Image>` optimizer (consumed through `ImageMdx` for in-article images) and Velite's build-time copy-and-hash of MDX-referenced assets into `public/static/`. Runtime image surface is `/me.jpg`, the per-article OG PNGs in `public/og/articles/`, the per-note OG PNGs in `public/og/notes/`, and the Velite-emitted MDX images in `public/static/`.
- No error-tracking/observability service — Vercel logs only.
- **No merged `/feed.xml`.** Articles and notes ship as two separate full-content feeds (`/articles/rss.xml`, `/notes/rss.xml`) rather than one combined feed — notes are own-site-only while articles syndicate to dev.to, so the two surfaces have different audiences. A merged feed can be added later if readers request it. Notes are **not** syndicated to dev.to.
