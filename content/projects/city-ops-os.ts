import type { CaseStudy } from '../types';

// Flagship: Instawork → City Ops OS, written as a decision log.
// Tags after each line name the resume line it comes from (PLAN.md, Appendix A).
// Anything the resume doesn't say is a visible TODO, never a guess.

export const cityOpsOs: CaseStudy = {
  slug: 'city-ops-os',
  index: '01',
  title: 'City Ops OS',
  kicker: 'Local-first operating system for city field ops', // R-P1
  org: 'Instawork Robotics Labs',
  chips: [
    { label: 'Live', tone: 'ok' }, // R-P1
    { label: '2026 – Present' }, // R-P1
    { label: 'Being integrated', tone: 'accent' }, // R-P1.1
  ],
  tldr: [
    'I run day-to-day field execution for robot-training data collection: 50+ field staff, 10,000+ recording hours logged.', // R-E1.1
    'Field updates were trapped in WhatsApp threads and scattered Sheets. I prototyped three tools and saw one city’s ops would sprawl across four systems.', // R-E1.3, R-E1.4
    'So I designed and shipped City Ops OS — one local-first, zero-cost view per city. Its design is now being integrated into Instawork’s internal ops tool.', // R-P1.1, R-P1.2
  ],
  meta: [
    { label: 'Role', value: 'Operations Management Intern, Field Operations' }, // R-E1
    { label: 'Company', value: 'Instawork Robotics Labs · May 2026 – Present' }, // R-E1
    { label: 'City Ops OS', value: 'Live · 2026 – Present' }, // R-P1
    { label: 'Stack', value: 'React · Zustand · localStorage · Firebase Hosting' }, // R-P1
    { label: 'How it was made', value: 'AI-assisted development — I directed the build through Claude Code' }, // R-S4 + Priyanshu (confirmed)
    { label: 'Where', value: 'Andhra Pradesh (Rajampet, Kadapa) & Karnataka' }, // R-E1.0, R-E1.1
  ],
  chapters: [
    {
      id: 'context',
      section: 'Problem',
      heading: 'Context: robots learn from people doing real work',
      blocks: [
        {
          type: 'p',
          text: 'Robots learn physical tasks from examples. Egocentric vision-language-action (VLA) data is first-person recording of people doing real work, which robotics models learn from.',
        },
        {
          type: 'p',
          text: 'At Instawork Robotics Labs I run day-to-day field execution for that data collection across Andhra Pradesh — primarily Rajampet and Kadapa — and Karnataka. I coordinate Field Officers, Data Captains, and Data Collectors, and own the task and activity libraries and SOD / MOD / EOD reporting.', // R-E1.0, R-E1.1
        },
        {
          type: 'facts',
          items: [
            { value: '50+', label: 'field staff coordinated' }, // R-E1.1
            { value: '10,000+', label: 'recording hours logged' }, // R-E1.1
            { value: 'SOD · MOD · EOD', label: 'daily reporting I own' }, // R-E1.1
          ],
        },
      ],
    },
    {
      id: 'site-sourcing',
      section: 'Problem',
      heading: 'Finding places to record',
      blocks: [
        {
          type: 'p',
          text: 'Recording happens in walk-in, fixed-premises sites, so part of the job is sourcing and validating them.', // R-E1.2
        },
        {
          type: 'list',
          items: [
            'Authored the South India VLA Field Recording Guide: 116 businesses across 19 categories.', // R-E1.2
            'Built cluster-wise lead directories with two-shift daily field plans for the Rajampet–Kadapa corridor.', // R-E1.2
            'Compiled high-dexterity business directories — tailors, cobblers, goldsmiths, repair shops — across 10 Bengaluru neighbourhoods.', // R-E1.2
          ],
        },
      ],
    },
    {
      id: 'real-problem',
      section: 'Problem',
      heading: 'The real problem: no single view of a city',
      blocks: [
        {
          type: 'p',
          text: 'Field updates lived in unstructured WhatsApp threads and scattered Sheets. Nobody could see one city’s operation in one place.', // R-E1.3
        },
      ],
    },
    {
      id: 'constraints',
      section: 'Constraints',
      heading: 'What any fix had to respect',
      blocks: [
        {
          type: 'list',
          items: [
            'Updates arrive the way the field already works: WhatsApp messages and Sheets.', // R-E1.3
            'I wanted the tool to need no accounts, no infra budget, and no setup.', // R-P1.2
          ],
        },
        {
          type: 'todo',
          text: 'Any other real constraints — connectivity at sites, the devices field staff use, who needed the city view.',
        },
      ],
    },
    {
      id: 'prototype-1',
      section: 'Decision',
      heading: 'Prototype 1 — a live command center',
      blocks: [
        {
          type: 'p',
          text: 'My first attempt was a live command center to centralise tracking: a 10-sheet workbook, an Apps Script JSON API with automated Slack and email alerts, and a dashboard refreshing every 30 seconds.', // R-E1.3
        },
        {
          type: 'facts',
          items: [
            { value: '10', label: 'sheets in the workbook' }, // R-E1.3
            { value: '30 s', label: 'dashboard refresh' }, // R-E1.3
          ],
        },
        { type: 'todo', text: 'What the command center solved, and where it fell short.' },
      ],
    },
    {
      id: 'prototype-2',
      section: 'Decision',
      heading: 'Prototype 2 — an OCR form for recording metadata',
      blocks: [
        {
          type: 'p',
          text: 'Next I prototyped a React form that uses Claude Vision to read recording metadata straight from phone screenshots.', // R-E1.4
        },
        {
          type: 'p',
          text: 'Reading metadata off small phone screenshots was unreliable. I iterated on image compression, on parsing model responses that came back wrapped in markdown code fences, and on cropping to the relevant region of the screen.', // Priyanshu
        },
        {
          type: 'p',
          text: 'That improved accuracy, but the form wasn’t adopted — and testing it alongside the other two tools is what showed me where this was heading.', // Priyanshu
        },
      ],
    },
    {
      id: 'prototype-3',
      section: 'Decision',
      heading: 'Prototype 3 — OpsIntel',
      blocks: [
        {
          type: 'p',
          text: 'To attack the WhatsApp problem directly, I prototyped OpsIntel: a parser for WhatsApp updates feeding a Node.js / WebSocket dashboard.', // R-E1.4
        },
      ],
    },
    {
      id: 'insight',
      section: 'Turning point',
      heading: 'Testing all three showed one city’s ops would sprawl across four separate systems.', // R-E1.4
      blocks: [
        { type: 'diagram', name: 'sprawl' },
        {
          type: 'p',
          text: 'Together, the three prototypes meant Sheets, Apps Script, a standalone OCR form, and a Node.js backend — for a single city. That realisation led directly to City Ops OS.', // R-P1.1, R-E1.4
        },
      ],
    },
    {
      id: 'decision',
      section: 'Decision',
      heading: 'The decision: one local-first view per city',
      blocks: [
        {
          type: 'p',
          text: 'I consolidated everything into a single per-city operating view, and chose a local-first, zero-cost architecture: all state lives in the browser, with no backend, servers, or paid APIs.', // R-P1.1, R-P1.2
        },
        {
          type: 'tradeoff',
          caption: 'What local-first gave, and what it cost',
          rows: [
            { dimension: 'Accounts', result: 'None needed', kind: 'gained' }, // R-P1.2
            { dimension: 'Infra budget', result: 'Zero — no backend, servers, or paid APIs', kind: 'gained' }, // R-P1.2
            { dimension: 'Setup', result: 'None', kind: 'gained' }, // R-P1.2
            { dimension: 'Cross-device sync', result: 'Deliberately traded away', kind: 'given-up' }, // R-P1.2
          ],
        },
        { type: 'quote', text: 'I deliberately traded away cross-device sync so the tool would need no accounts, no budget, and no setup.' }, // R-P1.2
      ],
    },
    {
      id: 'built',
      section: 'What I built',
      heading: 'Four systems became one',
      blocks: [
        { type: 'diagram', name: 'converge' },
        {
          type: 'p',
          text: 'City Ops OS is a React app with Zustand state persisted to localStorage, hosted on Firebase Hosting.', // R-P1
        },
      ],
    },
    {
      id: 'outcome',
      section: 'Outcome',
      heading: 'Being integrated into Instawork’s internal ops tool',
      blocks: [
        { type: 'p', text: 'City Ops OS is live, and its design is now being integrated into Instawork’s internal ops tool.' }, // R-P1, R-P1.1
        { type: 'todo', text: 'Confirm the live app (city-ops-cf81f.web.app) is safe to link publicly, and your role in the integration.' },
      ],
    },
    {
      id: 'learned',
      section: 'Learned',
      heading: 'What I learned',
      blocks: [{ type: 'todo', text: 'Two or three lessons in your own words.' }],
    },
    {
      id: 'next',
      section: 'Next',
      heading: 'What’s next',
      blocks: [{ type: 'todo', text: 'What you would do next with City Ops OS, in your own words.' }],
    },
  ],
};

/** The four systems one city's ops would have needed (R-P1.1), with what each came from (R-E1.3, R-E1.4). */
export const fourSystems = [
  { name: 'Google Sheets', from: '10-sheet workbook' },
  { name: 'Apps Script', from: 'JSON API + alerts' },
  { name: 'OCR form', from: 'React + Claude Vision' },
  { name: 'Node.js backend', from: 'OpsIntel dashboard' },
];
