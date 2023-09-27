/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable max-len */
import Image from 'next/image';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';

export default function About() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
      <Image src="/me.jpg" width={192} height={192} alt="Picture of myself" className="rounded-full" />
      <div>
        <Text variant="h2-mono" element="h1">
          About
        </Text>
        <Text className="mt-4">
          A <strong>software engineer</strong> with professional experience in web and mobile applications. Led and participated in the project and development of applications for public and private companies in the most diverse segments, using languages and tools such as JavaScript, TypeScript, Vue.js, Nuxt, Drupal, PHP, Laravel, Node.js, and NativeScript. Holds a <strong>BS in Computer Science</strong> and is constantly improving himself and studying new technologies.
        </Text>
        <Button href="/resume.pdf" target="_blank" className="mt-8">
          Download Resume
        </Button>
      </div>
    </div>
  );
}
