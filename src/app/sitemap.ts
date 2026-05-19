import type { MetadataRoute } from 'next';

import { getRepositories } from '@/repositories';
import { SITE_ORIGIN } from '@/lib/config';

/* Static routes + one entry per published article. /design-system is a
   living reference surface, not content — deliberately excluded. */
export default function sitemap(): MetadataRoute.Sitemap {
  const { articlesRepository } = getRepositories();
  const articles = articlesRepository.getAll();

  const staticRoutes = ['', '/about', '/career', '/projects', '/articles'].map((path) => ({
    url: `${SITE_ORIGIN}${path}`,
  }));

  const articleRoutes = articles.map((a) => ({
    url: `${SITE_ORIGIN}/articles/${a.slug}`,
    lastModified: a.updatedAt ?? a.publishedAt,
  }));

  return [...staticRoutes, ...articleRoutes];
}
