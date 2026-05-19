# Architecture

A snapshot of how andresilva.cc is built today, after the redesign. The site is a mature, one-developer marketing/portfolio site deployed to Vercel. It is mostly static, with a single async data source (dev.to via the Forem API) and a small client-side surface for route-aware navigation and a hero animation.

This document describes **what is**, not what should be. Treat the code as the source of truth; update this doc when a task materially changes the architecture.

---

## 1. Overview

- **Domain**: https://andresilva.cc
- **Purpose**: Personal site — home, about, career, projects, and articles (mirrored from dev.to).
- **Shape**: Next.js App Router app, Server Components by default, with two `'use client'` islands: `nav.tsx` (route-aware active highlighting) and `stipple-art.tsx` (loads the external ASCII-art Web Component).
- **Visual reference**: the shipped code is the source of truth — the token block in `src/styles/globals.css` and the components in `src/components/`, live-rendered at the `/design-system` route. `docs/redesign-log.md` is the decision log.
- **Data**: Content is either hard-coded in "static" repositories or fetched from the Forem (dev.to) API at request time. There is no database, no auth, no backend of our own, and no user-generated content.
- **Deployment**: Vercel, auto-deploy from `main`.

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
| HTTP client             | `axios` (used only to call Forem)                                                          |
| Class utilities         | `clsx`                                                                                     |
| Analytics               | Vercel Analytics via `@vercel/analytics/next` — `<Analytics />` in root layout             |
| Fonts                   | **JetBrains Mono** (body) + **VT323** (pixel-display headings), via `next/font/google`     |
| Package manager         | pnpm **10.27.0**                                                                           |
| Lint                    | ESLint **9** flat config: `eslint-config-next/core-web-vitals` + `@stylistic/eslint-plugin`, airbnb base |
| Hosting                 | Vercel (auto-deploy from `main`)                                                           |

The `next.config.mjs` carries a single option — `turbopack.root` (pins the workspace root; see §5). There is **no** `tailwind.config.*` (Tailwind 4 CSS-first via `@theme inline`), **no** Prettier, and **no** test framework configured in the repo.

---

## 3. Project Structure

```
andresilva.cc/
├── docs/
│   ├── status.md              # project snapshot + conventions
│   ├── workflow.md            # agent pipeline workflow
│   ├── design-system.md       # token + component reference
│   ├── redesign-log.md        # redesign decision log
│   └── architecture.md        # this file
├── public/
│   ├── me.jpg                 # about-page portrait
│   ├── resume.pdf             # /resume.pdf link target
│   ├── logo.svg
│   ├── robots.txt             # allow-all
│   └── docs/teseu.pdf
├── src/
│   ├── api/
│   │   └── forem.ts           # axios client for dev.to's Forem API
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx         # bare root layout: <html>/<body> + fonts + GA
│   │   ├── not-found.tsx      # 404 — at root; replicates the shell — SkipLink + Header + Footer + container
│   │   ├── fonts.ts           # next/font loaders
│   │   ├── sitemap.ts         # static sitemap for the five content routes
│   │   ├── favicon.ico
│   │   ├── (site)/            # route group — shared shell layout
│   │   │   ├── layout.tsx     # the shell: SkipLink + Header + main + Footer
│   │   │   ├── page.tsx       # / (home)
│   │   │   ├── about/page.tsx
│   │   │   ├── articles/page.tsx  # async — fetches from Forem
│   │   │   ├── career/page.tsx
│   │   │   └── projects/page.tsx
│   │   └── design-system/     # separate route — outside the (site) group
│   │       ├── layout.tsx     # bare shell: max-w-shell container + <main> only
│   │       ├── page.tsx       # /design-system — living reference page
│   │       └── _components/   # band sections, private to this route
│   ├── components/            # presentational + client components (the redesign vocabulary)
│   ├── lib/
│   │   ├── safe-href.ts         # URL allowlist guard (http/https/relative/fragment/mailto/tel)
│   │   ├── format-date.ts       # formatMonthYear / formatDateRange date formatters
│   │   └── get-slug.ts          # extracts the last path segment from a URL
│   ├── repositories/
│   │   ├── index.ts             # getRepositories() — factory for all repositories
│   │   ├── *.ts                 # interfaces (ArticlesRepository, ...)
│   │   └── implementations/
│   │       ├── forem-articles-repository.ts    # hits dev.to
│   │       ├── static-footer-repository.ts
│   │       ├── static-jobs-repository.tsx
│   │       ├── static-menu-repository.ts
│   │       └── static-projects-repository.ts
│   ├── styles/
│   │   └── globals.css        # Tailwind import + @theme inline token block
│   └── types/
│       ├── article.ts
│       └── project.ts
├── eslint.config.mjs
├── next.config.mjs            # turbopack.root pin
├── postcss.config.js          # @tailwindcss/postcss
├── tsconfig.json
├── package.json
└── README.md
```

Path alias: `@/*` resolves to `src/*`.

### Role of each top-level `src/` directory

- **`src/app/`** — App Router routes. The root `layout.tsx` is bare (`<html>`/`<body>` + fonts + GA only); the page shell lives one level down. The `(site)` route group holds the five content routes under a shared shell `layout.tsx`; `design-system/` is a separate route with its own bare layout; `not-found.tsx` sits at the root and replicates the shell. Each `page.tsx` is a Server Component unless explicitly marked `'use client'`. See §4.
- **`src/components/`** — Every UI component, from primitives (button, link, tag) to page sections (project-card, role-card, article-card). Names mirror the component vocabulary documented in `docs/design-system.md`.
- **`src/lib/`** — Pure, framework-agnostic utility modules with no React or Next dependency. Three modules today: `safe-href.ts` (a URL allowlist guard accepting only http/https, relative, fragment, `mailto:`, and `tel:` schemes), `format-date.ts` (the `formatMonthYear` / `formatDateRange` date formatters), and `get-slug.ts` (extracts the last path segment from a URL).
- **`src/repositories/`** — Data-access seam. `index.ts` exports the `getRepositories()` factory; interfaces at the top level; concrete implementations under `implementations/`. See §6.
- **`src/styles/`** — Single `globals.css` with the Tailwind import and the `@theme inline` token block. There are no other CSS files in `src/` after the redesign — the multi-theme `themes/*.css` system has been removed.
- **`src/types/`** — Shared TypeScript types for entities returned by repositories.
- **`src/api/`** — Low-level HTTP clients. Only `forem.ts` lives here today.

---

## 4. Routing & Rendering

App Router. No dynamic segments, no parallel/intercepting routes, no middleware. One route group (`(site)`) carries the five content routes under a shared shell layout; `design-system` is a separate route outside that group with its own bare layout.

| Path             | File                                 | Rendering                       |
| ---------------- | ------------------------------------ | ------------------------------- |
| `/`              | `src/app/(site)/page.tsx`            | Server (static)                 |
| `/about`         | `src/app/(site)/about/page.tsx`      | Server (static)                 |
| `/articles`      | `src/app/(site)/articles/page.tsx`   | Server, `async` — fetches Forem |
| `/career`        | `src/app/(site)/career/page.tsx`     | Server (static)                 |
| `/projects`      | `src/app/(site)/projects/page.tsx`   | Server (static)                 |
| `/design-system` | `src/app/design-system/page.tsx`     | Server (static)                 |
| `*` (404)        | `src/app/not-found.tsx`              | Server (static)                 |

`/design-system` is a live public route but is an internal living-reference page (it renders every production component to validate the system). It is excluded from `sitemap.ts` and sets `robots: { index: false }` in its `metadata`, so it stays out of search indexes.

### Layout arrangement

The root `src/app/layout.tsx` is bare — `<html>` + `<body>` + fonts + `<Analytics />`, nothing else. The page shell (SkipLink + Header + `<main>` + Footer inside the `max-w-shell` container) lives in `src/app/(site)/layout.tsx`, so it wraps only the five content routes. `src/app/design-system/layout.tsx` is a separate bare layout — just the `max-w-shell` container and `<main>`, no Header/Footer/SkipLink — because the design-system page is a reference surface, not part of the site chrome. Since the root layout is bare and route-group layouts don't wrap root-level files, `src/app/not-found.tsx` replicates the shell (SkipLink + Header + Footer + container) itself.

### Server-first, client where needed

Pages and structural components stay server-rendered. Exactly two files carry `'use client'`, and only because they genuinely need a client hook or DOM access:

- **`nav.tsx`** — reads `usePathname()` to mark the active item with `aria-current="page"` and route-aware accent highlighting. The header itself stays a Server Component; it reflows responsively via CSS flex-wrap at the `xs` breakpoint, with no JS disclosure/hamburger.
- **`stipple-art.tsx`** — loads the external `<stipple-art>` Web Component (home hero + article-thumbnail ASCII art) via a `useEffect` script injection.

Everything else — header, footer, page heads, section heads, project cards, role cards, article entries, tags, status dots, link arrows — is a Server Component.

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
- **Prose widths** — `--max-width-prose-narrow` (56ch), `--max-width-prose-bio` (60ch), `--max-width-prose-wide` (68ch), `--max-width-prose-card` (38ch).
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

The component layer is a vocabulary of roughly seventeen components, each a single visual concept:

- **Layout chrome**: `header`, `footer`, `wordmark`, `nav` (route-aware client component), `skip-link`.
- **Page structure**: `page-head`, `section-head`, `eyebrow`, `grid-frame`.
- **Inline primitives**: `tag` / `badge`, `status-dot`, `link-arrow`, `button-cta`.
- **Cards & rows**: `row` (home Latest), `project-card`, `role-card`, `article-entry`.
- **Media**: `photo-wrap` (about portrait with the filter token), `hero-art` / `stipple-art` (the ASCII-art embed — home hero + article thumbnails).

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
    Factory --> Forem["ForemArticlesRepository"]
    Forem -->|axios| DevTo[("dev.to<br/>Forem API")]
    Static --> Page
    Forem --> Page
    Page --> HTML[(Rendered HTML)]
```

### Repository pattern

`src/repositories/index.ts` exports `getRepositories()`, a plain factory function that returns fresh instances of every repository. Each page imports it (`from '@/repositories'`), destructures the repositories it needs, and calls `.getAll()` (or similar) on them.

There are two kinds of implementations:

1. **Static repositories** — data is hard-coded in the class. The content for the career page, projects page, footer social links, and site menu all live here. Changes ship as code commits.
   - `StaticJobsRepository` is written as `.tsx` because the `description` field is JSX (nested `<ul>`/`<li>`/`<p>`).
2. **Forem repository** — `ForemArticlesRepository` calls `GET /articles?username=andresilva-cc` on the Forem API via an axios client configured in `src/api/forem.ts`. The client reads `FOREM_API_URL` and `FOREM_API_KEY` from environment variables.

### Why keep the repository pattern

The site has no database and most content is hard-coded — at first glance the abstraction looks like over-engineering for static data. It is kept deliberately:

- **It is the i18n seam.** When the site grows a second locale, the swap point is the repository — `StaticProjectsRepository` becomes `LocalizedProjectsRepository` (or a wrapper) without touching any page or component.
- **It is the async-source seam.** `ForemArticlesRepository` is a genuine async data source going through axios to a third-party API. The interface lets pages stay agnostic about whether a given content type is hard-coded, fetched, or migrated to a CMS later.
- **It is the testing seam.** Pages depend on interfaces, not concrete classes; a future test suite can substitute fakes without monkey-patching.

This decision has been re-evaluated and ratified after the redesign — do not propose removing it without addressing these three roles.

### Data fetching

- `/articles` is an `async` Server Component; it `await`s `articlesRepository.getAll()` on each request. There is no explicit `fetch` caching config and no `revalidate` setting — Next's defaults apply.
- All other pages are fully static.

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
| **Forem / dev.to**   | Fetches the author's articles for `/articles`                        | `FOREM_API_URL`, `FOREM_API_KEY` (env)         |
| **Vercel Analytics** | Page-view and Web Vitals tracking via `@vercel/analytics/next`       | No configuration — Vercel project auto-detects  |
| **Google Fonts**     | JetBrains Mono + VT323, self-hosted by Next through `next/font`      | `src/app/fonts.ts`                             |

No other external services (no CMS, no database, no auth provider, no email, no payments).

---

## 11. Build, Lint & Dev Tooling

### Scripts (`package.json`)

| Script        | Command      |
| ------------- | ------------ |
| `pnpm dev`    | `next dev`   |
| `pnpm build` | `next build` |
| `pnpm start`  | `next start` |
| `pnpm lint`   | `eslint .`   |

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
- `paths: { "@/*": ["./src/*"] }`
- `target: es5` (Next's compiler downlevels; this target is essentially inert for modern Next builds)

### Pre-commit hooks

There are no pre-commit hooks configured: no `lint-staged`, no Prettier, no `.husky/` directory. Lint enforcement happens via Vercel's CI on push and via the agent pipeline before commit.

---

## 12. Deployment

- **Platform**: Vercel, connected to the GitHub repo `andresilva-cc/andresilva.cc`. Auto-deploy from `main`; preview deploys per PR.
- **Build**: `next build` (standard). The `next.config.mjs` pins `turbopack.root`; otherwise default output, image optimization, and runtime.
- **Environment variables**: `FOREM_API_URL` and `FOREM_API_KEY` must be set in Vercel for `/articles` to work. GA ID is hardcoded.
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
- No API routes (`app/api/*`), no Route Handlers, no server actions.
- No middleware.
- No multi-theme system, no theme selector, no theme cookie. The site is single-palette.
- No `tailwind.config.*` — Tailwind 4 is configured entirely via the `@theme inline` block in `globals.css`.
- No test suite or test runner.
- No i18n today (site is English-only). The repository pattern is the future seam for it.
- No CMS — content is either code-hard-coded or pulled from dev.to.
- No image pipeline beyond Next's default `<Image>` optimizer; the only runtime image is `/me.jpg`.
- No error-tracking/observability service — Vercel logs only.
