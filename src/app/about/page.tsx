import Image from 'next/image';

import { Text } from '@/components/text';
import { LinkButton } from '@/components/link-button';

export const metadata = {
  title: 'About | André Silva',
};

export default function About() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
      <Image src="/me.jpg" width={192} height={192} alt="Picture of myself" priority className="rounded-full" />
      <div>
        <Text variant="h2-mono" element="h1">
          About
        </Text>
        <Text element="div" className="mt-4 [&>p]:mb-2">
          <p>
            Software engineer with
            {' '}
            <strong>8+ years of experience</strong>
            {' '}
            building
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
          </p>
          <p>
            Primarily works with TypeScript, Vue.js, Nuxt, React, and Node.js. Takes
            {' '}
            <strong>ownership</strong>
            {' '}
            of solutions while
            {' '}
            <strong>collaborating effectively</strong>
            {' '}
            with teams,
            {' '}
            <strong>quickly adapting</strong>
            {' '}
            to new technologies and challenges.
          </p>
          <p>
            Holds a
            {' '}
            <strong>BS in Computer Science</strong>
            {' '}
            and a specialization certificate in
            {' '}
            <strong>Technical Leadership</strong>
            .
          </p>
        </Text>
        <LinkButton href="/resume.pdf" target="_blank" className="mt-4">
          Download Resume
        </LinkButton>
      </div>
    </div>
  );
}
