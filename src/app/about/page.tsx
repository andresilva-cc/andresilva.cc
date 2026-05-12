import Link from 'next/link';

import { Text } from '@/components/text';
import { Button } from '@/components/button';
import { PageHead } from '@/components/page-head';
import { SectionHead } from '@/components/section-head';
import { Portrait } from '@/components/portrait';
import { GridFrame } from '@/components/grid-frame';

export const metadata = {
  title: 'André Silva · About',
};

const educationItems = [
  {
    title: 'BS in Computer Science',
    institution: 'UNIVALI · 2015 — 2019',
    description: 'Foundational training across algorithms, systems, networks, and software engineering — the basis for nine years of end-to-end engineering work.',
  },
  {
    title: 'Technical Leadership',
    institution: 'Full Cycle · 2022 — 2023',
    description: 'Specialization certificate covering team dynamics, delivery practices, and the engineering management craft beyond individual contribution.',
  },
] as const;

const factsItems = [
  { key: 'location', value: 'Florianópolis, BR' },
  { key: 'timezone', value: 'UTC-03' },
  { key: 'languages', value: 'Portuguese (native) · English (fluent)' },
  { key: 'interests', value: 'DX tooling · web performance · type systems' },
] as const;

export default function About() {
  return (
    <>
      <PageHead name="ABOUT" />

      <section aria-labelledby="bio-h" className="py-12 md:py-16">
        <SectionHead eyebrow="// 01 / in my own words" title="Bio" id="bio-h" />
        <div className="grid grid-cols-1 md:grid-cols-article gap-6 md:gap-10 items-start">
          <Portrait
            src="/me.jpg"
            alt="Portrait of André Silva — focus or tap to reveal natural color"
            width={200}
            height={200}
            className="max-w-50"
          />
          <div className="flex flex-col gap-4 max-w-prose-wide">
            <Text variant="body" className="m-0 text-fg-muted">
              Software engineer with 9+ years of experience building
              {' '}
              <strong>web platforms</strong>
              ,
              {' '}
              <strong>internal tools</strong>
              , and
              {' '}
              <strong>developer tooling</strong>
              . Works
              {' '}
              <strong>end-to-end</strong>
              {' '}
              — from architecture and infrastructure to product features and integrations.
            </Text>
            <Text variant="body" className="m-0 text-fg-muted">
              Primarily works with
              {' '}
              <strong>TypeScript</strong>
              ,
              {' '}
              <strong>Vue.js</strong>
              ,
              {' '}
              <strong>Nuxt</strong>
              ,
              {' '}
              <strong>React</strong>
              , and
              {' '}
              <strong>Node.js</strong>
              . Takes ownership of solutions while collaborating effectively with teams, quickly adapting to new technologies and challenges.
            </Text>
            <Text variant="body" className="m-0 text-fg-muted">
              Holds a
              {' '}
              <strong>BS in Computer Science</strong>
              {' '}
              and a specialization certificate in
              {' '}
              <strong>Technical Leadership</strong>
              .
            </Text>
          </div>
        </div>
      </section>

      <section aria-labelledby="edu-h" className="py-12 md:py-16">
        <SectionHead eyebrow="// 02 / where i studied" title="Education" id="edu-h" flush />
        <GridFrame as="div" className="grid-cols-1 md:grid-cols-2">
          { educationItems.map((item) => (
            <div key={item.title} className="flex flex-col gap-2">
              <Text variant="h3" as="p" className="m-0 text-fg">{ item.title }</Text>
              <Text variant="meta" as="span" className="text-fg-subtle">{ item.institution }</Text>
              <Text variant="body" className="m-0 text-fg-muted max-w-prose-narrow">{ item.description }</Text>
            </div>
          )) }
        </GridFrame>
      </section>

      <section aria-labelledby="facts-h" className="py-12 md:py-16">
        <SectionHead eyebrow="// 03 / at a glance" title="Facts" id="facts-h" flush />
        <GridFrame as="div" className="grid-cols-1 md:grid-cols-2">
          { factsItems.map((item) => (
            <div key={item.key} className="flex flex-col gap-1">
              <Text variant="micro" as="span" className="uppercase tracking-eyebrow text-fg-subtle">{ item.key }</Text>
              <Text variant="body" className="m-0 text-fg">{ item.value }</Text>
            </div>
          )) }
        </GridFrame>
      </section>

      <section aria-labelledby="resume-h" className="py-12 md:py-16">
        <SectionHead eyebrow="// 04 / full work history" title="Resume" id="resume-h" />
        <Button asChild>
          <Link href="/resume.pdf" target="_blank">Download résumé</Link>
        </Button>
      </section>
    </>
  );
}
