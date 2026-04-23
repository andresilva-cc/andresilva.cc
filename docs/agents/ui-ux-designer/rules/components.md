# UI Design Rules — Component Patterns

**Read on-demand when the task involves a specific component: buttons, forms, inputs, modals, dialogs, toasts, loading states, empty states, error states, tables, navigation, tooltips, or popovers.**

This file covers component-level patterns. Motion/typography/color/spacing universals live in their own files — only component-specific rules are here.

---

## Buttons

### Rule: Touch targets ≥ 24×24 (AA) / ≥ 44×44 (touch primary)
**Numeric baseline:** 24×24 CSS px minimum, 44×44 for touch primary.
**Applies to:** All buttons.
**Why:** WCAG 2.5.8 + iOS HIG. Hit area can exceed visual via `::before` pseudo-element when visual compactness matters.

### Rule: Icon-only buttons must have an accessible name
**Applies to:** Icon-only, close, menu, and utility buttons.
**Why:** Screen readers cannot announce an icon. Use `aria-label` or `aria-labelledby` — an unlabeled icon button is invisible to assistive tech.

### Rule: Confirmation buttons use specific labels, not Yes/No
**Applies to:** Confirm dialogs, destructive actions, save/discard choices.
**Why:** Scannable labels let users decide without re-reading the prompt. "Delete file" / "Keep file" beats "Yes" / "No" — which forces context re-parsing.

### Rule: One primary button per context
**Numeric baseline:** 1 primary per view or dialog. Everything else secondary/tertiary.
**Applies to:** Forms, toolbars, action bars, dialogs.
**Why:** Competing primaries diffuse attention. Hierarchy requires one winner.

### Rule: Destructive buttons use a danger color AND require confirmation for irreversible actions
**Applies to:** Delete, remove, archive, discard-unsaved-changes.
**Why:** Speed-bump proportional to consequence. Red + confirm catches fat-finger mistakes.

### Rule: Loading buttons preserve width and show a spinner, disabled during async work
**Applies to:** Any button triggering async work.
**Why:** Prevents CLS (width jumping as label changes) and double-submit.

### Rule: Buttons feel responsive to press — subtle scale on `:active`
**Numeric baseline:** `transform: scale(0.97)` on `:active`; range 0.95–0.98; `transition: transform 160ms ease-out`.
**Applies to:** Buttons, toggles, tappable cards.
**Why:** Mimics physical button press, confirms input received. Buttons that don't depress feel dead — users re-click.

### Rule: Dialog button order follows platform convention
**Applies to:** OK/Cancel, Confirm/Cancel pairs.
**Why:** Apple / Material: affirmative right, cancel left. Historical Windows: OK left, Cancel right. Match the target platform; consistency beats personal preference.

### Rule: Don't animate keyboard-initiated actions that run 100+ times per day
**Applies to:** Command palettes, keyboard shortcuts, rapid-fire inputs.
**Why:** Power users' perceived speed is set by the animation, not the underlying work. Every ms of animation is a tax paid per keystroke.

---

## Forms + inputs

### Rule: Every input has a visible label — never placeholder-as-label
**Applies to:** All form fields.
**Why:** WCAG 3.3.2. Placeholder disappears on focus; screen readers often skip placeholders; grey placeholder often fails contrast. Floating labels have a cognitive cost on re-entry — use static labels by default.

### Rule: Label spacing makes the label "belong" to its input
**Numeric baseline:** Margin below label < margin below input.
**Applies to:** All form groups.
**Why:** Gestalt proximity. Equal spacing ambiguates which label belongs to which input.

### Rule: Field width signals expected content length
**Numeric baseline:** ZIP ≈ 5–7 chars wide; full name ≈ 30+ chars wide.
**Applies to:** All text inputs.
**Why:** A 400px-wide ZIP code field reads as "free-form text"; a 60px field tells the user "a few characters go here."

### Rule: Top-aligned labels yield fastest completion for familiar data
**Applies to:** Consumer forms, sign-up, checkout.
**Why:** Top labels collapse to a single eye fixation. Left-aligned is slowest per Wroblewski eye-tracking. Right-aligned acceptable for dense enterprise forms tolerating longer completion.

### Rule: Error messages anchor to the offending field and stay visible
**Applies to:** All form validation.
**Why:** WCAG 3.3.1 + 3.3.3. Distant error summaries force users to memorize and re-find the field. Text-only errors (not just red border / tooltip) ensure screen-reader and colorblind accessibility.

### Rule: Preserve user input on error — never wipe the form
**Applies to:** All form submissions (password fields exempted when required by security).
**Why:** Clearing input on validation failure is hostile. Users edit, don't restart.

### Rule: Mark required fields OR optional fields — never both, never neither
**Numeric baseline:** Asterisk `*` is the conventional required marker.
**Applies to:** Any form with a mix of required and optional fields.
**Why:** Either convention is valid; the sin is ambiguity. Pick one per form. Login forms can skip markers since both fields are obviously required.

### Rule: Validate on blur OR on submit — never per keystroke
**Applies to:** All form validation.
**Why:** Per-keystroke validation creates "typed one character, already an error" frustration. On-blur (as-you-go) vs on-submit (batched) is a taste choice; keystroke-level is universally rejected.

### Rule: Password fields offer a show/hide toggle
**Numeric baseline:** Default hidden on desktop, default visible on mobile (per NN/g).
**Applies to:** All password entry.
**Why:** Masked passwords increase typo rates. Toggle must be a real `<button>`, keyboard-operable, with `aria-pressed` or `role="switch"`.

---

## Modals + dialogs

### Rule: Modals trap focus
**Applies to:** All modal dialogs.
**Why:** WAI-ARIA APG. Tab and Shift+Tab cycle within the dialog; Tab wraps to first focusable, Shift+Tab wraps backward. Without this, keyboard users tab to content hidden behind the overlay.

### Rule: Initial focus moves into the dialog on open
**Applies to:** All modals.
**Why:** Without this, keyboard and screen-reader users don't know the dialog exists. Focus the first interactive element, or the dialog container with a label.

### Rule: Escape closes the dialog and returns focus to the trigger
**Applies to:** All modals and popovers.
**Why:** Without return-focus, keyboard users are dropped at the top of the page. Esc is the expected dismiss — overriding it violates Jakob's Law.

### Rule: Modals declare themselves with `aria-modal` + `aria-labelledby` / `aria-describedby`
**Applies to:** All modal dialogs.
**Why:** Screen readers use these attributes to announce the dialog's existence, title, and purpose. Radix Dialog, shadcn, and WAI-ARIA APG all enforce this.

### Rule: Modal enters with `scale(0.95)` + opacity, `transform-origin: center`
**Numeric baseline:** 200–300ms entry (up to 500ms for full-screen / route-like); `transform-origin: center` for modals, trigger-origin for popovers.
**Applies to:** Centered modals vs. popovers.
**Why:** Popovers scaling from their trigger feel physically attached; modals scaling from center feel authoritative. Exits ~20% faster.

---

## Toasts + notifications

### Rule: Toasts must be user-dismissible
**Applies to:** All toast / snackbar notifications.
**Why:** WCAG 1.4.13 requires a dismissal mechanism independent of focus. Users with cognitive disabilities or slow reading speeds need control.

### Rule: Success toasts 3–5s; errors stay longer or persist
**Numeric baseline:** Success/info 3–5s; errors ≥8s or until dismissed.
**Applies to:** All transient notifications.
**Why:** Reading time for ~10 words is 3–4s. Errors carry recovery information and must not vanish before reading.

### Rule: One pattern per severity — toast OR inline banner, not both
**Applies to:** Cross-product consistency.
**Why:** Mixing patterns for the same severity creates ambiguity. Pick toast for transient feedback OR inline banner for persistent — don't mix.

### Rule: Toast position follows platform convention
**Numeric baseline:** Bottom-center (Material / mobile); top-right (desktop web / shadcn/sonner); top-center (iOS banners).
**Applies to:** All toast placement.
**Why:** Match the user's platform. On web, be consistent across the whole app.

---

## Loading states

### Rule: Respond within 400ms or show a loading state
**Numeric baseline:** <400ms feels instant; 400ms is the Doherty flow threshold.
**Applies to:** All user-initiated actions.
**Why:** Below 400ms the user stays in "action mode"; above it they break flow into "wait mode."

### Rule: Choose indicator by expected duration
**Numeric baseline:** <1s nothing; 1–2s subtle indicator; 2–10s spinner; 10s+ determinate progress with percentage.
**Applies to:** All async UI.
**Why:** A spinner for 30s is anxiety-inducing; a progress bar for 500ms is overkill.

### Rule: Skeletons mimic actual page structure
**Applies to:** Full-page or panel-level loads under 10s.
**Why:** Skeletons reduce cognitive load by previewing structure. Generic frame-display skeletons are no better than a spinner.

### Rule: Delay showing the indicator ~400ms, then hold ≥300–500ms if shown
**Applies to:** All loading indicators.
**Why:** Showing a spinner for 80ms reads as a glitch; showing one for 200ms makes fast things feel slow.

### Rule: Preserve layout during load — no jank when content arrives
**Numeric baseline:** CLS < 0.1 (Web Vitals).
**Applies to:** All content-loading patterns.
**Why:** Layout shift moves click targets mid-interaction. Users miss or misclick.

### Rule: Avoid static "Loading..." text — use animation or percent-done
**Applies to:** Long operations.
**Why:** Static text can't distinguish "still working" from "hung."

---

## Empty states

### Rule: Empty states must be actionable, not just informational
**Applies to:** All empty states (lists, search results, feature zero-data).
**Why:** First-time empty state is the user's first interaction with a feature — teach and invite. Link to the CTA that populates it.

### Rule: Distinguish first-run empty state from filtered-zero-result
**Applies to:** Lists, search, filtered views.
**Why:** First-run: "Create your first item." Zero-result: "No matches — try different filters." These are different messages with different fixes.

### Rule: Never flash empty state before loading resolves
**Applies to:** Async-loaded lists and feeds.
**Why:** A premature "No data" before the fetch resolves is a lie. Loading state must always check-then-show.

---

## Error states

### Rule: Error messages explain what, why, and how to fix — in plain language
**Numeric baseline:** 7–8th grade reading level (Flesch-Kincaid).
**Applies to:** All user-facing errors.
**Why:** WCAG 3.3.3. "Invalid input" is useless; "Phone number must be 10 digits" is actionable. No error codes.

### Rule: Don't blame the user in error copy
**Applies to:** All error messaging.
**Why:** Avoid words like *invalid*, *illegal*, *incorrect*. Errors highlight flaws in the design, not user failure. Blame creates frustration.

### Rule: Error indicators must not rely on color alone
**Applies to:** Field errors, form validation, system errors.
**Why:** WCAG 1.4.1. Combine red + icon + text. ~8% of men cannot distinguish red from neighboring colors.

### Rule: Provide retry affordances for recoverable failures
**Applies to:** Network errors, rate limits, transient failures.
**Why:** Transient errors are often fixable by retry. A retry button beats a trip through the back button.

### Rule: Don't show errors prematurely — let users explore before validating
**Applies to:** Field validation timing.
**Why:** "Required field" before the user types is adversarial. Validate on-blur or on-submit per the forms rule.

---

## Data tables + lists

### Rule: Numeric columns use `font-variant-numeric: tabular-nums`
**Applies to:** Price columns, stats dashboards, timers, analytics tables, totals rows.
**Why:** Proportional digits misalign vertically — a "1" is narrower than a "5" — making scan-comparison impossible.

### Rule: Sticky headers on scrollable tables preserve column context
**Numeric baseline:** `position: sticky; top: 0; z-index: 2` on `<th>`.
**Applies to:** Dense or long data tables.
**Why:** Without sticky headers, users scrolling a 100-row table forget which column is which.

### Rule: Pagination vs infinite scroll — task-dependent, pick one per view
**Applies to:** Long lists.
**Why:** Infinite scroll suits entertainment/news/social where users browse; pagination suits comparison/specific-find tasks and preserves footer + return-to-item. Mixing in one surface confuses users.

### Rule: Empty cells use an em dash (—), not blank or "N/A"
**Numeric baseline:** Em dash `—` (U+2014).
**Applies to:** Data grids, dashboards, reports.
**Why:** Blank cells read as "loading" or "broken." Em dash reads as "intentionally empty."

---

## Navigation

### Rule: Breadcrumbs show hierarchical location, not session history — current page is not a link
**Applies to:** Breadcrumb trails.
**Why:** Breadcrumbs answer "where am I?" — a history-based trail answers a different question. The current page should be plain text, not a link.

### Rule: Navigation is consistent across pages
**Applies to:** All top-level nav, sidebars, footers.
**Why:** WCAG 3.2.3. Users build spatial mental models; moving nav breaks those models. Repeated components maintain location and order.

### Rule: Mobile nav pattern — bottom tab bar for ≤5 top-level items; hamburger otherwise
**Numeric baseline:** 3–5 tabs.
**Applies to:** Mobile apps, mobile web.
**Why:** Bottom tabs are thumb-reachable and always-visible; hamburger hides destinations, hurting discoverability. Serial Position Effect: place the most-used and most-differentiating items at first/last positions.

### Rule: Keyboard focus must not be obscured by sticky headers/footers
**Applies to:** All sticky chrome.
**Why:** WCAG 2.4.11. Sticky elements that cover the focused input make keyboard use impossible. Scroll focused elements into visible viewport.

---

## Tooltips + popovers

### Rule: Tooltips dismiss on Escape and don't disappear while hovered
**Applies to:** All tooltip implementations.
**Why:** WCAG 1.4.13. Low-vision users who zoom must be able to move the cursor onto the tooltip without losing it. Require dismiss, hoverable, persistent.

### Rule: Tooltips must not contain essential information
**Applies to:** Tooltip content design.
**Why:** Tooltips don't work on touch. Hiding required info there excludes mobile users. Use tooltips for supplementary labels, affordance hints, or help — never for required instructions.

### Rule: Tooltip hover delay 300–500ms before showing
**Numeric baseline:** 300ms (PatternFly, ServiceNow, Baymard lower bound) or 500ms (GitLab Pajamas).
**Applies to:** Hover-triggered tooltips.
**Why:** Immediate tooltips flicker as the cursor crosses boundaries. Delay confirms intent. Focus-triggered tooltips should be immediate (keyboard users deliberately focused).

### Rule: Skip delay on subsequent tooltips within a group
**Numeric baseline:** `transition-duration: 0ms` after first tooltip in a group.
**Applies to:** Toolbars, row-action icons, tooltip-heavy UIs.
**Why:** Once the user has shown tooltip intent, re-delaying for adjacent items makes the UI feel slow.

### Rule: Popovers scale from `transform-origin` at trigger point
**Numeric baseline:** `transform-origin: var(--radix-popover-content-transform-origin)`.
**Applies to:** Popovers, dropdown menus, context menus.
**Why:** A popover scaling from its own center looks detached; scaling from the trigger feels attached. Motion communicates location relationship.

---

## Sources

- [W3C — WCAG 2.2 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
- [W3C — WCAG 2.2 1.4.13 Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)
- [W3C — WCAG 2.2 2.4.11 Focus Not Obscured (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)
- [W3C — WCAG 2.2 3.2.3 Consistent Navigation](https://www.w3.org/WAI/WCAG22/Understanding/consistent-navigation.html)
- [W3C — WCAG 2.2 3.3.1 Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html)
- [W3C — WCAG 2.2 3.3.2 Labels or Instructions](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html)
- [W3C — WCAG 2.2 3.3.3 Error Suggestion](https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html)
- [WAI-ARIA APG — Dialog Modal](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [WAI-ARIA APG — Tooltip](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/)
- [WAI-ARIA APG — Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- [Apple HIG — Alerts](https://developer.apple.com/design/human-interface-guidelines/alerts)
- [Apple HIG — Tab Bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)
- [Apple HIG — Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)
- [Material Design 3 — Buttons](https://m3.material.io/components/buttons/guidelines)
- [Material Design 3 — Dialogs](https://m3.material.io/components/dialogs/guidelines)
- [Material Design 3 — Snackbar](https://m3.material.io/components/snackbar/guidelines)
- [Material Design 3 — Navigation Bar](https://m3.material.io/components/navigation-bar/guidelines)
- [Radix UI — Dialog](https://www.radix-ui.com/primitives/docs/components/dialog)
- [Radix UI — Popover](https://www.radix-ui.com/primitives/docs/components/popover)
- [shadcn/ui — Button](https://ui.shadcn.com/docs/components/button)
- [shadcn/ui — Sonner](https://ui.shadcn.com/docs/components/sonner)
- [Vercel Geist — Button](https://vercel.com/geist/button)
- [Luke Wroblewski — Top, Right or Left Aligned Form Labels](https://www.lukew.com/ff/entry.asp?504=)
- [Luke Wroblewski — Web Form Design](https://www.lukew.com/resources/web_form_design.asp)
- [Adam Silver — Form Design: From Zero to Hero](https://adamsilver.io/articles/form-design-from-zero-to-hero-all-in-one-blog-post/)
- [Emil Kowalski — Agents with Taste](https://emilkowal.ski/ui/agents-with-taste)
- [NN/g — 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/)
- [NN/g — Response Times: The 3 Important Limits](https://www.nngroup.com/articles/response-times-3-important-limits/)
- [NN/g — Progress Indicators](https://www.nngroup.com/articles/progress-indicators/)
- [NN/g — Skeleton Screens](https://www.nngroup.com/articles/skeleton-screens/)
- [NN/g — Empty State Interface Design](https://www.nngroup.com/articles/empty-state-interface-design/)
- [NN/g — Error Message Guidelines](https://www.nngroup.com/articles/error-message-guidelines/)
- [NN/g — Form Error Guidelines](https://www.nngroup.com/articles/errors-forms-design-guidelines/)
- [NN/g — Form Design White Space](https://www.nngroup.com/articles/form-design-white-space/)
- [NN/g — Required Fields](https://www.nngroup.com/articles/required-fields/)
- [NN/g — Confirmation Dialogs](https://www.nngroup.com/articles/confirmation-dialog/)
- [NN/g — Password Creation](https://www.nngroup.com/articles/password-creation/)
- [NN/g — Tooltip Guidelines](https://www.nngroup.com/articles/tooltip-guidelines/)
- [NN/g — Breadcrumbs](https://www.nngroup.com/articles/breadcrumbs/)
- [NN/g — Infinite Scrolling Tips](https://www.nngroup.com/articles/infinite-scrolling-tips/)
- [Laws of UX — Doherty Threshold](https://lawsofux.com/doherty-threshold/)
- [Laws of UX — Serial Position Effect](https://lawsofux.com/serial-position-effect/)
- [Baymard — Dropdown Hover Delay](https://baymard.com/blog/dropdown-menu-flickering-issue)
- [MDN — font-variant-numeric](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric)
