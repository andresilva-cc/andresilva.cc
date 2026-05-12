# Direction 09 — Prose & Mono · Polished v4

> Single-file, exhaustive spec. This is the v4 of direction 09 (previously slotted as 08 v3). The v2 spec body below documents the v2 decisions and remains in force except where the **v4.3 revisions**, **v4.2 revisions**, **v4.1 revisions**, **v4 revisions**, **v3 revisions**, and the subsequent **v3.1**, **v3.2**, **v3.3**, **v3.4**, and **v3.5 revisions** sections explicitly override it.

---

## v4.3 revisions (post-v4.2 audit follow-up + mobile pass)

A third audit after v4.2 shipped identified four documentation/cleanup items left over from the v4.2 round (Group A), one outstanding affordance question on articles (Group B), and a set of mobile responsiveness regressions surfaced by André eyeballing the prototype on an iPhone 12 Pro at 390×844 (Group C). v4.3 closes all three groups.

### Group A — v4.2 documentation cleanup

1. **v4.2 spec block written.** This document had no `v4.2 revisions` section despite v4.2 shipping three live edits to the HTML files. The section below this one (`## v4.2 revisions (post-v4.1 hotfix)`) is the retroactive write-up. The three v4.2 changes are: revert of v4.1 fix #14 (`.pr--is-featured` inset accent-mute top line), `.sec-head--flush` zeroing both `margin-bottom` and `border-bottom` (was only zeroing the margin), and `--photo-filter` re-tune to `grayscale(1) sepia(1) hue-rotate(33deg) saturate(2.25) contrast(1) brightness(1)`.

2. **Stale `--photo-filter` comments refreshed across all 5 files.** Home, career, projects, and articles each carried a v4.1-era comment ("aligned with about's locked v3.4 value") that no longer matched the v4.2 token value (33deg / saturate(2.25), not 40deg / saturate(3)). About carried a longer block-comment narrating the v3.4 "40deg locked" rationale, also stale. All five replaced with a short canonical-mirror comment that names the current value and its rationale ("hue-rotate(33deg) + saturate(2.25) lands the lime mid-tones cleanly without tipping into emerald or yellow"). About's comment additionally records that v4.2 supersedes the v3.4 string.

3. **About touch-device filter math re-derived against the v4.2 base.** The `@media (hover: none) and (pointer: coarse)` override on `.photo` was set to `grayscale(1) sepia(0.5) hue-rotate(40deg) saturate(1.5) contrast(1) brightness(1)` — tuned against the OLD `--photo-filter` (40deg / saturate(3)) where halving saturate(3) gave 1.5 and the hue-rotate matched the base. v4.2's new base (33deg / saturate(2.25)) put this override out of sync. Promoted to a new `--photo-filter-soft` token in the `:root` block to make the relationship explicit: same hue-rotate as the base, halved sepia (0.5), halved saturate (~1.15, half of 2.25). The token is mirrored across all 5 `:root` blocks per the canonical-mirror rule; about is the only consumer. A comment in the `:root` block records the derivation so future re-tunes of `--photo-filter` prompt a parallel re-derivation of `--photo-filter-soft`.

4. **Superseded v4 standing rule annotated.** The v4 standing-rules block carried a third rule: *"Don't reach for `--lo` on `--surface-2` for body-size text — use `--mid`."* This was correct at v4 time (`--lo` = #6F7E68, 4.3:1 on `--surface-2`, below AA). v4.1 fix #8 bumped `--lo` to #7E8E76, which clears AA on both `--bg` (5.49:1) and `--surface-2` (5.30:1), eliminating the constraint. The v4 standing rule is now superseded but reads as still-active. Added an inline annotation `**[Superseded by v4.1 fix #8 — token bump cleared the constraint.]**` to the rule in the v4 block so a future skim reads the correct current state. The rule text is preserved (historical record).

### Group B — Articles card-wide hover decision

v4.1 fix #9 added `.art:hover .art__title a { color: var(--accent); text-decoration: underline; ... }` so hovering anywhere on an article card promoted the title visually. The v4.2 audit flagged this as the "inconsistent middle option": the card-wide visual cue is not matched by a card-wide cursor or click target (only the title and the bottom "read on dev.to" link-arrow are clickable; the cursor stays default over the rest of the card area).

Two principle-coherent options were on the table:

- **(i) Drop the card-wide hover rule.** Title link styles on direct hover only. Card stays a structured content entity but is not visually-promoted as a single click target.
- **(ii) Make the entire card a single `<a>` wrapping the existing internal anchors** (like the home Latest rows). Card-wide hover + card-wide cursor agree.

**Decision: (i).** The `.art` card is a structured content entity — illustration, meta strip, title, description, tag chips, and a footer "read on dev.to" link — and is materially different from a home Latest row (single one-line label, single action). Wrapping the whole card in one anchor would over-promise clickability over the description and tag strip, and would either swallow the existing title and footer-link affordances (collapsing two semantic entry points into one) or create nested-link problems. Dropping the card-wide hover restores affordance hygiene (visual cue matches cursor matches click target) at the smallest possible cost: the title link's direct hover still wears the same underline + accent treatment, which is the correct minimal affordance.

The v4.1 rule is removed from `articles.html`. The CSS comment is replaced with a v4.3 comment that records the decision and the reasoning so a future editor doesn't reintroduce it.

### Group C — Mobile responsiveness pass

André reviewed the prototype on iPhone 12 Pro at 390×844 and flagged two issues. Plus a sweep of the other pages while in there.

1. **Home Latest — orphaned arrow.** v4.1 fix #4 dropped the visible "Read more" text and kept arrow-only. The mobile rule at `@media (max-width: 760px)` then converts `.row` to `grid-template-columns: 1fr` (single column) and re-anchors `.row__cta { justify-self: flex-start }`, which puts the arrow on its own line below the badge+content. Stripped of the "Read more" text, the arrow read as a stranded glyph with no context.

   **Fix: keep the desktop 2-col layout (`1fr auto`) on mobile.** The arrow stays on the right of the row content where the user expects a "go" cue; the row remains a single click target; the badge + content + arrow row reads as a self-contained unit. Only padding tightens (`var(--s3)`) to fit narrow viewports. This preserves the desktop affordance pattern instead of inventing a new mobile-specific layout.

2. **Header nav cramped at 390px.** Wordmark (`andresilva.cc` + dot icon) plus 4 nav items (`home`, `about`, `career`, `projects`, `articles`) all crammed onto one row at the iPhone width read as a cramped strip with no breathing room. The 760px rule already reduced nav padding to `var(--s2)` symmetric (8px each side), but at 390px even that doesn't fit comfortably.

   **Fix: at ≤480px, stack the header.** `header.bar` switches to `flex-direction: column; align-items: flex-start; gap: var(--s2)`. The wordmark sits on the first row, nav items below it. Nav gets a small negative left margin so the first item's padding lines up flush with the wordmark, and `flex-wrap: wrap` lets the items break to a second row if the viewport is narrow enough that 4 items + the [home] brackets don't fit. Nav item padding tightens to `var(--s1) var(--s2)` since the nav now has a dedicated row. Hamburger menu deliberately avoided — overkill for a 4-item nav and would force adding JS to a pure-CSS prototype. Applied to all 5 files (header is byte-identical across pages).

   André noted this may be re-revised when the prototype gets translated to production code. The v4.3 treatment is "reasonable but not over-engineered" — enough to make the prototype look correct, not a full mobile-nav refactor.

3. **Mobile pass across the other pages — verified.** Audited at 390px:

   - **Home hero plasma** — `@media (max-width: 900px)` correctly drops the right-column to full-width with `max-width: 400px` and `aspect-ratio: 400/230`. Name cursor (em-based since v4.1 fix #10) scales with the 40px H1 — visually correct.
   - **About photo** — `@media (max-width: 1000px)` correctly collapses the 2-col `about-grid` to 1-col and sets the photo wrap to `max-width: 320px` with `aspect-ratio: 200/260`. The touch-device filter override now consumes `--photo-filter-soft` (see A3), so the photo reads recognizably on iOS without any interaction. About's 2-col grid frames (Education, Facts) collapse to 1-col at ≤700px — verified.
   - **Career roles** — `@media (max-width: 760px)` correctly collapses `.role`'s `grid-template-columns: var(--gutter-date) 1fr` to single-column, flips the date gutter to a horizontal row with its own border-bottom, and re-paddings the content. Chip strip wraps via `flex-wrap: wrap`. No issues.
   - **Projects grid** — `@media (max-width: 1100px)` collapses 3-col → 2-col, `@media (max-width: 700px)` collapses 2-col → 1-col. Internal grid-frame borders are correctly re-applied per breakpoint. Featured cards readable at every breakpoint (badge is `position: absolute` to the top-right; `--badge-clearance` token ensures the title clears it). No issues.
   - **Articles illustration column** — `@media (max-width: 760px)` collapses the 240/1fr grid to single-column, sets the illo to `width: 100%; max-width: 320px; aspect-ratio: 240/144`. No issues.
   - **Footer** — `flex-wrap: wrap; gap: var(--s2); justify-content: center` lets the links wrap naturally at any narrow viewport. No issues.

   No additional mobile defects found; no extra fixes applied beyond C1 and C2.

### Files changed (v4.3)

- `home.html` — A2 (`--photo-filter` comment), A3 (`--photo-filter-soft` token mirror), C1 (`.row` mobile layout), C2 (`@media (max-width: 480px)` header stack).
- `about.html` — A2 (`--photo-filter` comment), A3 (`--photo-filter-soft` token + consume it in the touch-device override), C2 (`@media (max-width: 480px)` header stack).
- `career.html` — A2 (`--photo-filter` comment), A3 (`--photo-filter-soft` token mirror), C2 (`@media (max-width: 480px)` header stack).
- `projects.html` — A2 (`--photo-filter` comment), A3 (`--photo-filter-soft` token mirror), C2 (`@media (max-width: 480px)` header stack).
- `articles.html` — A2 (`--photo-filter` comment), A3 (`--photo-filter-soft` token mirror), Group B (drop card-wide hover rule), C2 (`@media (max-width: 480px)` header stack).
- `notes.md` — this v4.3 block, the v4.2 block below it (A1), and the v4 standing-rule annotation (A4).

### Open items / not fixed

None at this audit. André noted the header treatment may be revisited at production-code time, which is recorded but not "open" — the prototype's job is to read correct on mobile, which the v4.3 treatment satisfies.

---

## v4.2 revisions (post-v4.1 hotfix)

A small hotfix round applied directly to the HTML files after v4.1 shipped. v4.2 was not documented in this spec at the time; the v4.3 Group A1 item retroactively writes it up. Three changes.

### Fix groups applied

1. **Reverted v4.1 fix #14 — `.pr--is-featured` inset accent-mute top line removed.** v4.1 added `box-shadow: inset 0 1px 0 var(--accent-mute)` to `.pr--is-featured` to mark featured cards at the 2-col breakpoint where the 3-col layout collapses and featured cards no longer sit in row 1 by themselves. In practice, at the 3-col layout the inset 1px line stacked with the `.grid-frame` border (the frame already draws a 1px border on all cells) and visually thickened row 1 against row 2 — the same problem the v4 audit had flagged when v3 used a background tint. The badge alone carries the FEATURED affordance at every breakpoint, which is the simpler signal. The selector is kept as an empty placeholder (`.pr--is-featured { }`) so future variants can hook back in without touching the HTML.

2. **`.sec-head--flush` now zeros `margin-bottom` AND `border-bottom`** (previously only zeroed the margin). About's Education and Facts sections use `.sec-head--flush` because the immediately-following `.grid-frame--2col` draws its own 1px top rule; with only the margin zeroed, the `.sec-head`'s bottom border still rendered and stacked with the grid frame's top border into a visible doubled rule at the seam. Zeroing both makes the section head sit flush against the grid with a single 1px rule, which is the intended visual.

3. **`--photo-filter` re-tuned to `grayscale(1) sepia(1) hue-rotate(33deg) saturate(2.25) contrast(1) brightness(1)`.** The v3.4 string (40deg / saturate(3)) tipped slightly yellow at the new saturation. The 33deg rotation pulls the mid-tones back toward lime without losing the green character; saturate(2.25) sits below the saturation-clipping point at which the highlights start banding. Mirrored across all 5 `:root` blocks per the canonical-mirror rule (about is the consumer; the other four carry the token for parity). v4.3 Group A3 promotes the touch-device variant of this filter to a `--photo-filter-soft` token so the relationship is explicit.

### Files changed (v4.2)

- `projects.html` — fix 1.
- `about.html` — fix 2, fix 3 (canonical consumer).
- `home.html` — fix 3 (canonical mirror, inert).
- `career.html` — fix 3 (canonical mirror, inert).
- `projects.html` — fix 3 (canonical mirror, inert).
- `articles.html` — fix 3 (canonical mirror, inert).

(The spec md was not updated at the time; v4.3 Group A1 backfills the documentation here.)

---

## v4.1 revisions (post-v4 fresh audit)

A fresh audit after v4 shipped surfaced 16 polish items spanning typography hygiene, semantics consistency across card lists, token drift across the canonical mirror, and a handful of interaction/contrast nits. v4.1 applies every fix. Three standing rules were formalized in the process — see the block immediately below.

### Standing rules introduced in v4.1

- **Tabular figures are unnecessary in monospace stacks. Don't reach for `tabular-nums` until the design ships a proportional face.** JetBrains Mono and VT323 are already fixed-width — every glyph cell is identical-width by construction. The OpenType `tnum` feature and `font-variant-numeric: tabular-nums` are no-ops on a mono stack, and carrying them creates the false impression that the design depends on them (it doesn't). Dropping them removes a maintenance burden if/when type subsetting or feature toggling gets touched.
- **Card lists use `<li class="card-class">` (no inner `<article>`). The `<li>` is the card.** Established by projects in v4 (`<li class="pr">`); v4.1 brings career (`<li class="role">`) and articles (`<li class="art">`) into alignment. The "list of cards" semantic is conveyed by `ul`/`li` — wrapping each `<li>` around an `<article>` adds a redundant landmark that screen readers announce twice, and forces every selector that wants to target the card itself to go through `> li > article`. Single-element pattern simplifies both the markup and the CSS. (Note: this only applies to *cards* — Education uses `<h3>` inside cells because those are sub-section headings, not list items.)
- **`:root` token blocks across pages are canonical mirrors. Changes to one require changes to all.** Each of the 5 HTML files carries its own `:root` block (no shared stylesheet — these are HTML previews); the tokens must stay identical across all 5 so future code generation against any single file produces the same token contract. Every `:root` block now leads with a comment marking it as a canonical mirror, and tokens not consumed on a given page (e.g., `--photo-filter` on home, `--badge-clearance` on about) are kept in the block for parity rather than pruned. v4.1 corrects pre-existing drift: `--photo-filter` was set to the pre-v3.4 value on home/career/projects/articles while about carried the locked v3.4 value; all 5 now carry the v3.4 value.

### Fix groups applied

1. **Dropped `tabular-nums` site-wide.** Removed `font-variant-numeric: tabular-nums` and the `"tnum" 1` OpenType setting from every `body` rule, and from local re-declarations on `.role__dates` (career) and `.art__meta` (articles). The mono stack handles digit alignment by construction.

2. **Unified `<li>` vs `<li><article>` for cards.** Picked the projects pattern: `<li class="card-class">`, no inner `<article>`. Applied to career (`<li><article class="role">` → `<li class="role">` — 6 roles) and articles (`<li><article class="art">` → `<li class="art">` — 2 entries). Selectors that previously reached through the wrapper (`.career-list > li:last-child .role`, `.list > li:last-child .art`) collapsed to direct selectors (`.career-list > .role:last-child`, `.list > .art:last-child`). Home's `.rows > li` continues to wrap an `<a class="row">` — that case is genuinely different (the entire row is a link, not a styled card container), so the `<a>` stays. *Rationale for picking this pattern over `<li><article>`: every selector loses one level of indirection, the screen-reader announcement isn't doubled, and the existing projects markup already proves the pattern is sufficient — adding the wrapper everywhere would have been larger churn than removing it from two places.*

3. **Canonical-mirror convention documented + `--photo-filter` drift corrected.** Every `:root` block now opens with `/* CANONICAL TOKEN BLOCK — mirror all changes across home/about/career/projects/articles. Tokens not consumed on this page are kept for parity. */`. The inert `--photo-filter` on home/career/projects/articles was set to the pre-v3.4 string (`grayscale(1) sepia(0.4) hue-rotate(40deg) saturate(2) contrast(1.1) brightness(0.9)`) while about carried the locked v3.4 string (`grayscale(1) sepia(1) hue-rotate(40deg) saturate(3) contrast(1) brightness(1)`). All 5 now carry the v3.4 string. The about page is the only consumer, so the visible photo is unchanged.

4. **Latest CTAs — visible "Read more" text dropped; arrow-only with `aria-label`.** v4 unified the three rows to `Read more →`. Audit feedback: every row equal-weight, Latest is a digest not a CTA list, the badge already names the category. The text was a third redundant signal. v4.1 keeps only the arrow icon; the span gains `aria-label="Read more"` so screen readers announce the action. The entire-row click target + hover overlay + cursor pointer + arrow icon now collectively carry the affordance.

5. **Row press scale moved to `.row__body`.** v4 applied `transform: scale(0.97)` on `.row:active`, which scaled the `::before` overlay along with the content and produced perceptual jitter as the overlay edges pulled inward during the transition. v4.1 moves the scale onto `.row__body` so the overlay stays stable while only the bulk content compresses. The `.row__cta` deliberately does not compress — it reads as the fixed anchor on the right. Still gated by `prefers-reduced-motion: no-preference`.

6. **`.row:focus-visible` outline-offset pushed to `-3px`.** v4 used `-2px`, which overdrew the row's 1px top rule when keyboard-navigating down the list (the ring sat right on top of the rule). `-3px` pushes the ring inward an extra pixel so it sits clear of the rule.

7. **`.role__at` — kept on `--lo`** (decision deferred to fix #8). v4 had nudged `.row__at` from `--lo` to `--mid` to clear AA on `--surface-2`. The instruction allowed reverting both `.row__at` and `.role__at` to `--lo` once `--lo` itself passed AA. With fix #8 below, both are reverted/kept on `--lo` for token consistency.

8. **`--lo` bumped #6F7E68 → #7E8E76.** The root-token fix for the contrast class. Multiple selectors use `--lo` on `--bg`/`--surface-2` (`.facts-cell__k`, `.role__formerly`, `.education-cell__institution`, `.art__sep`, `.art__meta`, `.role__at`, `.row__at`); the prior #6F7E68 sat at 4.6:1 on `--bg` (marginal AA at body) and 4.3:1 on `--surface-2` (below AA). #7E8E76 lifts the green-gray a single L\* step while preserving the "low-emphasis muted green-gray" character of the token. Computed ratios (sRGB→linear, ((L1+0.05)/(L2+0.05))):

   - `--lo` (#7E8E76, L ≈ 0.2488) on `--bg` (#0B0F0A, L ≈ 0.00442) → **5.49 : 1** — AA at body size.
   - `--lo` on `--surface-2` (#0F1410, L ≈ 0.00632) → **5.30 : 1** — AA at body size.

   §2.2 contrast table updated below to reflect the new values.

9. **Articles cards — card-wide hover affordance for the title.** Articles cards have two click targets (title + "read on dev.to"). The visual treatment implies card-wide clickability. v4.1 adds `.art:hover .art__title a` underline + accent-color, so hovering anywhere on the card signals the title as the primary entry. The card is NOT a single link — both targets remain independently clickable — purely a visual cue.

10. **Hero cursor — em-based sizing.** `.name__cursor` previously used `width: 14px; height: 40px` with a mobile-specific override `width: 10px; height: 28px`. v4.1 switches to `width: 0.25em; height: 0.7em`, which sizes relative to the H1 font-size and scales naturally with the responsive H1 (56px → 40px on mobile) and any browser font-size override. The mobile override is dropped.

11. **Link-arrow SVG path — unified to the squared variant.** v4 had two SVG variants in circulation: home + articles used `M2 5h6M5.5 2.5L8 5l-2.5 2.5` with `stroke-width="1.4"`, `stroke-linecap="round"`; career + projects used `M2 5h6M5 2l3 3-3 3` with `stroke-width="1.2"`, `stroke-linecap="square"`. The squared variant matches the brutalist mono direction (square corners are already the design system rule). v4.1 uses the squared variant in every link-arrow across all 5 files.

12. **Career section `aria-label` — `"Career roles"` → `"Career"`.** Matches the page H1 noun and the established convention on projects (`"Projects"`) and articles (`"Articles"`).

13. **`88px` badge clearance formalized as a token.** Added `--badge-clearance: 88px;` to projects' `:root` (and mirrored across all 5 :root blocks per fix #3) with a CSS comment explaining the math: badge sits at `right: var(--s4)` (16px) with `padding: 1px var(--s2)` and ~62px text width — 88px clears the badge with a small tab. `.pr--is-featured .pr__title` now uses `padding-right: var(--badge-clearance)`.

14. **Featured card at the 2-col breakpoint — subtle structural cue.** At ≤1100px the 3-col grid collapses to 2-col and the featured cards no longer occupy row 1 by themselves, weakening the FEATURED signal. v4.1 adds `box-shadow: inset 0 1px 0 var(--accent-mute)` to `.pr--is-featured` — a 1px accent-mute line at the top of every featured card. Non-layout (no shift, no conflict with `.grid-frame`'s rules) and pairs with the existing FEATURED badge. Applied globally, not breakpoint-scoped, so the affordance reads consistently at every breakpoint.

15. **Articles title spacing — flipped.** `.art__meta → .art__title` was `margin-top: --s2` (8px), `.art__title → .art__desc` was `margin-top: --s3` (12px). v4.1 flips to `--s3` and `--s2` respectively — title and desc are the closer-related pair (title is the one-line label, desc elaborates on it), so they sit tighter while the meta strip floats further above.

16. **Hero plasma — `role="presentation"` on `<pre id="v1-ascii">`.** Belt-and-braces defensive fix: the parent `<aside>` already carries `aria-hidden="true"`, but adding `role="presentation"` on the `<pre>` defends against screen readers that ignore `aria-hidden` on the parent.

### Files changed

- `home.html` — fixes 1, 3, 4, 5, 6, 8, 10, 11, 13, 16.
- `about.html` — fixes 1, 3, 8, 13.
- `career.html` — fixes 1, 2, 3, 7, 8, 12, 13.
- `projects.html` — fixes 1, 3, 8, 13, 14.
- `articles.html` — fixes 1, 2, 3, 8, 9, 11, 13, 15.
- `notes.md` — this revision block + §2.2 contrast table update.

### §2.2 contrast table — updated with v4.1 `--lo`

The v4.1 `--lo` bump (#6F7E68 → #7E8E76) lifts all `--lo`-on-dark combinations to AA at body size. The "AA large only" qualifier on `--lo` on `--surface-2` is dropped — the combination is now AA-compliant at any body size.

| Foreground | Background | Ratio | Verdict |
|---|---|---|---|
| `--hi` on `--bg` | — | 15.4 : 1 | AAA |
| `--mid` on `--bg` | — | 8.2 : 1 | AAA |
| `--lo` on `--bg` | — | **5.49 : 1** (v4.1, was 4.6 : 1) | **AA** (body) |
| `--accent` on `--bg` | — | 15.7 : 1 | AAA |
| `--lo` on `--surface-2` | — | **5.30 : 1** (v4.1, was 4.3 : 1) | **AA** (body) |
| `--accent-mute` on `--bg` | — | 1.8 : 1 | Decorative borders only |

The restriction note that prefaced the prior table (`--lo` on `--surface-2` restricted to ≥`--t-meta` for non-essential metadata) is no longer required and is removed.

### Non-changes confirmed

Carried forward from v4 — explicitly not touched in v4.1:

- `<strong class="acc">` demotion on hero (v4 #10) — kept demoted.
- Featured background tint (v4 #9) — kept removed; fix #14 above adds an inset top-line, not a tint.
- Curly-quote treatment (v4 #4) — unchanged.
- `--gutter-date` token (v4 #14) — unchanged.
- Option-b list semantics (v4 #1) — preserved; fix #2 above operates within the same semantics (still `<ul>`/`<li>`).
- Photo touch-device handling (v4 #3) — unchanged.

### Open items / not fixed

None at this audit. Every numbered item 1–16 from the audit applied cleanly.

---

## v4 revisions (post-08 full audit)

Direction 09 was cloned from direction 08 (Prose & Mono · Polished v3.6) and audited as a whole. The audit found one critical-tier semantics issue, one critical-tier contrast issue, and a long tail of high/medium/low-tier polish items. v4 applies every fix from that audit. Each numbered group below corresponds to a fix item in the audit doc and includes its reasoning so future editors can see why the change exists.

### Standing rules introduced in v4

- **Card lists are `<ul>`/`<li>` semantics; card titles are non-heading elements.** Every project, career role, article entry, and home-Latest row is a database row rendered visually — not a sub-section of the document. The document outline is therefore `page-h1 → list-of-items`, not `page-h1 → item-headings`. CSS classes (`.role__title`, `.pr__title`, `.art__title`) are retained for styling; only the element tag changes from `<h3>` to `<p>`. Single-band pages (Career, Projects, Articles) carry zero inner headings in `<main>` and label their lone section with `aria-label` instead of `aria-labelledby`.
- **User-facing prose uses U+2019 (right single quotation mark) for apostrophes** (`&#x2019;`) and U+201C / U+201D for double quotes (`&#x201C;` / `&#x201D;`). Straight `'` and `"` are reserved for HTML attributes, CSS strings, and script/comment internals.
- **Spec §2.2 contrast table needs a future correction.** `--lo` (#6F7E68) on `--surface-2` (#0F1410) at body size is **below AA** (4.3 : 1 fails 4.5 : 1 minimum for non-large text). The v4 row-hover convention therefore uses `--mid` (#9DAA95), not `--lo`, for the `@` separator inside `.row__body` on the home Latest section. The §2.2 table row currently lists this combination as "AA large only"; the entire combination should be flagged as below-AA at body size in a future spec rewrite. Don't reach for `--lo` on `--surface-2` for body-size text — use `--mid`. **[Superseded by v4.1 fix #8 — token bump (#6F7E68 → #7E8E76) cleared the constraint. `--lo` on `--surface-2` is now 5.30 : 1, AA at body size; `.row__at` and `.role__at` reverted to `--lo` in v4.1. Historical record preserved.]**

### Fix groups applied

1. **Heading hierarchy — cards are list items.** All card lists wrapped in `<ul>` (`.rows`, `.career-list`, `.list`, `.grid-frame--3col`); each card becomes a `<li>` (in Projects, the `<article class="pr">` collapsed to `<li class="pr">` to keep the grid cell as the styled element). All card titles (`.role__title`, `.pr__title`, `.art__title`) demoted from `<h3>` to `<p>`. Sections without an inner `<h2>` lost `aria-labelledby` and gained `aria-label` (Career: "Career roles"; Projects: "Projects"; Articles: "Articles"). Home Latest keeps its h2 ("Latest"); About keeps its four h2's (Bio, Education, Facts, Resume) and the two h3's inside Education cells (legitimate cell sub-titles, not list items).

2. **Contrast fix — `.row__at` on `--surface-2`.** Changed from `color: var(--lo)` to `color: var(--mid)`. The `@` is a visible separator inside the row body, and the row hovers to the `--surface-2` background; the prior `--lo` on `--surface-2` computed to 4.3 : 1 (below AA at body size). `--mid` restores AA. See standing-rules note above.

3. **About photo — keyboard / touch reveal parity.** `.photo-wrap` is now `tabindex="0"` and carries `aria-label="Portrait of André Silva — focus or tap to reveal natural color"`. The reveal CSS now triggers on `:hover`, `:focus`, and `:focus-within`. On `(hover: none) and (pointer: coarse)` devices the default filter is softened (sepia/saturate halved, scanlines reduced to 0.55 opacity) so the photo is recognizable without interaction.

4. **Curly apostrophes / double quotes.** Replaced every user-facing `'` with `&#x2019;` (U+2019). Touched: home Latest eyebrow ("what i'm doing now"); career Nuxstep role ("Spotify's SDK"); projects CRCMG description ("Minas Gerais state's"); projects CONFEA description ("Brazil's"). Verified: CSS font strings, JS string literals, HTML attributes, and inline comments retain straight quotes (machine-readable contexts). No straight double-quotes appear in user-facing prose anywhere in the 5 HTML files.

5. **Articles list semantics — folded into fix #1.** `<div class="list" aria-label="Articles">` became `<ul class="list">`; the `aria-label` moved to the parent `<section>`. Each entry wrapped in `<li>`.

6. **Row hover — opacity overlay, not background-color.** `.row` now positions a `::before` pseudo-element with `opacity: 0` over the row surface. On hover the `::before` transitions to `opacity: 1`, revealing the `--surface-2` underlay. The transition target is `opacity` (motion-rule compliant), not `background-color`. Reduced-motion users get the global transition-duration override so the swap is instant; the visual is preserved.

7. **Latest CTA copy — unified to "Read more →".** v3 used "View career", "View projects", "View articles" — each row's CTA duplicated its badge text. v4 uses "Read more →" on all three rows. The badge already names the category (CAREER / PROJECT / ARTICLE); the CTA just needs to signal "more on this surface". Uniform CTA copy also lets the eye scan the row endings as a clean column.

8. **Career chip strip — capped at `var(--prose-w)`.** Added `max-width: var(--prose-w)` to `.role__chips` so the chip strip wraps at the same right edge as the bullets above it.

9. **Projects featured affordance — tint dropped.** `.pr--is-featured` no longer applies `background: rgba(200,255,61,0.025)`. The FEATURED badge alone marks the card; the tint was a double-signal that consumed accent budget without adding information. Class kept (no-op rule) so future variants can hook back into it.

10. **Hero `<strong class="acc">` demoted to plain `<strong>`.** "9+ years of experience" lost its `.acc` modifier on home. The hero already carries 4 accent applications (name, status dot, role, eyebrow); a 5th inside the pitch sentence pulled the eye into the middle of the paragraph rather than letting the gaze flow to the role line.

11. **Press feedback — `transform: scale(0.97)` on `:active`.** Applied to `.row` and `.button-cta` (home), `.button-cta` and the photo wrapper's interactives via `.button-cta` (about), `.link-arrow` (career, projects, articles). All wrapped in `@media (prefers-reduced-motion: no-preference)`.

12. **Latest row `aria-label` — trimmed to match visible text.** The three Latest rows had aria-labels that duplicated visible content and added page-navigation prose ("Read more on the career page"). v4 trims to just the row's identity phrase: `aria-label="Senior Engineer at MPA"`, `aria-label="Grafex"`, `aria-label="How I Achieved a 74% Performance Increase on a Page"`. Screen readers still announce the CTA ("Read more") and the link role from the `<a>` itself.

13. **`.pr__title` padding scoped to featured cards.** The 88px right-pad (badge clearance) moved from `.pr__title` to `.pr--is-featured .pr__title`. Non-featured cards reclaim the right space for title wrapping.

14. **Magic `183px` gutter formalized.** Added `--gutter-date: 183px` to career's `:root`; `.role` `grid-template-columns: var(--gutter-date) 1fr`. The literal's reason ("minimum width that fits every date string on one line") is now in the token's CSS comment.

15. **Eyebrow reword — home Latest.** "// 02 / on the radar" → "// 02 / what i'm doing now". "on the radar" reads as a watchlist (things the writer is monitoring externally); "what i'm doing now" reads as a status snapshot (the writer's current activity), which matches what the section actually shows (current role, latest project, latest article).

16. **Status dot `aria-label` — unified to "current role".** Home hero used "currently employed"; career current role used "current role". v4 uses "current role" on both (more specific — "currently employed" is true for many jobs the visitor isn't seeing; "current role" identifies the specific item).

### Non-changes confirmed (called out, no fix needed)

- **Footer copyright line** — André removed it deliberately in an earlier revision; not re-added.
- **Em-dashes** — already correct (U+2014) throughout per v3.4.
- **Marketplace Bridge empty-link card** — correct empty-state handling; no `.pr__links` cluster, just title + description + chips.
- **Focus ring** — already correct (2px solid accent, 2px offset).

### Files changed

- `home.html` — fixes 1, 2, 4, 6, 7, 10, 11, 12, 15, 16.
- `about.html` — fixes 3, 4 (no straight apostrophes existed in prose), 11.
- `career.html` — fixes 1, 4, 8, 11, 14, 16.
- `projects.html` — fixes 1, 4, 9, 11, 13.
- `articles.html` — fixes 1, 4 (no straight apostrophes existed in prose), 5, 11.
- `notes.md` — this revision block.

---

## v3.5 revisions

Supersedes the "position @ company" unified-color rule from v3.1.

**New rule (global):** *Accent lands on the surface's primary noun.*

Same rule applied everywhere — only the referent changes by surface:

| Surface | Communicative intent | Primary noun | Accent on |
|---|---|---|---|
| Home hero | Identity statement ("I am a Senior Engineer at MPA") | Position | `--accent` on `.role-line .role`; `--hi` on `.role-line .role-company` |
| Home Latest row | One-line milestone, identity-style | Position | `--accent` on `.row__body strong`; `--hi` on `.row__company` |
| Career list | Comparative timeline scan across 6 roles | Company | `--accent` on `.role__company`; `--hi` on `.role__title` *(unchanged)* |

**Why the variation is principle, not inconsistency.** A reader on the home hero is asking *who is this person*; on the career page they are asking *where has this person been*. The accent is the typographic emphasis the surface needs — it weights the noun the surface is actually about. Tying the color to a single token role (position OR company) optimizes for the wrong invariant. The rule "accent = the surface's primary noun" is single and global; only its referent changes per surface.

**Trade-off explicitly accepted:** a first-time visitor scrolling home → career sees "MPA" rendered in two colors within ~5 seconds. The alternative — picking one rule and forcing the wrong surface to wear it — sacrifices clarity on whichever surface loses. The hero loses more from a misweighted identity statement than the career list loses from a momentary color shift.

**Files changed:**
- `08-prose-mono-polished-v3-home.html` — `.role-line .role` flipped to `--accent`; `.role-line .role-company` flipped to `--hi`; `.row__body strong` flipped to `--accent`; `.row__company` flipped to `--hi`. Inline CSS comments updated to reference v3.5.
- Career, about, projects, articles: no change.

---

## v3.4 revisions

Two items. The first locks in the final photo filter value André tuned by hand via devtools. The second re-derives the card-layout pattern from first principles after the v3.3 verdict was challenged as precedent-based rather than principle-based — and reaches a different conclusion than v3.3.

### Decisions

1. **About photo filter — final landed value.** André dialed this in directly via devtools and shared the verbatim string. The v3.1 retune (hue-rotate 55deg, saturate 3, contrast 1.05, brightness 1.02) overshot warm into a yellow-leaning cast; the live tuning pulled the rotation back to 40deg and reset contrast and brightness to 1. The grayscale + sepia + saturate stack is unchanged.

   ```
   --photo-filter: grayscale(1) sepia(1) hue-rotate(40deg) saturate(3) contrast(1) brightness(1);
   ```

   Locked. The reasoning the v3.1 block put on hue-rotate(55deg) (yellow-green target hue) was directionally right but overshot; 40deg lands the lime cleanly without the yellow lean. Recorded as the final v3.4 value; the v3.1 commentary block is superseded in the file (the inline CSS comment was rewritten to point at v3.4 as the final value).

2. **Card-layout pattern — re-derived from first principles, verdict: pattern (b) (chips + link form a bottom-pinned footer).** This supersedes the v3.3 verdict on the projects card.

   **Why v3.3 was challenged.** The v3.3 reasoning was "match `.art` and `.role` — they treat chips and links as sequential siblings with no auto-gap, so `.pr` should too." That is consistency-with-precedent reasoning, not principle reasoning. The fact that three components share a pattern doesn't make the pattern correct; it can equally indicate three components share the same artifact. User pushback: *"It doesn't need to choose this just because the other pages also do this. We should consider what is the best practice and fix everywhere."* Correct.

   **Structural reality check first.** Re-auditing the components, the empty-space question only structurally arises in `.pr` — it's the only card component sitting in a multi-column grid where peer cards in the same row stretch the track to the tallest member. `.art` and `.role` stack one-per-row vertically; their cards never have spare vertical space to redistribute, so their "sequential, no auto-gap" rule is structurally vacuous, not a deliberate design choice. Citing them as precedent for `.pr` is comparing components that don't have the same problem to solve. This invalidates the v3.3 argument on its own terms.

   **First-principles re-derivation.** A card with four element types — title (the noun), description (the substance), chips (categorical metadata), link (the exit action) — has two not-co-equal groupings:

   - **Content group**: title + description. The "what is this thing and what does it do" payload.
   - **Affordance group**: chips + link. The "is this relevant, and how do I act on it" decision-support strip.

   Mainstream product card patterns (GitHub repo cards, Linear project cards, Stripe dashboard cards, Material Design's Card component, the App Store product tile) all anchor the affordance group — language/topic tags + action — at the bottom of the card while keeping name + description at the top. The Gestalt principle of common region argues that elements in shared visual proximity are perceived as one group. When chips and the link are visually adjacent at the bottom, the user reads them as "the metadata footer" — one visual unit they can scan in parallel across a row of cards. When the chips sit mid-card and the link is bottom-pinned (rejected pattern c), the user reads two separated regions and double-scans.

   The grid-aesthetic argument independently supports the same conclusion. A 3-col card grid wants two strong horizontal alignment lines: titles at the top (because all titles share `padding-top` of the card), and affordances at the bottom (only if affordances are bottom-anchored). Pattern (b) creates both lines; pattern (a) creates only the top line and leaves the bottom edge ragged-content-flush, which is exactly the "dead air below the card" complaint that originated this whole investigation.

   The Fitts's-law argument in defense of pattern (a) ("the CTA should be where the hand expects it") is real but doesn't discriminate between (a) and (b): the link sits at the bottom in both cases. The difference is whether the *chips above the link* are part of the footer (b) or floating mid-card (a).

   **Verdict: pattern (b).** Chips + link are the metadata-and-action footer; both pin to the bottom of the card. Spare vertical space falls between description and chips. This reads as the structural divider between content and footer — the same metaphor every document-with-a-footer establishes — rather than as accidental dead air.

   **Honest acknowledgement.** This is the opposite verdict from v3.3, which chose pattern (a). v3.3 was wrong to use "matches `.art` and `.role`" as its primary argument; that argument was vacuous because those components don't structurally face the same question. The v3.2 enumeration of options correctly identified pattern (b) (Option 2 / Option 3 in that block) but rejected the bottom-anchored chips on a "floating chips read as stranded" risk that does not materialise: chips and link are siblings 8px apart (`.pr`'s flex gap), which is well below the common-region threshold for "separate group." The 18 production cards each carry ≥1 chip; chips are never floating in isolation.

   **Application scope.** Audited every card-like component:

   | Component | Lives in | Grid-stretch question? | Action |
   |---|---|---|---|
   | `.pr` (projects) | 3-col grid, peers in same row | **Yes** — short cards in mixed-height rows | Apply pattern (b): `margin-top: auto` on `.pr__chips` |
   | `.art` (articles) | Vertical list, one per row | No — no peers | No CSS change. Structurally already correct; flowed siblings produce no spare space to redistribute. |
   | `.role` (career) | Vertical list, one per row | No — no peers | No CSS change. Same reason as `.art`. |
   | `.row` (home Latest) | Single horizontal line | No — different shape | No CSS change. No description, no chips; not the same card pattern. |
   | `.education-cell` (about) | 2-col `.grid-frame` | Yes in principle, but content shape is title + institution + description (no chips, no link) | No CSS change. Pattern (b) doesn't apply — no affordance group exists. Spare space below description is acceptable for a content-only cell. |
   | `.facts-cell` (about) | 2-col `.grid-frame` | Yes in principle, but content shape is key + value | No CSS change. No affordance group; spare space below the value pair is acceptable. |
   | `.pr--is-featured` | 3-col grid | Yes (it IS a `.pr`) | Unaffected by the change. The accent tint covers the whole card; the FEATURED badge is `position: absolute` to the top-right corner. The new `margin-top: auto` on `.pr__chips` doesn't interact with either. |

   So the only file that takes a CSS edit is **projects**. Articles and career stay as-is — not because of v3.3-style "match the other pages" reasoning, but because their layout never produces the spare-space situation pattern (b) was designed to handle. If their structure ever changed to a multi-column grid, this verdict says they would adopt pattern (b) too.

### CSS diff (decision 2)

```css
/* Before (v3.3) — .pr__chips and .pr__links flow as sequential siblings;
   empty space (when present) falls below .pr__links. */
.pr__chips {
  display: flex; flex-wrap: wrap; gap: var(--s1);
  padding-top: var(--s1);
}
.pr__links {
  padding-top: var(--s2);
  display: flex; flex-wrap: wrap; gap: var(--s2) var(--s4);
  align-items: baseline;
}

/* After (v3.4) — margin-top: auto on .pr__chips pushes the chips + link
   group to the bottom of the flex column. Within the group the order and
   spacing are unchanged; the spare space lands above the chips, between
   description and footer. */
.pr__chips {
  margin-top: auto;
  display: flex; flex-wrap: wrap; gap: var(--s1);
  padding-top: var(--s1);
}
.pr__links {
  padding-top: var(--s2);
  display: flex; flex-wrap: wrap; gap: var(--s2) var(--s4);
  align-items: baseline;
}
```

Note: the auto rule lives on `.pr__chips` (the *first* element of the footer group), not on `.pr__links`. Putting it on the first element pushes the whole tail of siblings down as a block; the chips and link cluster therefore remain 8px apart via `.pr`'s `gap: var(--s2)`. Putting it on `.pr__links` instead would only push the link cluster down, leaving the chips stranded mid-card — that was the original screenshot defect this investigation started from.

For cards without a `.pr__links` element (Marketplace Bridge is the only one in the data set), `.pr__chips` becomes the last child of the flex container and `margin-top: auto` pins the chip strip to the bottom of the card. The empty space lands above the chips — consistent with the rule.

### Supersession of v3.3 decision 1

The v3.3 decision ("remove `margin-top: auto` from `.pr__links` so chips and links flow as sequential siblings") is reversed. The chip+link pair is now bottom-pinned as a group via `margin-top: auto` on `.pr__chips`. The v3.3 reasoning is also withdrawn: "matches `.art` and `.role`" was a structurally vacuous comparison and not load-bearing on principle. The rest of the v3.3 block (which is just the rationale for that one CSS edit) is superseded; the v3.2 block's reasoning that originally pinned the link cluster to the bottom of the card was directionally right, only its implementation (auto on `.pr__links` alone) was off by one element.

### Files touched (v3.4)

| # | Item | Files |
|---|---|---|
| 1 | Photo filter — final landed value | about |
| 2 | `.pr__chips { margin-top: auto }` (and removed from `.pr__links`) | projects |
| 3 | This `v3.4 revisions` block | spec md |

The remainder of the v3.3 / v3.2 / v3.1 / v3 / v2 / v3-revision sections carries through unchanged where not explicitly superseded above.

---

## v3.3 revisions (post-v3.2 principle re-review)

One follow-up item on the v3.2 projects-grid decision. Re-derived from peer-component patterns and supersedes the v3.2 conclusion on this single point.

### Decisions

1. **Projects card — `.pr__links { margin-top: auto }` removed.** v3.2 dropped `grid-auto-rows: 1fr` on `.grid-frame--3col` (correctly) but left `margin-top: auto` on `.pr__links` (incorrectly). The combination still produced visible empty space *between* `.pr__chips` and `.pr__links` on shorter cards within a row that contained a taller card (grid's default `align-items: stretch` per row track still equalises card heights to the row's tallest member). The empty space didn't disappear — it moved from below the link cluster to above it.

   **The principle.** Looking at peer card components:

   - `.art` (articles): `art__tags` and `art__lnk` are both sequential siblings spaced with `margin-top: var(--s4)`. Neither carries `margin-top: auto`. Chips/tags are treated as *content metadata* and the link sits as the next sequential sibling — not as a separate bottom-anchored footer.
   - `.role` (career): `role__chips` and `role__refs` use the identical pattern — both `margin-top: var(--s4)`, sequential, no auto-gap.

   The projects card was the only place in the design system where the trailing link cluster was bottom-anchored away from the chips that precede it. This was inconsistent on principle, and it produced exactly the "unmotivated mid-card empty space" v3.2 had flagged as a defect of Option 4. The chips are part of the card's *content* (paired with the description), not part of a *metadata footer* (paired with the links) — peer components establish this unambiguously.

   **The fix.** Remove `margin-top: auto` from `.pr__links`. Chips + links now flow as sequential siblings, matching `.art` and `.role`. When a card is shorter than its row's tallest sibling, the empty space falls below the link cluster — which is the design-system-wide convention for "card has less content than its row demands."

   **Why v3.2 under-weighted this.** The v3.2 evaluation was scope-anchored ("minimum-viable fix to the actual reported defect") rather than principle-anchored. Option 1 was framed as preserving the existing internal card layout, but that layout was itself inconsistent with the rest of the design system and only justifiable while `grid-auto-rows: 1fr` was in force (uniform heights demanded a bottom anchor for the link cluster). Once `1fr` came out, the `margin-top: auto` rule became a stranded artifact that produced the very defect it was supposed to prevent. v3.2 stopped one rule short of resolving the original screenshot.

   **"Stranded chips" risk reassessment.** v3.2 rejected bottom-aligning chips on the grounds that floating chips without an explicit grouping would read as stranded. That risk does not materialise here: every one of the 18 real cards has ≥1 chip and ≥1 link, and chips are not floating — they sit immediately above the link cluster as a content sibling, exactly as on `.art` (where `art__tags` sits immediately above `art__lnk` with the same `--s4` spacing). No `.pr__footer` wrapper is needed.

### CSS diff (decision 1)

```css
/* Before (v3.2) */
.pr__links {
  margin-top: auto;
  padding-top: var(--s2);
  display: flex; flex-wrap: wrap; gap: var(--s2) var(--s4);
  align-items: baseline;
}

/* After (v3.3) */
.pr__links {
  padding-top: var(--s2);
  display: flex; flex-wrap: wrap; gap: var(--s2) var(--s4);
  align-items: baseline;
}
```

No other CSS rules change. `.grid-frame--3col` retains the v3.2 form (no `grid-auto-rows: 1fr`). `.pr` retains `display: flex; flex-direction: column; gap: var(--s2)`. Source order is unchanged (title → description → chips → links). Responsive overrides are unchanged.

### Supersession of v3.2 decision 3

The v3.2 grid block ("Projects grid — dropped `grid-auto-rows: 1fr`") is partially superseded. The `grid-auto-rows: 1fr` removal stands; the *retention* of `margin-top: auto` on `.pr__links` does not. The reasoning given in v3.2 — that the link cluster should "remain bottom-anchored within each card" — under-weighted the now-dominant principle that the projects card should match the chips/links pattern of `.art` and `.role`. Option 1 in the v3.2 enumeration was the right structural call (per-row natural heights); the implementation should have additionally dropped the bottom-anchoring rule that was only meaningful under the `1fr` regime.

### Files touched (v3.3)

| # | Item | Files |
|---|---|---|
| 1 | `.pr__links` — remove `margin-top: auto` | projects |

The remainder of the v3.2 / v3.1 / v3 / v2 / v3-revision sections carries through unchanged.

---

## v3.2 revisions (post-v3.1 follow-up review)

Three targeted items reviewed after v3.1 went out. Each one overrides the matching v3.1 decision.

### Decisions

1. **Em-dash audit — project titles restored to em-dashes.** v3.1 reverted the two project titles `Firebird — …` and `OAC — …` to hyphens on the grounds of "verbatim fidelity to `static-projects-repository.ts`." Override: the prototype's job is to render the typographically correct mark, not mirror source punctuation. The two strings in question are project-name + descriptive-subtitle pairs, which is canonically a colon-or-em-dash pattern in English typography. Restored:

   ```
   Firebird — Add permissions to multiple databases
   OAC — Obstacle Avoiding Car
   ```

   These edits live in the prototype HTML only — `static-projects-repository.ts` is unchanged (read-only data source). The engineer translating the prototype to production code will apply the same typographic substitution at the rendering layer, not at the data layer.

   **Audit of every other hyphen across the 5 pages — what was kept and why:**
   - Hyphenated compounds (`end-to-end`, `front-end`, `Co-Founder`, `20-20-20 rule`, `e-commerce`, `Senior Front-end Engineer`, `front-end engineers`) — left as hyphens; these are word-internal hyphens, not punctuation marks, and substituting an em-dash would break the compound.
   - `UTC-03` — left as hyphen-minus; this is a numerical offset, not a range or an aside.
   - Spaced em-dashes already in prose (`Works end-to-end — from architecture and infrastructure...`, `software engineering — the basis for nine years...`) — already correct.
   - Date ranges (career page `apr 2025 — now`, `jan 2024 — apr 2025`, `mar 2022 — jan 2024`, `nov 2021 — mar 2022`, `jun 2018 — oct 2021`, `mar 2017 — dec 2018`; about page `UNIVALI · 2015 — 2019`, `Full Cycle · 2022 — 2023`) — **kept as em-dashes** even though strict typographic convention prefers en-dashes (`–`) for true numerical ranges. Reasoning: (a) the prototype already standardised on em-dashes across v3.1 (see v3.1 decision 4, which references the dates as em-dashes), (b) in JetBrains Mono at body size the en-dash is visually almost indistinguishable from a hyphen-minus, so switching would lose the typographic separation that the em-dash provides between the date numerals, (c) introducing a third dash variant inside the same page (hyphen-minus for compounds, en-dash for ranges, em-dash for asides) is a regression in consistency. This is a deliberate mono-typesetting trade-off and is recorded here so future iterations don't "fix" it.

2. **Resume button copy — `Download CV` → `Download résumé`.** The section heading is `Resume`; pairing it with a button labelled `Download CV` creates a CV/Resume terminology mix in adjacent typographic positions. Candidates considered:
   - `Download CV` — current; mixes American (`Resume`) and European (`CV`) terms.
   - `Download résumé` — verbal cohesion with the heading. The acute on `é` is the correct French diacritic and signals deliberate craft. Selected.
   - `Download (PDF)` — terse and format-forward, but the heading does all the work and the button reads as a metadata note rather than an action verb.
   - `Get the PDF` — informal; out of register with the rest of the site's professional-terse copy.

   The `.button-cta` class applies `text-transform: uppercase`, so the rendered text is `DOWNLOAD RÉSUMÉ`. JetBrains Mono renders capital `É` correctly with the diacritic intact. The `href` and `download` attribute on the anchor are unchanged.

3. **Projects grid — dropped `grid-auto-rows: 1fr`.** User screenshot showed the first row of cards (Grafex / Calcloak / Injektion) carrying a large empty band between the tech chips and the bottom-pinned `site →` link. Diagnosis: `.grid-frame--3col` had `grid-auto-rows: 1fr`, which normalises every row in the grid to the height of the tallest row. The heaviest rows in the projects grid carry cards with 6–8 chips and 3 link rows (Teseu, OAC, EyesUp), so row 1's three short cards inherited that height and the bottom-pinned link cluster created the gap.

   Five options were evaluated:
   - **Option 1 — per-row natural heights** (drop `1fr`). Rows size to their own tallest member; cross-row stretching disappears.
   - **Option 2 — drop `1fr` + bottom-align chips.** Chips and links move together to the bottom. Works but chips floating without an explicit grouping read as stranded.
   - **Option 3 — drop `1fr` + group chips + links in a `.pr__footer`.** Semantically cleanest but invasive (18 cards to re-wrap).
   - **Option 4 — keep `1fr` + bottom-align chips.** Uniform heights, but the mid-card empty space is unmotivated.
   - **Option 5 — keep `1fr` + drop bottom alignment.** Ragged-bottom visuals.

   **Selected: Option 1.** Minimum-viable fix to the actual reported defect. The card's internal order stays unchanged (title → description → chips → auto-gap → links), so the link cluster remains bottom-anchored within each card and only matters when one card in a row is materially taller than its sibling (e.g., a row containing EyesUp will still push the lighter cards' links to the bottom, which is the original intent). The cross-row stretching that was distorting row 1 drops out.

   **Featured affordance verification:** `.pr--is-featured` applies `background: rgba(200,255,61,0.025)` to the entire `<article>`, which covers the card regardless of its height. `.pr__badge` is `position: absolute; top: var(--s4); right: var(--s4)`, anchored to the card's top-right corner independent of height. The accent tint and badge both still read after the change.

### CSS diff (decision 3)

The exact change to `.grid-frame--3col` in `08-prose-mono-polished-v3-projects.html`:

```css
/* Before */
.grid-frame--3col { grid-template-columns: repeat(3, 1fr); grid-auto-rows: 1fr; }

/* After */
.grid-frame--3col { grid-template-columns: repeat(3, 1fr); }
```

No other CSS rules are affected. `.pr__links { margin-top: auto }` is unchanged (still pins links to the bottom when there's height to fill within the card). `.pr__chips` stays immediately after `.pr__desc` in source order with no `margin-top: auto`. The responsive overrides (`@media (max-width: 1100px)` and `@media (max-width: 700px)`) are unchanged — they only rewrite `grid-template-columns`, not row sizing.

### Files touched (v3.2)

| # | Item | Files |
|---|---|---|
| 1 | Em-dash audit — project titles restored | projects |
| 2 | Resume button → `Download résumé` | about |
| 3 | Projects grid — drop `grid-auto-rows: 1fr` | projects |

The remainder of the v3.1 / v3 / v2 / v3-revision sections carries through unchanged.

---

## v3.1 revisions (post-v3 visual review)

Seven targeted polish items applied after a second hands-on review of the v3 prototypes. Each item supersedes the matching v3 decision.

### Decisions

1. **Home Latest — uniform badge width.** `.row__badge` chips (`CAREER`, `PROJECT`, `ARTICLE`) previously sized to content, so widths differed. Added `min-width: 80px`, `justify-content: center`, and `text-align: center` so every badge renders at the same width with its label centered. The 80px target was picked to comfortably fit `ARTICLE` (the longest label) plus existing padding without truncation, and is large enough that `CAREER` and `PROJECT` center cleanly inside. Result: the three badges form a tidy left-aligned column at the start of each row body. Updated on Home only.

2. **Home Latest — article row CTA + href.** The article row in `.rows` previously pointed at the dev.to URL with CTA text `dev.to`. Both changed:
   - `href` is now `08-prose-mono-polished-v3-articles.html` (the local articles index), consistent with the career and project rows which link to their respective index pages.
   - CTA text is now `View articles`, mirroring `View career` / `View projects`.
   - `target="_blank"` and `rel="noopener noreferrer"` are removed since the destination is now in-site.
   - `aria-label` is unchanged. Rationale: clicking a "Latest" row should always land on the corresponding index page in the real site, not deep-link to an external article — the row is a category teaser, not a direct article link.

3. **About photo — filter retuned from forest/emerald to brand lime.** The v3 filter (`grayscale(1) sepia(1) hue-rotate(38deg) saturate(8) contrast(1) brightness(0.95)`) produced a pure saturated green, reading as emerald/forest, not the brand lime `#C8FF3D`. Diagnosis: `#C8FF3D` is HSL(71°, 100%, 62%) — a YELLOW-green whose character is *brightness + yellow tilt*, not high saturation. The v3 value over-saturated (8x) and under-rotated hue (38°), clamping the photo onto a single pure-green hue. Final v3.1 value:

   ```
   --photo-filter: grayscale(1) sepia(1) hue-rotate(55deg) saturate(3) contrast(1.05) brightness(1.02);
   ```

   Reasoning per channel:
   - `sepia(1)` — unchanged; seeds a warm yellow-brown base around hue 30–40°.
   - `hue-rotate(55deg)` — pushes the base past pure green into the 85–95° band; with the grayscale photo's muted hue this reads as a yellow-green tilt rather than a saturated green.
   - `saturate(3)` — aggressive drop from 8. The previous saturation was the main cause of the emerald reading; lime is bright, not saturated.
   - `brightness(1.02)` — small boost (was 0.95); lime is bright (62% lightness) and the v3 darkening was reading as forest.
   - `contrast(1.05)` — small bump to keep mid-tones from flattening into pastel after the saturation drop.

   The CRT scanline `::after` overlay (`mix-blend-mode: multiply`, 2px tracks) is unchanged. Hover behavior (filter clears + scanlines fade) is unchanged. Updated on About only.

4. **Career left column → 183px.** `.role` grid was `grid-template-columns: 160px 1fr` in v3; this wrapped some date strings ("mar 2017 — dec 2018", "jan 2024 — apr 2025") onto two lines. Bumped to `183px` — the minimum width verified to keep every date range on a single line. The mobile `≤760px` rule still collapses the grid to one column, so this fixed width only applies at desktop breakpoints. Updated on Career only.

5. **Position @ Company color convention — unified.** Three surfaces were inconsistent:
   - Home hero `.role-line`: position=accent, company=hi
   - Home Latest career row `.row__company`: company=hi
   - Career page `.role__title` / `.role__company`: position=hi, company=accent

   **Decision: company carries `--accent`, position carries `--hi`.** The company is the wayfinding noun — it's the unique identifier (MPA, Atlas, Nuxstep) people scan for when reading a role line, especially when scanning across multiple roles on the career page. The position is the descriptor — "Senior Engineer" / "Front-end Engineer" repeats across roles and rarely disambiguates anything on its own. Accent emphasis belongs on the wayfinding noun.

   Changes applied:
   - **Home hero** (`.role-line .role` → `--hi`; `.role-line .role-company` → `--accent`).
   - **Home Latest career row** (`.row__company` → `--accent`).
   - **Career page** — already correct (position=hi, company=accent); no change.
   - About, Projects, Articles — no `X @ Y` patterns in body content; no change.

6. **Projects — descriptions matched verbatim to `static-projects-repository.ts`.** Cross-checked every project description against the canonical strings. Two systematic drifts existed:
   - **Trailing periods** — every description in the prototype ended in `.`; the canonical source has none. Removed from 17 cards.
   - **Em-dashes vs hyphens in titles** — the canonical titles for Firebird and OAC use a hyphen (`-`), not an em-dash (`—`). Corrected: `Firebird — …` → `Firebird - …` and `OAC — …` → `OAC - …`.

   Project-specific drifts also fixed:
   - **Grafex description** — prototype had an extra rewritten clause (`"Images as Code. Write JSX, export as images — a small library that makes social-share image generation painless and componentised."`). Canonical is just the first sentence: `"Images as Code. Write JSX, export as images"`. Restored verbatim.
   - **Firebird description** — prototype said `"A script that adds permissions to multiple Firebird databases."` (grammatically corrected). Canonical says `"A script that add permissions to multiple Firebird databases"` (the source has this typo). Reverted to the canonical typo so the prototype stays faithful to the data source.

   All other descriptions matched verbatim once trailing periods were removed. The full list of cards touched: Grafex (clause), Calcloak, Injektion, andresilva.cc, CustomBurger, EyesUp, Rendering Modes Demo, poc-vue-universal-component, Express API Template, Reflection Function, CRCMG, Firebird (title + desc), NativeScript Spotify, Teseu, CONFEA, OAC (title + desc), Marketplace Bridge, Voucher-Printer.

7. **Projects — inner section header removed.** The projects page had an inner `.sec-head--flush` block with eyebrow `// 01 / work` and `<h2>Projects</h2>`, which duplicated the page-head `<h1>PROJECTS</h1>`. Removed the entire `.sec-head` block — the page-head H1 is now the only heading. This mirrors the Career page pattern (no inner section header on single-section pages). The `<section class="band">` wrapper and its content (the grid) are unchanged; band padding (`var(--s8) 0`) gives the grid breathing room from the page-head divider, so no spacing adjustment was needed.

### Files touched (v3.1)

| # | Item | Files |
|---|---|---|
| 1 | Uniform badge width | home |
| 2 | Article row CTA + href | home |
| 3 | Photo filter retuned | about |
| 4 | Career gutter → 183px | career |
| 5 | Position/company color unification | home (role-line + row__company); career already correct |
| 6 | Project descriptions matched verbatim | projects |
| 7 | Inner section header removed | projects |

The remainder of the v3 spec (and the v2 / re-revision sections it builds on) carries through unchanged.

---

## v3 revisions (post-07)

Direction 08 starts from a verbatim clone of direction 07 (file names already renumbered, captions already say `// PROSE-MONO.POLISHED.V3  /  REDESIGN OPTION 08/08  /  [PAGE]`) and applies 13 user-feedback items captured on a second hands-on review. Each item is a binding decision that supersedes the matching v2 spec section.

### Decisions

1. **Footer is single-purpose.** The footer's `<span class="footer__copy">© 2026 · andresilva.cc</span>` is removed from every page. Footer keeps only `.footer__links` (github · linkedin · dev.to · email). `footer` becomes `justify-content: center` (was `space-between`). Rationale: a copyright line on a personal site is decoration; the social/contact links are the only useful footer content. Updated on Home, About, Career, Projects, Articles.

2. **Eyebrow vs title audit.** Every `.comment-tag` eyebrow must say something semantically distinct from the `<h2>` heading it precedes. Changes made:
   - Home, section 2: `// 02 / recent` → `// 02 / on the radar` (was a near-synonym of the heading `Latest`).
   - About, section 3: `// 03 / quick facts` → `// 03 / at a glance` (the word "facts" duplicated the heading `Facts`).
   - About, section 4: `// 04 / get in touch` → `// 04 / full work history` (section was renamed `Resume` — see #7).
   - All other eyebrow/title pairs (`// 01 / who` + Bio, `// 01 / in my own words` + Bio on About, `// 02 / where I studied` + Education, `// 01 / work` + Projects) were already semantically distinct; no change.

3. **Home hero CTA removed.** The `.hero-ctas` wrapper and the `<a class="button-text" href="mailto:hello@andresilva.cc">…</a>` inside it are deleted from the Home hero. The hero ends after `<p class="pitch">`. Rationale: the v2 spec already noted that pairing the Bio "Full bio →" link with a hero email CTA was duplicative; v3 takes the next step and removes the hero CTA entirely. Email is preserved in the footer.

4. **Home "Latest" rows overhauled.** Three changes to `.row`:
   - The `.row__date` column is deleted from every row. `grid-template-columns` becomes `1fr auto` (was `96px 1fr auto`). The `.row__date` CSS block is deleted.
   - The italic `.row__kind` inline text (`// career`, `// project`, `// article`) is replaced by a new `.row__badge` chip: uppercase mono `--t-micro`, `1px var(--s2)` padding, `0.12em` letter-spacing, accent-mute border, accent text, no `min-height`. Three labels: `Career`, `Project`, `Article`. Markup: `<span class="row__badge">Career</span>`.
   - The project row is shortened — only `<strong>Grafex</strong>` remains. The `<span class="row__at">—</span>` and the description `<span>Images as Code</span>` are removed. The career row and article row retain their existing body content.

5. **About photo color retuned.** `--photo-filter` is updated so the photo's mid-tones read as the exact brand lime `#C8FF3D`. New value: `grayscale(1) sepia(1) hue-rotate(38deg) saturate(8) contrast(1) brightness(0.95)`. The CRT scanline `::after` overlay is unchanged. The previous value (`grayscale(1) sepia(0.5) hue-rotate(60deg) saturate(3.2) contrast(1.05) brightness(0.92)`) read greener-than-lime; the v3 tuning bumps `sepia` to 1 (yellow-brown base), shifts `hue-rotate` toward yellow-green (38deg), and pushes `saturate` to 8 to clamp into the lime gamut.

6. **About Education dates updated.**
   - BS in Computer Science: institution is `UNIVALI · 2015 — 2019` (was `UnoChapecó · 2014 — 2018`).
   - Technical Leadership: institution is `Full Cycle · 2022 — 2023` (was `PUC Minas · 2022 — 2023`). User noted the date range may need confirmation; the 2022–2023 placeholder is kept until confirmed.

7. **About "Get in touch" section becomes "Resume".** The entire `.cta-pair` block plus `.cv-note` paragraph is deleted. The section keeps only the `<a class="button-cta" href="/resume.pdf" download>Download CV →</a>` button. The h2 is renamed `Resume`. The eyebrow becomes `// 04 / full work history`. `aria-labelledby` / id pair becomes `resume-h`. The `.cta-pair` and `.cv-note` CSS rules are removed.

8. **Career durations removed.** Every `<span class="role__duration">~X yr</span>` is deleted from every role (6 instances). The `.role__date-gutter` keeps only `.role__dates`. Gutter width is reduced from `180px` to `160px` (the duration text no longer needs the extra horizontal space). The `.role__duration` CSS block and its mobile-breakpoint override are deleted.

9. **Career "// refs:" label removed.** The `<span class="role__refs-label">// refs:</span>` element is deleted from the Nuxstep and Grupo Gmaes role blocks. Only the `<a class="link-arrow">` external-ref links remain inside `.role__refs`. The `.role__refs-label` CSS rule is deleted.

10. **Projects: Featured + All Projects merged into one grid.** The dedicated `<!-- Featured -->` `<section class="band">` (containing `.featured-strip`) is deleted. Grafex, Calcloak, Injektion are moved to the top of the All Projects `.grid-frame--3col` (in that order), using the same compact `.pr` card markup as the rest. The merged section's eyebrow is `// 01 / work`, h2 is `Projects`. Featured cards carry an extra class `.pr--is-featured` and a `<span class="pr__badge">Featured</span>` absolutely-positioned in the top-right corner of the card. `.pr--is-featured` uses a faint `background: rgba(200,255,61,0.025)` tint for additional differentiation. The `.featured-strip`, `.pr--lead`, `.pr--featured` CSS blocks are deleted.

11. **Projects tech filter removed.** The `<div class="tech-filter">…</div>` toolbar and the trailing `<script>` block that wires up filter clicks are deleted. The `.tech-filter*` CSS rules and the `.grid-frame--3col[data-active-filter=...]` filter-visibility rules are deleted. `data-active-filter="all"` is removed from the grid; every `data-tech="…"` attribute is removed from each card.

12. **Projects link text unified.** Featured cards (now in the merged grid) use the same compact pattern as the other cards: `<span>site</span>` for site links and `<span>github</span>` for GitHub-only links. The previous "visit grafex.dev" / "visit calcloak.com" / "view on github" phrasings are dropped. The `<span class="pr__none">// no public link</span>` on the Marketplace Bridge card is deleted along with its empty `.pr__links` wrapper.

13. **Projects card sizes equal.** Because every card now lives in `.grid-frame--3col` (`grid-template-columns: repeat(3, 1fr); grid-auto-rows: 1fr`), Grafex no longer takes the 2fr wide cell from the old asymmetric featured strip. All cards are equal width; rows stretch to a uniform height per row. No additional CSS needed — the existing grid already provides equal columns.

### Photo filter — final value (decision 5)

```
--photo-filter: grayscale(1) sepia(1) hue-rotate(38deg) saturate(8) contrast(1) brightness(0.95);
```

This is the only `:root` token changed between 07 and 08. All other tokens are inherited verbatim.

### Decision-to-page map

| # | Decision | Pages updated |
|---|---|---|
| 1 | Footer: remove copyright, center links | Home, About, Career, Projects, Articles |
| 2 | Eyebrow/title audit | Home (`// 02 / on the radar`), About (`// 03 / at a glance`, `// 04 / full work history`) |
| 3 | Drop hero email CTA | Home |
| 4 | Latest rows: drop date, add badge, simplify project | Home |
| 5 | Photo filter retuned to brand lime | About |
| 6 | Education dates updated | About |
| 7 | Get in touch → Resume | About |
| 8 | Drop role durations + narrow gutter | Career |
| 9 | Drop `// refs:` label | Career |
| 10 | Merge Featured + All into one grid | Projects |
| 11 | Remove tech filter + script | Projects |
| 12 | Unify featured card link copy | Projects |
| 13 | Equal card sizes via existing 3-col grid | Projects |

The remainder of the spec from direction 07 (v2) carries through unchanged, except where the sections above explicitly override it.

---

## v2 revision (post-06)

This pass starts from a verbatim clone of direction 06 and integrates 11 user-feedback items captured after a hands-on review. Each item below is a binding decision that the implementing agent applies directly.

### Decisions

1. **Hero CTA pair on Home is duplicative with the Bio "Full bio →" link.** **Decision:** Remove `Read more →` (`.button-cta`) from the Home hero. The `hello@andresilva.cc →` (`.button-text`) becomes the single hero CTA. The Bio section's `Full bio →` link-arrow remains as the contextual route into About. Rationale: the Bio link is earned by the section it sits in; the hero CTA pair was promoting the same destination twice on a page that fits both above the fold. Updated in §0.2 (A1 amended), §6.9 (CTA pairing rule revised), §9.1 (Home hero), §13.5 (build checklist).

2. **Home "Latest" must show one item per kind, not a chronological mix.** **Decision:** Trim Latest from 4 rows to 3 rows: 1 career + 1 project + 1 article. Career row = Senior Engineer @ MPA (current). Project row = Grafex (most recent featured). Article row = "How I Achieved a 74% Performance Increase on a Page" (the standout). The `Rendering Modes Explained` row is dropped. Rationale: "Latest" is more useful as a one-of-each pulse than as a fragile date sort across mixed types. Updated in §9.1.

3. **About photo moves to the left side of the prose, not the right column.** **Decision:** Photo moves into a left column at 200×260 (3.25:4 aspect, slightly smaller than the prior 240×320 to better balance against the prose-left/photo-right pattern from `05-prose-mono-refined-about.html`). Grid template becomes `200px 1fr` with `gap: var(--s10)` and `align-items: start`. On `≤ 1000px` the grid collapses to one column; the photo sits ABOVE the prose at full width (max 320px) — `order: -1` is removed and the photo precedes the prose in source order. Rationale: matches direction 05's established layout; mono prose reads more naturally without a hard right-column edge. Updated in §6.23 (`.photo`), §9.2 (About bio markup + `.about-grid`).

4. **Photo green effect doesn't match site lime; needs a cool secondary effect.** **Decision:** Two-part change. First, **retune the filter** to land on actual `--accent` lime: `grayscale(1) sepia(0.5) hue-rotate(60deg) saturate(3.2) contrast(1.05) brightness(0.92)`. Second, **add a CRT scanline overlay** via a `::after` pseudo-element on a wrapper around the `<img>`. The overlay uses `repeating-linear-gradient` at 2px tracks (1px transparent, 1px `rgba(0,0,0,0.18)`) with `mix-blend-mode: multiply` and `pointer-events: none`. Both filter and scanlines fade out on hover (filter → none, scanlines → opacity 0) over 0.4s. Rationale: the scanlines reinforce the terminal-mono identity, the new filter actually reads as lime. Reduced-motion disables the transition (instant state swap). Updated in §6.23.

5. **Page-head subtitles are noise on About / Career / Projects / Articles.** **Decision:** Remove `.page-head__sub` from About, Career, Projects, and Articles. The H1 alone fills the page-head band. The `.page-head__sub` CSS class is kept in §7.2 for future use but is unused in this revision. The page-head loses the `gap` between H1 and subhead — `flex-direction: column; gap: 0` simplifies to `display: block`. Rationale: the JSX-tag H1 (`<ABOUT />`) is already declarative; adding a tagline below it is decorative redundancy. Updated in §7.2 (`.page-head`), §9.2–§9.5 (every page-head section), §15 (caption + title text table).

6 + 8. **Tech chip casing should be canonical brand case, not lowercase.** **Decision:** Switch `.tag--chip` to canonical case: `TypeScript`, `Vue.js`, `Nuxt`, `React`, `Node.js`, `Tailwind CSS`, `JavaScript`, `Pinia`, `Vuex`, `Vuetify`, `NativeScript`, `Konva`, `Vuesax`, `Sass`, `Drupal`, `Linux`, `Windows Server`, `TanStack`, `AI SDK`, `Storybook`, `SEO`, `Vitest`, `Jest`, `Lerna`, `Express`, `Sequelize`, `Pug.js`, `WebSocket`, `Adobe XD`, `Shell Script`, `Laravel`, `Next.js`. The `text-transform: lowercase` declaration on `.tag--chip` is **removed**. Each chip's text is the literal canonical name from the data source. Rationale: tech names are brand names; lowercasing them reads as a stylistic violation, not an aesthetic. Tech-filter chips (`.tech-filter__chip`) keep their `text-transform: lowercase` because they're filter labels, not tech-name renders — the `all`, `typescript`, `vue`, `nuxt` set is internal taxonomy, not branding. Updated in §6.5 (`.tag--chip`), §6.18 (tech-filter chips — explicit retention of lowercase), §8 (identity §14 amended), §13 (build checklist).

7. **Career has only one section; the `// work history` eyebrow + `Career` h2 duplicate the page title.** **Decision:** Remove the entire `.sec-head` block from Career — both the `// work history` eyebrow and the `Career` h2 are deleted. The `<section class="band">` retains its band padding and bottom rule, but its content is now just the `.career-list`. Same logic applies to Articles: remove the `// on the record` eyebrow + the `Articles` h2. The `<section class="band">` on Articles holds only the `.list`. Rationale: when a page has exactly one section, the section header is wireframe annotation. The page-head H1 is the section header. Updated in §6.10 (`.sec-head` notes "single-section pages OMIT this entirely"), §9.3 (Career), §9.5 (Articles), §15 (eyebrow column for Career and Articles becomes "(none)").

9. **Career role refs from the data source must be restored.** **Decision:** Two roles in the data carry external links — Nuxstep (links to `NativeScript Spotify` GitHub) and Grupo Gmaes (links to `CONFEA` site). These were dropped during the audit pass. Restore them as a `.role__refs` inline list at the bottom of `.role__content`, after `.role__chips`, with the format `// refs: <link>NativeScript Spotify ↗</link>`. The `// refs:` prefix is `--lo` italic mono `--t-meta`; each link uses the canonical `.link-arrow` (see §6.7). Multiple refs are separated by `·` in `--lo`. Atlas roles, MPA, and the Gmaes intern role share-data-only links (not stored on the role itself) — only the two roles whose data carries `links` get the `.role__refs` block. New CSS spec for `.role__refs` is added to §6.20. Updated in §6.20, §9.3.

10. **Project / role / article external links must all use the canonical `.link-arrow` component.** **Decision:** `.link-arrow` (see §6.7) is the **only** "go to external link" affordance across the site. Apply it uniformly to:
   - Featured project lead-card link (already correct: `.link-arrow.pr__visit`).
   - Featured project secondary cards (Calcloak, Injektion) — currently rendered as a plain `.pr__links` row with `site` / `github` text. Replace with a single `.link-arrow.pr__visit` per featured card pointing to its primary URL (Calcloak → `https://calcloak.com/`, Injektion → `https://github.com/andresilva-cc/injektion`). The rationale for showing only ONE link per featured card is that featured cards are about the project, not its repo; secondary URLs (e.g., GitHub when a website exists) are dropped from the featured strip. The All Projects grid keeps its multi-link `.pr__links` cluster because grid cards are denser and need both site/github when both exist.
   - All Projects grid cards — keep the `.pr__links` cluster but **restyle each `<a>` inside `.pr__links` as a `.link-arrow`**, not as a plain `--mid` text link. Each link reads `<span>site ↗</span>` / `<span>github ↗</span>` with the trailing arrow svg. Separators (`pr__sep`) become unnecessary and are **removed**. Multiple links sit on a row with `gap: var(--s4)` between them.
   - Career role refs (see decision 9) — `.link-arrow` per ref.
   - Article trailing CTA (`.art__lnk`) — already `.link-arrow`. No change.
   - Footer links — **keep as plain `--mid` lowercase text** (footer is a separate convention; it doesn't promise navigation to external pages, just utility links). Footer is OUT of scope for this unification.
   The arrow icon convention: the existing `.link-arrow` SVG is a right-pointing arrow (`→` style). For external destinations (everything that's not in-site), keep using the same right-arrow svg — adding a separate `↗` (up-right) variant fragments the component. The destination type is communicated by the URL alone. Updated in §6.7 (canonical role expanded), §6.16 (`.featured-strip` lead+secondary card markup), §6.17 (`.pr__links` rewritten to use `.link-arrow`), §9.3 (role refs use link-arrow), §9.4 (Featured + All Projects link styling).

11. **Articles illustration / content height mismatch leaves dead space below the image.** **Decision:** The `.art` row uses `align-items: stretch` instead of `align-items: flex-start`, AND `.art__illo` height changes from a fixed `144px` to `100%` so the illustration container expands to match the body content's height. The SVG inside scales via `width: 100%; height: 100%; object-fit: contain` — the SVG keeps its 200×120 viewBox but renders centered with letterboxed empty space if the body is taller than the natural aspect ratio. The `.art__illo` background remains `--surface-2` so the letterboxing reads as a clean empty frame, not a stretched image. On mobile (`≤ 760px`) the row collapses to one column and `.art__illo` reverts to `aspect-ratio: 240/144` since the body sits below it (no height to match against). Rationale: the body is naturally taller than 144px (date, title, description, tags, CTA). Stretching the illustration container is the cleanest fix; centering the SVG inside means we don't distort the artwork. Updated in §6.19 (`.art` + `.art__illo`).

### Decision-to-section map

| # | Decision | Sections updated |
|---|---|---|
| 1 | Drop hero `Read more →` button | §0.2 (A1), §6.9, §7.5, §9.1, §15 (build checklist) |
| 2 | Latest = 1 per kind (3 rows) | §0.2 (A3), §9.1 |
| 3 | About photo moves to left column | §6.23, §9.2 |
| 4 | New photo filter + scanlines effect | §6.23, §16 (`:root` token) |
| 5 | Drop page-head subhead on inner pages | §7.2, §9.2, §9.3, §9.4, §9.5, §15 |
| 6 + 8 | Canonical case for tech chips | §6.5, §8 (rule 14 amended), §15 (build checklist) |
| 7 | Drop section header on Career and Articles | §6.10, §9.3, §9.5, §15 |
| 9 | Restore Nuxstep + Gmaes refs | §6.20 (new `.role__refs`), §9.3 |
| 10 | Unify external links to `.link-arrow` | §6.7, §6.16, §6.17, §9.3, §9.4 |
| 11 | Article illustration self-balances height | §6.19 |

The remainder of the spec from direction 06 carries through unchanged, except where the sections above explicitly override it.

---

## Re-revision (post critical-audit correction, from 06)

The previous critical audit removed two key brand signatures. These are restored:

1. **Mono everywhere.** The site is mono-typed. No sans companion. Inter is removed from the Google Fonts import. `.about-prose` and all other prose render in JetBrains Mono (`--ff-mono`).
2. **Hero ASCII plasma animation.** The Home hero's right column renders the Variant 01 ASCII plasma (verbatim from `05-prose-mono-refined-home.html`). The SIGNAL kv-list (location/timezone/now/status) is removed entirely.

All other revision-pass decisions remain in force (CTA pair, no `[FEATURED]` badges, asymmetric Featured Projects layout, tech-filter chip row, no `>` heading-arrow, collapsed type scale, no numbered eyebrows on single-section pages, photo at 240×320, combined "Get in touch" band, "formerly Healthy Labs" italic, `+` bullets, removed `[CURRENT]` badge, etc.).

---

## 0. Revision history

This revision is **not** a token-rename pass. The previous spec was internally consistent but the rendered result feels wireframe-y, decoratively over-tagged, hierarchically flat, and missing real UX affordances (no primary CTA on home, no contact path, no project filter, undifferentiated featured cards, kind tags as noise, single-section pages with `// 01 /` eyebrows that have no sibling). This revision goes after those issues directly and changes the visual language where the current language is underperforming.

### 0.1 What's wrong with the current state

Each item names the artifact, the problem, and the severity (low / medium / high / critical).

1. **No primary CTA on Home.** The hero pitches André in three sentences and then drops the user into a `Full bio →` text link. There is no email button, no "Hire me", no resume download — nothing the user is supposed to do. For a portfolio's front door this is a critical gap. **Severity: critical.**

2. **Featured projects don't feel featured.** The featured grid uses the same 3-column frame and the same card padding as the All Projects grid directly below it. Featured cards differ only in (a) accent-colored title and (b) a `[FEATURED]` badge. The grid frame, card size, and visual weight are identical to the 15-card grid below. The eye reads the page as one 18-card grid with three highlighted cards on top, not as "Featured" + "All". **Severity: high.**

3. **Single-section pages have numbered eyebrows.** Career has one section and one eyebrow, `// 01 / WORK HISTORY`. Articles has one section and one eyebrow, `// 01 / ON THE RECORD`. A numbered eyebrow with no sibling number is decoration pretending to be navigation. The eyebrow earns its rent only on Home and About where multiple numbered sections exist. **Severity: high.**

4. **Eyebrow + `>` arrow + h2 is three typographic objects in a row.** Every section has a tiny accent-uppercase label, a `>` glyph, and an h2. That's three things to read where two would do. The eyebrow + h2 pattern is fine; the `>` glyph adds nothing once the eyebrow already announces "this is a section." **Severity: medium.**

5. **Kind tags `[CAREER]`, `[PROJECT]`, `[ARTICLE]` on Home rows are wireframe annotation.** A 96px-wide gutter labels each row by its category. The category is already obvious from the row content (a job title vs a project name vs an article title) and the trailing link-arrow ("All 6 roles →" makes the category explicit). The tag column is repeating itself. **Severity: medium.**

6. **Home "Latest" surfaces only 1 item per category.** Three rows total — one career, one project, one article. For a section called "Latest" with "All N →" links per row, this is anemic. Either show 3-4 of the most recent across all categories, or pick one category and show 3-4 of that. **Severity: medium.**

7. **No primary contact path.** Email lives in the footer as a lowercase `--mid` link buried among github / linkedin / dev.to. There is no other way to contact André. A portfolio site without a visible "get in touch" CTA loses leads. **Severity: high.**

8. **No project filter / sort / search.** 15+ project cards in a 3-column grid with no way to filter by tech, sort by year, or search by name. For a portfolio that grows, this scales poorly. **Severity: medium.**

9. **`<strong class="acc">` reuse dilutes the accent.** Hero pitches `9+ years of experience` in accent. Bio prose pitches `9+ years of experience` in accent on the very next page. Career pitches `74% increase` in accent. By page two the accent emphasis stops emphasizing — the reader trains to ignore it. Reserve accent emphasis for **one** phrase per page, max. **Severity: medium.**

10. **`--vlo` (#4A5A45) at 2.4:1 is decorative-only but used in places that read as text.** Project link separators (`·` between `site` and `github`) use `--vlo` and disappear against the surface. Either bump to `--lo` (4.6:1) or drop the separator entirely and use spacing. **Severity: medium.**

11. **Featured & badge double-signal.** A featured project has accent-colored title AND a `[FEATURED]` badge. Same signal twice. Cut the badge; let the accent title carry the signal. **Severity: low.**

12. **`[DEGREE]` / `[SPECIALIZATION]` badges on Education compete with eyebrow.** The eyebrow `// 02 / WHERE I STUDIED` is accent + uppercase. The badges `[DEGREE]` / `[SPECIALIZATION]` are accent + uppercase. Two accent uppercase labels stacked tight. The badges describe what the title already says ("BS in Computer Science" — yes, it's a degree). Drop the badges or color them `--lo`. **Severity: medium.**

13. **Page-head `<NAME />` framing earns very little.** The page-head is one h1 inside a band with a bottom rule. No subhead, no metadata, no "what this page is" line. About / Career / Projects / Articles all wear the same shape: angle braces + name + slash, then a single rule, then content. The bracket framing is part of the identity, but the page-head section as a whole is dead weight. **Severity: medium.**

14. **Hero animation feels inert.** The ASCII plasma renders at 8px on a 400×230 panel and the animation IS running, but the motion is so dense and small that it visually looks static. There's no in-load wipe, no fade, no announcement. **Severity: medium.** (Fix: subtle 240ms fade-in + a tiny scanline traversal on first paint, OR replace with a different mark — see 0.2.)

15. **Hero CTA stack is missing.** Below the role line and pitch on Home, there is nothing — no buttons, no actions. Even a "Read about me →" + "Email me →" pair would create the missing primary action. **Severity: high.**

16. **Photo on About is too small for its column.** 200×200 against a 1240px shell where the prose column takes the rest is 16% of width. The photo reads as a thumbnail next to a wall of text. On a personal-portfolio bio it should be more grounded. **Severity: low.**

17. **Articles 100px middle column is dead space.** The article entry grid is `200 100 1fr` where the 100px column holds only the date. 100px of white space for an 8-character date feels wasteful. **Severity: medium.**

18. **`min-height:144px` on project cards leaves dead bottom space.** Cards with one description line and 1-2 chips end short of 144px and get bottom padding implicitly. Visual rhythm in a 3×6 grid suffers. **Severity: low.**

19. **Resume Download as its own band on About.** Section 04 of About is just a button and a comment. Whole `band` for one button. Either pair Resume + Email side-by-side as "Get in touch" or absorb Resume into a header/footer of the bio. **Severity: low.**

20. **Caption strip is wireframe noise.** `// PROSE-MONO.POLISHED.V2  /  REDESIGN OPTION 07/07  /  HOME` reads like a comment in someone else's repo. Useful for review HTML files; useless for production. Either drop it on production or simplify to a tiny `cwd /home` style breadcrumb. **Severity: low.** (For these review HTML files we keep it; we document the production-strip variant.)

21. **`andresilva.cc` wordmark at 13.5px** sits between body 15 and meta 12. Decimal point is ungainly. **Severity: low.**

22. **`--t-h3` at 15.5 is 0.5px bigger than body 15.** Imperceptible. Item titles (Job, Project, Article) should dominate over body via size + weight + color, but at 15.5/600/hi vs 15/400/mid the only real differentiation is weight + color. Bump h3 to 16 (a real diff), tighten body to 14, and the hierarchy snaps. **Severity: medium.**

23. **All text in JetBrains Mono.** Mono prose at 15/1.6 is dense; long paragraphs feel like terminal output, not biography. Either introduce a sans (e.g., Inter or IBM Plex Sans) for prose only, OR drop body weight to 400 at 13.5–14px. **Severity: medium.** (Decision below: keep mono identity by default but reduce body to 13.5px / 1.65 line-height; introduce **no sans** so the identity stays.)

24. **`.wm-mark` border in `--accent-mute` (#3D4F18) is barely visible against `--bg`.** The frame around the pixel-A is supposed to read as a tiny chip; instead it reads as no chip. Either remove the frame or use `--rule` (#1F2A1F → wait, that's even darker — use `--lo` or the accent itself for the frame). **Severity: low.**

25. **Active nav `[home]` triple-tagging.** Brackets in markup + accent color + 600 weight + `aria-current="page"`. Three visual signals + the screen reader signal for one state. Pick two. **Severity: low.**

26. **Type scale has 4 tokens within 1.5px (10, 10.5, 11, 11.5).** That's pixel-level micro-typography that no one will perceive. Collapse `--t-tag`, `--t-eyebrow`, `--t-micro`, `--t-badge` into 2 tokens: `--t-micro` (11) and `--t-nano` (10). **Severity: low.**

27. **Footer separator drift.** Body row separators use `--rule`. Footer link separators use `--lo`. Inconsistent. **Severity: low.**

28. **Hover state on `.row` is a background change, but the row is not clickable.** The `<article>` wrapper isn't an anchor; only the trailing `link-arrow` is. The hover affordance lies. Either make the row a real link (linked-card pattern) or drop the hover background. **Severity: medium.**

29. **`> Bio` heading-arrow followed by an h2 with letter-spacing -0.005em.** The arrow is mono semibold accent at 18px h2 size; the h2 itself is mono semibold hi at 18px. The arrow visually competes with the h2 — same weight, same size, accent color makes it pop more than the actual heading. The h2 ends up looking like a subhead of the arrow. **Severity: medium.**

30. **Status-dot / live-indicator: spec defines a `.status-dot--live` with a soft 18% lime ring as "the only mild glow."** Currently nothing on any page actually USES the live dot. Dead component. **Severity: low.** (Either use it on the MPA role to indicate "current" or remove from the catalogue.)

### 0.2 What's changing in this revision

Each decision is the consequence of one or more findings above.

- **A1 — Add a Hero CTA on Home.** Below the pitch: `hello@andresilva.cc →` (`.button-text`) as the single hero CTA. **v2 revision: the `Read more →` `.button-cta` was removed because it duplicated the Bio section's contextual `Full bio →` link-arrow that sits directly below the hero.** Resolves findings 1, 7, 15.

- ~~**A2 — Replace ASCII plasma in hero with a minimal mark column.**~~ **REVERSED in re-revision.** The ASCII plasma is part of the site's identity and stays in the hero's right column. The SIGNAL kv-list is removed. See §9.1 and §6.27 for the restored plasma component. (Original audit text: "The plasma was decorative without anchoring identity. Replace with a typographic mark…" — superseded.)

- **A3 — Surface "Latest" as 3 items: 1 career + 1 project + 1 article (one per kind).** Date-stamped, with the kind label inline in the body (not as a left gutter tag). **v2 revision: the prior 4-item "recency mix" is replaced with a strict one-per-kind selection — the 1-per-kind shape is more legible than a 4-row date sort.** Resolves findings 5, 6, 28.

- **A4 — Page-head adds a subhead line.** ~~`<ABOUT />` gets a `// who I am, where I work, what I work on` subhead under the title. `<CAREER />` gets `// 6 roles · 9+ years · 2017 → present`. `<PROJECTS />` gets `// 18 projects · sortable by year, stack, role`. `<ARTICLES />` gets `// 2 articles · dev.to`.~~ **REVERSED in v2 revision.** The H1 alone fills the page-head band on About / Career / Projects / Articles; subheads are removed as decorative noise. Finding 13's "page-head wears the same shape and earns very little" is accepted; the subhead does not actually change that.

- **A5 — Drop the `// 0X /` numbering on single-section pages.** ~~Career, Articles get an unnumbered eyebrow `// WORK HISTORY` / `// ON THE RECORD`.~~ **v2 revision: Career and Articles drop `.sec-head` ENTIRELY** — both the eyebrow AND the section h2 are removed (they duplicate the page-head H1). Numbered eyebrows live on Home, About, and Projects (multi-section pages). Resolves finding 3.

- **A6 — Cut the `>` heading-arrow on every page.** The eyebrow + h2 is enough. Saves a typographic object across every section. Resolves findings 4, 29.

- **A7 — Replace Home `.row` kind-tag column with date-stamp column.** The 96px gutter holds the date (`apr 2025`, `feb 2025`) instead of `[CAREER]` / `[ARTICLE]`. Categories become inline labels in `--lo` italic in the row body (e.g., `// career — Senior Engineer @ MPA`). Rows become real anchor wrappers; the entire row is the click target. Resolves findings 5, 28.

- **A8 — Featured projects get a different layout than All projects.** Featured = single-row 3-column `2/3 1/3 1/3` asymmetric layout where the first card spans wider, includes a description excerpt at full body size, and an inline `→ visit` link. All projects = compact 3-column 4-row dense grid. Visual difference is unmistakable. Drop the `[FEATURED]` badge — the layout IS the signal. Resolves findings 2, 11.

- **A9 — Add a tech-filter chip row above the All Projects grid.** Inline horizontal scrollable row of stack chips (TypeScript, Vue.js, Node.js, etc.) with counts. Click filters the grid client-side. Resolves finding 8.

- **A10 — Drop `[DEGREE]` / `[SPECIALIZATION]` badges on Education.** The title carries the meaning. Reclaim badge real estate for a 1-line key fact (year range, institution). Resolves finding 12.

- **A11 — Reserve `<strong class="acc">` for one phrase per page.** Home: `9+ years of experience`. About: drop the acc-strong on the same phrase, use plain hi-strong; reserve acc for `Florianópolis, Brazil`. Career: `74% increase` and `20 million monthly visits` — pick one per role; max one per visible viewport. Resolves finding 9.

- **A12 — Bump `--vlo` removal: it's not used anywhere essential.** Project link separators upgrade to `--lo` italic `·`. The "no public link" placeholder (`.pr__none`) becomes `--lo` italic. `--vlo` token is removed entirely. Resolves finding 10.

- **A13 — Type scale collapses.** Eleven type tokens → seven:
  - `--t-display: 56px` (hero name)
  - `--t-h1: 28px` (page titles, bumped from 26 for poster weight)
  - `--t-h2: 18px` (section heads)
  - `--t-h3: 16px` (item titles, bumped from 15.5 for real diff vs body)
  - `--t-body: 14px` (body, dropped from 15 to relax mono prose)
  - `--t-meta: 12px` (dates, link-arrow text, article meta, nav, wordmark)
  - `--t-micro: 11px` (eyebrows, kind tags, badges, caption)
  Body line-height 1.65 instead of 1.6. Resolves findings 22, 23, 26.

- ~~**A14 — Add `--font-prose: 'Inter'` only for the bio paragraph on About.**~~ **REVERSED in re-revision.** Mono-everywhere is a key brand signature. Inter is removed entirely; `.about-prose` renders in JetBrains Mono (`--ff-mono`) at the same `--t-body` 14/1.65 as the rest of the site. The `--ff-prose` token is removed. The Google Fonts import drops the Inter family.

- **A15 — Article meta cleanup.** `4 min · 11 hearts · 01 comment` only. The `dev.to` source label moves to the trailing `link-arrow`. Use single-character icons (no labels) for hearts (♥) and comments (◷ or just numbers). Use a calendar-pin SVG for the date if including it; otherwise the date sits in its own row. Resolves finding 17.

- **A16 — Articles row collapses to 2-column `240px 1fr` with the date in the body, not a separate gutter.** Reclaims the dead middle column. Resolves finding 17.

- **A17 — Project cards use `auto-rows: 1fr` instead of `min-height: 144px`.** Cards size to their tallest sibling per row, no dead bottom. Resolves finding 18.

- **A18 — About Bio photo.** ~~Upsizes to 240×320 (3:4 aspect) and inverts to right column on desktop, prose on left.~~ **v2 revision: photo sits at 200×260 in the LEFT column** (matching `05-prose-mono-refined-about.html`'s pattern). The filter is retuned to actual lime (`hue-rotate(60deg) saturate(3.2)`) and a CRT scanline overlay is added via `::after` on a `.photo-wrap` div. Hover clears both filter and scanlines. Resolves finding 16. See §6.23 for full markup and CSS.

- **A19 — About combines Resume + Contact into a single "Get in touch" band.** Two outline buttons side by side: `Download CV →` and `hello@andresilva.cc →`. Resolves finding 19.

- **A20 — `andresilva.cc` wordmark snaps to `--t-meta` (12px).** Resolves finding 21.

- **A21 — `.wm-mark` frame in `--rule` color.** Was `--accent-mute` and invisible. `--rule` is darker but at least defined as a hairline. Or: drop the frame entirely and let the SVG sit naked. Decision: drop the frame. The pixel-A logo stands on its own. Resolves finding 24.

- **A22 — Active nav: brackets + accent color, NO bold weight.** Brackets carry the visual signal at the same weight as siblings; accent color disambiguates. Bold weight removed. Resolves finding 25.

- **A23 — Caption strip drops to one line, no decorative text.** Production version: `~/andresilva.cc — home` (path-style breadcrumb). Review version (these HTML files): kept verbose for traceability. Resolves finding 20.

- **A24 — Footer separator standardised to `--lo` middle-dot, matching footer text color hierarchy. Body row separators stay `--rule`.** They serve different roles — body separators delimit data, footer separators delimit links. Different colors are intentional now and documented. Resolves finding 27.

- **A25 — Add a `live-dot` next to the role line on Home and the current role on Career.** `.status-dot--live` finally earns its keep — visual marker for "currently here." Resolves finding 30.

- **A26 — `<NAME />` framing keeps the angle braces but loses the slash on the right.** `<ABOUT/>` was wireframe-y; `<ABOUT>` reads as a marker the eye pauses on. Decision: keep `<ABOUT />` as the spec calls — it's part of the JSX-tag-as-page-title identity that direction 06 has earned across 5 versions. Don't touch.

- **A27 — Hero ASCII plasma animation retained verbatim.** With A2 reversed in the re-revision, the Variant 01 ASCII plasma from `05-prose-mono-refined-home.html` is copied unchanged: 64×26 grid at 8px line-height, accent-tinted high-luminance characters on `--mid` mids, ~20fps loop (`PL_t += 0.075` every 50ms). No fade-in or boot wipe is added. Reduced-motion renders one static frame at `t=0`. See §6.27 and §10.

The full set of changes is accommodated below; the remaining sections are the executable spec for the rewrite.

---

## 1. Summary

A polished, production-grade refresh of direction 05 ("Prose & Mono · Refined"). Same lime-on-near-black palette. Same general layout topology (caption strip → header → page sections → footer). Same content. **Component vocabulary tightened**: chips, badges (rare), pointer rows, framed grids, comment-tag eyebrows (numbered only when ≥2 sections per page), `<NAME />` page titles. **What's new vs the prior 06 spec**: real CTAs on Home and About; projects gain a tech filter and a differentiated featured layout; type scale collapses to seven tokens; Home rows are linked cards with date-stamp gutters; section heads drop the `>` arrow; numbered eyebrows live only on multi-section pages. **Carried over verbatim from 05**: the hero ASCII plasma animation in the home hero's right column, and mono-everywhere typography (no sans companion).

Confidence: high. The changes are decisive and reduce the surface area while strengthening hierarchy and adding the missing UX affordances.

---

## 2. Color palette

All tokens are defined in a single `:root` block at the top of every page. `data-theme` attributes are not used.

### 2.1 Token table

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#0B0F0A` | Page background |
| `--surface-2` | `#0F1410` | Hover surface (rows, cards) |
| `--rule` | `#1F2A1F` | Hairline borders (canonical) |
| `--rule-2` | `#2C3A2C` | Decorative ticks (SVG only) |
| `--hi` | `#D7E5D0` | Primary text (titles, body strong, headings) |
| `--mid` | `#9DAA95` | Body copy |
| `--lo` | `#6F7E68` | Tertiary text (captions, dates, eyebrows on caption strip, footer copy, separators) |
| `--accent` | `#C8FF3D` | Primary accent (links, active nav, eyebrows, name title, badges, single-phrase emphasis) |
| `--accent-hi` | `#DEFF6B` | Link hover |
| `--accent-mute` | `#3D4F18` | Outlined-tag border |
| `--accent-tint` | `rgba(200,255,61,0.08)` | Chip hover background |
| `--black` | `#000000` | Caption strip background |

**Removed in this revision**: `--vlo` (decorative, unused after `pr__sep` upgrade).

**Renamed**: none.

### 2.2 Contrast ratios (computed)

| Foreground | Background | Ratio | Verdict |
|---|---|---|---|
| `--hi` on `--bg` | 15.4 : 1 | AAA |
| `--mid` on `--bg` | 8.2 : 1 | AAA |
| `--lo` on `--bg` | 4.6 : 1 | AA (body) |
| `--accent` on `--bg` | 15.7 : 1 | AAA |
| `--lo` on `--surface-2` | 4.3 : 1 | AA large only |
| `--accent-mute` on `--bg` | 1.8 : 1 | Decorative borders only |

`--lo` on `--surface-2` is restricted to ≥`--t-meta` (12px) and only for non-essential metadata.

### 2.3 Accent budget rule

Accent (`--accent`) is allowed on:

1. The page name (h1 hero / page-head titles) — once per page.
2. Section eyebrows — multiple times, but tightly scoped (uppercase 11px on a near-black surface, never a text body).
3. Active nav item label — once per header.
4. Links and link-arrows — multiple times; this is the call-to-action role.
5. Tag (chip / badge) borders + text — multiple, but tags are small and don't dominate.
6. **Exactly one** `<strong class="acc">` per visible viewport — the "highlight phrase" of that screen.

If a viewport contains more than one `<strong class="acc">`, choose the most important one and demote the rest to plain `<strong>` (color `--hi`).

---

## 3. Typography

### 3.1 Font import

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=VT323&display=swap" rel="stylesheet">
```

Two families only: **JetBrains Mono** (everything — UI, headings, body, prose) and **VT323** (display: hero name, page titles). No sans is admitted anywhere. Mono-everywhere is a brand signature.

### 3.2 Font CSS variables

```css
--ff-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
--ff-display: 'VT323', 'JetBrains Mono', ui-monospace, monospace;
```

`--ff-prose` was introduced in the previous critical-audit pass and **removed in re-revision**. All prose (including `.about-prose`) uses `--ff-mono`.

### 3.3 Type scale (collapsed to seven tokens)

| Token | px | Weight | Line-height | Letter-spacing | Family | Use |
|---|---|---|---|---|---|---|
| `--t-display` | 56 | 400 | 1.10 | -0.01em | display (VT323) | Hero name (`h1.name`) |
| `--t-h1` | 28 | 400 | 1.10 | -0.01em | display | Page titles `<NAME />` |
| `--t-h2` | 18 | 600 | 1.30 | -0.005em | mono | Section heads |
| `--t-h3` | 16 | 600 | 1.35 | -0.005em | mono | Item titles (job, project, article, education) |
| `--t-body` | 14 | 400 | 1.65 | 0 | mono | Body copy |
| `--t-meta` | 12 | 500 | 1.55 | 0.02em | mono | Dates, link-arrow text, nav, wordmark, article meta |
| `--t-micro` | 11 | 600 | 1.50 | 0.14em | mono | Eyebrows, badges, kind tags, caption strip |

**Notes**
- `--t-display` rendered with `-webkit-font-smoothing: none; image-rendering: pixelated;` for the bitmap feel. Same for `--t-h1` when paired with `.t-pixel`.
- Tabular numerics globally on body: `font-variant-numeric: tabular-nums;`.
- Ligatures off: `font-feature-settings: "liga" 0, "calt" 0, "tnum" 1;`.
- No sans family anywhere. `.about-prose` and all other prose render in `--ff-mono`.

### 3.4 `<strong>` rules

- Default `<strong>` = `color: var(--hi); font-weight: 600`. Used in body prose for term emphasis.
- `<strong class="acc">` = `color: var(--accent); font-weight: 600`. Reserved for the page's single "highlight phrase" (see §2.3).
- Never `<b>`. Always `<strong>` (semantic).

### 3.5 Max line-length

- Default prose: `--prose-w: 68ch`.
- Hero pitch: `--prose-w-narrow: 56ch`.
- Project card description: `--prose-w-card: 38ch`.

### 3.6 Selection

```css
::selection { background: var(--accent); color: var(--bg); }
```

---

## 4. Spacing scale

```css
--s1: 4px;
--s2: 8px;
--s3: 12px;
--s4: 16px;
--s5: 20px;
--s6: 24px;
--s8: 32px;
--s10: 40px;
--s12: 48px;
--s16: 64px;
--s20: 80px;   /* hero top on desktop */
```

**Per-element use map**

| Use | Token |
|---|---|
| Tag inner pad-y | `2px` (named `--tag-pad-y`; +1px from prior 1px for legibility at smaller body) |
| Tag inner pad-x | `--s2` |
| Inline gap (icon-to-text) | `--s2` |
| Section eyebrow → h2 | `--s2` |
| Section-head bottom margin | `--s5` |
| Section band vertical padding | `--s8` (top + bottom) |
| Section-to-section gap | provided by band's bottom border + next band's top padding |
| Hero top padding | `--s16` desktop / `--s8` mobile |
| Page-head padding | `--s12 0 --s5` |
| Footer padding | `--s5 0 --s8` |
| Footer top margin | `--s12` |
| Caption strip padding | `--s2 --s8` (mobile: `--s2 --s4`) |
| Header padding | `--s4 0` |
| Card inner padding | `--s4` |
| Career role padding | `--s5` (left gutter) / `--s5 --s6` (right column) |
| Hero CTA gap (between buttons) | `--s3` |

**Vertical rhythm.** Bands are uniformly `--s8` top + `--s8` bottom. The change from 05's `--s5` (40px total internal) to `--s8` (64px total internal) gives the polished version a more confident vertical breathing room. Page-head is `--s12` top + `--s5` bottom. Footer top has `--s12` air.

---

## 5. Borders, radius, corners

- **Radius**: `border-radius: 0` everywhere. Square corners are part of the identity.
- **Border width**: `1px` (canonical). SVG illustration strokes are `1.2px` decorative weight.
- **Border color**: `--rule` (hairlines), `--rule-2` (SVG ticks only), `--accent-mute` (outlined tags / CTA buttons), `--accent` (hover state).
- **Focus ring**: `outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 0;`. Never on `:focus` only — always `:focus-visible`.

---

## 6. Component catalogue

Every component documented with HTML, CSS, hover/focus, ARIA, edge cases. Removed components from the prior 06 spec are noted.

### 6.1 `.shell`

```css
.shell { max-width: 1240px; margin: 0 auto; padding: 0 var(--s8); }
@media (max-width: 760px) { .shell { padding: 0 var(--s4); } }
```

### 6.2 `.caption` — top strip

**HTML** (review files): `<div class="caption">// PROSE-MONO.POLISHED.V2  /  REDESIGN OPTION 07/07  /  HOME</div>`

**HTML** (production guidance, not used in these review files): `<div class="caption">~/andresilva.cc — home</div>`

**CSS**
```css
.caption {
  padding: var(--s2) var(--s8);
  background: var(--black);
  color: var(--lo);
  font: 600 var(--t-micro)/1.5 var(--ff-mono);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--rule);
}
@media (max-width: 760px) { .caption { padding: var(--s2) var(--s4); } }
```

### 6.3 `.bar` — header band

**HTML**
```html
<header class="bar">
  <a class="wm" href="07-prose-mono-polished-v2-home.html">
    <svg class="wm-mark-svg" viewBox="0 0 18 24">…</svg>
    <span>andresilva.cc</span>
  </a>
  <nav class="primary" aria-label="Primary"> … </nav>
</header>
```

**CSS**
```css
header.bar {
  display: flex; justify-content: space-between; align-items: center;
  padding: var(--s4) 0;
  border-bottom: 1px solid var(--rule);
}

.wm {
  display: inline-flex; align-items: center; gap: var(--s2);
  font: 500 var(--t-meta)/1.55 var(--ff-mono);   /* 12px, was 13.5 */
  color: var(--hi);
  text-decoration: none;
  min-height: 32px;
}
.wm:hover { color: var(--hi); }
.wm:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.wm-mark-svg { width: 18px; height: 24px; color: var(--accent); display: block; }
/* No frame around the wm-mark — removed in this revision. */
```

### 6.4 `nav.primary`

```html
<nav class="primary" aria-label="Primary">
  <a href="07-prose-mono-polished-v2-home.html">[home]</a>
  <a href="07-prose-mono-polished-v2-about.html">about</a>
  <a href="07-prose-mono-polished-v2-career.html">career</a>
  <a href="07-prose-mono-polished-v2-projects.html">projects</a>
  <a href="07-prose-mono-polished-v2-articles.html">articles</a>
</nav>
```

```css
nav.primary { display: flex; gap: 0; }
nav.primary a {
  font: 500 var(--t-meta)/1.55 var(--ff-mono);
  color: var(--mid);
  padding: var(--s2) var(--s3);
  letter-spacing: 0.01em;
  min-height: 32px;
  display: inline-flex; align-items: center;
  text-decoration: none;
  transition: color var(--d-fast) var(--ease-out);
}
nav.primary a:hover { color: var(--hi); }
nav.primary a[aria-current="page"] {
  color: var(--accent);
  font-weight: 500;        /* was 600; brackets carry the signal */
}
@media (max-width: 760px) { nav.primary a { padding: var(--s2); } }
```

**Brackets convention.** The active item wraps its label in `[brackets]`. Brackets are content. `aria-current="page"` is set. Bold removed; brackets + accent are sufficient.

### 6.5 `.tag` — base for chip / badge

Three classes share an outlined hairline silhouette. The `kind-tag` from prior 06 is **removed** (Home rows no longer use it). Only `.tag--chip` and `.tag--badge` remain.

```css
.tag {
  display: inline-flex; align-items: center;
  font-family: var(--ff-mono);
  color: var(--accent);
  background: transparent;
  border: 1px solid var(--accent-mute);
  border-radius: 0;
  padding: var(--tag-pad-y) var(--s2);
  line-height: 1.5;
  transition: border-color var(--d-fast) var(--ease-out), background-color var(--d-fast) var(--ease-out);
}
.tag:hover { border-color: var(--accent); background: var(--accent-tint); }

.tag--chip {
  font-size: var(--t-micro);          /* 11px */
  font-weight: 500;
  letter-spacing: 0.01em;
  min-height: 18px;
  /* No text-transform. Tech names render in canonical brand case (TypeScript, Vue.js, Node.js, Tailwind CSS). */
}
.tag--badge {
  font-size: var(--t-micro);
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  min-height: 20px;
}
.tag--badge:hover { border-color: var(--accent-mute); background: transparent; }
```

**Decision: canonical brand case for chips (v2 revision).** Tech chips render in their canonical brand case: `TypeScript`, `Vue.js`, `Node.js`, `Tailwind CSS`, `Next.js`, `JavaScript`, `Pinia`, `Vuex`, `Vuetify`, `NativeScript`, `Konva`, `Vuesax`, `Sass`, `Drupal`, `Linux`, `Windows Server`, `TanStack`, `AI SDK`, `Storybook`, `SEO`, `Vitest`, `Jest`, `Lerna`, `Express`, `Sequelize`, `Pug.js`, `WebSocket`, `Adobe XD`, `Shell Script`, `Laravel`, `Nuxt`, `React`. Brand correctness over IDE-tag aesthetic. Each chip's text matches the literal string in `static-jobs-repository.tsx` / `static-projects-repository.ts`. The `.tech-filter__chip` (filter buttons) keeps its lowercase rendering — those are filter labels, not brand names.

**Where `.tag--badge` is used after this revision**
- ONLY for genuinely-ambiguous category labels. The cleanup removed `[FEATURED]`, `[DEGREE]`, `[SPECIALIZATION]`, and `[CAREER]/[PROJECT]/[ARTICLE]`. Badges currently appear on **zero** elements in this revision. The class is kept in the catalogue for future use; if no usage site materializes, drop it from production.

### 6.6 `.status-dot--live`

```html
<span class="status-dot status-dot--live" aria-hidden="true"></span>
```

```css
.status-dot {
  display: inline-block;
  width: 6px; height: 6px;
  background: var(--accent);
  margin-right: var(--s2);
  vertical-align: middle;
  flex-shrink: 0;
}
.status-dot--live { box-shadow: 0 0 0 3px rgba(200,255,61,0.18); animation: pulse 2.4s ease-in-out infinite; }
@keyframes pulse { 50% { box-shadow: 0 0 0 5px rgba(200,255,61,0.05); } }
@media (prefers-reduced-motion: reduce) { .status-dot--live { animation: none; } }
```

Used:
- Hero on Home next to "Senior Engineer @ MPA" → indicates currently employed.
- Career page on the MPA role's date gutter → indicates current role.

### 6.7 `.link-arrow`

**Canonical "go-to" link component.** Used uniformly anywhere the user is being routed somewhere — internal sections OR external destinations. As of the v2 revision, this is the only component used for external links across:

- Section heads (`Full bio →` on Home, etc.).
- Featured project lead and secondary cards (`visit →`).
- All Projects grid card links (`site →`, `github →`, `OAC-API →`, etc., one `.link-arrow` per URL inside `.pr__links`; no separators).
- Career role refs (`NativeScript Spotify →`, `CONFEA →`).
- Article trailing CTAs (`read on dev.to →`).

Footer links are deliberately NOT `.link-arrow` (they use a quieter `--mid` text-link convention; see §6.24). The arrow icon SVG is a single right-pointing glyph; no separate up-right (`↗`) variant is introduced. The destination type is communicated by the URL alone.

```html
<a class="link-arrow" href="…"><span>Read more</span><svg viewBox="0 0 10 10">…</svg></a>
```

```css
.link-arrow {
  display: inline-flex; align-items: center; gap: 6px;
  color: var(--accent);
  font: 500 var(--t-meta)/1.55 var(--ff-mono);
  text-decoration: none;
  transition: color var(--d-fast) var(--ease-out);
}
.link-arrow svg {
  width: 10px; height: 10px;
  transition: transform var(--d-fast) var(--ease-out);
  flex-shrink: 0;
}
.link-arrow:hover { color: var(--accent-hi); text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1px; }
.link-arrow:hover svg { transform: translateX(2px); }
.link-arrow:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
```

### 6.8 `.button-cta` — outlined accent button (primary CTA)

```html
<a class="button-cta" href="/about">
  <span>Read more</span>
  <span class="button-cta__arrow" aria-hidden="true">→</span>
</a>
```

```css
.button-cta {
  display: inline-flex; align-items: center; gap: var(--s2);
  font: 600 var(--t-meta)/1.55 var(--ff-mono);
  color: var(--accent);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border: 1px solid var(--accent-mute);
  background: transparent;
  padding: var(--s3) var(--s5);
  text-decoration: none;
  cursor: pointer;
  transition: background-color var(--d-fast) var(--ease-out), border-color var(--d-fast) var(--ease-out), color var(--d-fast) var(--ease-out);
}
.button-cta:hover { background: var(--accent-tint); border-color: var(--accent); color: var(--accent-hi); }
.button-cta:active { background: var(--accent); color: var(--bg); border-color: var(--accent); }
.button-cta:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
```

### 6.9 `.button-text` — secondary CTA (text + arrow, no border)

```html
<a class="button-text" href="mailto:hello@andresilva.cc">
  <span>hello@andresilva.cc</span>
  <span class="button-text__arrow" aria-hidden="true">→</span>
</a>
```

```css
.button-text {
  display: inline-flex; align-items: center; gap: var(--s2);
  font: 500 var(--t-meta)/1.55 var(--ff-mono);
  color: var(--mid);
  text-transform: lowercase;
  letter-spacing: 0.01em;
  padding: var(--s3) 0;
  text-decoration: none;
  transition: color var(--d-fast) var(--ease-out);
}
.button-text:hover { color: var(--accent-hi); text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1px; }
.button-text:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; }
```

**CTA pairing rule (revised in v2).**
- The **Home hero** now uses ONE CTA — `.button-text` only (`hello@andresilva.cc →`). The previous `.button-cta Read more →` was duplicative with the Bio section's `Full bio →` link-arrow and is removed. `.button-text` is acceptable as a standalone hero CTA in this case because the page's primary CTA-equivalent is the contextual `Full bio →` in the Bio section directly below the hero — the hero's job is "say who I am, give me a way to reach you."
- The **About Get-in-touch band** keeps the pair (`.button-cta Download CV →` + `.button-text hello@andresilva.cc →`) because that band's job IS to surface two side-by-side primary actions; downloading the CV and emailing are equally weighted.
- General rule: never two `.button-cta` next to each other. `.button-text` may stand alone when the surrounding context already provides the primary route.

### 6.10 `.sec-head` — section header pattern

The `>` heading-arrow is **removed**. Eyebrow + h2 only.

**v2 revision: single-section pages OMIT `.sec-head` entirely.** Career and Articles each have exactly one `<section class="band">`. Their page-head H1 (`<CAREER />`, `<ARTICLES />`) is the section header. Adding a numbered or unnumbered eyebrow + h2 below it ("// work history > Career") duplicates the title. **Do not render `.sec-head` on Career or Articles.** The `<section class="band">` opens directly with the content (`.career-list` or `.list`).

On multi-section pages (Home, About, Projects), `.sec-head` is rendered with eyebrow + h2 as before. The eyebrow is numbered there because there are siblings.

```html
<div class="sec-head">
  <span class="comment-tag">// 01 / who</span>
  <div class="sec-head__row">
    <h2>Bio</h2>
    <a class="link-arrow" href="…"><span>Full bio</span><svg>…</svg></a>
  </div>
</div>
```

```css
.sec-head {
  display: flex; flex-direction: column;
  gap: var(--s2);
  padding-bottom: var(--s4);
  margin-bottom: var(--s5);
  border-bottom: 1px solid var(--rule);
}
.sec-head__row {
  display: flex; justify-content: space-between; align-items: baseline;
  gap: var(--s4); flex-wrap: wrap;
}
.sec-head h2 {
  margin: 0;
  font: 600 var(--t-h2)/1.30 var(--ff-mono);
  color: var(--hi);
  letter-spacing: -0.005em;
}
.sec-head--flush { margin-bottom: 0; }
```

**Variant**
- `.sec-head--flush` — when a framed grid sits directly under (Education, Featured-grid, Projects-grid).

### 6.11 `.comment-tag` — eyebrow

```css
.comment-tag {
  font: 600 var(--t-micro)/1.5 var(--ff-mono);
  color: var(--accent);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  display: block;
  margin-bottom: var(--s1);
}
```

**Eyebrow text rules**
- On multi-section pages (Home: 2 sections; About: 4 sections; Projects: 2 sections), prefix with two-digit number: `// 01 / who`, `// 02 / recent`.
- On single-section pages (Career, Articles), the eyebrow is omitted entirely along with the rest of `.sec-head` (see §6.10). The previous unnumbered variants (`// work history`, `// on the record`) are no longer used in this revision.
- Lowercase after the comment marker. Single forward-slash (no double-slash inside the body).
- Always rendered in the comment-tag's `text-transform: uppercase`.

### 6.12 `.t-pixel`

```css
.t-pixel {
  font-family: var(--ff-display);
  -webkit-font-smoothing: none;
  image-rendering: pixelated;
}
```

Applied to: hero name, page-head H1.

### 6.13 `.brace` — page-title bracket framing

```css
.brace {
  color: var(--lo);
  font-family: var(--ff-display);
  font-weight: 400;
  -webkit-font-smoothing: none;
}
```

Used as: `<h1 class="title t-pixel"><span class="brace">&lt;</span>ABOUT<span class="brace"> /&gt;</span></h1>`. Identity carries: do not change.

### 6.14 `.row` — Home Latest row (linked card)

The row is now an `<a>` wrapping its body. The kind-tag column is removed; replaced by a date column.

```html
<a class="row" href="…">
  <div class="row__date">apr 2025</div>
  <div class="row__body">
    <span class="row__kind">// career</span>
    <strong>Senior Engineer</strong>
    <span class="row__at">@</span>
    <span class="row__company">MPA</span>
  </div>
  <span class="row__cta link-arrow"><span>Read more</span><svg>…</svg></span>
</a>
```

```css
.rows { display: flex; flex-direction: column; }
.row {
  display: grid;
  grid-template-columns: 96px 1fr auto;
  gap: var(--s4);
  padding: var(--s4) var(--s3);
  margin: 0 calc(var(--s3) * -1);
  border-top: 1px solid var(--rule);
  align-items: center;
  text-decoration: none;
  color: inherit;
  transition: background var(--d-fast) var(--ease-out);
}
.row:first-of-type { border-top: 0; }
.row:hover { background: var(--surface-2); }
.row:hover .row__cta { color: var(--accent-hi); }
.row:hover .row__cta svg { transform: translateX(2px); }
.row:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }

.row__date {
  font: 500 var(--t-meta)/1.55 var(--ff-mono);
  color: var(--lo);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
  text-transform: lowercase;
}
.row__body {
  min-width: 0;
  color: var(--mid);
  font: 400 var(--t-body)/1.55 var(--ff-mono);
  display: flex; flex-wrap: wrap; align-items: baseline;
  gap: var(--s2);
}
.row__kind {
  color: var(--lo); font-style: italic;
  font-size: var(--t-meta);
  letter-spacing: 0.02em;
  margin-right: var(--s1);
}
.row__body strong { color: var(--hi); font-weight: 600; }
.row__at { color: var(--lo); font-weight: 400; }
.row__company { color: var(--hi); font-weight: 600; }
.row__cta { color: var(--accent); }

@media (max-width: 760px) {
  .row { grid-template-columns: 1fr; gap: var(--s2); padding: var(--s3); }
  .row__cta { justify-self: flex-start; }
}
```

### 6.15 `.grid-frame` — closed-corner grid

Unchanged from the prior 06 spec. (See §6.15 below.)

```css
.grid-frame { display: grid; border: 1px solid var(--rule); gap: 0; }
.grid-frame > * { border-right: 1px solid var(--rule); border-bottom: 1px solid var(--rule); }
.grid-frame--2col { grid-template-columns: repeat(2, 1fr); }
.grid-frame--2col > *:nth-child(2n) { border-right: 0; }
.grid-frame--2col > *:nth-last-child(-n+2) { border-bottom: 0; }
.grid-frame--3col { grid-template-columns: repeat(3, 1fr); grid-auto-rows: 1fr; }
.grid-frame--3col > *:nth-child(3n) { border-right: 0; }
.grid-frame--3col > *:nth-last-child(-n+3) { border-bottom: 0; }

@media (max-width: 1100px) {
  .grid-frame--3col { grid-template-columns: repeat(2, 1fr); }
  .grid-frame--3col > * { border-right: 1px solid var(--rule); border-bottom: 1px solid var(--rule); }
  .grid-frame--3col > *:nth-child(2n) { border-right: 0; }
  .grid-frame--3col > *:nth-last-child(-n+2) { border-bottom: 0; }
}
@media (max-width: 700px) {
  .grid-frame--2col, .grid-frame--3col { grid-template-columns: 1fr; }
  .grid-frame > * { border-right: 0; border-bottom: 1px solid var(--rule); }
  .grid-frame > *:last-child { border-bottom: 0; }
}
```

`grid-auto-rows: 1fr` on `.grid-frame--3col` ensures all cards in a row equal the tallest sibling; replaces the `min-height` on cards.

### 6.16 `.featured-strip` — Featured Projects layout (NEW, replaces featured-grid)

Asymmetric three-column where the first card spans 2/3 of the width and includes a longer description. Visually distinct from the All Projects grid.

```html
<div class="featured-strip">
  <article class="pr pr--lead">
    <h3 class="pr__title">Grafex</h3>
    <p class="pr__desc">Images as Code. Write JSX, export as images. A small library that makes social-share image generation painless …</p>
    <div class="pr__chips">
      <span class="tag tag--chip">TypeScript</span>
      <span class="tag tag--chip">Node.js</span>
    </div>
    <a class="link-arrow pr__visit" href="https://grafex.dev/" target="_blank" rel="noopener noreferrer"><span>visit grafex.dev</span><svg>…</svg></a>
  </article>
  <article class="pr pr--featured">
    <h3 class="pr__title">Calcloak</h3>
    <p class="pr__desc">Syncs personal calendar events as busy blocks to work calendars.</p>
    <div class="pr__chips">
      <span class="tag tag--chip">TypeScript</span>
      <span class="tag tag--chip">React</span>
      <span class="tag tag--chip">Node.js</span>
      <span class="tag tag--chip">Tailwind CSS</span>
    </div>
    <a class="link-arrow pr__visit" href="https://calcloak.com/" target="_blank" rel="noopener noreferrer"><span>visit calcloak.com</span><svg>…</svg></a>
  </article>
  <article class="pr pr--featured">
    <h3 class="pr__title">Injektion</h3>
    <p class="pr__desc">Decorator-less dependency injection for JavaScript and TypeScript.</p>
    <div class="pr__chips">
      <span class="tag tag--chip">TypeScript</span>
    </div>
    <a class="link-arrow pr__visit" href="https://github.com/andresilva-cc/injektion" target="_blank" rel="noopener noreferrer"><span>view on github</span><svg>…</svg></a>
  </article>
</div>
```

**v2 revision: featured cards use a single `.link-arrow.pr__visit` per card.** The previous markup for the secondary featured cards (Calcloak, Injektion) used a `.pr__links` cluster with `site` / `github` text + middle-dot separators. That mismatch with the lead card has been eliminated. Each featured card now points to ONE primary URL via a single `.link-arrow.pr__visit`. The link text reads `visit <hostname>` for site URLs (e.g., `visit grafex.dev`, `visit calcloak.com`) or `view on github` for repo-only URLs (e.g., Injektion). Pick the URL by precedence: explicit website > GitHub. If both exist (Grafex), the website wins and the GitHub URL is dropped from the featured strip — interested visitors find it via the All Projects grid below or via the page footer's GitHub link.

```css
.featured-strip {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  border: 1px solid var(--rule);
}
.featured-strip > * { border-right: 1px solid var(--rule); }
.featured-strip > *:last-child { border-right: 0; }
.pr--lead { padding: var(--s6); }
.pr--lead .pr__title { color: var(--accent); font-size: var(--t-h2); }
.pr--lead .pr__desc { max-width: var(--prose-w-card); margin: var(--s3) 0 var(--s4); }
.pr--featured { padding: var(--s5); }
.pr--featured .pr__title { color: var(--accent); }

@media (max-width: 1100px) {
  .featured-strip { grid-template-columns: 1fr 1fr; }
  .featured-strip > *:nth-child(1) { grid-column: 1 / -1; border-right: 0; border-bottom: 1px solid var(--rule); }
  .featured-strip > *:nth-child(2) { border-right: 1px solid var(--rule); }
  .featured-strip > *:nth-child(3) { border-right: 0; }
}
@media (max-width: 700px) {
  .featured-strip { grid-template-columns: 1fr; }
  .featured-strip > * { border-right: 0; border-bottom: 1px solid var(--rule); }
  .featured-strip > *:last-child { border-bottom: 0; }
}
```

### 6.17 `.pr` — project card (compact, used in All Projects grid)

```html
<article class="pr" data-tech="TypeScript Vue.js Nuxt Tailwind CSS">
  <h3 class="pr__title">CustomBurger</h3>
  <p class="pr__desc">A small project where you can build your own burger.</p>
  <div class="pr__chips">
    <span class="tag tag--chip">Vue.js</span>
    <span class="tag tag--chip">Nuxt</span>
    <span class="tag tag--chip">Tailwind CSS</span>
  </div>
  <div class="pr__links">
    <a class="link-arrow" href="https://customburger.andresilva.cc/" target="_blank" rel="noopener noreferrer"><span>site</span><svg viewBox="0 0 10 10">…</svg></a>
  </div>
</article>
```

For projects with multiple links (e.g., EyesUp, Teseu, OAC), each URL gets its own `.link-arrow` inside `.pr__links`. Separators (`pr__sep` middle-dots) are **removed in v2 revision** — the `.link-arrow` row uses `gap` for spacing instead.

```html
<div class="pr__links">
  <a class="link-arrow" href="…"><span>site</span><svg>…</svg></a>
  <a class="link-arrow" href="…"><span>eyesup-web</span><svg>…</svg></a>
  <a class="link-arrow" href="…"><span>eyesup-sync</span><svg>…</svg></a>
</div>
```

For projects with no public link at all (Marketplace Bridge from the data source), render `<span class="pr__none">// no public link</span>` in place of `.pr__links`.

```css
.pr {
  padding: var(--s4);
  display: flex; flex-direction: column; gap: var(--s2);
}
.pr__title {
  margin: 0;
  font: 600 var(--t-h3)/1.30 var(--ff-mono);
  color: var(--hi);
  letter-spacing: -0.005em;
}
.pr__desc { margin: 0; font: 400 var(--t-body)/1.6 var(--ff-mono); color: var(--mid); max-width: var(--prose-w-card); }
.pr__chips { display: flex; flex-wrap: wrap; gap: var(--s1); padding-top: var(--s1); }
.pr__links {
  margin-top: auto;
  padding-top: var(--s2);
  display: flex; flex-wrap: wrap;
  gap: var(--s2) var(--s4);   /* row-gap / column-gap; column-gap larger because no separators */
  align-items: baseline;
}
/* .pr__sep is removed in v2 revision — link-arrows use gap, not middle-dots, to separate. */
.pr__none { color: var(--lo); font-style: italic; font: 400 var(--t-meta)/1.55 var(--ff-mono); }
```

**Link label conventions per project type** (used inside `.pr__links` `.link-arrow` `<span>`):
- Single URL with no `name` in data → label `site` (if URL is a website) or `github` (if URL is a github.com repo).
- URL with explicit `name` in data → label = the `name` lowercased verbatim (e.g., `Website` → `site`, `GitHub` → `github`, `eyesup-web` → `eyesup-web`, `Teseu-App` → `teseu-app`, `OAC-API` → `oac-api`). Multi-word repo names keep their dashes/casing as-is.
- Special: when a project has both `Website` and `GitHub` named entries (e.g., EyesUp, Grafex's All-grid duplicate, OAC), render both link-arrows in source order (website first).

### 6.18 `.tech-filter` — Projects filter chip row (NEW)

Sits above the All Projects grid. Click filters the grid client-side.

```html
<div class="tech-filter" role="toolbar" aria-label="Filter by stack">
  <button class="tech-filter__chip is-active" data-filter="all">all <span class="tech-filter__count">15</span></button>
  <button class="tech-filter__chip" data-filter="typescript">typescript <span class="tech-filter__count">7</span></button>
  <button class="tech-filter__chip" data-filter="vue">vue <span class="tech-filter__count">5</span></button>
  …
</div>
```

```css
.tech-filter {
  display: flex; flex-wrap: wrap; gap: var(--s1);
  margin-bottom: var(--s5);
  padding-bottom: var(--s4);
  border-bottom: 1px solid var(--rule);
}
.tech-filter__chip {
  font: 500 var(--t-micro)/1.5 var(--ff-mono);
  letter-spacing: 0.01em;
  text-transform: lowercase;          /* INTENTIONAL — these are filter labels, not tech-name renders. See v2 decision 6+8. */
  color: var(--mid);
  background: transparent;
  border: 1px solid var(--rule);
  padding: 4px var(--s2);
  cursor: pointer;
  transition: color var(--d-fast) var(--ease-out), border-color var(--d-fast) var(--ease-out), background-color var(--d-fast) var(--ease-out);
}
.tech-filter__count { color: var(--lo); margin-left: 6px; font-variant-numeric: tabular-nums; }
.tech-filter__chip:hover { color: var(--hi); border-color: var(--accent-mute); }
.tech-filter__chip.is-active { color: var(--accent); border-color: var(--accent); background: var(--accent-tint); }
.tech-filter__chip.is-active .tech-filter__count { color: var(--accent); }
.tech-filter__chip:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
```

**Behaviour**: clicking a chip sets `data-active-filter` on `.grid` parent; CSS hides cards that don't match. **v2 revision: each `.pr` carries `data-tech="TypeScript Vue.js Nuxt"` in CANONICAL CASE** (space-separated). The selector uses the case-insensitive flag to match a lowercase filter token against canonical-case data: `.grid[data-active-filter="vue"] > .pr:not([data-tech*="Vue" i]) { display: none; }`. All-filter clears.

### 6.19 `.art` — article entry (revised: 240px / 1fr; date inline)

```html
<article class="art">
  <a class="art__illo" href="…" aria-hidden="true" tabindex="-1">
    <svg viewBox="0 0 200 120">…</svg>
  </a>
  <div class="art__body">
    <div class="art__meta">
      <span class="art__date">2025.02.13</span>
      <span class="art__sep">·</span>
      <span>4 min</span>
      <span class="art__sep">·</span>
      <span>11 ♥</span>
      <span class="art__sep">·</span>
      <span>1 comment</span>
    </div>
    <h3 class="art__title"><a href="…">How I Achieved a 74% Performance Increase on a Page</a></h3>
    <p class="art__desc">…</p>
    <div class="art__tags">
      <span class="tag tag--chip">Vue.js</span>
      <span class="tag tag--chip">Nuxt</span>
      <span class="tag tag--chip">webperf</span>   <!-- non-brand semantic tag stays lowercase -->
    </div>
    <a class="link-arrow art__lnk" href="…"><span>read on dev.to</span><svg>…</svg></a>
  </div>
</article>
```

```css
.list { display: flex; flex-direction: column; }
.art {
  display: grid; grid-template-columns: 240px 1fr;
  gap: var(--s6);
  padding: var(--s6) 0;
  border-bottom: 1px solid var(--rule);
  align-items: stretch;        /* v2 revision: was flex-start; stretch lets the illo column match body height */
}
.art:last-child { border-bottom: 0; }

.art__illo {
  width: 240px;
  /* v2 revision: height is no longer fixed at 144px. Stretch to fill the row's body height. */
  min-height: 144px;           /* baseline floor for short bodies */
  height: 100%;
  border: 1px solid var(--rule);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  background: var(--surface-2);
  overflow: hidden;
}
/* SVG keeps its 200×120 viewBox but renders centered with letterboxing if the body is taller than the natural aspect.
   `object-fit: contain` on the SVG element preserves the artwork without distortion. */
.art__illo svg {
  display: block;
  width: 100%;
  height: 100%;
  max-height: 100%;
  object-fit: contain;
}

.art__body { min-width: 0; }
.art__meta {
  display: flex; flex-wrap: wrap; gap: var(--s2);
  font: 500 var(--t-meta)/1.55 var(--ff-mono);
  color: var(--lo);
  font-variant-numeric: tabular-nums;
}
.art__date { color: var(--mid); }
.art__sep { color: var(--rule); }
.art__title { margin: var(--s2) 0 0; font: 600 var(--t-h3)/1.30 var(--ff-mono); }
.art__title a { color: var(--hi); text-decoration: none; transition: color var(--d-fast) var(--ease-out); }
.art__title a:hover { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1px; }
.art__desc { margin: var(--s3) 0 0; font: 400 var(--t-body)/1.65 var(--ff-mono); color: var(--mid); max-width: var(--prose-w); }
.art__desc strong { color: var(--hi); font-weight: 600; }
.art__desc .acc { color: var(--accent); font-weight: 600; }
.art__tags { margin-top: var(--s4); display: flex; flex-wrap: wrap; gap: var(--s1); }
.art__lnk { margin-top: var(--s4); }

@media (max-width: 760px) {
  .art { grid-template-columns: 1fr; gap: var(--s4); align-items: flex-start; }
  /* On mobile the illustration sits ABOVE the body — there's no body height to match against,
     so revert to the natural 240/144 aspect ratio. */
  .art__illo { width: 100%; max-width: 320px; height: auto; min-height: 0; aspect-ratio: 240/144; }
}
```

**Article illustration policy**: optional. If no per-article illustration exists, render `<div class="art__illo art__illo--default">` containing a generic placeholder (a 1.2-stroke `--accent-mute` rectangle inscribed with `// dev.to` text). Drawing rules unchanged from prior spec for the two existing entries.

### 6.20 `.role` — career role (revised: live-dot on current role)

```html
<article class="role role--current">
  <div class="role__date-gutter">
    <span class="role__dates"><span class="status-dot status-dot--live"></span>apr 2025 — now</span>
    <span class="role__duration">~1 yr</span>
  </div>
  <div class="role__content">
    <h3 class="role__title">Senior Engineer<span class="role__at"> @ </span><span class="role__company">MPA</span></h3>
    <span class="role__formerly">// formerly Healthy Labs</span>
    <ul class="role__bullets"> … </ul>
    <div class="role__chips"> … </div>
    <!-- Optional: only on roles whose data carries a `links` array (Nuxstep, Grupo Gmaes). -->
    <div class="role__refs">
      <span class="role__refs-label">// refs:</span>
      <a class="link-arrow" href="https://github.com/Nuxstep/nativescript-plugins/tree/master/packages/nativescript-spotify" target="_blank" rel="noopener noreferrer">
        <span>NativeScript Spotify</span>
        <svg viewBox="0 0 10 10">…</svg>
      </a>
    </div>
  </div>
</article>
```

```css
.career-list { border: 1px solid var(--rule); }
.role { display: grid; grid-template-columns: 180px 1fr; gap: 0; border-bottom: 1px solid var(--rule); }
.role:last-child { border-bottom: 0; }

.role__date-gutter {
  padding: var(--s5);
  border-right: 1px solid var(--rule);
  display: flex; flex-direction: column; gap: var(--s2);
}
.role__dates {
  font: 500 var(--t-meta)/1.6 var(--ff-mono);
  color: var(--mid);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
  display: inline-flex; align-items: center;
}
.role__duration {
  font: 500 var(--t-meta)/1.5 var(--ff-mono);
  color: var(--lo);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-top: var(--s1);
}

.role__content { padding: var(--s5) var(--s6); min-width: 0; }
.role__title {
  margin: 0;
  font: 600 var(--t-h3)/1.30 var(--ff-mono);
  color: var(--hi);
  letter-spacing: -0.005em;
}
.role__at { color: var(--lo); font-weight: 400; font-size: var(--t-meta); }
.role__company { color: var(--accent); font-weight: 600; }
.role__formerly {
  display: block; margin-top: var(--s1);
  font: 400 var(--t-meta)/1.55 var(--ff-mono);
  color: var(--lo);
  font-style: italic;
  letter-spacing: 0.02em;
}

.role__bullets { margin: var(--s3) 0 0; padding: 0; list-style: none; max-width: var(--prose-w); }
.role__bullets li {
  font: 400 var(--t-body)/1.65 var(--ff-mono);
  color: var(--mid);
  margin-bottom: var(--s2);
}
.role__bullets li:last-child { margin-bottom: 0; }
.role__bullets li::before {
  content: "+";
  color: var(--accent);
  font-family: var(--ff-mono);
  font-weight: 600;
  margin-right: var(--s2);
}
.role__bullets li strong { color: var(--hi); font-weight: 600; }
.role__bullets li .acc { color: var(--accent); font-weight: 600; }
.role__chips { margin-top: var(--s4); display: flex; flex-wrap: wrap; gap: var(--s1) var(--s2); }

/* v2 revision: external references restored from the data source.
   Rendered ONLY on roles whose data has a `links` array (Nuxstep → NativeScript Spotify; Grupo Gmaes → CONFEA).
   Never rendered when there are no refs. */
.role__refs {
  margin-top: var(--s4);
  display: flex; flex-wrap: wrap;
  gap: var(--s2) var(--s4);
  align-items: baseline;
  font: 400 var(--t-meta)/1.55 var(--ff-mono);
}
.role__refs-label {
  color: var(--lo);
  font-style: italic;
  letter-spacing: 0.02em;
}
/* The `.link-arrow` inside .role__refs inherits the canonical link-arrow style (§6.7) — no override needed. */

@media (max-width: 760px) {
  .role { grid-template-columns: 1fr; }
  .role__date-gutter {
    border-right: 0; border-bottom: 1px solid var(--rule);
    flex-direction: row; align-items: center; flex-wrap: wrap;
    gap: var(--s3); padding: var(--s3) var(--s4);
  }
  .role__content { padding: var(--s4); }
  .role__duration { margin-top: 0; }
}
```

### 6.21 `.education-cell`

```html
<div class="education-cell">
  <h3 class="education-cell__title">BS in Computer Science</h3>
  <div class="education-cell__institution">UnoChapecó · 2014 — 2018</div>
  <p class="education-cell__desc">Foundational training across algorithms, systems, networks, and software engineering — the basis for nine years of end-to-end engineering work.</p>
</div>
```

```css
.education-cell { padding: var(--s5) var(--s6); }
.education-cell__title { margin: 0; font: 600 var(--t-h3)/1.30 var(--ff-mono); color: var(--hi); letter-spacing: -0.005em; }
.education-cell__institution { margin-top: var(--s1); font: 500 var(--t-meta)/1.55 var(--ff-mono); color: var(--lo); letter-spacing: 0.02em; }
.education-cell__desc { margin: var(--s3) 0 0; font: 400 var(--t-body)/1.65 var(--ff-mono); color: var(--mid); max-width: 56ch; }
```

Badges removed. Institution + date range replace them.

### 6.22 `.facts-cell`

```html
<div class="facts-cell">
  <span class="facts-cell__k">location</span>
  <span class="facts-cell__v">Florianópolis, BR</span>
</div>
```

```css
.facts-cell { padding: var(--s4) var(--s5); display: flex; flex-direction: column; gap: var(--s1); }
.facts-cell__k { font: 600 var(--t-micro)/1.5 var(--ff-mono); color: var(--lo); letter-spacing: 0.14em; text-transform: uppercase; }
.facts-cell__v { font: 500 var(--t-body)/1.6 var(--ff-mono); color: var(--hi); }
```

### 6.23 `.photo` (About bio) — v2 revision

**Position:** photo sits in the **LEFT** column of `.about-grid`, prose on the right (matching the layout pattern from `05-prose-mono-refined-about.html`). Size is 200×260 (≈3.25:4) — slightly smaller than the prior 240×320 so it balances against a wider prose column without dominating.

**Markup:** the photo wraps in a `.photo-wrap` div so the scanline overlay can be drawn on a `::after` pseudo-element. The bare `<img>` doesn't support `::after`.

```html
<div class="photo-wrap">
  <img class="photo" src="../public/me.jpg" alt="Portrait of André Silva" />
</div>
```

**CSS:**

```css
:root {
  /* v2 revision: retuned to land on actual lime (--accent #C8FF3D).
     Prior: grayscale(1) sepia(0.4) hue-rotate(40deg) saturate(2) contrast(1.1) brightness(0.9) */
  --photo-filter: grayscale(1) sepia(0.5) hue-rotate(60deg) saturate(3.2) contrast(1.05) brightness(0.92);
}

.photo-wrap {
  position: relative;
  width: 200px;
  height: 260px;
  display: block;
  border: 1px solid var(--rule);
  overflow: hidden;
}
.photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: var(--photo-filter);
  transition: filter 0.4s var(--ease-out);
}
/* CRT scanline overlay — repeating 2px horizontal tracks (1px transparent + 1px shadow).
   `mix-blend-mode: multiply` darkens the underlying lime-tinted photo without tinting unrelated colors. */
.photo-wrap::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: repeating-linear-gradient(
    0deg,
    transparent 0,
    transparent 1px,
    rgba(0, 0, 0, 0.18) 1px,
    rgba(0, 0, 0, 0.18) 2px
  );
  mix-blend-mode: multiply;
  opacity: 1;
  transition: opacity 0.4s var(--ease-out);
}
/* Hover reveals the natural color photo: filter clears AND scanlines fade. */
.photo-wrap:hover .photo { filter: none; }
.photo-wrap:hover::after { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .photo { transition: none; }
  .photo-wrap::after { transition: none; }
}

/* Responsive: at ≤ 1000px the about-grid collapses to one column.
   The photo precedes the prose in source order, so no `order: -1` is needed.
   The photo grows to fill width up to a max of 320 (smaller than the desktop column would suggest because mobile prose stacks below). */
@media (max-width: 1000px) {
  .photo-wrap {
    width: 100%;
    max-width: 320px;
    height: auto;
    aspect-ratio: 200/260;
  }
}
```

**Behaviour notes:**
- The `.photo-wrap` is the hover target so the scanline overlay can transition together with the underlying photo. Hovering the IMG alone wouldn't trigger the `::after` of its parent.
- Reduced-motion still toggles state on hover (filter and scanlines clear); only the transition animation is removed.
- The photo's `alt` text remains on the `<img>`. The wrap div is not announced (decorative wrapper).

### 6.24 `footer`

```html
<footer>
  <span class="footer__copy">© 2026 · andresilva.cc</span>
  <div class="footer__links">
    <a href="https://github.com/andresilva-cc">github</a>
    <span class="footer__sep">·</span>
    <a href="https://linkedin.com/in/andresilva-cc">linkedin</a>
    <span class="footer__sep">·</span>
    <a href="https://dev.to/andresilva-cc">dev.to</a>
    <span class="footer__sep">·</span>
    <a href="mailto:hello@andresilva.cc">email</a>
  </div>
</footer>
```

```css
footer {
  padding: var(--s5) 0 var(--s8);
  display: flex; justify-content: space-between; align-items: baseline;
  font: 400 var(--t-micro)/1.5 var(--ff-mono);
  color: var(--lo);
  letter-spacing: 0.04em;
  flex-wrap: wrap;
  gap: var(--s2);
  border-top: 1px solid var(--rule);
  margin-top: var(--s12);
}
.footer__copy { color: var(--lo); text-transform: lowercase; }
.footer__links { display: flex; gap: var(--s2); align-items: baseline; }
.footer__links a { color: var(--mid); text-transform: lowercase; text-decoration: none; }
.footer__links a:hover { color: var(--accent-hi); text-decoration: underline; text-underline-offset: 3px; }
.footer__sep { color: var(--lo); padding: 0 2px; }
```

### 6.25 Hero name + cursor

```css
h1.name {
  margin: 0;
  font: 400 var(--t-display)/1.10 var(--ff-display);
  color: var(--accent);
  letter-spacing: -0.01em;
  display: inline-flex; align-items: center;
  gap: var(--s2);
  -webkit-font-smoothing: none;
}
.name__cursor {
  display: inline-block;
  width: 14px; height: 40px;
  background: var(--accent);
  transform: translateY(2px);
  animation: blink 1.06s steps(2, end) infinite;
}
@keyframes blink { 50% { opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .name__cursor { animation: none; } }
@media (max-width: 760px) { h1.name { font-size: 40px; } .name__cursor { width: 10px; height: 28px; } }
```

### 6.26 Removed components

Removed from the prior 06 catalogue:
- `.tag--kind` — Home rows no longer wear left-side category tags.
- `.heading-arrow` — `>` glyph dropped from h2.
- `.facts-strip` — Home no longer carries a 4-up facts row.
- `.button-cta__arrow` — kept (used inside `.button-cta`).
- `.sec-head--inline` — folded back into `.sec-head` since `--s8` band padding now provides the air the inline variant was creating.
- `.hero-mark__kv`, `.hero-mark__note` — the SIGNAL kv-list from the previous critical-audit pass is removed in re-revision; the hero's right column reverts to the ASCII plasma (see §6.27).

### 6.27 `.hero-plasma` — hero ASCII plasma (RESTORED in re-revision)

Variant 01 ASCII plasma from `05-prose-mono-refined-home.html`. Carried over verbatim. Sits in the hero's right column on Home.

**HTML**
```html
<aside class="hero-plasma" aria-hidden="true">
  <pre id="v1-ascii" class="hero-plasma__pre"></pre>
</aside>
```

**CSS**
```css
.hero-plasma {
  width: 400px;
  height: 230px;
  flex-shrink: 0;
  position: relative;
}
.hero-plasma__pre {
  font-family: var(--ff-mono);
  font-size: 8px;
  line-height: 1.15;
  color: var(--mid);                 /* mid-luminance characters in --mid */
  overflow: hidden;
  white-space: pre;
  width: 100%;
  height: 100%;
  display: block;
  margin: 0;
  padding: 0;
  user-select: none;
  letter-spacing: 0;
}
@media (max-width: 900px) {
  .hero-plasma { width: 100%; max-width: 400px; height: auto; aspect-ratio: 400/230; }
}
```

The `<pre>` wraps the rendered text. High-luminance characters (`@#8G`) are wrapped in `<span style="color:var(--accent)">…</span>` inline by the JS. Mid characters (`LCft1i;:,.`) and low fillers (`.` and space) inherit the `--mid` color from the `<pre>`.

**JavaScript** (placed at end of `<body>` on Home only; preserved verbatim from 05):

```html
<script>
(function() {
  'use strict';
  var plasmaRAF = null;
  var plasmaPre = document.getElementById('v1-ascii');
  var PL_COLS = 64, PL_ROWS = 26;
  var PL_RAMP_HI = '@#8G';
  var PL_RAMP_MID = 'LCft1i;:,.';
  var PL_t = 0;

  function renderPlasmaFrame(tf) {
    var lines = [];
    for (var row = 0; row < PL_ROWS; row++) {
      var rowHtml = '';
      var y = ((row + 0.5) / PL_ROWS - 0.5) * 3.0;
      for (var col = 0; col < PL_COLS; col++) {
        var x = ((col + 0.5) / PL_COLS - 0.5) * 6.0;
        var f = Math.sin(x * 2 + tf)
              + Math.sin(y * 2 + tf * 0.9)
              + Math.sin((x + y) * 1.5 + tf * 1.1)
              + Math.sin(Math.sqrt(x*x + y*y) * 2.5 + tf * 0.8);
        var n = (f + 4) / 8;
        n = Math.min(1, Math.max(0, n));
        var ch, isAccent;
        if (n > 0.72) {
          var idx = Math.min(PL_RAMP_HI.length - 1, Math.floor((n - 0.72) / 0.28 * PL_RAMP_HI.length));
          ch = PL_RAMP_HI[idx]; isAccent = true;
        } else if (n > 0.28) {
          var idx2 = Math.min(PL_RAMP_MID.length - 1, Math.floor((n - 0.28) / 0.44 * PL_RAMP_MID.length));
          ch = PL_RAMP_MID[idx2]; isAccent = false;
        } else {
          ch = n > 0.10 ? '.' : ' '; isAccent = false;
        }
        if (isAccent) { rowHtml += '<span style="color:var(--accent)">' + ch + '</span>'; }
        else { rowHtml += ch; }
      }
      lines.push(rowHtml);
    }
    return lines.join('\n');
  }

  function startAsciiPlasma() {
    if (!plasmaPre) return;
    PL_t = 0;
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { plasmaPre.innerHTML = renderPlasmaFrame(0); return; }
    if (plasmaRAF) return;
    var lastFrameTime = 0;
    function loop(ts) {
      plasmaRAF = requestAnimationFrame(loop);
      if (ts - lastFrameTime < 50) return;   /* ~20fps */
      lastFrameTime = ts;
      PL_t += 0.075;
      plasmaPre.innerHTML = renderPlasmaFrame(PL_t);
    }
    plasmaRAF = requestAnimationFrame(loop);
  }

  startAsciiPlasma();
})();
</script>
```

**Constants** (do not change):
- Grid: `PL_COLS = 64`, `PL_ROWS = 26`.
- Ramps: `PL_RAMP_HI = '@#8G'` (accent-colored), `PL_RAMP_MID = 'LCft1i;:,.'` (mid-colored).
- Time step: `PL_t += 0.075` per frame.
- Frame throttle: ≥ 50ms between frames (~20fps).
- Domain: `x ∈ [-3, 3]`, `y ∈ [-1.5, 1.5]` (sampled at cell centers).

**Reduced motion**: render exactly one static frame at `t = 0`; never start the RAF loop. The accent-colored characters still render (color is content, not motion).

**Accessibility**: `aria-hidden="true"` on the wrapping `<aside>`. Decorative; not announced.

---

## 7. Layout patterns

### 7.1 Outer shell

```
<div class="caption">…</div>
<div class="shell">
  <header class="bar">…</header>
  <!-- page sections -->
  <footer>…</footer>
</div>
```

### 7.2 Page-head (About / Career / Projects / Articles)

**v2 revision: the subhead under the H1 is removed.** The H1 alone (`<ABOUT />`, `<CAREER />`, etc.) fills the page-head band. The `.page-head__sub` class is retained in the catalogue below for potential future use, but **no page in this revision renders it**.

```html
<section class="page-head">
  <h1 class="title t-pixel"><span class="brace">&lt;</span>ABOUT<span class="brace"> /&gt;</span></h1>
</section>
```

```css
.page-head {
  padding: var(--s12) 0 var(--s5);
  border-bottom: 1px solid var(--rule);
  /* v2 revision: simplified from flex-column with gap; H1 is the only child now. */
  display: block;
}
h1.title {
  margin: 0;
  font: 400 var(--t-h1)/1.10 var(--ff-display);
  color: var(--accent);
  letter-spacing: -0.01em;
  -webkit-font-smoothing: none;
}
/* Retained for future use; no current page renders this element. */
.page-head__sub {
  margin: var(--s3) 0 0;
  font: 500 var(--t-meta)/1.55 var(--ff-mono);
  color: var(--lo);
  letter-spacing: 0.02em;
  text-transform: lowercase;
}
```

### 7.3 Section band

```css
section.band {
  padding: var(--s8) 0;
  border-bottom: 1px solid var(--rule);
}
section.band:last-of-type { border-bottom: 0; }
```

### 7.4 Hero grid (Home)

The right column holds the ASCII plasma (`.hero-plasma`, see §6.27). It's 400×230 — wider than the audit-pass mark column was — so the grid uses `1fr auto` and aligns items to center for visual balance.

```css
.hero {
  padding: var(--s16) 0 var(--s12);
  border-bottom: 1px solid var(--rule);
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--s12);
  align-items: center;
}
.hero-text { min-width: 0; }

@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
    gap: var(--s6);
    padding: var(--s8) 0 var(--s6);
    align-items: start;
  }
}
```

### 7.5 Hero CTA (Home) — v2 revision

**v2 revision: single CTA, not a pair.** The `Read more →` `.button-cta` is removed (it duplicated the Bio section's `Full bio →` link-arrow). Only `hello@andresilva.cc →` (`.button-text`) remains as the hero CTA.

```html
<div class="hero-ctas">
  <a class="button-text" href="mailto:hello@andresilva.cc">
    <span>hello@andresilva.cc</span><span class="button-text__arrow" aria-hidden="true">→</span>
  </a>
</div>
```

```css
.hero-ctas { display: flex; flex-wrap: wrap; align-items: center; gap: var(--s5); margin-top: var(--s6); }
```

The `.hero-ctas` wrapper is retained even with one child to preserve the `margin-top: var(--s6)` rhythm and to keep the CSS hook stable if a second CTA is added later.

---

## 8. Identity / decorative voice

Across all five pages, the same micro-conventions establish identity:

1. **Caption strip** (review files) — `// PROSE-MONO.POLISHED.V2  /  REDESIGN OPTION 07/07  /  PAGE`. Uppercase, lo on black.
2. **Page title `<NAME />` framing** — angle-brace + slash framing, lo color on the braces, accent on the page name. About/Career/Projects/Articles only — Home replaces this with the hero name.
3. **Subhead under page title** — `// short descriptor` in `--lo` lowercase mono 12px, italic-feel via letter-spacing not actual italic.
4. **Section eyebrow** — accent-colored 11px 600 0.16em uppercase. Numbered (`// 01 / who`) only on multi-section pages; unnumbered (`// work history`) on single-section.
5. **NO `>` heading arrow** on h2 — removed in this revision.
6. **Bullet `+`** — accent, before every Career bullet.
7. **`@` separator** — `--lo`, in role lines: `Senior Engineer @ MPA`.
8. **`·` separator** — middle-dot, neutral separator. Body separators: `--rule`. Footer separators: `--lo`. Project link separators: `--lo`.
9. **`// formerly Healthy Labs`** — only on the MPA role. lo italic. Reads as code comment.
10. **Lime-tinted photo** — natural color on hover. Only on About.
11. **Pixel cursor block** — only on home name. Blinks 1.06s.
12. **Live status dot** — green dot with soft pulse ring. Used on home hero next to current role and on the Career page's MPA entry.
13. **No rounding anywhere** — square corners.
14. **Tech chips render in canonical brand case** (`TypeScript`, `Vue.js`, `Node.js`, `Tailwind CSS`, …) — brand correctness over IDE-tag aesthetic. The `.tech-filter__chip` filter buttons remain lowercase because they are filter labels, not brand renders.

---

## 9. Page-by-page composition

### 9.1 HOME (`07-prose-mono-polished-v2-home.html`)

Sections (top to bottom):

1. `.caption` — `// PROSE-MONO.POLISHED.V2  /  REDESIGN OPTION 07/07  /  HOME`
2. `header.bar` — active: `[home]`
3. `.hero` — two columns:
   - Left:
     - `<h1 class="name t-pixel">André Silva<span class="name__cursor"></span></h1>`
     - `.role-line` — `<span class="status-dot status-dot--live"></span><span class="role">Senior Engineer</span><span class="at"> @ </span><span class="role-company">MPA</span>`
     - `.pitch` — `Software engineer with <strong class="acc">9+ years of experience</strong> building web platforms, internal tools, and developer tooling.`
     - `.hero-ctas` — **single CTA only:** `hello@andresilva.cc →` (`.button-text`). The previous `Read more →` `.button-cta` is **removed in v2** (duplicative with the Bio section's `Full bio →` link).
   - Right (`.hero-plasma` — Variant 01 ASCII plasma, see §6.27):
     - 400×230 `<aside aria-hidden="true">` containing `<pre id="v1-ascii">`
     - JS at end of `<body>` runs the plasma loop
     - Reduced-motion: single static frame at `t=0`
4. `<section class="band">` — Bio
   - eyebrow: `// 01 / who`
   - h2: `Bio` + `link-arrow Full bio →` to about
   - `.bio-body` — single paragraph from product copy
5. `<section class="band">` — Latest
   - eyebrow: `// 02 / recent`
   - h2: `Latest`
   - `.rows` containing **3** linked rows (one per kind: career, project, article).
6. `footer`

**Pitch text** (one accent-strong allowed): `Software engineer with <strong class="acc">9+ years of experience</strong> building web platforms, internal tools, and developer tooling.`

**Bio body text**: `Works <strong>end-to-end</strong> — from architecture and infrastructure to product features and integrations. Primarily <strong>TypeScript</strong>, <strong>Vue.js</strong>, <strong>Nuxt</strong>, <strong>React</strong>, <strong>Node.js</strong>. Takes ownership while collaborating effectively, adapting quickly to new tech and new problems.`

**Latest rows (v2 revision: 3 items, one per kind):**

| Date | Kind | Body | CTA |
|---|---|---|---|
| apr 2025 | career | Senior Engineer @ MPA (current) | View career → `07-prose-mono-polished-v2-career.html` |
| ~ | project | Grafex — Images as Code | View projects → `07-prose-mono-polished-v2-projects.html` |
| feb 2025 | article | How I Achieved a 74% Performance Increase on a Page | Read on dev.to → |

**Selection rules** (locked in v2):
- **Career row:** the current role (data: MPA, startDate apr 2025, no endDate). Dates render as `apr 2025`. CTA routes to the Career page.
- **Project row:** the most recent featured project from the data (Grafex — first entry where `featured: true`). Date column reads `~` (no dated record on projects); the data source has no per-project dates, so the date gutter renders a tilde to mean "undated, current." CTA routes to the Projects page (NOT to the external grafex.dev URL — the row is a navigation row, not a destination row).
- **Article row:** the standout article — "How I Achieved a 74% Performance Increase on a Page" (the 74% piece). Date stamp `feb 2025`. CTA routes to dev.to (external).
- The `Rendering Modes Explained` second article is **dropped** from Home Latest. Both articles still appear on the Articles page.

**Date column rendering:** The `.row__date` element renders `apr 2025` for dated rows and `~` (tilde) for undated rows. CSS unchanged.

**Row body kind labels:** `// career`, `// project`, `// article` (lowercase italic `--lo`, source order matches the table above).

**Hero right-column content**: the Variant 01 ASCII plasma (see §6.27 for the full HTML / CSS / JS — restored verbatim from `05-prose-mono-refined-home.html`).

```html
<aside class="hero-plasma" aria-hidden="true">
  <pre id="v1-ascii" class="hero-plasma__pre"></pre>
</aside>
```

The plasma JS lives at the end of `<body>` on Home only. Reduced-motion renders a single static frame at `t=0`.

**Role line markup**:
```html
<p class="role-line">
  <span class="status-dot status-dot--live" aria-label="currently employed"></span>
  <span class="role">Senior Engineer</span>
  <span class="at">@</span>
  <span class="role-company">MPA</span>
</p>
```

```css
.role-line {
  margin: var(--s3) 0 0;
  display: flex; flex-wrap: wrap; align-items: center; gap: var(--s2);
  font-family: var(--ff-mono); font-size: var(--t-h3);
}
.role-line .role { color: var(--accent); font-weight: 600; }
.role-line .at { color: var(--lo); font-weight: 400; }
.role-line .role-company { color: var(--hi); font-weight: 600; }
```

### 9.2 ABOUT (`07-prose-mono-polished-v2-about.html`)

1. `.caption`
2. `header.bar` — active: `[about]`
3. `.page-head` — `<ABOUT />` only (no subhead in v2)
4. `<section class="band">` — Bio
   - eyebrow: `// 01 / in my own words`
   - h2: `Bio`
   - `.about-grid` — **photo LEFT (200×260), prose RIGHT (mono, `--ff-mono`)**. Columns: `200px 1fr`, gap `--s10`, align-items: start. Photo precedes prose in source order.
5. `<section class="band">` — Education
   - eyebrow: `// 02 / where I studied`
   - h2: `Education`
   - `.grid-frame.grid-frame--2col` with two `.education-cell`s (no badges; institution + year line).
6. `<section class="band">` — Facts
   - eyebrow: `// 03 / quick facts`
   - h2: `Facts`
   - `.grid-frame.grid-frame--2col` with four `.facts-cell`s.
7. `<section class="band">` (last; bottom rule suppressed) — Get in touch
   - eyebrow: `// 04 / get in touch`
   - h2: `Get in touch`
   - `.cta-pair` — `Download CV →` (button-cta) + `hello@andresilva.cc →` (button-text). Stack vertical on mobile.
8. `footer`

**Bio markup** (v2 revision: photo left, prose right, mono `--ff-mono`; accent-strong reserved for `Florianópolis, Brazil`):

```html
<div class="about-grid">
  <div class="photo-wrap">
    <img class="photo" src="../public/me.jpg" alt="Portrait of André Silva" />
  </div>
  <div class="about-prose">
    <p>Software engineer with 9+ years of experience building <strong>web platforms</strong>, <strong>internal tools</strong>, and <strong>developer tooling</strong>. Works <strong>end-to-end</strong> — from architecture and infrastructure to product features and integrations.</p>
    <p>Primarily works with <strong>TypeScript</strong>, <strong>Vue.js</strong>, <strong>Nuxt</strong>, <strong>React</strong>, and <strong>Node.js</strong>. Takes ownership of solutions while collaborating effectively with teams, quickly adapting to new technologies and challenges.</p>
    <p>Holds a <strong>BS in Computer Science</strong> and a specialization certificate in <strong>Technical Leadership</strong>. Based in <strong class="acc">Florianópolis, Brazil</strong>.</p>
  </div>
</div>
```

```css
.about-grid {
  display: grid;
  /* v2 revision: photo (200px) on the left, prose on the right. Reversed from prior 06. */
  grid-template-columns: 200px 1fr;
  gap: var(--s10);                     /* v2 revision: gap reduced from --s12 to --s10 (40px) */
  align-items: start;
}
.about-prose {
  max-width: 60ch;
}
.about-prose p {
  margin: 0 0 var(--s4);
  font: 400 var(--t-body)/1.65 var(--ff-mono);
  color: var(--mid);
  letter-spacing: 0;
}
.about-prose p:last-child { margin-bottom: 0; }
.about-prose strong { color: var(--hi); font-weight: 600; }
.about-prose .acc { color: var(--accent); font-weight: 600; }

/* v2 revision: at ≤1000px, collapse to one column. Photo is FIRST in source order
   so it naturally appears above the prose — no `order: -1` needed. */
@media (max-width: 1000px) {
  .about-grid { grid-template-columns: 1fr; gap: var(--s6); }
  .photo-wrap { width: 100%; max-width: 320px; }
}
```

**Photo wrap.** The photo is wrapped in `.photo-wrap` (see §6.23) so the CRT scanline overlay can render via `::after`. The wrap also carries the hover target — hovering the wrap clears the lime filter AND fades the scanlines, both transitions firing together.

Note: mono prose at `--t-body` 14/1.65 with a 60ch cap is a deliberate brand choice — long-form bio reads as terminal output, which is the site's voice. The previous critical-audit pass introduced Inter sans here; that change is reversed in re-revision.

**Get in touch** band:

```html
<section class="band">
  <div class="sec-head">
    <span class="comment-tag">// 04 / get in touch</span>
    <div class="sec-head__row"><h2>Get in touch</h2></div>
  </div>
  <div class="cta-pair">
    <a class="button-cta" href="/resume.pdf" download>
      <span>Download CV</span><span class="button-cta__arrow" aria-hidden="true">→</span>
    </a>
    <a class="button-text" href="mailto:hello@andresilva.cc">
      <span>hello@andresilva.cc</span><span class="button-text__arrow" aria-hidden="true">→</span>
    </a>
  </div>
  <p class="cv-note">// resume.pdf — full work history + contact</p>
</section>
```

```css
.cta-pair { display: flex; flex-wrap: wrap; align-items: center; gap: var(--s5); }
.cv-note { margin-top: var(--s4); font: 400 var(--t-meta)/1.55 var(--ff-mono); color: var(--lo); letter-spacing: 0.02em; }
```

### 9.3 CAREER (`07-prose-mono-polished-v2-career.html`)

1. `.caption`
2. `header.bar` — active: `[career]`
3. `.page-head` — `<CAREER />` only (no subhead in v2)
4. `<section class="band">` — **v2: no `.sec-head`. The band opens directly with `.career-list`.** No eyebrow, no `Career` h2 (both duplicated the page-head).
5. `.career-list` — closed-frame container of `.role` items (6). MPA role is `.role--current` and includes a live-dot in its date gutter.
6. `footer`

Roles content verified against `static-jobs-repository.tsx`.

**Tech chips per role (v2: canonical brand case).** The chips on each role render the literal strings from the data source's `technologies` array — no lowercasing.

| Role | Chips |
|---|---|
| Senior Engineer @ MPA | TypeScript · Vue.js · Nuxt · React · TanStack · Tailwind CSS · AI SDK |
| Senior Front-end Engineer @ Atlas | JavaScript · TypeScript · Vue.js · Pinia · Nuxt · Laravel · Vitest · Tailwind CSS · Storybook · SEO |
| Front-end Engineering Consultant @ Atlas | JavaScript · TypeScript · Vue.js · Vuex · Nuxt · Laravel · Jest · Tailwind CSS · Lerna · Storybook · SEO |
| Front-end Engineer @ Atlas | JavaScript · Vue.js · Vuex · Laravel · Sass |
| CEO & Co-Founder @ Nuxstep | JavaScript · TypeScript · Vue.js · Vuex · Vuetify · NativeScript · Jest · Node.js · Laravel |
| Software Development Intern @ Grupo Gmaes | JavaScript · Vue.js · Vuex · Sass · Vuetify · Node.js · Laravel · Drupal · Linux · Windows Server |

**Role refs (v2: restored from data).** Two roles in the data carry external `links`. Render a `.role__refs` block (see §6.20) at the bottom of `.role__content` for these two roles only:

| Role | Refs |
|---|---|
| CEO & Co-Founder @ Nuxstep | `// refs:` `NativeScript Spotify →` `https://github.com/Nuxstep/nativescript-plugins/tree/master/packages/nativescript-spotify` |
| Software Development Intern @ Grupo Gmaes | `// refs:` `CONFEA →` `https://www.confea.org.br/novo-portal-institucional-do-confea-traz-recursos-de-acessibilidade` |

The other four roles (MPA, all three Atlas roles) have no `links` in the data and therefore no `.role__refs` block.

**Accent-strong rule applied per role**: max one acc-strong per role; pick the most striking metric. Suggested:
- MPA: none (current role; chips and live-dot already pop).
- Atlas Senior FE Engineer (jan 2024 → apr 2025): `<strong class="acc">74% increase</strong>`.
- Atlas Consultant (mar 2022 → jan 2024): none.
- Atlas FE Engineer (nov 2021 → mar 2022): `<strong class="acc">20 million monthly visits</strong>`.
- Nuxstep CEO: none.
- Grupo Gmaes Intern: none.

### 9.4 PROJECTS (`07-prose-mono-polished-v2-projects.html`)

1. `.caption`
2. `header.bar` — active: `[projects]`
3. `.page-head` — `<PROJECTS />` only (no subhead in v2)
4. `<section class="band">` — Featured
   - eyebrow: `// 01 / featured work`
   - h2: `Featured`
   - `.featured-strip` (asymmetric `2fr 1fr 1fr`) with three cards: Grafex (lead), Calcloak, Injektion. Titles in accent. **v2 revision: every featured card uses one `.link-arrow.pr__visit` per card** (link text = `visit grafex.dev` / `visit calcloak.com` / `view on github` for Injektion). No `[FEATURED]` badge. No multi-link `.pr__links` cluster on featured cards.
5. `<section class="band">` — All
   - eyebrow: `// 02 / all projects`
   - h2: `Projects`
   - `.tech-filter` chip row with `all`, `typescript`, `vue`, `nuxt`, `react`, `node.js`, `tailwind`, `mobile`, `tooling`, `other` (counts derived from data; filter labels stay lowercase).
   - `.grid.grid-frame.grid-frame--3col` of `.pr` cards (18 items, including the 3 featured ones — they appear in BOTH the featured strip and the full grid because the data source treats `featured: true` as an addition flag, not a removal flag). Each card has `data-tech="…"` (canonical case, space-separated; the filter selector uses lowercase tokens because filter chips are lowercase — see Tech-filter contract below).
6. `footer`

Featured ordering and project list verified against `static-projects-repository.ts`. The featured projects in data are: Grafex, Calcloak, Injektion (in that order).

**v2 link-unification per card type:**

| Card type | Component | Markup |
|---|---|---|
| Featured lead (Grafex) | One `.link-arrow.pr__visit` | `<a class="link-arrow pr__visit"><span>visit grafex.dev</span><svg/></a>` |
| Featured secondary (Calcloak, Injektion) | One `.link-arrow.pr__visit` | `<a class="link-arrow pr__visit"><span>visit calcloak.com</span><svg/></a>` / `<a class="link-arrow pr__visit"><span>view on github</span><svg/></a>` |
| All-grid card with one URL | One `.link-arrow` inside `.pr__links` | `<div class="pr__links"><a class="link-arrow"><span>site</span><svg/></a></div>` |
| All-grid card with multiple URLs | Multiple `.link-arrow` inside `.pr__links`, no separators | `<div class="pr__links"><a class="link-arrow"><span>site</span><svg/></a><a class="link-arrow"><span>github</span><svg/></a></div>` |
| All-grid card with no URL (Marketplace Bridge) | `<span class="pr__none">// no public link</span>` |

**Tech-filter contract (v2 update for canonical case).** Each `.pr` carries `data-tech="…"` with the canonical-case tokens (e.g., `data-tech="TypeScript Vue.js Nuxt Tailwind CSS"`). The filter buttons' `data-filter` values are **lowercase** (matching their visible labels). The matching CSS uses a case-insensitive selector via the `i` flag:

```css
.grid-frame--3col[data-active-filter="typescript"] > .pr:not([data-tech*="TypeScript" i]) { display: none; }
.grid-frame--3col[data-active-filter="vue"] > .pr:not([data-tech*="Vue" i]) { display: none; }
.grid-frame--3col[data-active-filter="nuxt"] > .pr:not([data-tech*="Nuxt" i]) { display: none; }
.grid-frame--3col[data-active-filter="react"] > .pr:not([data-tech*="React" i]) { display: none; }
.grid-frame--3col[data-active-filter="node.js"] > .pr:not([data-tech*="Node.js" i]) { display: none; }
.grid-frame--3col[data-active-filter="tailwind"] > .pr:not([data-tech*="Tailwind" i]) { display: none; }
.grid-frame--3col[data-active-filter="mobile"] > .pr:not([data-tech*="NativeScript" i]) { display: none; }
.grid-frame--3col[data-active-filter="tooling"] > .pr:not([data-tech*="tooling" i]) { display: none; }
.grid-frame--3col[data-active-filter="other"] > .pr:not([data-tech*="other" i]) { display: none; }
```

For `tooling` and `other` chips (which don't map to a real tech name), append the literal token `tooling` or `other` to the card's `data-tech` so the selector matches. Example: `data-tech="Shell Script tooling"` for the Firebird shell-script project.

### 9.5 ARTICLES (`07-prose-mono-polished-v2-articles.html`)

1. `.caption`
2. `header.bar` — active: `[articles]`
3. `.page-head` — `<ARTICLES />` only (no subhead in v2)
4. `<section class="band">` — **v2: no `.sec-head`. The band opens directly with `.list`.** No eyebrow, no `Articles` h2 (both duplicated the page-head; same logic as Career).
5. `.list` — vertical list of `.art` items (2 known). 240×(stretch-to-body-height) illustration container; SVG centered with `object-fit: contain` (see §6.19 v2 revision).
6. `footer`

**Article tags (v2: canonical brand case).** The chips on each article render in canonical case: `Vue.js`, `Nuxt`, `Web Performance` (or `webperf` if rendered as a non-brand tag — keep lowercase for non-brand tags only). For Article 1 (74% performance): `Vue.js · Nuxt · webperf`. For Article 2 (Rendering Modes Explained): `Vue.js · Nuxt`. Non-brand semantic tags (e.g., `webperf`, `tutorial`) stay lowercase because they're not brand names.

---

## 10. Animation

The home hero animates: the ASCII plasma (`#v1-ascii`, see §6.27) loops at ~20fps via `requestAnimationFrame` with a 50ms throttle, advancing `PL_t` by 0.075 per frame. This is restored from `05-prose-mono-refined-home.html` and is part of the site's identity.

In-page animations on every page:
- `.name__cursor` blink (1.06s) — Home only
- `.status-dot--live` pulse (2.4s) — Home hero + Career MPA role
- All hover transitions (`var(--d-fast) var(--ease-out)` = 120ms)

In-page animations on Home only:
- ASCII plasma loop (~20fps, RAF-driven)

Reduced-motion: stops all animations and transitions; plasma renders one static frame at `t=0`.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 11. Article illustrations

Two illustrations:
- 11.1 **Performance gauge** (Article 1: "How I Achieved a 74% Performance Increase on a Page") — see prior 05/06 description (200×120 viewBox: semicircular gauge from x=30,y=95 to x=170,y=95, radius 70; tick marks; needle to (148,48); "74%" readout at (100,108); rule-2 tick at y=105 spans 20→180). Same markup as 05.
- 11.2 **Rendering modes** (Article 2: "Rendering Modes Explained") — replaces the prior "v2 → v3 migration" sketch which was illustrating a non-existent article. Suggested concept: 200×120 viewBox; three small framed rectangles (each ~40×30) labelled `SSR`, `SSG`, `CSR` arranged horizontally at y=40, with a thin connecting bracket above, and `// rendering` annotation at y=105 (mono 9px `--lo`). Strokes: rectangles 1.2 in `--accent`, bracket 1 in `--accent-mute`. If the implementing agent prefers, fall back to the §11 default illustration ("// post" / DEV.TO placeholder) — that's also acceptable for Article 2.

For both, scale up the SVG to fit the new 240×144 illustration container by adjusting the wrapping element only — the `viewBox` stays 200×120 and the SVG fills the container with `width:100% height:100%`.

**Future illustrations**: 200×120 viewBox; primary subject in `--accent` 1.2–1.5 stroke; secondary subject in `--accent-mute` 1.2; bottom annotation in `--lo` 9px mono with `// PREFIX`. No fills except SVG dots and arrowhead caps.

**Default illustration** (used when an article has no custom SVG):

```html
<svg viewBox="0 0 200 120" fill="none">
  <rect x="20" y="20" width="160" height="80" stroke="var(--accent-mute)" stroke-width="1.2"/>
  <text x="100" y="60" text-anchor="middle" font-family="JetBrains Mono" font-size="14" font-weight="600" fill="var(--accent)">// post</text>
  <text x="100" y="100" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="var(--lo)" letter-spacing=".1em">DEV.TO</text>
</svg>
```

---

## 12. Mobile / responsive rules

Five named breakpoints.

### 12.1 ≤ 1100px
- `.grid-frame--3col` (Featured-grid via `.featured-strip` and All Projects via `.grid-frame--3col`) collapses to 2 columns. The lead card spans full width.
- Article illustration container scales fluid.

### 12.2 ≤ 1000px
- About `.about-grid` collapses to one column. Photo moves above prose (via `order: -1` on `.photo`); gap shrinks `--s12 → --s6`.
- About `.grid-frame--2col` (Education and Facts) collapses to one column.

### 12.3 ≤ 900px
- Home `.hero` collapses to one column. Mark column moves below text with a top rule + `--s4` padding-top.
- Articles `.art` keeps `240px 1fr` until 760px.

### 12.4 ≤ 760px
- `.shell` padding `--s8 → --s4`.
- `.caption` padding `--s2 --s8 → --s2 --s4`.
- `nav.primary a` padding `--s2 --s3 → --s2`.
- Home `h1.name` `--t-display 56 → 40px`; cursor 14×40 → 10×28.
- Home `.row` collapses to one column with `--s2` gap and `--s3` vertical padding.
- Career `.role` collapses to one column. Date gutter becomes a horizontal strip with `--s3 --s4` padding.
- Articles `.art` collapses fully to one column. Illustration becomes full-width (max 320).
- About `.cta-pair` stacks vertical with `--s3` gap.

### 12.5 ≤ 700px
- All grid-frame variants collapse to one column.
- `.tech-filter` becomes horizontally scrollable: `flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none;` to keep all chips reachable.

### 12.6 Touch targets
- Nav items 32px min-height.
- `.button-cta` 36px+ height (var(--s3)*2 + 12px text + line-height = 12+12+12 = 36 + line-height air ≈ 38).
- `.tech-filter__chip` minimum 28px (4*2 + 11 + line-height ≈ 28; on touch, increase to `padding: 6px var(--s2)` via media query).

```css
@media (hover: none) and (pointer: coarse) {
  .tech-filter__chip { padding: 6px var(--s2); }
}
```

---

## 13. Accessibility

### 13.1 Contrast
Computed in §2.2. All body and primary text combinations meet AA (most are AAA). `--lo` on `--surface-2` is restricted to ≥`--t-meta` (12px) for non-essential metadata.

### 13.2 Focus styles
```css
a:focus-visible,
button:focus-visible,
[tabindex]:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: 0;
}
.row:focus-visible { outline-offset: -2px; }
```

### 13.3 Reduced motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 13.4 ARIA patterns
- `<nav class="primary" aria-label="Primary">`.
- Active nav: `aria-current="page"`. Brackets in label are content.
- Logo wordmark: SVG `aria-hidden="true"`.
- Status dots: `aria-hidden="true"` if purely decorative; `aria-label="currently employed"` on the hero role-line dot (because there it's load-bearing meaning).
- `.hero-plasma` is `<aside aria-hidden="true">` — purely decorative; not announced.
- Article illustrations: `aria-hidden="true"` on the wrapping `<a>` if linked; else `aria-hidden="true"` on the `<svg>`.
- `.row`: the `<a>` wraps the row body. `aria-label` mirrors title text where the row body is too telegraphic to be read alone (apply pragmatically).
- `.tech-filter`: `<div role="toolbar" aria-label="Filter by stack">`. Each `<button>` inside carries `aria-pressed="true|false"`.
- All `target="_blank"` anchors carry `rel="noopener noreferrer"`.
- Skip link: `<a class="skip-link" href="#main">Skip to main</a>` at the top of `<body>`. Visually hidden until focused.

```css
.skip-link {
  position: absolute; left: -9999px; top: 0;
  background: var(--accent); color: var(--bg); padding: var(--s2) var(--s3);
  font: 600 var(--t-micro)/1.5 var(--ff-mono); letter-spacing: 0.1em; text-transform: uppercase;
}
.skip-link:focus { left: var(--s4); top: var(--s2); z-index: 100; outline: 2px solid var(--accent-hi); outline-offset: 2px; }
```

### 13.5 Keyboard
- Tab order is natural document order.
- Tech-filter buttons are real `<button>` — keyboard-operable.
- `.row` is a real `<a>` — Enter/Space follows the link.
- Photo hover effect is decorative; not exposed to keyboard (no `:focus-within` reveal).

---

## 14. Implementation notes

1. Token block ordering: colors → fonts → font sizes → spacing → durations → easings → component sizing → prose widths → photo filter.
2. One stylesheet per page is acceptable for static review files. They share ~95% of CSS.
3. Single Google Fonts `<link>` for both families (JetBrains Mono + VT323). No Inter.
4. `body` global: `font-feature-settings: "tnum" 1, "liga" 0;`.
5. `<strong>` defaults to `--hi` weight 600. Accent variant via `class="acc"`.
6. Cursor blink frequency is 1.06s. Keep.
7. Photo: `../public/me.jpg`.
8. Resume: `/resume.pdf` (placeholder if asset doesn't exist).
9. **Home has JS**: ASCII plasma loop (see §6.27 for the full script). About / Career / Articles have no JavaScript. **Projects has JS** — the tech-filter requires a click handler:

```html
<script>
  const filter = document.querySelector('.tech-filter');
  const grid = document.querySelector('.grid-frame--3col');
  filter?.addEventListener('click', (e) => {
    const chip = e.target.closest('.tech-filter__chip');
    if (!chip) return;
    filter.querySelectorAll('.tech-filter__chip').forEach(c => {
      c.classList.toggle('is-active', c === chip);
      c.setAttribute('aria-pressed', String(c === chip));
    });
    grid.dataset.activeFilter = chip.dataset.filter;
  });
</script>
```

```css
.grid-frame--3col[data-active-filter]:not([data-active-filter="all"]) > .pr { display: none; }
.grid-frame--3col[data-active-filter] > .pr[data-tech-active] { display: flex; }
```

Helper at script load time: when the filter changes, set `data-tech-active` on cards whose `data-tech` includes the active filter token. (Simpler: skip the helper — use a single attribute selector.)

**v2 revision: case-insensitive selectors.** `data-tech` is canonical-case (`TypeScript`, `Vue.js`, `Nuxt`); `data-filter` is lowercase. Use `[data-tech*="…" i]` (substring + case-insensitive flag), not `[data-tech~="…"]` (whole-word, case-sensitive). The substring selector handles `Vue.js` matching the `vue` filter; the `i` flag handles `TypeScript` matching the `typescript` filter.

```css
.grid-frame--3col[data-active-filter="vue"] > .pr:not([data-tech*="Vue" i]) { display: none; }
.grid-frame--3col[data-active-filter="typescript"] > .pr:not([data-tech*="TypeScript" i]) { display: none; }
.grid-frame--3col[data-active-filter="nuxt"] > .pr:not([data-tech*="Nuxt" i]) { display: none; }
.grid-frame--3col[data-active-filter="react"] > .pr:not([data-tech*="React" i]) { display: none; }
.grid-frame--3col[data-active-filter="node.js"] > .pr:not([data-tech*="Node.js" i]) { display: none; }
.grid-frame--3col[data-active-filter="tailwind"] > .pr:not([data-tech*="Tailwind" i]) { display: none; }
.grid-frame--3col[data-active-filter="mobile"] > .pr:not([data-tech*="NativeScript" i]) { display: none; }
.grid-frame--3col[data-active-filter="tooling"] > .pr:not([data-tech*="tooling" i]) { display: none; }
.grid-frame--3col[data-active-filter="other"] > .pr:not([data-tech*="other" i]) { display: none; }
```

Acceptable for static HTML deliverable: hard-code the rules per filter token.

10. Cross-browser: tested combinations — modern Chrome/Safari/Firefox.

---

## 15. Caption + title text per page

| Page | Caption | Page title | Subhead | Eyebrow(s) |
|---|---|---|---|---|
| Home | `// PROSE-MONO.POLISHED.V2  /  REDESIGN OPTION 07/07  /  HOME` | (no page-head; hero name "André Silva" is the H1) | (none — pitch + CTA serve the role) | `// 01 / who`, `// 02 / recent` |
| About | `// PROSE-MONO.POLISHED.V2  /  REDESIGN OPTION 07/07  /  ABOUT` | `<ABOUT />` | (none — v2 removed) | `// 01 / in my own words`, `// 02 / where I studied`, `// 03 / quick facts`, `// 04 / get in touch` |
| Career | `// PROSE-MONO.POLISHED.V2  /  REDESIGN OPTION 07/07  /  CAREER` | `<CAREER />` | (none — v2 removed) | (none — v2 removed; `.sec-head` is omitted entirely) |
| Projects | `// PROSE-MONO.POLISHED.V2  /  REDESIGN OPTION 07/07  /  PROJECTS` | `<PROJECTS />` | (none — v2 removed) | `// 01 / featured work`, `// 02 / all projects` |
| Articles | `// PROSE-MONO.POLISHED.V2  /  REDESIGN OPTION 07/07  /  ARTICLES` | `<ARTICLES />` | (none — v2 removed) | (none — v2 removed; `.sec-head` is omitted entirely) |

H2s per page:

| Page | H2s |
|---|---|
| Home | Bio, Latest |
| About | Bio, Education, Facts, Get in touch |
| Career | (none — v2 removed) |
| Projects | Featured, Projects |
| Articles | (none — v2 removed) |

**Caption strip whitespace.** The visible double-space between caption segments (`// PROSE-MONO.POLISHED.V2  /  REDESIGN OPTION 07/07  /  HOME`) is **two literal space characters** in the HTML source — NOT `&nbsp;`. The caption uses `font-family: var(--ff-mono)`, so two spaces render as two fixed-width gaps at the desired width. Do not substitute `&nbsp;` (which would prevent line wrapping at narrow widths and changes copy-paste behavior).

**Page-head H1 classes.** The `<NAME />` page title in `.page-head` MUST carry both the `.title` class AND the `.t-pixel` class:

```html
<h1 class="title t-pixel"><span class="brace">&lt;</span>ABOUT<span class="brace"> /&gt;</span></h1>
```

`.title` provides typography (`--t-h1` size, accent color, display family); `.t-pixel` enforces `-webkit-font-smoothing: none` and `image-rendering: pixelated` for the bitmap-VT323 feel. Omitting `.t-pixel` makes the title render anti-aliased and breaks visual consistency with the hero name on Home. This rule is non-negotiable.

**Article 240px gutter consistency.** The article entry grid is `.art { grid-template-columns: 240px 1fr; }` and `.art__illo { width: 240px; }`. Earlier prose in the spec accidentally read "200 1fr" — the canonical width is **240px** (illustration container + grid track), matching the breakpoint behavior at `≤ 760px` where `.art__illo` becomes full-width with `aspect-ratio: 240/144`.

**Tech-filter chip set ↔ project tags contract (v2 revision).** Every `.pr` card on the Projects page MUST carry a `data-tech="…"` attribute whose space-separated tokens are the **canonical-case** technology names from the data source (`TypeScript`, `Vue.js`, `Nuxt`, `React`, `Node.js`, `Tailwind CSS`, `NativeScript`, …). The filter button labels and `data-filter` values are **lowercase** (`typescript`, `vue`, `nuxt`, …) because filter labels are not brand renders. The matching CSS uses case-insensitive substring selectors (`[data-tech*="…" i]`) so the lowercase filter values still match canonical-case data-tech tokens. See §9.4 for the full filter rule set.

The canonical filter chip set is:

```
all · typescript · vue · nuxt · react · node.js · tailwind · mobile · tooling · other
```

If a project doesn't naturally match any of `typescript / vue / nuxt / react / node.js / tailwind / mobile`, append the literal token `tooling` (for CLI / build / dev-tooling work) or `other` (for everything else) to its `data-tech` so the "all" filter is the only filter that needs to show every card. The `all` chip's count equals the total number of `.pr` cards. Each other chip's count equals the number of cards whose `data-tech` matches that filter (case-insensitive substring).

Counts must be hand-verified at build time and inserted as `<span class="tech-filter__count">N</span>`.

**Canonical dev.to article URLs** (verified 2026-05; pin these in the Articles page anchor `href` attributes):

| # | Title | URL |
|---|---|---|
| 1 | How I Achieved a 74% Performance Increase on a Page | `https://dev.to/andresilva-cc/how-i-achieved-a-74-performance-increase-on-a-page-2gjm` |
| 2 | Rendering Modes Explained | `https://dev.to/andresilva-cc/rendering-modes-explained-2711` |

The user's task brief originally listed the Article 1 URL with a `-2nf` slug suffix; that URL returns HTTP 404. The correct slug is `-2gjm` (verified live).

The user's task brief also referenced a "Migrating Pages to Nuxt 3" article. **No such article exists** on the dev.to profile as of verification. The two published articles are the ones above. The Home "Latest" rows and the Articles page entries must reflect this — substitute "Rendering Modes Explained" wherever a Nuxt-3-migration entry appeared in earlier drafts.

The trailing `link-arrow` on each `.art` (`<a class="link-arrow art__lnk" href="…">read on dev.to →</a>`) and the `.art__title` `<a>` both point to the canonical URL above. Author profile fallback (`https://dev.to/andresilva-cc`) is used only as the footer link target; never as an article href.

---

## 16. The full `:root` block

```css
:root {
  /* Colors */
  --bg: #0B0F0A;
  --surface-2: #0F1410;
  --rule: #1F2A1F;
  --rule-2: #2C3A2C;
  --hi: #D7E5D0;
  --mid: #9DAA95;
  --lo: #6F7E68;
  --accent: #C8FF3D;
  --accent-hi: #DEFF6B;
  --accent-mute: #3D4F18;
  --accent-tint: rgba(200,255,61,0.08);
  --black: #000000;

  /* Fonts */
  --ff-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  --ff-display: 'VT323', 'JetBrains Mono', ui-monospace, monospace;

  /* Type scale */
  --t-display: 56px;
  --t-h1: 28px;
  --t-h2: 18px;
  --t-h3: 16px;
  --t-body: 14px;
  --t-meta: 12px;
  --t-micro: 11px;

  /* Spacing scale */
  --s1: 4px;
  --s2: 8px;
  --s3: 12px;
  --s4: 16px;
  --s5: 20px;
  --s6: 24px;
  --s8: 32px;
  --s10: 40px;
  --s12: 48px;
  --s16: 64px;
  --s20: 80px;

  /* Component sizing */
  --tag-pad-y: 2px;

  /* Prose widths */
  --prose-w-narrow: 56ch;
  --prose-w: 68ch;
  --prose-w-card: 38ch;

  /* Photo (v2 revision: retuned to land on actual --accent lime, was hue-rotate(40deg) saturate(2)) */
  --photo-filter: grayscale(1) sepia(0.5) hue-rotate(60deg) saturate(3.2) contrast(1.05) brightness(0.92);

  /* Motion */
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --d-fast: 120ms;
  --d-mod: 200ms;
}
```

---

## 17. Build checklist

- [ ] Identical `:root` block on every page.
- [ ] Identical caption strip text format (only the page suffix changes).
- [ ] Identical header markup (only `aria-current` and the bracketed item change).
- [ ] `aria-current="page"` AND `[brackets]` on the active nav item; nav active is `--accent` weight 500 (not 600).
- [ ] Same wordmark SVG on every page; **no border around the wordmark**.
- [ ] Same footer markup on every page; footer rule on every page.
- [ ] No `border-radius` other than `0` anywhere.
- [ ] All text size values use one of the seven `--t-*` tokens.
- [ ] Hero on Home has SINGLE CTA — `hello@andresilva.cc →` (`.button-text`). No `Read more →` button.
- [ ] About has Get-in-touch band combining Resume + Email (the pair is preserved here).
- [ ] No `>` heading-arrow before any h2.
- [ ] Eyebrow numbering: numbered on Home, About, and Projects (multi-section pages). Career and Articles render NO `.sec-head` at all.
- [ ] No `[CAREER]` / `[PROJECT]` / `[ARTICLE]` kind tags on Home rows.
- [ ] No `[FEATURED]` / `[DEGREE]` / `[SPECIALIZATION]` badges anywhere.
- [ ] Home rows are `<a>` wrapping the row body; entire row is the click target.
- [ ] Home Latest renders exactly 3 rows (1 career + 1 project + 1 article). The second article (`Rendering Modes Explained`) does NOT appear on Home.
- [ ] Featured projects use `.featured-strip` (asymmetric `2fr 1fr 1fr`); All Projects use `.grid-frame--3col`.
- [ ] Each featured card has exactly one `.link-arrow.pr__visit`. No `.pr__links` cluster on featured cards.
- [ ] All Projects grid card links use `.link-arrow` inside `.pr__links`. No middle-dot separators (`.pr__sep` is removed).
- [ ] Projects page has `.tech-filter` chip row above the All grid, with working filter behavior.
- [ ] About bio uses `.about-prose` with `--ff-mono` at `--t-body` 14/1.65, max-width 60ch. No sans family anywhere on any page.
- [ ] Google Fonts `<link>` imports JetBrains Mono + VT323 only — no Inter.
- [ ] Home hero right column renders the ASCII plasma (`#v1-ascii` `<pre>`), with the JS loop at end of `<body>`.
- [ ] Photo on About is 200×260 in the LEFT column on desktop. Wrapped in `.photo-wrap` with the CRT scanline `::after` overlay.
- [ ] Photo filter is the v2 lime-tuned filter: `grayscale(1) sepia(0.5) hue-rotate(60deg) saturate(3.2) contrast(1.05) brightness(0.92)`.
- [ ] Photo hover clears both the filter AND the scanline overlay (transition 0.4s).
- [ ] Live status dot on hero role-line and on Career MPA role.
- [ ] At most one `<strong class="acc">` per visible viewport.
- [ ] All `target="_blank"` anchors carry `rel="noopener noreferrer"`.
- [ ] Skip link present at the top of `<body>`.
- [ ] Reduced-motion media query.
- [ ] No inline `style="..."` on production elements.
- [ ] Tech chips (`.tag--chip`) render in canonical brand case (`TypeScript`, `Vue.js`, `Node.js`, `Tailwind CSS`, …).
- [ ] Tech-filter chips (`.tech-filter__chip`) render lowercase (filter labels are not brand renders).
- [ ] Article entry uses 2-column `240 1fr` grid; date is in the meta line (not a separate column).
- [ ] Article entry has `align-items: stretch`; `.art__illo` `height: 100%` with SVG `object-fit: contain` so the illustration container balances against body height (no dead bottom space).
- [ ] Article meta line: `date · 4 min · 11 ♥ · 1 comment` (no `dev.to` label here; `dev.to` is in the trailing link-arrow).
- [ ] Page-head does NOT render `.page-head__sub` (subhead removed in v2 from About / Career / Projects / Articles).
- [ ] Career role refs: Nuxstep includes `// refs: NativeScript Spotify →`; Grupo Gmaes includes `// refs: CONFEA →`. No other roles render `.role__refs`.

---

## 18. Out of scope (deliberate non-changes)

- Visual identity (palette, typeface for mono surfaces, photo filter chain) — unchanged.
- Layout topology (caption strip → header → page sections → footer) — unchanged.
- Page count (5) — unchanged.
- Project list, role list, article list, education content — unchanged.
- "No rounded corners ever" decision — unchanged.
- ASCII plasma source — kept verbatim from `05-prose-mono-refined-home.html`; rendered in the Home hero's right column. Not changed.

This direction is a **decisive polish**, not a reskin. The visual identity stays; weak UX patterns and decorative noise are replaced with real affordances and tighter hierarchy.
