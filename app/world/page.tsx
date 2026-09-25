import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { WorldView } from '@/components/world/WorldView';
import { overview, places } from '@/content/world';

export const metadata: Metadata = pageMetadata({
  title: 'My world',
  description: 'An illustrated town where each of Priyanshu’s projects is a place you can visit.',
  path: '/world',
});

export default function WorldPage() {
  return <WorldView places={places} overview={overview} />;
}
