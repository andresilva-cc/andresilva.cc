# UI/UX Designer — Project Memory

Persistent design knowledge for andresilva.cc. The redesign is **shipped and merged**.
Read before any design or UI task.

## Shipped design system (brutalist-mono)

The live site is a brutalist-mono direction:

- **Palette:** lime accent `#C8FF3D` on near-black canvas `#0B0F0A`; foreground `#D7E5D0`.
  No other base colors. Lime is the single accent — use it as a pointed accent, not a
  structural color field.
- **Fonts:** JetBrains Mono (body / UI) + VT323 (pixel display). No additional faces.
- **Form language:** square corners (no border-radius), hairline rules as the structural
  vocabulary, stipple / ASCII generative art for imagery.
- **Typographic baseline:** monospace throughout. See the "no serif faces" principle below.

## See also

- [Feedback: meaningful per-project imagery](feedback_meaningful_imagery.md) — per-project
  stipple art must evoke that specific project, not be a generic generative pattern.
- [Hero art sizing](project_hero_art_sizing.md) — settled desktop box + mobile band sizes.
- [Aspect-ratio consistency](patterns_aspect_ratio_consistency.md) — shared medium, not
  shared ratio, is what makes art read as one system.
- [Image containers](patterns_image_containers.md) — transparent generative art vs opaque
  photography container treatment.
- [Middle-dot separator](patterns_middot_separator.md) — `·` is a within-a-value
  conjunction, not a between-links separator.

## Enduring design principles

These constraints held throughout the redesign and continue to govern the shipped site.

### No object-impersonation metaphors (hard veto)

The site is *not* dressed up as any real-world artifact. Never produce:
- Library / card-catalog / OPAC
- Museum / gallery / exhibition catalog
- Patent filing / legal filing
- Auction catalog
- Wiki / encyclopedia entry
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

The test: if a reasonable viewer would ask "is this supposed to be a X?" where X is a
physical artifact, the design has failed. The site is a website.

**Conceptual metaphors too.** The veto extends to *any* "the site IS X" framing — including
abstract ones. The site is not an essay, a letter, a query, a document, a report, a diary,
or a résumé-as-object. Conceptual role-play is still role-play.

Note: the shipped brutalist-mono register uses monospace type and stipple art as a *visual
style*. That is a treatment, not an impersonation — the site does not pretend to *be* a
terminal or a printout.

### No serif faces

No serif typefaces anywhere, in any treatment, at any size. Not as display, not as body,
not as accent. JetBrains Mono + VT323 are the shipped faces; any addition must be sans or
mono.

### Multi-page architecture — no single-page splash

The site is committed to multi-page architecture (Home / About / Career / Projects /
Articles). Do not compress everything into one screen or one card.

### Home is an orienting page, not a summary

The Home page shepherds the visitor toward a dedicated page; it does not replicate those
pages in miniature.

- Home shows: a hero (name, role, one-line pitch), a short bio (2–3 sentences), at most one
  curated "currently" or "most recent" item per other page (one role, one project, one
  article — a single line each with a `→` to the dedicated page), and contact/social links.
- Home does NOT show: the full 6-role career list, the full 19-project list, a multi-entry
  article feed, an expanded bio, or a large portrait.
- "Dense" is a treatment for how information is rendered on *each* page; it is not a license
  to collapse the multi-page IA into a single scrollable Home.
- Rich content belongs on its dedicated page. About = full bio. Career = all roles. Projects
  = all 19. Articles = full feed. Home links to these.

### No editorial-magazine cosplay

No chapter numbers, drop caps as structural elements, pull quotes as structural dividers,
"cover story" kickers, masthead conventions. A magazine pretending to be a magazine is off.

### No marketing / product-launch composition

No giant CTA stacks, testimonial rows, product-logo bars, announcement banners, or
SaaS-landing composition.

### No app-UI chrome a portfolio doesn't need

A personal portfolio is not a web app. Do not add simulated UI controls that don't serve an
actual content need — no search bars, filter toolbars, view-mode toggles, sort controls,
pagination, data-grid chrome, or command palettes. This is "too busy" and is distinct from
"dense." **Dense means lots of content that makes sense; busy means lots of UI that doesn't.**

### No soft / humanist / handwritten register

No cream paper, no script faces, no letter-to-visitor warmth, no watercolor portraits.

### No retro-nostalgia pastiche

No Geocities-era homepage mimicry, no Y2K, no vaporwave. (The shipped VT323 pixel display
is a deliberate brutalist choice, not nostalgia cosplay.)

### Density over emptiness

Dense, informational, orderly layouts are preferred. Whitespace can separate zones but
should not *be* the architecture; avoid Rams-level austerity. Equally, large type is a
scalpel, not a system — a single big headline per page is fine, but oversizing every
metadata element reads as tiring.

### Moderate, mixed component vocabulary

Cards where they help, flat text + rules where they don't, tables where they're honest.
Cards as the atom for every piece of content is rejected.

---

## Content-sourcing rule (always-on)

Every piece of content in a design preview must come from André's actual site. Never invent:
- Projects: `src/repositories/implementations/static-projects-repository.ts` (19 projects)
- Career: `src/repositories/implementations/static-jobs-repository.tsx` (6 roles)
- Bio: `src/app/(site)/about/page.tsx`
- Hero: `src/app/(site)/page.tsx`
- Articles: `src/repositories/implementations/forem-articles-repository.ts`, or fetch real
  titles from `https://dev.to/andresilva-cc` via WebFetch; if fetching fails, use visible
  layout placeholders. Do NOT invent article titles.

André is from **Florianópolis, BR**. "Francisco Beltrão" appears only as project history
(City Hall inventory, Grupo Gmaes internship).
