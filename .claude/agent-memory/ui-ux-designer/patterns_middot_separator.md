---
name: patterns-middot-separator
description: The middle-dot `·` in andresilva.cc is a within-a-value conjunction, not a between-links separator — rule for when to use it
metadata:
  type: feedback
---

In the andresilva.cc design system, the middle dot `·` separates **items within a single field value** — it is NOT a separator between sibling navigational links.

**Why:** Established usage is consistent. /about Facts rows render `·` inside one `<Text>`/`<span>` value (`Portuguese (native) · English (fluent)`, `agentic workflows · user-facing AI · developer tooling`). The article-card meta strip renders `·` inside one inline `<Text>` element (`2025.02.13 · 4 min · 11 ♥ · 1 comment`). In every case the dots are inline content of ONE semantic unit, joining fragments that belong to the same statement. None of the dot-separated items is independently clickable or a separate destination.

**There is a SECOND condition I missed once and nearly shipped wrong** (caught 2026-08-15 on the resume spec). `src/components/article-card.tsx:35–36` states it exactly: *"The `·` separator is reserved for within-a-value short conjunctions (**1–3 atoms, never wraps**); sibling-link lists like tags use chips."*

So `·` requires BOTH: (a) within one value, AND (b) **1–3 atoms that fit on one line**. A 12-item skill list passes (a) and fails (b) — it must be **chips** (`src/components/tag.tsx`), which is how `src/components/role-card.tsx:57–61` renders career technologies. Always check the atom count and the wrap, not just the value/link distinction.

**How to apply:**
- Rows of sibling navigational links (header nav, footer social links) get **spacing only, no separators** — they are discrete `<li>`/`<a>` destinations, structurally a nav row. Confirmed in `src/components/footer.tsx:11–18` and rendered with `gap-x-4` at `footer.tsx:31`.
- Inline lists of fragments inside one field value get `·` — **if ≤3 atoms and it cannot wrap**.
- More than 3 atoms, or anything that wraps → **chips**, not dots.
- Test: if each item is its own `<li>`+`<a>` going to a different destination → nav row, no dots. If the items are fragments of one value rendered in one element → count the atoms and check the wrap before reaching for `·`.
- Precedent worth remembering: `src/app/(site)/about/page.tsx:18,23` dot-joins institution to dates in one value (`'UNIVALI · 2015 — 2019'`). Date ranges across the site use an **em dash** `—` with spaces, not an en dash (`src/components/role-card.tsx:10`).
- A separator that has to be deleted at one breakpoint to keep a layout from breaking (as the footer dots were dropped on mobile) is decoration the layout tolerates, not a load-bearing element — remove it rather than engineer around it.

Decided 2026-05-19: footer social links should drop the `·` dots entirely, becoming spacing-separated like the header nav.
