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

## `/resume` print theme (as of the resume-route rebuild, task 18)

`/resume` is a scoped exception to the site's dark palette (targets white paper), documented in `docs/resume-print-theme.md`. As of the rebuild:

- The old 262-line `.resume`-scoped CSS block in `globals.css` (BEM-ish `resume__*` classes) is gone. `/resume` now uses Tailwind utilities directly in JSX (`page.tsx`, `_components/section-heading.tsx`, `_components/resume-qr.tsx`), matching the rest of the app's convention (utilities-in-component, not scoped classes) better than the old approach did.
- Only two rules remain in `globals.css`'s resume section: `body:has(> main.resume) { background-color: #FFFFFF }` (can't be done from inside the route's own component) and the `@page` explanation comment (the actual rule lives in `src/app/resume/print.css`, imported only by `resume/page.tsx`).
- The 6-token print **palette** (`--color-resume-paper/ink/ink-body/ink-subtle/rule/accent`) was correctly promoted into the `@theme` block. The print **type scale** documented in `resume-print-theme.md` §3/§6.9 (`p-display`/`p-h1`/`p-h2`/`p-h3`/`p-body`/`p-meta`/`p-micro`, each with size/weight/leading/tracking) was NOT promoted — it's re-typed as arbitrary-bracket Tailwind utilities (`text-[9.5pt] ... leading-[1.30]` etc.) duplicated across page.tsx and section-heading.tsx. Flagged as a Warning (inconsistent tokenization, demonstrated drift risk given 3 rounds of exact-value revisions in the spec doc). Watch whether a follow-up promotes these to `@theme` — if so, this note is stale.
- `@page` containment (route-local `print.css`, never leaks A4 formatting site-wide) has been empirically verified against the actual `.next` production build output twice now (pre-rebuild and post-rebuild) — grep the CSS chunk hash across `.next/server/app/*.html` to re-verify if this route changes again.
- `formatMonthYear`/`formatDateRange` (`src/lib/format-date.ts`) gained an optional `openLabel` param so `/resume` can render "Present" instead of "now". As shipped in task 18, this was buggy: the call site passed lowercase `'present'` and month abbreviations are unconditionally lowercase (no case param exists), contradicting both the function's own doc comment and `resume-print-theme.md` §6.8's explicit "Title-case months and 'Present'" spec. Verify this is fixed in future reviews of this route — check the rendered `.next/server/app/resume.html` output directly rather than trusting the source.

## Employment/career data (as of task 18)

`src/repositories/implementations/employment-history.ts` is now the single shared dataset for `/career` (`StaticJobsRepository`) and `/resume` (`StaticResumeRepository`) — replaces the old "two repositories describe the same jobs but can drift" arrangement. Each bullet has `text` (full, `/career`) and optional `short` (`/resume` renders `short ?? text`). Still NOT shared: resume's flat aggregate `technologies` list and `education` array (no career-page counterpart) — authored separately in `static-resume-repository.ts`, disclosed in that file's own header comment. If reviewing a future change here, check `technologies` stays in sync with each role's per-role `technologies[]` in `employment-history.ts`.
