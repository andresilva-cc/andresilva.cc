import { useTranslations } from 'next-intl';
import { SmileyXEyes } from '@phosphor-icons/react/dist/ssr/index';
import { Text } from '@/components/Text';

export default function NotFound() {
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-4 items-center">
      <SmileyXEyes
        size={128}
        weight="fill"
        className="fill-auxiliary-500 hover:fill-secondary-500 hover:scale-110 transition-transform"
      />
      <Text variant="h1">{ t('notFound.title') }</Text>
      <Text className="text-auxiliary-500">{ t('notFound.description') }</Text>
    </div>
  );
}
