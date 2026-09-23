import type { Metadata } from 'next';
import { identity } from '@/content/resume';

// Per-page metadata in one shape: title, description, canonical URL and matching Open Graph / X tags.
// Sharing images come from the opengraph-image files next to each route.
export function pageMetadata({ title, description, path }: { title?: string; description: string; path: string }): Metadata {
  const fullTitle = title ? `${title} — ${identity.name}` : `${identity.name} — field operations & product`;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: { title: fullTitle, description, url: path, siteName: identity.name, type: 'website', locale: 'en_IN' },
    twitter: { card: 'summary_large_image', title: fullTitle, description },
  };
}
