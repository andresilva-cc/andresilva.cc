# Tailwind CSS — Discipline

**Read on-demand when the project uses Tailwind CSS.** Verify from the project's `architecture.md`, a `tailwind.config.ts`/`.js` file, or a Tailwind import (`@import "tailwindcss"` for v4; `@tailwind base/components/utilities` for v3) before loading this file.

This domain governs how Tailwind is *used*, not whether to use it. The choice of Tailwind is a project decision; the way Tailwind is applied is universal craft. Most of the failure modes below come from reaching for an *alternative* mechanism (handwritten CSS, arbitrary values, raw elements, `style={}`) when the Tailwind way is right there — that defeats the point of choosing Tailwind in the first place.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions (the chosen theme tokens, the component-library structure, which Tailwind version, which Prettier plugin) belong in the project's own `architecture.md` and `design-system.md` — never here.

---

## Utilities vs handwritten CSS

### Rule: Express styling with Tailwind utilities; drop to handwritten CSS only when utilities cannot
**Applies to:** Every component and page in a Tailwind project.
**Why:** A project that chose Tailwind chose it for a reason — consistency, no orphaned class names, no CSS files to maintain, no naming bikeshed. Mixing in handwritten CSS for things utilities express is the worst of both worlds: now there are two systems to learn, two places to look, and two surfaces to keep in sync. Reach for `.css`/`@layer`/`styled-components` only when utilities truly cannot express what you need (complex `:has()` selectors, dynamic keyframes, third-party component overrides that need attribute selectors, print stylesheets). Make the exception conscious and rare.

### Rule: Never use a `style={...}` prop for what a utility expresses
**Applies to:** React/Vue/Svelte components.
**Why:** Inline `style={{padding: "16px"}}` skips Tailwind entirely — it has no theme awareness, no responsive variants, no hover/focus, and no purge. Reserve `style={}` for genuinely dynamic values that come from data at runtime (a computed position, a user-chosen color, a chart pixel value). For everything else, use the utility.

---

## Theme tokens and arbitrary values

### Rule: Use theme tokens; never use arbitrary values for design-system colors, spacing, type, or radii
**Applies to:** All utility usage — `text-`, `bg-`, `border-`, `p-`, `m-`, `gap-`, `rounded-`, `text-` sizes, `font-`, `shadow-`, etc.
**Why:** `text-[#fff]` and `p-[17px]` are escape hatches, not first-class syntax. Every arbitrary value is a place the design system isn't being expressed — colors drift, spacing fragments, dark-mode breaks, brand updates require global find-and-replace. The few legitimate uses (one-off magic numbers genuinely outside the system, third-party iframe sizing) should be flagged in review, not normalized.

### Rule: If a needed value isn't in the theme, extend the theme — don't reach for arbitrary values
**Applies to:** Any moment the team is tempted to write `text-[#5b6cff]` because "it's not in the theme yet."
**Why:** "It's not in the theme" is a signal the theme is out of sync with what the product actually uses, not permission to bypass the theme. Extend it — add the token (`primary-500: #5b6cff`) in the theme config (Tailwind v4: `@theme` block in your CSS; Tailwind v3: `theme.extend` in `tailwind.config.ts`), then use the named utility. Every recurring arbitrary value is a token waiting to be born. The exception is one-off truly-unique values that will never recur (a precise crop on one hero image) — those can stay arbitrary, but justify in code review.

### Rule: Reuse the spacing and radius scales — don't introduce parallel scales
**Applies to:** `p-`, `m-`, `gap-`, `space-`, `w-`, `h-`, `rounded-` utilities.
**Why:** Tailwind's spacing scale is the project's spacing scale. Inventing `p-[14px]` next to `p-3` (12px) and `p-4` (16px) creates a three-step scale where there was a two-step one, and the eye notices the inconsistency. If 14px is genuinely needed and recurring, extend the scale (`spacing.3.5: 14px` already exists in default Tailwind). If it's a one-off, pick the nearest scale step.

---

## Components, not raw elements

### Rule: Wrap interactive primitives in components — don't repeat utility strings on raw elements
**Applies to:** Buttons, inputs, badges, cards, tooltips, links styled as buttons, any visually-repeated element.
**Why:** A raw `<button class="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover focus-visible:ring-2 ...">` repeated 30 times is 30 places to update when the design changes. Centralize in a `<Button>` component whose utilities live in one place. The pattern: small set of typed-variant components (`<Button variant="primary" size="md">`) in `src/components/ui/`, then *every* button-like thing routes through it. Raw `<button class="...">` in feature code is a smell — either there's no `<Button>` yet (build it) or the author skipped it (use it).

### Rule: Encode component variants with `cva` / `tv` — not string interpolation in `className`
**Applies to:** Components with multiple visual states (size, variant, disabled, loading, intent).
**Why:** `className={\`px-4 py-2 ${variant === "primary" ? "bg-primary" : "bg-gray-100"} ${size === "sm" ? "text-sm" : ""}\`}` becomes unreadable past two variants and is impossible to lint. `class-variance-authority` (`cva`) and `tailwind-variants` (`tv`) make variants typed, exhaustive, and composable. Use one of them consistently; don't mix.

### Rule: Use `cn()` / `clsx` to merge classes — not ternaries or template strings
**Applies to:** Any place utility classes are conditionally applied.
**Why:** `cn(base, isActive && "ring-2", variant === "danger" && "bg-red-500", className)` is grep-able, lint-able, and merge-conflict-safe. `clsx` handles the boolean logic; `tailwind-merge` (wrapped as `cn`) resolves conflicting utilities (`p-4` + `p-2` → `p-2`). Template strings with conditional concatenation are an anti-pattern — they break the Tailwind extractor in some setups and bury intent.

### Rule: Don't use `@apply` to fake a component — build a real component instead
**Applies to:** The temptation to define `.btn-primary { @apply px-4 py-2 bg-primary text-white }` in a global CSS file.
**Why:** `@apply` was designed to be used sparingly — for genuinely repeated utility sequences that can't live in a component (e.g. base styles for prose, third-party widget overrides). When the goal is "I want a reusable styled element," that's a *component*, not a CSS class — use the component pattern above. `@apply` everywhere recreates the BEM-era class-name problem Tailwind was meant to solve.

---

## Tailwind v4 specifics

### Rule: Add `cursor-pointer` on interactive elements — Tailwind v4 changed the default
**Applies to:** `<button>` (most importantly), any `<div>`/`<a>` styled as a button or link, custom toggle/clickable elements.
**Why:** Tailwind v4 changed the preflight default for `<button>` from `cursor: pointer` to `cursor: default` (matching the browser's own default). The result: in v4 projects, buttons look interactive but the cursor doesn't acknowledge them on hover, which feels broken to users. Every interactive element styled in a v4 project needs `cursor-pointer` explicitly (or bake it into the `<Button>` base styles once). This is the single most common Tailwind-v4-migration regression.

### Rule: Use the v4 CSS-first config (`@theme` block) — not a JS config file
**Applies to:** Projects on Tailwind v4 (released 2025).
**Why:** Tailwind v4 moved configuration into CSS via `@theme { ... }` blocks alongside `@import "tailwindcss"`. JS-based `tailwind.config.ts` is legacy-supported but the project should pick one and stay there. New tokens go in the `@theme` block; the file lives next to the global stylesheet (typically `app/globals.css` or `styles/index.css`).

### Rule: Set the default border and ring color explicitly — Tailwind v4 changed them
**Applies to:** Any v4 project that uses `border` or `ring` utilities without an explicit color.
**Why:** v3 defaulted `border-*` to `gray-200` and `ring-*` to `blue-500`. v4 defaults `border` to `currentColor` and `ring` width to 1px (was 3px). Existing utilities without explicit colors render differently after migration. Either set explicit colors at the use site (`border border-gray-200`) or restore the v3 defaults in the `@theme` block — but make the choice, don't let it surprise you.

---

## Responsive, dark mode, and state

### Rule: Mobile-first — write the base styles unprefixed, add `sm:`/`md:`/`lg:` for larger viewports
**Applies to:** All responsive utility usage.
**Why:** Tailwind's responsive prefixes are min-width based. `text-sm md:text-base` means "small on mobile, base from md up." Writing `md:text-sm text-base` (desktop-first) inverts the mental model and produces hard-to-trace overrides. Mobile-first matches the project's own responsive strategy (see `_shared/rules/spacing.md`) and the way the rest of the team will read the class list.

### Rule: Use dark-mode utilities (`dark:`) consistently — not a separate stylesheet
**Applies to:** Any project with dark mode enabled.
**Why:** Tailwind's `dark:` variant is the supported path; mixing in a `theme-dark.css` overrides or `data-theme` selectors creates two systems again. Use semantic tokens (`bg-surface` that resolves to white in light and `gray-900` in dark via `@theme`) so utility usage stays the same across modes.

### Rule: Keep state utilities (`hover:`, `focus-visible:`, `disabled:`, `aria-*:`, `data-*:`) on the element, not in handwritten CSS
**Applies to:** Every interactive element.
**Why:** Tailwind ships every state variant — `hover:bg-primary-hover`, `focus-visible:ring-2`, `disabled:opacity-50`, `aria-expanded:bg-gray-100`, `data-[state=open]:rotate-90`. Reaching for handwritten `:hover` or `:focus` rules to express what variants already do is the same defeat-the-purpose anti-pattern as raw CSS. Use `focus-visible:` (not `focus:`) for keyboard-only focus indicators — see `_shared/rules/accessibility.md` for the focus-indicator spec.

---

## Class hygiene

### Rule: Use the Prettier Tailwind plugin to enforce class order
**Applies to:** All Tailwind projects.
**Why:** A consistent class order (layout → flex/grid → spacing → sizing → typography → colors → effects → state variants) makes class strings scannable and diff-reviewable. `prettier-plugin-tailwindcss` does this automatically and matches the official recommended order — no manual sorting, no review-time bikeshedding.

### Rule: Don't construct class names from runtime fragments
**Applies to:** Dynamic class assembly.
**Why:** `text-${color}-500` where `color` is a runtime value will not be picked up by Tailwind's content scanner — the utility class never exists in the compiled CSS, and the style silently doesn't apply. Map the runtime value to a complete class name in a lookup: `const colorClass = { primary: 'text-primary-500', danger: 'text-red-500' }[color]`. The full literal `text-red-500` appears in the source where the scanner can find it.

---

## Boundary with project decisions

- **The theme** (color palette, type scale, spacing scale, font families, radii, shadows) is a project decision and lives in the project's `design-system.md` + the actual `@theme` block (v4) or `tailwind.config.ts` (v3). This file does not prescribe specific tokens.
- **The component library** (which UI primitives exist, where they live, naming, variant API) is a project decision and lives in `design-system.md` + `src/components/ui/`. This file enforces the *pattern* (wrap primitives in components), not the specific components.
- **Tailwind version** (v3 vs v4), choice of `cva` vs `tv`, choice of dark-mode strategy (class vs `prefers-color-scheme`) — all project decisions, declared in `architecture.md`.

---

## Sources

- [Tailwind CSS Documentation — Utility-First Fundamentals](https://tailwindcss.com/docs/utility-first)
- [Tailwind CSS — Adding Custom Styles (when to leave utilities)](https://tailwindcss.com/docs/adding-custom-styles)
- [Tailwind CSS v4.0 — Upgrade Guide and Breaking Changes](https://tailwindcss.com/docs/upgrade-guide)
- [Tailwind CSS v4 — CSS-first configuration with `@theme`](https://tailwindcss.com/docs/theme)
- [Tailwind CSS — Reusing Styles (when to extract a component vs `@apply`)](https://tailwindcss.com/docs/reusing-styles)
- [class-variance-authority — typed variant API](https://cva.style/docs)
- [tailwind-variants — first-class variants](https://www.tailwind-variants.org/)
- [`tailwind-merge` — resolve conflicting utility classes](https://github.com/dcastil/tailwind-merge)
- [`clsx` — conditional className helper](https://github.com/lukeed/clsx)
- [`prettier-plugin-tailwindcss` — official class-order plugin](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)
- [shadcn/ui — reference for the wrap-primitives-in-components pattern](https://ui.shadcn.com/)
