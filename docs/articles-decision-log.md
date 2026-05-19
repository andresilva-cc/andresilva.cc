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
  preset: flow
  params: pathCount=70&pathLength=140&trail=0.97&speed=2&noiseScale=0.8&ramp=block&palette=mono
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
  preset: flow                # one of: flow | donut | (extensible)
  params: pathCount=70&pathLength=140&trail=0.97&speed=2&noiseScale=0.8&ramp=block&palette=mono
```

The `preset` field is decorative — currently every stipple config begins with `p=flow` or `p=donut`. Keeping it explicit at the top level (rather than parsing the `params` string) makes the schema human-scanable and lets us validate the preset name later if we want.

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
      preset: s.enum(['flow', 'donut']),
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

`scripts/og/generate.mjs` iterates `src/content/articles/*/index.mdx`, parses frontmatter, invokes grafex's API with the article-specific template (see §6.3), and writes `public/og/articles/<slug>.png`. The script is idempotent — it skips slugs whose PNG already exists and whose mtime is newer than the source MDX. This makes local dev fast and Vercel builds not-pathologically-slow.

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

## 17. Risks and the one decision that could come back

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Grafex/webkit breaks on a future Vercel build-image update | Medium | High (broken deploys) | Escape hatch (§6.1.2) is one env var away. The fix is documented and pre-decided. |
| Velite stops being actively maintained | Low | Medium | The data is plain MDX on disk; replacing Velite is a one-file rewrite (the pipeline) and a schema migration. No content lock-in. |
| MDX bundle size grows as articles ship | Low | Low | Each article is statically rendered; the body's JS surface is whatever components the article uses, no global bundle penalty. |
| `canonical_url` on dev.to doesn't carry SEO authority | Medium | Medium | This is the rationale for the migration, not a bug — accept that some dev.to-acquired Google ranking will dilute. The strategy doc treats syndication as discovery, not SEO equivalence. |
| The `coverArt` schema can't express future stipple variants | Low | Low | The `preset` field is `enum` — extend it. The schema migration is purely additive. |

The decision that could come back is **MDX vs Markdown**. If we ship a year of articles without ever using a custom in-prose component besides `<YouTube>`, the MDX overhead (the build pipeline, the typed components map, the `@mdx-js/mdx` dep) was paid for one thing that doesn't strictly need it. The escape route is: keep Velite, swap the `s.mdx()` field to `s.markdown()`. Authors don't notice; the page renderer changes from `<article.body />` to `<div dangerouslySetInnerHTML={{ __html: article.html }} />` (or a remark-react renderer). It's a one-day refactor. The optionality is preserved.

---
