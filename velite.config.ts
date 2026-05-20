import rehypePrettyCode from 'rehype-pretty-code';
import rehypeUnwrapImages from 'rehype-unwrap-images';
import { defineCollection, defineConfig, s } from 'velite';
import { countWords, readingTime } from './src/lib/reading-time';
import brutalistMono from './src/styles/shiki/brutalist-mono.json';

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
          preset: s.enum(['flow', 'donut']),
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
      // s.path() returns 'articles/<folder-name>' — extract only the leaf segment
      const slug = data.slug.split('/').pop() ?? data.slug;
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

export default defineConfig({
  root: 'src/content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name]-[hash:6].[ext]',
    clean: true,
  },
  collections: { article },
});
