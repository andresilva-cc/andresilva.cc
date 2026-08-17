---
name: feedback-verify-against-source
description: Verify remembered design-system rules against the actual component source before speccing them, and cite file:line — André checks
metadata:
  type: feedback
---

Before speccing anything that claims "the site does X," **read the component
source and cite file:line**. Do not spec from memory or from
`docs/design-system.md` alone.

**Why:** On the resume spec (2026-08-15) I proposed a `·` separator for the
contact row citing a remembered middle-dot rule. André pushed back — *"not sure
if dots separating it since the website has none"* — and asked for verification
against the code. He was right and I was wrong: `src/components/footer.tsx:11–18`
uses spacing only for rows of discrete links. Worse, reading the source turned up
a second condition my memory had dropped entirely — `article-card.tsx:35–36` caps
`·` at *1–3 atoms that never wrap* — which also invalidated the technologies-list
treatment I had already spec'd. Two errors in one section, both from trusting a
summary over the source.

It happened again in the next round (same spec): I specced a 6pt section-mark
square and UPPERCASE section headings. Neither exists on the site —
`src/components/section-head.tsx:34–41` is eyebrow + h2 + `border-b border-rule`,
and every section title in `src/app/(site)/about/page.tsx:41,100,113,125` is
sentence case. André caught both. Three of my four errors across two rounds were
*inventions I could have disproved by opening one component file.*

The design-system doc says this itself in its opening line: *"the **source of
truth** is the shipped code in `src/`."* Treat the doc and my memory as indexes
that point at files, not as the rule.

**How to apply:**
- Any spec sentence of the form "matching the site's X" needs a `path:line`
  citation in the deliverable, not just in my head.
- Component block comments in this repo are unusually detailed and often carry
  the *constraint* (atom counts, wrap behaviour, casing ownership) that the docs
  summarise away. Read them.
- When a remembered rule and the source disagree, the source wins and the memory
  gets corrected in the same turn.
- André reviews specs closely and flags things unprompted — including things he
  labels as minor (*"not that bad since it is used only as a decoration, but just
  saying"*). Treat those as real defects; he is usually pointing at something
  structural. See [[patterns-light-substrate]] for the lime-on-white case where
  his aside exposed a wrong rule in the spec.

See [[patterns-middot-separator]] for the corrected `·` rule.
