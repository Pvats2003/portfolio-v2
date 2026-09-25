import type { Metadata } from 'next';
import { LookdevView } from '@/components/world/lookdev/LookdevView';
import { places } from '@/content/world';

export const metadata: Metadata = {
  title: 'World look-dev',
  description: 'Look-development frames for the anime world: three styles of the Field Ops Depot.',
  robots: { index: false, follow: false },
};

export default function LookdevPage() {
  return <LookdevView depot={places[0]} />;
}
