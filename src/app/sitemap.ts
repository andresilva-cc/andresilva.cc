import type { MetadataRoute } from 'next';

const BASE_URL = 'https://andresilva.cc';

/* Static sitemap for the five public content routes. /design-system is a
   living reference surface, not content — deliberately excluded. */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/about', '/career', '/projects', '/articles'];
  return routes.map((path) => ({
    url: `${BASE_URL}${path}`,
  }));
}
