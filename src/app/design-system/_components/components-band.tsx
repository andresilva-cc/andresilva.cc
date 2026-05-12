import Link from 'next/link';
import { ReactNode } from 'react';

import { Text } from '@/components/text';
import { SectionHead } from '@/components/section-head';
import { Eyebrow } from '@/components/eyebrow';
import { Tag } from '@/components/tag';
import { Badge } from '@/components/badge';
import { StatusDot } from '@/components/status-dot';
import { ArrowLink } from '@/components/arrow-link';
import { Button } from '@/components/button';
import { LatestRow } from '@/components/latest-row';
import { ProjectCard } from '@/components/project-card';
import { GridFrame } from '@/components/grid-frame';
import { PageHead } from '@/components/page-head';
import { Wordmark } from '@/components/wordmark';
import { Nav } from '@/components/nav';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Portrait } from '@/components/portrait';
import { HeroPlasma } from '@/components/hero-plasma';

interface DemoProps {
  number: string;
  name: string;
  api: string;
  children: ReactNode;
}

function Demo({ number, name, api, children }: DemoProps) {
  return (
    <article className="border border-rule">
      <header className="flex items-baseline justify-between gap-4 p-4 border-b border-rule">
        <Text variant="h3" as="h3" className="text-fg m-0">
          <span className="text-fg-subtle">{`${number}.`}</span>
          {' '}
          { name }
        </Text>
        <Text variant="meta" as="code" className="font-mono text-fg-subtle">{ api }</Text>
      </header>
      <div className="p-6 flex flex-wrap items-start gap-4 bg-canvas">
        { children }
      </div>
    </article>
  );
}

export function ComponentsBand() {
  return (
    <section id="components" aria-labelledby="comp-h" className="py-12 md:py-16 border-t border-rule">
      <SectionHead eyebrow="// 06 / the parts in the kit" title="Components" id="comp-h" />
      <Text variant="body" className="text-fg-muted max-w-prose-wide">
        Every production component, rendered live — these are the actual components
        used across the site. If something breaks, this page is where you’ll see it first.
      </Text>

      <div className="mt-8 flex flex-col gap-6">
        <Demo number="01" name="Skip link" api=".skip-link">
          <Text variant="body" className="text-fg-muted m-0">
            Tab into the page from the URL bar to reveal the link at top-left. First focusable element on every page.
          </Text>
        </Demo>

        <Demo number="02" name="Wordmark" api="<Wordmark />">
          <Wordmark />
        </Demo>

        <Demo number="03" name="Header bar" api="<Header />">
          <div className="w-full">
            <Header />
          </div>
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
          <div className="flex flex-wrap gap-2 items-center">
            <Tag>TypeScript</Tag>
            <Tag>Vue.js</Tag>
            <Tag>React</Tag>
            <Badge>Career</Badge>
            <Badge>Featured</Badge>
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

        <Demo number="11" name="Button CTA" api="<Button>…</Button>">
          <Button asChild>
            <Link href="/resume.pdf" target="_blank">Download résumé</Link>
          </Button>
        </Demo>

        <Demo number="12" name="Latest row" api="<LatestRow … />">
          <ul className="w-full list-none p-0 m-0">
            <LatestRow category="Career" href="/career" title="Senior Engineer" company="MPA" />
            <LatestRow category="Project" href="/projects" title="Grafex" />
            <LatestRow category="Article" href="/articles" title="How I Achieved a 74% Performance Increase on a Page" />
          </ul>
        </Demo>

        <Demo number="13" name="Project card" api="<ProjectCard … />">
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
              technologies={['TypeScript', 'Next.js', 'React', 'Tailwind CSS']}
              links={[{ label: 'github', href: 'https://github.com/andresilva-cc/andresilva.cc' }]}
            />
          </GridFrame>
        </Demo>

        <Demo number="14" name="Grid frame" api="<GridFrame />">
          <GridFrame as="div" className="grid-cols-2 w-full">
            <div>
              <Text variant="micro" as="span" className="uppercase tracking-eyebrow text-fg-subtle">cell 01</Text>
              <Text variant="body" className="m-0 mt-1 text-fg">First cell content</Text>
            </div>
            <div>
              <Text variant="micro" as="span" className="uppercase tracking-eyebrow text-fg-subtle">cell 02</Text>
              <Text variant="body" className="m-0 mt-1 text-fg">Second cell content</Text>
            </div>
          </GridFrame>
        </Demo>

        <Demo number="15" name="Portrait" api="<Portrait />">
          <Portrait
            src="/me.jpg"
            alt="Portrait of André Silva — focus or tap to reveal natural color"
            width={160}
            height={160}
            className="max-w-40"
          />
        </Demo>

        <Demo number="16" name="Hero plasma" api="<HeroPlasma />">
          <HeroPlasma />
        </Demo>

        <Demo number="—" name="Footer" api="<Footer />">
          <div className="w-full">
            <Footer />
          </div>
        </Demo>
      </div>
    </section>
  );
}
