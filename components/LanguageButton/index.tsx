'use client';

import { usePathname } from '@/navigation';
import { Translate } from '@phosphor-icons/react/dist/ssr/index';
import { LinkButton } from '@/components/LinkButton';
import { useCurrentLocale } from '@/hooks/useCurrentLocale';

export interface LanguageButtonProps {
  className?: string
}

export function LanguageButton({ className }: LanguageButtonProps) {
  const currentPath = usePathname();
  const currentLocale = useCurrentLocale();
  const alternateLocale = currentLocale === 'pt' ? 'en' : 'pt';

  return (
    <LinkButton
      variant="icon"
      href={currentPath}
      className={className}
      title={alternateLocale === 'en' ? 'English' : 'Português'}
      locale={alternateLocale}
    >
      <Translate size={32} />
    </LinkButton>
  );
}
