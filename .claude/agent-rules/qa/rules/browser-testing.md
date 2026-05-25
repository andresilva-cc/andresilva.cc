# QA Rules — Browser Testing Protocol

**Read on-demand when the phase under test includes any UI work — pages, components, forms, navigation, responsive layout — and you need to verify it in a real browser via the Chrome DevTools MCP.**

This is the procedural checklist for hands-on UI verification: drive the app, exercise every flow, watch the console and network, and check responsive and accessible behavior. It complements `oracles.md` (how to judge what you see) and `_shared/rules/accessibility.md` (the WCAG criteria to audit against).

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

---

## Ground rules

- **Code-level verification is not a substitute for running the UI.** Tracing a flow through the code proves it is *wired*; it does not prove it *works*. A flow that compiles and has passing unit tests can still render broken, throw at runtime, or 500 on a real request. Drive the actual browser.
- **If the Chrome DevTools MCP is unavailable**, fall back to code-level verification — trace each flow, confirm routes/components/API calls are wired — and state explicitly in the report that visual testing was skipped. Never silently pretend a flow was visually verified.
- **Observe, do not assume.** For every step, record what you *saw* versus what was *expected*. "Should work" is not an observation.
- **Console and network are non-negotiable checks.** A page can look perfect and be logging errors or firing failed requests on every interaction.

---

## Setup

### Rule: Start the app and confirm it is actually serving before testing
**Applies to:** Every browser-testing session.
**How:** Start the dev server via Bash (`npm run dev` or the project's documented command) if it is not already running. Wait for the ready signal. Open the app with `mcp__chrome-devtools__new_page` (or `navigate_page` if a page exists). Confirm the page loads — a blank page or a connection error means stop and fix the environment before testing anything else.

### Rule: Take a baseline screenshot and console snapshot before interacting
**Applies to:** The first load of each major page.
**How:** `take_screenshot` for the initial render and `list_console_messages` immediately after load. Errors present *before* any interaction are environment or load-time bugs — separate them from interaction-triggered errors.

---

## Per-flow verification

### Rule: Walk every user-facing flow in the product spec end to end
**Applies to:** Each flow the spec describes that the phase touches.
**How:** For each flow, drive it as a real user would:
1. Navigate with `navigate_page` and `click`; inspect structure with `take_snapshot` (the accessibility tree — also your a11y reference).
2. Fill forms with `fill` / `fill_form`; submit with `click`.
3. `take_screenshot` at each meaningful state to verify layout and visible result.
4. After every interaction, run `list_console_messages` and `list_network_requests`.
5. Document observed vs. expected for each step.

### Rule: Verify the console is clean after every interaction
**Numeric baseline:** Zero uncaught errors; zero unexpected warnings.
**Applies to:** Every page load and every interaction.
**How:** `list_console_messages` after each step. Uncaught exceptions, failed assertions, React key/hydration warnings, and 404s for assets are defects — report them with the triggering action. A flow that "works" but throws to the console is not passing.

### Rule: Verify every network request the flow depends on
**Applies to:** Any flow that calls an API, loads data, submits a form, or fetches assets.
**How:** `list_network_requests` after the flow. Confirm: requests fire when expected, status codes are 2xx (or the intended error code for negative tests), no unintended duplicate requests (double-submit), no 4xx/5xx on the happy path, payloads carry the expected shape. Inspect a specific request with `get_network_request` when a status looks wrong.

### Rule: Test the unhappy path in the browser, harder than the happy path
**Applies to:** Every flow with input, auth, or navigation.
**How:** Exercise, at minimum: empty form submission; invalid inputs (bad email, out-of-range numbers, oversized text — apply boundary-value cases from `test-design-heuristics.md`); submitting required fields blank; navigating directly to a protected route while logged out; the browser back/forward buttons after a submit; refresh mid-flow; double-clicking submit. Confirm each fails *gracefully* — a clear message, no crash, no corrupt state, no silent data loss.

---

## Responsive verification

### Rule: Verify layout at mobile, tablet, and desktop breakpoints
**Numeric baseline:** Test at least 375px (mobile), 768px (tablet), and 1280–1440px (desktop). Add the project's own breakpoints if it defines them.
**Applies to:** Every page or component with responsive behavior.
**How:** `resize_page` to each width and `take_screenshot`. Use `emulate` for device profiles when touch behavior or device pixel ratio matters. Check for: horizontal scrollbars, clipped or overlapping content, text overflow, off-screen controls, collapsed/broken navigation, touch targets too small or too close (≥24×24 CSS px — see `_shared/rules/accessibility.md`).

### Rule: Verify both Reflow (320 CSS px) and Resize Text (200%) — they are separate WCAG criteria
**Numeric baseline:** 320 CSS px wide AND text resized to 200%.
**Applies to:** All page layouts.
**How:** Test **both** sub-checks; they exercise different criteria and are not interchangeable:
1. **SC 1.4.10 Reflow** — resize the viewport to 320 CSS px wide; confirm content reflows to a single column with no two-axis scrolling to read a line. Data tables and essential diagrams are the only exemptions.
2. **SC 1.4.4 Resize Text** — at the default viewport, zoom text to 200%; confirm no content is clipped, truncated, or overlapping, and no functionality is lost.

Pass = both. A layout can pass Reflow at 320 px and still fail Resize Text at 200% (and vice versa).

---

## Accessibility pass

### Rule: Run an automated accessibility audit on every key page
**Applies to:** Each significant page or view in the phase.
**How:** Run `lighthouse_audit` (accessibility category) on key pages. Treat the score as a *regression gate, not a sign-off* — automated tools catch less than half of WCAG issues; the majority require manual or screen-reader testing (per Deque and WebAIM analyses cited in Sources).

### Rule: Run a keyboard-only and accessibility-tree pass — automated audits are not enough
**Applies to:** Every interactive screen.
**How:** Tab through the page (`press_key` with Tab / Shift+Tab / Enter / Esc): confirm every control is reachable, focus is always visible, order is logical, nothing is trapped, modals manage focus. Inspect `take_snapshot` (the a11y tree) to confirm controls have accessible names, headings form a non-skipping hierarchy, and roles/states are correct. The full WCAG 2.2 AA criteria and the mandatory manual checks are in `_shared/rules/accessibility.md` — audit against that file; do not restate it here.

---

## Wrap-up

### Rule: Tie every browser observation back to an oracle and a report row
**Applies to:** The end of the browser-testing session.
**How:** Each anomaly — visual, console, network, responsive, a11y — becomes a row in the test report's Browser Testing Results table, with the flow, the result, and a screenshot reference. Judge each observation against the oracles in `oracles.md`; classify severity with `go-nogo-rubric.md`. Convert reproducible defects into permanent automated tests where the project's stack allows, so the regression cannot recur silently.

---

## Sources

- [Chrome DevTools MCP — tool reference](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- [web.dev — Lighthouse accessibility scoring](https://developer.chrome.com/docs/lighthouse/accessibility/scoring)
- [W3C — WCAG 2.2 SC 1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- [W3C — WCAG 2.2 SC 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [MDN — Responsive design and testing breakpoints](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [WebAIM — Keyboard Accessibility](https://webaim.org/techniques/keyboard/)
