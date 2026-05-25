# Copywriting Rules — Grammar and Mechanics

**Read on-demand when the task involves capitalization, punctuation, numbers, dates, abbreviations, quotation marks, or any consistency decision about how copy is mechanically formatted.**

This domain governs the typographic and grammatical mechanics of copy — the rules a project applies uniformly so its text reads as one voice. Word choice and sentence craft are in `_shared/rules/copy-craft.md`; voice and tone are in `voice-and-tone.md`.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

---

## Capitalization

### Rule: Use sentence case for UI text and headings by default
**Applies to:** Buttons, labels, menu items, page titles, section headings, table headers, toasts.
**Why:** Sentence case — capitalize only the first word and proper nouns ("Billing address", "Create mapping") — reads faster, is harder to get inconsistent, and is the modern default across Mailchimp, Polaris, Apple, and Material. Title Case for UI looks dated and invites per-word inconsistency.

### Rule: Reserve Title Case for proper nouns and formal titles only
**Applies to:** Product names, feature brand names, named plans, work titles.
**Why:** Title case capitalizes every word except articles, short prepositions, and conjunctions. Use it for genuine names ("Premium plan", a campaign title) — not for generic UI features. Generic features stay lowercase ("landing pages", "email", "dashboard").

### Rule: Don't capitalize generic product features or common tech words mid-sentence
**Applies to:** Body copy, help text, marketing.
**Why:** "website", "internet", "online", "email", "dashboard", "settings" are common nouns — capitalizing them mid-sentence reads as misplaced reverence. Capitalize only at the start of a sentence or when the word is part of a registered/proper name.

### Rule: Don't use ALL CAPS for emphasis or for runs of text
**Applies to:** Body copy, headings, alerts.
**Why:** All caps is measurably slower for reading speed (word-shape cues are lost; see Tinker's legibility studies and Arditi & Cho on letter-case effects) and reads as shouting. For emphasis use weight or color. Caps are acceptable only for short labels and eyebrows, with added letterspacing (see ui-ux-designer `typography.md`).

---

## Punctuation

### Rule: Use the serial (Oxford) comma in all lists of three or more
**Applies to:** All prose and copy.
**Why:** "Sync contacts, calendars, and files" — the comma before "and" removes ambiguity about whether the last two items are grouped. Mailchimp mandates it; pick it once and apply it everywhere for consistency.

### Rule: Don't end short UI text with a period — buttons, labels, headings, single-sentence tooltips
**Applies to:** Buttons, form labels, headings, menu items, single-line tooltips, single-line toasts.
**Why:** A period signals "more text follows" and adds nothing on a standalone fragment. Use periods within multi-sentence body copy, helper text that runs to a full sentence, and error messages — but not on labels and fragments.

### Rule: Use periods consistently within multi-sentence body and error copy
**Applies to:** Helper text, error messages, empty-state bodies, descriptions.
**Why:** If a block has two sentences, both get periods — including the last one. The decision is per-context (fragment vs. sentence), but within a context it must never vary.

### Rule: Use the em dash (—) for asides, the en dash (–) for ranges, the hyphen (-) for compounds
**Applies to:** All copy.
**Why:** Em dash offsets an aside — like this — set tight with no surrounding spaces (or with thin spaces if the project's style sets that once). En dash joins ranges (pages 10–20, Mon–Fri). Hyphen joins compound modifiers ("real-time sync", "20-day trial"). Three different glyphs, three different jobs — don't substitute hyphens for dashes.

### Rule: Use the ellipsis glyph (…), not three periods, and use it sparingly
**Applies to:** Truncation, loading states, trailing thoughts, "opens a dialog" button suffixes.
**Why:** The single `…` glyph line-breaks correctly; three periods can split across lines. Use ellipses sparingly — not for drama or false suspense in marketing copy.

### Rule: Use curly quotes and a curly apostrophe, never straight typewriter marks
**Applies to:** All copy — headings, body, labels, product strings.
**Why:** “double” and ‘single’ curly quotes and the ’ apostrophe are correct typography; straight `"` and `'` are a typewriter artifact that reads as a rendering error. Use a straight prime only for true measurements (5′ 10″) if the project needs them.

### Rule: Use exclamation marks rarely — at most one per screen, never in error or failure copy
**Applies to:** All copy.
**Why:** Overused exclamation marks read as forced enthusiasm and lose force. Never stack them ("!!!"). Never use one in an error, validation, or failure message — it trivializes the problem.

### Rule: Prefer a new sentence or an em dash over a semicolon in product copy
**Applies to:** UI copy, marketing, microcopy.
**Why:** Semicolons are correct but read as formal and slow in product copy. Mailchimp advises using them sparingly. Two short sentences or an em dash usually carry the same meaning more clearly. Semicolons are fine in long-form editorial.

### Rule: Place periods and commas inside quotation marks; place colons and semicolons outside
**Applies to:** All copy (US English convention).
**Why:** US convention: `She called it "done."` — period inside. Question marks and exclamation marks go inside only when they belong to the quoted material. If the project standardizes on British English, that is a project decision recorded in its own style doc.

---

## Numbers

### Rule: Use numerals for all numbers in UI copy; spell out numbers only when a number starts a sentence
**Numeric baseline:** Numerals for 0 and up in UI; spell out a sentence-initial number, or rewrite to avoid it.
**Applies to:** UI microcopy, data, counts, marketing stats.
**Why:** Numerals are faster to scan and parse — "5 items", "3 steps", "12 days left". A number opening a sentence is spelled out ("Twelve projects synced.") or the sentence is reworded. Editorial prose may follow the spell-out-under-10 convention; UI does not.

### Rule: Add a thousands separator at four or more digits
**Numeric baseline:** Comma at 1,000 and above in en-US (1,000 / 25,000 / 1,000,000); abbreviate in tight space (1k, 25k, 1M).
**Applies to:** Counts, prices, stats.
**Why:** "1,000" is read at a glance; "1000" forces digit-counting. Locale changes the separator — flag that for localization (some locales use a period or space).

### Rule: Use the % symbol, not the word "percent", in UI and data copy
**Applies to:** Stats, metrics, pricing, microcopy.
**Why:** "20%" is more scannable than "20 percent" and is the Mailchimp standard. No space between the number and the symbol in en-US.

### Rule: Format dates and times consistently; spell out the month to avoid ambiguity
**Applies to:** Timestamps, schedules, date labels.
**Why:** "Jan 24, 2026" or "January 24, 2026" is unambiguous worldwide; "01/24/26" is read differently across locales. Times use numerals with a space before am/pm ("7 am", "7:30 pm"), drop ":00" on the hour, and name the time zone for scheduled events. (The "7 am" form here follows the en-US Mailchimp convention; Chicago uses "a.m." and AP uses "a.m." — pick one style per project and apply it consistently.)

### Rule: Use an en dash with no spaces for numeric ranges
**Applies to:** Ranges of numbers, dates, times.
**Why:** "20–30 days", "Mon–Fri", "7 am–10 pm". A hyphen is acceptable as a fallback when the en dash is unavailable, but be consistent — don't mix.

### Rule: Format currency with the symbol before the amount and cents only when non-zero (or always, consistently)
**Applies to:** Prices, billing copy.
**Why:** "$19" or "$19.00" — pick one and hold it across the product. Show cents when amounts have them ("$19.99"); a pricing page that mixes "$19" and "$19.00" looks unfinished.

---

## Abbreviations and acronyms

### Rule: Spell out an acronym on first use, then use the short form — unless it's universally known
**Applies to:** All copy.
**Why:** Expand on first mention ("single sign-on (SSO)"), then use "SSO". Skip the expansion for acronyms more familiar than their expansion — API, HTML, URL, PDF, FAQ. Audience decides: a developer tool can assume more than a consumer app.

### Rule: Avoid Latin abbreviations — write the English
**Applies to:** All audience-facing copy.
**Why:** "e.g." → "for example", "i.e." → "that is", "etc." → finish the list or write "and more". Latin abbreviations are easily confused and add nothing. Reserve them for tight space where the audience knows them.

### Rule: Set file extensions and formats in uppercase without a period
**Applies to:** Copy referencing file types.
**Why:** "PDF", "CSV", "PNG", "JPG" — uppercase, no dot. The dot returns only in an actual filename ("report.pdf").

### Rule: Use contractions — they read as natural speech
**Applies to:** UI copy, marketing, most product surfaces.
**Why:** "You're all set", "We couldn't connect", "It's saved" sound human; "You are all set" sounds stiff. Contractions are standard in modern product voice (Mailchimp, Polaris). Drop them only where a project's voice is deliberately formal, or to add weight to a negative ("Do not" can land harder than "Don't" in a critical warning).

---

## Consistency

### Rule: Use one term for one concept across the entire product surface
**Applies to:** UI, docs, marketing, error copy.
**Why:** "Sign in" or "Log in", "Delete" or "Remove", "folder" or "directory" — choose once, record it in the project's copy guide glossary, never switch. Readers assume two words mean two things.

### Rule: When a mechanics rule has a locale-dependent answer, flag it for localization rather than hard-coding
**Applies to:** Number separators, date order, currency placement, quotation-mark style.
**Why:** These rules above are en-US defaults. A localized product needs per-locale formatting; the English copy should not bake in assumptions that break on translation. Note the dependency so localization handles it.

---

## Sources

- [Mailchimp Content Style Guide — Grammar and Mechanics](https://styleguide.mailchimp.com/grammar-and-mechanics/)
- [Mailchimp Content Style Guide — Word List](https://styleguide.mailchimp.com/word-list/)
- [Shopify Polaris — Grammar and mechanics](https://polaris.shopify.com/content/grammar-and-mechanics)
- [Matthew Butterick — Practical Typography, Summary of Key Rules](https://practicaltypography.com/summary-of-key-rules.html)
- [The Chicago Manual of Style — Numbers and Punctuation (overview)](https://www.chicagomanualofstyle.org/)
- [Nielsen Norman Group — UX Writing: Study Guide](https://www.nngroup.com/articles/ux-writing-study-guide/)
