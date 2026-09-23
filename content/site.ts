// Homepage, About, and contact copy. Edit text here; components never hard-code it.
// Tags name the resume line each fact comes from (PLAN.md, Appendix A).
import { identity, RESUME_PDF } from './resume';

export { identity, RESUME_PDF };

// Canonical URL: the Vercel preview until a domain is bought (PLAN.md, decision 8).
export const SITE_URL = 'https://portfolio-v2-chi-two-55.vercel.app';

// Search engines are kept out until "go live". Flip to true then (it controls the robots meta tag and robots.txt).
export const INDEXABLE = true;

// Visible TODO(priyanshu) boxes are for the preview. On the live site they're hidden (a case-study chapter
// with nothing else in it disappears too); they stay in the content files and TODO.md until filled.
export const SHOW_TODOS = !INDEXABLE;

export const SITE_DESCRIPTION =
  'I run robotics data-collection operations in the field and ship the tools that fix them. Open to APM, Product Ops, and Founder’s Office roles in Bengaluru.';

export const hero = {
  eyebrow: 'Ops log · Priyanshu Vats · Bengaluru',
  // Headline option C (chosen). Scale lives in the proof strip, not the headline.
  headline: ['Field operations lived in WhatsApp threads.', 'I scoped, designed, and shipped the fix.'], // R-E1.3, R-P1
  subline: 'Operations Management Intern at Instawork Robotics Labs. Open to APM, Product Ops and Founder’s Office roles.', // R-E1, brief
  primaryCta: { label: 'See City Ops OS', href: '/work/city-ops-os' },
  secondaryCta: { label: 'Resume (PDF)', href: RESUME_PDF },
};

export type ProofStat = { key: string; value: string; label: string };

export const proof: ProofStat[] = [
  { key: 'HRS', value: '10,000+', label: 'recording hours logged' }, // R-E1.1
  { key: 'CREW', value: '50+', label: 'field staff coordinated' }, // R-E1.1
  { key: 'SITES', value: '116', label: 'recording businesses mapped' }, // R-E1.2
];

/** How I work: five one-line steps. */
export const howIWork = [
  { step: 'Discover', line: 'Find the real problem.' },
  { step: 'Structure', line: 'Scope the ambiguity.' },
  { step: 'Build', line: 'Ship small, fast.' },
  { step: 'Operate', line: 'Run it every day.' },
  { step: 'Iterate', line: 'Let results change the plan.' },
];

export const contact = {
  line: 'Open to APM, Product Ops, and Founder’s Office roles in Bengaluru.', // brief
  /** Homepage heading: the hero already says which roles. */
  short: 'Let’s talk.',
  links: [
    { label: 'Email', value: identity.email, href: `mailto:${identity.email}` },
    { label: 'Phone', value: identity.phone, href: `tel:${identity.phone.replace(/[^+\d]/g, '')}` }, // R-H3 (Q11: show it)
    { label: 'LinkedIn', value: identity.linkedin.label, href: identity.linkedin.href },
    { label: 'GitHub', value: identity.github.label, href: identity.github.href },
    { label: 'Resume', value: 'PDF', href: RESUME_PDF },
  ],
};

export const about = {
  // Arc from the brief: Bihar → MIT Manipal ECE → field ops in Andhra Pradesh → building products.
  story: [
    'From Bihar to MIT Manipal, where I studied Electronics & Communication Engineering (B.Tech, May 2026).', // brief, R-ED1
    'Then into the field: I run day-to-day execution for robot-training data collection in Andhra Pradesh — primarily Rajampet and Kadapa — and Karnataka, with 50+ field staff and 10,000+ recording hours logged.', // R-E1.1
    'In the field I saw updates living in WhatsApp threads and scattered Sheets, so I started building tools to fix it: three prototypes, then City Ops OS, whose design is now being integrated into Instawork’s internal ops tool.', // R-E1.3, R-E1.4, R-P1.1
  ],
  aiBuilding:
    'I ship products end-to-end through AI-assisted development. I scope the problem, design the system, and direct the build through Claude Code — a deliberate choice, so I can take a problem from diagnosis to a shipped product myself.', // R-S4, brief (rule 3)
  personalTodo: 'A personal paragraph in your own words — what drives you, outside the resume.',
};

/** Experience & leadership as a compact timeline. The full wording is in content/resume.ts. */
export const record = [
  { period: 'May 2026 – now', title: 'Operations Management Intern', org: 'Instawork Robotics Labs' }, // R-E1
  { period: 'May 2026', title: 'B.Tech, ECE', org: 'MIT Manipal' }, // R-ED1
  { period: '2024 – 2025', title: 'Revels core team lead', org: 'MIT Manipal' }, // R-ED1.2
  { period: 'Jun – Jul 2024', title: 'Powerhouse Intern', org: 'ITC Limited' }, // R-E2
];
