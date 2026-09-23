import type { Metadata } from 'next';
import { CaseStudyView } from '@/components/case/CaseStudyView';
import { cityOpsOs } from '@/content/projects/city-ops-os';

export const metadata: Metadata = {
  title: 'City Ops OS — case study',
  description: cityOpsOs.tldr.join(' '),
};

export default function CityOpsOsPage() {
  return <CaseStudyView study={cityOpsOs} />;
}
