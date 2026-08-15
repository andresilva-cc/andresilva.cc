# Resume — Technologies list (recommendation)

Recommendation only. Nothing here is applied to source. Approve or overrule item by item.

Two notes on the inputs:

- The current array holds **29** items, not 30 (`static-resume-repository.ts:117-121`).
- **Revised for chip rendering.** This list now renders as outlined `<Tag>` chips in a
  2-row, 34pt slot (`docs/resume-print-theme.md` §6.4), matching how `/career` renders
  technologies via `role-card.tsx:57-61`. The earlier version of this doc optimised for
  an inline comma-separated line and budgeted characters. Chips change the currency to
  **slots**, and that changes three conclusions — see §5 and §6.

---

## 1. Recommended list

```
TypeScript · JavaScript · Vue.js · Nuxt · React · Next.js · Node.js · TanStack · Pinia ·
Tailwind CSS · Storybook · Vitest · Docker · WebSockets · AI SDK
```

**15 chips.** Inside the 12–16 budget in §6.4, at the top of it.

### Ordering principle

**Descending centrality, with adjacency doing the grouping — and the tail reserved for
the newest work.**

Three things follow from it:

1. **The first five chips must carry the whole positioning.** A scanner reads left to
   right and stops early. `TypeScript · JavaScript · Vue.js · Nuxt · React` alone says
   "TypeScript engineer, Vue/Nuxt deep, React too" — which is exactly the positioning.
2. **Related items sit adjacent** so the block reads as a stack, not a bag:
   language pair → Vue line → React line → runtime → data/state → styling → quality → infra → AI.
3. **The last chip is the second-most-read position.** Closing on `Docker · WebSockets ·
   AI SDK` ends on infrastructure and current AI work — the two things that back the
   "works end-to-end" claim in the summary and signal where you are heading.

Alphabetical ordering was rejected: it spends the strongest position in the document on
whatever happens to start with "A".

### Where the row breaks, and why that is lucky

At 8pt a chip is `(chars × 4.8) + 9pt` with a 4pt gap, against a 527.24pt column.
This ordering wraps after **Tailwind CSS**:

| Row | Chips | Width used | Fill |
|---|---|---|---|
| 1 | TypeScript → Tailwind CSS (10 chips) | 481.2pt | 91% |
| 2 | Storybook → AI SDK (5 chips) | 238.6pt | 45% |

The wrap lands on a real semantic seam: row 1 is **what he builds with** (languages,
frameworks, runtime, state, styling); row 2 is **how he ships and where he is going**
(quality tooling, infrastructure, AI). The chip form gets the benefit of grouping for
free, without labels — which is most of the answer to §5.

The break position is approximate — Chromium's measured advance widths will not match
the 4.8pt/char model exactly, and the wrap may move by one chip. Nothing in the ordering
depends on it landing precisely there.

### The slot is not the binding constraint

Two rows hold **~20 chips** at this average width, and page 2 of the layout is only
24.5% full (§5.3) — a third row is affordable if it were ever wanted. So the cut from
29 to 15 is **a positioning decision, not a space decision**. Every item has to earn its
slot on merit; "it fits" is not a reason to keep anything.

---

## 2. Justification per item kept

| # | Item | Why it stays |
|---|---|---|
| 1 | **TypeScript** | Primary language, every role since 2018, and the single highest-value ATS string on the page. |
| 2 | **JavaScript** | Kept purely for literal ATS matching — a large share of postings say "JavaScript" and never "TypeScript". Adjacent to TypeScript it reads as normal, not as padding. |
| 3 | **Vue.js** | Deepest specialization: present in all six roles across nine years. The strongest claim you own. |
| 4 | **Nuxt** | The real differentiator — SSR/meta-framework depth, four roles, plus a published article. Few Vue engineers can claim Nuxt at this depth. |
| 5 | **React** | Current at MPA and in Calcloak; doubles your addressable role pool without diluting the Vue claim. |
| 6 | **Next.js** | Backs React with a meta-framework; evidenced by this site and Infinity. Heavily searched by recruiters. |
| 7 | **Node.js** | The backend half of "end-to-end" — Grafex, Calcloak, EyesUp, the Nuvemshop/SkyHub integration. |
| 8 | **TanStack** | Current MPA stack; signals a modern React data layer rather than 2019 React. |
| 9 | **Pinia** | Current Vue state management, and the freshness marker that stops a nine-year Vue history reading as Vue 2. |
| 10 | **Tailwind CSS** | Styling layer on every role and project since 2022. Common posting requirement. The widest chip on the page at 66.6pt — and worth it. |
| 11 | **Storybook** | Design-system / component-library credential, backed by the Lerna component-library bullet. Two roles. |
| 12 | **Vitest** | Proof you test, in the current-generation runner. One test-runner slot is enough. |
| 13 | **Docker** | **New.** Already in a bullet ("preview orchestration server using WebSockets and Docker") but absent from the keyword block. Biggest ATS gap in the current list and the clearest infrastructure proof. |
| 14 | **WebSockets** | **New.** In the MPA bullet and in EyesUp. Real-time/architecture signal that separates you from UI-only frontend engineers. |
| 15 | **AI SDK** | Current, differentiating, and matches `/career`. Ends the block on the newest work. |

---

## 3. Cut list

Overrule any of these individually. Nothing is lost from the record — `/career` keeps the
full per-job technology lists, where each item stays contextualized to the era it belongs
to.

**One thing chips change here:** a bordered box gives every item identical visual weight.
In a comma-separated line, `Adobe XD` was a cheap word buried mid-sentence. As a chip it
is the same size and the same shape as `TypeScript`. Weak items cost more under this
rendering than they did under the old one, so the cuts below get *stronger*, not weaker.

### Superseded — same slot, older era (keeping both dates you)

| Cut | Reason |
|---|---|
| **Vuex** | Same slot as Pinia. Listing both reads as "still on Vue 2". Vue postings that say Vuex almost always say "Vuex/Pinia". |
| **Jest** | Same slot as Vitest. See the swap note in §7 — this is the one supersession with a real counter-argument. |
| **Sass** | Superseded by Tailwind in every project since 2022. |
| **Lerna** | Monorepo tooling now largely displaced by Turborepo/Nx/pnpm workspaces. Listing it dates the knowledge; the component-library bullet already names it in context, which is the right place. |

### Works against the positioning

| Cut | Reason |
|---|---|
| **PHP** | Pulls the whole block toward a stack you have deliberately moved past. Highest-drag item after Windows Server. |
| **Laravel** | The hard call — it appears in four roles including Atlas through Apr 2025, so it is not stale. But it fails the first test: you would decline a Laravel-centred role. It stays visible in `/career` where the context makes it read as "worked in a Laravel monolith", not "wants Laravel work". Re-add only if you would genuinely take Laravel backend work. |
| **Drupal** | Legacy CMS, one internship, 2017. Actively generates inbound from CMS agencies. |
| **Windows Server** | Direct contradiction of the senior-product-engineer read. Also the widest chip in the whole 29 (14 chars = 76.2pt) — it would buy the most visual space for the least signal. Strong cut. |
| **NativeScript** | Niche and fading; 2018–2021. The Spotify plugin is a great story — it belongs in `/projects` and the bullet, not the skills block. |

### Discontinued or low signal for an engineering reader

| Cut | Reason |
|---|---|
| **Adobe XD** | Adobe discontinued the product. Listing it dates the resume by itself. |
| **Figma** | Design literacy is assumed for a senior frontend engineer; near-zero ATS value on engineering roles. |
| **Shell Script** | Not a term recruiters search. Reads as filler beside TypeScript; Docker and Linux work already imply it. |
| **Linux** | Only evidenced in the 2017–2018 internship. Fails the recency test — Docker carries the same signal with better currency. |
| **Express** | No per-job evidence; all usage is personal/older projects. Node.js covers it. Cheapest re-add if you target Node backend roles. |
| **SQL** | Absent from every per-job list; table stakes at senior level, so it adds little. Re-add as **PostgreSQL** (not bare "SQL") if you go after backend-weighted roles. |
| **Vuetify** | Vue 2-era UI kit. Signals the wrong decade. |

---

## 4. Present in `/career` or `/projects`, missing from the resume

| Candidate | Source | Verdict |
|---|---|---|
| **Docker** | MPA bullet | **Add.** See §2. The single most valuable missing keyword. |
| **WebSockets** | MPA bullet, EyesUp | **Add.** Backs the architecture claim. |
| **SEO** | Both Atlas roles in `/career` | **Hold out of the list — your call.** Real ATS value (Vue/Nuxt postings routinely pair "SSR, SEO") and legitimately yours via the performance work. Two arguments against, one of them new. It fails the "would you take a role centred on this" test; and under chip rendering it is the one item that is not a technology, so a bordered `SEO` sitting beside a bordered `TypeScript` visibly breaks the set's category. Better home: fold it into the Atlas performance bullet — *"Worked on performance, SEO, and DX improvements as part of the platform team"* — where the context reads as technical SEO. Add to the block only if you are actively targeting Nuxt/SSR roles. |
| **Python** | Infinity | **Hold.** Single-project evidence, and it invites Python/ML inbound you would likely decline. Add only if you decide to court AI-engineering roles explicitly — in which case add Python and keep AI SDK. |
| **LiveKit**, **Gemini** | Infinity | **No.** LiveKit is niche and WebSockets is its general form; Gemini is a vendor name that will read as stale within a year. |
| **Sequelize**, **Konva**, **Vuesax**, **Pug.js** | older projects | **No.** Project-level detail; `/projects` is the right surface. |

**On the AI/agent work specifically:** the tech block is the wrong lever. `AI SDK` is
enough there. The high-leverage move is one clause in the summary — *"Currently building
multi-agent systems and developer tooling"* — because "multi-agent", "AI assistant" and
"devtools" already appear in your MPA bullets and a human reader weighs the summary far
more heavily than the keyword block. This also matches the LinkedIn headline decision:
AI framed as current method, anchored to substance.

**Cross-surface note (not part of this recommendation, but worth a follow-up):** if Docker
and WebSockets go on the resume, the MPA entry in `static-jobs-repository.tsx:19` should
gain them too. Both surfaces now render the same chip component, so a reader moving from
`/career` to the PDF will compare them directly, and a divergence reads as carelessness.

---

## 5. Grouping vs flat — flat, and the chip form settles it

**Flat, unlabeled, one wrapped chip strip.**

Under the old inline rendering the argument was that labels cost ~40 characters of chrome.
Under chips the argument is stronger and more structural:

- **There is no room for labels inside the slot.** 34pt is exactly two 15pt chip rows plus
  a 4pt gap. Group headings need either their own lines — turning a 34pt block into ~90pt
  and three sub-strips — or inline label chips, which look like technologies and are
  therefore worse than no labels. Page 2 has the vertical slack to absorb it (§5.3: 24.5%
  full), so this is a reader-cost argument, not an arithmetic one. It still holds: a
  skimming recruiter gets a small table where they wanted a glance.
- **The wrap already groups.** The break after `Tailwind CSS` splits stack from
  tooling/infra/AI on its own. Named groups would restate what the layout already says.
- **The taxonomy calls are ambiguous and invite argument.** Nuxt is a framework *and* a
  platform; Tailwind is neither a language nor a framework; TanStack is a library family.
  A reader who notices the seam stops reading the block and starts auditing it.
- **Consistency with `/career`.** `role-card.tsx` renders flat unlabeled chip strips.
  Introducing a taxonomy only on the PDF makes the two surfaces disagree about what this
  component is for.
- **ATS parsing:** chips extract left-to-right, row by row, space-separated, in DOM order
  (§6.4). This is already safe. Grouping would inject label tokens into that stream —
  `Languages TypeScript JavaScript Frameworks Vue.js` — which is noise in a keyword match.

Grouping starts to earn its keep past ~20 items or when the list spans genuinely distinct
domains (cloud, data, mobile). Neither applies here.

---

## 6. What chip rendering changed from the previous version of this doc

Recorded so the reasoning is auditable rather than silently revised.

| Conclusion | Then (inline) | Now (chips) |
|---|---|---|
| Budget currency | Characters (139 of ~257) | **Slots.** 15 of ~20 available. Character length only matters for `Tailwind CSS` and `Windows Server`. |
| Recommended count | 15 | **15** — unchanged. The count was already set by signal, not by space, which is why the rendering change did not move it. |
| `Windows Server` cut | Positioning | Positioning **and** cost — it is the widest chip in the set. |
| `SEO` | Fails the "would you take this role" test | Same, plus it visibly breaks category as a bordered box among technologies. |
| Grouping | Rejected on character cost | Rejected on slot geometry, reader cost, and `/career` consistency. |
| Half-empty second row | N/A | Expected and fine — `/career` chip strips wrap ragged too. Do not pad it with weak items to square it off. |

---

## 7. Dials, if you want a different count

| Dial | Result | When it is right |
|---|---|---|
| **Trim to 14** | Cut `Storybook` | Frees the slot with the weakest signal-per-slot ratio if you want one re-add without going to 16. |
| **Trim to 12** | Cut `Storybook`, `Vitest`, `Pinia` | Maximum density. Costs the design-system credential, the testing signal, and the Vue-3 freshness marker — a real price. Row 2 drops to two chips, which looks thin. |
| `Vitest` → `Jest` | 15 | If you weight React-heavy US roles: Jest is still the more literally searched string in those postings. Keeping Vitest is the better *positioning* call; Jest is the better *ATS* call. Listing both is the one redundancy I would tolerate as a hedge — it costs one slot, taking you to 16. |
| `TanStack` → `TanStack Query` | 15 | More precise and the exact string recruiters search. Costs 29pt of width and diverges from `/career`, which says `TanStack`. |
| `AI SDK` → `Vercel AI SDK` | 15 | Unambiguous to a human — and a bordered `AI SDK` standing alone is more ambiguous than it was inside a comma list. But it vendor-locks the claim and diverges from `/career`. If you want it, change both surfaces together. |
| `+ SEO` | 16 | See §4. Still inside the §6.4 budget. |
| `+ Laravel` | 16 | Only if you would take Laravel work. Place it adjacent to `Node.js`, never beside `PHP`. |

---

## 8. If approved

`public/resume.pdf` is a committed manual export — after editing
`static-resume-repository.ts`, run `pnpm resume:pdf` and commit the PDF, or the shipped
file drifts out of sync.
