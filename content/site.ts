// Homepage, About, and contact copy. Edit text here; components never hard-code it.
// Tags name the resume line each fact comes from (PLAN.md, Appendix A).
import { identity, RESUME_PDF } from './resume';

export { identity, RESUME_PDF };

// Canonical URL: the Vercel preview until a domain is bought (PLAN.md, decision 8).
export const SITE_URL = 'https://portfolio-v2-chi-two-55.vercel.app';

export const hero = {
  eyebrow: 'Ops log · Priyanshu Vats · Bengaluru',
  // Headline option C (chosen). Scale lives in the proof strip, not the headline.
  headline: ['Field operations lived in WhatsApp threads.', 'I scoped, designed, and shipped the fix.'], // R-E1.3, R-P1
  subline:
    'Operations Management Intern, Field Operations at Instawork Robotics Labs. Based in Bengaluru — open to APM, Product Ops, and Founder’s Office roles.', // R-E1, R-H3, brief
  primaryCta: { label: 'Read the City Ops OS story', href: '/work/city-ops-os' },
  secondaryCta: { label: 'Resume (PDF)', href: RESUME_PDF },
};

export type ProofStat = { key: string; value: string; label: string; numeric: boolean };

export const proof: ProofStat[] = [
  { key: 'HRS', value: '10,000+', label: 'recording hours logged', numeric: true }, // R-E1.1
  { key: 'CREW', value: '50+', label: 'field staff coordinated', numeric: true }, // R-E1.1
  { key: 'SITES', value: '116', label: 'businesses mapped across 19 categories', numeric: true }, // R-E1.2
  { key: 'OS', value: 'City Ops OS', label: 'being integrated into Instawork’s internal ops tool', numeric: false }, // R-P1.1
];

/** How I work: the method, each step tied to one real example. */
export const howIWork = [
  {
    step: 'Discover',
    line: 'Find the problem underneath the symptom.',
    example: 'Diagnosed that field updates lived in unstructured WhatsApp threads and scattered Sheets.', // R-E1.3
  },
  {
    step: 'Structure',
    line: 'Turn ambiguity into something that can be scoped.',
    example: 'Scoped Audit AI Copilot across three personas with MoSCoW, a full PRD, and a YC application.', // R-P3.1
  },
  {
    step: 'Build',
    line: 'Ship the smallest real version, fast.',
    example: 'Shipped Karavali’s live MVP in one week, as solo founder.', // R-P4, R-P4.1
  },
  {
    step: 'Operate',
    line: 'Run it in the real world, every day.',
    example: 'Run day-to-day field execution: 50+ field staff and SOD / MOD / EOD reporting.', // R-E1.1
  },
  {
    step: 'Iterate',
    line: 'Let what happens next change the plan.',
    example: 'Three prototypes showed one city would sprawl across four systems — so I consolidated them into City Ops OS.', // R-E1.4, R-P1.1
  },
];

export const contact = {
  line: 'Open to APM, Product Ops, and Founder’s Office roles in Bengaluru.', // brief
  links: [
    { label: 'Email', value: identity.email, href: `mailto:${identity.email}` },
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

/** Experience & leadership, condensed for the homepage. The full wording is in content/resume.ts. */
export const record = [
  {
    period: 'May 2026 – Present', // R-E1
    title: 'Operations Management Intern, Field Operations',
    org: 'Instawork Robotics Labs',
    line: 'Run day-to-day field execution for robot-training data collection across Andhra Pradesh and Karnataka: 50+ field staff, 10,000+ recording hours, SOD / MOD / EOD reporting.', // R-E1.1
    current: true,
  },
  {
    period: 'Jun – Jul 2024', // R-E2
    title: 'Electrical / Powerhouse Intern',
    org: 'ITC Limited, Munger, Bihar',
    line: 'Mapped power distribution across 15+ sub-distribution boards; analysed switchover logic and single points of failure.', // R-E2.1
  },
  {
    period: '2024 – 2025', // R-ED1.2
    title: 'Revels, MIT Manipal’s cultural fest — Painting & Publicity',
    org: 'Leadership',
    line: 'Led a 10-member core team in 2025, and 30 volunteers in 2024.', // R-ED1.2
  },
  {
    period: 'May 2026', // R-ED1
    title: 'B.Tech, Electronics & Communication Engineering',
    org: 'MIT Manipal',
    line: 'Certifications: Google UX Design (Coursera), IBM Business Analyst, IBM Program Manager.', // R-ED1.1
  },
];
