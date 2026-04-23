# UI Design Rules — Color

**Read on-demand when the task involves palette construction, contrast ratios, dark mode, semantic color roles, color-space choice, or any color-critical design decision.**

This domain governs color as a system (palette, scales, aliases), contrast for accessibility, and the specific behavior of dark mode.

---

## Contrast floor (WCAG)

### Rule: Body text ≥ 4.5:1 / large text ≥ 3:1 (AA)
**Numeric baseline:** 4.5:1 body; 3:1 for ≥18pt or ≥14pt bold.
**Applies to:** All text against its background.
**Why:** WCAG 1.4.3. Readability threshold for 20/40 vision. Legal baseline.

### Rule: Body text ≥ 7:1 (AAA) for high-stakes contexts
**Numeric baseline:** 7:1 body / 4.5:1 large.
**Applies to:** Government, healthcare, finance, senior-user UIs.
**Why:** WCAG 1.4.6. Serves ~20/80 vision.

### Rule: UI components and meaningful graphics ≥ 3:1 against adjacent colors
**Numeric baseline:** 3:1.
**Applies to:** Focus rings, input borders, toggle strokes, icon buttons, chart lines that carry meaning.
**Why:** WCAG 1.4.11. Users must be able to locate interactive regions.

### Rule: Focus indicators ≥ 2 CSS pixels thick, ≥ 3:1 contrast
**Numeric baseline:** 2 CSS px perimeter; 3:1 contrast between focused and unfocused state.
**Applies to:** All custom focus styles.
**Why:** WCAG 2.4.11. Using `outline: none` without replacement is a WCAG violation.

---

## Information and meaning

### Rule: Never convey information through color alone
**Applies to:** Form errors (+ icon + text), chart series (+ pattern/label), status indicators, links (+ underline or weight), destructive actions.
**Why:** WCAG 1.4.1. ~8% of men and ~0.5% of women have color vision deficiency. Color cues also fail in sunlight, grayscale prints, and with system color filters.

### Rule: Links need a non-color indicator (underline or icon)
**Applies to:** Inline links in body copy.
**Why:** Colorblind users can't distinguish a blue link from black body text if only color marks it. Standalone button-style links (e.g. in nav) can skip underlines if the context makes clickability obvious.

---

## Palette construction (detect-and-conform)

### Rule: Use an 11- or 12-step scale per color family
**Numeric baseline:** Tailwind: 11 steps (50–950). Radix: 12 steps (1–12) with per-step role assignment.
**Applies to:** All primary/neutral/accent families.
**Why:** Real UIs need ≥10 shades (app bg, subtle bg, hover/active states, borders, text). 3-shade palettes run out immediately. Detect which convention the project uses and conform.

### Rule: Define shade scales up front — don't compute at runtime
**Applies to:** Design tokens, CSS variable files, theme config.
**Why:** Programmatic darken/lighten (Sass `darken()`, HSL manipulation) produces muddy, hue-shifted output because HSL isn't perceptually uniform.

### Rule: Build palettes in OKLCH (or LCH), not HSL
**Applies to:** Greenfield design systems.
**Why:** OKLCH's L channel matches perceived lightness — a ramp with even L steps reads as even steps, so accessibility stays predictable across hues. HSL at the same L produces visibly different perceived lightness per hue. Existing HSL systems can stay unless redesigned.

### Rule: Use saturation + lightness together — don't let lightness kill saturation
**Applies to:** Building shade ramps.
**Why:** Naively lightening a vivid color by raising L drops perceived saturation (pastels turn grey). Good systems raise chroma as they raise lightness on light shades.

### Rule: Alias palette colors to semantic roles
**Applies to:** Design token systems.
**Why:** Consumers reference `--color-primary` not `--blue-500`, so rebranding (blue → purple) doesn't require touching consumers. Detect whether the project uses palette tokens (`blue-500`) or semantic (`primary`) and conform.

---

## Backgrounds and surfaces

### Rule: Don't use true black (#000) or true white (#fff) as backgrounds
**Numeric baseline:** Dark-mode surface ~L\*10–15 (e.g. `#121212`). Light-mode body text `#1a1a1a`–`#333`.
**Applies to:** Primary app backgrounds, body text color in dark mode, page background in light mode.
**Why:** Pure black creates halation on OLED/LCD (white text "glows"); pure white is retina-fatiguing. Off-black / off-white reduce glare. Exceptions: deliberate brutalist or editorial brands.

### Rule: Don't put colored text on colored backgrounds
**Applies to:** Alert/badge components, tinted cards, highlighted rows.
**Why:** Contrast ratios become unpredictable and hue clashes distract. When needed, darken within the same hue family (light-blue bg + darker-blue text).

---

## Hierarchy and emphasis

### Rule: Primary actions get the most color — secondary/tertiary use less
**Applies to:** Forms, toolbars, action bars.
**Why:** If every button is saturated primary, hierarchy collapses. Reserve saturation for what matters.

---

## Dark mode

### Rule: Dark mode is not inverted light mode — build separate palettes
**Applies to:** Any project supporting both modes.
**Why:** Simple inversion washes out primaries (a vivid blue at 95% becomes muddy at 5%) and reverses the saturation relationship needed for contrast. Catalog ramp pairs (light-primary, dark-primary) rather than one ramp.

### Rule: In dark mode, use lightness (not shadow) to indicate elevation
**Numeric baseline:** Material baseline `#121212` surface, stepping lighter per elevation level.
**Applies to:** Cards, modals, popovers, tooltips in dark mode.
**Why:** Drop shadows rely on shadow being darker than surface — impossible on a near-black surface. Raising L\* simulates ambient light instead.

### Rule: Use off-white body text on dark (not #fff)
**Numeric baseline:** Body ~`#e6e6e6` (L\* ~90); Material high-emphasis on-surface = 87% white alpha.
**Applies to:** Dark-mode body text.
**Why:** Reduces halation on OLED. Deliberate brutalist designs keep `#fff` for punch.

---

## Sources

- [W3C — WCAG 2.2 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
- [W3C — WCAG 2.2 1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [W3C — WCAG 2.2 1.4.6 Contrast (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html)
- [W3C — WCAG 2.2 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- [W3C — WCAG 2.2 2.4.11 Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)
- [Apple — Differentiate Without Color Alone](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/differentiate-without-color-alone-evaluation-criteria/)
- [Refactoring UI — Building Your Color Palette](https://refactoringui.com/previews/building-your-color-palette/)
- [Tailwind CSS — Customizing Colors](https://tailwindcss.com/docs/customizing-colors)
- [Radix UI — Colors](https://www.radix-ui.com/colors)
- [Radix UI — Aliasing](https://www.radix-ui.com/colors/docs/overview/aliasing)
- [Radix UI — Understanding the scale](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale)
- [Material Design 3 — Color roles](https://m3.material.io/styles/color/roles)
- [Evil Martians — OKLCH in CSS](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl)
- [Butterick — Color](https://practicaltypography.com/color.html)
- [Parker — Dark mode shadows](https://www.parker.mov/notes/good-dark-mode-shadows)
- [NN/g — Error Message Guidelines](https://www.nngroup.com/articles/error-message-guidelines/)
