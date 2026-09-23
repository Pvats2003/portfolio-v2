import { caseStudies, getCaseStudy } from '@/content/projects';
import { ogImage, ogSize } from '@/lib/og';

export const alt = 'Case study by Priyanshu Vats';
export const size = ogSize;
export const contentType = 'image/png';

export function generateStaticParams() {
  return caseStudies.map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return new Response('Not found', { status: 404 });
  return ogImage({ marker: `Case ${study.index}`, eyebrow: study.org, title: study.title, subtitle: study.kicker, chips: study.chips });
}
