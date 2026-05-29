# UI Design Rules — Spacing + Layout

**Read on-demand when the task involves spacing scales, grid systems, touch target sizing, breakpoints, proximity grouping, whitespace, or responsive layout.**

This domain governs the underlying geometry of UI: how elements are sized, how they group, and how layout responds across viewports.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific design decisions (brand fonts, palette values, chosen breakpoints, component variants) belong in the project's own `design-system.md` and `ui-spec.md` — never here.

---

## Touch targets (WCAG + platform)

### Rule: Interactive targets ≥ 24×24 CSS pixels (WCAG 2.5.8 AA)
**Numeric baseline:** 24×24 CSS px minimum.
**Applies to:** All pointer-input targets — buttons, links, form controls, icons-as-buttons.
**Why:** Motor-impaired users cannot reliably hit smaller targets. A 24px circle centered on each target must not intersect another.

### Rule: Primary touch targets ≥ 44×44 CSS pixels (WCAG 2.5.5 AAA / iOS)
**Numeric baseline:** 44×44 CSS px / points.
**Applies to:** Mobile interfaces, touch-first UIs, any primary action on a phone-sized viewport.
**Why:** Fitts' Law operationalized at finger-scale — 44pt is roughly the mean adult fingertip contact area. Apple HIG baseline for iOS/iPadOS/watchOS.

### Rule: Android touch targets ≥ 48×48dp, with 8dp spacing between adjacent
**Numeric baseline:** 48dp target; 8dp spacing.
**Applies to:** Android apps, Material-based web apps.
**Why:** Material convention derived from the same Fitts' Law foundation, tuned for the 8dp baseline grid (48 = 6 × 8dp).

### Rule: Extend hit area beyond visual size for small controls
**Numeric baseline:** Visual may be <44px if invisible hit area ≥44×44 (or ≥24×24 for AA).
**Applies to:** Dense toolbars, close buttons, icon-only controls.
**Why:** Visual density can coexist with accessibility if the pointer region meets minimums. Common implementation: `::before` pseudo-element.

---

## Grouping (Gestalt)

### Rule: Proximity signals grouping — related items close, unrelated items far
**Numeric baseline:** Related gap ≈ 0.5× of separator gap.
**Applies to:** Forms, lists, card layouts, navigation, label/input pairs.
**Why:** Law of Proximity — the visual system groups by spatial closeness pre-consciously. If label-to-input gap equals field-to-field gap, the user has to parse hierarchy manually.

### Rule: Use bounded regions (borders, backgrounds) to group at distance
**Applies to:** Cards, sidebars, form sections, grouped controls, dashboard panels.
**Why:** Law of Common Region — shared enclosure overrides proximity. Useful when proximity alone is ambiguous. Prefer background or subtle border over heavy strokes.

### Rule: Label spacing must make the label visually belong to its input
**Numeric baseline:** Margin below label < margin below input (+ gap before next field).
**Applies to:** Form layouts.
**Why:** Equal spacing ambiguates label-input association. Asymmetric spacing collapses to one mental object.

---

## Spacing scales (detect-and-conform)

### Rule: Use a consistent spacing scale based on a 4 or 8px base unit
**Numeric baseline:** Common scale: 4, 8, 12, 16, 24, 32, 48, 64, 96.
**Applies to:** All padding, margin, gap, width, height declarations.
**Why:** Consistency: rules-based measurement yields rules-based UI. Decision reduction: fewer options means faster coding. Platform fit: most popular screen sizes divide by 8 on ≥1 axis.

### Rule: Combine 8pt UI grid with 4pt baseline for type
**Numeric baseline:** 8pt block spacing; 4pt type/icon baseline.
**Applies to:** Pairing block-level spacing with inline type composition.
**Why:** Text layout needs finer increments than block layout because line-height, cap-height, and x-height rarely land on 8pt cleanly.

### Rule: Align to baseline, not center, when mixing type with icons or controls
**Applies to:** Nav bars, table cells, list items, button labels with icons.
**Why:** Center-aligning differently-sized text creates wobble — cap-height, x-height, and descender positions differ across weights and sizes.

### Rule: Avoid ambiguous spacing — ratios matter more than absolute values
**Applies to:** All grouped content.
**Why:** Spacing that communicates hierarchy requires clear ratios between related and separating gaps. Equal gaps everywhere reads as a wall of content.

---

## Spacing mechanics (CSS)

### Rule: Use `gap` for sibling spacing in flex/grid; reserve `margin` for flow breakouts
**Applies to:** Lists, card grids, button rows, any layout with repeated siblings.
**Why:** `gap` participates in flex/grid layout, applies only between items (not at edges), and avoids margin-collapse surprises. Stacked vertical margins between siblings collapse unpredictably and require workarounds (`> * + *` selectors, last-child resets). `margin` belongs to a single element's relationship to flow — use it for optical adjustments and explicit breakouts.

### Rule: Prefer logical properties for inline/block spacing
**Numeric baseline:** `padding-inline`, `padding-block`, `margin-inline-start`, `border-inline-end` over `padding-left`, `margin-left`, `border-right`.
**Applies to:** All padding, margin, and border declarations whose direction is semantically "start/end of text flow" rather than "physically left/right".
**Why:** Logical properties adapt to writing direction (RTL languages, vertical writing modes) and to future internationalization without rewrites. Physical properties hard-code left/right and break when the locale flips. Cost is near-zero in single-locale projects; benefit is large if i18n ever lands.

### Rule: Define a named z-index scale; never use ad-hoc large values
**Numeric baseline:** A small set of named layers (e.g. base, raised, dropdown, sticky, modal, toast, tooltip) mapped to predictable values. Reserve gaps between layers for future insertions.
**Applies to:** All `z-index` declarations.
**Why:** Arbitrary values like `z-index: 9999` create stacking wars and silent overlaps — there's no way to know whether the next component needs 10000 or 100. A named scale makes the layering intent legible and audit-able, and reserves room for new layers without renumbering.

---

## Breakpoints

### Rule: Use a standard breakpoint set — detect existing tokens and conform
**Numeric baseline:** Tailwind: sm=640, md=768, lg=1024, xl=1280, 2xl=1536 (px). Material: compact <600, medium 600–839, expanded 840–1199, large 1200–1599, extra-large ≥1600 (dp).
**Applies to:** Responsive tokens, layout systems.
**Why:** No universal standard — pick a convention and stay consistent. Mixing two systems in one product produces unexplained gaps.

> **Responsive correctness lives in `responsive.md`.** Mobile-first authoring, reflow / no-horizontal-overflow (`minmax(0, 1fr)`, `width: 100%` over `100vw`, `overflow-x: clip`, `overflow-wrap: anywhere`), viewport units (`dvh`/`svh`/`lvh`), fluid `clamp()` scaling, container queries, and input-modality (`hover`/`pointer`) detection all live there. This file owns sizing geometry, grouping, and scales — the touch-target *minimums* below included; `responsive.md` owns cross-viewport / cross-input behavior and references those minimums for coarse-pointer sizing.

---

## Restraint

### Rule: Start with too much whitespace — reducing is cheaper than adding
**Applies to:** Marketing sites, landing pages, blog surfaces, onboarding.
**Why:** Refactoring UI principle. Airy-first designs look calm; cramped designs read as noisy. Dense dashboards are the exception — intentional density is its own posture.

### Rule: Respect `prefers-reduced-motion` for layout-triggered motion
**Applies to:** Parallax, reveal-on-scroll transforms, hero-text animations, autoplay video.
**Why:** Layout-triggered motion is the worst vestibular offender. Scroll-linked transforms are frequently cited in WCAG 2.3.3 discussion.

---

## Sources

- [W3C — WCAG 2.2 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [W3C — WCAG 2.2 2.5.5 Target Size (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html)
- [W3C — WCAG 2.2 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
- [Apple HIG — Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [Material Design — Spacing methods](https://m2.material.io/design/layout/spacing-methods.html)
- [Material Design 3 — Window size classes](https://m3.material.io/foundations/layout/applying-layout/window-size-classes)
- [Tailwind CSS — Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Bryn Jackson — The 8-Point Grid](https://spec.fm/specifics/8-pt-grid)
- [Refactoring UI](https://www.refactoringui.com/)
- [Laws of UX — Law of Proximity](https://lawsofux.com/law-of-proximity/)
- [Laws of UX — Law of Common Region](https://lawsofux.com/law-of-common-region/)
- [Laws of UX — Fitts's Law](https://lawsofux.com/fittss-law/)
- [NN/g — Form Design White Space](https://www.nngroup.com/articles/form-design-white-space/)
- [Emil Kowalski — Agents with Taste](https://emilkowal.ski/ui/agents-with-taste)
- [MDN — CSS Logical Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values)
