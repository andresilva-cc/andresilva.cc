import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getTranslator } from 'next-intl/server';

import { Text } from '@/components/Text';
import { LinkButton } from '@/components/LinkButton';
import { RouteParams } from '@/types/RouteParams';

export async function generateMetadata({ params }: RouteParams) {
  const t = await getTranslator(params.locale);

  return {
    title: `${t('about.title')} | André Silva`,
  };
}

export default function About() {
  const t = useTranslations();

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
      <Image src="/me.jpg" width={192} height={192} alt="Picture of myself" className="rounded-full" />
      <div>
        <Text variant="h2-mono" element="h1">
          { t('about.title') }
        </Text>
        <Text className="mt-4">
          { t.rich('about.bio') }
        </Text>
        <LinkButton href="/resume.pdf" target="_blank" className="mt-8">
          { t('about.downloadResume') }
        </LinkButton>
      </div>
    </div>
  );
}
