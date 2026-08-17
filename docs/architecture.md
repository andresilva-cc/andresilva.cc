# Architecture

A snapshot of how andresilva.cc is built today, after the redesign. The site is a mature, one-developer marketing/portfolio site deployed to Vercel. It is fully static — every route is pre-rendered at build time, with no runtime HTTP fetches — and carries a small client-side surface for route-aware navigation, a hero animation, and a click-to-load YouTube embed.

This document describes **what is**, not what should be. Treat the code as the source of truth; update this doc when a task materially changes the architecture.

---

## 1. Overview

- **Domain**: https://andresilva.cc
- **Purpose**: Personal site — home, about, career, projects, articles, and notes authored in the repo, plus a print-oriented `/resume` route that is the source for the committed `public/resume.pdf`.
- **Shape**: Next.js App Router app, Server Components by default, with four `'use client'` islands: `nav.tsx` (route-aware active highlighting), `stipple-art.tsx` (loads the external ASCII-art Web Component), `mdx/youtube-swap.tsx` (click-to-load YouTube embed inside article prose), and `mdx/copy-button.tsx` (code-block copy button with local clipboard state).
- **Visual reference**: the shipped code is the source of truth — the token block in `src/styles/globals.css` and the components in `src/components/`, live-rendered at the `/design-system` route. `docs/redesign-log.md` is the decision log.
- **Data**: Content is either hard-coded in "static" repositories or authored as MDX files in `src/content/articles/` and `src/content/notes/` and compiled at build time by Velite. The dev.to integration has been removed — `ForemArticlesRepository` and `axios` are no longer in the codebase. The site is the canonical home for articles; dev.to is a syndicated mirror (with `canonical_url` pointing back here). There is no database, no auth, no backend of our own, and no user-generated content.
- **Deployment**: Vercel, auto-deploy from `main`.

> Articles content pipeline: see `docs/articles-decision-log.md` for the rationale behind the MDX-in-repo design (collection schema, OG image generation, RSS, JSON-LD, content migration).

> Resume print theme: see `docs/resume-print-theme.md` for the paper palette, type scale, and glyph rules the `/resume` route implements. This document covers only the architecture of that route (§4, §5, §7, §8, §11, §12).

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
| OG image generation     | **grafex** (build-time WebKit rendering via Playwright) — runs in `prebuild` to emit per-article PNGs into `public/og/articles/` and per-note PNGs into `public/og/notes/`. |
| PDF export              | **Playwright Chromium** driving `page.pdf()` against a local `next start` — manual `pnpm resume:pdf` only, never part of the build (see §7, §12). `playwright` is a **direct** devDependency (was transitive via grafex); `postinstall` installs `webkit chromium`. |
| Node runtime            | **v24.12.0**, pinned in `.nvmrc`. Required as a floor by `scripts/resume/generate.ts`, which runs as TypeScript under Node's native type stripping — no `tsx`, no ts-node, no build step. |
| QR generation           | `qrcode` — `QRCode.create()` is synchronous, so `/resume`'s QR block renders as server-side SVG `<rect>`s (no canvas, no raster, no client JS) |
| Class utilities         | `clsx`                                                                                     |
| Analytics               | Vercel Analytics via `@vercel/analytics/next` — `<Analytics />` in root layout             |
| Fonts                   | **JetBrains Mono** (body) + **VT323** (pixel-display headings), via `next/font/google`; plus route-local **static** JetBrains Mono `.woff2` files via `next/font/local` on `/resume` only (see §8) |
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
│   ├── resume-print-theme.md      # /resume print spec — palette, type scale, page math
│   ├── resume-tech-list.md        # rationale for the resume's curated technologies list
│   └── architecture.md            # this file
├── public/
│   ├── me.jpg                     # about-page portrait
│   ├── resume.pdf                 # COMMITTED — manual export of /resume via `pnpm resume:pdf`; the about page's download target
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
│   │   ├── design-system/         # separate route — outside the (site) group
│   │   │   ├── layout.tsx         # bare shell: max-w-shell container + <main> only
│   │   │   ├── page.tsx           # /design-system — living reference page
│   │   │   └── _components/       # band sections, private to this route
│   │   └── resume/                # separate route — outside the (site) group, no layout of its own
│   │       ├── page.tsx           # /resume — print-themed resume (noindex, absent from sitemap); styled with inline Tailwind utilities
│   │       ├── fonts.ts           # next/font/local — STATIC per-weight JetBrains Mono, /resume only (see §8)
│   │       ├── _fonts/            # the four vendored .woff2 static instances
│   │       ├── print.css          # @page { size: A4; margin: 12mm } — nothing else (see §5)
│   │       └── _components/       # section-heading, resume-qr — private to this route
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
│   │       ├── static-jobs-repository.ts
│   │       ├── employment-history.ts          # EMPLOYMENT_HISTORY — shared dataset behind /career + /resume
│   │       ├── static-menu-repository.ts
│   │       ├── static-projects-repository.ts
│   │       └── static-resume-repository.ts    # resume content as typed data
│   └── styles/
│       ├── globals.css            # Tailwind import + @theme inline token block
│       └── shiki/
│           └── brutalist-mono.json # custom Shiki theme for code blocks
├── tools/                         # grafex compositions (excluded from tsconfig — see §11)
│   ├── og.tsx                     # home OG card
│   ├── og-article.tsx             # per-article OG card
│   └── og-note.tsx                # per-note OG card
├── scripts/
│   ├── og/generate.mjs            # prebuild step — iterates articles + notes + invokes grafex (stays .mjs — see §11)
│   └── resume/generate.ts         # MANUAL (`pnpm resume:pdf`) — next start + Playwright Chromium → public/resume.pdf
├── .velite/                       # GENERATED (gitignored) — Velite compiled output (typed + JSON)
├── velite.config.ts               # Velite collection schema for articles + notes
├── .nvmrc                         # v24.12.0 — floor for native TS type stripping (scripts/resume/generate.ts)
├── eslint.config.mjs
├── next.config.mjs                # turbopack.root pin + top-level `await build()` for Velite
├── postcss.config.js              # @tailwindcss/postcss
├── tsconfig.json
├── package.json
└── README.md
```

Path alias: `@/*` resolves to `src/*`.

### Role of each top-level `src/` directory

- **`src/app/`** — App Router routes. The root `layout.tsx` is bare (`<html>`/`<body>` + fonts + GA only); the page shell lives one level down. The `(site)` route group holds the content routes under a shared shell `layout.tsx`; `design-system/` is a separate route with its own bare layout and `resume/` is a separate route with no layout at all (root layout only); `not-found.tsx` sits at the root and replicates the shell; `articles/rss.xml/route.ts` and `notes/rss.xml/route.ts` are static Route Handlers that live outside the `(site)` group because they return XML, not HTML. Each `page.tsx` is a Server Component unless explicitly marked `'use client'`. See §4.
- **`src/components/`** — Every UI component, from primitives (button, link, tag) to page sections (project-card, role-card, article-card, note-block). Names mirror the component vocabulary documented in `docs/design-system.md`. The `mdx/` subdirectory holds components that render inside article and note prose (`YouTube`, `Figure`, `FigureCaption`, `ImageMdx`, `PreShiki`, `CopyButton`). The nested `mdx/rss/` subdirectory holds HTML-only React mirrors of the page-side MDX components (`youtube`, `figure`, `image-mdx`, `inline-link`, `pre-shiki`) — no client JS, used solely by the RSS renderer to produce inert markup for feed readers.
- **`src/content/`** — Authored content. Two collections: `articles/<slug>/index.mdx` (one folder per article, with optional co-located `images/`) and `notes/<slug>.mdx` (flat — one file per note; rare local media goes in `notes/_assets/<slug>/`). Velite reads both trees at build time. See §7.
- **`src/lib/`** — Pure, framework-agnostic utility modules with no React or Next dependency (the one exception being `rss-renderer.tsx`, which uses React only at build time to stringify HTML). Eight modules today: `safe-href.ts` (a URL allowlist guard accepting only http/https, relative, fragment, `mailto:`, and `tel:` schemes), `format-date.ts` (the `formatMonthYear` / `formatDateRange` / `formatDate` date formatters), `reading-time.ts` (word count + reading-time estimator at 220 WPM, used by Velite's transform), `config.ts` (exports `SITE_ORIGIN`, the canonical origin used wherever absolute URLs are emitted — RSS items, sitemap entries, JSON-LD, OG meta), `mdx-jsx-allowlist.ts` (exports `MDX_JSX_ALLOWLIST` — the single source of truth for which MDX JSX components are permitted; enforced at Velite build time, mirrored in the RSS component map), `rss-url.ts` (exports `absolutize(url, basePath)` — the URL absolutization helper for RSS HTML output, where `basePath` is the full path segment `articles/<slug>` or `notes/<slug>`; handles `http(s):`, protocol-relative `//`, `mailto:` / `tel:`, absolute `/path`, fragment `#hash`, and relative `./` forms), `rss-helpers.ts` (exports `escapeXml` / `toRfc822` / `escapeCdata` — the shared serialization helpers used by both RSS Route Handlers), and `rss-renderer.tsx` (exports a shared `renderEntryHtml(body, basePath)` core plus two thin wrappers, `renderArticleHtml(article)` and `renderNoteHtml(note)` — the build-time MDX→HTML renderer used by both the articles and notes RSS feeds; runs the compiled MDX body through `@mdx-js/mdx`'s `run()` with an RSS-specific component map and stringifies via `react-dom/server.edge.renderToStaticMarkup`).
- **`src/repositories/`** — Data-access seam. `index.ts` exports the `getRepositories()` factory; interfaces at the top level; concrete implementations under `implementations/`. See §7.
- **`src/styles/`** — `globals.css` (Tailwind import + `@theme inline` token block, including the `/resume` print palette) plus `shiki/brutalist-mono.json` (the custom Shiki theme loaded by `rehype-pretty-code`). The multi-theme `themes/*.css` system has been removed. Exactly one CSS file lives outside this directory: `src/app/resume/print.css`, which holds a single `@page` rule and nothing else — see §5.

---

## 4. Routing & Rendering

App Router. Three dynamic segments (`/articles/[slug]`, `/notes/[slug]`, `/notes/page/[page]`), two Route Handlers (`/articles/rss.xml` and `/notes/rss.xml`), no parallel/intercepting routes, no middleware. The `(site)` route group carries the content routes under a shared shell layout; `design-system` and `resume` are separate routes outside that group; the RSS Route Handlers live outside `(site)` because they return XML rather than the HTML shell.

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
| `/resume`             | `src/app/resume/page.tsx`                     | Server (static) — reads `StaticResumeRepository`         |
| `*` (404)             | `src/app/not-found.tsx`                       | Server (static)                                          |

`/design-system` is a live public route but is an internal living-reference page (it renders every production component to validate the system). It is excluded from `sitemap.ts` and sets `robots: { index: false }` in its `metadata`, so it stays out of search indexes.

`/resume` follows the same noindex pattern, for a different reason: it renders a phone number and email as plain text, and there is no value in a second indexable copy of a document already published as `/resume.pdf`. It sets `robots: { index: false }` and is deliberately absent from the `staticRoutes` array in `sitemap.ts`. Nothing on the site links to it — the about page's "Download resume" button points at `/resume.pdf`, the exported artifact. The route exists to be *rendered into* that artifact (see §7); browsing it is a side effect. The noindex default can be flipped later if the contact block ever moves behind an obfuscation; it is not a permanent decision.

The page is a **single column, full width**, with DOM order equal to reading order equal to PDF extraction order: header (with the QR block inline), Experience in full, then a `break-before-page` fold, a page-2 continuation head, Education, and Technologies. The fold is forced explicitly rather than left to reflow, so the page break lands in a known place as content changes. Individual roles carry `break-inside-avoid` so a role never splits across the fold. The single-column shape is a hard requirement, not a style preference — see the extraction-order note in §7.

### Layout arrangement

The root `src/app/layout.tsx` is bare — `<html>` + `<body>` + fonts + `<Analytics />`, nothing else. The page shell (SkipLink + Header + `<main>` + Footer inside the `max-w-shell` container) lives in `src/app/(site)/layout.tsx`, so it wraps only the content routes inside the `(site)` group. `src/app/design-system/layout.tsx` is a separate bare layout — just the `max-w-shell` container and `<main>`, no Header/Footer/SkipLink — because the design-system page is a reference surface, not part of the site chrome. `/resume` goes one step further and declares **no** layout of its own: it inherits only the bare root layout, and its page component *is* the `<main class="resume">` element. Any shared chrome would have to be print-hidden again for the PDF export, so the route never opts into it. Since the root layout is bare and route-group layouts don't wrap root-level files, `src/app/not-found.tsx` replicates the shell (SkipLink + Header + Footer + container) itself.

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
- **Print theme (`/resume` only)** — a parallel contract for paper, living in the same block but not part of the screen one: six `--color-resume-*` colors; seven `--text-resume-*` sizes named by role (`name`, `role`, `heading`, `entry`, `summary`, `body`, `meta`), each with a paired `--line-height`, matching the `--text-h1/h2/h3` convention; and `--font-resume`, an alias resolving to the route-local static font. The alias is named `--font-resume`, not `--font-resume-mono`, so it doesn't self-reference the raw variable `next/font/local` emits — the same indirection as the site-wide `--font-mono` / `--font-jetbrains-mono` pair. See the print-theme subsection below.

### Single palette, no theming

The multi-theme system (`src/styles/themes/*.css`, the `ThemeSelector` component, the `theme` cookie handling in `layout.tsx`, the `body.animate` easter-egg keyframe) **has been removed**. There is exactly one palette, and it lives in `globals.css`. `<html>` no longer carries a `data-theme` attribute.

### Class-only styling

The styling rule is unambiguous:

- **No CSS classes are defined outside `globals.css`.** Component styles compose Tailwind utility classes; ad-hoc CSS goes into `globals.css` only when a utility composition genuinely can't express it.
- **No arbitrary values anywhere in the codebase**, with exactly one documented exception (`/resume`, below). No `bg-[#0B0F0A]`, no `text-[14px]`, no `mt-[7px]`. Every size, color, and spacing reference resolves to a token in the `@theme` block. If a value isn't expressible with the existing tokens, the answer is to add a token, not to inline a literal.
- **Tokens are the only styling vocabulary.** When in doubt about which token to use for a given visual treatment, `docs/design-system.md` documents each one's intended use.

Tokens are documented (with names, intended use, and contrast notes) in `docs/design-system.md`.

### The `/resume` print theme — a scoped exception

`/resume` is the one surface that does not speak the site's visual vocabulary, and the exception is deliberate: it targets white paper, not a dark screen, and the accent lime is unusable as print text or rules. Its palette, type scale, and font are a **self-contained second contract**, not a re-expression of the tokens above — but they are registered in the same `@theme inline` block, which is what lets the route be built out of ordinary utilities (`bg-resume-paper`, `text-resume-name`, `font-resume`) rather than a parallel class system. `docs/resume-print-theme.md` is the spec they implement.

**Everything else on the route is inline Tailwind, not CSS.** The route first shipped as a ~260-line `.resume` block of BEM-style classes in `globals.css`; that was converted to utilities in the page's JSX, per the standing convention: utilities in the markup, raw CSS only where a utility genuinely cannot express the rule. Exactly two things clear that bar:

- **`body:has(> main.resume)`** (in `globals.css`) forces a white page background for this route. `body` carries the dark canvas for every other route, and the resume's own white background is only as tall as its content — on a mostly-empty page 2 the dark canvas would otherwise bleed through. No utility can reach an ancestor from inside the route's own page component. This is the only remaining job of the `.resume` class: it is a selector hook, no longer a styling namespace.
- **`@page`** (in `src/app/resume/print.css`) — see below.

This route is also the documented exception to the "no arbitrary values" rule above, though a narrower one than it first was. Type and color resolve to `resume-*` tokens like everywhere else; what remains inline are the print layout values — the sheet width (`max-w-[527.24pt]`), vertical rhythm (`mt-[14pt]`, `gap-x-[14pt]`), hairline widths (`border-[0.5pt]`), and the QR block's fixed size (`h-[60pt]`). Those are `pt` measurements against a fixed A4 box, a unit the site's screen spacing scale has no vocabulary for, and `docs/resume-print-theme.md` fixes the exact budget. The exception is bounded to this one route; nothing outside it uses `pt`.

**`@page` cannot live in `globals.css`.** `src/app/resume/print.css` exists solely to hold:

```css
@page { size: A4; margin: 12mm }
```

Two independent reasons that rule is where it is and says what it says:

1. **It cannot be scoped.** `@page` is document-level CSS — there is no `.resume @page`. Placed in `globals.css` it would set A4 print formatting for **every** route on the site, silently changing what anyone printing an article gets. Keeping it in a route-local file imported only by `src/app/resume/page.tsx` confines it to the `/resume` chunk; this containment was verified in the build output. The file holds no class rules, so the "no CSS classes outside `globals.css`" rule above still stands as written.
2. **The margin must be a page margin, not element padding.** An earlier arrangement paired `margin: 0` here with padding on the `.resume` element. That was a bug: element padding applies once to the whole flow and does not repeat after a page break, so page 1 got a 12.5mm top margin while page 2 got 5.1mm. A uniform `@page` margin is applied by the print engine to every sheet, which is the only way page 1 and page 2 can agree. Do not move this back onto the element.

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
    Static -->|Jobs + Resume both project from| Employment[("employment-history.ts<br/>EMPLOYMENT_HISTORY")]
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

1. **Static repositories** — data is hard-coded in the class. The content for the career page, projects page, footer social links, site menu, and resume all live here. Changes ship as code commits.
   - `StaticResumeRepository` returns a single `ResumeRepositoryResponse` object (`get()`, not `getAll()`) — name, role, contact block, summary, `experience[]`, `education[]`, `technologies[]`. Routing resume content through a repository rather than inlining it in the page is what makes the copy editable without touching print layout, which is the whole point of the route.
   - `StaticJobsRepository` is a plain `.ts` file. It was `.tsx` for as long as role descriptions were JSX; unifying the two surfaces (see below) turned them into plain-string bullets, and the extension followed.
2. **Local file-system repositories** — `LocalArticlesRepository` and `LocalNotesRepository` both read pre-built MDX collections emitted by Velite (`.velite/article.json` and `.velite/note.json`, surfaced as the typed `article` and `note` arrays exported from `@/.velite`). Their interfaces are synchronous (`getAll(): Article[] | Note[]`, `getBySlug(slug): Article | Note | undefined`) — there is no async data source. `getAll()` sorts by `publishedAt` descending so callers don't re-sort.

### One employment dataset, two surfaces

`src/repositories/implementations/employment-history.ts` exports `EMPLOYMENT_HISTORY`, the single source of truth for the work history rendered by **both** `/career` (via `StaticJobsRepository`) and `/resume` (via `StaticResumeRepository`). Both repositories are now thin projections of it.

The two surfaces previously held independent copies of the same history, and they had already drifted in exactly the ways duplicated data drifts:

- a **factual conflict** — the same employer named `Grupo Gmaes` on one surface and `Gmaes Telecom` on the other (`Grupo Gmaes` is the value corroborated by `docs/ui-spec.md`, `docs/copy-guide.md`, and `docs/redesign-log.md`, so it is the corrected one);
- **silently truncated bullets** on the resume, with no record that the shortening was intentional;
- a **grammar regression** (`Contributed with code reviews`) that existed only in the resume copy.

Unification makes that class of drift structurally impossible for the facts that must never diverge — employer, titles, dates, and role ordering now have exactly one definition.

Print compression is handled by shape rather than by a second copy. Each bullet is `{ text: string; short?: string }`:

- `/career` always renders `text` — the full wording.
- `/resume` renders `short ?? text` — the condensed wording when one exists, the full text otherwise.

So the *decision to shorten* is explicit, diffable, and reviewable next to the wording it replaces, instead of being an invisible divergence between two files. When editing, the invariant to preserve is which surface reads which field; swapping them leaks print-compressed copy onto `/career`.

**Two things are deliberately not shared, and this is not an oversight:**

- **The resume's `technologies` list** is a curated 15-item positioning statement, authored directly in `StaticResumeRepository`. It is not derivable from the per-role `technologies` arrays in the dataset — the union of those is longer, historically weighted, and says something different about what the candidate is now. `docs/resume-tech-list.md` records the reasoning.
- **Education** is authored independently in `StaticResumeRepository`, separate from the About page's own education content. The two answer different questions and are allowed to differ in framing.

Dates stay as `Date` objects all the way through both repositories rather than being pre-formatted into strings at the data layer, so both surfaces run through the same `src/lib/format-date.ts` helpers and cannot drift on dash glyph or casing. `formatMonthYear` / `formatDateRange` grew an `openLabel` parameter defaulting to `'now'` for the open-ended (current) role: `/career` keeps the default, `/resume` passes `'present'` — the term a resume reader or an ATS scans for. An optional parameter rather than a fork, so `/career`'s existing behavior is untouched by the resume's existence.

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

### Resume PDF pipeline

Unlike the article and note pipelines, this one is **manual and human-triggered**. The route is the source; the PDF is a committed artifact.

```
employment-history.ts + static-resume-repository.ts   (typed data)
            │
            ▼
       /resume (static route)  ──▶  rendered HTML + print theme utilities
            │
            │   pnpm resume:pdf   (MANUAL — never runs in the build)
            ▼
next build → next start on 127.0.0.1 → Playwright Chromium page.pdf()
            │
            ▼
    public/resume.pdf.tmp  ──▶  validate  ──▶  rename  ──▶  public/resume.pdf  (COMMITTED)
```

- **Chromium, not WebKit.** Playwright's `page.pdf()` is Chromium-only, so this script cannot reuse the WebKit browser grafex already needs for OG images. `playwright` was therefore promoted from a transitive dependency of grafex to a direct devDependency, and `postinstall` now installs `webkit chromium` rather than WebKit alone.
- **TypeScript, run without a build step.** `scripts/resume/generate.ts` is executed directly by `node` using native type stripping — no `tsx`, no ts-node, no compile output — which is why `.nvmrc` pins the Node version. `scripts/og/generate.mjs` deliberately stays plain `.mjs`: it predates this, has no types worth adding, and rewriting a working prebuild step to match a naming convention is churn with deploy risk attached. **The split is intentional; do not "fix" the inconsistency.** New scripts that would benefit from types should be `.ts`.
- **Loopback, not a static export.** The script runs a real `next build` and boots `next start` bound to `127.0.0.1` (port overridable via `RESUME_PDF_PORT`), then navigates Chromium to it. Rendering the production build is what guarantees the PDF reflects what ships, including the route-local font loading and the `@page` rule; a dev-server render or a raw HTML file would not.
- **Write to a temp path, validate, then rename.** `page.pdf()` writes `public/resume.pdf.tmp`, which is validated before an atomic same-directory `renameSync` moves it into place. Writing straight to `public/resume.pdf` would clobber a known-good committed artifact the instant a broken render succeeded at the file-writing level.
- **Validation is the point, not a nicety.** Three poppler checks gate the rename: page count against a pinned `EXPECTED_PAGE_COUNT`, `pdffonts` output containing no `Type 3` font (the exact defect this route exists to fix — see §8), and `pdftotext` containing a hardcoded list of durable strings (name, contact details, one employer, one job title, one institution). Those strings are deliberately **not** read from the repository — deriving expectations from the data being validated would let a corrupted data file pass its own check. Bullet text is excluded because ordinary copy edits change it. Requires poppler locally (`brew install poppler`).
- **The committed PDF can drift, and has.** `public/resume.pdf` is tracked in git (it is *not* gitignored, unlike `.velite/` or `public/static/`) and nothing regenerates it automatically. Editing the employment dataset, the resume repository, or the page changes `/resume` on the next deploy but leaves the downloadable PDF — the file the about page actually links to — shipping the pre-fix text. This happened during the route's own development: a copy fix landed in source while the committed PDF kept the old wording, and it was caught by eye rather than by tooling. The rule is therefore: **any commit that touches resume source stages a regenerated `public/resume.pdf` alongside it.** When a "the PDF still says X" report comes in, check `pdftotext public/resume.pdf -` against source before assuming the source is wrong.

  A guard now enforces that rule — but only partially, and the limit matters. It lives in `.claude/hooks/pre-commit-review-check.sh` as a Claude Code `PreToolUse` hook, so it fires only for commits issued through Claude Code's Bash tool, and `--no-verify` bypasses it. There is no git hook and no CI check (see §11), so a commit made from a terminal or an IDE skips it entirely and can still ship a stale PDF — precisely the case the guard was written for. Treat it as a safety net over the usual workflow, not as a guarantee about what is in the repository.

The export runs with `preferCSSPageSize: true` (so the `@page` rule in `print.css` — not a Playwright argument — is what defines the A4 sheet and its margins), `printBackground: true` (the fills are load-bearing), and `tagged: true`.

**Single column is a constraint, not a style choice.** For any genuinely side-by-side layout, default-mode `pdftotext` — the approximation of what an ATS or Cmd+F sees — interleaves the columns row-by-row by Y-position regardless of source order. That was verified exhaustively against CSS grid, flexbox, a `<table>`, CSS multi-column, an absolutely-positioned sidebar, and even PDF-level compositing of two separately-rendered documents; all interleave identically. `pdftotext -raw` reads them correctly, which confirms Chromium writes the content stream in DOM order and poppler's default reading-order heuristic re-sorts it. `tagged: true` does not help — the default extractor doesn't consult the structure tree. A two-column resume and correct default-mode extraction are therefore mutually exclusive through any browser print engine, so the route stacks everything in one column. Anyone reintroducing a sidebar is trading away the property the route exists to provide.

**The two-page length is deliberate.** This content at the print spec's type scale does not fit one A4 sheet, so the page break is placed explicitly (`break-before-page` plus a page-2 continuation head) rather than left to reflow, and `EXPECTED_PAGE_COUNT = 2` in the export script pins it. Bump that constant only after a real content or layout change — never to silence a failing check.

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

### Route-local static fonts (`/resume`) — deliberate duplication, do not consolidate

`src/app/resume/fonts.ts` loads **JetBrains Mono a second time**, from four vendored `.woff2` files in `src/app/resume/_fonts/` (weights 400/500/600/700) via `next/font/local`, exposed as `--font-resume-mono` and applied only on the `/resume` route. This looks like an obvious cleanup target. It is not — removing it silently breaks the PDF.

The reason: Google Fonts only ships JetBrains Mono as a **variable-font master**, so `next/font/google` gives the site a variable font. On screen that is invisible and strictly better. But when Chromium exports a PDF, a variable-font instance pinned via `font-variation-settings` is embedded as a **Type 3** font — a bitmap/procedural glyph format that destroys text extraction (an ATS or `pdftotext` gets garbage) and inflates the file. That is precisely the defect the `/resume` route was built to fix. Genuinely static per-weight faces embed as properly subsetted CID TrueType instead.

Consequences worth knowing before touching this:

- The four files were copied from `@fontsource/jetbrains-mono` and verified with fontTools to carry **no `fvar` table** — i.e. they are real static instances, not a variable font pinned to one axis position. A pinned variable font would look identical in the repo and still produce Type 3 output. If these files are ever replaced, re-verify that.
- The family is applied as an ordinary utility: `next/font/local` exposes the raw variable `--font-resume-mono`, scoped to the route by putting `resumeMono.variable` on the page's root `<main>`; `globals.css` registers `--font-resume` in the `@theme` block as an alias for it plus the monospace fallback stack; the page writes `font-resume`. The alias resolves to `--font-resume-mono` and never to the site's `--ff-mono` — repointing it at the site variable "to avoid loading the font twice" reintroduces the bug.
- Every weight the page actually renders must be loaded explicitly. A weight used only in CSS but never loaded gets synthesized from whatever resource the browser can find — which produces the same Type 3 outcome.
- The duplication costs four extra `.woff2` files served on exactly one noindexed route. That is the whole price.
- The regression is caught rather than trusted: `pnpm resume:pdf` fails the export if `pdffonts` reports any Type 3 font (see §7).

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
| **Google Fonts**     | JetBrains Mono + VT323, self-hosted by Next through `next/font`      | `src/app/fonts.ts`. Not involved on `/resume` — that route's faces are `.woff2` files vendored into the repo (`src/app/resume/_fonts/`, see §8) |
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
| `pnpm resume:pdf`  | `node scripts/resume/generate.ts`  | **Manual only** — never wired into `prebuild`. Builds, boots `next start` on `127.0.0.1`, renders `/resume` with Playwright Chromium, validates, writes `public/resume.pdf`. Stage the regenerated PDF with the change that prompted it. Run directly as TypeScript via Node's native type stripping (hence the `.nvmrc` pin); needs poppler (`pdfinfo`/`pdffonts`/`pdftotext`) installed locally. See §7. |
| `postinstall`      | `[ -n "$VERCEL" ] \|\| playwright install webkit chromium` | Installs both browser binaries locally — WebKit for grafex's OG rendering, Chromium for the resume PDF (`page.pdf()` is Chromium-only). Skipped entirely on Vercel, where `$VERCEL` is set and neither browser can run. |
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
- `include` is repo-wide (`**/*.ts`, `**/*.tsx`), so `scripts/resume/generate.ts` is type-checked and linted by the same project as application code without any extra config — part of why the export script is worth having as TypeScript at all.

### Generated artifacts

These paths under the repo root are outputs, not source. The first two are gitignored; the rest are generated *and* committed, because the tool that produces them cannot run on Vercel's build container (see §12).

- **`/.velite`** — Velite's compiled content (typed `article.d.ts` + `article.json` + `note.d.ts` + `note.json`). Regenerated on every dev/build run. Never edit by hand.
- **`/public/static`** — content-hashed copies of MDX-referenced images, emitted by Velite's asset handler. Regenerated alongside `.velite`.
- **`/public/og/articles`** — per-article OG PNGs, emitted by `scripts/og/generate.mjs`. Regenerated by the `prebuild` step. Committed only if the grafex escape hatch is active (see §12).
- **`/public/og/notes`** — per-note OG PNGs, emitted by the same script alongside articles. Same regeneration and commit behavior.
- **`/public/resume.pdf`** — the exported resume, produced by `scripts/resume/generate.ts` (`pnpm resume:pdf`). **Tracked in git and never regenerated automatically** — no build step touches it. Re-run the script and stage the result after any change to the employment dataset, `static-resume-repository.ts`, the `/resume` page, or its print styling, or the downloadable PDF drifts from the route (see §7).

`.velite/` and `public/static/` are listed in `.gitignore`; the OG PNGs and `resume.pdf` are committed.

### Pre-commit checks

**There are no git hooks.** No `.git/hooks/pre-commit`, no `core.hooksPath`, no `.husky/`, no `lint-staged`, no Prettier, and no CI workflow — `.github/workflows/` doesn't exist (see §12). Lint runs via Vercel on push and via the agent pipeline before commit.

What does exist is `.claude/hooks/pre-commit-review-check.sh`, wired as a Claude Code **`PreToolUse` hook on the Bash tool**. It inspects any command containing `git commit` and blocks it when:

- `git add` and `git commit` are combined in one command (they must be separate, so the hook can inspect a staged set);
- **resume source is staged without a re-staged `public/resume.pdf`** — the drift guard described in §7. It matches the resume route, the resume/employment repositories, the repository factory, and `format-date.ts` by path; for `globals.css` it inspects the staged *diff* instead, firing only when the change actually touches a `resume` token or selector, so ordinary site-wide CSS edits don't trip it and train a reflexive `--no-verify`;
- required review markers are missing or stale, or the reviewed-content hash no longer matches the working tree.

**Know what this does and does not cover.** It is a guard on the agent pipeline, not a property of the repository. It only fires for commits issued through Claude Code's Bash tool — a commit made from a terminal, an IDE, or a git GUI never sees it, and `--no-verify` bypasses it by design. For the resume PDF specifically, that is the exact failure mode the guard exists to prevent: a hand-made commit can still ship a stale artifact. Closing the gap would take a real git hook (which every clone would have to install) or a CI check on the PR. Neither exists today, and whether to add one is an open decision.

---

## 12. Deployment

- **Platform**: Vercel, connected to the GitHub repo `andresilva-cc/andresilva.cc`. Auto-deploy from `main`; preview deploys per PR.
- **Build**: `pnpm install` → `pnpm build`, which fires the `prebuild` script (`scripts/og/generate.mjs`) and then `next build`. The `next.config.mjs` pins `turbopack.root` and calls `await build()` from Velite at the top level so `.velite/` is populated before any module resolves `@/.velite`. Otherwise default Next output, image optimization, and runtime.
- **OG generation on Vercel is currently disabled via the §6.1.2 escape hatch.** Vercel's build container is missing ~40 system libs that WebKit needs (libgtk-4, libgstreamer, libvulkan, libgraphene, …) and the container doesn't allow `apt install`. So `SKIP_OG_BUILD=1` is set in Vercel project env vars — the prebuild script exits before grafex is imported, and Vercel serves the per-article PNGs committed under `public/og/articles/` and the per-note PNGs committed under `public/og/notes/`. Local flow: regenerate after editing article/note frontmatter or either OG template (`tools/og-article.tsx`, `tools/og-note.tsx`) with `pnpm og:generate` (or `pnpm build` — both run the same script), then commit the updated PNGs.
- **The resume PDF is never generated on Vercel.** Same underlying constraint as OG generation, one step worse: `page.pdf()` requires Chromium, and Vercel's build container has no browser binary at all — `postinstall` short-circuits on `$VERCEL` and installs neither WebKit nor Chromium. `pnpm resume:pdf` is therefore a local, human-run export whose output (`public/resume.pdf`) ships in git and is served as a static file. Wiring it into `prebuild` would break every deploy, and it also runs its own `next build`, which would recurse.
- **Environment variables**: there are no required env vars for the site to build or render. Analytics has no config (Vercel auto-detects). Required on Vercel: `SKIP_OG_BUILD=1` (see above — disables the OG prebuild that can't run on Vercel's container).
- **Domain / DNS**: `andresilva.cc`, managed via Vercel.
- **CI**: deployment status is visible via the deployments badge in `README.md`; there is no `.github/workflows/` directory — CI is whatever Vercel runs on push/PR.

---

## 13. Notable Conventions

- **Server by default, client only where needed.** Pages and structural components stay server-rendered; only genuinely interactive islands carry `'use client'`.
- **Tokens-only styling.** Every visual value resolves to a token in `globals.css`. No arbitrary values, no inline literals.
- **The `/design-system` route is the visual contract.** When implementing or changing a component, it must render correctly on that route; it is the live reference each component implements.
- **Repository pattern is the data seam.** Pages depend on interfaces, never on concrete implementations.
- **Utilities in the markup, CSS only when a utility can't express it.** Styling is authored as Tailwind classes in JSX; a rule earns a place in `globals.css` by being genuinely unreachable from a utility (an ancestor selector, a document-level at-rule). A large hand-written class block is a smell, not a shortcut — the `/resume` route's original `.resume` BEM block was converted for exactly this reason.
- **Committed generated artifacts are staged with the change that invalidates them.** The per-article and per-note OG PNGs and `public/resume.pdf` are outputs that ship in git because they can't be produced on the deploy container. Whoever changes the source regenerates and stages the artifact in the same commit; otherwise the site serves stale output while the code reads correct. For the resume PDF this is partly automated by a Claude Code `PreToolUse` hook, which only covers commits made through the agent pipeline — the convention, not the tooling, is what holds for a commit made any other way (see §11).
- **Route-private code lives in `src/app/<route>/_components/`** (Next's private-folder convention). `src/components/` is for the shared vocabulary; anything only one route can use — the design-system bands, the resume's section heading and QR block — stays next to its page and is not part of the component inventory in §6.
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
- No automated PDF generation. `public/resume.pdf` is exported by hand (`pnpm resume:pdf`) and committed; no build step, CI job, or hook regenerates it. Also no headless browser at runtime — Playwright is a local-only devDependency, used by the OG and resume scripts.
- **No merged `/feed.xml`.** Articles and notes ship as two separate full-content feeds (`/articles/rss.xml`, `/notes/rss.xml`) rather than one combined feed — notes are own-site-only while articles syndicate to dev.to, so the two surfaces have different audiences. A merged feed can be added later if readers request it. Notes are **not** syndicated to dev.to.
