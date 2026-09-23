import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseStudyView } from '@/components/case/CaseStudyView';
import { caseStudies, getCaseStudy } from '@/content/projects';
import { pageMetadata } from '@/lib/seo';

// One template for every case study; content lives in content/projects/*.ts.

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<'/work/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return pageMetadata({ title: `${study.title} case study`, description: `${study.kicker}. ${study.tldr[0]}`, path: `/work/${study.slug}` });
}

export default async function CaseStudyPage({ params }: PageProps<'/work/[slug]'>) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();
  return <CaseStudyView study={study} />;
}
