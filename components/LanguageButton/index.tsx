'use client';

import { usePathname as usePathnameWithLocale } from 'next/navigation';
import { usePathname } from '@/navigation';
// @ts-ignore
import { Translate } from '@phosphor-icons/react/dist/ssr';
import { Button } from '@/components/Button';

export interface LanguageButtonProps {
  className?: string
}

export function LanguageButton({ className }: LanguageButtonProps) {
  const currentPath = usePathname();
  const currentPathWithLocale = usePathnameWithLocale();
  const alternateLocale = currentPathWithLocale.includes('/pt') ? 'en' : 'pt';

  return (
    <Button
      variant="icon"
      href={currentPath}
      className={className}
      title={alternateLocale === 'en' ? 'English' : 'Português'}
      locale={alternateLocale}
    >
      <Translate size={32} />
    </Button>
  );
}
