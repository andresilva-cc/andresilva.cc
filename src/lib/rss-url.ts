import { SITE_ORIGIN } from '@/lib/config';

export function absolutize(url: string, slug: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('mailto:') || url.startsWith('tel:')) return url;
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('#')) return `${SITE_ORIGIN}/articles/${slug}${url}`;
  if (url.startsWith('/')) return `${SITE_ORIGIN}${url}`;
  const base = `${SITE_ORIGIN}/articles/${slug}/`;
  return new URL(url, base).toString();
}
