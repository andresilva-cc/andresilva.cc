# UI Design Rules — Component Patterns

**Read on-demand when the task involves a specific component: buttons, forms, inputs, modals, dialogs, toasts, loading states, empty states, error states, tables, navigation, tooltips, or popovers.**

This file covers component-level patterns. Motion/typography/color/spacing universals live in their own files — only component-specific rules are here.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific design decisions (brand fonts, palette values, chosen breakpoints, component variants) belong in the project's own `design-system.md` and `ui-spec.md` — never here.

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

### Rule: Prefer undo over confirmation for reversible actions
**Numeric baseline:** Undo affordance visible for 5–10s after the action.
**Applies to:** Soft-delete, archive, dismiss, mark-as-read, toggle, reorder — anywhere restore is feasible.
**Why:** "Are you sure?" before every reversible action trains users to click through dialogs without reading — defeating the purpose. An immediate action + undo respects the common case (the user meant it) without losing recovery for the rare case. Reserve modal confirmation for irreversible destructive actions per the destructive-buttons rule; for those, type-the-name confirmation is stronger than click-OK.

### Rule: Disabled controls must communicate why
**Applies to:** Disabled submit buttons, locked menu items, gated actions.
**Why:** A disabled control without explanation is a dead end — users don't know if it's broken, gated by their plan, awaiting input, or temporarily unavailable. Use a tooltip on focus/hover, helper text near the control, or inline copy. For gated / not-yet-available controls, prefer `aria-disabled` over the native `disabled` attribute so the control remains focusable and the explanation is reachable by assistive tech. Use native `disabled` only when the control truly should not be interactive (e.g., a button mid-async per the loading-button rule).

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

### Rule: Primary CTAs default to full-width at mobile
**Numeric baseline:** `width: 100%` for primary (and any secondary sibling) CTAs below 768px.
**Applies to:** Primary call-to-action buttons on phone-sized viewports.
**Why:** Full-width matches the tap target to the column and reads as decisive — the modern mobile convention users are trained to expect. An intrinsic-width button left-aligned with empty space to its right reads as a desktop button shrunk down. Exception: editorial / technical / manifesto registers (research instrument, ledger, printed paper) where a consumer-app button would break the typographic discipline — there, keep intrinsic width but group the buttons in a row (`flex-direction: row; gap`) so the leftover space is shared whitespace, not asymmetric drift, and document the choice.

---

## Forms + inputs

### Rule: Every input has a visible label — never placeholder-as-label
**Applies to:** All form fields.
**Why:** WCAG 3.3.2. Placeholder disappears on focus; screen readers often skip placeholders; grey placeholder often fails contrast. Floating labels have a cognitive cost on re-entry — use static labels by default.

### Rule: Placeholders show format, not instruction
**Applies to:** All text inputs with a placeholder.
**Why:** The label tells the user what the field is; the placeholder shows what valid input looks like. "Enter your birth date" duplicates the label; "01 Jan 2026" shows the expected format. Placeholder-as-instruction wastes the affordance and disappears on focus when the user might need it most.

### Rule: Input height matches adjacent button height
**Numeric baseline:** One base height across inputs and buttons in the same form (≥44px for touch primary).
**Applies to:** Forms with inline buttons (search bars, login forms, inline-edit rows).
**Why:** Mismatched input and button heights (44px button next to a 38px input) read as untuned. A single base height aligns baselines and creates visual rhythm.

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

### Rule: Helper text reserves height so errors don't shift layout
**Numeric baseline:** `min-height: 1lh` on the helper-text slot, even when empty.
**Applies to:** All form fields with helper or error text below.
**Why:** A field that grows by one line when validation fails pushes the rest of the form down — buttons move under the cursor, layout shifts at the worst moment. Reserve the slot at render time so errors swap in place. CLS < 0.1 (Web Vitals) applies to forms too.

### Rule: Input state changes must not shift layout — border width stays constant
**Numeric baseline:** `border-width` is the same value (typically 1px) across default, hover, focus, error, and disabled. State changes go to `background-color`, `outline` (with `outline-offset`), or `box-shadow`.
**Applies to:** All text inputs, textareas, selects, and comboboxes.
**Why:** A 1px → 2px border on focus shifts the field's content box by 1px in every direction. Sibling fields stay put; the focused one jumps. Reserve focus-indicator space with `outline: 2px solid transparent` at rest so the ring appears at full strength on focus without geometry change.

### Rule: Don't disable a field to indicate loading — keep it editable with a spinner
**Applies to:** Async validation, debounced search, autocomplete fetches.
**Why:** A disabled field during async work locks the user out of fixing what they typed. Show an inline spinner in the field; keep the field editable; disable only the submit affordance if needed.

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

### Rule: Don't toast when the effect is already visible
**Applies to:** Success notifications for save, delete, toggle, like, and similar actions whose result is visible in the UI.
**Why:** A "Saved!" toast for a setting the user just changed (and can see is changed) adds noise without information. Reserve toasts for: (1) async actions whose effect is off-screen or delayed, (2) failures and errors, (3) actions the user will need to confirm later (e.g., "Invitation sent to 12 people"). When the result is on-screen, the result *is* the feedback.

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

## Media (images)

### Rule: Photos in fixed-aspect-ratio containers default to `object-fit: cover`
**Applies to:** An `<img>` inside a fixed-aspect-ratio container — gallery tile, archive card, lookbook frame, masthead photo.
**Why:** The container's aspect ratio is the page's compositional commitment; the photo should fill it. `object-fit: contain` letterboxes the image inside the card with the card background showing as margins, which reads as "the image didn't load fully," not as deliberate framing. Use `contain` only when the full frame *is* the point (product-on-white, technical illustration, archival scan, UI screenshot), and document the choice. (For serving the right resolution per viewport, see `responsive.md`.)

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

### Rule: Group the menu trigger (and secondary header items) with a sibling — don't `space-between` everything
**Applies to:** Three-element headers (brand + menu trigger + CTA) and headers carrying secondary items (version tag, breadcrumbs, eyebrow meta).
**Why:** `justify-content: space-between` across brand · trigger · CTA pushes the trigger into an empty middle band, reading as a control dropped at a coordinate rather than belonging to anything. Cluster it: left = brand (optionally + trigger), right = CTA (optionally + trigger) — the trigger should read as part of a navigation cluster. `space-between` on every element reads as "I didn't decide how to group these." (For keeping nav reachable and reflowing the header at mobile, see `responsive.md`.)

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
- [MDN — object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)
