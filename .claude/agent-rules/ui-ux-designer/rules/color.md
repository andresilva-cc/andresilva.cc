# UI Design Rules — Color

**Read on-demand when the task involves palette construction, contrast ratios, dark mode, semantic color roles, color-space choice, or any color-critical design decision.**

This domain governs color as a system (palette, scales, aliases), contrast for accessibility, and the specific behavior of dark mode.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific design decisions (brand fonts, palette values, chosen breakpoints, component variants) belong in the project's own `design-system.md` and `ui-spec.md` — never here.

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
**Why:** WCAG 2.4.13 (Focus Appearance). Using `outline: none` without replacement is a WCAG violation.

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

### Rule: Reference colors by token name — never inline hex/rgb/OKLCH values in components
**Applies to:** All component styles, utility classes, inline styles, framework theme overrides.
**Why:** Inline color values defeat the alias layer. Once a color appears as `#5b6cff` in a hover state or focus ring, the system has drifted — by the third edit pass there are eight one-off colors instead of the three the palette defines. If a value is needed that no token covers, add the token first, then reference it.

### Rule: When using a chromatic anchor, tint neutrals toward it
**Numeric baseline:** Neutrals carry a small chroma (OKLCH ~0.005–0.015) matched to the primary/accent hue.
**Applies to:** Background tints, borders, dividers, muted text in palettes with a chromatic primary. Achromatic systems (Vercel/Linear-style near-pure greyscale, where there is no chromatic anchor) are exempt — zero-chroma neutrals are correct there.
**Why:** Pure-chroma-zero greys next to a warm or cool accent can look uncomposed — the eye reads the mismatch even when it can't name it. A warm-anchor system (orange, red, amber) gets warm-leaning neutrals; a cool-anchor system gets cool-leaning. The shift is small but unifies the surface.

### Rule: Define colors as opaque tokens — use alpha only as a modifier for overlays
**Applies to:** Design token systems, palette definitions, scrim/overlay/shadow utilities.
**Why:** A token like `text-muted: rgba(0,0,0,0.6)` renders differently on every background surface — fine on white, wrong on a tinted card, broken in dark mode. Define muted text as an opaque OKLCH/HSL token computed against its intended surface. Reserve alpha for genuine overlays (scrims over images, shadows, hover dim layers) where transparency is the point.

---

## Backgrounds and surfaces

### Rule: Don't use true black (#000) or true white (#fff) as backgrounds
**Numeric baseline:** Dark-mode surface ~L\*10–15 (e.g. `#121212`). Light-mode body text `#1a1a1a`–`#333`.
**Applies to:** Primary app backgrounds, body text color in dark mode, page background in light mode.
**Why:** Pure black creates halation on OLED/LCD (white text "glows"); pure white is retina-fatiguing. Off-black / off-white reduce glare. Exceptions: deliberate brutalist or editorial brands.

### Rule: Don't put colored text on colored backgrounds
**Applies to:** Alert/badge components, tinted cards, highlighted rows.
**Why:** Contrast ratios become unpredictable and hue clashes distract. When needed, darken within the same hue family (light-blue bg + darker-blue text).

### Rule: Avoid gradient fills on text that carries meaning
**Applies to:** `background-clip: text` with linear/radial gradient fills on headlines, links, or any reading text.
**Why:** Gradient text has unpredictable contrast — different glyph regions hit different ratios against the background, so WCAG 1.4.3 compliance becomes per-pixel rather than per-element. Also defeats user contrast overrides and high-contrast OS modes. Acceptable for short branded display type (a wordmark, a single decorative heading) where the gradient itself is the design intent and a solid fallback exists for reduced-contrast modes.

---

## Hierarchy and emphasis

### Rule: Primary actions get the most color — secondary/tertiary use less
**Applies to:** Forms, toolbars, action bars.
**Why:** If every button is saturated primary, hierarchy collapses. Reserve saturation for what matters.

### Rule: Limit a system to one accent hue — two at most
**Applies to:** Brand/product palettes (excluding semantic status colors: success/warning/error/info).
**Why:** Multiple accent hues compete for "this is important" attention; the eye can't rank them. One hue with a multi-step ramp covers active states, focus, links, and primary CTAs. A second accent (e.g., a complementary highlight) is only justified when two genuinely distinct "important" categories exist. Status colors are a separate axis — they signal state, not brand emphasis.

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

### Rule: Keep anchor hue constant across light and dark modes — vary only lightness and chroma
**Applies to:** Light/dark palette pairs in a single design system.
**Why:** If a brand's primary is blue (hue ~250) in light mode, it must remain near hue 250 in dark mode — only lightness and chroma adjust. Switching hue between modes (e.g., a blue brand that becomes teal-leaning in dark) breaks the perceptual identity of the brand color across modes. Users who toggle modes notice the shift even when they can't name it.

---

## Sources

- [W3C — WCAG 2.2 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
- [W3C — WCAG 2.2 1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [W3C — WCAG 2.2 1.4.6 Contrast (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html)
- [W3C — WCAG 2.2 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- [W3C — WCAG 2.2 2.4.13 Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)
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
