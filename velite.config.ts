import rehypePrettyCode from 'rehype-pretty-code';
import rehypeUnwrapImages from 'rehype-unwrap-images';
import { defineCollection, defineConfig, s } from 'velite';
import { countWords, readingTime } from './src/lib/reading-time';
import { MDX_JSX_ALLOWLIST } from './src/lib/mdx-jsx-allowlist';
import brutalistMono from './src/styles/shiki/brutalist-mono.json';

const EXCERPT_MAX = 140;

function stripMarkdown(raw: string): string {
  return raw
    .replace(/^---[\s\S]*?---\n?/, '') // strip frontmatter — s.raw() includes it
    .replace(/```[\s\S]*?```/g, '') // fenced code blocks
    .replace(/`([^`\n]*)`/g, '$1') // inline code → its text
    .replace(/^#{1,6}\s+/gm, '') // headings
    .replace(/!\[.*?\]\(.*?\)/g, '') // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links → text
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // bold
    .replace(/([*_])(.*?)\1/g, '$2') // italic
    .replace(/^>\s+/gm, '') // blockquotes
    .replace(/^[-*+]\s+/gm, '') // unordered list markers
    .replace(/^\d+\.\s+/gm, '') // ordered list markers
    .replace(/\s+/g, ' ')
    .trim();
}

function excerptFromRaw(raw: string): string {
  const text = stripMarkdown(raw);
  if (text.length <= EXCERPT_MAX) return text;
  const cut = text.lastIndexOf(' ', EXCERPT_MAX);
  const boundary = cut > 0 ? cut : EXCERPT_MAX;
  return text.slice(0, boundary) + '…';
}

// Regex-based fallback: matches opening tags for PascalCase JSX components.
// Does not parse MDX AST — misses components in comments or code fences, but
// catches real author mistakes cleanly enough for a single-author trust model.
const JSX_COMPONENT_RE = /<([A-Z][A-Za-z0-9]*)/g;

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
const SLUG_MAX_LEN = 60;

const article = defineCollection({
  name: 'Article',
  pattern: 'articles/**/index.mdx',
  schema: s
    .object({
      title: s.string(),
      summary: s.string().max(200),
      publishedAt: s.isodate(),
      updatedAt: s.isodate().optional(),
      tags: s.array(s.string()),
      devtoUrl: s.string().url().optional(),
      coverArt: s
        .object({
          params: s.string(),
        })
        .optional(),
      // derived from the file path — folder name becomes the slug
      slug: s.path(),
      // raw markdown source for reading-time computation
      raw: s.raw(),
      // compiled MDX function-body string
      // GFM (tables, task lists, strikethrough, autolinks) is enabled by
      // Velite's built-in default (gfm: true). No separate remarkGfm import
      // needed — Velite registers it internally before any custom plugins.
      body: s.mdx({
        rehypePlugins: [
          rehypeUnwrapImages,
          [
            rehypePrettyCode,
            {
              theme: brutalistMono,
              keepBackground: false,
            },
          ],
        ],
      }),
    })
    .transform((data) => {
      const slug = data.slug.split('/').pop() ?? data.slug;

      // Verify all PascalCase JSX components in the raw source are on the allowlist.
      // Fails the build early rather than silently omitting components from the RSS feed.
      // Code-fenced and inline-code JSX is ignored — strip both before scanning.
      const rawNoCode = data.raw
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`[^`\n]*`/g, '');
      const seen = new Set<string>();
      let match: RegExpExecArray | null;
      JSX_COMPONENT_RE.lastIndex = 0;
      while ((match = JSX_COMPONENT_RE.exec(rawNoCode)) !== null) {
        const name = match[1];
        if (!seen.has(name)) {
          seen.add(name);
          if (!(MDX_JSX_ALLOWLIST as readonly string[]).includes(name)) {
            throw new Error(
              `Disallowed MDX JSX <${name}> in ${slug} — add to MDX_JSX_ALLOWLIST and provide an RSS mapping in src/lib/rss-renderer.tsx`,
            );
          }
        }
      }

      if (!SLUG_RE.test(slug)) {
        throw new Error(`Invalid article slug "${slug}" — must be lowercase kebab-case`);
      }
      if (slug.length > SLUG_MAX_LEN) {
        throw new Error(
          `Article slug "${slug}" exceeds ${SLUG_MAX_LEN} chars — slugs are keyword-focused, not title-mirrors`,
        );
      }
      // Destructure raw out so it does not appear in the emitted Article type
      const { raw, ...rest } = data;
      const wc = countWords(raw);
      return {
        ...rest,
        slug,
        wordCount: wc,
        readingTime: readingTime(raw),
        ogImage: `/og/articles/${slug}.png`,
      };
    }),
});

const note = defineCollection({
  name: 'Note',
  pattern: 'notes/*.mdx',
  schema: s
    .object({
      title: s.string(),
      publishedAt: s.isodate(),
      kind: s.enum(['til', 'take', 'snippet', 'aside']),
      // derived from the file path — filename becomes the slug
      slug: s.path(),
      // raw markdown source for JSX allowlist check
      raw: s.raw(),
      // compiled MDX function-body string — same pipeline as articles
      body: s.mdx({
        rehypePlugins: [
          rehypeUnwrapImages,
          [
            rehypePrettyCode,
            {
              theme: brutalistMono,
              keepBackground: false,
            },
          ],
        ],
      }),
    })
    .transform((data) => {
      // s.path() returns 'notes/<filename>' — extract only the leaf segment
      const slug = data.slug.split('/').pop() ?? data.slug;

      // Verify all PascalCase JSX components in the raw source are on the allowlist.
      // Fails the build early rather than silently omitting components from the RSS feed.
      // Code-fenced and inline-code JSX is ignored — strip both before scanning.
      const rawNoCode = data.raw
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`[^`\n]*`/g, '');
      const seen = new Set<string>();
      let match: RegExpExecArray | null;
      JSX_COMPONENT_RE.lastIndex = 0;
      while ((match = JSX_COMPONENT_RE.exec(rawNoCode)) !== null) {
        const name = match[1];
        if (!seen.has(name)) {
          seen.add(name);
          if (!(MDX_JSX_ALLOWLIST as readonly string[]).includes(name)) {
            throw new Error(
              `Disallowed MDX JSX <${name}> in ${slug} — add to MDX_JSX_ALLOWLIST and provide an RSS mapping in src/lib/rss-renderer.tsx`,
            );
          }
        }
      }

      if (!SLUG_RE.test(slug)) {
        throw new Error(`Invalid note slug "${slug}" — must be lowercase kebab-case`);
      }
      if (slug.length > SLUG_MAX_LEN) {
        throw new Error(
          `Note slug "${slug}" exceeds ${SLUG_MAX_LEN} chars — slugs are keyword-focused, not title-mirrors`,
        );
      }
      // Destructure raw out so it does not appear in the emitted Note type
      const { raw: _raw, ...rest } = data;
      return {
        ...rest,
        slug,
        excerpt: excerptFromRaw(data.raw) || data.title,
        ogImage: `/og/notes/${slug}.png`,
      };
    }),
});

export default defineConfig({
  root: 'src/content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name]-[hash:6].[ext]',
    clean: true,
  },
  collections: { article, note },
});
