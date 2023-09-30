'use client';

import { usePathname } from 'next/navigation';
// @ts-ignore
import { Translate } from '@phosphor-icons/react/dist/ssr';
import { Button } from '@/components/Button';

export interface LanguageButtonProps {
  className?: string
}

export function LanguageButton({ className }: LanguageButtonProps) {
  const currentPath = usePathname();
  const changeLanguagePath = currentPath.includes('/pt') ? currentPath.replace('/pt', '/en') : currentPath.replace('/en', '/pt');

  return (
    <Button variant="icon" href={changeLanguagePath} className={className}>
      <Translate size={32} />
    </Button>
  );
}
