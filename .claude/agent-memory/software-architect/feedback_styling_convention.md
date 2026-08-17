---
name: styling-convention-utilities-first
description: André's rule — Tailwind utilities in JSX, raw CSS only where a utility genuinely can't reach; large hand-written class blocks get converted
metadata:
  type: feedback
---

Style with Tailwind utilities written inline in the JSX. Raw CSS in `globals.css` has to earn its place by being genuinely unreachable from a utility — an ancestor selector (`body:has(> main.resume)`), or a document-level at-rule (`@page`). A large hand-authored class block is not an acceptable alternative even when it is well-organized.

**Why:** the `/resume` route first shipped with a ~260-line `.resume` BEM block in `globals.css`; André had it converted to inline utilities. The site's whole styling contract is "tokens + utilities", and a parallel class system on one route is a second vocabulary to maintain.

**How to apply:** when documenting or designing a new surface, assume utilities. If something truly needs CSS, name *why* no utility can express it, right next to the rule. The same instinct applies one level up: repeated raw values want a `@theme` token, not an arbitrary-value habit — `/resume`'s print palette, type scale (`--text-resume-*`, role-named with paired line-heights), and font alias were all promoted into the theme block, leaving only true one-off print geometry (sheet width, `pt` rhythm, hairline widths) inline. That residue is the one sanctioned arbitrary-value exception in the codebase, bounded to that route and documented in `docs/architecture.md` §5. See [[architecture-doc-conventions]].
