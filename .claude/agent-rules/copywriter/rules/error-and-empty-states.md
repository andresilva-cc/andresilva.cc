# Copywriting Rules — Error and Empty States

**Read on-demand when the task involves error messages, validation messages, empty states, zero-data states, confirmation dialogs, or any copy shown when something failed, is missing, or needs the user to confirm.**

This domain governs the copy on a product's failure, blank, and decision paths. General microcopy is in `microcopy.md`; grammar is in `mechanics.md`; the principle "don't perform emotion the reader isn't feeling" is in `_shared/rules/copy-craft.md`.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

---

## Error message structure

### Rule: An error message states what happened and what to do next — in that order
**Applies to:** All error messages: inline, banner, toast, full-page.
**Why:** The user needs two things: to understand the failure and to recover from it. "Card declined. Try another payment method or contact your bank." does both. A message that only states the problem ("Payment failed") leaves the user stuck; one that only gives a fix without the cause is confusing. Cause then recovery — every time.

### Rule: Be specific — name the field, value, limit, or item that caused the error
**Applies to:** Validation errors, quota errors, conflict errors.
**Why:** "File too large. Maximum size is 25 MB; this file is 31 MB." beats "Invalid file". Specific numbers, dates, and names let the user fix the exact problem. Polaris names specificity — exact user-facing values, not generic language — as a core error-message requirement.

### Rule: Never ship "Something went wrong" or "An error occurred" as the whole message
**Applies to:** Generic catch-all errors.
**Why:** A bare generic error gives the user nothing to act on. If the true cause is genuinely unknown, still give a recovery path ("We couldn't load your projects. Refresh the page, or try again in a few minutes.") and, where useful, an error reference code for support. Polaris explicitly lists "Something went wrong" as a phrasing to avoid.

### Rule: Write errors in plain language — no error codes, stack terms, or "invalid" as the user-facing word
**Applies to:** All user-facing error copy.
**Why:** "Invalid", "null", "exception", "400", "malformed" are system vocabulary. The user reads "That email address is missing an @ symbol", not "Invalid input". A raw code may accompany the plain message for support reference, but never replace it.

### Rule: Don't blame the user; don't over-apologize either
**Applies to:** All error copy.
**Why:** "You entered the wrong password" assigns fault; "That password doesn't match — try again or reset it" stays neutral and actionable. Equally, avoid a pile of "Sorry, we're so sorry" — Polaris warns against over-apologizing and overusing "please". Apologize once, briefly, only when the product genuinely failed.

### Rule: Keep the system out of it unless the system caused the error
**Applies to:** Error attribution and tone.
**Why:** Use "we" only when the product is at fault ("We couldn't reach the server"). For a user-side input problem, address the fix without "we" ("Enter a valid ZIP code"). Misattributing a user error to the system, or a system error to the user, both erode trust.

### Rule: Don't use humor, exclamation marks, or forced cheer in error copy
**Applies to:** Error messages, especially blocking ones — failed payments, lost data, locked accounts.
**Why:** "Oops! 🙈" trivializes a real problem the user is now stuck on. The user is frustrated; matching that with jokes reads as tone-deaf. Stay calm, plain, and helpful. Save personality for unblocked, low-stakes moments.

---

## Validation messages

### Rule: Inline validation messages follow "[what's wrong]. [how to fix it]."
**Applies to:** Field-level validation shown next to an input.
**Why:** "Password must be at least 8 characters. Add 2 more." — the problem, then the fix. The field is already identified by its position, so the message itself can drop the field name and lead straight with the problem.

### Rule: Prevent the error first — show the rule as helper text before validating
**Applies to:** Any field with format or length constraints.
**Why:** The best validation message is the one never shown. State "8+ characters, 1 number" as helper text (see `microcopy.md`) so most users never trip the rule. Validation copy is the fallback, not the primary channel for constraints.

### Rule: Flag per-keystroke validation to the designer
**Applies to:** Forms where validation behavior is being decided.
**Why:** If the design validates per-keystroke, flag it to the designer — copy that's correct but mistimed reads as nagging. (See ui-ux-designer `components.md`.)

### Rule: Confirm success for non-obvious successful actions, briefly
**Applies to:** Saved settings, sent messages, completed background actions with no visible result.
**Why:** "Changes saved" closes the loop when the result isn't visible on screen. Keep it short and drop it after a moment — a success toast that lingers becomes clutter. Skip it entirely when the result is self-evident.

---

## Empty states

### Rule: An empty state explains what belongs here and gives one clear path to fill it
**Applies to:** Zero-data lists, tables, dashboards, search results, first-run screens.
**Why:** A blank area with no copy reads as broken. An empty state turns "there's nothing here" into "here's what this is and how to start": a short heading naming the content, one line of explanation, and a primary action. Polaris frames the empty state as an opportunity to guide, not an error.

### Rule: Distinguish first-use empty states from no-results and cleared-out states
**Applies to:** Any surface that can be empty for more than one reason.
**Why:** First use → onboard ("Create your first mapping to start syncing."). No search results → suggest a fix ("No results for 'xyz'. Check spelling or try a broader term."). User cleared everything → acknowledge it ("All caught up — no pending tasks."). Same blank screen, three different jobs; the copy must match the cause.

### Rule: The empty-state action verb matches the thing being created
**Applies to:** The primary CTA in an empty state.
**Why:** If the area holds mappings, the button says "Create mapping" — not "Get started" or "Add". The verb plus the noun tells the user exactly what the click produces (see `microcopy.md` button rules).

### Rule: Keep empty-state copy encouraging and brief — heading plus one or two lines
**Numeric baseline:** Heading ≤ ~6 words; body ≤ 2 short sentences.
**Applies to:** All empty-state body copy.
**Why:** An empty state is a nudge, not a tutorial. The tone is helpful and forward-looking ("No mappings yet — create one to start syncing"), not apologetic ("Sorry, nothing here"). Link to docs for depth instead of writing a paragraph.

---

## Confirmation dialogs

### Rule: A confirmation dialog states the specific consequence and whether it's reversible
**Applies to:** Dialogs before destructive or hard-to-undo actions.
**Why:** "Delete 'Q3 Report'? This permanently deletes the file and its 14 comments. This can't be undone." names the exact object, the full scope, and the irreversibility. "Are you sure?" tests nothing — the user clicks through it on autopilot.

### Rule: Confirmation buttons use action verbs, not "Yes"/"No"/"OK"/"Cancel" pairs
**Applies to:** Confirm and dismiss buttons in dialogs.
**Why:** Buttons should read "Delete file" / "Keep file", not "Yes" / "No". Verb buttons let the user confirm by reading the button alone, without re-parsing the question — and prevent the classic "Cancel the cancellation?" ambiguity.

### Rule: Don't put a confirmation dialog in front of an easily reversible action
**Applies to:** Decisions about whether a dialog is warranted at all — flag to design.
**Why:** Confirmation dialogs are interruption; overusing them trains users to dismiss them reflexively, which defeats the dialog that actually matters. Prefer an undo affordance for reversible actions and reserve the dialog for genuine, irreversible consequence.

### Rule: The dialog heading asks or states the decision; the body carries the detail
**Applies to:** Modal and inline confirmation copy.
**Why:** Heading: "Discard unsaved changes?" Body: "You've made edits to 3 fields. Discarding loses them." Splitting decision from detail lets a fast reader act on the heading and a careful reader get the full picture from the body.

---

## Sources

- [Shopify Polaris — Error messages](https://polaris.shopify.com/content/error-messages)
- [Shopify Polaris — Empty states](https://polaris.shopify.com/patterns/empty-states)
- [Nielsen Norman Group — Error-Message Guidelines](https://www.nngroup.com/articles/error-message-guidelines/)
- [Nielsen Norman Group — How to Report Errors in Forms: 10 Design Guidelines](https://www.nngroup.com/articles/errors-forms-design-guidelines/)
- [Nielsen Norman Group — Empty States in Application Design](https://www.nngroup.com/articles/empty-state-interface-design/)
- [Nielsen Norman Group — Confirmation Dialogs Can Prevent User Errors — If Not Overused](https://www.nngroup.com/articles/confirmation-dialog/)
- [Mailchimp Content Style Guide — Voice and Tone (error and failure messages)](https://styleguide.mailchimp.com/voice-and-tone/)
- [Torrey Podmajersky — Strategic Writing for UX (O'Reilly, 2nd ed.)](https://www.oreilly.com/library/view/strategic-writing-for/9781492049388/)
