---
name: rss-infra
description: RSS feed infrastructure — shared helpers, renderer generalization, absolutize signature, layout alternates
metadata:
  type: project
---

## Shared helpers (`src/lib/rss-helpers.ts`)

`escapeXml`, `toRfc822`, and `escapeCdata` live in a shared module. Both RSS route handlers import from there — never inline or duplicate these.

## Renderer pattern (`src/lib/rss-renderer.tsx`)

`renderEntryHtml(body, basePath)` is the shared core. `renderArticleHtml` and `renderNoteHtml` are thin wrappers that pass `articles/<slug>` and `notes/<slug>` as `basePath`. Do NOT copy-paste the function body for a new collection — add another wrapper.

## absolutize signature (`src/lib/rss-url.ts`)

`absolutize(url, basePath)` — second arg is a FULL path segment like `articles/<slug>` or `notes/<slug>`, NOT just the slug. All RSS component factories (`makeFigureRss`, `makeImageMdxRss`, `makeInlineLinkRss`) accept `basePath` and pass it through.

## `use react-dom/server.edge`, not `react-dom/server`

Next.js / Turbopack rejects `react-dom/server` in route handlers. Always use `react-dom/server.edge`.

## layout.tsx alternates — multiple RSS feeds

The Next.js Metadata API accepts an array for multiple entries of the same MIME type:
```ts
alternates: {
  types: {
    'application/rss+xml': [
      { url: '/articles/rss.xml', title: 'André Silva — Articles' },
      { url: '/notes/rss.xml', title: 'André Silva — Notes' },
    ],
  },
},
```

## Notes feed specifics

- `<description>` for notes: use `n.title` (no `summary` field on Note)
- `<category>`: emit `<category>{n.kind}</category>` — single category per item
- Feed title: `André Silva — Notes`
- Feed description: `Short notes, TILs, takes, and code snippets from André Silva.`
