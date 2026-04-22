# Copy Style Guide: andresilva.cc

This is a personal website — a professional presence for André Silva on the web. It is not a product. The voice is André's own, and this guide exists to keep new or updated copy consistent with what is already there.

This guide is **descriptive**, not prescriptive. It captures conventions already in use across the site. When adding new surfaces, follow these patterns; when they don't cover a case, make a call that feels at home alongside the existing copy and extend the guide.

---

## 1. Voice and Tone

### Voice (constant)

Three adjectives describe how the site speaks:

- **Understated** — achievements are stated, not sold. No superlatives, no hype language, no "passionate" or "game-changing."
- **Concrete** — sentences name the thing (technology, metric, integration, platform) rather than gesture at it. "Achieved a 74% increase in the performance of a key page" not "dramatically improved performance."
- **Technical-peer** — written for other engineers. Technology names, platform names, and acronyms are used without apology or definition.

### We sound like vs. we don't sound like

| We sound like | We don't sound like |
|---|---|
| "Software engineer with 9+ years of experience building web platforms, internal tools, and developer tooling" | "Passionate software engineer delivering world-class solutions" |
| "Achieved a 74% increase in the performance of a key page" | "Dramatically accelerated page performance" |
| "Oops, this page doesn't exist." | "404 — Resource Not Found" |
| "The personal website that you are seeing right now" | "A sleek, modern portfolio experience" |
| "Formerly Healthy Labs" | "Healthy Labs (now known as MPA)" |

### Tone spectrum (varies by context)

| Context | Tone | Example from the site |
|---|---|---|
| Hero / identity | Plain, factual | "Senior Engineer @ MPA" |
| About bio | First-person-omitted, matter-of-fact | "Works end-to-end — from architecture and infrastructure to product features and integrations." |
| Career entries | Past-tense, action-verb bullets | "Developed a multi-agent AI assistant for internal CMS operations and workflows" |
| Project descriptions | Single-sentence, no final period | "Images as Code. Write JSX, export as images" |
| 404 / error | Light, warm, brief | "Oops, this page doesn't exist." |
| ARIA / accessibility labels | Verb-first, literal | "Open menu", "Close menu", "Select theme", "Picture of myself" |

---

## 2. Person and Register

### Person

The site uses **two consistent registers** and they do not mix within a single surface.

- **Third-person-omitted (subject-less) register** on the About page. The subject "André" or "I" is dropped; the sentence starts with the verb.
  - "Software engineer with 9+ years of experience..."
  - "Works end-to-end..."
  - "Primarily works with TypeScript, Vue.js, Nuxt, React, and Node.js."
  - "Takes ownership of solutions..."
  - "Holds a BS in Computer Science..."

- **First-person, casual** in two specific places only:
  - The 404 page, where "myself" appears as the subject of the about photo's alt text ("Picture of myself").
  - The README, which is meta about the project ("My personal website :)").

Everywhere else, there is **no "I", no "he", no "André"** in running prose. The name "André Silva" appears exactly once in visible site content: the hero on the home page. Page titles use "André Silva" as the site identifier (e.g., `About | André Silva`), never as a pronoun substitute.

### Register

Register is **casual-professional**: a resume that talks like a person, not a press release. Contractions are fine ("doesn't"). The em dash (—) is used for parenthetical asides and date ranges. The Oxford comma is used consistently ("TypeScript, Vue.js, Nuxt, React, and Node.js").

---

## 3. Writing Rules

### Sentence length and density

- **About page**: sentences are short-to-medium. The opening sentence is the longest (one long list of specializations separated by em dash), then paragraphs shrink.
- **Career bullets**: single clause or single clause + short prepositional phrase. Target one line at desktop width.
- **Project descriptions**: single sentence. No period at the end. Often a noun phrase or imperative.

### Voice

Active voice, consistently. Past tense for completed work ("Developed", "Built", "Migrated", "Contributed"). Present tense for ongoing facts about the person ("Works", "Takes", "Holds").

### Capitalization

- **Page titles and navigation**: sentence-style but single words ("About", "Articles", "Career", "Projects", "Home"). Navigation items are **always single-word** and always capitalized.
- **Section headings on pages**: Title Case when multi-word ("Featured Projects", "All Projects"). The `h2-mono` variant renders them as uppercase via CSS — the source copy itself is Title Case, not SHOUTING.
- **Button labels**: verb-first, Title Case for multi-word labels ("Download Resume"). The CSS uppercases them — write them as Title Case in source.
- **Technology names**: use each vendor's preferred casing — TypeScript, Vue.js, Nuxt, React, Node.js, Tailwind CSS, Next.js, AI SDK, TanStack, Laravel, Pinia, Vuex, Vuetify, Jest, Vitest, Storybook, NativeScript, Drupal, Sequelize, Express, Konva, Vuesax, Sass, Shell Script, Linux, Windows Server, Adobe XD, SEO.
- **Acronyms**: SPA, CMS, DX, SDK, API, AI, BS, CEO, CONFEA, CRCMG, OAC, SEO — uppercase, no periods.

### Punctuation

- **Oxford comma**: yes, always.
- **Em dash (—)**: used for parenthetical asides ("Works end-to-end — from architecture and infrastructure to product features and integrations.") and for date ranges ("Apr 2025 — Present"). The dash is surrounded by spaces on both sides.
- **Exclamation marks**: not used on the public site. The only exception is `console.log('Congratulations, you have found an Easter Egg!')` — not user-facing prose.
- **Smart quotes / apostrophes**: use curly typographic apostrophes where the source supports them (`'`), and escape them as `&apos;` inside JSX when needed (e.g., `Oops, this page doesn&apos;t exist.`).
- **Terminal periods**: Full sentences end with a period. Short, one-line descriptive items — project descriptions, career bullets, navigation, buttons, chips — do **not** have a terminal period. Apply this rule to anything that reads as a label rather than a sentence.

### UI microcopy

- **Buttons**: verb-first, short. "Download Resume". If a button routes to a specific destination, the noun names the destination.
- **Link labels inside cards and modals**: the literal destination name, not a description. "GitHub", "Website", "eyesup-web", "NativeScript Spotify", "OAC-API". When a project has multiple repos or surfaces, each link uses the exact project/repo name.
- **Read-more affordance on article cards**: "Read on dev.to" — lowercase "on", platform name in its canonical form ("dev.to", not "DEV Community" in this spot, even though the footer uses "DEV Community" as the social link title).
- **ARIA labels**: verb-first imperative ("Open menu", "Close menu", "Close", "Select theme", "Logo") or literal ("Picture of myself").

---

## 4. Terminology

### Project glossary

| Term | Use | Don't use |
|---|---|---|
| MPA | On identity surfaces (home hero, current employer line). This is the current legal name. | "Healthy Labs" |
| Formerly Healthy Labs | On record surfaces (career entry description) as the first line of the MPA job, rendered in the auxiliary color. Signals the rebrand to anyone who knew the company under its old name. | Omitting the old name entirely |
| André Silva | Full name. Used once in the home hero and in page title suffixes (`About \| André Silva`). | "Andre Silva" (no accent), "André L. Silva" |
| 9+ years | Current experience count. Update when a new year passes. | Lower counts that became stale |
| Senior Engineer | Current title. | "Senior Software Engineer" (the site shortens it) |
| Front-end | Hyphenated when used as a modifier or noun ("Front-end Engineer", "front-end engineers"). | "Frontend", "front end" |
| end-to-end | Hyphenated, lowercase. | "End to End", "end 2 end" |
| dev.to | Lowercase, as the platform brands itself. | "Dev.to", "DEV.to" |
| DEV Community | Only as the social/footer link title for the dev.to profile. | Elsewhere in body copy (use "dev.to") |
| Home, About, Articles, Career, Projects | The five nav labels. Each a single word, always in this order in the menu source. | Pluralizing "About", synonyms like "Work" for "Career" |

### Technical terms, plain language

The audience is technical. Technology names, framework names, and integration names are used without explanation. Jargon specific to engineering is fine: "multi-agent AI assistant", "preview orchestration server", "in-browser devtools panel", "lead compliance integrations". If a term reads as opaque even to an engineer, name the concrete outcome alongside it (e.g., "Built a preview orchestration server using WebSockets and Docker for instant CMS previews without deployment").

Acronyms are used without gloss when they are industry-standard (CMS, SDK, API). Less-standard acronyms are either spelled out on first use ("Artificial Neural Network") or paired with the full name in parentheses (e.g., "Regional Accounting Council (CRCMG)", "Federal Council of Engineering and Agronomy (CONFEA)").

### Dates and locations

- **Date format in the UI**: `MMM YYYY` via `Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' })`. Rendered in the `caption` variant (uppercase by CSS), so the source reads "Apr 2025" and displays as "APR 2025".
- **Ongoing roles**: `endDate` is omitted; the UI substitutes `Present`. Write copy as if the range will render "Apr 2025 — Present".
- **Locale**: dates, numbers, and all copy are American English (`en-US`). The site is in English, not Portuguese, despite André being from Florianópolis, Brazil.
- **Locations**: individual locations (city, country) are **not** shown in the career entries. Past clients' locations appear only when they are part of the work's noun (e.g., "the City Hall of Francisco Beltrão"). Do not add "Florianópolis, Brazil" or remote/hybrid indicators to new entries unless the user explicitly requests it.

---

## 5. Content Patterns

### Page titles (HTML `<title>`)

Format: `{Page} | André Silva`. The home page uses just `André Silva`.

- `André Silva` (home)
- `About | André Silva`
- `Career | André Silva`
- `Projects | André Silva`
- `Articles | André Silva`

### Page headings (`<h1>` / `<h2-mono>`)

One word, rendered in the monospaced uppercase `h2-mono` style. Matches the nav label exactly. The home page has no section heading — the hero `h1` is the person's name.

Sub-section headings on a page (e.g., Projects) use the `h3` style and are Title Case: "Featured Projects", "All Projects".

### Hero (home page)

```
André Silva
Senior Engineer @ MPA
Software engineer with 9+ years of experience building web platforms, internal tools, and developer tooling
```

Three blocks, no terminal period on the third line (it is a resume-style summary, not a sentence). The `@` in "Senior Engineer @ MPA" is the literal at-sign with spaces around it.

### About paragraph pattern

Three short paragraphs, each starting with a subject-less verb. Selected phrases are bolded (`<strong>`) to create scan-anchors: years of experience, platform categories, ways of working, core tech stack, and credentials. Bolding is **sparing and semantic** — it highlights the answer a recruiter or peer is scanning for, never decorative.

```
[Summary sentence with bolded specializations]
[How-they-work sentence with bolded tech stack and soft skills]
[Credentials sentence with bolded degrees/certs]
[Download Resume button]
```

### Career entry pattern

```
{MMM YYYY} — {MMM YYYY | Present}

{Title} @ {Company}
{Optional: "Formerly X" muted line for renamed employers}
- {Past-tense verb} {what was built/done} {optional: tool or context}
- {...}
{Optional: project links}
{Technology chips}
```

Bullet rules:
- Start with a **past-tense action verb**: Developed, Built, Implemented, Migrated, Upgraded, Achieved, Contributed, Improved, Deployed, Mentored, Worked, Analyzed, Tracked, Planned.
- Name the artifact (what was built) before the scope (where/for whom).
- Mention the tech stack only when it is load-bearing to the story; otherwise rely on the chip list at the bottom.
- Quantify when the number is real ("74% increase in the performance of a key page", "over 20 million monthly visits"). Never invent numbers or hedge with "significantly".
- One clause per bullet. Prefer three to five bullets per role.

### Project card pattern

Projects have a single-sentence description with **no terminal period**. Sentences are often noun phrases ("Images as Code. Write JSX, export as images") or imperatives ("Integrate Spotify App Remote SDK into your NativeScript app"). A few use a relative clause ("A collaborative application for notification of criminal occurrences in real-time").

Patterns observed:
- **Declarative noun phrase**: "Hotspot voucher printer via MikroTik RouterBoard API"
- **Two short clauses joined by period, no trailing period**: "Images as Code. Write JSX, export as images"
- **Descriptive "A ..." / "An ..." phrase**: "A minimal app that helps you follow the 20-20-20 rule and rest your eyes while working"
- **Meta-description for the site itself**: "The personal website that you are seeing right now"

Avoid marketing adjectives in descriptions ("beautiful", "powerful", "cutting-edge"). Name the category and the mechanism.

### Article card pattern

Pulled from the dev.to API, so titles and tags come from the external source and are not edited here. The surrounding UI copy is fixed:

- Date: `{medium date}` via `Intl.DateTimeFormat('en-US', { dateStyle: 'medium' })`
- Reading time: `{n} min read` on desktop, `{n} min` on mobile
- Comments: `1 comment` / `{n} comments`
- Reactions: `1 reaction` / `{n} reactions`
- Call-through: `Read on dev.to`

Pluralization is explicit — singular and plural forms are both spelled out, not shortened to `comment(s)`.

### Footer pattern

Social icon links only. Each has a `title` attribute used as the tooltip — the tooltip text is the channel name:

- GitHub
- LinkedIn
- X
- DEV Community
- E-mail
- Instagram

Hyphenation: "E-mail" with a hyphen and a capital E. The mailto target is `hello@andresilva.cc` — that address is canonical; do not substitute a different address without checking with André.

### 404 page

```
[Icon: SmileyXEyes]
404
Oops, this page doesn't exist.
```

Short, warm, no CTA. No "go home" button — the nav already offers that. Keep future error copy in this register: one short apologetic sentence, lowercase "oops", contraction, period.

### Theme selector

A palette icon with an `aria-label="Select theme"`. Menu items show the theme name as proper noun: `Default`, `Dracula`, `Monokai`, `Terminal`. No descriptions, no previews in text — the user sees the theme by selecting it.

### CTAs (calls to action)

- **Primary action button**: `Download Resume` — verb + object, Title Case, renders uppercase via CSS.
- **Navigation links**: single-word page names.
- **"Read on dev.to"** on article cards.

There are no marketing CTAs ("Get in touch", "Hire me", "Let's build something") — the site is a presence, not a funnel. Contact happens via the E-mail icon in the footer.

---

## 6. Accessibility Copy

The site uses `aria-label` and `title` attributes throughout. Conventions:

- **aria-label** is verb-first for actions (`Open menu`, `Close menu`, `Close`, `Select theme`) and literal for static elements (`Logo`, `Picture of myself`).
- **title** on footer icons is the channel name exactly as it appears in the social glossary (`GitHub`, `LinkedIn`, `X`, `DEV Community`, `E-mail`, `Instagram`).
- **alt text** is descriptive and first-person where the image is of André (`Picture of myself`). It is not SEO-stuffed.

When adding new interactive elements, give them an `aria-label` in the same register.

---

## 7. When the Guide Doesn't Cover It

This guide is derived from what is already on the site. If you hit a surface or situation it doesn't cover:

1. Default to the **plainest, most concrete phrasing** consistent with the About and Career copy.
2. Prefer the **subject-less verb** construction on any personal/bio surface.
3. Prefer **no terminal period** on short labels, single-line descriptions, and cards.
4. Prefer **past tense** for completed work, **present tense** for ongoing facts.
5. If the question is about a term (old employer, title, casing of a tech name), look at how it is already written elsewhere on the site before inventing a new form. Consistency with the existing copy beats any aesthetic judgment.

When in doubt, ask André.
