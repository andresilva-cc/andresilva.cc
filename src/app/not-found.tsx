import { SmileyXEyes } from '@phosphor-icons/react/dist/ssr/index';
import { Text } from '@/components/Text';

export default function NotFound() {
  return (
    <div className="flex flex-col gap-4 items-center">
      <SmileyXEyes
        size={128}
        weight="fill"
        className="fill-auxiliary-500 hover:fill-secondary-500 hover:scale-110 transition-transform"
      />
      <Text variant="h1">404</Text>
      <Text className="text-auxiliary-500">Oops, this page doesn&apos;t exist.</Text>
    </div>
  );
}
