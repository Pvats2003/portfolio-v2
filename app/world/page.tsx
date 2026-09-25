import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { WorldView } from '@/components/world/WorldView';
import { innProjects } from '@/content/world';

export const metadata: Metadata = pageMetadata({
  title: 'My world',
  description: 'A painted countryside village; the inn holds Priyanshu’s projects.',
  path: '/world',
});

export default function WorldPage() {
  return <WorldView projects={innProjects} />;
}
