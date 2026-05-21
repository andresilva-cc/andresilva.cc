import type { MetadataRoute } from 'next';

import { getRepositories } from '@/repositories';
import { SITE_ORIGIN } from '@/lib/config';

/* Static routes + one entry per published article + one entry per note.
   /design-system is a living reference surface, not content — excluded. */
export default function sitemap(): MetadataRoute.Sitemap {
  const { articlesRepository, notesRepository } = getRepositories();
  const articles = articlesRepository.getAll();
  const notes = notesRepository.getAll();

  const staticRoutes = ['', '/about', '/career', '/projects', '/articles', '/notes'].map((path) => ({
    url: `${SITE_ORIGIN}${path}`,
  }));

  const articleRoutes = articles.map((a) => ({
    url: `${SITE_ORIGIN}/articles/${a.slug}`,
    lastModified: a.updatedAt ?? a.publishedAt,
  }));

  const noteRoutes = notes.map((n) => ({
    url: `${SITE_ORIGIN}/notes/${n.slug}`,
    lastModified: n.publishedAt,
  }));

  return [...staticRoutes, ...articleRoutes, ...noteRoutes];
}
