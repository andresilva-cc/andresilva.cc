# Architecture

A snapshot of how andresilva.cc is built today. The site is a mature, one-developer marketing/portfolio site deployed to Vercel. It is mostly static with a single async data source (dev.to via the Forem API) and a small client-side surface for theming and menus.

This document describes **what is**, not what should be. Treat the code as the source of truth; update this doc when a task materially changes the architecture.

---

## 1. Overview

- **Domain**: https://andresilva.cc
- **Purpose**: Personal site — home, about, career, projects, and articles (mirrored from dev.to).
- **Shape**: Next.js App Router app, mostly Server Components, with a few `'use client'` islands for interactive chrome (menus, theme selector, project modal, easter-egg logo).
- **Data**: Content is either hard-coded in "static" repositories or fetched from the Forem (dev.to) API at request time. There is no database, no auth, no backend of our own, and no user-generated content.
- **Deployment**: Vercel, auto-deploy from `main`.

---

## 2. Tech Stack

| Area                    | Choice                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------ |
| Framework               | Next.js **16.1.1** (App Router)                                                            |
| UI library              | React **19.2.3** + React DOM 19.2.3                                                        |
| Language                | TypeScript **5.9.3** (`strict: true`, `moduleResolution: bundler`, `@/*` → `src/*`)        |
| Styling                 | Tailwind CSS **4.1.18** via `@tailwindcss/postcss` (CSS-first config, no `tailwind.config`)|
| Headless UI primitives  | `@headlessui/react` (Menu, Dialog, Transition), `@radix-ui/react-slot` (for `asChild`)     |
| Icons                   | `@phosphor-icons/react` (SSR-safe imports from `/dist/ssr/index`)                          |
| HTTP client             | `axios` (used only to call Forem)                                                          |
| Class utilities         | `clsx`                                                                                     |
| Analytics               | Google Analytics via `@next/third-parties/google` (gaId `G-TLHZYGS1SJ`)                    |
| Fonts                   | Fira Sans + Fira Code, loaded via `next/font/google`                                       |
| Package manager         | pnpm **10.27.0**                                                                           |
| Lint                    | ESLint 9 flat config: `eslint-config-next/core-web-vitals` + `@stylistic/eslint-plugin`    |
| Hosting                 | Vercel (auto-deploy from `main`)                                                           |

There is **no** `next.config` customization (the file exists but is empty), **no** `tailwind.config.*` (Tailwind 4 CSS-first via `@theme inline`), **no** Prettier, and **no** test framework configured in the repo.

---

## 3. Project Structure

```
andresilva.cc/
├── docs/
│   ├── status.md              # project snapshot + conventions
│   ├── workflow.md            # agent pipeline workflow
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
│   │   ├── layout.tsx         # root layout, reads `theme` cookie, mounts GA
│   │   ├── page.tsx           # / (home)
│   │   ├── not-found.tsx      # 404
│   │   ├── fonts.ts           # next/font loaders
│   │   ├── favicon.ico
│   │   ├── about/page.tsx
│   │   ├── articles/page.tsx  # async — fetches from Forem
│   │   ├── career/page.tsx
│   │   └── projects/page.tsx
│   ├── components/            # presentational + client components
│   │   ├── header.tsx, footer.tsx
│   │   ├── desktop-menu.tsx, mobile-menu.tsx   ('use client')
│   │   ├── theme-selector.tsx                  ('use client')
│   │   ├── home-button.tsx                     ('use client' — easter egg)
│   │   ├── button.tsx, link-button.tsx, link.tsx
│   │   ├── text.tsx           # typographic primitive with variants
│   │   ├── chip.tsx, modal.tsx
│   │   ├── article.tsx, project.tsx, job.tsx
│   │   └── rich-text.tsx
│   ├── hooks/
│   │   └── use-repositories.ts  # factory returning all repositories
│   ├── repositories/
│   │   ├── *.ts                 # interfaces (ArticlesRepository, ...)
│   │   └── implementations/
│   │       ├── forem-articles-repository.ts    # hits dev.to
│   │       ├── static-footer-repository.ts
│   │       ├── static-jobs-repository.tsx
│   │       ├── static-menu-repository.ts
│   │       ├── static-projects-repository.ts
│   │       └── static-theme-repository.ts
│   ├── styles/
│   │   ├── globals.css        # Tailwind import + @theme inline tokens
│   │   └── themes/
│   │       ├── default.css, dracula.css, monokai.css, terminal.css
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

---

## 4. Routing

App Router, flat set of top-level routes. No dynamic segments, no route groups, no parallel/intercepting routes, no middleware.

| Path        | File                            | Rendering                         |
| ----------- | ------------------------------- | --------------------------------- |
| `/`         | `src/app/page.tsx`              | Server (static)                   |
| `/about`    | `src/app/about/page.tsx`        | Server (static)                   |
| `/articles` | `src/app/articles/page.tsx`     | Server, `async` — fetches Forem   |
| `/career`   | `src/app/career/page.tsx`       | Server (static)                   |
| `/projects` | `src/app/projects/page.tsx`     | Server (static)                   |
| `*` (404)   | `src/app/not-found.tsx`         | Server (static)                   |

Each route page sets its own `metadata.title` (e.g. `"About | André Silva"`). The root layout sets the base `title` / `description`.

There are **no API routes** (`app/api/*`) — the site has no backend endpoints of its own.

---

## 5. Data Flow

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

`src/hooks/use-repositories.ts` is a plain factory function (the `use*` prefix is misleading — it's not a React hook; `articles/page.tsx` disables `react-hooks/rules-of-hooks` where it's called from an async Server Component). Each page asks the factory for the repositories it needs and calls `.getAll()` on them.

There are two kinds of implementations:

1. **Static repositories** — data is hard-coded in the class. The content for the career page, projects page, footer social links, site menu, and theme list all live here. Changes ship as code commits.
   - `StaticJobsRepository` is written as `.tsx` because the `description` field is JSX (nested `<ul>`/`<li>`/`<p>`).
2. **Forem repository** — `ForemArticlesRepository` calls `GET /articles?username=andresilva-cc` on the Forem API via an axios client configured in `src/api/forem.ts`. The client reads `FOREM_API_URL` and `FOREM_API_KEY` from environment variables.

The repository interfaces (`articles-repository.ts`, `projects-repository.ts`, etc.) decouple pages from the concrete data source, but in practice the factory is the only switchboard — there is no DI container.

### Data fetching

- `/articles` is an `async` Server Component; it `await`s `articlesRepository.getAll()` on each request. There is no explicit `fetch` caching config and no `revalidate` setting — Next's defaults apply.
- All other pages are fully static.

---

## 6. Styling & Theming

### Tailwind 4, CSS-first

There is no `tailwind.config.js`. Tokens are declared inside `src/styles/globals.css` using Tailwind 4's `@theme inline` block, which maps Tailwind class names (`bg-primary-500`, `text-auxiliary-500`, `font-mono`, `grid-cols-job`, etc.) onto CSS custom properties.

### Theme switching via `data-theme`

Four themes ship: `default`, `dracula`, `monokai`, `terminal`. Each lives in `src/styles/themes/<name>.css` and overrides the same custom properties under a `:root[data-theme='<name>']` selector.

Flow:

1. User selects a theme in `ThemeSelector` (client component).
2. It writes `document.documentElement.dataset.theme = currentTheme` **and** sets a `theme` cookie (`max-age=31536000`, path `/`).
3. On the next navigation, `src/app/layout.tsx` reads the `theme` cookie server-side via `next/headers` `cookies()` and renders `<html data-theme={theme}>`. This avoids a flash of the default theme on first paint.

The `terminal` theme additionally adds a scanline overlay and text-shadow via CSS selectors scoped to `[data-theme='terminal']`.

### Typography

`src/app/fonts.ts` loads Fira Sans (400, 500) and Fira Code (400, 600, 700) from Google via `next/font`, exposed as `--font-fira-sans` / `--font-fira-code` and wired into Tailwind's `--font-sans` / `--font-mono`.

### The `Text` primitive

`src/components/text.tsx` centralizes typography. It takes a `variant` (`h1`, `h2-sans`, `h2-mono`, `h3`, `button`, `body-1..3`, `caption`), an optional semantic `element` override, and an `asChild` prop (via `@radix-ui/react-slot`) for composition. Other components (`Button`, `Chip`, `Link`) wrap `Text` with `asChild` to inherit typographic styles. **New text styling should go through `Text` rather than ad-hoc `font-*`/`text-*` classes.**

### Color token convention

Themes define three scales — `primary`, `secondary`, `auxiliary` — each with `300`/`400`/`500` variants used for hover/active/default respectively. `gray-200`, `gray-900`, and `gray-950` cover text and background. Components consistently follow the `default → hover → active` pattern using these scales.

---

## 7. Components

Composition is layered:

- **Primitives**: `Text`, `Button`, `LinkButton`, `Link`, `Chip`.
  - `Button` uses `Text variant="button"` internally and has `default`/`text`/`icon` variants.
  - `LinkButton` composes `Button` + Next.js `Link`, auto-detecting external URLs (anything starting with `http`) and adding `target="_blank"`.
- **Structural**: `Header`, `Footer`, `DesktopMenu`, `MobileMenu`, `ThemeSelector`, `HomeButton`, `Modal`.
- **Content**: `Article`, `Project`, `Job` — each renders a single item from its corresponding repository.

### Client-component boundary

The following files are `'use client'`; everything else is a Server Component by default.

- `theme-selector.tsx` — local state + cookie write
- `desktop-menu.tsx`, `mobile-menu.tsx` — use `usePathname()` for active-route highlighting
- `home-button.tsx` — 5-click easter egg (adds `animate` class to `<body>`, spins the logo)
- `project.tsx` — manages modal open state for multi-link projects

### Modal pattern

`Modal` is a thin wrapper around Headless UI `Dialog` + `Transition`. Used by `Project` when a project has multiple links (the card becomes a button that opens a modal listing them). Projects with a single link render as a plain `<a>`; projects with no links render as a non-interactive card.

---

## 8. Third-Party Integrations

| Service              | How it's used                                                        | Configuration                                  |
| -------------------- | -------------------------------------------------------------------- | ---------------------------------------------- |
| **Forem / dev.to**   | Fetches the author's articles for `/articles`                        | `FOREM_API_URL`, `FOREM_API_KEY` (env)         |
| **Google Analytics** | Page-view tracking via `@next/third-parties/google` in root layout   | Hardcoded gaId `G-TLHZYGS1SJ`                  |
| **Google Fonts**     | Fira Sans + Fira Code, self-hosted by Next through `next/font`       | `src/app/fonts.ts`                             |

No other external services (no CMS, no database, no auth provider, no email, no payments).

---

## 9. Build, Lint & Dev Tooling

### Scripts (`package.json`)

| Script        | Command      |
| ------------- | ------------ |
| `pnpm dev`    | `next dev`   |
| `pnpm build` | `next build` |
| `pnpm start`  | `next start` |
| `pnpm lint`   | `eslint .`   |

### ESLint

Flat config (`eslint.config.mjs`):

- Extends `eslint-config-next/core-web-vitals`
- Adds `@stylistic/eslint-plugin` with `arrowParens: true`, `semi: true`
- Re-applies the default ignores (`.next/**`, `out/**`, `build/**`, `next-env.d.ts`) because `globalIgnores()` resets them

The presence of `eslint-config-airbnb`, `eslint-config-airbnb-typescript`, and various plugins in `devDependencies` hints at an earlier Airbnb-based config; the live flat config is the Next + Stylistic combination shown above.

### TypeScript

`tsconfig.json`:
- `strict: true`
- `moduleResolution: bundler`, `module: esnext`
- `jsx: react-jsx`
- `paths: { "@/*": ["./src/*"] }`
- `target: es5` (Next's compiler downlevels; this target is essentially inert for modern Next builds)

### Pre-commit hooks

There are no pre-commit hooks configured: no `lint-staged`, no Prettier, no `.husky/` directory. Lint enforcement happens via Vercel's CI on push.

---

## 10. Deployment

- **Platform**: Vercel, connected to the GitHub repo `andresilva-cc/andresilva.cc`. Auto-deploy from `main`; preview deploys per PR.
- **Build**: `next build` (standard). No custom `next.config.mjs` options — default output, default image optimization, default runtime.
- **Environment variables**: `FOREM_API_URL` and `FOREM_API_KEY` must be set in Vercel for `/articles` to work. GA ID is hardcoded.
- **Domain / DNS**: `andresilva.cc`, managed via Vercel.
- **CI**: deployment status is visible via the deployments badge in `README.md`; there is no `.github/workflows/` directory — CI is whatever Vercel runs on push/PR.

---

## 11. Notable Conventions

- **Server by default, client only where needed.** Pages and structural components stay server-rendered; the interactive islands (menus, theme selector, modal, easter egg) are explicitly marked `'use client'`.
- **One typography entry point.** Use `Text` with a variant instead of ad-hoc font/size classes.
- **Static content lives in static repositories.** Career entries, projects, menu items, social links, and theme list are hard-coded TypeScript — new content is a code change.
- **External links are auto-detected** in `LinkButton` (`href.startsWith('http')` → `target="_blank"`).
- **Active menu highlighting** uses `usePathname()` plus an optional `activeRegex` on the menu item (e.g., Articles matches `^/article` so future article sub-routes stay highlighted).
- **Commits** follow Conventional Commits (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`).
- **Branch strategy**: feature branch per task → PR → merge to `main` → Vercel auto-deploys.

---

## 12. What's Deliberately Absent

Noting these so nobody goes hunting:

- No authentication, no user accounts, no sessions.
- No database, no ORM, no migrations.
- No API routes (`app/api/*`), no Route Handlers, no server actions.
- No middleware.
- No test suite or test runner.
- No i18n (site is English-only).
- No CMS — content is either code-hard-coded or pulled from dev.to.
- No image pipeline beyond Next's default `<Image>` optimizer; the only runtime image is `/me.jpg`.
- No error-tracking/observability service — Vercel logs only.
