import Link from 'next/link';
import { ReactNode } from 'react';

import { Text } from '@/components/text';
import { SectionHead } from '@/components/section-head';
import { Eyebrow } from '@/components/eyebrow';
import { Tag } from '@/components/tag';
import { Badge } from '@/components/badge';
import { StatusDot } from '@/components/status-dot';
import { ArrowLink } from '@/components/arrow-link';
import { InlineLink } from '@/components/inline-link';
import { Button } from '@/components/button';
import { LatestRow } from '@/components/latest-row';
import { ProjectCard } from '@/components/project-card';
import { RoleCard } from '@/components/role-card';
import { ArticleCard } from '@/components/article-card';
import { GridFrame } from '@/components/grid-frame';
import { PageHead } from '@/components/page-head';
import { Wordmark } from '@/components/wordmark';
import { Nav } from '@/components/nav';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Portrait } from '@/components/portrait';
import { HeroArt } from '@/components/hero-art';
import { StippleArt } from '@/components/stipple-art';
import { Figure } from '@/components/mdx/figure';
import { FigureCaption } from '@/components/mdx/figure-caption';
import { ImageMdx } from '@/components/mdx/image-mdx';
import { PreShiki } from '@/components/mdx/pre-shiki';
import { YouTube } from '@/components/mdx/youtube';

interface DemoProps {
  number: string;
  name: string;
  api: string;
  children: ReactNode;
}

function Demo({ number, name, api, children }: DemoProps) {
  return (
    <article className="border border-rule">
      <header className="flex items-baseline justify-between gap-2 py-3 px-4 border-b border-rule bg-surface flex-wrap">
        <span className="text-meta font-mono font-semibold text-accent">
          <span className="text-fg-subtle">{`${number}.`}</span>
          {' '}
          { name }
        </span>
        <span className="text-micro font-mono uppercase tracking-eyebrow text-fg-subtle">{ api }</span>
      </header>
      <div className="p-6 flex flex-wrap items-start gap-4 bg-canvas">
        { children }
      </div>
    </article>
  );
}

export function ComponentsBand() {
  return (
    <section id="components" aria-labelledby="comp-h" className="py-8 border-b border-rule">
      <SectionHead eyebrow="// 06 / the parts in the kit" title="Components" id="comp-h" />
      <Text variant="body" className="text-fg-muted max-w-prose-wide">
        24 components, all rendered live (no screenshots). Markup is verbatim from page and
        article files. Where markup includes hard-coded SVG paths or attribute strings, those are
        reproduced exactly so you can copy them directly from this page&#x2019;s source.
      </Text>

      <div className="mt-4 flex flex-col gap-4">
        <Demo number="01" name="Skip link" api="<SkipLink />">
          <Text variant="body" className="text-fg-muted m-0">
            Tab into the page from the URL bar to reveal the link at top-left. First focusable element on every page.
          </Text>
        </Demo>

        <Demo number="02" name="Header bar" api="<Header />">
          <div className="w-full">
            <Header />
          </div>
        </Demo>

        <Demo number="03" name="Wordmark" api="<Wordmark />">
          <Wordmark />
        </Demo>

        <Demo number="04" name="Primary nav" api="<Nav items={…} />">
          <Nav items={[
            { name: 'home', path: '/' },
            { name: 'about', path: '/about' },
            { name: 'career', path: '/career' },
            { name: 'projects', path: '/projects' },
            { name: 'articles', path: '/articles' },
          ]}
          />
        </Demo>

        <Demo number="05" name="Page-head" api="<PageHead name='ABOUT' />">
          <div className="w-full">
            <PageHead name="ABOUT" />
          </div>
        </Demo>

        <Demo number="06" name="Section head" api="<SectionHead eyebrow… title… />">
          <div className="w-full">
            <SectionHead eyebrow="// 01 / who" title="Bio" />
          </div>
        </Demo>

        <Demo number="07" name="Comment-tag eyebrow" api="<Eyebrow>…</Eyebrow>">
          <Eyebrow>&#47;&#47; 01 / who</Eyebrow>
        </Demo>

        <Demo number="08" name="Tags & badges" api="<Tag /> · <Badge />">
          <Text variant="body" className="text-fg-muted m-0 w-full">
            One primitive, three contextual variants. Shared shell:
            {' '}
            <code className="text-accent">--color-accent</code>
            {' '}
            text on a 1px
            {' '}
            <code className="text-accent">--color-accent-muted</code>
            {' '}
            border, square corners, mono at micro size.
          </Text>
          <div className="w-full flex flex-col gap-4">
            <div>
              <Text variant="meta" as="p" className="mb-2 text-fg-subtle uppercase tracking-eyebrow m-0">
                a. Tag chip — inline tech labels
              </Text>
              <div className="flex flex-wrap gap-2 items-center">
                <Tag>TypeScript</Tag>
                <Tag>Vue.js</Tag>
                <Tag>Nuxt</Tag>
                <Tag>React</Tag>
                <Tag>Tailwind CSS</Tag>
                <Tag>Node.js</Tag>
              </div>
            </div>
            <div>
              <Text variant="meta" as="p" className="mb-2 text-fg-subtle uppercase tracking-eyebrow m-0">
                b. Row badge — column-aligned category label
              </Text>
              <div className="flex flex-wrap gap-2 items-center">
                <Badge>Career</Badge>
                <Badge>Project</Badge>
                <Badge>Article</Badge>
              </div>
            </div>
            <div>
              <Text variant="meta" as="p" className="mb-2 text-fg-subtle uppercase tracking-eyebrow m-0">
                c. Floating badge — absolute overlay on a card
              </Text>
              <div className="flex flex-wrap gap-2 items-center">
                <Badge>Featured</Badge>
              </div>
            </div>
          </div>
        </Demo>

        <Demo number="09" name="Status dot" api="<StatusDot ariaLabel… />">
          <span className="inline-flex items-center gap-2">
            <StatusDot ariaLabel="current role" />
            <Text variant="meta" as="span" className="text-fg">current role</Text>
          </span>
        </Demo>

        <Demo number="10" name="Link arrow" api="<ArrowLink href… />">
          <ArrowLink href="/about">full bio</ArrowLink>
        </Demo>

        <Demo number="11" name="Inline link" api="<InlineLink href=&quot;…&quot;>…</InlineLink>">
          <Text variant="body" className="text-fg-muted m-0">
            Also published on the
            {' '}
            <InlineLink href="https://dev.to/andresilva/how-i-achieved-a-74-performance-increase-on-a-page-2gjm">dev.to article</InlineLink>
            {' '}
            and the source is available on
            {' '}
            <InlineLink href="https://github.com/andresilva-cc/andresilva.cc">GitHub</InlineLink>
            . Hover to see the body-color → accent lift with underline.
          </Text>
        </Demo>

        <Demo number="12" name="Button CTA" api="<Button>…</Button>">
          <Button asChild>
            <Link href="/resume.pdf" target="_blank">Download resume</Link>
          </Button>
        </Demo>

        <Demo number="13" name="Card patterns" api="<LatestRow /> · <ProjectCard /> · <RoleCard /> · <ArticleCard />">
          <div className="w-full flex flex-col gap-5">
            <div>
              <Text variant="meta" as="p" className="mb-3 text-fg-subtle uppercase tracking-eyebrow m-0">
                a. Home Latest row — inside ul
              </Text>
              <ul className="w-full list-none p-0 m-0">
                <LatestRow category="Career" href="/career" title="Senior Engineer" company="MPA" />
                <LatestRow category="Project" href="/projects" title="Grafex" />
                <LatestRow category="Article" href="/articles" title="How I Achieved a 74% Performance Increase on a Page" />
              </ul>
            </div>
            <div>
              <Text variant="meta" as="p" className="mb-3 text-fg-subtle uppercase tracking-eyebrow m-0">
                b. Project card — inside GridFrame
              </Text>
              <GridFrame className="grid-cols-1 md:grid-cols-2 w-full">
                <ProjectCard
                  title="Grafex"
                  description="Images as Code. Write JSX, export as images."
                  technologies={['TypeScript', 'Node.js']}
                  links={[{ label: 'site', href: 'https://grafex.dev/' }]}
                  featured
                />
                <ProjectCard
                  title="andresilva.cc"
                  description="The personal website that you are seeing right now."
                  technologies={['React', 'Next.js', 'TypeScript']}
                  links={[{ label: 'github', href: 'https://github.com/andresilva-cc/andresilva.cc' }]}
                />
              </GridFrame>
            </div>
            <div>
              <Text variant="meta" as="p" className="mb-3 text-fg-subtle uppercase tracking-eyebrow m-0">
                c. Career role — date gutter + content
              </Text>
              <ul className="flex flex-col list-none p-0 m-0 border border-rule">
                <RoleCard
                  dates="apr 2025 — now"
                  isCurrent
                  title="Senior Engineer"
                  company="MPA"
                  formerly="Healthy Labs"
                  description={(
                    <ul>
                      <li>Developed a multi-agent AI assistant for internal CMS operations and workflows</li>
                      <li>Built a preview orchestration server using WebSockets and Docker</li>
                      <li>Implemented lead compliance integrations across CMS and consumer-facing platforms</li>
                    </ul>
                  )}
                  technologies={['TypeScript', 'Vue.js', 'Nuxt', 'React', 'TanStack', 'AI SDK']}
                />
              </ul>
            </div>
            <div>
              <Text variant="meta" as="p" className="mb-3 text-fg-subtle uppercase tracking-eyebrow m-0">
                d. Article entry — illustration + body grid
              </Text>
              <ul className="list-none p-0 m-0">
                <ArticleCard
                  date="2025.02.13"
                  readingTime={4}
                  title="How I Achieved a 74% Performance Increase on a Page"
                  description="A walkthrough of the techniques used to substantially improve page performance on a high-traffic Vue/Nuxt platform — where the wins came from and how the render path was rewritten to hit a 74% increase on the key metric."
                  url="/articles/74-percent-performance-increase"
                  tags={['Vue', 'Nuxt', 'webperf']}
                />
              </ul>
            </div>
          </div>
        </Demo>

        <Demo number="14" name="Grid frame" api="<GridFrame />">
          <GridFrame as="div" className="grid-cols-2 w-full">
            <div className="flex flex-col gap-1">
              <Text variant="micro" as="span" className="uppercase tracking-eyebrow text-fg-subtle">cell 01</Text>
              <Text variant="body" className="m-0 text-fg font-medium">First cell content</Text>
            </div>
            <div className="flex flex-col gap-1">
              <Text variant="micro" as="span" className="uppercase tracking-eyebrow text-fg-subtle">cell 02</Text>
              <Text variant="body" className="m-0 text-fg font-medium">Second cell content</Text>
            </div>
          </GridFrame>
        </Demo>

        <Demo number="15" name="Portrait" api="<Portrait />">
          <Portrait
            src="/me.jpg"
            alt="Portrait of André Silva — focus or tap to reveal natural color"
            width={200}
            height={260}
            className="w-50 aspect-[200/260] border border-rule"
          />
        </Demo>

        <Demo number="16" name="Hero art" api="<HeroArt />">
          <HeroArt />
        </Demo>

        <Demo number="17" name="Footer" api="<Footer />">
          <div className="w-full">
            <Footer />
          </div>
        </Demo>

        <Demo number="18" name="StippleArt" api="<StippleArt config=… mode=… />">
          <Text variant="body" className="text-fg-muted m-0 w-full">
            React wrapper for the
            {' '}
            <code className="text-accent">&lt;stipple-art&gt;</code>
            {' '}
            Web Component. Loads the engine once per page from
            {' '}
            <code className="text-accent">art.andresilva.cc</code>
            ; subsequent instances reuse it. Used as the home hero art and as article card thumbnails.
          </Text>
          <div className="w-full h-32 border border-rule overflow-hidden">
            <StippleArt
              config="p=plasma&palette=acid"
              mode="always"
              fit="cover"
              link="none"
              className="font-mono text-fg-muted w-full h-full block"
              style={{ fontSize: '7px', lineHeight: 1 }}
            />
          </div>
        </Demo>

        <Demo number="19" name="FigureCaption" api="<FigureCaption number={N} caption=&quot;…&quot; />">
          <Text variant="body" className="text-fg-muted m-0 w-full">
            Shared caption renderer used by
            {' '}
            <code className="text-accent">&lt;Figure&gt;</code>
            {' '}
            and
            {' '}
            <code className="text-accent">&lt;YouTube&gt;</code>
            .
            {' '}
            <code className="text-accent">Fig. N</code>
            {' '}
            lands in
            {' '}
            <code className="text-accent">text-accent</code>
            ; the em-dash and caption body land in
            {' '}
            <code className="text-accent">text-fg-muted</code>
            {' '}
            &mdash; accent marks the type, not the separator.
          </Text>
          <figure>
            <FigureCaption number={1} caption="Client-side rendering flow." />
          </figure>
        </Demo>

        <Demo number="20" name="Figure" api="<Figure caption=… number={N} src=… />">
          <Text variant="body" className="text-fg-muted m-0 w-full">
            Flush diagram with numbered caption. No border (rule 18). Capped at
            {' '}
            <code className="text-accent">max-w-prose-figure</code>
            {' '}
            (80ch). Accepts
            {' '}
            <code className="text-accent">src/alt/width/height</code>
            {' '}
            as direct props; delegates caption rendering to
            {' '}
            <code className="text-accent">&lt;FigureCaption&gt;</code>
            . The placeholder below shows the layout without a real image asset.
          </Text>
          <figure className="my-0 mx-auto w-full max-w-prose-figure">
            <div className="w-full aspect-video bg-surface border border-rule flex items-center justify-center">
              <span className="text-meta font-mono text-fg-subtle">image placeholder</span>
            </div>
            <FigureCaption number={1} caption="Example diagram caption — rendered by FigureCaption." />
          </figure>
        </Demo>

        <Demo number="21" name="ImageMdx" api="<ImageMdx src=… alt=… />">
          <Text variant="body" className="text-fg-muted m-0 w-full">
            Bare flush image for the
            {' '}
            <code className="text-accent">![]() </code>
            {' '}
            MDX path. No border, no caption (rule 19 &mdash; referential surface). Uses
            {' '}
            <code className="text-accent">next/image</code>
            {' '}
            when Velite emits width/height; falls back to a plain
            {' '}
            <code className="text-accent">&lt;img&gt;</code>
            {' '}
            for external URLs. For captioned diagrams use
            {' '}
            <code className="text-accent">&lt;Figure&gt;</code>
            {' '}
            instead.
          </Text>
        </Demo>

        <Demo number="22" name="YouTube" api="<YouTube id=&quot;…&quot; caption=&quot;…&quot; number={N} />">
          <Text variant="body" className="text-fg-muted m-0 w-full">
            Click-to-load video embed. Server Component renders a static thumbnail fa&#xe7;ade (LCP-friendly);
            the
            {' '}
            <code className="text-accent">YouTubeSwap</code>
            {' '}
            client island swaps in the
            {' '}
            <code className="text-accent">&lt;iframe&gt;</code>
            {' '}
            on click &mdash; no YouTube JS (~600 kB) loads before interaction.
            Thumbnail is grayscale at rest; dissolves to color on hover (motion-safe gated).
            No border (rule 18). Optional
            {' '}
            <code className="text-accent">caption</code>
            {' '}
            +
            {' '}
            <code className="text-accent">number</code>
            {' '}
            props render a
            {' '}
            <code className="text-accent">&lt;FigureCaption&gt;</code>
            {' '}
            row beneath.
          </Text>
          <div className="w-full max-w-prose-wide">
            <YouTube id="dQw4w9WgXcQ" caption="Demo embed — click to load the iframe." number={1} />
          </div>
        </Demo>

        <Demo number="23" name="PreShiki" api="<PreShiki data-language=&quot;…&quot;>…</PreShiki>">
          <Text variant="body" className="text-fg-muted m-0 w-full">
            Styled
            {' '}
            <code className="text-accent">&lt;pre&gt;</code>
            {' '}
            wrapper emitted by
            {' '}
            <code className="text-accent">rehype-pretty-code</code>
            . Renders a language label strip above the block when
            {' '}
            <code className="text-accent">data-language</code>
            {' '}
            is present. Extracts plain-text code at render time and passes it to the
            {' '}
            <code className="text-accent">CopyButton</code>
            {' '}
            client island &mdash; no DOM traversal on the client.
          </Text>
          <div className="w-full">
            <PreShiki data-language="ts">
              <code>
                {'const greet = (name: string) => `Hello, ${name}!`;\nconsole.log(greet("André"));'}
              </code>
            </PreShiki>
          </div>
        </Demo>

        <Demo number="24" name="CopyButton" api="<CopyButton code=&quot;…&quot; />">
          <Text variant="body" className="text-fg-muted m-0 w-full">
            Client island embedded inside
            {' '}
            <code className="text-accent">&lt;PreShiki&gt;</code>
            . Writes to
            {' '}
            <code className="text-accent">navigator.clipboard</code>
            ; swaps label from
            {' '}
            <code className="text-accent">copy</code>
            {' '}
            to
            {' '}
            <code className="text-accent">copied</code>
            {' '}
            for 1500ms. A
            {' '}
            <code className="text-accent">sr-only role=&quot;status&quot;</code>
            {' '}
            span announces the change to screen readers. Revealed on
            {' '}
            <code className="text-accent">group-hover/pre</code>
            ; silent-fails if clipboard API is unavailable. Hover over the code block above (Demo 23) to see it.
          </Text>
        </Demo>
      </div>
    </section>
  );
}
