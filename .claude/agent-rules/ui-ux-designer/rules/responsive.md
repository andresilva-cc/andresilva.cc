# UI Design Rules — Responsive

**Read on-demand when the task involves cross-viewport layout, mobile rendering, fluid type/space, viewport units, container queries, input-modality (touch vs pointer), responsive images, or any check that a UI works across screen sizes.**

This domain governs *responsive correctness*: whether an interface stays legible, operable, and free of overflow across viewport widths and input modalities. It constrains WHAT the page must be capable of, never WHICH aesthetic direction it takes. Sizing geometry, spacing scales, grouping, and touch-target minimums live in `spacing.md`; type sizing and measure live in `typography.md` — this file owns only the cross-viewport / cross-input behavior.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific design decisions (brand fonts, palette values, chosen breakpoints, component variants) belong in the project's own `design-system.md` and `ui-spec.md` — never here.

---

## Authoring

### Rule: Author mobile-first — unprefixed styles target the smallest viewport
**Numeric baseline:** Base (unprefixed) CSS for the smallest viewport; layer wider viewports with `min-width` media queries. Never `max-width` queries undoing desktop styles.
**Applies to:** All CSS architecture and design tokens.
**Why:** The cascade reads naturally small-to-large; the base case stays the constrained one, so small-screen styles never get accidentally overridden. Desktop-first design-then-squeeze is the failure mode this prevents.

```css
/* Good — mobile-first */
.section { padding: 16px; }
@media (min-width: 768px)  { .section { padding: 32px; } }
@media (min-width: 1024px) { .section { padding: 48px; } }

/* Bad — desktop-first, undone on mobile */
.section { padding: 48px; }
@media (max-width: 768px) { .section { padding: 16px; } }
```

---

## Viewport coverage

### Rule: Reflow must hold at 320 CSS px; verify at 375 / 414 / 768 / 1024 / 1440
**Numeric baseline:** Hard floor 320 CSS px (WCAG 1.4.10 Reflow). Visually inspect at 375 (iPhone SE / mini), 414 (Pro Max / Android XL), 768 (tablet portrait), 1024 (small desktop / iPad landscape), 1440 (standard desktop).
**Applies to:** All layout, before shipping any page.
**Why:** Low-vision users zoom or use narrow viewports; fixed-width containers exclude them below 320px. The wider set maps to real-world breakpoint failures. Never optimize one width by breaking another — if the design holds at all checkpoints, ship it; if it breaks at one, fix or document the trade-off.

---

## Horizontal overflow

### Rule: Reading body content must never require horizontal scrolling
**Applies to:** All layout at every checkpoint width.
**Why:** A page that scrolls sideways to read is broken on mobile. Common offenders: fixed-width grid columns wider than the viewport, images/SVGs with explicit `width` past the container, non-wrapping table content, `nowrap` hero text, code blocks without `overflow-x: auto`. The rules below are the standard fixes.

### Rule: Use `minmax(0, 1fr)` on grid tracks containing images or wide intrinsic content
**Numeric baseline:** `grid-template-columns: minmax(0, 1fr) ...` (not bare `1fr`) wherever a track may hold an `<img>`, `<picture>`, `<pre>`, or other element with large intrinsic width.
**Applies to:** CSS Grid track definitions, especially card grids, galleries, code-block layouts.
**Why:** A bare `1fr` resolves to `minmax(auto, 1fr)`, where the `auto` minimum is the track's largest intrinsic content size. A 1024px-native image inside a `1fr` track forces a 1024px minimum, pushing the grid past viewport on phones. `minmax(0, 1fr)` lets the track shrink below content size.

### Rule: Use `width: 100%`, not `100vw`, for full-bleed widths
**Applies to:** Full-bleed sections, banners, anything spanning the viewport.
**Why:** `100vw` includes the scrollbar width on desktop browsers that reserve scrollbar space, causing horizontal overflow equal to the scrollbar (~15px). `width: 100%` with the parent at viewport width is the safe equivalent.

### Rule: Contain intentional overflow with `overflow-x: clip` (not `hidden`) on `html`/`body`
**Numeric baseline:** `html, body { overflow-x: clip; }`.
**Applies to:** Root-level horizontal-overflow containment; any element that intentionally overflows its parent (full-bleed sections, oversized headlines, decorative figures past column edges).
**Why:** `overflow-x: hidden` creates a new scroll container, which breaks `position: sticky` and `position: fixed` on descendants and can trap focus on overflowing inputs. `overflow-x: clip` prevents horizontal scroll without establishing a scroll context, so sticky and fixed positioning keep working. Older Safari requires both `html` and `body`. This contains overflow — it does not fix the cause; find the offending element first.

### Rule: Apply `overflow-wrap: anywhere; min-width: 0` to long-string and display containers
**Numeric baseline:** `overflow-wrap: anywhere; min-width: 0` on display headings and any container that may hold URLs, code, or long unbroken strings.
**Applies to:** Hero/display headings, slug/URL displays, inline code in prose, anywhere user-supplied strings render. *(Exception: brand wordmarks at hero size — see `typography.md`; breaking a wordmark mid-word is a layout bug, not an acceptable mitigation.)*
**Why:** Default `overflow-wrap: normal` only breaks at whitespace and hyphens, so long compounds, uppercase brand names, and URLs overflow narrow viewports. `anywhere` allows mid-word breaks as a last resort. `min-width: 0` is required on flex/grid items, which default to `min-width: auto` (= intrinsic content size) and otherwise prevent the wrap.

---

## Viewport units

### Rule: Use `dvh` / `svh` / `lvh` instead of `vh` for full-height layouts
**Numeric baseline:** `100dvh` (dynamic), `100svh` (small / URL-bar-visible), `100lvh` (large / URL-bar-hidden). Never `100vh` for layouts that must fit the visible viewport.
**Applies to:** Full-height heroes, full-screen modals, mobile drawers, anything sized to "one screen".
**Why:** On mobile browsers `100vh` is computed against the largest viewport (URL bar hidden), so a `100vh` hero extends below the visible area when the bar shows — and doesn't update when the bar retracts. Use `svh` for a guaranteed-fits-on-load size (safe default for heroes), `dvh` for layout that should track chrome changes (use sparingly — it can thrash during scroll if heavy children reflow), `lvh` for immersive full-bleed where occasional overlap is acceptable. Same logic applies to width (`dvw`/`svw`/`lvw`) and logical-axis (`dvb`/`svb`/`dvi`/`svi`) variants.

---

## Type and spacing across viewports

### Rule: Form controls and body text are ≥16px at mobile
**Numeric baseline:** `font-size: 16px` (`1rem`) minimum on every `<input>`, `<select>`, `<textarea>`, and body-copy element at mobile widths. Floor `--text-base` at `1rem`; the smallest token (`--text-xs`) stays ≥ `0.75rem`/12px and is reserved for decorative kickers / fine print, never load-bearing content.
**Applies to:** All form controls and body-equivalent text on phone-sized viewports.
**Why:** iOS Safari zooms the viewport on focus whenever a control's computed `font-size` is under 16px, yanking the layout. 16px is also the comfortable-read floor. Do **not** suppress the zoom with `user-scalable=no` or `maximum-scale=1` in the viewport meta — that breaks pinch-zoom and violates WCAG 1.4.4. Fix the font-size instead.

### Rule: `<pre>` and `<code>` respect the 16px floor at mobile
**Numeric baseline:** `font-size: var(--text-base)` (the 16px-floor clamp) at mobile; optionally tighten via `clamp()` only at ≥768px where wider line length carries the smaller size.
**Applies to:** `<pre>` blocks and inline `<code>` — body-text-equivalent content.
**Why:** The terminal aesthetic tempts a 12–13px mono size to mimic a real terminal, but at mobile that drops below both the iOS auto-zoom threshold and the comfortable-read floor. Terminal feel comes from `--font-mono` + tight tracking + a token background, not from shrinking text below the floor that applies to all body-equivalent content.

### Rule: Scale type and spacing fluidly with `clamp()`
**Numeric baseline:** `clamp(min, intercept + slopevw·vw, max)` interpolated between a min and max viewport (Utopia method) rather than doubling values at each breakpoint.
**Applies to:** Type scales and spacing tokens that should breathe at wider sizes without a shape change.
**Why:** Stepped breakpoints jump; `clamp()` scales continuously, so a value grows smoothly from its mobile floor to its desktop cap. Reserve stepped breakpoints for genuine shape changes (single column → multi-column); use fluid scaling when the design just needs to breathe. The Utopia slope:

```
slopevw      = ((max − min) / (maxVw − minVw)) × 100
interceptrem = min − (slopevw × minVw / 100)
--text-base: clamp(1.125rem, 1.0739rem + 0.2273vw, 1.3125rem);  /* 18px@320 → 21px@1240 */
```

Inside a container context, `cqi`/`cqw` replace `vw` for type tied to a component's width rather than the page's.

---

## Input modality

### Rule: Distinguish hover from touch with `(hover:)` and `(pointer:)`
**Applies to:** Any UI whose information or actions depend on hover — dropdowns, submenus, hover-revealed controls, tooltips.
**Why:** Touch devices cannot hover; a hover-only affordance is invisible to them. Scope hover enhancements behind `(hover: hover) and (pointer: fine)` and provide a tap/focus equivalent (or suppress) under `(hover: none)`. `(pointer: coarse)` (finger input) should enlarge targets to the touch-primary floor in `spacing.md`. These interaction media features are Baseline widely-available.

```css
.menu-item { /* visible, tappable by default — works for everyone */ }

@media (hover: hover) and (pointer: fine) {
  .menu-item:hover { background: var(--surface-hover); }
  .has-submenu:hover > .submenu { display: block; }
}
@media (pointer: coarse) {
  .icon-button { min-block-size: 44px; min-inline-size: 44px; }
}
```

### Rule: Touch targets meet the `spacing.md` sizing floor; enlarge on coarse pointers
**Numeric baseline:** 24×24 CSS px (AA) / 44×44 (touch-primary) per `spacing.md`; treat 44×44 as the practical floor under `(pointer: coarse)`.
**Applies to:** All pointer targets on touch-capable or mixed-input devices.
**Why:** The sizing minimums and hit-area techniques live in `spacing.md` (a target's size is viewport-independent). What is *responsive* is detecting coarse input and sizing up accordingly — don't restate the numbers, reference them and branch on `(pointer: coarse)`.

---

## Component-level responsiveness

### Rule: Use container queries for component-level adaptation
**Numeric baseline:** `container-type: inline-size` on the parent; `@container (min-width: …)` on the child. Baseline since early 2023 across Chrome, Edge, Firefox, Safari.
**Applies to:** Components reused at multiple widths — cards, sidebars, form groups, embeds in unknown layout slots.
**Why:** A component should adapt to *its container's* width, not the viewport's, so the same card behaves correctly in a wide main column and a narrow sidebar. Heuristic: **media queries for page-level layout (header collapse, page columns), container queries for component-level layout.** Treating `@container` as "future tech" and nesting media queries instead is now an anti-pattern.

### Rule: Serve responsively-sized images with `srcset` + `sizes`
**Applies to:** Photos whose display size varies meaningfully across viewports (hero at 100% width on mobile, 50% on desktop).
**Why:** A single large source wastes mobile bandwidth; `sizes` lets the browser pick the right resolution, and `srcset` supplies the candidates. Add `loading="lazy"` + `decoding="async"` to below-the-fold images; keep the first 1–2 hero images eager.

```html
<img src="hero-800.jpg"
     srcset="hero-400.jpg 400w, hero-800.jpg 800w, hero-1600.jpg 1600w"
     sizes="(min-width: 1024px) 50vw, 100vw" alt="…" />
```

---

## Navigation

### Rule: Navigation must remain reachable at mobile
**Applies to:** Any page with a `<nav>`, at 375 and 414 widths.
**Why:** Nav items must be reachable on phones via one of: (1) still visible — wrap, stack, or scroll horizontally as one row; (2) collapse behind a visible trigger (a "menu" link, a `<details>`/`<summary>` disclosure, a `<button aria-expanded>` hamburger — pick whatever fits the register; hamburger is one option, not a default), the trigger meeting the touch-target floor and the menu opening via CSS-only or honest JS; (3) mirror as in-page anchor links elsewhere (a section directory in the hero or footer). Silently hiding nav with `display: none` and no fallback is unreachable navigation — never ship it.

### Rule: Mobile nav reflow is all-or-nothing — whole nav drops, never stranded items
**Numeric baseline:** Header at mobile uses `flex-direction: column` (brand row, then full nav row) or a `grid` with `grid-template-rows: auto auto` — not bare `flex-wrap: wrap` on the header.
**Applies to:** Headers that reflow at narrow widths.
**Why:** `flex-wrap: wrap` on a header lets the browser decide which items wrap by available space, producing stranded items — the brand floats beside a 2-of-3 nav row with the leftover item dropped right-aligned below. That reads as a layout bug. Acceptable reflow: the whole nav drops to its own row together, or it collapses behind a trigger (above). Forbidden: brand + partial-nav on row 1 with orphans below. If the header wraps unevenly, refactor the layout — don't patch the orphan with `text-align`.

---

## Sources

- [W3C — WCAG 2.2 1.4.4 Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)
- [W3C — WCAG 2.2 1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- [MDN — Viewport-percentage lengths (`dvh`, `svh`, `lvh`)](https://developer.mozilla.org/en-US/docs/Web/CSS/length#viewport-percentage_lengths)
- [MDN — CSS container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries)
- [MDN — `@media (hover:)` / `(pointer:)`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover)
- [MDN — Responsive images (`srcset`/`sizes`)](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images)
- [MDN — overflow-x](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-x)
- [MDN — overflow-wrap](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-wrap)
- [Utopia — fluid type & space `clamp()` calculator](https://utopia.fyi/type/calculator)
- [CSS-Tricks — 16px-or-larger text prevents iOS form-zoom](https://css-tricks.com/16px-or-larger-text-prevents-ios-form-zoom/)
- [CSS-Tricks — Preventing a Grid Blowout](https://css-tricks.com/preventing-a-grid-blowout/)
- [web.dev — The large, small, and dynamic viewport units](https://web.dev/blog/viewport-units)
- [Tailwind CSS — Responsive Design](https://tailwindcss.com/docs/responsive-design)
