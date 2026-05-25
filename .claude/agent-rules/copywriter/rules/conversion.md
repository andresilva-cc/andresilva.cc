# Copywriting Methods — Conversion Copy

**Read on-demand when the task involves landing-page copy, marketing pages, hero sections, headlines, calls to action, feature sections, pricing copy, or any page whose job is to persuade and convert.**

This is a methods catalog — procedures for writing copy that sells. Universal writing craft (specificity, honesty, no fabricated claims) is in `_shared/rules/copy-craft.md`; banned marketing clichés are in `_shared/rules/banned-buzzwords.md`. App microcopy is in `microcopy.md`.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

---

## Strategy before words

### Technique: Write the message hierarchy before writing copy
**What it is:** Deciding, in order, the single most important thing the page must communicate, then the supporting points — before drafting any sentences.
**When to apply:** Start of any landing page or marketing page.
**How:**
- Name the one audience and the one primary action the page exists to drive. A page with two primary goals converts on neither.
- Write the core message in one plain sentence: *who it's for, what it does, what changes for them.*
- Rank supporting points: the 3–5 things a skeptic must believe to act. Everything on the page serves one of them or is cut.
- This hierarchy maps directly to page structure — hero carries the core message, sections carry the supporting points in rank order.

### Technique: Convert features into benefits, but keep the feature as proof
**What it is:** Leading with the outcome the user gets, while still naming the concrete feature that delivers it.
**When to apply:** Every feature section, hero subhead, and bullet list.
**How:**
- For each feature ask "so what?" until you reach the user's actual outcome. *Feature:* "real-time sync". *So what?* "your team always sees current data". *So what?* "no more acting on a stale spreadsheet."
- Lead with the benefit, name the feature as the mechanism: "Your team always sees current data — every change syncs in under a second."
- Don't go benefit-only: a vague benefit with no mechanism ("Work smarter") is unbelievable. The feature is the evidence.
- Don't go feature-only: a spec list with no outcome makes the reader do the translation. Pair them.

### Technique: Match the message to awareness stage
**What it is:** Calibrating how much you explain based on whether the visitor already knows they have the problem, knows solutions exist, or knows your product.
**When to apply:** Choosing the headline angle and how much context the page front-loads.
**How:**
- Problem-unaware / problem-aware visitor → lead with the problem and its cost; don't open with product mechanics.
- Solution-aware visitor (comparing options) → lead with differentiation and proof; they don't need the problem explained.
- Product-aware visitor (from a branded search or referral) → lead with the offer and the CTA; cut the preamble.
- A general landing page usually targets problem/solution-aware; a docs or pricing page assumes product-aware. Don't write one tone for all traffic.

---

## Headlines

### Technique: Headline patterns that earn the read
**What it is:** A set of reliable headline structures, each suited to a different message.
**When to apply:** Drafting the hero headline and major section headers.
**How — pick the pattern that fits the core message:**
- *Clear value:* state the outcome plainly — "Ship your changelog in five minutes." Best default; works when the benefit is strong on its own.
- *Specific transformation:* before → after — "From scattered spreadsheets to one synced source of truth."
- *Named problem:* lead with the pain — "Your team is acting on stale data." Use for problem-aware traffic.
- *Quantified outcome:* a number does the persuading — "Cut your build time from 90 seconds to 12." Strongest when the number is real and verifiable.
- *Audience call-out:* name the reader — "For support teams drowning in 500+ tickets a day."
- Avoid the clever-but-empty headline ("Reimagine your workflow") — it sounds like a headline and says nothing. See `banned-buzzwords.md`.

### Technique: Headline + subhead division of labor
**What it is:** Splitting the work so the headline hooks and the subhead clarifies.
**When to apply:** Every hero and major section.
**How:**
- Headline: short, the hook — the benefit or the bold claim. Keep it tight; long headlines stop being display copy (see ui-ux-designer `typography.md` — display sizes are tuned for short statements).
- Subhead: one or two sentences that say plainly *what the product is* and *for whom*, and ground the headline's claim.
- Test: a visitor who reads only the headline and subhead should understand what this is and whether it's for them. If not, the hero fails — most visitors read nothing else first.
- Don't repeat the headline in the subhead with synonyms; the subhead adds, it doesn't echo.

---

## Calls to action

### Technique: CTA construction — specific verb plus the outcome
**What it is:** Building CTA button copy that names what the user gets, not what the form does.
**When to apply:** Every CTA button on the page.
**How:**
- Pattern: imperative verb + the outcome or object. "Start free trial", "Get the template", "Book a demo", "See pricing".
- Reject generic verbs: "Submit", "Sign up", "Get started", "Learn more", "Click here" — they describe a mechanic, not a gain.
- Be honest about what the click does: "Start free trial" must actually start a trial; "Book a demo" must open a booking step. A CTA that overpromises the next step kills trust on click.
- Some teams see lift from first-person CTAs ("Start my free trial") — treat it as a hypothesis to test for your audience, not a rule.
- One primary CTA per section, repeated down the page at natural decision points. Secondary CTAs ("See how it works") are visibly softer in copy and weight.

### Technique: Reduce CTA anxiety with adjacent microcopy
**What it is:** A short line near the CTA that removes the unspoken objection blocking the click.
**When to apply:** Any CTA where the user hesitates over cost, commitment, or effort.
**How:**
- Name the objection and answer it in a few words beside or below the button: "No credit card required", "Free for 14 days", "Set up in 2 minutes", "Cancel anytime".
- Keep it factual — it must be true. A false reassurance is worse than none.
- Don't crowd the button with a paragraph; one short line.

---

## Page structure for scanning

### Technique: Conversion-specific scannability
**What it is:** The scannability tactics that are load-bearing specifically for a *converting* page.
**When to apply:** Every marketing and landing page.
**How:**
- Scannability fundamentals (F-pattern reading, meaningful headings, front-loaded paragraphs, sparing bold) are in `_shared/rules/copy-craft.md` — apply those as a baseline.
- Conversion-specific addition: read the page using only the headings, subheads, and bold text — the *argument for converting* (problem, benefit, proof, CTA) must survive that read. If a skeptic scanning only the headings cannot reach a decision, the structure has failed its job for this page type.
- Conversion-specific addition: every section heading earns its place by advancing the conversion argument. A heading that does not contribute to "why act, why now, why us" is a candidate to cut.

### Technique: Place proof next to the claim it supports
**What it is:** Pairing each claim with its evidence in the same eyeline, not quarantining all proof in one testimonials block.
**When to apply:** Whenever the page makes a claim a skeptic would challenge.
**How:**
- After a benefit claim, put the proof: a metric, a named customer, a specific result, a screenshot, a quote.
- Distribute social proof — a logo row, a relevant quote, a stat — beside the relevant section, not only in a single strip.
- Use only real, supplied proof. Never invent metrics, logos, or testimonials (see `copy-craft.md`) — one fabricated claim discredits the whole page.
- Specific proof beats generic: "1,200 teams" beats "trusted by thousands"; a named quote beats an anonymous one.

### Technique: Handle objections instead of ignoring them
**What it is:** Naming and answering the reasons a visitor would *not* convert, on the page itself.
**When to apply:** Mid-to-lower page, before the final CTA.
**How:**
- List the real objections: price, switching cost, "will this work for my case?", trust, security, lock-in.
- Address each where the visitor feels it — a comparison table, an FAQ, a "how migration works" section, a security line.
- Stating a genuine limitation honestly ("not built for X yet") raises credibility for everything else (see `copy-craft.md`).
- An FAQ is a legitimate objection-handling tool — write real questions visitors ask, not softball questions.

### Technique: End with one clear next step
**What it is:** Closing the page with a single, low-friction action and no competing choices.
**When to apply:** The final section of every landing page.
**How:**
- Restate the core benefit in one line, then the primary CTA — the same CTA copy used in the hero, for consistency.
- Don't dilute the close with three equal options; one primary action, at most one soft alternative.
- If anxiety microcopy applies (free, no card, fast setup), repeat it here — this is the decision point.

---

## Sources

- [Nielsen Norman Group — Concise, SCANNABLE, and Objective: How to Write for the Web](https://www.nngroup.com/articles/concise-scannable-and-objective-how-to-write-for-the-web/)
- [Nielsen Norman Group — Better Link Labels: 4 Ss for Encouraging Clicks](https://www.nngroup.com/articles/writing-links/)
- [Nielsen Norman Group — F-Shaped Pattern of Reading on the Web](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/)
- [Shopify Polaris — Actionable language](https://polaris.shopify.com/foundations/content/actionable-language)
- [Mailchimp Content Style Guide — Writing Goals and Principles](https://styleguide.mailchimp.com/writing-principles/)
- [Torrey Podmajersky — Strategic Writing for UX (O'Reilly, 2nd ed.)](https://www.oreilly.com/library/view/strategic-writing-for/9781492049388/)
- [Joanna Wiebe / Copyhackers — Conversion Copywriting resources](https://copyhackers.com/)
