# UI/UX Designer — Project Memory

Persistent knowledge for the andresilva.cc redesign exploration. Read before every exploration task.

## See also

- [Exploration lever ledger](exploration_ledger.md) — catalog of levers already used in kept redesign slots + open lever territory
- [Feedback: meaningful per-project imagery](feedback_meaningful_imagery.md) — when a direction uses featured-project imagery, each image must evoke that specific project, not be drawn from a generative pattern library. Applies equally to Home "mesmerizing" marks.
- [CSS dither shadow — card-wrap pattern](patterns_css_dither_shadow.md) — use .card-wrap::after (not .card::after z-index:-1) for stipple/checkerboard shadows; naive approach renders dither ON TOP of content in Chrome.

## Rejected registers — never attempt these again

The user has explicitly rejected the following design approaches during multiple exploration rounds. Producing a variant of any of these is off-brief.

### Object-impersonation metaphors (hard veto)
The site is *not* dressed up as any real-world artifact. Never produce:
- Library / card-catalog / OPAC
- Museum / gallery / exhibition catalog
- Patent filing / legal filing
- Auction catalog (Sotheby's / Christie's)
- Wiki / encyclopedia / Wikipedia-style entry
- Terminal shell / CLI session
- IDE panel / code editor UI
- Billboard-as-object (roadside sign / highway exit / construction hoarding)
- Credential card / staff pass / ID card / press pass
- Boarding pass / airline ticket
- Lock screen / notifications stack
- Launchpad / app-grid home screen
- Zine / photocopied fanzine
- Newspaper / tabloid / broadsheet cosplay
- Dossier / redacted document / classified file
- Receipt / invoice / ledger-as-object

The test: if a reasonable viewer would ask "is this supposed to be a X?" where X is a physical artifact, the direction has failed. The site is a website.

### Single-page / splash one-screeners
The site is committed to multi-page architecture (Home / About / Career / Projects / Articles). Do not produce designs that compress everything into one screen or one card.

### Editorial-magazine cosplay
No chapter numbers, drop caps as structural elements, pull quotes as structural dividers, "cover story" kickers, masthead conventions. A serif face used tastefully in a web context is fine; a magazine pretending to be a magazine is not.

### Soft / humanist / handwritten
No cream paper, no Caveat-style script, no "dove note" letter-to-visitor energy, no watercolor portraits, no warm-hearth lamp-glow framings.

### Marketing / product-launch
No giant CTA stacks, testimonial rows, product-logo bars, announcement banners, SaaS-landing composition.

### Generic minimal
No Rams-level austerity (tiny type, few words, extreme sparseness). Dense is fine; sparse for its own sake is not.

### Retro-nostalgia
No Geocities-era personal-homepage mimicry, no Y2K, no vaporwave, no intentional 90s-web pastiche.

### Conceptual metaphors (not just physical artifacts)
The artifact-metaphor veto (library, museum, patent, etc.) extends to *any* "the site IS X" framing — including abstract/conceptual ones. The site is not an essay, a letter, a query, a document, a report, a diary, a résumé-as-object, etc. Conceptual role-play is still role-play.

### Serif faces
No serif typefaces anywhere, in any treatment, at any size. Not as display, not as body, not as accent. Fira Sans + Fira Code are the baseline; additional faces must be sans or mono.

### App-UI chrome that a portfolio doesn't need
A personal portfolio is not a web app. Do not add simulated UI controls that don't serve the actual content need — no search bars, filter toolbars, view-mode toggles, sort controls, pagination, data-grid chrome, command palettes, etc. The user calls this "too busy" and is distinct from "dense." **Dense means lots of content that makes sense; busy means lots of UI that doesn't.**

### Oversized type used everywhere
Large type is a *scalpel*, not a *system*. A single big headline per page is fine; making every metadata element (years, dates, tech) or every card title oversized reads as tiring. Dense type is fine; dense *big* type is not.

### Cards-everywhere
Moderate use of card components is allowed. Using cards as the atom for every piece of content across every page ("cards everywhere") is rejected. Prefer flat layouts, dividers, and rules where cards aren't pulling their weight.

### Excessive whitespace
Sparse-by-default layouts are off. Dense is preferred. Whitespace can separate zones but should not *be* the architecture.

## Refinement passes preserve direction distinctness

When a direction receives a full-build + craft-refinement treatment, the *craft* is universal (the rules in `docs/agents/ui-ux-designer/rules/` apply identically to every direction) but the *lever* is unique. Two directions that have both been refined must still feel like genuinely different design points of view at first glance.

**Risk:** when sequential refinement passes are run, the agent absorbs the patterns from the just-finished direction and unconsciously imports them into the next — same spacing scale instantiated identically, same component vocabulary, same nav treatment, same density, same vertical rhythm. Result: directions converge into a single house style.

**Discipline:**
- Before refining a direction, re-read its parent spec and screenshots to internalize *that direction's* lever — not the lever of the most recently refined sibling.
- The shared brand palette + Fira Sans / Fira Code baseline + WCAG floor are the only universals. Spacing scale values, type scale, density, multi-column grid choices, accent placements, hover treatments, focus-ring styling, page section order — these can and should diverge per direction.
- Each refined direction must answer *its* lever's question. Geometric Precision's question is "what does rigor look like?"; Dense Readable's question is "what does compression that stays readable look like?"; Halftone's question is "what does brand-tinted texture look like as a single identity move?"; Mono-first's question is "what does a single-typeface commitment look like at full multi-page depth?". A refined direction whose page composition is indistinguishable from another refined direction at thumbnail scale has failed.
- It's fine for two refined directions to *share an idea* (e.g., both lock spacing to a fixed scale — that's universal craft); it's not fine for them to *render identically* (same nav layout, same hero composition, same card structure).

When in doubt during a refinement pass: open the *parent's* current screenshot in your mind's eye. If your refinement is just "tightened version of 04," you're not refining the direction — you're refining your last build. Stop and re-anchor on the actual parent lever.

## Multi-page Home is not a summary

The site is committed to multi-page architecture (Home / About / Career / Projects / Articles). The Home page is an **orienting** page — it shepherds the visitor toward a dedicated page, it does not *replicate* those pages in miniature. Concretely:

- Home shows: a hero (name, role, one-line pitch), a short bio (2–3 sentences), at most one curated "currently" or "most recent" item per other page (one role, one project, one article — as a single line each with a `→` to the dedicated page), and contact/social links. That is all.
- Home does NOT show: the full 6-role career list, the full 18-project list, an article feed with multiple entries, an expanded bio, a portrait larger than a small bookmark (and per other guidance, probably no portrait at all).
- Every density-leaning direction that has been rejected in part suffered from this pattern — trying to demonstrate the register by cramming everything onto Home. "Dense" is a treatment for how information is rendered on *each* page; it is not a license to collapse the multi-page IA into a single scrollable Home.
- Rich content belongs on its dedicated page. About = full bio. Career = all roles with full detail. Projects = all 18 with metadata. Articles = full feed. Home links to these; it is not a substitute for them.

## Positive preferences (what the user actually likes)

- **Dense, informational, "normal" portfolio layouts.** Lots of real content, orderly hierarchy, confident typography, minimal chrome.
- **Moderate, purposeful accent usage.** Brand purple + yellow as pointed accents, not structural color fields.
- **Measured big-type.** Single headline per page, maybe one or two additional display moments; everything else small and functional.
- **Mixed component vocabulary.** Cards where they help, flat text where they don't, tables where they're honest.
- **Compositions that feel "shippable as a personal site in 2026" at a glance** — not concept art, not theatrical, not costumed.

### Specific rejected executions (2026-04-24)
Three previously-shipped multi-page directions were deleted after review. Do not reproduce these specific patterns:
- **Timeline Axis** — chronology-as-composition, vertical/horizontal time-rail as the primary structural element of the home page, year markers as left-column anchors, career shown as a date-ordered bar chart. The whole site revolving around a single-axis timeline.
- **Split Screen** — 50/50 bisection with sticky identity pane on the left (name, role, bio, vertical nav, links) + scrollable content pane on the right. Any fixed-half-viewport identity-versus-content division.
- **Serif × Sans Contrast** — modern serif display face (Instrument Serif, Fraunces, Source Serif, Newsreader, etc.) used for large headings on dark background, paired with Fira Sans body. Even restrained serif-display usage on the dark brand palette is out.

### Specific rejected executions (later, same cycle)
Another five multi-page directions shipped and were deleted after review. Do not reproduce these specific patterns:
- **Whitespace Cathedral** — ultra-sparse layouts with whitespace as the primary architectural element; huge empty regions, a few small items floating in the void. Reads as Rams-adjacent austerity, which is separately rejected.
- **Heavy/Light Asymmetry** — any two-panel split composition of any ratio (40/60, 60/40, 30/70, 65/35, etc.). The user explicitly rejects "split panel look" in any form. Extends the earlier Split Screen rejection — no half-viewport-of-identity-versus-content divisions at any ratio.
- **Color Field** — full-bleed color-blocking where surface shifts are the primary structural element (entire sections drenched in purple/plum/deep, with content sitting inside color zones as structural bands).
- **Tag Graph** — network / node-and-edge visualization as the home hero. Any data-visualization-as-composition where the primary home element is an SVG graph of nodes.
- **Reveal on Focus** — interaction-gated content disclosure (reveal on hover, tab-to-reveal, accordion-required-to-see-content, any pattern where the reader has to *do something* to see basic information on first load). The user called this "too cumbersome." Content must be visible at rest.

### Specific rejected executions (2026-04-25, replacement round)
Five replacement directions shipped and were deleted after review (no reason given — pattern-level guidance only). Do not reproduce these patterns:
- **Essay Scroll** — long-form scroll narrative / "the home page is a single written document" register, chaptered prose sections, inline links to projects. Reading-flow-as-home.
- **Small Multiples** — uniform-size tile gallery; every atom (project card, KPI, role card, article card) rendered at identical dimensions for strict visual rhythm.
- **Toolbar & Results** — sticky query-toolbar at the top driving a filterable results grid below; "query is the site" / search-UI-as-composition.
- **Annotated Cards** — project/article cards expanded into content-rich mini-essays (80–140 word body prose per card) as the primary layout element.
- **Metadata Display** — inverted typographic hierarchy where metadata (years, dates, tech stacks) is shown at 72–120px display scale and titles/bodies are small.

When exploring new directions, pick levers that are *compositionally distinct* from all thirteen specific rejections — not just tonally different.

### Specific rejected executions (2026-04-25, elimination round — with reasons)
Eight more directions deleted with user reasoning — record the patterns:
- **Signal Feed** — fixed right sidebar / any sidebar occupying substantial persistent screen real estate. Ticker-header rows as organizing pattern were fine; the fixed sidebar killed it.
- **Prompt & Response** — Q&A / "asked and answered" / interview-style structural composition. User called this register "cringe." No interrogative framing as layout.
- **Stacked Columns** — classical 3-column nav-rail + reading column + meta rail was acceptable but *01 Index Grid does this kind of layout more polished*. If a three-column layout is wanted, 01 is the reference — don't add near-duplicates.
- **Modular Ratio** — visible mathematical scales (ratio grids, baseline tracing, gutter numerals, typographic value-praise) read as over-engineered and spacious. Don't put the math of the design on the page.
- **Marginalia** — gutter annotations as primary metadata carrier read as "too simple" for what the user wants. Integrated metadata is fine; gutter-as-structural-element is out.
- **Info Block** — atomic-uniform block/bento-grid-everywhere composition. The user doesn't want the site to look like blocks stacked together.
- **Three-Size** — oversizing years/dates/tech stacks into display-scale typographic elements. Too much typographic information competing for attention; body loses primacy.
- **Portrait-Anchored** — 540px+ profile photo leading the Home page. User is considering no portrait at all. Default to no-portrait or very small portrait on Home; do not center design around a large photograph.
- **Index Grid** — rigid 12-col grid + ordered entry numerals + nav rail + meta rail rendering the site as a "well-kept directory" — rejected later. The numbered-row tabular register feels too generic / directory-like for a personal portfolio.

### Halftone-variant mistakes (2026-04-24, slot 10 sibling round)
Three variants of `10-halftone-duotone` shipped and were rejected — not because the concept was wrong, but because the executions missed the point. Do not reproduce these specific mistakes:
- **Applying effects to the portrait photograph.** Halftone-processing André's real photo is fine; adding wave overlays, sine-wave grids, or other pattern treatments *on top of* his portrait is rejected. The portrait stays as a portrait.
- **Random/abstract images on featured projects.** Generative halftone patterns (spirals, ray-fields, sphere-fields) that don't *relate to what each project does* are rejected as meaningless. If featured projects carry images, each image must visually evoke the project's actual purpose.
- **Weak, postage-stamp, or arbitrary "mesmerizing" marks on Home.** Tiny concentric-ring moiré in a corner, small dot-grids with a single highlighted dot, or any decorative mark that is (a) too small to read as intentional, (b) too peripheral to feel composed, or (c) not connected to the project's meaning — all rejected. A Home decorative/textural image must be *properly positioned* (visible and composed, not a corner afterthought), *mesmerizing* (optical interest that holds the eye), and *make sense with who André is and what he does* (not abstract for its own sake).

---

## Brand-palette constraint (always-on)

- Dark surfaces: `#2F2B42` / `#232032` / `#1B1929` family. No other base colors.
- Brand accents: purple `#9B7EF2` and yellow `#FFB633` — both must be visibly present and intentional in every direction.
- Auxiliary lavender `#AAA3CC` allowed for muted UI.
- Typographic baseline: Fira Sans + Fira Code. One additional face per direction only if the register genuinely demands it — and NEVER a modern serif display face on dark (see rejected executions above).

---

## Content-sourcing rule (always-on)

Every piece of content in every preview must come from André's actual site. Never invent:
- Projects: `src/repositories/implementations/static-projects-repository.ts` (18 real projects)
- Career: `src/repositories/implementations/static-jobs-repository.tsx` (6 real roles)
- Bio: `src/app/about/page.tsx`
- Hero: `src/app/page.tsx`
- Articles: fetch real titles from `https://dev.to/andresilva-cc` via WebFetch; if fetching fails, use visible layout placeholders. Do NOT invent article titles.

André is from **Florianópolis, BR**. "Francisco Beltrão" appears only as project history (City Hall inventory, Grupo Gmaes internship).

---

## VT323 + pixel-SVG implementation notes

Technical notes from the slot-05 build that informed the final v4 direction. The lever was rejected; these implementation patterns are reusable.

**VT323 wordmark sizing:** `clamp(56px, 7.5vw, 112px)` works cleanly at 1240px max-width shell with `grid: 1fr 320px`. At `9vw / 128px` max the wordmark overflows columns. Always test hero wordmark column fit at 1200–1366px.

**Hero meta grid:** Right column needs `padding-top` to visually align with the wordmark text, not the top of the left column. Used `padding-top: var(--s7)`.

**Pixel SVG letters:** Build as `rect` elements with 3×3 squares in a viewBox. Never use `image-rendering: pixelated` on `<img>` — only on inline SVG text/VT323 elements.

**Article illustrations:** Inline SVG concentric circles / hex lattice / waveform polyline. All use the `--accent` / `--accent-mute` / `--rule-2` tokens. These illustrations double as decorative anchors with zero external dependencies.

**Date gutter layout (career/articles):** `grid-template-columns: 160px 1fr` with `border-right` on gutter. On mobile collapse to `grid-template-columns: 1fr` and add `border-bottom` + `flex-direction: row` on gutter for a horizontal strip.

**Filter strip on projects:** Use `<button>` with `.filter-btn` class + `.active` state. No JS wiring needed for the HTML preview — visual affordance is sufficient.
