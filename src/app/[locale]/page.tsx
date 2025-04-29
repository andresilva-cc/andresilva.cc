import { useTranslations } from 'next-intl';
import { Text } from '@/components/Text';

export default function Home() {
  const t = useTranslations();

  return (
    <>
      <Text variant="h1" className="text-secondary-500 text-5xl md:text-6xl">
        André Silva
      </Text>

      <Text variant="h2-sans" className="text-primary-500 mt-8 text-xl md:text-2xl">
        Senior Engineer @ Healthy Labs
      </Text>

      <Text className="mt-8">
        { t('home.bio') }
      </Text>
    </>
  );
}
