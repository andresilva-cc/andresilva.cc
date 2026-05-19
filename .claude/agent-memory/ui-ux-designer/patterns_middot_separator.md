---
name: patterns-middot-separator
description: The middle-dot `·` in andresilva.cc is a within-a-value conjunction, not a between-links separator — rule for when to use it
metadata:
  type: feedback
---

In the andresilva.cc design system, the middle dot `·` separates **items within a single field value** — it is NOT a separator between sibling navigational links.

**Why:** Established usage is consistent. /about Facts rows render `·` inside one `<Text>`/`<span>` value (`Portuguese (native) · English (fluent)`, `agentic workflows · user-facing AI · developer tooling`). The article-card meta strip renders `·` inside one inline `<Text>` element (`2025.02.13 · 4 min · 11 ♥ · 1 comment`). In every case the dots are inline content of ONE semantic unit, joining fragments that belong to the same statement. None of the dot-separated items is independently clickable or a separate destination.

**How to apply:**
- Rows of sibling navigational links (header nav, footer social links) get **spacing only, no separators** — they are discrete `<li>`/`<a>` destinations, structurally a nav row. The header `<nav>` already uses spacing-only; the footer should match.
- Inline lists of fragments inside one field value get `·`.
- Test: if each item is its own `<li>`+`<a>` going to a different destination → nav row, no dots. If the items are fragments of one value rendered in one element → inline list, use `·`.
- A separator that has to be deleted at one breakpoint to keep a layout from breaking (as the footer dots were dropped on mobile) is decoration the layout tolerates, not a load-bearing element — remove it rather than engineer around it.

Decided 2026-05-19: footer social links should drop the `·` dots entirely, becoming spacing-separated like the header nav.
