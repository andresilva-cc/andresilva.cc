# Copywriting Rules — Accessibility Copy

**Read on-demand when the task involves alt text, ARIA labels, accessible names, screen-reader announcements, link text, captions, or reading-level targets — the copy that serves users of assistive technology.**

This domain governs text that is read aloud or surfaced to assistive tech rather than rendered visually. Visual microcopy is in `microcopy.md`; the WCAG contrast and color rules are in ui-ux-designer `color.md` and `typography.md`.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

---

## Alt text

### Rule: Write alt text that conveys the image's purpose, not just its appearance
**Applies to:** Informative images, photos, illustrations that carry meaning.
**Why:** Alt text answers "what does this image tell the user?" — match it to the image's job in context. The same photo of a laptop is "Acme dashboard showing 12% revenue growth" in a case study and "Open laptop on a desk" in a generic hero. Describe the function, not the pixels.

### Rule: Give decorative images empty alt text (`alt=""`), never a description
**Applies to:** Purely decorative images, background flourishes, spacer graphics.
**Why:** A decorative image with descriptive alt text forces screen-reader users to listen to noise that adds nothing. Empty `alt=""` (not a missing attribute) tells the screen reader to skip it. If an image is purely decorative, say so in the copy spec so engineering applies `alt=""`.

### Rule: Don't start alt text with "image of" or "picture of"
**Applies to:** All alt text.
**Why:** The screen reader already announces the element as an image. "Image of a bar chart" becomes "image, image of a bar chart". Lead with the content: "Bar chart: Q3 revenue up 12%".

### Rule: Keep alt text concise — roughly one sentence; move long descriptions elsewhere
**Numeric baseline:** ~125 characters as a practical guide; one sentence.
**Applies to:** All alt text.
**Why:** Alt text is heard in one uninterrupted breath — a paragraph is hard to follow aurally. For a complex image (a detailed chart, an infographic), give brief alt text plus a longer description in adjacent visible text or a linked long-description, and provide the data in an accessible table.

### Rule: For functional images (icon buttons, image links), alt text describes the action, not the picture
**Applies to:** Images inside links or buttons, icon graphics that trigger actions.
**Why:** A magnifying-glass icon that runs a search has alt text "Search", not "Magnifying glass". The user needs the function. The accessible name of a control is its action.

### Rule: Transcribe meaningful text that appears inside an image
**Applies to:** Screenshots, quote cards, infographics, banners with embedded text.
**Why:** Text baked into an image is invisible to screen readers and to text search. If the words matter, repeat them in the alt text or in adjacent real text.

---

## ARIA labels and accessible names

### Rule: Every interactive control has an accessible name that states its action
**Applies to:** Icon-only buttons, toggles, custom controls, links with no visible text.
**Why:** A control with no visible label and no accessible name is announced as just "button" — meaningless. Provide an accessible name (via visible label, `aria-label`, or `aria-labelledby`) that names the action: "Close dialog", "Add to cart", "Play video".

### Rule: The accessible name contains the visible label text — it may extend it but not omit or replace it
**Applies to:** Any control with both a visible label and an `aria-label`.
**Why:** WCAG 2.5.3 (Label in Name) requires the accessible name to contain the visible text. A button reading "Save" must not have `aria-label="Submit form"` — voice-control users say what they see ("click Save") and the mismatch breaks that. The accessible name may extend the visible label (visible "Edit", accessible "Edit profile name") but must not omit or replace the visible words.

### Rule: Add context to ambiguous link or button names that repeat across a page
**Applies to:** Repeated "Edit", "Delete", "View", "Learn more", "Read more" controls in lists and tables.
**Why:** Screen-reader users pull up a list of all links/buttons out of context — ten identical "Edit" entries are useless. Give each a unique accessible name ("Edit billing address", "Edit shipping address"), via `aria-label` or visually-hidden text, while the visible label can stay short.

### Rule: Don't put essential information only in a `title` attribute
**Applies to:** Tooltips and hints implemented as `title`.
**Why:** `title` is inconsistently announced by screen readers, invisible on touch, and only appears on hover. Anything a user must have belongs in visible text or a proper accessible name — not `title` alone.

### Rule: Don't ARIA-label decorative or redundant elements; hide them instead
**Applies to:** Decorative icons next to text labels, redundant graphics.
**Why:** An icon that sits beside a visible text label needs no separate name — labeling it makes the screen reader announce the same thing twice. Mark it `aria-hidden="true"` in the spec so it's skipped.

---

## Screen-reader announcements

### Rule: Specify announcements for state changes that have no text equivalent
**Applies to:** Toasts, inline validation, async results, loading completion, count updates, filter results.
**Why:** A sighted user sees a toast appear; a screen-reader user gets nothing unless the change is announced via a live region. For every dynamic update, the copy spec should state what is announced — "Changes saved", "3 results found", "Upload complete".

### Rule: Keep live-region announcements short, specific, and self-contained
**Numeric baseline:** One short sentence or phrase.
**Applies to:** All live-region (`aria-live`) text.
**Why:** Live announcements interrupt whatever the user is hearing. "Error: email is required" is enough; a paragraph is disruptive. The announcement must make sense on its own, with no visual context.

### Rule: Choose announcement urgency to match the message — polite for status, assertive for errors
**Applies to:** Live-region behavior flagged to engineering.
**Why:** `aria-live="polite"` waits for a pause (right for "Saved", "Loading"); `aria-live="assertive"` interrupts immediately (right for blocking errors and time-sensitive alerts). Marking routine status as assertive makes the product feel like it's shouting; marking a critical error as polite means the user may miss it.

### Rule: Announce errors at submit and move focus to the first error or an error summary
**Applies to:** Form error handling.
**Why:** After a failed submit, a screen-reader user must learn the form failed and where. The copy spec should pair the error summary text ("3 fields need attention") with a focus move so the user lands on the problem instead of hunting for it.

---

## Link text

### Rule: Link text describes its destination and makes sense out of context
**Applies to:** All links — prose, navigation, cards, buttons styled as links.
**Why:** "View pricing plans" works read alone; "click here" and "read more" carry zero meaning in a screen reader's links list. WCAG 2.4.4 requires link purpose to be determinable from the link text (or its programmatic context).

### Rule: Don't use a bare URL as link text
**Applies to:** Links in body copy and UI.
**Why:** A screen reader reads a raw URL character by character — "h-t-t-p-s-colon-slash-slash…". Use human-readable text: "Read the API reference", not "https://docs.example.com/api".

### Rule: Identical link text must point to the same destination; different destinations get different text
**Applies to:** Repeated links across a page.
**Why:** Two links labeled "Documentation" going to different pages confuse anyone navigating by link list. Make the text distinguish them ("API documentation", "Billing documentation").

### Rule: Warn in the link text when a link opens a new tab, downloads a file, or leaves the site
**Applies to:** Links with non-standard behavior.
**Why:** An unexpected new tab or download disorients screen-reader users (the back button stops working as expected). Signal it in the accessible name — "Download report (PDF)", "Pricing (opens in new tab)".

---

## Reading level and clarity

### Rule: Target a broad-audience reading level for general-public copy
**Numeric baseline:** Aim for ≤ 8th–9th grade reading level for consumer copy; lower for vulnerable or low-literacy audiences. Use a readability score as a flag, not a goal. See `_shared/rules/plain-language.md` for the authoritative target (Flesch-Kincaid Grade Level ≤ 8).
**Applies to:** Consumer-facing UI, marketing, onboarding, help copy.
**Why:** Plain, low-grade-level copy is faster to read for everyone and essential for users with cognitive disabilities and non-native speakers. A reading-level score finds problem passages; fixing them means shorter sentences and common words (see `_shared/rules/plain-language.md`), not gaming the formula.

### Rule: Expand or avoid abbreviations and acronyms in copy read by assistive tech
**Applies to:** Acronyms, initialisms, and abbreviations in UI and alt text.
**Why:** Screen readers may spell out, mispronounce, or run together abbreviations unpredictably ("min" as "minimum" or the word "min"). Spell out on first use; for unavoidable abbreviations, the engineering spec can use `abbr` or phonetic spacing — flag it.

### Rule: Don't rely on visual formatting, punctuation, or symbols to carry meaning aloud
**Applies to:** Copy using ALL CAPS, emoji, arrows, or symbols for meaning.
**Why:** A screen reader may read "→" as "right arrow", skip it, or read an emoji's verbose name mid-sentence. ALL CAPS may be spelled letter-by-letter. Carry meaning in words; treat symbols and emoji as decoration that the copy still works without.

---

## Sources

- [W3C — WCAG 2.2 1.1.1 Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html)
- [W3C — WCAG 2.2 2.4.4 Link Purpose (In Context)](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html)
- [W3C — WCAG 2.2 2.5.3 Label in Name](https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html)
- [W3C — WAI Tutorials: Images (alt text decision tree)](https://www.w3.org/WAI/tutorials/images/)
- [WAI-ARIA Authoring Practices — Providing Accessible Names and Descriptions](https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/)
- [MDN — ARIA live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions)
- [Nielsen Norman Group — Better Link Labels: 4 Ss for Encouraging Clicks](https://www.nngroup.com/articles/writing-links/)
- [Yale Usability & Web Accessibility — Links](https://usability.yale.edu/web-accessibility/articles/links)
- [Deque — Text Links: Practices for Screen Readers](https://www.deque.com/blog/text-links-practices-screen-readers/)
