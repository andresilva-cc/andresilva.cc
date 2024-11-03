'use client';

import { usePathname as usePathnameWithLocale } from 'next/navigation';
import { usePathname } from '@/i18n/routing';
import { Translate } from '@phosphor-icons/react/dist/ssr/index';
import { LinkButton } from '@/components/LinkButton';

export interface LanguageButtonProps {
  className?: string
}

export function LanguageButton({ className }: LanguageButtonProps) {
  const currentPath = usePathname();
  const currentPathWithLocale = usePathnameWithLocale();
  const alternateLocale = currentPathWithLocale.includes('/pt') ? 'en' : 'pt';

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
