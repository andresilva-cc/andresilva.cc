# Copywriting Methods — Voice and Tone

**Read on-demand when the task involves defining a product's voice, building a voice or tone framework, calibrating tone for a context, or auditing copy for voice consistency.**

This is a methods catalog — procedures the copywriter runs, not pass/fail rules. Universal writing craft is in `_shared/rules/copy-craft.md`; banned clichés are in `_shared/rules/banned-buzzwords.md`. The output of this work is a project-owned copy guide — these methods produce it; they don't store its content.

> **Toolkit-managed file — do not edit per-project.** These rules are static and shared across every project using the toolkit. Project-specific decisions belong in the project's own decisions doc — never here.

---

## Foundations

### Technique: Separate voice from tone
**What it is:** Voice is the product's constant personality — the same in every message. Tone is how that voice flexes for a given context and the user's emotional state.
**When to apply:** At the start of any copy-guide work, and whenever a stakeholder conflates the two ("our voice should be more reassuring here" — that's tone).
**How:**
- State it as one rule: *voice never changes; tone changes with context.* A person has one voice but speaks differently at a funeral and a party.
- Define voice once, as a stable set of traits (below).
- Define tone as a spectrum the voice moves along per context (below).
- Use the test: if a proposed change would apply to *every* screen, it's a voice change; if only to *this* screen, it's tone.

### Technique: Derive voice from the audience and the product's role, not from adjectives in a vacuum
**What it is:** Grounding voice in who the user is and what the product does for them, so the voice is defensible rather than decorative.
**When to apply:** Before writing any voice statement.
**How:**
- Read the product spec: who is the user, what job are they hiring the product for, what is their emotional state when they use it (stressed admin, curious browser, blocked developer)?
- Ask: what kind of *person* would this user most want to hear from in that moment — a calm expert, a blunt peer, a patient guide?
- Mailchimp's voice ("the experienced, compassionate business partner we wish we'd had") is derived this way — from the customer's pain, not from a brand brainstorm.
- Write one or two sentences naming that persona before you pick trait words.

---

## Defining voice

### Technique: Voice traits — three to four words, each with a definition and a do/don't
**What it is:** A small, specific set of trait words that define the voice, each made operational so a writer can apply it.
**When to apply:** Building the Voice section of the copy guide.
**How:**
- Pick 3–4 trait words. More than four can't be held in mind while writing.
- Reject generic traits — "professional", "modern", "innovative", "friendly" describe almost every product and guide no decision. Push for specific, even slightly uncomfortable words ("blunt", "wry", "unfussy", "exacting").
- For each trait write: (1) a one-line definition in this product's terms, (2) a "this means we do…" line, (3) a "this does not mean we…" line that heads off the misreading. Example — *Confident:* we state things plainly and don't hedge. Means: "This will fail" not "This might possibly fail". Doesn't mean: arrogant or dismissive of the user.
- Pressure-test each trait against the opposite: if no sane product would claim the opposite, the trait is empty. Every product wants to be "trustworthy"; not every product is "irreverent".

### Technique: The "we sound like / we don't sound like" table
**What it is:** A two-column contrast that pins the voice between extremes by naming what it is *not*.
**When to apply:** Alongside the trait list, in the copy guide.
**How:**
- Left column: "We sound like…" — short phrases capturing the voice (e.g., "a knowledgeable colleague", "plain and direct").
- Right column: "We don't sound like…" — the failure modes to avoid (e.g., "a legal disclaimer", "a hype-filled press release", "a chatbot trying to be your friend").
- Define by negation: voice becomes concrete when the writer knows the two ditches on either side of the road.
- Keep 4–6 contrast pairs; each pair should map loosely to a trait.

### Technique: Voice-validation pass — read against the traits
**What it is:** An audit method to check whether existing or draft copy actually expresses the defined voice.
**When to apply:** After defining voice; periodically when reviewing accumulated copy; when a new writer joins.
**How:**
- Pull a sample of real strings from across the product (button, error, empty state, marketing line, onboarding step).
- For each, ask: which trait does this express? Could it have come from the "we don't sound like" column?
- Flag strings that are off-voice and rewrite one as a worked example for the copy guide.
- If many strings can't be tied to any trait, the traits are too abstract — return to the derivation step.

---

## Calibrating tone

### Technique: The tone spectrum — map contexts to a position between two poles
**What it is:** A framework that holds voice constant while moving tone along a defined range, context by context.
**When to apply:** Building the Tone section of the copy guide; deciding how a specific screen should feel.
**How:**
- Define the spectrum's poles for this product — commonly playful ↔ serious, casual ↔ formal, and enthusiastic ↔ matter-of-fact (a product may use one or two axes, not all).
- List the product's recurring contexts and place each on the spectrum: success messages (warm, light), errors (calm, serious, matter-of-fact), empty states (encouraging), onboarding (friendly, clear), destructive confirmations (serious, direct), marketing (confident, energetic).
- For each context give a one-line tone description and a real example string.
- The voice traits still apply at every point — only the tone slides. A "confident" voice is confident-and-warm on success and confident-and-grave on a delete dialog.

### Technique: Read the user's emotional state, then set tone against it — don't mirror it
**What it is:** Choosing tone based on how the user feels at that moment, deliberately, rather than defaulting to one tone everywhere.
**When to apply:** Any context where the user arrives with a strong emotional state — failed payment, data loss, first success, hitting a limit.
**How:**
- Name the user's likely state for the context (frustrated, anxious, delighted, confused, rushed).
- Set the tone to *help*, not to *match*: a frustrated user on an error needs calm and competence, not jokes and not matching anger. A delighted user on first success can take warmth and a light touch.
- Hard rule from `copy-craft.md`: never perform an emotion the user isn't feeling. No "Oops!" on a real failure.
- Mailchimp's principle: you would not use the same tone with someone scared as with someone laughing — choose per the human, not per habit.

### Technique: Dial humor and personality down as stakes and frequency rise
**What it is:** A heuristic for where personality belongs and where it must recede.
**When to apply:** Deciding whether a given string can carry a joke, a wink, or extra warmth.
**How:**
- Two dials: *stakes* (does failure here cost the user money, data, time?) and *frequency* (does the user see this string constantly?).
- High stakes → strip personality; be clear and calm (errors, destructive actions, billing, security).
- High frequency → strip personality; a joke that's funny once is irritating the hundredth time (a string on a screen seen daily).
- Low stakes + low frequency → personality is welcome (a rare empty state, a one-time success, an onboarding welcome, a 404).
- Personality is a seasoning, not a base layer; voice is always present, overt personality is occasional.

### Technique: Tone-shift audit across a single flow
**What it is:** Checking that tone moves smoothly through a multi-step flow instead of lurching.
**When to apply:** After writing onboarding, checkout, setup, or any sequential flow.
**How:**
- Lay the flow's strings end to end and read them as one continuous experience.
- Watch for whiplash: a giddy welcome → a cold form → a jokey error → a flat confirmation reads as four different products.
- Voice stays constant throughout; tone should shift only where the *context* shifts, and gradually.
- Rewrite the outliers so the flow feels like one consistent narrator.

---

## Sources

- [Mailchimp Content Style Guide — Voice and Tone](https://styleguide.mailchimp.com/voice-and-tone/)
- [Mailchimp — 7 Steps for Establishing Your Voice and Tone Guidelines](https://mailchimp.com/resources/establish-your-voice-and-tone/)
- [Shopify Polaris — Voice and tone](https://polaris.shopify.com/content/voice-and-tone)
- [Torrey Podmajersky — Strategic Writing for UX, the Voice Chart (O'Reilly, 2nd ed.)](https://www.oreilly.com/library/view/strategic-writing-for/9781492049388/)
- [Nielsen Norman Group — Tone of Voice in Digital Communication](https://www.nngroup.com/articles/tone-of-voice-dimensions/)
- [Nielsen Norman Group — The Voice & Tone of UX Content](https://www.nngroup.com/articles/voice-tone-ux-content/)
- [VTEX UX Writing Guidelines — Voice Chart](https://uxwriting.vtex.com/docs/principles/voice-chart/)
