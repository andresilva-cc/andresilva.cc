import { usePathname } from 'next/navigation';

export function useCurrentLocale() {
  const currentPath = usePathname();
  const currentLocale = currentPath.includes('/pt') ? 'pt' : 'en';

  return currentLocale;
}
