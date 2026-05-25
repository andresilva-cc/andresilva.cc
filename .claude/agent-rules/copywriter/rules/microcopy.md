# Copywriting Rules — Microcopy

**Read on-demand when the task involves the small functional text inside an interface — button labels, form labels, placeholders, tooltips, helper text, hint text, character counts, or section captions.**

This domain governs interface text that sits *on* a control. Error and empty-state copy is in `error-and-empty-states.md`; grammar and punctuation are in `mechanics.md`; universal writing craft is in `_shared/rules/copy-craft.md`.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

---

## Buttons and calls to action

### Rule: Start button labels with an imperative verb
**Applies to:** All buttons, primary and secondary; menu items that perform an action; CTAs.
**Why:** "Create mapping", "Save changes", "Send invite" tell the user the outcome of the click. Noun-only labels ("New mapping") and generic labels ("OK", "Submit", "Done", "Go") force the user to infer the result from surrounding context. The verb is the label's job — front it.

### Rule: Button label names the action, not the system response
**Applies to:** Action buttons in forms, dialogs, and toolbars.
**Why:** Label the button for what the user is doing — "Delete project", not "Are you sure?". "Submit" describes what the form does; "Send invoice" describes what the user accomplishes. NN/g classifies button labels as *interaction* microcopy: they must predict the outcome.

### Rule: Match the button verb to the action verb in the surrounding copy
**Applies to:** Dialogs, confirmation prompts, onboarding steps.
**Why:** If the heading says "Discard this draft?", the confirm button says "Discard draft" — not "Yes" or "Confirm". Echoing the verb removes the round-trip the user otherwise makes to re-read the question. Yes/No buttons force that round-trip every time.

### Rule: Keep button labels to 1–3 words; never wrap to two lines
**Numeric baseline:** 1–3 words; ~25 characters as a practical ceiling. One word for primary actions where the verb alone is unambiguous in context.
**Applies to:** All buttons.
**Why:** A button is scanned, not read. Long labels ("Click here to create your first mapping now") dilute the verb and break layout at narrow widths. If the label needs more than three words, the missing context belongs in helper text or the heading, not the button.

### Rule: One primary CTA label per screen; secondary actions are visibly softer in wording
**Applies to:** Screens with multiple actions.
**Why:** The primary action gets the strong, specific verb ("Start free trial"); secondary actions get plainer wording ("Maybe later", "Skip for now"). Two equally assertive labels create a decision the layout should have resolved.

### Rule: Destructive button labels name the consequence explicitly
**Applies to:** Delete, remove, cancel-subscription, reset, revoke actions.
**Why:** "Delete account permanently" beats "Delete" beats "OK" for an irreversible action. The label is the last checkpoint before data loss — it must state what is lost and that it is permanent when it is.

### Rule: A trailing ellipsis on a button signals "opens a follow-up step"
**Applies to:** Buttons whose action opens a dialog or wizard for more input.
**Why:** Punctuation conventions for buttons are in `mechanics.md`; the load-bearing case here is that a trailing ellipsis on a button signals "opens a follow-up" (e.g. "Save as…", "Export…"). Use the `…` glyph, not three periods, and use it only with that meaning.

---

## Form labels

### Rule: Every input has a visible, persistent text label
**Applies to:** All form fields.
**Why:** A placeholder is not a label — it vanishes on focus, fails contrast, and is lost to users who paused mid-form. The label must stay visible while the user types. NN/g and Polaris are both explicit: never replace the label with placeholder text.

### Rule: Form labels are concise nouns or noun phrases, not sentences or instructions
**Numeric baseline:** 1–3 words typical.
**Applies to:** Input labels, checkbox labels, radio labels, select labels.
**Why:** "Email" beats "Your email address"; "Workspace name" beats "What should we call your workspace?". The label names the field; instructions and constraints go in helper text. Checkbox and radio labels are the exception when phrasing as a statement is clearer ("Email me product updates").

### Rule: Mark which fields are optional, not which are required, when most are required
**Applies to:** Forms where the majority of fields are mandatory.
**Why:** Tagging every required field with "(required)" clutters the form; tag the rarer case instead. If most fields are optional, invert it. Use a word — "(optional)" — not only an asterisk, which has no meaning to screen-reader users without explanation.

### Rule: Use sentence case for labels, not Title Case or ALL CAPS
**Applies to:** Field labels, section headings, button labels.
**Why:** Sentence case ("Billing address") reads faster than Title Case ("Billing Address") and is the dominant modern convention (Mailchimp, Polaris, Apple, Material default to it). Reserve any caps treatment for genuine proper nouns.

---

## Placeholders and hint text

### Rule: Placeholder text shows a format example, never an instruction
**Applies to:** Text inputs where the expected format is non-obvious — dates, phone numbers, IDs, URLs, codes.
**Why:** Good placeholder: `mm/dd/yyyy`, `name@company.com`, `+1 555 000 0000`. Bad placeholder: "Enter your date of birth" — that duplicates the label and disappears on focus. NN/g's *interact* category defines placeholder text as a format hint, not guidance.

### Rule: Don't put required information only in a placeholder
**Applies to:** Any field whose format constraint matters for validation.
**Why:** Placeholder text disappears the moment the user focuses the field, and is dropped entirely by many screen readers. A constraint the user must satisfy ("8+ characters") belongs in persistent helper text, not a placeholder.

### Rule: Leave the placeholder empty when no example adds information
**Applies to:** Free-text fields with no meaningful format — name, company, message body.
**Why:** A placeholder that just restates the label ("Name" inside the Name field) is visual noise and a contrast liability. If there is no useful example to show, show nothing.

### Rule: Flag under-contrasted placeholders to the designer
**Applies to:** Placeholder text that carries information.
**Why:** Placeholder text carrying information must be readable — if the visual treatment dims it below the AA contrast floor, flag it to the designer rather than accepting unreadable copy. See ui-ux-designer `color.md` for the contrast spec.

---

## Helper text and hint text

### Rule: Helper text answers the silent question the user asks before typing
**Applies to:** Fields with a non-obvious constraint, purpose, or consequence — passwords, usernames, billing fields, anything with validation rules.
**Why:** Helper text below a field is the place for "why do you need this?", "what format?", "what happens next?". It is persistent (unlike a placeholder) and visible before the user errs (unlike an error message). Put the rule here so the user succeeds on the first try.

### Rule: State format and constraints before the user types, not after they fail
**Applies to:** Password rules, length limits, allowed characters, file-type and size limits.
**Why:** "8+ characters, including a number" shown as helper text prevents the error; the same text shown only as a post-submit error is a worse experience. Prevention-focused microcopy is a core Polaris principle.

### Rule: Helper text is one short sentence or a fragment — not a paragraph
**Numeric baseline:** ≤ ~100 characters; one line where possible.
**Applies to:** All field-level helper text.
**Why:** Helper text competes with the field for attention. If the explanation needs a paragraph, the field design or the feature is too complex — escalate that, don't write a paragraph of microcopy.

### Rule: Don't narrate what the layout already shows
**Applies to:** Hint text near inputs and buttons.
**Why:** "Enter your email in the box below" is redundant when the box is below and labeled "Email". The interface carries spatial meaning; microcopy should add information the screen doesn't already convey.

---

## Tooltips

### Rule: A tooltip answers "what does this do?" in one sentence
**Numeric baseline:** One sentence; ~1–2 lines.
**Applies to:** Icon-only buttons, abbreviated controls, unfamiliar terms, ambiguous settings.
**Why:** Tooltips are *inform* microcopy — they clarify in context. They are not a place for paragraphs, marketing, or multi-step instructions. If a control needs more than a sentence to explain, the control or its label is the problem.

### Rule: Every icon-only control has a tooltip and an accessible name
**Applies to:** Toolbar icons, icon buttons, control affordances with no visible text.
**Why:** A bare icon is ambiguous to sighted users and invisible to screen-reader users. The tooltip serves the first group; an `aria-label` (see `accessibility-copy.md`) serves the second. Both are required, and they should say the same thing.

### Rule: Don't hide essential information in a tooltip
**Applies to:** Constraints, consequences, and instructions a user must have to complete a task.
**Why:** Tooltips are hover- or focus-gated and invisible on touch devices until tapped. Anything the user *must* read to succeed belongs in persistent helper text, not a tooltip. Reserve tooltips for supplementary clarification.

---

## Consistency across the surface

### Rule: One label for one action, everywhere in the product
**Applies to:** Buttons, menu items, links that trigger the same action.
**Why:** If deleting is "Delete" on one screen and "Remove" on another, users assume the two do different things. Pick one verb per action and one term per object, then never vary them. Consistency is one of the three core UX-writing techniques (clarity, conciseness, consistency).

### Rule: Number formats, date formats, and units are uniform across all microcopy
**Applies to:** Counts, prices, dates, durations, file sizes shown in labels and helper text.
**Why:** "5 items" / "5 Items" / "five items" on three screens reads as three different systems. Lock the format once (see `mechanics.md`) and apply it everywhere.

---

## Sources

- [Nielsen Norman Group — The 3 I's of Microcopy: Inform, Influence, Interact](https://www.nngroup.com/articles/3-is-of-microcopy/)
- [Nielsen Norman Group — UX Writing: Study Guide](https://www.nngroup.com/articles/ux-writing-study-guide/)
- [Nielsen Norman Group — UI Copy: UX Guidelines for Command Names and Keyboard Shortcuts](https://www.nngroup.com/articles/ui-copy/)
- [Nielsen Norman Group — Placeholders in Form Fields Are Harmful](https://www.nngroup.com/articles/form-design-placeholders/)
- [Shopify Polaris — Actionable language](https://polaris.shopify.com/foundations/content/actionable-language)
- [Shopify Polaris — Voice and tone](https://polaris.shopify.com/content/voice-and-tone)
- [Mailchimp Content Style Guide — Grammar and Mechanics](https://styleguide.mailchimp.com/grammar-and-mechanics/)
- [Torrey Podmajersky — Strategic Writing for UX (O'Reilly, 2nd ed.)](https://www.oreilly.com/library/view/strategic-writing-for/9781492049388/)
