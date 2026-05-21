---
name: Design system conventions
description: Key token names, font weights, and styling rules for the andresilva.cc redesign
type: project
---

## Token system (Tailwind v4 @theme inline)

All tokens in `src/styles/globals.css`. Canon: `docs/design-system.md` (authoritative prose) + the live `/design-system` route (rendered components). The `redesign/` HTML mocks were decommissioned.

- Colors: `--color-canvas`, `--color-surface`, `--color-fg`, `--color-fg-muted`, `--color-fg-subtle`, `--color-accent`, `--color-accent-strong`, `--color-accent-muted`, `--color-accent-tint`, `--color-rule`, `--color-rule-strong`
- Fonts: `--font-mono` (JetBrains Mono), `--font-display` (VT323)
- Type scale: `--text-micro` through `--text-display` with paired `--line-height` vars
- Motion: `--ease-out`, `--ease-in`, `--duration-fast` (120ms); 200ms uses Tailwind built-in `duration-200`
- Prose widths: `--max-width-prose-narrow` (56ch), `--max-width-prose-bio` (60ch, about page), `--max-width-prose-wide` (68ch), `--max-width-prose-card` (38ch), `--max-width-prose-figure` (80ch, figures/YouTube)
- Tracking: `--tracking-eyebrow` (0.16em), `--tracking-badge` (0.12em), `--tracking-button` (0.04em)

Raw `:root` vars (NOT Tailwind utilities): `--photo-filter`, `--photo-filter-soft` (filter chains; no Tailwind namespace).

Key `@theme inline` tokens: `--scale-press: 97%` (drives `scale-press`), `--grid-template-columns-role: 183px 1fr` (drives `grid-cols-role`), `--grid-template-columns-article: 200px 1fr` (drives `grid-cols-article`), `--grid-template-columns-article-card: 240px 1fr` (drives `grid-cols-article-card`), `--max-width-shell: 1240px`, `--breakpoint-xs: 30rem`, `--tracking-display: -0.01em`, `--shadow-status-dot`.

Raw `:root` vars for home hero art (NOT in `@theme`; consumed via `var()` in `hero-art.tsx`): `--hero-art-w: 296px`, `--hero-art-h: 200px`, `--hero-art-h-mobile: 180px`. The old `--max-width-hero-plasma` token was removed when the plasma component was replaced by the stipple art — do not use it.

## Font weights

Three weights only: 400 (prose), 500 (meta), 600 (headings/CTAs). No 700. The `architecture.md §8` mentions 700 but `design-system.md` is the authority — 700 is not used. `fonts.ts` correctly loads only `['400', '500', '600']`.

## Styling rules

- No arbitrary values anywhere (`bg-[#...]`, `text-[14px]`, etc.)
- No CSS classes defined outside `globals.css`
- Token names in code must match `docs/design-system.md` Tailwind mapping table
- Card lists are `<ul>/<li>`; card titles are `<p>` (not `<h3>`)
- Single-band pages use `aria-label` on `<section>`, not `aria-labelledby`
- External links: `href.startsWith('http')` → `target="_blank" rel="noopener noreferrer"`

## Motion rules (recurring violations to watch)

- Animate only `transform` and `opacity` — `transition-colors` (border-color, color) is a paint trigger and violates the motion contract
- Hover states must be gated by BOTH `prefers-reduced-motion` AND `@media (hover: hover)` — `motion-safe:hover:` alone is insufficient; it doesn't prevent sticky-hover on touch devices
- Tailwind has no built-in `hover-hover:` variant; a custom variant or `[@media(hover:hover)]:hover:` syntax is needed

## Accessibility (recurring patterns)

- `aria-label` on a plain `<span>` is silently ignored — needs `role="img"` to be exposed, or use `aria-hidden="true"` if decorative with surrounding text context
- StatusDot pattern: if ariaLabel is provided, the element must have `role="img"`; if purely decorative, use `aria-hidden="true"`
