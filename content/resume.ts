// Transcribed line-for-line from public/resume/Priyanshu_Vats_Resume_PV.pdf.
// This is the single source for resume facts on the site: the /resume page renders it,
// and other content files import from it rather than retyping facts.
// One deliberate difference: the PDF's Karavali URL has a typo ("karaval"); the live
// URL, confirmed by Priyanshu, is used here. See TODO.md.

export const RESUME_PDF = '/resume/Priyanshu_Vats_Resume_PV.pdf';

export const identity = {
  name: 'Priyanshu Vats',
  title: 'Product & Operations Builder · AI/Robotics Field Operations · 0→1 Internal Tools',
  location: 'Bengaluru, KA',
  phone: '+91-6206624775',
  email: 'priyanshu.vats03@gmail.com',
  linkedin: { label: 'linkedin.com/in/priyanshuvats-5a68aa292', href: 'https://linkedin.com/in/priyanshuvats-5a68aa292' },
  github: { label: 'github.com/Pvats2003', href: 'https://github.com/Pvats2003' },
};

export const summary =
  'ECE graduate running egocentric AI/robotics data-collection operations across Andhra Pradesh and Karnataka: 50+ field staff coordinated and 10,000+ recording hours logged. Diagnosed fragmented WhatsApp and Sheets workflows, prototyped tools to fix them, and consolidated the lessons into City Ops OS, whose design is now being integrated into Instawork’s internal ops tool. Ships products end-to-end through AI-assisted development (Claude Code).';

export type ResumeRole = {
  title: string;
  org: string;
  period: string;
  context?: string;
  bullets: string[];
};

export const experience: ResumeRole[] = [
  {
    title: 'Operations Management Intern, Field Operations',
    org: 'Instawork Robotics Labs',
    period: 'May 2026 – Present',
    context: 'Egocentric vision-language-action (VLA) training data for robotics · Andhra Pradesh & Karnataka',
    bullets: [
      'Run day-to-day field execution for robot-training data collection across Andhra Pradesh cities, primarily Rajampet and Kadapa, coordinating 50+ Field Officers, Data Captains, and Data Collectors and logging 10,000+ recording hours; own task/activity libraries and SOD/MOD/EOD reporting.',
      'Sourced and validated walk-in, fixed-premises recording sites: authored the South India VLA Field Recording Guide (116 businesses, 19 categories), cluster-wise lead directories with two-shift daily field plans for the Rajampet–Kadapa corridor, and high-dexterity business directories (tailors, cobblers, goldsmiths, repair shops) across 10 Bengaluru neighbourhoods.',
      'Diagnosed that field updates lived in unstructured WhatsApp threads and scattered Sheets; prototyped a live command center to centralise tracking: a 10-sheet workbook, an Apps Script JSON API with automated Slack/email alerts, and a dashboard refreshing every 30 seconds.',
      'Prototyped a React + Claude Vision OCR form that reads recording metadata from phone screenshots, and OpsIntel, a WhatsApp parser with a Node.js/WebSocket dashboard. Testing all three showed that one city’s ops would sprawl across four separate systems, which led directly to City Ops OS.',
    ],
  },
  {
    title: 'Electrical / Powerhouse Intern',
    org: 'ITC Limited, Munger, Bihar',
    period: 'Jun 2024 – Jul 2024',
    bullets: [
      'Mapped power distribution across 15+ sub-distribution boards (RUPS, bypass, DG supply); analysed switchover logic and single points of failure, documenting findings for operator training and stakeholder presentations.',
    ],
  },
];

export type ResumeProduct = {
  name: string;
  tagline: string;
  meta: string;
  link?: { label: string; href: string };
  bullets: string[];
};

export const products: ResumeProduct[] = [
  {
    name: 'City Ops OS',
    tagline: 'Local-First Operating System for City Field Ops',
    meta: 'Live · 2026 – Present · React · Zustand · localStorage · Firebase Hosting',
    // The PDF prints city-ops-cf81f.web.app; not linked on the site until Priyanshu confirms it's safe (TODO.md).
    bullets: [
      'Recognised that one city’s operations were spread across Sheets, Apps Script, a standalone OCR form, and a Node.js backend; consolidated them into a single per-city operating view. Design now being integrated into Instawork’s internal ops tool.',
      'Chose a local-first, zero-cost architecture (all state in the browser, no backend, servers, or paid APIs) so the tool needs no accounts, infra budget, or setup; deliberately traded away cross-device sync.',
    ],
  },
  {
    name: 'Career OS',
    tagline: 'Autonomous Job Discovery & Application Agent',
    meta: 'Ongoing',
    bullets: [
      'Designed a modular system spanning multi-source job discovery with cross-source dedup, deterministic + AI-assisted matching, resume/cover-letter generation, an application assistant, and a web dashboard.',
      'Enforced zero fabrication: every candidate fact carries source, confidence, and verified metadata; hard stops (salary, visa, CAPTCHA/MFA) escalate to a human and nothing auto-submits. Validated by 350+ passing automated tests.',
    ],
  },
  {
    name: 'Audit AI Copilot',
    tagline: 'AI Document Review Tool',
    meta: 'FastAPI · Next.js · Groq · Ongoing',
    bullets: [
      'Directed the build of a copilot where auditors upload documents and query anomalies in natural language, pairing a deterministic rule engine with an LLM review layer and PDF reports; scoped across three personas with MoSCoW, a full PRD, and a Y Combinator application.',
    ],
  },
  {
    name: 'Karavali',
    tagline: 'Community-Driven Local Discovery App',
    meta: 'Solo founder · Apr 2026 – Present · Live MVP',
    link: { label: 'karavali.base44.app', href: 'https://karavali.base44.app' },
    bullets: [
      'Identified a gap in community-sourced discovery for coastal Karnataka; pivoted from a campus travel app to a discovery platform with AI recommendations and gamification for Udupi and Dakshina Kannada; shipped a live MVP in one week.',
    ],
  },
  {
    name: 'ANPR',
    tagline: 'Automatic Number Plate Recognition',
    meta: 'B.Tech Final Year Project · Jan 2026 – May 2026',
    bullets: [
      'Built a real-time licence plate detection and reading pipeline with YOLOv8n (89.1% mAP@50), OpenCV, and Tesseract OCR.',
    ],
  },
];

export const skills: { group: string; items: string }[] = [
  {
    group: 'Product',
    items:
      'Product Discovery, User Research, Personas, UX Flows, Wireframing, PRDs, MoSCoW Prioritisation, Roadmapping, KPI Definition, Agile/Scrum, Sprint Planning',
  },
  {
    group: 'Operations',
    items: 'Field Operations, Workforce Coordination, Site Sourcing, Daily Ops Reporting, Process Documentation, Stakeholder Management',
  },
  { group: 'AI/Product Development', items: 'Claude Code, LLM/OCR integrations, React web apps, Apps Script automations' },
  { group: 'Tools', items: 'Google Sheets, Excel, Slack, Figma, Canva' },
];

export const education = {
  degree: 'B.Tech, Electronics & Communication Engineering',
  school: 'MIT Manipal',
  period: 'May 2026',
  certifications: ['Google UX Design (Coursera)', 'IBM Business Analyst', 'IBM Program Manager'],
  leadership:
    'Revels, MIT Manipal’s cultural fest (Painting & Publicity): led a 10-member core team (2025) and 30 volunteers (2024).',
};
