'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';
import { Info } from '@phosphor-icons/react/dist/ssr/index';
import { useCurrentLocale } from '@/hooks/useCurrentLocale';
import { Text } from '@/components/Text';

export interface EnglishOnlyProps {
  children: ReactNode
  className?: string
}

export function EnglishOnly({
  children, className,
}: EnglishOnlyProps) {
  const currentLocale = useCurrentLocale();

  return currentLocale !== 'en' && (
    <Text variant="body-3" className={clsx(className, 'flex text-auxiliary-500')}>
      <Info size={16} weight="bold" className="mr-1" />
      { children }
    </Text>
  );
}
