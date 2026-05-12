# Architecture

A snapshot of how andresilva.cc is built today, after the redesign. The site is a mature, one-developer marketing/portfolio site deployed to Vercel. It is mostly static, with a single async data source (dev.to via the Forem API) and a small client-side surface for the mobile menu and a few interactive affordances.

This document describes **what is**, not what should be. Treat the code as the source of truth; update this doc when a task materially changes the architecture.

---

## 1. Overview

- **Domain**: https://andresilva.cc
- **Purpose**: Personal site — home, about, career, projects, and articles (mirrored from dev.to).
- **Shape**: Next.js App Router app, Server Components by default, with a handful of `'use client'` islands for genuinely interactive chrome (mobile menu, hover-gated affordances).
- **Visual canon**: `redesign/design-system.html` is the canonical visual spec (token block, component vocabulary, contrast matrix). `redesign/*.html` are page mocks. `redesign/notes.md` is the decision log.
- **Data**: Content is either hard-coded in "static" repositories or fetched from the Forem (dev.to) API at request time. There is no database, no auth, no backend of our own, and no user-generated content.
- **Deployment**: Vercel, auto-deploy from `main`.

---

## 2. Tech Stack

| Area                    | Choice                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------ |
| Framework               | Next.js **16.1.1** (App Router, Turbopack dev server)                                      |
| UI library              | React **19.2.3** + React DOM 19.2.3                                                        |
| Language                | TypeScript **5.9.3** (`strict: true`, `moduleResolution: bundler`, `@/*` → `src/*`)        |
| Styling                 | Tailwind CSS **4.1.18** via `@tailwindcss/postcss` (CSS-first config, no `tailwind.config`)|
| Headless UI primitives  | `@headlessui/react` (mobile menu disclosure), `@radix-ui/react-slot` (for `asChild`)       |
| Icons                   | `@phosphor-icons/react` (SSR-safe imports from `/dist/ssr/index`)                          |
| HTTP client             | `axios` (used only to call Forem)                                                          |
| Class utilities         | `clsx`                                                                                     |
| Analytics               | Google Analytics via `@next/third-parties/google` (gaId `G-TLHZYGS1SJ`)                    |
| Fonts                   | **JetBrains Mono** (body) + **VT323** (pixel-display headings), via `next/font/google`     |
| Package manager         | pnpm **10.27.0**                                                                           |
| Lint                    | ESLint **9** flat config: `eslint-config-next/core-web-vitals` + `@stylistic/eslint-plugin`, airbnb base |
| Hosting                 | Vercel (auto-deploy from `main`)                                                           |

There is **no** `next.config` customization (the file exists but is empty), **no** `tailwind.config.*` (Tailwind 4 CSS-first via `@theme inline`), **no** Prettier, and **no** test framework configured in the repo.

---

## 3. Project Structure

```
andresilva.cc/
├── docs/
│   ├── status.md              # project snapshot + conventions
│   ├── workflow.md            # agent pipeline workflow
│   ├── design-system.md       # token reference (created on demand)
│   └── architecture.md        # this file
├── redesign/
│   ├── design-system.html     # canonical visual spec (token block + every component)
│   ├── notes.md               # decision log
│   ├── home.html              # page mock
│   ├── about.html             # page mock
│   ├── career.html            # page mock
│   ├── projects.html          # page mock
│   └── articles.html          # page mock
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
│   │   ├── layout.tsx         # root layout, mounts GA, applies fonts
│   │   ├── page.tsx           # / (home)
│   │   ├── not-found.tsx      # 404
│   │   ├── fonts.ts           # next/font loaders
│   │   ├── favicon.ico
│   │   ├── about/page.tsx
│   │   ├── articles/page.tsx  # async — fetches from Forem
│   │   ├── career/page.tsx
│   │   └── projects/page.tsx
│   ├── components/            # presentational + client components (the redesign vocabulary)
│   ├── hooks/
│   │   └── use-repositories.ts  # factory returning all repositories
│   ├── repositories/
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
├── next.config.mjs            # empty config
├── postcss.config.js          # @tailwindcss/postcss
├── tsconfig.json
├── package.json
└── README.md
```

Path alias: `@/*` resolves to `src/*`.

### Role of each top-level `src/` directory

- **`src/app/`** — App Router routes. Each subdirectory is a route; each `page.tsx` is a Server Component unless explicitly marked `'use client'`. `layout.tsx` is the single root layout.
- **`src/components/`** — Every UI component, from primitives (button, link, tag) to page sections (project-card, role-card, article-entry). Names mirror the vocabulary in `redesign/design-system.html`.
- **`src/repositories/`** — Data-access seam. Interfaces at the top level; concrete implementations under `implementations/`. See §6.
- **`src/hooks/`** — Currently holds the repository factory only. The `use-*` prefix is a naming convention, not a React hook in the strict sense — `articles/page.tsx` calls it from an async Server Component.
- **`src/styles/`** — Single `globals.css` with the Tailwind import and the `@theme inline` token block. There are no other CSS files in `src/` after the redesign — the multi-theme `themes/*.css` system has been removed.
- **`src/types/`** — Shared TypeScript types for entities returned by repositories.
- **`src/api/`** — Low-level HTTP clients. Only `forem.ts` lives here today.

---

## 4. Routing & Rendering

App Router, flat set of top-level routes. No dynamic segments, no route groups, no parallel/intercepting routes, no middleware.

| Path        | File                            | Rendering                         |
| ----------- | ------------------------------- | --------------------------------- |
| `/`         | `src/app/page.tsx`              | Server (static)                   |
| `/about`    | `src/app/about/page.tsx`        | Server (static)                   |
| `/articles` | `src/app/articles/page.tsx`     | Server, `async` — fetches Forem   |
| `/career`   | `src/app/career/page.tsx`       | Server (static)                   |
| `/projects` | `src/app/projects/page.tsx`     | Server (static)                   |
| `*` (404)   | `src/app/not-found.tsx`         | Server (static)                   |

### Server-first, client where needed

Pages and structural components stay server-rendered. The only files that carry `'use client'` are the ones that genuinely need DOM access or interactivity:

- The **mobile menu** (disclosure state, route-aware active highlighting).
- **Hover-gated affordances** that need to read pointer state or run on the client (e.g., a component that conditionally renders interaction cues only on devices with a fine pointer).

Everything else — header, footer, page heads, section heads, project cards, role cards, article entries, tags, status dots, link arrows — is a Server Component.

### Metadata

Each route page declares its own `metadata.title` (e.g. `"About | André Silva"`) via the Next.js Metadata API. The root layout sets the base `title` / `description` and any default OG/Twitter tags. There are **no API routes** (`app/api/*`) — the site has no backend endpoints of its own.

---

## 5. Styling System

### Tailwind 4, CSS-first

There is no `tailwind.config.js`. The entire token contract lives in `src/styles/globals.css` inside a single Tailwind 4 `@theme inline` block, which maps Tailwind class names onto CSS custom properties.

The token block mirrors the canonical `:root` from `redesign/design-system.html` and covers:

- **Semantic colors** — `base` (background), `surface-2` (raised surface), `fg` family (`hi`, `mid`, `lo` for high/mid/low-emphasis text), `accent` family (`accent`, `accent-hi`, `accent-mute`, `accent-tint`), `rule` family (`rule`, `rule-2` for dividers).
- **Type scale** — display, h1, h2, h3, body, meta, micro.
- **Spacing scale** — `s1` (4px) through `s20` (80px), plus a few component-specific tokens (`tag-pad-y`, `badge-clearance`, `gutter-date`).
- **Prose widths** — `prose-w-narrow` (56ch), `prose-w` (68ch), `prose-w-card` (38ch).
- **Photo filters** — `photo-filter` (primary) + `photo-filter-soft` (touch-device fallback for the about portrait).
- **Motion** — `ease-out`, `ease-in`, `d-fast` (120ms), `d-mod` (200ms).
- **Font families** — `ff-mono` (JetBrains Mono) and `ff-display` (VT323), wired into Tailwind's font family classes via the CSS variables exposed by `next/font`.

### Single palette, no theming

The multi-theme system (`src/styles/themes/*.css`, the `ThemeSelector` component, the `theme` cookie handling in `layout.tsx`, the `body.animate` easter-egg keyframe) **has been removed**. There is exactly one palette, and it lives in `globals.css`. `<html>` no longer carries a `data-theme` attribute.

### Class-only styling

The styling rule is unambiguous:

- **No CSS classes are defined outside `globals.css`.** Component styles compose Tailwind utility classes; ad-hoc CSS goes into `globals.css` only when a utility composition genuinely can't express it.
- **No arbitrary values anywhere in the codebase.** No `bg-[#0B0F0A]`, no `text-[14px]`, no `mt-[7px]`. Every size, color, and spacing reference resolves to a token in the `@theme` block. If a value isn't expressible with the existing tokens, the answer is to add a token, not to inline a literal.
- **Token names match `redesign/design-system.html`.** When in doubt about which token to use for a given visual treatment, the design-system HTML is the source of truth.

Tokens are documented (with names, intended use, and contrast notes) in `docs/design-system.md`.

---

## 6. Component Vocabulary

After the redesign, the component layer is a direct translation of the vocabulary in `redesign/design-system.html` — roughly sixteen components, each a single visual concept:

- **Layout chrome**: `header`, `footer`, `wordmark`, `nav` (with the mobile-menu variant), `skip-link`.
- **Page structure**: `page-head`, `section-head`, `eyebrow`, `grid-frame`.
- **Inline primitives**: `tag` / `badge`, `status-dot`, `link-arrow`, `button-cta`.
- **Cards & rows**: `row` (home Latest), `project-card`, `role-card`, `article-entry`.
- **Media**: `photo-wrap` (about portrait with the filter token), `hero-plasma` (home hero right column).

The component file listing in `src/components/` is the authoritative inventory; `redesign/design-system.html` is the visual contract each file implements.

### Composition conventions

- **Primitives accept an `asChild` prop** (via `@radix-ui/react-slot`) so wrappers like `Link` or `Button` can inherit a primitive's styling without nesting elements.
- **External links** are auto-detected in link primitives (`href.startsWith('http')` → `target="_blank"` + `rel="noopener noreferrer"`).
- **Card lists use `<li class="card-class">` directly** (no inner `<article>`). The `<li>` is the card. This matches the v4.1 standing rule in `redesign/notes.md` and applies to projects, career roles, and articles.

---

## 7. Data Layer

```mermaid
flowchart LR
    Page["App Router Page<br/>(Server Component)"] -->|useRepositories()| Factory["use-repositories.ts"]
    Factory --> Static["Static*Repository<br/>(hard-coded data)"]
    Factory --> Forem["ForemArticlesRepository"]
    Forem -->|axios| DevTo[("dev.to<br/>Forem API")]
    Static --> Page
    Forem --> Page
    Page --> HTML[(Rendered HTML)]
```

### Repository pattern

`src/hooks/use-repositories.ts` is a plain factory function (the `use*` prefix is a naming convention, not a React hook). Each page asks the factory for the repositories it needs and calls `.getAll()` (or similar) on them.

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

- **JetBrains Mono** — body and UI text. Weights 400, 500, 600, 700. Exposed as `--ff-mono` (matching the canonical token name).
- **VT323** — pixel-display headings. Single weight. Exposed as `--ff-display`.

Both CSS variables are forwarded to the Tailwind `@theme` block so any `font-mono` / `font-display` utility class resolves to the loaded face. The previous Fira Sans / Fira Code pair has been removed.

---

## 9. Accessibility

- **WCAG AA contrast at body size.** The token palette is sized so every text-on-background combination clears AA. The contrast matrix is documented in `redesign/design-system.html` (§2.2) and reflects the v4.1 `--lo` bump (`#7E8E76`, 5.49:1 on `--base`, 5.30:1 on `--surface-2`).
- **Skip link.** Every page renders a visually-hidden "Skip to content" link that becomes visible on focus and jumps to `<main>`.
- **Focus-visible rings.** Two-pixel `--accent` outline with a two-pixel offset on every interactive element (`a`, `button`, `[tabindex]`). The default browser ring is disabled; the design-system ring replaces it.
- **`prefers-reduced-motion`.** Decorative motion (row press scale, hero cursor blink, any hover transitions on cards) is gated by `prefers-reduced-motion: no-preference` and falls back to static states otherwise.
- **Semantic structure.** Card lists are `<ul>`/`<li>`, card titles are `<p>` (not `<h3>`), and single-band pages label their lone `<section>` with `aria-label` rather than `aria-labelledby` (per the v4 standing rule in `redesign/notes.md`).
- **Prose punctuation.** User-facing copy uses U+2019 (curly apostrophe) and U+201C / U+201D (curly double quotes). Straight quotes are reserved for HTML attributes, CSS strings, and code.

---

## 10. Third-Party Integrations

| Service              | How it's used                                                        | Configuration                                  |
| -------------------- | -------------------------------------------------------------------- | ---------------------------------------------- |
| **Forem / dev.to**   | Fetches the author's articles for `/articles`                        | `FOREM_API_URL`, `FOREM_API_KEY` (env)         |
| **Google Analytics** | Page-view tracking via `@next/third-parties/google` in root layout   | Hardcoded gaId `G-TLHZYGS1SJ`                  |
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
- **Build**: `next build` (standard). No custom `next.config.mjs` options — default output, default image optimization, default runtime.
- **Environment variables**: `FOREM_API_URL` and `FOREM_API_KEY` must be set in Vercel for `/articles` to work. GA ID is hardcoded.
- **Domain / DNS**: `andresilva.cc`, managed via Vercel.
- **CI**: deployment status is visible via the deployments badge in `README.md`; there is no `.github/workflows/` directory — CI is whatever Vercel runs on push/PR.

---

## 13. Notable Conventions

- **Server by default, client only where needed.** Pages and structural components stay server-rendered; only genuinely interactive islands carry `'use client'`.
- **Tokens-only styling.** Every visual value resolves to a token in `globals.css`. No arbitrary values, no inline literals.
- **Design-system HTML is the visual contract.** When implementing a component, the markup and CSS in `redesign/design-system.html` are authoritative; the React translation should match the visual behavior 1:1.
- **Repository pattern is the data seam.** Pages depend on interfaces, never on concrete implementations.
- **Card lists are `<ul>`/`<li>`.** Card titles are non-heading elements; sections are labeled with `aria-label` on single-band pages.
- **Curly punctuation in prose.** U+2019 for apostrophes, U+201C/U+201D for double quotes.
- **External links auto-detected** in link primitives (`href.startsWith('http')` → `target="_blank"`).
- **Active menu highlighting** uses `usePathname()` plus an optional `activeRegex` on the menu item (e.g., Articles matches `^/article` so future article sub-routes stay highlighted).
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
