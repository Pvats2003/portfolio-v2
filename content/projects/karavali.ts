import type { CaseStudy } from '../types';

// Sources: resume (R-P4, R-P4.1) and Priyanshu's answers (live URL; built on Base44).
// The resume is thin on Karavali, so most of the "why" is a visible TODO rather than a guess.

export const karavali: CaseStudy = {
  slug: 'karavali',
  index: '03',
  title: 'Karavali',
  kicker: 'Community-driven local discovery for coastal Karnataka', // R-P4
  org: 'Solo founder',
  chips: [{ label: 'Live MVP', tone: 'ok' }, { label: 'Apr 2026 – Present' }], // R-P4
  tldr: [
    'I found a gap in community-sourced local discovery for coastal Karnataka.', // R-P4.1
    'So I pivoted from a campus travel app to a discovery platform with AI recommendations and gamification, for Udupi and Dakshina Kannada.', // R-P4.1
    'I shipped the live MVP in one week, as a solo founder, on Base44.', // R-P4.1, Priyanshu
  ],
  meta: [
    { label: 'Role', value: 'Solo founder' }, // R-P4
    { label: 'Timeline', value: 'April 2026 – present' }, // R-P4
    { label: 'Built on', value: 'Base44' }, // Priyanshu (decision 6)
    { label: 'Region', value: 'Udupi & Dakshina Kannada' }, // R-P4.1
  ],
  links: [{ label: 'karavali.base44.app', href: 'https://karavali.base44.app' }], // Priyanshu (decision 5)
  chapters: [
    {
      id: 'problem',
      section: 'Problem',
      heading: 'Local knowledge that never reaches a visitor',
      blocks: [
        { type: 'p', text: 'Coastal Karnataka had no good way to surface community-sourced local discovery.' }, // R-P4.1
        { type: 'todo', text: 'What showed you the gap — conversations, your own trips, what existing apps got wrong?' },
      ],
    },
    {
      id: 'pivot',
      section: 'Decision',
      heading: 'The pivot',
      blocks: [
        {
          type: 'beforeAfter',
          before: { label: 'Before', points: ['A campus travel app'] }, // R-P4.1
          after: {
            label: 'After',
            points: [
              'A community-driven discovery platform for coastal Karnataka', // R-P4.1
              'AI recommendations', // R-P4.1
              'Gamification to encourage exploring', // R-P4.1
              'Focused on Udupi and Dakshina Kannada', // R-P4.1
            ],
          },
        },
        { type: 'todo', text: 'Why you pivoted, and what you let go of from the campus travel idea.' },
      ],
    },
    {
      id: 'speed',
      section: 'Decision',
      heading: 'Ship in a week',
      blocks: [
        { type: 'p', text: 'I built the MVP on Base44 and had it live in one week.' }, // R-P4.1, Priyanshu
        { type: 'todo', text: 'Why Base44, and what you traded for that speed.' },
      ],
    },
    {
      id: 'outcome',
      section: 'Outcome',
      heading: 'A live MVP',
      blocks: [
        { type: 'p', text: 'Karavali is live at karavali.base44.app. No user or traction numbers are published here.' }, // Priyanshu
      ],
    },
    {
      id: 'learned',
      section: 'Learned',
      heading: 'What I learned',
      blocks: [{ type: 'todo', text: 'One or two lessons from founding Karavali, in your own words.' }],
    },
    {
      id: 'next',
      section: 'Next',
      heading: 'What’s next',
      blocks: [{ type: 'todo', text: 'What comes next for Karavali.' }],
    },
  ],
};
