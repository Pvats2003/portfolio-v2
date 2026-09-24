// Work cards on the homepage: visual first, then at most 25 words and one proof chip.
// Case-study pages live in content/projects/.
import type { MediaKey } from './media';
import type { IllustrationName } from '@/components/visual/Illustrations';
import type { Chip } from './types';

/** A screenshot, or — for projects with no screenshot — a labelled illustration built from sourced facts. */
export type CardVisual =
  /** A screenshot, cropped in CSS to its strongest region (aspect + object-position). */
  | { kind: 'shot'; media: MediaKey; focus?: string }
  | { kind: 'illustration'; name: IllustrationName };

export type WorkCard = {
  slug: string;
  title: string;
  /** At most 25 words. */
  blurb: string;
  /** The single proof point shown on the card. */
  proof: Chip;
  visual: CardVisual;
  href: string;
  external?: { label: string; href: string };
};

export const flagship = {
  slug: 'city-ops-os',
  title: 'City Ops OS',
  label: 'One system, two roles',
  blurb:
    'One city’s ops sprawled across four systems. I designed one local-first view per city, for managers and field officers.', // R-P1.1, R-P1.2
  proof: { label: 'Being integrated into Instawork’s ops tool', tone: 'accent' }, // R-P1.1
  href: '/work/city-ops-os',
} satisfies Omit<WorkCard, 'visual'> & { label: string };

export const selectedWork: WorkCard[] = [
  {
    slug: 'karavali',
    title: 'Karavali',
    blurb: 'Local discovery for coastal Karnataka. Pivoted from a campus travel app; shipped the MVP in one week, solo.', // R-P4.1
    proof: { label: 'Live MVP', tone: 'ok' }, // R-P4
    visual: { kind: 'shot', media: 'karavaliDiscover', focus: 'left center' },
    href: '/work/karavali',
    external: { label: 'Live MVP', href: 'https://karavali.base44.app' }, // Priyanshu (decision 5)
  },
  {
    slug: 'audit-ai-copilot',
    title: 'Audit AI Copilot',
    blurb: 'Upload a process, get a risk review: rules first, an LLM second. I wrote the PRD and directed the build.', // R-P3.1, PRD
    proof: { label: 'Full PRD · P0–P2 stories' }, // R-P3.1
    visual: { kind: 'shot', media: 'auditInput', focus: '4% 30%' },
    href: '/work/audit-ai-copilot',
  },
  {
    slug: 'career-os',
    title: 'Career OS',
    blurb: 'A job-search agent that can’t invent facts about the candidate. Nothing auto-submits.', // R-P2.1, R-P2.2
    proof: { label: '350+ passing tests', tone: 'ok' }, // R-P2.2
    visual: { kind: 'illustration', name: 'career-os' },
    href: '/work/career-os',
  },
];

export const archive: WorkCard[] = [
  {
    slug: 'anpr',
    title: 'ANPR',
    blurb: 'Final-year project: detect and read Indian number plates.', // R-P5.1
    proof: { label: '89.1% mAP@50', tone: 'ok' }, // R-P5.1
    visual: { kind: 'illustration', name: 'anpr' },
    href: '/work/anpr',
  },
  {
    slug: 'itc-powerhouse',
    title: 'ITC powerhouse mapping',
    blurb: 'Mapped a powerhouse’s supply paths, switchover logic and single points of failure.', // R-E2, R-E2.1
    proof: { label: '15+ sub-distribution boards' }, // R-E2.1
    visual: { kind: 'illustration', name: 'itc' },
    href: '/work/itc-powerhouse',
  },
];
