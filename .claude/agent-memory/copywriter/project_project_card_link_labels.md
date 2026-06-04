---
name: project-project-card-link-labels
description: /projects card link-label conventions — generic vs repo-name labels, ordering, and the internal-article `read` label
metadata:
  type: project
---

/projects cards (`static-projects-repository.ts`) carry a `links` array of `{ name, url }`. The `name` is the visible label (lowercase, no period, arrow `→` follows via render).

**Label rules:**
- Single-link projects use lowercase generics: `site` (live URL) or `github` (repo).
- Multi-repo projects use canonical descriptive labels: `eyesup-web`, `eyesup-sync`, `oac-api`, `teseu-app`, `NativeScript Spotify`, `CONFEA`, etc.
- **Internal on-site article links use `read`** (lowercase, no period). RESERVED label, not yet shipped. Conceded 2026-06-04: do NOT add the Rendering Modes Demo → `/articles/rendering-modes-explained` link yet — one instance is an exception, not a convention, and the reverse article→demo link already carries the relationship. Revisit the `read` cross-link when 3+ projects have tied articles (then it's a real feature). When that happens, this `read` spec applies.

**Why `read`:** existing labels name the action/destination (`site`, `github`) — not the thing. `read` matches that verb register and rhymes with the articles-page `read on dev.to`. Rejected: `article`/`writeup`/`explained` (name the thing), `the article` (carries an article word, off terse-mono register). No "on dev.to" tail because the route is internal.

**Ordering:** `site` before `github`; external destinations before internal. Internal `read` (same-tab next/link) goes LAST — it's the odd-one-out vs the external new-tab `site`/`github`.

**How to apply:** when adding a link to a project card, pick the generic/repo/`read` label per above, keep ordering external→internal. If shipped, document the `read` convention in copy-guide §7 (Projects). See [[project-project-card-descriptions]].
