import type { MetadataRoute } from 'next';
import { INDEXABLE, SITE_URL } from '@/content/site';

// Crawling stays allowed so search engines can read the noindex tag; indexing is switched on at "go live".
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    ...(INDEXABLE ? { sitemap: `${SITE_URL}/sitemap.xml` } : {}),
  };
}
