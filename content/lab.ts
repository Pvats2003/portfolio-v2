// Shared content for the Phase 1 visual directions (/lab/a, /lab/b, /lab/c).
// Every line is taken from the resume; the tag after each item names the resume
// line it comes from (IDs are listed in PLAN.md, Appendix A).
// All three directions render this same content so they can be judged on design alone.

export const RESUME_PDF = '/resume/Priyanshu_Vats_Resume_PV.pdf';

export type HeadlineOption = {
  id: 'A' | 'B' | 'C';
  /** Main headline. Scale (what he ran) and tool (what he designed) are kept separate. */
  lines: string[];
};

export const headlineOptions: HeadlineOption[] = [
  // R-E1.1 (runs field execution) + R-E1.3/R-E1.4 (prototyped tools) + R-S4 (ships)
  {
    id: 'A',
    lines: ['I run robotics data collection in the field.', 'Then I design the tools that fix how it runs.'],
  },
  // R-S1 (50+ staff, 10,000+ hours) + R-P1.1 (single per-city operating view)
  {
    id: 'B',
    lines: ['50+ field staff. 10,000+ recording hours.', 'I run the operation. I designed the tool that puts each city in one view.'],
  },
  // R-E1.3 (WhatsApp threads) + R-P1 (City Ops OS, live)
  {
    id: 'C',
    lines: ['Field operations lived in WhatsApp threads.', 'I scoped, designed, and shipped the fix.'],
  },
];

// R-E1 + R-H3 + target roles from the brief
export const subline =
  'Operations Management Intern, Field Operations at Instawork Robotics Labs. Based in Bengaluru — open to APM, Product Ops, and Founder’s Office roles.';

export const ctas = {
  primary: { label: 'Read the City Ops OS story', href: '#flagship' },
  secondary: { label: 'Resume (PDF)', href: RESUME_PDF },
};

export type Stat = {
  /** Short channel label used by some directions. */
  key: string;
  value: string;
  /** Numeric part, for directions that animate a counter. Absent for text stats. */
  count?: number;
  suffix?: string;
  label: string;
  source: string;
};

export const stats: Stat[] = [
  { key: 'HRS', value: '10,000+', count: 10000, suffix: '+', label: 'recording hours logged', source: 'R-E1.1' },
  { key: 'CREW', value: '50+', count: 50, suffix: '+', label: 'field staff coordinated', source: 'R-E1.1' },
  { key: 'SITES', value: '116', count: 116, label: 'businesses mapped across 19 categories', source: 'R-E1.2' },
  { key: 'OS', value: 'City Ops OS', label: 'being integrated into Instawork’s internal ops tool', source: 'R-P1.1' },
];

export const flagship = {
  eyebrow: 'Flagship · Instawork Robotics Labs',
  title: 'City Ops OS',
  kicker: 'Local-first operating system for city field ops', // R-P1
  summary:
    'One city’s operations were spread across four separate systems. I consolidated them into a single per-city operating view.', // R-P1.1
  before: ['Google Sheets', 'Apps Script', 'OCR form', 'Node.js backend'], // R-P1.1
  after: 'One per-city view', // R-P1.1
  tradeoff: 'No accounts, no infra budget, no setup — deliberately traded away cross-device sync.', // R-P1.2
  stack: ['React', 'Zustand', 'localStorage', 'Firebase Hosting'], // R-P1
  status: 'Live',
  period: '2026 – Present', // R-P1
  outcome: 'Design now being integrated into Instawork’s internal ops tool.', // R-P1.1
  cta: 'Read the decision log',
};
