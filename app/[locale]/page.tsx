import { useTranslations } from 'next-intl';
import { Text } from '@/components/Text';

export default function Home() {
  const t = useTranslations('home');

  return (
    <>
      <Text variant="h1" className="text-secondary-500 text-5xl md:text-6xl">
        André Silva
      </Text>

      <Text variant="h2-sans" className="text-primary-500 mt-8 text-xl md:text-2xl">
        Front-end Engineering Consultant @ Atlas Technologies
      </Text>

      <Text className="mt-8">
        { t('bio') }
      </Text>
    </>
  );
}