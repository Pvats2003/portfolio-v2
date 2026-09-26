import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { WorldView } from '@/components/world/WorldView';
import { innProjects } from '@/content/world';

// A comparison test for /world (WORLD.md): the land plate as a "3D photo" instead of a 360° panorama.
export const metadata: Metadata = pageMetadata({
  title: '3D photo test',
  description: 'Test: the painted village as a 3D photo that shifts as you move; the inn holds Priyanshu’s projects.',
  path: '/world/depth',
});

export default function WorldDepthPage() {
  return <WorldView projects={innProjects} scene="depth" />;
}
