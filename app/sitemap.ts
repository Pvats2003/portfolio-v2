import type { MetadataRoute } from 'next';
import { caseStudies } from '@/content/projects';
import { SITE_URL } from '@/content/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['/', '/about', '/resume', ...caseStudies.map((s) => `/work/${s.slug}`)];
  return paths.map((p) => ({ url: `${SITE_URL}${p === '/' ? '' : p}` }));
}
