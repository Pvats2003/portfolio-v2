import type { CaseStudy } from '../types';

// Flagship: Instawork → City Ops OS, written as a decision log.
// Tags after each line name the resume line it comes from (PLAN.md, Appendix A).
// Anything the resume doesn't say is a TODO (hidden on the live site), never a guess.
// Screenshots: public/work/city-ops-os/ (demo data; names replaced with demo text).

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
  hero: {
    type: 'devicePair',
    desktop: 'cityOpsDesktop',
    phone: 'cityOpsPhone',
    desktopLabel: 'Manager · command center',
    phoneLabel: 'Field officer · cockpit',
  },
  // Visual-first: every chapter pairs its text (under ~80 words) with a screenshot, diagram or table.
  chapters: [
    {
      id: 'context',
      section: 'Problem',
      heading: 'No single view of a city',
      blocks: [
        {
          type: 'facts',
          items: [
            { value: '50+', label: 'field staff coordinated' }, // R-E1.1
            { value: '10,000+', label: 'recording hours logged' }, // R-E1.1
            { value: '116', label: 'businesses in my field recording guide' }, // R-E1.2
          ],
        },
        {
          type: 'p',
          text: 'Robots learn physical tasks from first-person recordings of people doing real work. I run day-to-day field execution for that data collection in Andhra Pradesh — mainly Rajampet and Kadapa — and Karnataka.', // R-E1.0, R-E1.1
        },
        {
          type: 'p',
          text: 'Field updates lived in unstructured WhatsApp threads and scattered Sheets. Nobody could see one city’s operation in one place.', // R-E1.3
        },
        {
          type: 'todo',
          text: 'Any other real constraints — connectivity at sites, the devices field staff use, who needed the city view.',
        },
      ],
    },
    {
      id: 'prototypes',
      section: 'Decision',
      heading: 'Three prototypes, one per symptom',
      blocks: [
        {
          type: 'pipeline',
          caption: 'What I tried first, in order',
          steps: [
            { label: 'Live command center', detail: '10-sheet workbook · Apps Script JSON API · Slack/email alerts · 30 s dashboard' }, // R-E1.3
            { label: 'OCR form', detail: 'React + Claude Vision reads recording metadata from phone screenshots' }, // R-E1.4
            { label: 'OpsIntel', detail: 'WhatsApp parser feeding a Node.js / WebSocket dashboard' }, // R-E1.4
          ],
        },
        {
          type: 'p',
          text: 'The OCR form taught me the most. Reading metadata off small phone screenshots was unreliable, so I iterated on compression, on cropping to the relevant region, and on parsing replies wrapped in code fences. Accuracy improved, but the form wasn’t adopted.', // Priyanshu
        },
        { type: 'todo', text: 'What the command center solved, and where it fell short.' },
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
          text: 'Sheets, Apps Script, a standalone OCR form and a Node.js backend — for a single city. That led directly to City Ops OS.', // R-P1.1, R-E1.4
        },
      ],
    },
    {
      id: 'decision',
      section: 'Decision',
      heading: 'One local-first view per city',
      blocks: [
        {
          type: 'tradeoff',
          caption: 'What local-first gave, and what it cost',
          columnLabel: 'With local-first',
          rows: [
            { dimension: 'Accounts', result: 'None needed', kind: 'gained' }, // R-P1.2
            { dimension: 'Infra budget', result: 'Zero — no backend, servers, or paid APIs', kind: 'gained' }, // R-P1.2
            { dimension: 'Setup', result: 'None', kind: 'gained' }, // R-P1.2
            { dimension: 'Cross-device sync', result: 'Deliberately traded away', kind: 'given-up' }, // R-P1.2
          ],
        },
        {
          type: 'p',
          text: 'All state lives in the browser, so the tool needs no accounts, no infra budget and no setup. I deliberately gave up cross-device sync to get there.', // R-P1.2
        },
      ],
    },
    {
      id: 'manager',
      section: 'What I built',
      heading: 'The manager’s view: the whole city on one screen',
      blocks: [
        {
          type: 'shot',
          media: 'cityOpsDesktop',
          callouts: [
            { x: 52.5, y: 13.5, label: 'Plan the day, assign field officers, start sessions, report issues' },
            { x: 20.5, y: 31, label: 'Recording hours against the day’s target' },
            { x: 43, y: 31, label: 'Businesses, field officers, live sessions, issues and fleet at a glance' },
            { x: 19.5, y: 76.5, label: 'Field execution checks: evidence, location mismatches, prechecks' },
            { x: 19.5, y: 92, label: 'A “What needs my attention?” feed' },
          ],
        },
        {
          type: 'p',
          text: 'I designed City Ops OS and directed the build through Claude Code: a React app with Zustand state persisted to localStorage, hosted on Firebase Hosting.', // R-P1, R-S4, Priyanshu
        },
      ],
    },
    {
      id: 'field-officer',
      section: 'What I built',
      heading: 'The field officer’s view: today, on a phone',
      blocks: [
        {
          type: 'shot',
          media: 'cityOpsPhone',
          callouts: [
            { x: 8, y: 11.5, label: 'Today’s visits, in order, with their status' },
            { x: 92, y: 15.2, label: 'Navigate to each visit' },
            { x: 13, y: 96, label: 'Today, Sessions, Issues and Profile tabs' },
          ],
        },
      ],
    },
    {
      id: 'outcome',
      section: 'Outcome',
      heading: 'Four systems became one — now being integrated',
      blocks: [
        { type: 'diagram', name: 'converge' },
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
