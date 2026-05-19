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
- Exceptions allowed: inline styles on one-off rendering elements (HeroPlasma pre element)
- Color utilities: `bg-canvas`, `text-fg`, `text-fg-muted`, `text-fg-subtle`, `text-accent`, `text-accent-strong`, `border-rule`, `border-accent-muted`, `bg-surface`, `bg-accent-tint`
- Type utilities: `text-display`, `text-h1`, `text-h2`, `text-h3`, `text-body`, `text-meta`, `text-micro`
- Font utilities: `font-mono`, `font-display`
- Layout: `max-w-shell` (1240px), `max-w-prose-narrow`, `max-w-prose-wide`, `max-w-prose-card`, `max-w-hero-plasma` (400px), `grid-cols-role` (183px 1fr), `grid-cols-article` (200px 1fr), `grid-cols-article-card` (240px 1fr)
- Motion: `duration-fast` (120ms), `scale-press` (97%)

## Design canon
- Visual truth: `redesign/*.html` files — any difference between React and mock means React is wrong
- Section bands: `py-8` (32px), with `border-b border-rule` on each section except the last
- Header: `py-4 border-b border-rule`
- PageHead: `pt-12 pb-5 border-b border-rule`
- Footer: `mt-12 pt-5 pb-8` with `border-t border-rule`
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
- Static lookup in `src/app/articles/page.tsx` by dev.to URL slug
- Known slugs: `how-i-achieved-a-74-performance-increase-on-a-page-2gjm`, `rendering-modes-explained-2711`
- Illustration container: `border border-rule bg-surface`, `minHeight: 144px`

## ESLint gotchas
- SVG `<text>` content containing `//` gets flagged by `react/jsx-no-comment-textnodes` — use `&#x2F;&#x2F;` HTML entities
- `@stylistic/jsx-curly-brace-presence` rejects unnecessary `{' '}` or `{'string'}` — use raw text in JSX text positions
