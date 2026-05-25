# Accessibility Rules — WCAG 2.2 Level AA

**Read on-demand when the task involves designing, building, or auditing any user-facing interface — contrast, keyboard operability, focus, touch targets, motion, semantics, ARIA, forms, or images.**

This is the single source of truth for accessibility across the toolkit. ui-ux-designer designs to it; qa audits against it. It covers the cross-cutting subset of WCAG 2.2 Level AA — the criteria that apply to nearly every screen, regardless of domain.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

---

## How to use this file

WCAG 2.2 Level AA is the working target. Level AA includes everything in Level A plus the AA criteria; this file cites both because A criteria are mandatory at any AA conformance claim. Each rule names the success criterion (SC) so it can be traced to the standard and to automated-tool rule IDs.

**Automated tools are a floor, not a ceiling.** Lighthouse, axe-core, and WAVE catch only ~30–40% of WCAG issues — the mechanical ones (missing `alt`, missing labels, hard contrast failures). The remaining ~60–70% require manual testing: keyboard-only walkthroughs, screen-reader passes, judgment about whether `alt` text is *meaningful*, whether focus order is *logical*, whether an error message is *useful*. Never report "accessible" on the basis of a green automated score alone.

---

## Contrast — text and non-text

### Rule: Body text ≥ 4.5:1 contrast against its background
**Numeric baseline:** 4.5:1.
**Applies to:** All text and images of text below 18pt (24px) regular, or below 14pt (18.66px) bold. Disabled controls and pure decoration are exempt; incidental text in a logo is exempt.
**Why:** WCAG 2.2 SC 1.4.3 (AA). The threshold compensates for ~20/40 vision (roughly a 1.5× contrast loss) without assistive technology. This is the most common single failure flagged by automated tools.

### Rule: Large text may drop to 3:1 contrast
**Numeric baseline:** 3:1 for text ≥ 18pt (24px) regular or ≥ 14pt (18.66px) bold.
**Applies to:** Display headlines, hero copy, oversized numerals.
**Why:** WCAG 2.2 SC 1.4.3 (AA). Larger stroke widths stay legible at lower contrast, so the standard relaxes the ratio for large text.

### Rule: UI components and meaningful graphics ≥ 3:1 against adjacent colors
**Numeric baseline:** 3:1.
**Applies to:** Input borders, focus rings, toggle/checkbox/radio strokes, button boundaries when boundary is the only affordance, icons that carry meaning, chart lines and segments that encode data. Pure decoration and inactive/disabled components are exempt.
**Why:** WCAG 2.2 SC 1.4.11 (AA). Users must be able to perceive that an interactive element exists and where its edges are. A control that "disappears" into the page is unusable for low-vision users.

### Rule: AAA contrast (7:1 body / 4.5:1 large) for high-stakes surfaces
**Numeric baseline:** 7:1 body, 4.5:1 large text.
**Applies to:** Government, healthcare, finance, and senior-user products, or any flow where a perception error has serious consequences. This is above the AA target — apply when the project's risk profile warrants it.
**Why:** WCAG 2.2 SC 1.4.6 (AAA). Serves ~20/80 vision without assistive technology.

---

## Keyboard operability

### Rule: Every interactive element is fully operable by keyboard alone
**Applies to:** All controls — links, buttons, form fields, custom widgets, menus, dialogs, drag handles, carousels. Exempt only when the function inherently requires a path-based gesture (e.g. freehand drawing).
**Why:** WCAG 2.2 SC 2.1.1 (A). Keyboard users include people with motor disabilities, screen-reader users, and anyone whose pointing device fails. If a feature works only on click/hover/drag, it is broken for them. Use native interactive elements (`<button>`, `<a>`, `<input>`) so keyboard support comes for free.

### Rule: Never trap keyboard focus
**Applies to:** Modals, embedded widgets, media players, third-party iframes, custom date pickers.
**Why:** WCAG 2.2 SC 2.1.2 (A). If focus enters a component and cannot leave by standard means (Tab, Shift+Tab, Esc), the keyboard user is stuck on the whole page. Modal dialogs should *cycle* focus within themselves while open and return it to the trigger on close — that is focus management, not a trap.

### Rule: Provide a non-dragging alternative for every drag operation
**Applies to:** Reorderable lists, kanban boards, sliders, map panning, drag-to-resize.
**Why:** WCAG 2.2 SC 2.5.7 (AA). Dragging requires sustained fine motor control. Offer single-pointer equivalents — move-up/move-down buttons, a numeric input alongside a slider, click-to-place.

### Rule: Provide a skip link to bypass repeated blocks
**Applies to:** Any page with a repeated header/nav before the main content.
**Why:** WCAG 2.2 SC 2.4.1 (A). Without a "Skip to main content" link, keyboard and screen-reader users tab through the entire nav on every page load. The skip link may be visually hidden until focused, but must become visible on focus.

---

## Focus — visibility and order

### Rule: Keyboard focus is always visibly indicated
**Applies to:** Every focusable element.
**Why:** WCAG 2.2 SC 2.4.7 (AA). A keyboard user must always be able to see which element is focused. Removing the indicator with `outline: none` and not replacing it is a direct violation. If a custom focus style is used, it must be at least as discoverable as the browser default.

### Rule: Custom focus indicators ≥ 2 CSS px thick and ≥ 3:1 contrast
**Numeric baseline:** Indicator area at least equal to a 2 CSS px perimeter of the component; 3:1 contrast between the focus indicator and the adjacent unfocused color, **and** a separate 3:1 contrast between the focused and unfocused states of the component.
**Applies to:** All custom focus styles replacing the UA default.
**Why:** The two 3:1 ratios live in different success criteria — they are distinct requirements: **SC 2.4.13 Focus Appearance (AAA)** sets the perimeter area and the focused-vs-unfocused-state 3:1; **SC 1.4.11 Non-text Contrast (AA)** supplies the separate 3:1 between the focus indicator and the adjacent unfocused color. **SC 2.4.7 Focus Visible (AA)** requires the indicator to be visible without specifying a numeric floor, so 2 CSS px / 3:1 / 3:1 is the recommended baseline that satisfies all three. A 1px hairline at low contrast technically "shows" focus but fails real users. Do not rely solely on a color change with no shape/thickness change — that can fail for colorblind users.

### Rule: Focus order follows a logical, meaningful sequence
**Applies to:** All sequentially navigable pages.
**Why:** WCAG 2.2 SC 2.4.3 (A). Tab order should match the visual and reading order. It normally tracks DOM order — so author the DOM in reading order and avoid positive `tabindex` values (anything > 0 hijacks the natural order and is almost always a bug). When a dialog opens, move focus into it; when it closes, return focus to the trigger.

### Rule: The focused element is never fully hidden behind other content
**Applies to:** Pages with sticky headers, sticky footers, cookie banners, non-modal overlays.
**Why:** WCAG 2.2 SC 2.4.11 Focus Not Obscured (Minimum) (AA). When an element receives focus, at least part of it must remain visible — a sticky header that completely covers the focused field leaves the keyboard user unable to see where they are. Use `scroll-padding` / `scroll-margin` so scrolled-to targets clear sticky regions.

---

## Touch and pointer targets

### Rule: Interactive targets are at least 24×24 CSS pixels
**Numeric baseline:** 24×24 CSS px minimum; undersized targets must have enough spacing that a 24px-diameter circle centered on each does not intersect another target.
**Applies to:** Buttons, links rendered as controls, icon buttons, checkboxes, custom widgets. Exempt: targets inline within a sentence; a target with an equivalent larger control elsewhere on the page; targets sized by the user agent; cases where the exact size is essential (e.g. map pins at geographic positions).
**Why:** WCAG 2.2 SC 2.5.8 Target Size (Minimum) (AA). Small targets are hard to hit for users with tremor, limited dexterity, or on a moving device. 24px is the AA floor; 44×44 pt (Apple HIG) or 48×48 dp (Material) are stronger comfort baselines for primary touch surfaces.

---

## Color and meaning

### Rule: Never convey information through color alone
**Applies to:** Form-field error states (add an icon and text), required fields, chart series (add labels, patterns, or direct annotation), status badges, links in body copy, destructive vs. safe actions.
**Why:** WCAG 2.2 SC 1.4.1 (A). ~8% of men and ~0.5% of women have a color vision deficiency. Color also fails in bright sunlight, grayscale printouts, and under OS color filters. Every color cue needs a redundant non-color cue — shape, icon, text, position, or pattern.

### Rule: Inline links carry a non-color indicator
**Applies to:** Links embedded in running text.
**Why:** WCAG 2.2 SC 1.4.1 (A). A colorblind user cannot distinguish a link-colored word from surrounding body text if color is the only signal. Underline is the durable convention; weight or a persistent icon can substitute. Standalone button-styled links (e.g. in a nav bar) where context already signals clickability are the exception.

---

## Motion

### Rule: Respect `prefers-reduced-motion` for all non-essential animation
**Applies to:** Scroll-triggered movement, parallax, large transitions, autoplaying carousels, decorative motion on hover/focus/submit.
**Why:** WCAG 2.2 SC 2.3.3 Animation from Interactions (AAA), with SC 2.2.2 Pause, Stop, Hide (A) as the AA-level lever for autoplaying motion that runs for more than 5 seconds. Vestibular-disorder users can experience dizziness, nausea, and headaches from motion. Gate non-essential animation behind `@media (prefers-reduced-motion: reduce)` and provide a reduced or zero-motion path. Motion that is essential to meaning (e.g. a progress indicator) may remain.

### Rule: No content flashes more than 3 times per second
**Numeric baseline:** ≤ 3 flashes per second.
**Applies to:** Animations, video, transitions, loading effects, GIFs.
**Why:** WCAG 2.2 SC 2.3.1 (A). Flashing above this rate can trigger photosensitive seizures.

---

## Text resize and reflow

### Rule: Text resizes to 200% without loss of content or function
**Numeric baseline:** 200% text zoom.
**Applies to:** Every text container.
**Why:** WCAG 2.2 SC 1.4.4 (AA). Low-vision users rely on browser zoom. Avoid fixed `px` heights on text-bearing blocks and avoid clipping overflow — text must be allowed to grow.

### Rule: Content reflows to a 320 CSS px width without two-dimensional scrolling
**Numeric baseline:** 320 CSS px wide (equivalent to 1280px at 400% zoom); 256 CSS px tall for horizontally-scrolling content.
**Applies to:** All page layouts.
**Why:** WCAG 2.2 SC 1.4.10 Reflow (AA). At high zoom the viewport shrinks; content must wrap to a single column without forcing the user to scroll both axes to read a line. Use responsive layout (flexbox/grid, relative units). Data tables and complex diagrams are exempt where two-axis presentation is essential.

### Rule: Text-spacing overrides must not break layout
**Numeric baseline:** line-height ≥ 1.5×, paragraph spacing ≥ 2×, letter-spacing ≥ 0.12×, word-spacing ≥ 0.16×.
**Applies to:** All text-bearing containers.
**Why:** WCAG 2.2 SC 1.4.12 (AA). Dyslexic and low-vision users apply reader stylesheets that increase spacing; fixed-height containers clip the result.

---

## Semantic structure

### Rule: Use semantic HTML — structure and relationships must be programmatic
**Applies to:** Headings, lists, tables, form groups, landmarks, emphasis.
**Why:** WCAG 2.2 SC 1.3.1 Info and Relationships (A). Whatever is conveyed visually (a heading, a list, a column relationship) must be conveyed in the markup. Styled `<div>`s that *look* like headings are invisible to screen readers. Use `<h1>`–`<h6>`, `<ul>`/`<ol>`/`<li>`, `<table>` with `<th>`, `<nav>`/`<main>`/`<header>`/`<footer>` landmarks, `<fieldset>`/`<legend>` for grouped fields.

### Rule: Headings form a logical, non-skipping hierarchy
**Applies to:** Every page.
**Why:** WCAG 2.2 SC 1.3.1 (A) and SC 2.4.6 (AA). One `<h1>` per page; do not jump from `<h2>` to `<h4>`. Screen-reader users navigate by heading — a broken hierarchy or heading-shaped text that is not a real heading destroys that navigation. Heading level reflects document structure, not font size.

### Rule: Every page has a descriptive, unique `<title>`
**Applies to:** All pages / routed views.
**Why:** WCAG 2.2 SC 2.4.2 (A). The title is the first thing announced and identifies the tab/window. Single-page apps must update the title on route change.

### Rule: The page declares its primary language
**Applies to:** The root `<html>` element; also any inline content in a different language.
**Why:** WCAG 2.2 SC 3.1.1 (A) and SC 3.1.2 (AA). `lang` tells screen readers which pronunciation rules and voice to use; without it, content is read with the wrong accent and may be unintelligible.

---

## ARIA basics

### Rule: Prefer native HTML; use ARIA only when native semantics fall short
**Applies to:** Any choice between a semantic element and a `role` on a generic element.
**Why:** First Rule of ARIA (WAI-ARIA Authoring Practices Guide). A native `<button>` brings focusability, keyboard handling, and the correct role for free; `<div role="button">` brings none of that and must reimplement it all. Bad ARIA is worse than no ARIA — incorrect roles and states actively mislead assistive technology.

### Rule: Every interactive element has an accessible name
**Applies to:** Buttons, links, form fields, custom widgets, dialogs, regions.
**Why:** WCAG 2.2 SC 4.1.2 Name, Role, Value (A). A control with no name is announced as just "button" or "edit text" — the user cannot know what it does. The name comes from visible text, an associated `<label>`, `aria-labelledby`, or `aria-label` (in that order of preference — visible text is best).

### Rule: Icon-only buttons must have a text accessible name
**Applies to:** Buttons and links whose only content is an icon/SVG.
**Why:** WCAG 2.2 SC 4.1.2 (A). An icon has no inherent text. Provide a name via visually-hidden text inside the control (also works with voice-control software) or `aria-label`. Decorative SVGs inside a labeled control should be hidden with `aria-hidden="true"`.

### Rule: Custom widgets expose correct role, states, and properties — and keep them current
**Applies to:** Custom checkboxes, toggles, tabs, accordions, comboboxes, menus, tree views.
**Why:** WCAG 2.2 SC 4.1.2 (A). A custom toggle must expose `role`, its checked/expanded/selected state, and update that state as the user interacts. A visually "on" switch that still reports `aria-checked="false"` lies to the screen-reader user. Follow the APG pattern for the widget type, including its keyboard interaction model.

### Rule: Announce dynamic, non-focus content changes via live regions
**Applies to:** Async form-submission results, toast notifications, search-result counts, validation summaries, auto-save status.
**Why:** WCAG 2.2 SC 4.1.3 Status Messages (AA). A visual update a sighted user notices instantly is silent to a screen-reader user if focus did not move. Use `aria-live="polite"` (or `role="status"` / `role="alert"`) so the change is announced. Reserve `assertive`/`alert` for genuinely urgent messages.

---

## Forms

### Rule: Every form control has a programmatically associated label
**Applies to:** Inputs, selects, textareas, checkboxes, radios.
**Why:** WCAG 2.2 SC 1.3.1 (A), SC 3.3.2 Labels or Instructions (A), and SC 4.1.2 (A). Use `<label for="id">` or wrap the control in the `<label>`. Placeholder text is *not* a label — it disappears on input, fails contrast, and is unreliable for assistive technology. A visible, persistent label is required.

### Rule: Identify errors in text and describe how to fix them
**Applies to:** All form validation.
**Why:** WCAG 2.2 SC 3.3.1 Error Identification (A) and SC 3.3.3 Error Suggestion (AA). The error must be conveyed in text (not color or icon alone), name which field failed, and say what to do — "Enter a date in MM/DD/YYYY format," not "Invalid input." Associate the message with its field via `aria-describedby` and mark the field `aria-invalid="true"`.

### Rule: Provide instructions and the expected format before input
**Applies to:** Fields with format constraints, required fields, grouped choices.
**Why:** WCAG 2.2 SC 3.3.2 (A). Tell the user the rule (password requirements, date format, which fields are required) up front, in text, not only after they fail. Mark required fields in a way that does not depend on color alone.

### Rule: Set `autocomplete` on fields that collect known personal data
**Applies to:** Name, email, phone, address, postal code, payment fields.
**Why:** WCAG 2.2 SC 1.3.5 Identify Input Purpose (AA). Standard `autocomplete` tokens let browsers and assistive tech autofill and re-label fields, cutting memory load and typing effort for users with cognitive and motor disabilities.

### Rule: Do not require a cognitive-function test to authenticate
**Applies to:** Login, sign-up, password reset, checkout.
**Why:** WCAG 2.2 SC 3.3.8 Accessible Authentication (Minimum) (AA). Steps that force users to memorize, transcribe, or solve a puzzle (a CAPTCHA with no accessible alternative, retyping a one-time code without paste support) exclude users with cognitive disabilities. Allow password managers and paste; offer an object-recognition alternative for CAPTCHAs.

### Rule: Don't ask for the same information twice in one session
**Applies to:** Multi-step forms and wizards.
**Why:** WCAG 2.2 SC 3.3.7 Redundant Entry (A). Re-entering data already provided in the same process burdens users with cognitive and motor disabilities. Auto-populate it or offer it as a selectable choice (e.g. "billing address same as shipping").

---

## Images and non-text content

### Rule: Every informative image has a meaningful text alternative
**Applies to:** Content images, infographics, charts, icons that convey meaning, image buttons.
**Why:** WCAG 2.2 SC 1.1.1 Non-text Content (A). `alt` must convey the image's *purpose or function*, not a literal pixel description — for a chart, summarize the takeaway; for an image link, describe the destination. Automated tools confirm `alt` *exists* but cannot judge whether it is *useful* — that needs manual review.

### Rule: Purely decorative images have empty alt text
**Numeric baseline:** `alt=""` (empty, not omitted).
**Applies to:** Decorative photos, spacer images, background flourishes, icons next to text that already says the same thing.
**Why:** WCAG 2.2 SC 1.1.1 (A). An empty `alt` tells the screen reader to skip the image. Omitting `alt` entirely makes some readers announce the file name instead — noise. Decorative inline SVGs/icons should also carry `aria-hidden="true"`.

### Rule: Provide captions and alternatives for audio and video
**Applies to:** Video with audio, audio-only content, live media.
**Why:** WCAG 2.2 SC 1.2.1 Audio-only and Video-only (Prerecorded) (A), SC 1.2.2 Captions (Prerecorded) (A), SC 1.2.4 Captions (Live) (AA), and SC 1.2.5 Audio Description (Prerecorded) (AA). Deaf and hard-of-hearing users need synchronized captions (live and prerecorded); blind users need audio description or a transcript for visual-only information; audio-only prerecorded content needs a text alternative.

---

## Verification — manual testing is mandatory

### Rule: Run a keyboard-only pass before claiming a screen is accessible
**Applies to:** Every interactive screen.
**Why:** Unplug the mouse. Tab through everything: confirm all controls are reachable, focus is always visible, order is logical, nothing is trapped, the focused element is never fully hidden, and modals manage focus correctly. This is the single highest-value manual check and automated tools cannot do it.

### Rule: Run a screen-reader pass on critical flows
**Applies to:** Primary task flows — sign-up, checkout, search, core CRUD.
**Why:** Use VoiceOver (macOS/iOS), NVDA (Windows), or TalkBack (Android). Confirm names, roles, and states are announced correctly, headings and landmarks aid navigation, dynamic changes are announced, and error messages reach the user. Automated tools cannot evaluate whether the announced experience makes sense.

### Rule: Treat automated scans as a regression gate, not a sign-off
**Numeric baseline:** Automated tools surface ~30–40% of issues.
**Applies to:** CI pipelines, pre-merge checks, QA audits.
**Why:** Lighthouse and axe-core catch mechanical failures fast and cheaply — run them on every build to prevent regressions. But a passing score is not a conformance claim. The ~60–70% of issues they miss (alt-text quality, logical order, keyboard patterns, meaningful errors) require the manual passes above.

---

## Sources

- [W3C — WCAG 2.2 Recommendation](https://www.w3.org/TR/WCAG22/)
- [W3C — What's New in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
- [W3C — SC 1.1.1 Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html)
- [W3C — SC 1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)
- [W3C — SC 1.3.5 Identify Input Purpose](https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html)
- [W3C — SC 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
- [W3C — SC 1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [W3C — SC 1.4.4 Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)
- [W3C — SC 1.4.6 Contrast (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html)
- [W3C — SC 1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- [W3C — SC 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- [W3C — SC 1.2.1 Audio-only and Video-only (Prerecorded)](https://www.w3.org/WAI/WCAG22/Understanding/audio-only-and-video-only-prerecorded.html)
- [W3C — SC 1.2.4 Captions (Live)](https://www.w3.org/WAI/WCAG22/Understanding/captions-live.html)
- [W3C — SC 1.4.12 Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)
- [W3C — SC 2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
- [W3C — SC 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
- [W3C — SC 2.4.3 Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html)
- [W3C — SC 2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)
- [W3C — SC 2.4.11 Focus Not Obscured (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)
- [W3C — SC 2.4.13 Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)
- [W3C — SC 2.5.7 Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)
- [W3C — SC 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [W3C — SC 3.3.1 Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html)
- [W3C — SC 3.3.2 Labels or Instructions](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html)
- [W3C — SC 3.3.7 Redundant Entry](https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html)
- [W3C — SC 3.3.8 Accessible Authentication (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html)
- [W3C — SC 4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html)
- [W3C — SC 4.1.3 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)
- [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WAI-ARIA APG — Providing Accessible Names and Descriptions](https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/)
- [W3C — Using ARIA (First Rule of ARIA)](https://www.w3.org/TR/using-aria/)
- [Deque — axe-core rule descriptions](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [Google — Lighthouse Accessibility scoring](https://developer.chrome.com/docs/lighthouse/accessibility/scoring)
- [WebAIM — WCAG 2 Checklist](https://webaim.org/standards/wcag/checklist)
- [WebAIM — Keyboard Accessibility](https://webaim.org/techniques/keyboard/)
- [Apple HIG — Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [Material Design 3 — Accessibility](https://m3.material.io/foundations/overview/principles)
