# Copy Style Guide: andresilva.cc

A personal site, not a product. The voice belongs to André; this guide exists to keep new copy aligned with the copy already shipped across the site's five pages.

The guide is **descriptive** — it captures what is. When a surface comes up that the guide doesn’t cover, default to the plainest construction consistent with what is already there, then extend the guide.

---

## 1. Voice

### Register

- **Terse mono.** Short sentences, one clause where possible. The whole site is set in JetBrains Mono, and the prose is written to match — closer to a README than to a landing page.
- **Technical-honest.** Achievements are stated, not sold. "Software engineer with 9+ years of experience..." — not "Welcome! I’m passionate about...". Numbers are real or they’re not used ("74% increase", "20 million monthly visits").
- **First-person omitted.** On personal surfaces the subject ("André" / "I") is dropped; sentences start with the verb ("Works end-to-end…", "Holds a BS in Computer Science…"). Exceptions: about-page eyebrow `// 01 / in my own words` and `// 02 / where i studied` use the first person diegetically inside the eyebrow phrase (rendered lowercase per §2 casing).
- **Past tense for completed work; present tense for ongoing facts.** Career bullets are past tense ("Developed", "Migrated", "Achieved"). The About bio is present ("Works", "Takes", "Holds").
- **State the fact and stop.** Once the fact is stated, end the sentence — no significance-closer clause, no "so-what" editorializing, no metaphor explaining why it matters. The bio says "Holds a BS in Computer Science" and trusts the reader to weigh it; copy that adds "— a foundation that shapes everything I build" has drifted into promotion. If a clause only exists to tell the reader the preceding fact is important, cut it.
- **Three adjectives**: understated, concrete, technical-peer.

### Sound like / don’t sound like

| Sound like | Don’t sound like |
|---|---|
| "Software engineer with 9+ years of experience building web platforms, internal tools, and developer tooling." | "Passionate engineer crafting world-class digital experiences." |
| "Achieved a 74% increase in the performance of a key page" | "Dramatically accelerated page performance" |
| "Download resume" | "Get the PDF" / "Grab my CV" |
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
| home | `// 01 / current focus` | Now |
| home | `// 02 / recent activity` | Latest |
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
- `Florianópolis` — acute on the `o`.

### "resume" — no accents

The download artifact is spelled **`resume`** — plain ASCII, no acute accents. The About download button reads `Download resume`. Never `résumé`.

Rationale: the accented form was dropped deliberately in the redesign. The plain spelling matches the artifact filename (`resume.pdf`), avoids diacritic inconsistency across the site, and fits the terse system register — the simpler form is the more honest one. The noun/verb collision the accented form once guarded against is a non-issue in context: the word always rides a `Download` verb, so it can only read as the noun.

### Sentence case

- **Eyebrows**: lowercase (rendered uppercase by CSS).
- **Page titles in `<title>`** follow a **split convention**:
  - **Home**: just `André Silva` — the brand alone, no page suffix (standard home-page convention).
  - **Index / section pages** (About, Career, Projects, Articles, Notes, 404): `André Silva · {Page}` — **brand-first, middle dot** (`·`, U+00B7) with one space on each side, page word in title case.
  - **Detail pages** (individual notes, and any future per-item page): `{Title} | André Silva` — **title-first, pipe** (`|`) with one space on each side. The detail's own title leads so it's the part the browser tab shows when truncated; the brand follows.

  The split is intentional, not a drift: index titles read as system labels (brand → section), detail titles read as content references (title → brand). Matches what's shipped in `src/app/(site)/articles/page.tsx` (index, dot) and `src/app/(site)/articles/[slug]/page.tsx` (detail, pipe). When adding a new surface, decide whether it's an index or a detail and pick the matching form.
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
| Eyebrow | lowercase (`// 01 / current focus`) | uppercase mono |
| Row badge (home Latest) | Title case (`Career`) | UPPERCASE |
| Featured badge (projects) | Title case (`Featured`) | UPPERCASE |
| Tech-stack chips | **canonical brand case** (`TypeScript`, `Vue.js`, `Node.js`, `Tailwind CSS`, `Next.js`) | as written |
| Article tags | **canonical brand case, rendered verbatim** (`Vue.js`, `Nuxt`, `LLMs`, `Next.js`, `SSR`, `Performance`) | as written |
| Career dates | lowercase mono (`apr 2025 — now`) | as written |
| Career role title | Title case (`Senior Front-end Engineer`) | as written |
| Footer links | lowercase (`github`, `linkedin`, `dev.to`, `x`, `instagram`, `email`) | as written |
| Button CTAs | Sentence case (`Download resume`) | UPPERCASE via CSS |
| Project link labels | lowercase generics (`site`, `github`) or canonical repo names (`eyesup-web`, `oac-api`, `NativeScript Spotify`, `CONFEA`) | as written |
| Note titles | Sentence case (`Specialists vs generalists`) | as written |
| Note `kind` (frontmatter + meta line) | lowercase mono (`til`, `take`, `snippet`, `aside`) | as written |

### Tech-stack chips — canonical brand case

These are brand names. Use the vendor’s preferred form: `TypeScript`, `JavaScript`, `Vue.js`, `Nuxt`, `React`, `Node.js`, `Tailwind CSS`, `Next.js`, `Pinia`, `Vuex`, `Vuetify`, `Vuesax`, `Jest`, `Vitest`, `Storybook`, `NativeScript`, `Drupal`, `Sequelize`, `Express`, `Konva`, `Sass`, `Shell Script`, `Linux`, `Windows Server`, `Adobe XD`, `Laravel`, `Lerna`, `TanStack`, `AI SDK`, `WebSocket`, `Pug.js`, `SEO`.

### Article tags — brand case and selection

Tags are chosen editorially and rendered **verbatim** — the Tag component does not transform case. Write `Vue.js`, `Nuxt`, `LLMs`, `Next.js`, `SSR`, `Performance` exactly as the brand does. See `articles-decision-log.md §4.1` for the schema-level convention.

**Selection rules:**

1. **Generic tags are noise.** `Frontend`, `Web Development`, `JavaScript` describe the whole site, not the article — cut them. `JavaScript` earns a slot only when the article is *about* the language (closures, runtimes, spec quirks), not when it merely uses JS.

2. **Stack tags earn their place only when swapping them invalidates the article.** A Nuxt-specific war story keeps `Nuxt` + `Vue.js`. An article that uses Nuxt as a demo vehicle for a conceptual topic keeps `Nuxt` and drops `Vue.js`.

3. **Default = 3 tags; 2–4 is the sweet spot.** One under-specifies; five or more reads as SEO panic.

4. **Tag ≠ subtitle.** `Rendering` (the category), not `Rendering Modes` (echoes the title). Shorter is honest.

5. **Lead chip = most specific.** Array order drives render order; sort specific → general.

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

**Index / section pages** — brand-first, middle-dot separator:

```
André Silva
André Silva · About
André Silva · Career
André Silva · Projects
André Silva · Articles
André Silva · Notes
André Silva · Not Found
```

Separator: middle dot (`·`, U+00B7), space on each side. **Home is just `André Silva`** — the brand alone, no page suffix (standard home-page convention; agrees with §3). Interior index pages append `· {Page}` with the page word in title case. The 404 surface uses `· Not Found` (title case, mirroring the H2 below).

**Detail pages** — title-first, pipe separator:

```
{Article Title} | André Silva
{Note Title} | André Silva
```

Separator: pipe (`|`) with single spaces. The content title leads so a truncated browser tab still surfaces the per-item identity; the brand follows. Matches what's shipped (`src/app/(site)/articles/[slug]/page.tsx`). See §3 for the rationale.

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
notes → [notes]
```

### Home hero

```
André Silva
Senior Engineer @ MPA
Software engineer with 9+ years of experience building web platforms, internal tools, and developer tooling.
```

Pitch has a terminal period; the role line has the literal `@` with `--lo` color and spacing.

The pitch is **canonical** — it is reused verbatim in the meta description and OG description (see §6). When it changes, it changes everywhere; don't paraphrase it per surface.

### Home — Now

- Section eyebrow: `// 01 / current focus`
- Section H2: `Now`
- Section body: a single `<Text variant="body">` prose paragraph — a **temporal snapshot of current parallel work**. Currently shipped:

  > These days, three builds in parallel: **Calcloak**, a side project overdue for a finish line; **Infinity**, a collaboration; and the redesign of this site. Day job is at **MPA** — shipping features end-to-end with Claude Code, which has rearranged how the work gets done more than any framework has.

Voice constraints, same as the bio surfaces (§1): subject-less verbs, present tense, a soft temporal anchor (`These days`) rather than a dated one. Named projects are specific and real — no vague "various projects". The anchor stays cadence-flexible: no month, week, or "currently" that pins the paragraph to a calendar date. A 3-month-old paragraph should still read as honest.

Inline links: named projects link directly to their product sites via `<InlineLink>` wrapped in `<strong>` — `Calcloak` → calcloak.com, `Infinity` → meet.agentairforce.com. Link the project name itself, not a separate "see it here" label (cross-reference §8, "Click here").

No `Full bio →` CTA. The old Bio section carried one; Now does not — the section is self-contained.

**Maintenance note.** This is the one section on the site whose copy goes stale by design. The body paragraph is **not canonical** — unlike the hero pitch (verbatim across meta/OG), the Now paragraph is meant to be rewritten as the current work changes. Refresh it when the parallel builds shift — roughly every 3–6 months. Because the eyebrow says `current focus` and the prose carries no calendar reference, a paragraph a few months out of date still reads true; a hard-dated one would not.

### Home Latest

- Section eyebrow: `// 02 / recent activity`
- Row badges (source → render): `Career` → `CAREER`, `Project` → `PROJECT`, `Article` → `ARTICLE`
- Each row is the full click target; the arrow icon carries the affordance. No visible "Read more" text.

### About — resume section

- Eyebrow: `// 04 / full work history`
- Button label: `Download resume` (plain spelling, no accents — see §3)
- Button arrow: `→`
- The button source is sentence case; CSS uppercases it.

### About — education

- Institution + date line format: `{Institution} · {YYYY} — {YYYY}` (middle dot separator, em-dash between years).

### About — facts

Key/value pairs, key uppercased by CSS, value sentence-cased.

```
location   → Florianópolis, BR
timezone   → UTC-03
languages  → Portuguese (native) · English (fluent)
interests  → agentic workflows · user-facing AI · developer tooling
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

### Notes

- Page H1: `<NOTES />` (caps, brace-wrapped, mirrors `<ARTICLES />`).
- Nav label: `notes` (lowercase, single word — slots into `home · about · career · projects · articles · notes`).
- Latest row badge (home): source `Note` → renders `NOTE` (mirrors `Career` / `Project` / `Article`).
- Meta line format: `{YYYY.MM.DD} · {kind}` — ISO date period-separated, middle dot (`·`, U+00B7) with single spaces, lowercase mono `kind` word.
  - Example: `2026.05.21 · til`
- Permalink affordance on each block: `permalink` (lowercase, no period, arrow follows). ARIA label: `permalink to {note title}` — the visible word is too generic out of context.
- Detail-page back-links (top + bottom): `back to notes`.
- Detail-page prev/next labels: `older · {title}` (left, points to chronologically older note) and `{title} · newer` (right, points to chronologically newer note). Middle dot is the conjunction; the role word stays adjacent to its arrow.
- Index paginator: `← older notes` / `newer notes →`, separated from a `page {n} of {total}` label by middle dots. Absent at boundaries — no disabled state.
- Empty state (`/notes` when zero notes): `No notes yet.` — exact match for the articles empty-state pattern.
- Page title `<title>` (index): `André Silva · Notes` — index convention, brand-first middle-dot, same as Articles.
- Detail-page `<title>`: `{Note Title} | André Silva` — **detail convention, title-first pipe** (see §3 split rule). Matches what `src/app/(site)/articles/[slug]/page.tsx` ships for article detail. The note title is sentence case per §8.2; truncate to ~60 chars if longer for browser-tab fit.

### Footer

```
github · linkedin · dev.to · x · instagram · email
```

Six links, in that order. Lowercase, middle-dot separators (`·` colored `--lo`, padded), `email` resolves to `mailto:hello@andresilva.cc`.

### 404 (Not Found)

- Page H1 (brace head): `<NOT_FOUND />` — uppercase snake_case noun inside the brace pattern, mirroring the interior-page convention (`<ABOUT />`, `<CAREER />`). The HTTP status code lives in the eyebrow, not the H1, so the brace head reads as a real JSX-valid identifier (digits can’t lead a tag name) and the in-joke survives.
- Section eyebrow: `// 01 / status 404`
- Section H2: `Page not found.`
- Section body: `The URL didn’t match any page on this site. Try one of the surfaces below.`
- Recovery CTA: a single `ArrowLink` reading `home` pointing to `/`. The header nav already exposes the other four destinations one tab away — repeating them inline as five arrow-links would be busy and off-register.

Voice notes: the eyebrow names the *code* (`status 404`), the H2 names the *status text* spelled out (`Page not found.`). The two are semantically distinct, not synonymous — passes the eyebrow rule in §2. The body uses the system-voice word **surfaces** (per §5, "site" / "surfaces" is the site’s internal vocabulary). No "Oops", no exclamation, no "let’s build something together" energy. Period-terminated full sentences; the recovery link label is bare (no period).

Replaces the legacy production copy (`404` headline + `Oops, this page doesn’t exist.`), which carried a casual register inconsistent with the redesign voice.

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

## 8. Notes — authoring rules

The `/notes` surface is a chronological feed of short, unpolished pieces — TILs, hot takes, code snippets, asides. Notes are **not** articles: there is no summary, no cover art, no tags, no reading time, no edit history. The discipline is brevity. If a note feels like it needs an intro and a conclusion, it’s an article.

This section governs how to **author** a note (frontmatter values + body voice). The shipped microcopy that wraps notes (meta line, permalink label, paginator, empty state) lives in §7 above.

### 8.1 Kind taxonomy (closed set of 4)

Every note carries exactly one `kind` in frontmatter. The four are a closed set — no new kinds without updating this guide and the design system.

| Kind | One-line definition | Frame the author writes in | Example title |
|---|---|---|---|
| `til` | A thing learned — usually a tool, library, syntax, or behavior. | "I learned X about Y." | `Claude’s /btw command` |
| `take` | An opinion or argument. | "I think X about Y." | `Specialists vs generalists` |
| `snippet` | A small code fragment with the context that justifies it. | "Here’s how to do X." | `Type-safe env vars in 8 lines` |
| `aside` | A remark off to the side — meta/site notes, announcements, industry observations, bookmark-with-commentary. | "By the way…" | `Redesigned the home today` / `Speaking at X next month` |

**Selection rule.** Pick the most specific kind that fits. `aside` is the catch-all — default to it only when none of the other three apply. A snippet *about* a thing you learned is a `snippet`, not a `til`. An opinion *about* a snippet is a `take`. If it could be two, pick the one the title most clearly signals.

**Source casing.** Always lowercase in the frontmatter and in the rendered meta line. The kind word is a system label, not a category brand — it stays in the mono register.

### 8.2 Title rules

- **Required.** Every note has a title. No untitled drafts ship.
- **2–7 words.** Brevity is the discipline — the title is the scannable identity in the feed, and 50+ notes in a column need to be glanceable.
- **Sentence case.** Capitalize the first word and proper nouns only. Aligns with §3 (sentence case for everything that isn’t a brace H1, badge, or eyebrow).
- **No terminal period.** Same rule as labels and card descriptions in §10.3.
- **Readable, not clever.** `Specialists vs generalists` beats `On the eternal debate between depth and breadth`. The title states the noun; the body earns the angle.
- **Don’t prefix with the kind.** The badge already names it. `Claude /btw command` beats `TIL: Claude has a /btw command`. `Specialists vs generalists` beats `Hot take: specialists vs generalists`. (See §8.4.)

### 8.3 Body voice

Notes inherit every voice rule in §1 — terse mono, subject-less verbs on personal observations, curly apostrophes per §3, no exclamation marks, no "passionate about" / "world-class" / "game-changing", named projects over vague "various projects".

**One note-specific rule on top: brevity over completeness.** A note doesn’t need an intro, a transition, or a conclusion. Start in the middle, end when the point lands.

- **No setup paragraph.** Don’t open with "Today I was working on X and noticed Y…" — open with Y.
- **No transition phrases.** Cut "moreover", "in any case", "as it turns out", "long story short". If two thoughts need a bridge, they’re probably two notes.
- **No conclusion.** The last sentence carries the point. Don’t restate it. Don’t editorialize about it. Don’t append "so yeah" / "anyway" / "that’s it for now."
- **Tense.** Same rules as the rest of the site (§1): past tense for completed observations ("Noticed this morning that …"), present tense for ongoing positions and properties ("Claude exposes a `/btw` command that …"). A `til` is most often present-tense — the *thing learned* is a current fact.
- **First-person is allowed**, more freely than on the About/Career surfaces. Notes are diaristic by nature; subject-less verbs can feel stilted in a 30-word remark. Use `I` when dropping it would force an awkward sentence — but still prefer the verb-first form when it lands cleanly.

**If a note feels like it needs scaffolding, it’s an article.** The discipline of the format is that the substance fits in the body length the surface affords. Move it to `src/content/articles/` instead.

### 8.4 Anti-patterns

| Don’t | Do | Why |
|---|---|---|
| `TIL: Claude has a /btw command` | `Claude’s /btw command` | The `til` badge does that work — the title shouldn’t repeat it. |
| `Hot take: specialists vs generalists` | `Specialists vs generalists` | Same: the `take` badge names the register. |
| `Quick thought: …` / `Random idea: …` | (just the noun) | Hedging openers belong to social-media drafts, not the site. |
| Closing with `anyway, that’s it for now.` | (end on the substance) | No sign-off. The hairline rule below is the closer. |
| `…and you can read more about this in my [other article](…).` | (link inline where it belongs, no closer) | No "more from this category" closer. The index does discovery. |
| `Title Cased Note Title` | `Sentence case note title` | §3 sentence-case rule; aligns with article titles. |
| `Speaking at X next month.` (with terminal period in the title) | `Speaking at X next month` | §8.2: no terminal period on titles. |
| Naming the kind in the body ("As a quick TIL, …") | (drop the meta-frame, state the fact) | The badge above the title has already announced the kind. |
| `kind: thought` / `kind: ramble` / `kind: meta` | One of `til` / `take` / `snippet` / `aside` | Closed set. If none fit, the piece may not be a note. |

### 8.5 When in doubt

A note that doesn’t pick a clean kind, doesn’t fit in a few short paragraphs, or wants a summary line is probably an article. Move it, or cut it. The point of `/notes` is that it stays a stream of fragments — every note that drifts toward "small article" weakens the surface as a whole.

---

## 9. Examples — before / after

Quick pattern matches for the most common slips:

| Don’t | Do | Why |
|---|---|---|
| `Get the PDF` | `Download resume` | Verb + object, canonical artifact name matching `resume.pdf`. |
| `Connect with me` | `hello@andresilva.cc` | No funnel; the email address is the surface. |
| `My personal website` | (data) `The personal website that you are seeing right now` | Protected verbatim copy from the static repo. |
| `andresilva.cc — your future favorite portfolio` | `André Silva` (home) / `André Silva · About` (index) / `{Title} \| André Silva` (detail) | Split `<title>` convention — brand alone on home, brand-first middle-dot on indexes, title-first pipe on details (§3). |
| `// 02 / latest` | `// 02 / recent activity` | Eyebrow must differ from the H2 it labels. |
| `// 01 / About me` | `// 01 / in my own words` | Lowercase, evocative gloss, no terminal punctuation. |
| `Read full bio →` | `Full bio →` | Page-section link arrow uses bare noun. |
| `Healthy Labs (now MPA)` | `MPA` on identity surfaces + `// formerly Healthy Labs` on the career record | Rebrand convention; identity is current, record carries the trace. |
| `Andre Silva` / `André L. Silva` | `André Silva` | Canonical full name; one accent; no middle initial on the site. |
| `Apr 2025 - Present` | `apr 2025 — now` | Lowercase month, em-dash with spaces, lowercase "now". |
| `Résumé` / `Get the PDF` (button) | `Download resume` | Plain spelling matches `resume.pdf`; verb-first label removes any noun/verb ambiguity. |
| `Tailwind` (chip) | `Tailwind CSS` | Brand name. |
| `Vue` (chip) | `Vue.js` | Brand name. |
| `webperf` (article tag) | `Performance` | Article tags are brand-cased, chosen editorially. |
| `Game-changing performance work` | `Achieved a 74% increase in the performance of a key page` | Numbers over adjectives. |
| `Passionate about building great software` | `Works end-to-end — from architecture and infrastructure to product features and integrations.` | Subject-less, concrete, em-dash aside. |
| `Click here →` | `site →` / `github →` / `Full bio →` | Link label names the destination, not the action. |
| `Five-year bachelor's in CS — the foundation everything since has been built on.` | `Five-year bachelor's in Computer Science covering the algorithms, math, and systems core.` | State the fact and stop — no significance-closer clause editorializing why it matters (§1). |

---

## 10. When the guide doesn’t cover it

1. Default to the **plainest, most concrete phrasing** consistent with the existing About and Career copy.
2. Prefer the **subject-less verb** on any personal/bio surface.
3. Prefer **no terminal period** on labels, single-line card descriptions, and chip lists; **terminal period** on full prose sentences and the bio pitch.
4. Prefer **past tense** for completed work and **present tense** for ongoing facts.
5. When picking casing for a tech name, check what is already shipped in `static-jobs-repository` / `static-projects-repository` before inventing a form.
6. When in doubt, ask André.
