// Work cards on the homepage. Case-study pages live in content/projects/.
// `href` links a card to its case study in content/projects/.
import type { Chip } from './types';

export type WorkCard = {
  slug: string;
  title: string;
  kicker: string;
  chips: Chip[];
  summary: string;
  points: string[];
  stack?: string;
  quote?: string;
  href?: string;
  external?: { label: string; href: string };
};

export const flagship: WorkCard & { before: string[]; after: string; tradeoff: string; outcome: string } = {
  slug: 'city-ops-os',
  title: 'City Ops OS',
  kicker: 'Instawork Robotics Labs · local-first operating system for city field ops', // R-P1
  chips: [{ label: 'Live', tone: 'ok' }, { label: '2026 – Present' }], // R-P1
  summary:
    'One city’s operations were spread across four separate systems. I consolidated them into a single per-city operating view.', // R-P1.1
  points: [],
  before: ['Google Sheets', 'Apps Script', 'OCR form', 'Node.js backend'], // R-P1.1
  after: 'One per-city view', // R-P1.1
  tradeoff: 'No accounts, no infra budget, no setup — deliberately traded away cross-device sync.', // R-P1.2
  stack: 'React · Zustand · localStorage · Firebase Hosting', // R-P1
  outcome: 'Design now being integrated into Instawork’s internal ops tool.', // R-P1.1
  href: '/work/city-ops-os',
};

export const selectedWork: WorkCard[] = [
  {
    slug: 'career-os',
    title: 'Career OS',
    kicker: 'Autonomous job discovery & application agent', // R-P2
    chips: [{ label: 'Ongoing' }], // R-P2
    summary:
      'A job-search agent built so it can’t make things up: discovery with cross-source dedup, deterministic + AI-assisted matching, and an application engine that drafts only answers it can prove.', // R-P2.1, README
    points: [
      'Every candidate fact carries source, confidence, and verified metadata.', // R-P2.2
      'Salary, visa, CAPTCHA and MFA hard-stop to a human; nothing auto-submits.', // R-P2.2
      '350+ passing automated tests.', // R-P2.2
    ],
    quote: 'Automate the work. Never automate trust.', // brief (kept from old site)
    href: '/work/career-os',
  },
  {
    slug: 'karavali',
    title: 'Karavali',
    kicker: 'Solo founder · community-driven local discovery, coastal Karnataka', // R-P4, R-P4.1
    chips: [{ label: 'Live MVP', tone: 'ok' }, { label: 'Apr 2026 – Present' }], // R-P4
    summary:
      'Found a gap in community-sourced discovery for coastal Karnataka and pivoted from a campus travel app to a discovery platform.', // R-P4.1
    points: [
      'AI recommendations and gamification for Udupi and Dakshina Kannada.', // R-P4.1
      'Live MVP shipped in one week.', // R-P4.1
    ],
    stack: 'Built on Base44', // Priyanshu (decision 6)
    href: '/work/karavali',
    external: { label: 'Live MVP', href: 'https://karavali.base44.app' }, // Priyanshu (decision 5)
  },
  {
    slug: 'audit-ai-copilot',
    title: 'Audit AI Copilot',
    kicker: 'AI-powered internal audit risk review', // R-P3, PRD
    chips: [{ label: 'Ongoing' }], // R-P3
    summary:
      'Auditors upload documents and query anomalies in natural language. I directed the build: a deterministic rule engine, an LLM review layer, and PDF reports.', // R-P3.1
    points: ['Wrote the PRD: three personas, prioritised user stories, roadmap and pricing.'], // R-P3.1, PRD
    stack: 'FastAPI · Next.js · Groq', // R-P3
    href: '/work/audit-ai-copilot',
  },
];

export const archive: WorkCard[] = [
  {
    slug: 'anpr',
    title: 'ANPR',
    kicker: 'Automatic number plate recognition · B.Tech final-year project', // R-P5
    chips: [{ label: 'Jan – May 2026' }], // R-P5
    summary: 'A real-time licence plate detection and reading pipeline.', // R-P5.1
    points: ['YOLOv8n at 89.1% mAP@50, with OpenCV and Tesseract OCR.'], // R-P5.1
    href: '/work/anpr',
  },
  {
    slug: 'itc-powerhouse',
    title: 'ITC powerhouse mapping',
    kicker: 'Electrical / Powerhouse Intern · ITC Limited, Munger', // R-E2
    chips: [{ label: 'Jun – Jul 2024' }], // R-E2
    summary: 'Mapped power distribution across 15+ sub-distribution boards (RUPS, bypass, DG supply).', // R-E2.1
    points: ['Analysed switchover logic and single points of failure; documented findings for operator training.'], // R-E2.1
    href: '/work/itc-powerhouse',
  },
];
