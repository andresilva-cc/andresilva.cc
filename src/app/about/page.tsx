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
            A software engineer with over 8 years of experience in web application development,
            with a strong background in
            {' '}
            <strong>problem-solving</strong>
            ,
            {' '}
            <strong>adaptability</strong>
            , and driving solutions from
            {' '}
            <strong>start to finish</strong>
            .
          </p>
          <p>
            Led and contributed to the development of applications for public and private
            companies across
            {' '}
            <strong>diverse sectors</strong>
            , using languages and tools such as TypeScript,
            Vue.js, Nuxt, PHP, Laravel, and Node.js. Takes
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
