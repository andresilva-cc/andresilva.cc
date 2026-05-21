import { SITE_ORIGIN } from '@/lib/config';

// basePath is the full path segment, e.g. "articles/<slug>" or "notes/<slug>"
export function absolutize(url: string, basePath: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('mailto:') || url.startsWith('tel:')) return url;
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('#')) return `${SITE_ORIGIN}/${basePath}${url}`;
  if (url.startsWith('/')) return `${SITE_ORIGIN}${url}`;
  const base = `${SITE_ORIGIN}/${basePath}/`;
  return new URL(url, base).toString();
}
