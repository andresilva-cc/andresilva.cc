---
name: Project structure and conventions
description: Key architectural patterns and conventions for the andresilva.cc rebuild
type: project
---

## Tech stack
- Next.js 16 + React 19 + Tailwind v4
- TypeScript — all components typed
- No CSS modules — Tailwind utilities only, plus globals.css for exceptions

## Tailwind rules
- No arbitrary values (`bg-[#hex]`, `p-[15px]` etc.) — use tokens or nearest built-in
- Exceptions allowed: inline styles on one-off rendering elements (e.g. stipple art sizing via `var(--hero-art-w)`)
- Color utilities: `bg-canvas`, `text-fg`, `text-fg-muted`, `text-fg-subtle`, `text-accent`, `text-accent-strong`, `border-rule`, `border-accent-muted`, `bg-surface`, `bg-accent-tint`
- Type utilities: `text-display`, `text-h1`, `text-h2`, `text-h3`, `text-body`, `text-meta`, `text-micro`
- Font utilities: `font-mono`, `font-display`
- Layout: `max-w-shell` (1240px), `max-w-prose-narrow` (56ch), `max-w-prose-bio` (60ch), `max-w-prose-wide` (68ch), `max-w-prose-card` (38ch), `grid-cols-role` (183px 1fr), `grid-cols-article` (200px 1fr), `grid-cols-article-card` (240px 1fr)
- Motion: `duration-fast` (120ms), `scale-press` (97%)

## Design canon
- Visual truth: the shipped code is the source of truth. `docs/design-system.md` + the `/design-system` route are the canonical reference for tokens, spacing, and component conventions.
- Section bands: `py-8` (32px), with `border-b border-rule` on each section except the last
- Header: `py-4 border-b border-rule`
- PageHead: `pt-12 pb-5 border-b border-rule`
- Footer: `py-8` with `border-t border-rule` (no `mt-` — callers pass margin via `className`)
- GridFrame: applies border-t + border-l on container, border-r + border-b on children. Children must add their own padding (not GridFrame's job). Education cells: `py-5 px-6`. Facts cells: `py-4 px-5`. Project cards: `p-4`.

## Section head pattern (SectionHead component)
- Default: `flex flex-col gap-2 pb-4 mb-5 border-b border-rule`
- Flush (when next element has its own top border): removes `mb-5 border-b`
- Career, Projects, Articles pages have NO section head — just page head + section with aria-label directly containing the list

## Career / Role card
- Date gutter: `p-3 px-4` mobile, `p-5` desktop + right border at desktop
- Mobile: date gutter has bottom border, row direction
- Bullets: `+ ` prefix in accent color, styled via Tailwind arbitrary selector `[&_li]:before:content-['+']`

## Article illustrations
- Config lookup in `src/app/(site)/articles/page.tsx` by dev.to URL slug (`articleArt` record), passed to `ArticleIllustration` (`src/components/article-illustration.tsx`)
- `ArticleIllustration` wraps a `StippleArt` embed as a linked thumbnail
- Known slugs: `how-i-achieved-a-74-performance-increase-on-a-page-2gjm`, `rendering-modes-explained-2711`
- Illustration container (in `ArticleCard`): `border border-rule bg-canvas overflow-hidden`, responsive aspect ratio

## Hero art
- `HeroArt` (`src/components/hero-art.tsx`) renders two `StippleArt` instances — one desktop (hidden lg:block), one mobile (lg:hidden)
- `StippleArt` (`src/components/stipple-art.tsx`) is a React wrapper for the `<stipple-art>` Web Component loaded from `art.andresilva.cc`
- Art dimensions are raw `:root` CSS vars (not Tailwind tokens): `--hero-art-w` (296px), `--hero-art-h` (200px), `--hero-art-h-mobile` (180px)
- Arbitrary `style` props are the correct way to consume these vars on the embed element

## ESLint gotchas
- SVG `<text>` content containing `//` gets flagged by `react/jsx-no-comment-textnodes` — use `&#x2F;&#x2F;` HTML entities or assign to a variable first
- `@stylistic/jsx-curly-brace-presence` rejects unnecessary `{' '}` or `{'string'}` — use raw text in JSX text positions
- `@stylistic/quote-props` is set to `"consistent-as-needed"` — if ANY key in an object literal requires quotes (e.g., `@context`), ALL keys must be quoted. JSON-LD objects: quote all keys.
- `@stylistic/multiline-ternary` fires when a ternary spans multiple lines without each operand on its own line. Avoid in JSX props — extract to a function or variable with `if` statements instead.
- `@stylistic/jsx-one-expression-per-line` fires on inline JSX fragment children on the same line. Put each child on its own line.
- TypeScript interface properties with hyphens (`'data-language'`) are flagged by `quote-props` when used in object destructuring — access via `(props as any)['data-language']` and cast instead.

## MDX rendering pattern (Velite + @mdx-js/mdx)
- `s.mdx()` returns a compiled function-body string — NOT a React component
- To render: `const runtime = require('react/jsx-runtime') as RunOptions; const mdxModule = await run(body, { ...runtime, baseUrl: import.meta.url }) as any; const Content = mdxModule.default as ComponentType<...>`
- The MDX components map is passed as `<Content components={...} />` — keys are HTML element names (`img`, `pre`, `a`) or custom component names (`YouTube`)
- rehype-pretty-code adds `data-language` to `<pre>` and `data-highlighted-line` to highlighted line spans
- Shiki theme: pass JSON object directly to `rehype-pretty-code`'s `theme` option (not a string theme name)

## Article illustrations (post-T3)
- `coverArt` config now comes from `article.coverArt.params` frontmatter — no keyed lookup map in page.tsx
- `ArticleIllustration` now uses `next/link` (internal links only) — removed external URL support
- Illustration container (in `ArticleCard`): unchanged, still `border border-rule bg-canvas overflow-hidden`
