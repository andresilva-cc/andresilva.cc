# Copy Craft Rules

**Read on-demand when the task involves writing or editing prose for humans — product copy, marketing pages, landing copy, microcopy, brand statements, emails, docs, or any text a reader will consume.**

This domain governs universal writing craft: word choice, sentence construction, structure for the reader, and honesty. Banned clichés are in `banned-buzzwords.md`; plain-language techniques for legal/regulated text are in `plain-language.md`.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

---

## Word choice

### Rule: Choose the most specific concrete verb the sentence allows
**Applies to:** All prose. Buttons and CTAs especially — name the action ("Save changes", "Send invite", "Create account") rather than a generic verb. Reserve "OK" for non-actionable confirmations of a system message; "Submit" is conventional for form submission but a named action is usually clearer.
**Why:** Vague verbs ("do", "make", "get", "handle", "manage", "utilize", "leverage") force the reader to reconstruct the actual action. A concrete verb carries the meaning in one word. Strong verbs also remove the need for adverbs — "sprinted" beats "ran quickly".

### Rule: Cut adverbs that prop up a weak verb or inflate a claim
**Applies to:** All prose; marketing headlines especially.
**Why:** "Quickly", "effortlessly", "easily", "seamlessly", "simply" make broad claims the copy can't back. To a skeptical reader — developers especially — adverb-heavy copy reads as marketing, not fact. Replace the adverb with a number or a stronger verb, or delete it.

### Rule: Prefer common everyday words over jargon, Latinate, or inflated diction
**Applies to:** All audience-facing prose. Necessary technical terms are kept (see `plain-language.md`).
**Why:** "Use" beats "utilize", "buy" beats "purchase", "help" beats "facilitate", "about" beats "regarding". Inflated diction signals distance and effort, not authority. Mailchimp and Polaris both build their voice on short, plain words.

### Rule: Use one term per concept, everywhere
**Applies to:** UI labels, docs, marketing, error copy — the whole product surface.
**Why:** Pick "Delete" or "Remove", "Sign in" or "Log in", "folder" or "directory" — then never switch. Synonym variety is a virtue in literary prose and a defect in product copy: the reader assumes two words mean two things and hunts for the difference. Consistency is one of the three core UX-writing techniques (clarity, conciseness, consistency).

---

## Sentence and voice

### Rule: Write in the active voice by default
**Applies to:** All prose. Passive is acceptable only when the actor is unknown, irrelevant, or deliberately de-emphasized.
**Why:** Active voice names who does what — "We couldn't find your account" beats "Your account could not be found". It is shorter, clearer about responsibility, and more direct. Passive voice hides the actor and adds words.

### Rule: Lead with the most important information
**Applies to:** Every unit — sentence, paragraph, section, page. Headlines, email subject lines, and the first sentence of any block carry the load.
**Why:** Readers scan; they decide whether to continue within the first few words. Front-loading the conclusion (the "inverted pyramid") respects that. Burying the point under throat-clearing ("In order to", "It is important to note that") loses the reader before it arrives.

### Rule: Vary sentence length; break up runs of same-length sentences
**Numeric baseline:** Mix short (≤8 words), medium, and occasional longer sentences. Average ≤20 words.
**Applies to:** Editorial and marketing prose. Microcopy stays uniformly short.
**Why:** A run of equal-length sentences flattens into monotone and the reader's attention drifts. A short sentence after two long ones lands. Rhythm is a real readability factor, not decoration — read the draft aloud to hear where it stalls.

### Rule: One idea per sentence
**Applies to:** All prose; instructional and microcopy text especially.
**Why:** A sentence carrying two ideas joined by "and"/"which"/"; " forces the reader to hold both at once. Splitting them is almost always clearer and rarely longer overall.

---

## Brevity

### Rule: Cut every word that does not change the meaning
**Numeric baseline:** For web copy, target roughly half the word count you'd use in print.
**Applies to:** All audience-facing prose.
**Why:** Users are not there to read; conciseness measurably improves task success (NN/g found succinct, scannable, objective copy lifted usability 124% — 1997 Morkes/Nielsen study). Delete filler openers ("Basically", "Simply", "Just", "In order to"), redundant pairs ("end result", "free gift", "completely eliminate"), and modifiers that add no information.

### Rule: Don't state what the layout already shows
**Applies to:** Microcopy near inputs, buttons, and visible UI.
**Why:** "Enter your email below" is redundant when the input is below; "Click the button to continue" is redundant next to the button. The interface carries spatial and structural meaning — copy should add information, not narrate the screen.

### Rule: Edit in passes — purpose, then concision, then clarity
**Applies to:** Any draft past the first.
**Why:** Podmajersky's editing model: first confirm the text serves its goal (purposeful), then cut length (concise), then make every remaining word unambiguous (clear). Trying to do all three at once produces copy that is short but off-target, or on-target but bloated.

---

## Structure for the reader

### Rule: Make copy scannable — headings, short paragraphs, lists, bold keywords
**Numeric baseline:** Paragraphs ≤3–4 sentences; one topic each.
**Applies to:** Web pages, docs, long-form marketing, anything over a few sentences.
**Why:** Online readers scan in an F-shaped pattern — they read the top, then drop down the left edge. Descriptive headings, front-loaded sentences, bulleted lists, and bolded keywords let a scanner extract the gist without reading every word. A wall of text defeats this and gets skipped.

### Rule: Link text must describe its destination and stand alone
**Applies to:** All links in prose, UI, and navigation.
**Why:** "View pricing plans" beats "Click here" beats a bare URL. Screen-reader users navigate by a list of links out of context; sighted users scan link text as keywords. "Click here" and "read more" carry zero meaning when pulled from the sentence.

### Rule: Front the verb in instructions and calls to action
**Applies to:** Buttons, CTAs, step lists, instructional copy.
**Why:** "Add a payment method" reads as an instruction; "You can add a payment method" reads as a description and adds two dead words. Starting with the imperative verb tells the reader exactly what to do.

---

## Specificity and honesty

### Rule: Show with concrete detail; don't assert an abstraction
**Applies to:** Marketing copy, brand statements, feature descriptions.
**Why:** "Experience the power of our platform" promises a feeling and names nothing. "Parse a 2 GB log file in under 4 seconds" shows it. Named places, named numbers, named verticals, real examples — specificity is the difference between copy that persuades and copy that decorates. If the brief gives nothing concrete, ask the user for a specific noun, verb, or number rather than inventing one.

### Rule: Never fabricate metrics, claims, quotes, or social proof
**Applies to:** All copy, without exception.
**Why:** Invented numbers ("trusted by thousands", "10x faster") and placeholder testimonials are dishonest and legally exposed. A skeptical reader who catches one fabricated claim discards the whole page. Use only figures the user supplies or that are verifiably true; if a claim can't be substantiated, cut it or soften it to what's defensible.

### Rule: Back every claim with evidence, or don't make it
**Applies to:** Marketing and technical copy, developer-facing copy especially.
**Why:** Developers and informed buyers verify claims. "Fast" is a claim; "50 ms p99 latency" is evidence. "Reliable" is a claim; "99.9% uptime SLA" is evidence. Unsupported superlatives read as noise; specific, checkable facts build trust.

### Rule: State limitations and tradeoffs honestly
**Applies to:** Product, pricing, and feature copy.
**Why:** Naming what a product doesn't do, or what it trades away (cheaper but slower; fast but higher-cost), reads as genuine advice and strengthens credibility. Copy that claims no downsides invites disbelief in everything else on the page.

### Rule: Don't perform emotion the reader isn't feeling
**Applies to:** Error states, empty states, frustration paths (failed payment, locked account, lost password).
**Why:** "Oops!" and forced cheer on a validation error trivialize a real problem. Name what broke, why, and how to fix it — in that order. Save personality for moments where the reader is not blocked or frustrated.

---

## Sources

- [Mailchimp Content Style Guide — Writing Principles](https://styleguide.mailchimp.com/writing-principles/)
- [Mailchimp Content Style Guide — TL;DR](https://styleguide.mailchimp.com/tldr/)
- [Shopify Polaris — Actionable language](https://polaris.shopify.com/foundations/content/actionable-language)
- [Shopify Polaris — Voice and tone](https://polaris.shopify.com/content/voice-and-tone)
- [Nielsen Norman Group — Concise, SCANNABLE, and Objective: How to Write for the Web](https://www.nngroup.com/articles/concise-scannable-and-objective-how-to-write-for-the-web/)
- [Nielsen Norman Group — Be Succinct! (Writing for the Web)](https://www.nngroup.com/articles/be-succinct-writing-for-the-web/)
- [Torrey Podmajersky — Strategic Writing for UX (O'Reilly, 2019)](https://www.oreilly.com/library/view/strategic-writing-for/9781492049388/)
- [Michael J. Metts & Andy Welfle — Writing Is Designing (Rosenfeld Media, 2020)](https://rosenfeldmedia.com/books/writing-is-designing/)
- [Kalyna Marketing — How to Write for a Developer Audience](https://kalynamarketing.com/blog/writing-for-developers)
