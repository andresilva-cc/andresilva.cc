# Copy Style Guide: andresilva.cc

A personal site, not a product. The voice belongs to André; this guide exists to keep new copy aligned with the copy already shipped across the five page mocks (`redesign/{home,about,career,projects,articles}.html`).

The guide is **descriptive** — it captures what is. When a surface comes up that the guide doesn’t cover, default to the plainest construction consistent with what is already there, then extend the guide.

---

## 1. Voice

### Register

- **Terse mono.** Short sentences, one clause where possible. The whole site is set in JetBrains Mono, and the prose is written to match — closer to a README than to a landing page.
- **Technical-honest.** Achievements are stated, not sold. "Software engineer with 9+ years of experience..." — not "Welcome! I’m passionate about...". Numbers are real or they’re not used ("74% increase", "20 million monthly visits").
- **First-person omitted.** On personal surfaces the subject ("André" / "I") is dropped; sentences start with the verb ("Works end-to-end…", "Holds a BS in Computer Science…"). Exceptions: about-page eyebrow `// 01 / in my own words` and `// 02 / where i studied` use the first person diegetically inside the eyebrow phrase (rendered lowercase per §2 casing).
- **Past tense for completed work; present tense for ongoing facts.** Career bullets are past tense ("Developed", "Migrated", "Achieved"). The About bio is present ("Works", "Takes", "Holds").
- **Three adjectives**: understated, concrete, technical-peer.

### Sound like / don’t sound like

| Sound like | Don’t sound like |
|---|---|
| "Software engineer with 9+ years of experience building web platforms, internal tools, and developer tooling." | "Passionate engineer crafting world-class digital experiences." |
| "Achieved a 74% increase in the performance of a key page" | "Dramatically accelerated page performance" |
| "Download résumé" | "Get the PDF" / "Grab my CV" |
| "hello@andresilva.cc" | "Connect with me" / "Let’s build something great together" |
| "// formerly Healthy Labs" | "Healthy Labs (now MPA)" / "ex-Healthy Labs" |
| "The personal website that you are seeing right now" | "A sleek, modern portfolio experience" |

### What we don’t do

- No testimonials, no social proof slabs, no "trusted by" logos.
- No "let’s build something together" CTA energy. There is no funnel; the email link in the footer is the contact path.
- No "passionate about X" / "world-class" / "cutting-edge" / "game-changing".
- No emoji in body copy. (One easter-egg `console.log` aside lives in the source; that’s the only exception.)
- No exclamation marks in user-facing prose.

---

## 2. Eyebrows — the `// NN / phrase` pattern

Every section band on a page carries a small uppercase accent-colored eyebrow above the H2, rendered by `.comment-tag` with `letter-spacing: 0.12em–0.16em` and `text-transform: uppercase`. The source string is **lowercase** mono with a leading `// NN / ` prefix.

### Format

```
// NN / phrase
```

- `NN` is a zero-padded two-digit section number, counted within the page (`01`, `02`, `03`, `04`). Numbering restarts per page.
- A single space on each side of the inner slash.
- `phrase` is short (2–6 words), lowercase, no terminal punctuation, an **evocative gloss** of the section’s purpose. Not a synonym for the H2.

### Inventory (current)

| Page | Eyebrow | H2 it precedes |
|---|---|---|
| home | `// 01 / who` | Bio |
| home | `// 02 / what i’m doing now` | Latest |
| about | `// 01 / in my own words` | Bio |
| about | `// 02 / where i studied` | Education |
| about | `// 03 / at a glance` | Facts |
| about | `// 04 / full work history` | Resume |
| design-system | `// 00 / how the site is built` | (cover) |
| design-system | `// 01 / what we won’t compromise on` | Design principles |
| design-system | `// 02 / how the page is colored` | Color |
| design-system | `// 03 / how the words look` | Typography |

### The "different from the title" rule

The eyebrow must say something **semantically distinct** from the H2 it labels. A test: read the eyebrow aloud, then the H2. If the eyebrow is a synonym ("// 02 / education" → `Education`), rewrite. If it adds an angle ("// 02 / where i studied" → `Education`), keep.

### Casing inside the phrase

**Lowercase everywhere** — including the first-person pronoun (`i`, `i’m`, `i’ve`). The eyebrow reads as a system-voice mannerism, not standard prose. Contractions use the curly apostrophe. See §3.

---

## 3. Typographic conventions

### Em-dashes (`—`, U+2014)

Used for two things, both with surrounding spaces:

1. **Parenthetical asides in prose.** `Works end-to-end — from architecture and infrastructure to product features and integrations.`
2. **Date ranges.** `apr 2025 — now`, `jan 2024 — apr 2025`, `mar 2017 — dec 2018`.

The mono font widens the dash visually, but the em-dash is the right glyph for both jobs and the typographic trade-off is accepted on purpose. Do not substitute en-dashes, hyphen-minuses, or `--`.

### Curly apostrophes (`’`, U+2019) and quotes (`“ ”`, U+201C/U+201D)

Always. `André’s`, `i’m`, `won’t`, `you’re`. In HTML source, use the entity `&#x2019;` (or the literal `’`). Straight `'` and `"` are reserved for HTML attributes and code. The design-system principle 09 is the canonical rule.

### Accented characters

- `André` — capital A, lowercase ndré, acute accent on the `e`. Never `Andre`, never `André L. Silva`.
- `résumé` — two acute accents, lowercase. The download button reads `Download résumé`. Never `resume` (English noun "resume" reads as the verb).
- `Florianópolis` — acute on the `o`.

### Sentence case

- **Eyebrows**: lowercase (rendered uppercase by CSS).
- **Page titles in `<title>`**: `André Silva · {Page}` with the page word in title case (`About`, `Career`, `Projects`, `Articles`). The separator is a middle dot (`·`, U+00B7) with one space on each side. **Home is just `André Silva`** — the brand alone, no page suffix (standard home-page convention).
- **Nav labels**: lowercase, single word, in source. The active page is wrapped in square brackets (`[home]`) — that’s a render decoration, not a copy variant; the underlying string is still `home`.
- **Page H1** (about/career/projects/articles): rendered as `<{NAME} />` using pixel font, with the page name in **uppercase** — e.g. `<ABOUT />`, `<CAREER />`. The angle braces are decorative (rendered via `.brace`) and the inner text is the literal page word in caps. Home’s H1 is the person’s name in pixel-display: `André Silva`.
- **Section H2** (`Bio`, `Latest`, `Education`, `Facts`, `Resume`): title case if multi-word, sentence case for single words.
- **Career role titles**, **project titles**, **article titles**: title case (`Senior Engineer`, `Senior Front-end Engineer`, `Marketplace Bridge`). Project titles taken from the static repository (`andresilva.cc`, `poc-vue-universal-component`) keep their canonical casing.

### Badges — UPPERCASE

Three badge contexts; all are written in title case in source and uppercased by `text-transform`:

- **Latest row badges** on home: `Career`, `Project`, `Article` → renders `CAREER` / `PROJECT` / `ARTICLE` with `letter-spacing: 0.12em`.
- **Featured badge** on project cards: `Featured` → renders `FEATURED`.
- **Skip link**: `Skip to main` → renders uppercase.

### Accent placement — the primary-noun rule

Cross-reference design system principle 01. The lime accent (`--accent`) lands on the **primary noun of the surface**:

- **Home hero**: it’s an identity statement ("I am a Senior Engineer at MPA"), so the **position** (`Senior Engineer`) carries the accent.
- **Career list**: it’s a comparative timeline, so the **company** (`MPA`, `Atlas Technologies`, `Nuxstep`, `Grupo Gmaes`) carries the accent.
- **Latest rows** on home: the **badge** (`CAREER` / `PROJECT` / `ARTICLE`) carries the accent; row content is `--hi`.
- **Projects featured cards**: the **badge** (`FEATURED`) carries the accent; titles are `--hi`.
- **Inline highlights**: `strong.acc` is used sparingly for true numerical highlights ("74% increase", "20 million monthly visits") and for the bio’s `9+ years of experience` strong-tag pattern. Reach for it when a recruiter would underline the phrase.

When adding new copy, ask: what is this surface’s primary noun? Tint that, not anything else.

---

## 4. Casing rules (quick reference)

| Surface | Casing in source | What renders |
|---|---|---|
| Nav links | lowercase (`home`, `about`) | lowercase, active wrapped `[home]` |
| Page H1 | UPPERCASE inside braces (`<ABOUT />`) | uppercase pixel |
| Section H2 | Sentence/title case (`Bio`, `Featured Projects`) | as written |
| Eyebrow | lowercase (`// 01 / who`) | uppercase mono |
| Row badge (home Latest) | Title case (`Career`) | UPPERCASE |
| Featured badge (projects) | Title case (`Featured`) | UPPERCASE |
| Tech-stack chips | **canonical brand case** (`TypeScript`, `Vue.js`, `Node.js`, `Tailwind CSS`, `Next.js`) | as written |
| Article tags | **lowercase from dev.to** (`vue`, `nuxt`, `webperf`, `frontend`, `javascript`) | as written |
| Career dates | lowercase mono (`apr 2025 — now`) | as written |
| Career role title | Title case (`Senior Front-end Engineer`) | as written |
| Footer links | lowercase (`github`, `linkedin`, `dev.to`, `email`) | as written |
| Button CTAs | Sentence case (`Download résumé`) | UPPERCASE via CSS |
| Project link labels | lowercase generics (`site`, `github`) or canonical repo names (`eyesup-web`, `oac-api`, `NativeScript Spotify`, `CONFEA`) | as written |

### Tech-stack chips — canonical brand case

These are brand names. Use the vendor’s preferred form: `TypeScript`, `JavaScript`, `Vue.js`, `Nuxt`, `React`, `Node.js`, `Tailwind CSS`, `Next.js`, `Pinia`, `Vuex`, `Vuetify`, `Vuesax`, `Jest`, `Vitest`, `Storybook`, `NativeScript`, `Drupal`, `Sequelize`, `Express`, `Konva`, `Sass`, `Shell Script`, `Linux`, `Windows Server`, `Adobe XD`, `Laravel`, `Lerna`, `TanStack`, `AI SDK`, `WebSocket`, `Pug.js`, `SEO`.

### Article tags — lowercase

Tags come from the dev.to / forem API and render lowercase by data, not by editorial choice. Don’t title-case them, don’t pluralize them, don’t edit them. `vue`, `nuxt`, `webperf`, `frontend`, `javascript`, `webdev`, `performance`.

---

## 5. "site" vs "website"

**System voice uses `site`.** Anywhere the site itself refers to itself in microcopy — link labels, footer text, ARIA, button labels — use `site`.

- Project card link label: `site →` (the live URL)
- Source-of-truth note in docs: "the site"

**`website` only appears in protected verbatim data copy.** Specifically the andresilva.cc project description pulled from `static-projects-repository`:

> "The personal website that you are seeing right now"

That string is part of the data source and must not be editorialized into `"site"`. Same protection applies to data-sourced project descriptions that say `website` (e.g. the CONFEA and CRCMG entries: "The new website of …").

If new project data is added, mirror whatever convention the static repository uses. If new system copy is added, use `site`.

---

## 6. Content sourcing — never invent

All page content is wired to real sources. The copywriter does not invent:

| Surface | Source | Notes |
|---|---|---|
| Home hero, name, role | `src/app/about/page.tsx` (bio export) | `Senior Engineer` + `MPA` + 9+ years pitch |
| Home Latest rows | Composed from career[0], featured project[0], article[0] | Reuse the canonical strings from each source |
| About bio paragraphs | `src/app/about/page.tsx` | Three paragraphs; second-pass copy edits go here |
| About education entries | `src/app/about/page.tsx` (or its `educationEntries` array) | Title + institution + dates + 1-sentence desc |
| About facts grid | `src/app/about/page.tsx` (facts array) | location / timezone / languages / interests |
| Career roles | `static-jobs-repository` | Title, company, dates, bullets, chip list, refs |
| Project cards | `static-projects-repository` | Title, description, chips, links — verbatim, no editing |
| Article cards | dev.to / forem API | Title, date, reading time, tags, comment/reaction counts — pulled live |
| Article meta description | dev.to API (`description` field) | Falls back to the lead paragraph from `body_markdown` if absent |

The number `9+ years` is the only field that drifts with time; update at `src/app/about/page.tsx` and let it propagate. Do not bump the number in the copy guide alone.

---

## 7. Microcopy inventory

Authoritative quick-reference for currently-shipped strings.

### Page titles (`<title>`)

```
André Silva
André Silva · About
André Silva · Career
André Silva · Projects
André Silva · Articles
```

Separator: middle dot (`·`, U+00B7), space on each side. Home includes `· Home` (departure from the prior `André Silva`-only convention — confirmed in the redesign).

### Skip link

```
Skip to main
```

### Nav (source / rendered active)

```
home  →  [home]
about →  [about]
career →  [career]
projects → [projects]
articles → [articles]
```

### Home hero

```
André Silva
Senior Engineer @ MPA
Software engineer with 9+ years of experience building web platforms, internal tools, and developer tooling.
```

Pitch has a terminal period; the role line has the literal `@` with `--lo` color and spacing.

### Home Latest

- Section eyebrow: `// 02 / what i’m doing now`
- Row badges (source → render): `Career` → `CAREER`, `Project` → `PROJECT`, `Article` → `ARTICLE`
- Each row is the full click target; the arrow icon carries the affordance. No visible "Read more" text.

### About — résumé section

- Eyebrow: `// 04 / full work history`
- Button label: `Download résumé`
- Button arrow: `→`
- The button source is title case; CSS uppercases it.

### About — education

- Institution + date line format: `{Institution} · {YYYY} — {YYYY}` (middle dot separator, em-dash between years).

### About — facts

Key/value pairs, key uppercased by CSS, value sentence-cased.

```
location   → Florianópolis, BR
timezone   → UTC-03
languages  → Portuguese (native) · English (fluent)
interests  → DX tooling · web performance · type systems
```

The middle dot `·` separates items in a single value.

### Career

- Page H1: `<CAREER />`
- Current role date string: `apr 2025 — now` (lowercase month abbreviation, lowercase "now"). Past roles: `jan 2024 — apr 2025`.
- Status dot ARIA: `current role`.
- "Formerly" marker: `// formerly Healthy Labs` — rendered italic and `--lo` muted, source lowercase, prefix mirrors the eyebrow `//`.
- Bullet glyph: `+` in accent (CSS); the bullet text itself starts with a past-tense verb.

### Projects

- Page H1: `<PROJECTS />`
- Featured badge source: `Featured` (renders `FEATURED`)
- Link labels: lowercase generic (`site`, `github`) when there’s one link; canonical repo / project names (`eyesup-web`, `eyesup-sync`, `oac-api`, `oac-frontend`, `teseu-app`, `teseu-api`, `teseu-web`, `NativeScript Spotify`, `CONFEA`) when there are multiple. Arrow `→` follows each.

### Articles

- Page H1: `<ARTICLES />`
- Article meta line: `{date} · {n} min · {n} ♥ · {n} comment` joined by middle dots.
- Date format: `YYYY.MM.DD` for the meta strip on cards. (Distinct from the career page’s `mmm YYYY` date string.)
- Read-through label: `read on dev.to` (lowercase, no period, arrow follows).
- Comments / reactions pluralization is rendered by data, not editorial — `1 comment` / `2 comments`, `1 reaction` / `11 reactions` (or `♥` short form in the meta strip).

### Footer

```
github · linkedin · dev.to · email
```

Lowercase, middle-dot separators (`·` colored `--lo`, padded), `email` resolves to `mailto:hello@andresilva.cc`.

### 404 (carried over from production)

```
404
Oops, this page doesn’t exist.
```

Short, contractioned, lowercase "oops", curly apostrophe, period. No CTA.

### ARIA / accessibility labels

| Element | Label |
|---|---|
| Status dot (home + career current role) | `current role` |
| About photo wrapper | `Portrait of André Silva — focus or tap to reveal natural color` |
| About photo `alt` | `Portrait of André Silva` |
| Header nav | `Primary` |
| Career section | `Career` |
| Projects section | `Projects` |
| Articles section | `Articles` |
| Row CTA (home Latest) | `Read more` |
| Skip link target | `#main` |

When adding an interactive element with no visible text, give it a verb-first ARIA label (`Open menu`, `Close menu`, `Select theme`) or a literal noun (`Logo`, `Portrait of André Silva`).

---

## 8. Examples — before / after

Quick pattern matches for the most common slips:

| Don’t | Do | Why |
|---|---|---|
| `Get the PDF` | `Download résumé` | Verb + object, canonical artifact name, accent on the diacritic. |
| `Connect with me` | `hello@andresilva.cc` | No funnel; the email address is the surface. |
| `My personal website` | (data) `The personal website that you are seeing right now` | Protected verbatim copy from the static repo. |
| `andresilva.cc — your future favorite portfolio` | `André Silva` (home) / `André Silva · About` (others) | Brand alone on home; brand + dot + page on interior surfaces. |
| `// 02 / latest` | `// 02 / what i’m doing now` | Eyebrow must differ from the H2 it labels. |
| `// 01 / About me` | `// 01 / in my own words` | Lowercase, evocative gloss, no terminal punctuation. |
| `Read full bio →` | `Full bio →` | Page-section link arrow uses bare noun. |
| `Healthy Labs (now MPA)` | `MPA` on identity surfaces + `// formerly Healthy Labs` on the career record | Rebrand convention; identity is current, record carries the trace. |
| `Andre Silva` / `André L. Silva` | `André Silva` | Canonical full name; one accent; no middle initial on the site. |
| `Apr 2025 - Present` | `apr 2025 — now` | Lowercase month, em-dash with spaces, lowercase "now". |
| `Resume` (button) | `Download résumé` | Diacritics avoid the noun/verb collision; verb-first label. |
| `Tailwind` (chip) | `Tailwind CSS` | Brand name. |
| `Vue` (chip) | `Vue.js` | Brand name. |
| `Webperf` (article tag) | `webperf` | Article tags are lowercase from the data source. |
| `Game-changing performance work` | `Achieved a 74% increase in the performance of a key page` | Numbers over adjectives. |
| `Passionate about building great software` | `Works end-to-end — from architecture and infrastructure to product features and integrations.` | Subject-less, concrete, em-dash aside. |
| `Click here →` | `site →` / `github →` / `Full bio →` | Link label names the destination, not the action. |

---

## 9. When the guide doesn’t cover it

1. Default to the **plainest, most concrete phrasing** consistent with the existing About and Career copy.
2. Prefer the **subject-less verb** on any personal/bio surface.
3. Prefer **no terminal period** on labels, single-line card descriptions, and chip lists; **terminal period** on full prose sentences and the bio pitch.
4. Prefer **past tense** for completed work and **present tense** for ongoing facts.
5. When picking casing for a tech name, check what is already shipped in `static-jobs-repository` / `static-projects-repository` before inventing a form.
6. When in doubt, ask André.
