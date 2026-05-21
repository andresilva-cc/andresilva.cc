# Articles — Decision log

> Historical record of the decisions behind migrating `/articles` from a Forem-fetched feed to file-system content authored in the repo. The site becomes the canonical home; dev.to becomes a syndicated mirror with `canonical_url` pointing back. Scope is articles only — the **notes** section is acknowledged at the end but not designed here.
>
> This is a **decision log**, not a living architecture spec — it captures the rationale at the point the decisions were made. The "what is" snapshot lives in [`docs/architecture.md`](./architecture.md), which gets updated during implementation (see §15) once the work ships, not now. Read this alongside [`docs/design-system.md`](./design-system.md) (the visual vocabulary); the strategy doc backing the change is `indie-brain/knowledge/content-language-strategy-bilingual-creator.md`. This log parallels [`docs/redesign-log.md`](./redesign-log.md) in role.

---

## 1. What's changing in one paragraph

`ForemArticlesRepository` and `src/api/forem.ts` go away. A new `LocalArticlesRepository` reads MDX files from the repo at build time, returning the same `Article` shape the rest of the app depends on (plus new fields — `slug`, `summary`, `bodyMdx`, `coverArt`). A new dynamic route `/articles/[slug]` renders the article body. OG images are generated at build time by **grafex** into `public/og/articles/<slug>.png`. RSS, sitemap, and JSON-LD are derived from the same repository. The two existing dev.to posts are migrated into the repo with clean slugs and their dev.to mirrors get `canonical_url` set back to the site. No new runtime dependency, no CMS, no API keys.

---

## 2. Constraints validated

| Decision (from brief) | Verdict | Notes |
|---|---|---|
| Content in repo (not Forem) | Adopt | Single source of truth; canonical-first strategy requires it. |
| OG images at build via grafex | Adopt with a caveat (see §6) | Verify Vercel build container — works in practice, but we ship a fallback path. |
| Drop reactions/comments | Adopt | They were Forem-only metadata. No equivalent on a self-hosted post. |
| Reading time at build from word count | Adopt | 12 lines of code; no dep needed. |
| Summary + tags in frontmatter | Adopt | Tags become useful later when notes ship. |
| No filter UI at launch | Adopt | Tag click-throughs deferred; tags are still rendered as labels on cards. |
| Migrate existing posts + canonical | Adopt | One-time content migration; see §10. |
| Replace `ForemArticlesRepository` outright | Adopt | And remove `axios` + `src/api/forem.ts` — no other caller (verified). |

---

## 3. Open questions resolved

### 3.1 MDX vs plain Markdown — **MDX**

The brief calls for code blocks, tables, images, and **YouTube embeds**. The YouTube embed (and any future callout/"aside" component) is a React component dropped into the prose flow. Plain Markdown can render code blocks and tables fine, but YouTube embeds become either raw HTML (gross) or post-processing string substitution (worse). MDX lets the author write `<YouTube id="..." />` inline and ship that as a Server Component, with zero runtime JS unless the component itself needs it. That capability is load-bearing for the brief.

Stipple-art does **not** appear inside article content. It is layout-level only — rendered by the article page component above the body, sourced from the `coverArt` frontmatter (see §4.2). It is therefore not part of the MDX in-content surface.

The cost of MDX is one extra build step (which we're paying for anyway because of grafex) and slightly heavier TypeScript types in the pipeline. The benefit — composable in-prose components without an HTML escape hatch — is exactly what the design system needs to keep its aesthetic in article bodies.

**Decision: MDX with a small allowlist of in-prose components**: `<YouTube>` only. (Future allowlist candidate: `<Aside>`, a callout component — not in scope but the seam is there.) Standard prose elements (headings, lists, blockquotes, code blocks, tables, links, inline `code`) come from the MDX pipeline's default mapping.

**Alternatives considered**:

- *Plain Markdown + post-render token substitution* — flexible but every new embed type costs a custom shortcode; worst-of-both.
- *MDX everywhere with no allowlist* — exposes the full React surface to the prose layer. Rejected on principle: an author who can `import { something } from '@/components'` inside an article has just coupled article content to private component refactors. The allowlist is explicit and tiny.

### 3.2 Content pipeline library — **Velite**

Three candidates: roll-our-own (`gray-matter` + `remark`/`rehype`), `content-collections`, `velite`. The project's bias toward minimal deps and typed-first content makes the choice straightforward once one fact is checked: **does it work with Next 16 + Turbopack?**

| Option | Typed schemas | Turbopack-compatible | Build mechanism | Verdict |
|---|---|---|---|---|
| **Roll-our-own** | No (would need to write types per shape) | Yes | Script | Skip — re-implementing Velite badly. |
| **content-collections** | Yes (Zod) | **No** — ships a `withContentCollections` webpack plugin; Turbopack doesn't support the webpack plugin API ([Turbopack docs](https://nextjs.org/docs/app/api-reference/turbopack)). | Webpack plugin | Skip — would force us off Turbopack or onto a webpack-only escape hatch. |
| **Velite** | Yes (Zod) | **Yes** — has a plugin-free integration path: call `build()` directly from `next.config.mjs` via top-level await ([Velite Next.js guide](https://velite.js.org/guide/with-nextjs)). Plays nicely with the existing `turbopack.root` config. | Build script (or invoked from `next.config.mjs`) | **Adopt.** |

**Velite** is the right primitive: it parses MDX frontmatter, validates against a Zod schema (typed end-to-end), runs remark/rehype plugins (so `rehype-pretty-code` plugs in for Shiki), and emits a `.velite/` JSON+ESM output that pages import like any other module. No `gray-matter` directly, no DIY ESM dance. The project's existing deps are already typed-first (`@radix-ui/react-slot`, `clsx`) — Velite fits the same philosophy.

Net new dependencies (devDeps):

- `velite` — pipeline.
- `@mdx-js/mdx` (peer of Velite for MDX support).
- `rehype-pretty-code` + `shiki` — syntax highlighting at build time.
- `remark-gfm` — tables, task lists, autolinks (the GFM extensions Markdown alone doesn't get).
- `reading-time` (or 10 LOC inline — see §3.6).

That's four to five new devDeps. None ship at runtime. `axios` goes away. Net dep change is small.

### 3.3 File layout — **co-located folders**

Two shapes:

```
src/content/articles/<slug>.mdx                  (option A — flat)
src/content/articles/<slug>/index.mdx            (option B — folder)
src/content/articles/<slug>/images/diagram.png   (folder, co-located media)
```

Pick **option B**. The first article we migrate ("74% performance increase") had inline images; future articles will too. With folders, images sit next to the prose they belong to; deleting an article cleanly deletes its images. Velite's `pattern` glob supports both shapes equivalently. The cost is one extra path segment in the editor; nothing else changes.

A frontmatter-only article with no images is still one folder with one `index.mdx` inside. That's mildly wasteful but uniformity is worth more than the saved keystrokes — author flow doesn't fork by whether the post has media.

### 3.4 Image handling — **Velite's asset pipeline + `next/image`**

Velite has a [built-in asset handler](https://velite.js.org/) that copies images referenced from MDX (relative paths like `./images/diagram.png`) into `public/static/` and rewrites the URLs in the emitted content, returning width/height metadata in the schema. Authors write `![alt](./images/diagram.png)` in MDX; Velite hashes the file, copies it, and yields a `{ src, width, height, blurDataURL }` object that the MDX renderer maps onto `next/image`.

This sidesteps the chronic problem with co-located MDX images: `next/image` wants statically known dimensions; raw Markdown image syntax doesn't carry them. Velite resolves dimensions at parse time and threads them through.

A custom `img` mapping in the MDX components map converts the Velite-emitted `<img>` into a `<Image>` (Next 16's optimised `next/image`). No author-facing change; the file looks like ordinary Markdown.

### 3.5 Code syntax highlighting — **Shiki via `rehype-pretty-code`**

Shiki tokenises code at build time using real TextMate grammars — output is plain HTML with inline color styles, zero runtime JS, no FOUC. `rehype-pretty-code` is the canonical rehype wrapper around Shiki and integrates cleanly into Velite's rehype plugin chain. Confirmed compatible with Next 16 ([rehype-pretty-code docs](https://rehype-pretty.pages.dev/), which calls out RSC compatibility).

**Theme**: a custom Shiki theme tuned to the brutalist-mono palette. The theme is **designed by the UI/UX Designer** (token-to-scope mapping, accent usage, contrast against `#0B0F0A` / `--surface-2`) — that work is out of scope for this document. The engineer integrates the resulting JSON file: it lives at `src/styles/shiki/brutalist-mono.json` (or wherever the engineer's file-layout instinct lands at integration time) and is loaded into `rehype-pretty-code` via its `theme` option, which accepts a JSON theme directly. The design spec doc the designer produces (`docs/articles-design-spec.md`, or wherever it lands — engineer to check at task pickup) is the source of truth for the theme content.

### 3.6 Reading time — **10-line inline implementation**

The `reading-time` npm package is 200 lines and handles edge cases (CJK characters, etc.). For a personal site shipping in English with prose-shaped content, the implementation is:

```ts
// src/lib/reading-time.ts
const WPM = 220;
export function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WPM));
}
```

Done. Stripping MDX/HTML noise before counting is the only subtlety — Velite gives us the raw markdown via a transform, and we apply this function in the schema's `compute()` step. **Decision**: inline, no dep.

### 3.7 YouTube embeds — **custom MDX component, lazy iframe**

The brief asks for the "least-JS option." Three candidates:

- *Raw `<iframe>`* — zero JS but every iframe loads YouTube's full embed stack (~600 kB of JS) on initial page render. Worst LCP.
- *`lite-youtube-embed` Web Component* — original Paul Irish version; ~5 kB JS that defers the iframe until click. Loads a thumbnail + play button.
- *Hand-rolled Server Component* — render a static thumbnail + play button; replace with the iframe on click via a tiny `'use client'` wrapper.

**Decision**: hand-rolled `<YouTube id="..." />` server component that renders a `<noscript>` `<iframe>` plus a thumbnail-button façade; the click-to-load swap is the only client-side surface. ~30 lines of JSX and ~10 lines of `'use client'` JavaScript. No new dependency, exact aesthetic control (the design system has strong opinions about borders, colors, focus rings — `lite-youtube-embed` would need to be re-skinned anyway), and the implementation is small enough that owning it is cheaper than depending on it.

Thumbnail comes from `https://i.ytimg.com/vi/<id>/hqdefault.jpg`. The component is added to the MDX components allowlist (§3.1).

### 3.8 Slug naming convention — **short, keyword-focused, immutable**

Slugs are 2–5 words, lowercase, hyphenated. No first-person pronouns (`i`, `my`), no helper verbs (`how`, `why`, `what`), no trailing context filler (`on-a-page`, `in-production`). Once published, a slug is immutable; the title can evolve freely.

**Examples:**

- Title: *How I Achieved a 74% Performance Increase on a Page* → slug: `74-percent-performance-increase`
- Not: `how-i-achieved-a-74-percent-performance-increase-on-a-page`

**Why short over 1:1 slugify-the-title:**

1. **Slug as claim, not sentence fragment.** Slugs are read in two places that matter — as link previews in Slack/iMessage/tweets, and as the URL bar. `74-percent-performance-increase` reads as a claim; the long form reads as a sentence with the verb stranded mid-URL. Claims are more shareable.
2. **Title-slug independence is the correct behavior.** Titles get sharpened post-publish (editorial refinement); URLs are addresses and must not move. A 1:1 `slugify(title)` policy *forces* a redirect on every title polish, or *forbids* title polish. Both worse than a stable short slug.
3. **Voice fit.** The site's brutalist-mono register is terse — no editorial chrome elsewhere. Short slugs are the URL equivalent.
4. **Industry pattern.** Stripe (`stripe.com/blog/...`), Fly.io (`fly.io/blog/just-use-postgres`), Vercel use short keyword slugs. Long 1:1 slugs are a WordPress/Medium default, not an engineering-blog convention.
5. **Authoring cost is rounding error.** Picking a 2–5 word slug per article takes ~10 seconds. The "convention beats judgment" counter-argument (always `slugify(title)`) only pays off at publication volumes far above a one-author site.

**Schema guardrail:** `velite.config.ts` enforces `SLUG_MAX_LEN = 60` chars in the transform — structural ceiling, not vibes. `SLUG_RE` continues to enforce lowercase kebab-case.

**Process:** the regex + max-length check fires at content-pipeline build, so a too-long or malformed slug fails CI before deploy. No runtime fallback.

**Rejected alternative — trailing unique identifier (Notion/Linear/dev.to pattern):** appending an opaque ID (`74-percent-performance-x9k2`) so the route resolves even after a rename was considered and rejected. The brutalist-mono register has zero opaque handles anywhere else on the site; an ID-suffix would be the single most machine-looking string on the domain and would flip the URL's read from *claim* back into *database row*, undermining the whole §3.8 rationale. The ID-in-URL pattern is exclusively a platform convention (multi-tenant, user-generated, collision-prone) — high-craft personal engineering blogs (Gwern, Dan Luu, Julia Evans, Simon Willison, ciechanow.ski) all expose clean slugs. The expected lifetime rename count is 1–3 events, which a manual redirect handles in 30 seconds.

**Rename escape hatch:** if a slug ever does need to change, add a `permanent: true` 301 in `next.config.ts` `redirects()`:

```ts
async redirects() {
  return [
    { source: '/articles/old-slug', destination: '/articles/new-slug', permanent: true },
  ];
}
```

301 preserves SEO authority; Google follows the redirect; the old URL keeps resolving for any external backlinks.

**Identity decoupling (do this regardless of any rename ever happening):** route identity is the URL, but *feed* and *structured-data* identity should not be. RSS items use `<guid isPermaLink="false">` with a stable value (e.g. `urn:andresilva-cc:article:<slug-at-publish>` or `<publishedAt>-<original-slug>`); JSON-LD `BlogPosting` uses an `@id` URN, not the canonical URL. This way, a slug rename emits a redirect at the URL layer without rewriting RSS reader databases or breaking JSON-LD continuity. OG image filenames already derive from the folder name (Velite-resolved), so they ride with the slug — acceptable since OG cards are not addressable.

### 3.9 Figure component — **flush image + typographic caption**

Article diagrams render via `<Figure caption="..." number={N} src="./diagram.png" alt="..." width={W} height={H} />` (MDX, self-closing). The visual call (designer, re-evaluated after dropping the defensive "save old purple-card diagrams" constraint):

- No frame, no mat, no card. The image sits flush on `--bg`.
- Container `max-w-[80ch]`, centered — breaks ~15ch wider than prose so the figure reads as "a figure" without needing a border to say so.
- Caption below the image, left-aligned, JetBrains Mono `text-sm`. `Fig. N —` prefix in `--accent` (lime), caption body in `--fg-muted`. Em-dash separator.
- Image inherits `--bg` (transparent), `width: 100%`, `height: auto`, no other treatment.

**Rationale (designer's words):** "A hairline rectangle around a diagram that already has its own whitespace doubles the boundary. Brutalist-mono treats hairlines as structural rules between *zones* — wrapping a figure in one demotes it to 'content card,' which is exactly the editorial-magazine register the system rejects." Type carries the figure signal; the lime `Fig. N` prefix is the single chromatic anchor.

The previous spec (hairline border + 12px `--bg-elevated` mat) was defensive — it existed to neutralize old purple-card diagrams from the dev.to era. André's call: don't retrofit old diagrams; design the figure pattern for new diagrams instead. The mat became ornament fighting the aesthetic.

**Caption unification (2026-05-20):** The `Fig. N — caption` treatment is now powered by a shared `FigureCaption` component consumed by both `<Figure>` and `<YouTube>`. Treating diagrams, screenshots, and video demos identically — they all serve the same role as referenceable, captioned, numbered exhibits in technical articles. The em-dash sits with the caption body (`fg-muted`), not the label — accent is the categorical signal ("Fig. N"), the dash is structural punctuation like the `·` middot in metadata rows. The prior ImageMdx caption path (`![](… "caption")` italic gray) is deprecated; plain `![]()` falls through to a bare flush image (no border, no caption).

### 3.10 Diagram-palette policy + grayscale-on-hover rule

**Diagram palette (drawing-tool policy, not code):** going forward, diagrams are drawn **grayscale + one semantic accent chosen per-diagram** — the accent communicates something specific in *that* diagram (the failure node, the active path, the cache hit branch). Reasons: (1) site redesigns recur, (2) diagrams get reshared in contexts where site palette is gone (RSS, dev.to crossposts, screenshots), (3) figure-as-figure is a stronger mental model than figure-as-page-element. Old diagrams (the dev.to-era purple cards) are grandfathered — no retrofit.

**Grayscale-on-hover treatment (e.g. videos, profile photo) does NOT apply to article figures.** Three tests must all pass to earn the treatment (designer's rule, worth saving for future cases):

1. **Interactive** — surface has a click/tap action (play, navigate, open).
2. **Identity-bearing, not information-bearing** — color is decorative/atmospheric, not load-bearing for comprehension.
3. **Single dominant subject** — image has one focal subject the color refers to.

Videos pass all three (play action, atmospheric framing, hero frame). The profile photo passes all three (mailto/about action, identity, single face). Diagrams fail #1 (no click action) and #2 (the per-diagram accent IS the comprehension signal — hiding it until hover inverts the attention/signal relationship).

---

## 4. Frontmatter schema

```yaml
---
title: How I Achieved a 74% Performance Increase on a Page
summary: Tracking down the long-tail of slow renders on a high-traffic React page — diff in the network panel, win in the flame chart.
publishedAt: 2024-08-14
updatedAt: 2024-09-02       # optional
tags: [React, performance, profiling]
devtoUrl: https://dev.to/andresilva-cc/how-i-achieved-a-74-performance-increase-on-a-page-2gjm   # optional — populated once the syndicated mirror exists
coverArt:                   # optional — per-article stipple-art config; see §4.2
  params: p=flow&pathCount=70&pathLength=140&trail=0.97&speed=2&noiseScale=0.8&ramp=block&palette=mono
---
```

### 4.1 Field-by-field

| Field | Type | Required | Purpose |
|---|---|---|---|
| `title` | string | yes | Used in `<h1>`, `<title>`, OG title, RSS `<title>`, JSON-LD. |
| `summary` | string (max 200 chars, soft) | yes | Cards, `<meta name="description">`, OG description, RSS `<description>`. |
| `publishedAt` | ISO date (`YYYY-MM-DD`) | yes | Sort key, RSS `<pubDate>`, JSON-LD `datePublished`. |
| `updatedAt` | ISO date | no | JSON-LD `dateModified`; if absent, equals `publishedAt`. |
| `tags` | array<string>, brand-cased | yes | Card chips, JSON-LD `keywords`. Empty array is valid. **Casing convention**: brand case, as the tag is conventionally written — `LLMs`, `Rust`, `Next.js`, `TypeScript`. The Tag component renders the string verbatim (it does not transform case); the author is the source of truth. |
| `devtoUrl` | URL | no | Renders as "Also on dev.to" link at article foot; omitted from cards. **Not** echoed into the canonical metadata — this is the *outgoing* link, not the incoming one. |
| `coverArt` | object \| null | no | Per-article stipple config, replacing the keyed map in `src/app/(site)/articles/page.tsx`. See §4.2. |

**Derived fields** (computed by Velite, not in frontmatter):

| Field | Source | Purpose |
|---|---|---|
| `slug` | filename of the containing folder (e.g. `src/content/articles/74-percent-performance-increase/index.mdx` → `74-percent-performance-increase`) | URL segment, also the OG image filename. |
| `wordCount` | parsed markdown body | Reading time input. |
| `readingTime` | `wordCount / 220` (minutes, min 1) | Card meta line and JSON-LD `wordCount` / `timeRequired`. |
| `ogImage` | `/og/articles/<slug>.png` | Resolved at render time; produced by grafex (see §6). |
| `body` | MDX-compiled component | Rendered inside `/articles/[slug]`. |

### 4.2 `coverArt` — preserving the stipple-art config

Today, the per-article stipple config is keyed by dev.to slug in `articles/page.tsx` lines 24–29. This was an explicit redesign anchor and must survive the migration. The new shape lifts the config into frontmatter:

```yaml
coverArt:
  params: p=flow&pathCount=70&pathLength=140&trail=0.97&speed=2&noiseScale=0.8&ramp=block&palette=mono
```

`params` is the full stipple permalink hash consumed by the Web Component via its `config` attribute. Originally included a `preset` field for future validation; removed 2026-05-20 as unused — `params` is the single source the engine consumes via its `config` attribute.

`coverArt` is **optional**. Articles without `coverArt` render as a single-column card (the design system already handles this — see `article-card.tsx` `hasIllustration` branch).

### 4.3 Zod schema (the canonical contract)

This is the contract; the engineer's implementation will translate it:

```ts
const article = defineCollection({
  name: 'Article',
  pattern: 'articles/**/index.mdx',
  schema: s.object({
    title: s.string(),
    summary: s.string().max(200),
    publishedAt: s.isodate(),
    updatedAt: s.isodate().optional(),
    tags: s.array(s.string()),  // brand-cased verbatim (e.g. "LLMs", "Rust", "Next.js"); no case transform
    devtoUrl: s.string().url().optional(),
    coverArt: s.object({
      params: s.string(),
    }).optional(),
    // derived:
    slug: s.path(),                          // folder name
    body: s.mdx(),                           // compiled component
    readingTime: s.custom<number>(),         // computed in transform
  }).transform((data) => ({
    ...data,
    readingTime: computeReadingTime(data.body),
    ogImage: `/og/articles/${data.slug}.png`,
  })),
});
```

### 4.4 Replacing `src/types/article.ts`

The current `Article` interface (39 fields, mostly Forem cruft) becomes Velite's emitted type. Pages import `Article` from `'@/.velite'` (or whatever output path is configured) instead of `'@/types/article'`. The old file is deleted.

The repository interface `ArticlesRepository` slims accordingly:

```ts
export interface ArticlesRepository {
  getAll(): Article[];                   // sync — pulls from build-time JSON
  getBySlug(slug: string): Article | null;
}
```

Note: **sync, not Promise**. There's no async data source anymore. This is a small breaking change for `src/app/(site)/page.tsx` and `src/app/(site)/articles/page.tsx`, which currently `await articlesRepository.getAll()`. The fix is removing the `await` and the `try/catch` (which guarded against the Forem feed being unavailable — no longer a concern).

`getById` is dropped; nothing uses it.

---

## 5. Routing

### 5.1 Route table changes

| Path | File | Rendering | Note |
|---|---|---|---|
| `/articles` | `src/app/(site)/articles/page.tsx` | Server, **static** (was async dynamic) | Lists every published article from `LocalArticlesRepository`. |
| `/articles/[slug]` | `src/app/(site)/articles/[slug]/page.tsx` | Server, **static** via `generateStaticParams` | New route; renders the article body. |
| `/articles/rss.xml` | `src/app/articles/rss.xml/route.ts` | Static Route Handler | RSS feed, generated from the repo. See §8. |

`/articles/[slug]` lives inside the `(site)` route group so it inherits the existing shell (Header / `<main>` / Footer / `max-w-shell` container).

### 5.2 `generateStaticParams`

```ts
export async function generateStaticParams() {
  const { articlesRepository } = getRepositories();
  return articlesRepository.getAll().map(({ slug }) => ({ slug }));
}
```

### 5.3 Old URLs — no redirects needed

Verified: the current site has no `/articles/[slug]` route. Inbound links to old dev.to URLs (`dev.to/...`) continue to land on dev.to. The site never owned a per-article URL, so there's nothing to redirect.

The flip side: dev.to is where existing links live, and migrating doesn't reach those. The dev.to posts need the `canonical_url` field set to the new site URL (manual edit in dev.to's dashboard or via their API); see §10.

### 5.4 Article page composition

The article page is a **separate task for the UI/UX Designer**. This document does not design the page — it only specifies the data the page receives and the routing contract.

Data the page receives:

```ts
const { articlesRepository } = getRepositories();
const article = articlesRepository.getBySlug(params.slug);
if (!article) notFound();
// article: { title, summary, publishedAt, updatedAt?, tags, devtoUrl?,
//            readingTime, ogImage, body, coverArt? }
```

What the page needs to render (from spec, not design):

- The `<PageHead name="ARTICLE TITLE" />` (or a variant — designer's call)
- Meta line: `publishedAt · readingTime · tags`
- Article body via `<article.body />` (the MDX-compiled component)
- Footer affordances: "Also on dev.to" link if `devtoUrl` present; back link to `/articles`

The MDX components map (passed to the body) is owned by this implementation:

```ts
const components = {
  YouTube,            // §3.7 — only custom in-prose component in scope
  img: ImageMdx,      // wraps next/image with Velite-emitted width/height
  pre: PreShiki,      // styled pre for rehype-pretty-code output
  a: InlineLink,      // existing inline-link component
  // h1..h6, ul, ol, blockquote use Tailwind defaults from globals.css
};
```

Note: `<StippleArt>` is **not** in the MDX components map — it's rendered by the page shell above the body, driven by `article.coverArt` (§4.2), and never appears inside article prose.

---

## 6. OG image generation via grafex

### 6.1 The Vercel build environment question (must resolve)

Grafex uses Playwright/WebKit. Its `postinstall` hook in `node_modules/grafex/package.json` runs `npx playwright-core install webkit || true` — the `|| true` is a yellow flag because it silently degrades to "no browser available" if the install fails.

On the **build container** (not runtime serverless functions), Vercel runs Amazon Linux 2 builds with several GB of disk and memory. Playwright's webkit binary is ~190 MB; install succeeds in typical Vercel builds. The serverless-runtime concerns ([ZenRows](https://www.zenrows.com/blog/playwright-vercel), [browserless](https://www.browserless.io/blog/playwright-vercel)) are about *runtime* (50 MB function size limit, memory cap) — they do not apply to the build step.

However, "typical Vercel builds" is not "guaranteed Vercel builds." There are three known failure modes:

1. The `|| true` swallow on grafex's postinstall hides a failed webkit install.
2. Missing system shared libraries can break webkit launch even after the binary installs ([this Stack discussion](https://github.com/microsoft/playwright/issues/2404)). Typically resolved by `npx playwright install-deps webkit`, which requires `sudo` and is not Vercel-friendly.
3. Future Vercel build-image changes could remove libraries grafex's webkit depends on, breaking builds silently (no `--frozen-deps` flag exists for build-image versions).

**Decision**: adopt grafex on Vercel **with an escape hatch**.

#### 6.1.1 Primary path — grafex in `prebuild`

Add a `prebuild` script in `package.json`:

```json
{
  "scripts": {
    "prebuild": "node scripts/og/generate.mjs",
    "build": "next build"
  }
}
```

`scripts/og/generate.mjs` iterates `src/content/articles/*/index.mdx`, parses frontmatter, invokes grafex's API with the article-specific template (see §6.3), and writes `public/og/articles/<slug>.png`. The script is idempotent — it skips slugs whose PNG already exists and whose mtime is newer than the source MDX, the OG template (`tools/og-article.tsx`), and the generator script itself. Changing the template or generator invalidates all PNGs on the next build. This makes local dev fast and Vercel builds not-pathologically-slow.

Vercel runs `pnpm install` (which triggers grafex's postinstall — webkit downloads), then `pnpm build` (which triggers `prebuild` → `node scripts/og/generate.mjs`), then `next build`. End-to-end OG generation is part of the deploy.

#### 6.1.2 Escape hatch — generated PNGs in the repo

If grafex on Vercel breaks (in CI or production), the fallback is:

1. Run `pnpm og:generate` locally before pushing.
2. **Commit `public/og/articles/<slug>.png` to the repo.**
3. Set the `prebuild` script behind an env guard: `if (process.env.SKIP_OG_BUILD) skip; else generate;`.

This is a one-line config change: set `SKIP_OG_BUILD=1` in Vercel envs. Builds become deterministic and don't depend on webkit at all. The cost is one local command in the author's release flow and a few hundred KB per article in git.

The repo is **not yet** in escape-hatch mode. The build-time path is the default, with the escape hatch documented for the day it's needed.

#### 6.1.3 Why not `next/og` (`ImageResponse`)?

`ImageResponse` is fine, but it renders via @vercel/og's lightweight Satori engine — it does not run real CSS, real fonts (in the JetBrains-Mono / VT323 detail), real SVG, or DOM layout. It would force us to re-design the OG card around its limitations (no `position: absolute` with arbitrary z-index, no nested flex with the kind of fine pixel control the brutalist-mono aesthetic uses). Grafex's existing OG template (`tools/og.tsx`) lives in real WebKit — it can ship pixel-perfect what the design system specifies. Switching to ImageResponse would mean rebuilding the OG visual identity from scratch.

Grafex was already chosen for the home OG card (`tools/og.tsx`), so adopting it for article OG cards is a natural extension, not a new dependency.

### 6.2 Template location and invocation

```
tools/og.tsx                    # existing home OG card (unchanged)
tools/og-article.tsx            # NEW — article-specific OG template
scripts/og/generate.mjs         # NEW — iterates articles + invokes grafex
public/og/articles/<slug>.png   # generated output (gitignored unless escape hatch is on)
```

`scripts/og/generate.mjs` is a plain Node ESM module. It imports grafex's API (not the CLI — finer control over per-article props), feeds it `tools/og-article.tsx` plus an `articleProps` object (title, summary, tags, publishedAt), and writes to `public/og/articles/`.

Add `public/og/articles/` to `.gitignore` unless and until the escape hatch is enabled.

### 6.3 Article OG card — data contract and visual brief

This is a brief for the engineer (or designer, if pixel-perfect is wanted), not a spec.

**Data contract** (what `tools/og-article.tsx` receives):

```ts
{
  title: string;        // up to ~80 chars; the template should support 1-3 lines
  summary: string;      // up to ~200 chars; small caption beneath
  tags: string[];       // 0-4 brand-cased tags, render as bracket-chips
  publishedAt: string;  // YYYY.MM.DD, shown as a meta line
  readingTime: number;  // minutes
}
```

**Visual brief**:

- Same canvas as the home OG (`#0B0F0A` background, `1200×630`, 64px margins, JetBrains Mono / VT323).
- Header row: pixel-A glyph + `andresilva.cc` wordmark, identical placement to `tools/og.tsx`.
- 1px `#1F2A1F` rule at `top: 140px` (identical to home).
- Eyebrow comment-tag: `// article`
- Main title (VT323, ~88px, accent `#C8FF3D`), 1–3 lines. The 184px home name size won't fit a multi-line article title — drop to ~88px and let it wrap.
- Beneath title: small mono caption (~22px) with `publishedAt · readingTime · tags` separated by `·`.
- No `summary` rendered in v1 — title + meta line is enough for an OG card. Reserve summary for the JSON-LD / `<meta name="description">` slot.

(The designer can refine — but this is shippable as-is.)

#### Revised 2026-05-20 — designer audit, Path B convergence

The original spec above was the v1 implementation brief. A designer audit on 2026-05-20 identified three issues:

1. The length-based `titleFontSize` conditional (96/80/68px thresholds) failed on a 51-char title that wrapped to 3 lines and collided with the fixed `top:480px` meta line.
2. Tags in the meta line had no truncation — long tag lists overflowed the canvas.
3. The dot-grid SVG motif was a deterministic placeholder that was identical across all articles and didn't differentiate them.

**Resolution — Path B (converge article OG toward standard OG):** The standard `tools/og.tsx` was canonical. The article OG was revised to match its proportions rather than pulling the standard toward a unique article style.

**New spec (implemented 2026-05-20):**

- Wordmark: `22px` (was `24px`, matches standard OG)
- Eyebrow: `// article` at `17px` (was `18px`, matches standard OG scale; lowercase, no number)
- Title: single fixed `80px` VT323, width `1072px` (full bleed = 1200 − 64 − 64), 2-line CSS clamp (`-webkit-line-clamp: 2`). No length-based conditional. (Originally specced at 96px; further refined after rendered output showed a real 51-char title was truncated — 80px gives ~22 mono-ch/line × 2 lines, comfortably fitting ~44–60 chars.)
- Meta: `date · readingTime` only. Tags dropped — they overflowed with no truncation. Both segments render in `#9DAA95` (fg-muted, matching standard OG's bio line). Separator `·` at `#7E8E76`.
- Layout: content cluster (eyebrow + title + meta) in a flex-column container starting at `top:200px` with `gap:24px`. Meta position is relative to the title block, not fixed absolute — a clamped 2-line title can never collide with it.
- Motif: dot-grid SVG deleted entirely. No right-side decoration. `coverArt` prop retained in the `Props` interface (the generator still passes it) but unused visually.

The result shares two accent moments with the standard OG (eyebrow lime + title lime). No third accent zone.

#### Further revised 2026-05-20 — designer final verdicts

1. **Article OG title color: lime → fg.** Title changed from `#C8FF3D` to `#D7E5D0`. The single-accent-per-surface rule wins: the `// article` eyebrow is the categorical signal (what distinguishes this card type), so it keeps accent; the title is the specific piece identifier, rendered in fg. The cross-card asymmetry is correct — standard card accent = name, article card accent = eyebrow.

2. **Article OG layout: top-anchored → bottom-anchored.** Meta baseline pinned at y = 630 − 64 = 566. The content cluster (eyebrow → title → meta) is a flex-column at `bottom: 64px`. Short titles leave breathing room above the eyebrow toward the hairline; 2-line titles extend up toward but never cross it. The clamp still fires for longer titles.

3. **Standard OG: eyebrow `// 00 / personal site` dropped.** The live home page renders no eyebrow above the display name — the standard OG eyebrow was an invention. The display name moves up to `top: 200px` (absorbing the freed ~56px slot); the bio stays at `top: 480px`.

**New standing rule:** OG cards are previews of their destinations, not separate compositions. Each OG variant's fidelity to its live destination beats the OG family's internal consistency.

#### Final 2026-05-20 — Layout convergence

Both cards refactored to a mixed positioning model — absolute for header chrome (wordmark + hairline), flex column for content cluster anchored at `top:200`. Shared baseline makes the two cards feel like one system. Article OG reverted from bottom-anchored back to top:200 (the prior bottom-anchor solved the wrong problem; the standard OG's content distributes from top:200 down, not from bottom up). Standard OG bio pulled closer to the display name (`gap:48` instead of the ~280px void left after the eyebrow drop).

### 6.4 `<meta>` and Twitter Card wiring

In `src/app/(site)/articles/[slug]/page.tsx`:

```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const article = articlesRepository.getBySlug(params.slug);
  if (!article) return {};
  return {
    title: `${article.title} | André Silva`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt ?? article.publishedAt,
      url: `https://andresilva.cc/articles/${article.slug}`,
      images: [{ url: article.ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary,
      images: [article.ogImage],
    },
  };
}
```

---

## 7. JSON-LD `BlogPosting`

Injected as a `<script type="application/ld+json">` in the article page (Server Component, no client overhead):

```ts
const ld = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: article.title,
  description: article.summary,
  datePublished: article.publishedAt,
  dateModified: article.updatedAt ?? article.publishedAt,
  author: { '@type': 'Person', name: 'André Silva', url: 'https://andresilva.cc/about' },
  url: `https://andresilva.cc/articles/${article.slug}`,
  image: `https://andresilva.cc${article.ogImage}`,
  keywords: article.tags.join(', '),
  wordCount: article.wordCount,
  timeRequired: `PT${article.readingTime}M`,
  inLanguage: 'en',
  isPartOf: { '@type': 'Blog', name: 'andresilva.cc/articles' },
};
```

This goes inside the `<article>` element on the page. No npm dependency — it's a plain object serialized with `JSON.stringify`.

---

## 8. RSS

> Updated 2026-05-21: feed now ships full-content `<content:encoded>` alongside the summary `<description>`. See §18.

`src/app/articles/rss.xml/route.ts` — a static Route Handler (no `force-dynamic`, no `revalidate`). Returns an XML body assembled from `articlesRepository.getAll()`:

- `<title>` = article title
- `<link>` = `https://andresilva.cc/articles/<slug>` (the canonical site URL, **not** the dev.to mirror)
- `<description>` = `article.summary`
- `<pubDate>` = `article.publishedAt`
- `<guid isPermaLink="true">` = same as `<link>`

The feed deliberately excludes `devtoUrl` — feed subscribers should land on the canonical post, not the syndicated mirror. Including the dev.to link in the feed would split feed-driven traffic away from the site we're trying to centralize.

`<link rel="alternate" type="application/rss+xml" href="/articles/rss.xml" />` is added to the `<head>` in `src/app/(site)/layout.tsx` (or just the `/articles` index — either works, including in the shared layout makes the feed discoverable from any page).

No new dependency. ~40 lines of code in the route handler.

---

## 9. Sitemap update

`src/app/sitemap.ts` currently hard-codes the five content routes. The new shape iterates articles:

```ts
export default function sitemap(): MetadataRoute.Sitemap {
  const { articlesRepository } = getRepositories();
  const articles = articlesRepository.getAll();
  const staticRoutes = ['', '/about', '/career', '/projects', '/articles'].map((path) => ({
    url: `${BASE_URL}${path}`,
  }));
  const articleRoutes = articles.map((a) => ({
    url: `${BASE_URL}/articles/${a.slug}`,
    lastModified: a.updatedAt ?? a.publishedAt,
  }));
  return [...staticRoutes, ...articleRoutes];
}
```

All articles in `src/content/articles/` are published (drafts are out of scope — see §11), so no filter is needed here.

---

## 10. Content migration plan (existing dev.to posts)

Two existing posts must move into the repo:

1. **"How I Achieved a 74% Performance Increase on a Page"** — current dev.to slug `how-i-achieved-a-74-performance-increase-on-a-page-2gjm`. New slug: `74-percent-performance-increase`.
2. **"Rendering Modes Explained"** — current dev.to slug `rendering-modes-explained-2711`. New slug: `rendering-modes-explained`.

The new slugs are clean (no Forem's trailing four-character hash). The brief confirms these don't need redirects from any old `andresilva.cc/articles/*` path because the site never had such paths.

### 10.1 Sourcing the content

dev.to's API exposes the raw markdown body for any article you own:

```
GET https://dev.to/api/articles/me/published?per_page=50
Authorization: api-key <DEV_TO_API_KEY>
```

The response includes `body_markdown` for each article. This is the cleanest export — no scrape, no copy-paste artefacts. The API key is short-lived; create one in dev.to settings, run the export once, then revoke it. Save the bodies, set the new frontmatter, drop them into `src/content/articles/<new-slug>/index.mdx`, and migrate any cover/inline images by hand into `src/content/articles/<new-slug>/images/`.

### 10.2 Setting the canonical on dev.to

After the site ships with the migrated posts live:

1. Open each dev.to post's editor.
2. Set `canonical_url: https://andresilva.cc/articles/<new-slug>` in the post's frontmatter (dev.to renders Jekyll-style frontmatter inside the editor).
3. Save.

dev.to honours the `canonical_url` field and emits `<link rel="canonical">` pointing at the site. Google's 2025 shift away from `rel=canonical` as a hard signal ([Search Engine Land](https://searchengineland.com/canonicalization-seo-448161)) means it's a hint, not a guarantee — but combined with the site shipping the same content first and being older-than-now in `lastModified`, the canonical signal is strong enough to keep the site as the authoritative copy for search.

### 10.3 `devtoUrl` field in the migrated frontmatter

Once the dev.to mirrors exist (which they do — they were the primary copies until now), set `devtoUrl` in the migrated articles' frontmatter so the page renders an "Also on dev.to" affordance:

```yaml
devtoUrl: https://dev.to/andresilva-cc/how-i-achieved-a-74-performance-increase-on-a-page-2gjm
```

This is the *outgoing* link from the canonical to the mirror. It does **not** affect `<link rel="canonical">` on the site (the site is the canonical; it does not point elsewhere).

---

## 11. Drafts — out of scope

The author's publishing workflow is "commit when ready to publish," so a `draft` mechanism is unused infrastructure. No `draft` frontmatter field, no repository-layer filter, no environment-gated visibility. Every article that lives in `src/content/articles/` is published.

**Future extension** (~10 LOC if the workflow ever changes): add `draft: s.boolean().default(false)` to the Zod schema and a single filter inside `LocalArticlesRepository.getAll()` / `getBySlug()` gated on `process.env.NODE_ENV === 'production'`. Repository-layer enforcement is the right seam because it covers the sitemap, RSS, and home "Latest" row in one place. Not building this now.

---

## 12. Updated data layer diagram

```mermaid
flowchart LR
    Page["App Router Page<br/>(Server Component)"] -->|getRepositories()| Factory["repositories/index.ts"]
    Factory --> Static["Static*Repository<br/>(hard-coded data)"]
    Factory --> Local["LocalArticlesRepository"]
    Local -->|reads at module init| Velite[".velite/<br/>(built MDX + frontmatter)"]
    Velite -.->|build-time| MDX[("src/content/articles/<br/>**/index.mdx")]
    Static --> Page
    Local --> Page
    Page --> HTML[(Rendered HTML)]
```

No arrow leaves the build boundary. No runtime fetches. Compared to the current diagram (where `ForemArticlesRepository → axios → dev.to`), the system shrinks: the only async edge is gone.

---

## 13. Component-level changes (specification, not code)

| Component | Change |
|---|---|
| `article-card.tsx` | Drop `reactions` and `comments` props and their rendering. Card meta line becomes `date · readingTime · tags`. The `url` prop now points to internal `/articles/<slug>` (was external dev.to URL). The ArrowLink label changes from `read on dev.to` to `read article` (designer/copywriter's call on final wording). |
| `article-illustration.tsx` | The `aria-hidden`/`tabIndex={-1}` justification ("two announced links to the same URL") still holds — the title link and the ArrowLink are both internal. The image config now comes from `article.coverArt.params` instead of the keyed map in `articles/page.tsx`. |
| `src/app/(site)/articles/page.tsx` | Lose the `try/catch`. Lose the `articleArt` keyed map (moves to frontmatter). Lose `async`. Read `article.slug` directly (no `getSlug(article.url)` indirection). |
| `src/app/(site)/page.tsx` | Same — no `await`, no try/catch around the articles read. Latest row pulls `articles[0]` (sorted desc by `publishedAt`). |
| `src/types/article.ts` | Delete. Type now comes from Velite's emitted `.velite/types`. |
| `src/api/forem.ts` | Delete. |
| `src/repositories/implementations/forem-articles-repository.ts` | Delete. Replaced by `local-articles-repository.ts`. |
| `src/repositories/articles-repository.ts` | Trim. `getAll()` returns sync `Article[]`. Drop `getById`. |
| `src/repositories/index.ts` | Swap `new ForemArticlesRepository()` for `new LocalArticlesRepository()`. |
| `src/lib/get-slug.ts` | Used only for Forem URLs — verify and delete if nothing else calls it. (Grep before deleting.) |
| `src/lib/format-date.ts` | `formatArticleDate(isoString)` is still useful — keep it. Drop the doc-comment reference to "Forem ISO timestamp". |
| `package.json` | Remove `axios`. Add devDeps: `velite`, `@mdx-js/mdx`, `rehype-pretty-code`, `shiki`, `remark-gfm`. (Already has `grafex`.) Add `prebuild` script for OG generation. |

---

## 14. Notes section — what this design preserves for it (out of scope)

The brief flags a future `/notes` section (short opinions, hot takes, TILs). The architecture here admits it cleanly:

- The Velite pipeline supports multiple collections — adding a `note` collection with its own schema is one config block.
- `src/content/notes/<slug>.mdx` (option A — flat — is fine here; notes are short and rarely have images).
- A sibling `LocalNotesRepository` registered alongside `LocalArticlesRepository`.
- A `/notes` route with `/notes/[slug]` follows the same shape as `/articles/[slug]`.
- The same MDX components map is reusable (notes can embed YouTube, code, stipple-art, same as articles).
- RSS could be merged (`/feed.xml` with `<channel>` items from both, sorted by date) or kept separate (`/notes/rss.xml`). The strategy doc treats notes as own-site-only and not pushed to dev.to — a separate feed is honest about that boundary, but it's a deferred decision.

What this design *deliberately* does not do for notes: prescribe their visual treatment, their card shape, or their interaction. Those are designer/copywriter decisions when the notes task lands.

---

## 15. Edits required to `docs/architecture.md`

The architecture snapshot needs to be updated *after* this work ships. The relevant edits (which the engineer should apply as part of their PR, or a follow-up `docs:` PR):

1. **§1 Overview** — strike "fetched from the Forem (dev.to) API at request time"; replace with "compiled from MDX files in `src/content/` at build time." The phrase "with a single async data source" goes away.
2. **§2 Tech Stack** — remove `axios` row. Update the "HTTP client" row to say "none — no runtime HTTP." Add a row for content pipeline: "Content pipeline: Velite + remark-gfm + rehype-pretty-code (Shiki). MDX collections under `src/content/`."
3. **§3 Project Structure** — add `src/content/articles/<slug>/index.mdx` to the tree. Add `tools/og-article.tsx`, `scripts/og/generate.mjs`. Remove `src/api/forem.ts`. Update the `src/repositories/implementations/` listing.
4. **§4 Routing & Rendering** — `/articles` becomes static (drop "async — fetches Forem"). Add a row for `/articles/[slug]` (static, `generateStaticParams`) and `/articles/rss.xml` (static Route Handler).
5. **§6 Component Vocabulary** — add `<YouTube />`, `<Aside />` (placeholder), and `<ImageMdx />` to the inventory.
6. **§7 Data Layer** — replace the Forem-arrow diagram with the build-time variant from §12 of this doc. Strike "Forem repository — `ForemArticlesRepository`...". The rationale for keeping the repository pattern still holds (i18n seam, async-source seam, testing seam) and should be retained; just update the example to "Local file-system repository — `LocalArticlesRepository` reads pre-built MDX collections."
7. **§10 Third-Party Integrations** — remove the Forem/dev.to row. Optionally note "dev.to is a syndication target (manual workflow), not an integration."
8. **§11 Build, Lint & Dev Tooling** — add `prebuild` script row, mention the `SKIP_OG_BUILD` escape hatch.
9. **§12 Deployment** — strike `FOREM_API_URL` and `FOREM_API_KEY` env vars. Note `SKIP_OG_BUILD` as an optional env var.
10. **§14 What's Deliberately Absent** — remove "No CMS — content is either code-hard-coded or pulled from dev.to" — replace with "No CMS — content is either code-hard-coded or authored as MDX in `src/content/`."

I have **not** applied these edits in this branch. They belong on the implementation PR so the snapshot reflects what ships, not what was planned. The engineer applies them as the last commit before opening the PR.

---

## 16. Ordered task list (for the orchestrator / tech-lead)

These are independent units of work. Each can be its own GitHub Issue, or grouped into 2–3 issues. Recommendation in parentheses.

### T1 — Pipeline scaffolding (Issue 1)

- Add devDeps: `velite`, `@mdx-js/mdx`, `rehype-pretty-code`, `shiki`, `remark-gfm`.
- Add `velite.config.ts` with the `article` collection schema (§4.3).
- Wire Velite into `next.config.mjs` via top-level await (§3.2).
- Add `src/content/articles/` to `.gitignore`-aware structure — actually the directory itself is committed; the Velite output `.velite/` is gitignored.
- Create one placeholder article (`src/content/articles/_hello/index.mdx`) just to verify the pipeline emits `.velite/articles.ts` with the right shape, then delete it.
- **Acceptance**: `pnpm build` succeeds; `.velite/` is emitted; importing the typed `articles` array from `@/.velite` (path TBD by Velite config) typechecks.

### T2 — `LocalArticlesRepository` and interface trim (Issue 1, same as T1)

- Replace `src/repositories/articles-repository.ts` with the slim interface (sync, no `getById`).
- Add `src/repositories/implementations/local-articles-repository.ts` reading from the Velite output.
- Update `src/repositories/index.ts` to instantiate `LocalArticlesRepository`.
- Delete `src/api/forem.ts`, `src/repositories/implementations/forem-articles-repository.ts`, `src/types/article.ts`.
- Remove `axios` from `package.json`. Grep `src/` for any other use first (none expected).
- **Acceptance**: `pnpm build` and `pnpm lint` pass; no references to Forem remain.

### T3 — `/articles` index update (Issue 2)

- Update `src/app/(site)/articles/page.tsx`: drop `async`, drop `try/catch`, drop the `articleArt` keyed map, read `coverArt` from each article instead.
- Update `src/components/article-card.tsx`: drop `reactions` and `comments` props and meta-line segments. Update prop types. Change ArrowLink label to point internally.
- Sort articles by `publishedAt` descending in the repository (so consumers don't re-sort).
- **Acceptance**: `/articles` renders the (currently empty) list from `LocalArticlesRepository`; meta line shows `date · readingTime · tags`; no reactions/comments artefact.

### T4 — `/articles/[slug]` route (Issue 2, same as T3 — they go together)

- Create `src/app/(site)/articles/[slug]/page.tsx`.
- Implement `generateStaticParams` (§5.2) and `generateMetadata` (§6.4).
- Render `<PageHead />`, the meta line, the article body via `<article.body />`, the JSON-LD script, and the optional "Also on dev.to" footer link.
- Wire the MDX components map (`YouTube`, `img → ImageMdx`, `a → InlineLink`, `pre → PreShiki`). `<StippleArt>` is rendered by the page shell from `article.coverArt`, not via the MDX components map.
- **Acceptance**: each migrated article renders at `/articles/<slug>` with code highlighted, images optimized, JSON-LD present in the source, OG `<meta>` tags wired.

### T5 — Custom MDX components: `<YouTube>`, `<ImageMdx>`, `<PreShiki>` (Issue 3)

- Server-rendered `<YouTube id="..." />` with a thin `'use client'` swap on click (§3.7). No external deps; thumbnail from `i.ytimg.com`.
- `<ImageMdx>` wraps `next/image` and consumes Velite's emitted width/height (§3.4).
- `<PreShiki>` — small styled wrapper around the `<pre>` emitted by `rehype-pretty-code`. Adds focus ring, copy button (optional, deferred), border, padding.
- **Sub-task — integrate custom Shiki theme.** Pick up the custom Shiki theme JSON produced by the UI/UX Designer (see `docs/articles-design-spec.md`, or wherever the designer's deliverable lands — engineer to check at task pickup). Place the JSON at `src/styles/shiki/brutalist-mono.json` (adjust if your file-layout instinct says otherwise) and configure `rehype-pretty-code` to load it via its `theme` option. Until the designer's theme exists, ship with `github-dark-dimmed` as a temporary placeholder so the pipeline isn't blocked.
- **Acceptance**: A test article using all three components renders correctly; YouTube is not loading the YouTube iframe before click; images are using next/image; code blocks are syntax-highlighted with no FOUC; the custom Shiki theme JSON is wired in (or the placeholder is in place with a follow-up issue filed).

### T6 — Grafex OG pipeline (Issue 4)

- Create `tools/og-article.tsx` per the brief in §6.3.
- Create `scripts/og/generate.mjs` (idempotent — skip if PNG newer than source).
- Add `prebuild` script in `package.json`.
- Add `SKIP_OG_BUILD` env-guard logic in the generate script (§6.1.2).
- Add `public/og/articles/` to `.gitignore`.
- **Acceptance**: `pnpm build` produces a PNG per published article in `public/og/articles/<slug>.png`; the article's OG/Twitter meta tags reference the right path; visual inspection of one PNG matches the brutalist-mono register.
- **Acceptance guard**: a single Vercel preview build must succeed before merging. If it fails on webkit, enable the escape hatch (commit the PNGs, set `SKIP_OG_BUILD=1`) as a follow-up.

### T7 — RSS feed (Issue 5)

- Create `src/app/articles/rss.xml/route.ts` (§8).
- Add `<link rel="alternate">` in `src/app/(site)/layout.tsx`.
- **Acceptance**: `curl https://andresilva.cc/articles/rss.xml` returns a valid feed; subscribing in a reader works; items link to `andresilva.cc/articles/<slug>` (not dev.to).

### T8 — Sitemap update (Issue 5, same as T7)

- Update `src/app/sitemap.ts` per §9.
- **Acceptance**: `/sitemap.xml` includes one entry per published article with the correct `lastModified`.

### T9 — Content migration (Issue 6)

- Export bodies of the two existing dev.to posts via `GET https://dev.to/api/articles/me/published`.
- Drop into `src/content/articles/74-percent-performance-increase/index.mdx` and `src/content/articles/rendering-modes-explained/index.mdx`.
- Set frontmatter for each (title, summary, publishedAt from dev.to, tags, `devtoUrl`, `coverArt` — port the existing flow/donut configs).
- Migrate inline images to `src/content/articles/<slug>/images/`.
- Manually edit each dev.to post to set `canonical_url: https://andresilva.cc/articles/<new-slug>` (§10.2).
- **Acceptance**: both articles render correctly at their new slugs; canonical headers on dev.to point to the site; OG cards generate cleanly.

### T10 — Update `docs/architecture.md` (Issue 7 — `docs:`)

- Apply the diffs from §15 of this document.
- **Acceptance**: `docs/architecture.md` describes the new world; no Forem references remain.

### Suggested grouping

- **Issue 1**: T1 + T2 (Velite + repository — these are inseparable).
- **Issue 2**: T3 + T4 (index + dynamic route — the user-visible MVP).
- **Issue 3**: T5 (MDX components — can be done in parallel with Issue 2 once the pipeline is up).
- **Issue 4**: T6 (OG pipeline — independent; can ship before or after Issue 2).
- **Issue 5**: T7 + T8 (RSS + sitemap — small, ship together).
- **Issue 6**: T9 (content migration — last; the migrated posts immediately become the visible state).
- **Issue 7**: T10 (`docs:`).

Total: ~7 issues. Could collapse to ~4 (pipeline+repo, route+components+OG, feed+sitemap, migration+docs) if the engineer prefers larger PRs.

---

## 16b. Polish round (post-launch critique)

The following decisions evolved after the article page shipped, based on a structured critique pass.

**Copy button (T5 — previously deferred):** `CopyButton` was listed as "optional, deferred" in §T5. It shipped in the polish round. Rationale: the deferred justification was build-blocking risk; once the route was stable, the cost was two small files (`pre-shiki.tsx` extraction + `copy-button.tsx` client island). Server-side text extraction in `PreShiki` means the client component receives a ready string with no DOM traversal.

**Q2 — Head order:** The original spec (§5.4) showed `<PageHead>` (eyebrow + meta on the same row) as a design deliverable. The polish round separated these into a strict vertical sequence: eyebrow → title → summary → meta strip. The identity cluster (eyebrow/title/summary) is uninterrupted; meta sits below as a soft transition into the body.

**Q4 — `<strong>` / `<b>` backdrop (reversed):** The polish round added an `accent-tint` backdrop (`background-color: var(--color-accent-tint); padding: 0 0.2em`) to `.article-prose strong, .article-prose b`, reasoning that monospace weight-600 gives shallow contrast against weight-400 in muted body prose. **Reversed in the same round**: the backdrop read as `<mark>` semantics (highlighted span) rather than bold emphasis, adding visual chrome that was unnecessary noise. Weight 600 is sufficient for `<strong>` semantics. The article-scope rule was removed entirely; both `<strong>` and `<b>` now fall through to the site-wide `@layer base` rule (broadened from `strong` to `strong, b`). No per-surface treatment.

**Q5 — Title color: accent → fg (reversed):** The original spec (§2.1) set the article `<h1>` title to `text-accent`, reasoning it is the page's primary noun (standing rule 01). The polish round reversed to `text-fg` (no color class): Career, About, and Projects all use fg/white titles; the article page should match site-wide pattern. The eyebrow in `text-accent` plus VT323 at display size already supplies the identity moment — accent on the title itself was redundant color that broke cross-page consistency. The spec's "primary noun rule" was superseded by the stronger "eyebrow-accent + title-fg" pattern established across the rest of the site.

**Q8 — Prose max-width stays at 68ch:** Designer recommended narrowing to 64ch for tighter line length. Kept at 68ch (`--max-width-prose-wide`). Rationale: 64ch would require renaming or adding a token (`prose-narrow-2`), and 68ch reads cleanly at 14px body size. The token value is an implementation detail; the designer can revisit if the next article campaign validates the concern.

**Q11 — Body paragraph color reverted to fg-muted:** The Velite/MDX migration initially set article body `p` and `li` to `--fg` (full-brightness) for "long-form contrast." The polish round reverted to `--fg-muted` (`#9DAA95`). Rationale: `--fg` is reserved for headings and interactive affordances; running text at full brightness created false hierarchy against `h2`/`h3` which share `--fg`. `InlineLink` supplies the lift within body text via its own `text-fg` rule.

**Q1 — Tags in the article-page meta strip (reversed):** The polish round initially kept tags in the article-page meta strip (`date · readingTime · tag1 · tag2 · …`) while removing them from the article-card meta strip — defending the asymmetry on reader-context grounds (triage on the card vs post-read discovery on the article page). **Reversed** after the trailing-middot mobile-wrap fix (`e59b37e`) surfaced a deeper issue: the article meta with up to 9 tags is a sibling-link list dressed up as a within-a-value list. A site-wide audit found three categories of `·` usage: (1) `<title>` strings (never wrap), (2) within-a-value short conjunctions like date ranges and language fluency (1–3 atoms, never wrap problematically), (3) the article-page meta with up-to-9 tags — uniquely long, uniquely wraps, uniquely produces line-leading `·` bullets on narrow viewports. The footer component already articulates the rule in code: `·` is a within-a-value separator, not a list-of-items separator. The article meta violated it. Resolution: meta becomes `date · readingTime` (two atoms, ~25 chars, never wraps); tags live only in the footer chip cluster (already shipped). Card and article page now share one pattern — chips do the tag job on both surfaces. `whitespace-nowrap` atomic wrappers no longer needed since the strip cannot wrap. Same reversal pattern as A2 and B2 (Q4, Q5) — the spec rationale was internally clean, the rendered page disagreed, the screen wins.

**Cover-art rendering — native grid (Option B):** The `<StippleArt>` cover on `/articles/[slug]` initially took explicit `cols={72} rows={28}` so its composition matched the card-thumbnail preview (`/articles` index, which uses `fit="none"` + `fontSize: 6px` and resolves to ~66 × 29 cells). Reversed to native measurement: cover renders at ~180 × 46 cells (no `cols`/`rows` props, `fit="cover"` keeps the 16:7 frame filled, `fontSize: 6px` retained for cell scale). Rationale: the brutalist-mono register's signature is fine-grain ASCII, and the cover is the article's "page-level identity moment" (§3) — letting it render at hero scale with chunky 8–9px cells (the cost of WYSIWYG continuity with the card) trades the signature for a different register (8-bit pixel art). The card→cover relationship is preserved compositionally: same `preset`, same `params`, same palette — different resolution. A thumbnail being a reduced rendering of a larger work is appropriate to the medium, not a continuity break. The home hero's explicit-grid model (`src/components/hero-art.tsx`) doesn't generalize because the hero has no card-preview surface; articles have two surfaces with two jobs (the card identifies, the cover delivers).

---

## 17. Risks and the one decision that could come back

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Grafex/webkit breaks on a future Vercel build-image update | Medium | High (broken deploys) | Escape hatch (§6.1.2) is one env var away. The fix is documented and pre-decided. |
| Velite stops being actively maintained | Low | Medium | The data is plain MDX on disk; replacing Velite is a one-file rewrite (the pipeline) and a schema migration. No content lock-in. |
| MDX bundle size grows as articles ship | Low | Low | Each article is statically rendered; the body's JS surface is whatever components the article uses, no global bundle penalty. |
| `canonical_url` on dev.to doesn't carry SEO authority | Medium | Medium | This is the rationale for the migration, not a bug — accept that some dev.to-acquired Google ranking will dilute. The strategy doc treats syndication as discovery, not SEO equivalence. |
| The `coverArt` schema can't express future stipple variants | Low | Low | `params` is a free-form query string — new variants just use new param keys. No schema change needed. |

The decision that could come back is **MDX vs Markdown**. If we ship a year of articles without ever using a custom in-prose component besides `<YouTube>`, the MDX overhead (the build pipeline, the typed components map, the `@mdx-js/mdx` dep) was paid for one thing that doesn't strictly need it. The escape route is: keep Velite, swap the `s.mdx()` field to `s.markdown()`. Authors don't notice; the page renderer changes from `<article.body />` to `<div dangerouslySetInnerHTML={{ __html: article.html }} />` (or a remark-react renderer). It's a one-day refactor. The optionality is preserved.

---

## 18. RSS full-content rendering

The original §8 spec emitted summary-only items (`<description>` = `article.summary`, no body). This section captures the decisions made on 2026-05-21 to ship full-content items alongside the summary.

### 18.1 Why full-content over summary

The §8 default was summary-only on the grounds that the canonical destination is the site and the feed's job is discovery. A three-agent debate before implementation concluded **GO FULL-CONTENT**: in-reader behaviour is the dominant subscriber experience for engineering blogs (NetNewsWire, Reeder, Feedly all render `<content:encoded>` inline), and a summary-only feed treats subscribers as a worse-served audience than RSS regulars. Canonical authority is preserved by `<link>` and the existing `<link rel="canonical">` on the site — `<content:encoded>` does not move the canonical signal. The summary `<description>` is kept so readers that don't render `content:encoded` (a small minority, mostly preview popovers) still get something useful.

### 18.2 Renderer placement

The body-to-HTML transform lives in **`src/lib/rss-renderer.tsx`** and exports `renderArticleHtml(article)`. It runs the compiled MDX body through React with a feed-specific components map and serializes via `react-dom/server.edge`'s `renderToStaticMarkup`. Also exports `absolutize(url, slug)` for URL rewriting (§18.5).

**Rejected — Velite-derivation (precompute HTML in `.velite/`):** would bloat `.velite/` output for every consumer (sitemap, JSON-LD, page render) when only the RSS route needs HTML. Build-time MDX is already React-compiled; double-rendering at build to also emit a string is waste.

**Rejected — inline in the route handler:** couples the rendering policy to the transport layer, makes the components map untestable in isolation, and the route handler grows past a screen of code.

`src/lib/` is the right seam: framework-agnostic, importable from a Route Handler, isolated from the page-rendering React tree.

### 18.3 Component mapping

The feed uses a separate components map from the page. Page components emit Next-optimized output (`next/image`, client islands, focus rings); feed components emit plain HTML readers can render.

| MDX element | Page renderer | Feed renderer |
|---|---|---|
| `<YouTube id={id} caption={c} />` | Server thumbnail façade + `<noscript>` iframe + client swap | Thumbnail-link (§18.4) |
| `<Figure src caption number />` | `next/image` + `FigureCaption` | `src/components/mdx/rss/figure.tsx` — `makeFigureRss(slug)` factory; absolutizes `src` |
| `img` (bare Markdown image) | `ImageMdx` with `next/image` + width/height | `src/components/mdx/rss/image-mdx.tsx` — `makeImageMdxRss(slug)` factory; bare `<img>` with absolutized `src` and `loading="lazy"` |
| `a` (inline link) | `InlineLink` with safe-href guard + focus ring | `src/components/mdx/rss/inline-link.tsx` — `makeInlineLinkRss(slug)` factory; absolutized `href` |
| `pre` (code block) | `PreShiki` (border, copy button, focus ring) | `src/components/mdx/rss/pre-shiki.tsx` — bare `<pre>` passthrough; `rehype-pretty-code` already emitted highlighted HTML with inline styles |

Factories take `slug` so each component can absolutize URLs against the article's canonical URL. The slug is closed over at render time, not threaded through props.

### 18.4 YouTube convention: thumbnail-link, not iframe

The feed renders `<YouTube>` as:

```html
<figure>
  <a href="https://www.youtube.com/watch?v={id}">
    <img src="https://i.ytimg.com/vi/{id}/hqdefault.jpg" alt="{caption}" loading="lazy" />
  </a>
  <figcaption>Fig. N — {caption}</figcaption>
</figure>
```

No iframe, no embed script. Reasoning: iframes in RSS items are inconsistently supported (some readers strip them, some sandbox them, some render them but block third-party JS), the click-to-load swap the page uses requires JS that readers won't run, and a thumbnail-link gets the reader to YouTube cleanly with universal support. The `Fig. N — caption` treatment matches the page's caption unification rule (§3.9).

### 18.5 Absolute URL rules

Feed items live in a third-party context — readers don't know the article's origin URL. Every relative URL inside the body must be absolutized. `absolutize(url, slug)` handles four cases:

| Input | Output |
|---|---|
| `http://...` / `https://...` | unchanged |
| `/path` | `${SITE_ORIGIN}/path` |
| `#hash` | `${SITE_ORIGIN}/articles/${slug}${hash}` |
| `./image.png` (or any other relative) | resolved against `${SITE_ORIGIN}/articles/${slug}/` |

`SITE_ORIGIN` is the existing constant in `src/lib/config.ts`. Applied uniformly in `figure.tsx`, `image-mdx.tsx`, and `inline-link.tsx`.

### 18.6 Sanitization — deliberately skipped

`rehype-sanitize` was considered and rejected. Reasoning: the input is the author's own MDX, not user-generated content. The realistic threat model — an in-prose component leaking a `<script>` or arbitrary HTML — is handled at the build-time boundary (§18.7) rather than at the output boundary. Running `rehype-sanitize` over the rendered HTML would also strip the inline `style="color:..."` attributes that Shiki emits for syntax highlighting, defeating §18.9.

The real safety boundary is the JSX allowlist enforced at build (§18.7), not output-side stripping. Output-side sanitization is the correct tool when input is untrusted; here it would solve a non-problem and break a feature.

### 18.7 Build-time JSX allowlist enforcement

A regex sweep in `velite.config.ts`'s `.transform()` block fails the build if the MDX source uses a JSX tag outside the allowlist. The allowlist is a shared constant — `src/lib/mdx-jsx-allowlist.ts` exports `MDX_JSX_ALLOWLIST = ['YouTube', 'Figure']` — so the velite check and any future runtime-side check stay aligned.

**Implementation choice — regex over AST walk:** the original architect spec called for a full AST walk via `remark-parse` + `remark-mdx` to enumerate JSX nodes. The implementation chose a regex sweep instead, with the trade-off documented inline in `velite.config.ts`. Rationale: pulling `remark-parse` and `remark-mdx` in as direct deps (they're already transitive via `@mdx-js/mdx`, but adding them as direct deps to script our own walk was rejected) inflates the dep surface for a check that's load-bearing for *one* failure mode (an author types `<Script src="...">` in an article).

The trade-off: regex catches every disallowed JSX tag in prose — the actual failure mode we care about — but doesn't distinguish a JSX-looking string inside an HTML comment or inside a fenced code block from real JSX. In practice this means a `<script>` written *inside a markdown code fence* (where it's deliberately rendered as literal text) would trigger the check. Acceptable: the author can rename the tag in prose examples (`<Script>` → `<​Script>`) or use a backslash escape; the false positive is loud and the failure is build-time, not runtime. A future AST walk can replace the regex without changing the allowlist constant.

### 18.8 RSS 2.0 spec additions

The route handler now emits, in addition to the §8 fields:

- `xmlns:content="http://purl.org/rss/1.0/modules/content/"` on `<rss>` — required to namespace `<content:encoded>`.
- `xmlns:dc="http://purl.org/dc/elements/1.1/"` — required to namespace `<dc:creator>`.
- `xmlns:atom="http://www.w3.org/2005/Atom"` — was already present for `<atom:link rel="self">`.
- `<content:encoded><![CDATA[...]]></content:encoded>` per item, alongside the existing summary `<description>`. CDATA-wrapped; any `]]>` sequence in the rendered HTML is escaped (split into `]]]]><![CDATA[>`) so the CDATA block can't terminate early.
- `<dc:creator>André Silva</dc:creator>` at both channel and item level — `<author>` in RSS 2.0 requires an email-format string; `<dc:creator>` is the convention for a plain name and is what every major reader picks up.
- One `<category>` element per tag on each item.

### 18.9 Shiki inline styles — accepted size cost

`rehype-pretty-code` emits highlighted code as `<span>`s with inline `style="color:#..."` attributes (the brutalist-mono theme is resolved at build, not via CSS classes). The feed renderer preserves these styles. On a code-heavy article this inflates the `<content:encoded>` payload by roughly 30% versus stripping color.

Kept because syntax-highlighted code is the *single* in-prose element where rendered fidelity meaningfully changes comprehension — a paragraph in a sans-serif feed reader still reads the same; a code block in flat gray loses the syntactic cue. This is the one place the feed HTML deviates from "plain semantic HTML that any reader styles itself" and the deviation is deliberate.

### 18.10 Two deviations from the architect spec

1. **`rss-renderer.tsx`, not `.ts`** — the file contains JSX literal (the components map and the render call), so the `.tsx` extension is required. The architect spec's `.ts` was a typo; the substance is unchanged.
2. **`react-dom/server.edge`, not `react-dom/server`** — Next.js App Router under Turbopack blocks the non-edge `react-dom/server` import in Route Handlers (it's flagged as a Node-only module in the edge-aware bundler graph). The `.edge` entry point exposes the same `renderToStaticMarkup` API and is the supported path. No behavioural difference for our use (`renderToStaticMarkup` is sync, no streaming, no hydration markers — exactly what RSS HTML wants).

---
