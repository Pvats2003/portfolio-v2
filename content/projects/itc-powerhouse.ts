import type { CaseStudy } from '../types';

// Source: resume only (R-E2, R-E2.1).

export const itcPowerhouse: CaseStudy = {
  slug: 'itc-powerhouse',
  index: '06',
  title: 'ITC powerhouse mapping',
  kicker: 'Electrical / Powerhouse Intern · ITC Limited, Munger, Bihar', // R-E2
  org: 'Internship',
  chips: [{ label: 'Jun – Jul 2024' }], // R-E2
  tldr: [
    'An electrical internship at ITC Limited’s powerhouse in Munger, Bihar.', // R-E2
    'I mapped power distribution across 15+ sub-distribution boards fed by RUPS, bypass and DG supply.', // R-E2.1
    'Then I analysed the switchover logic and single points of failure, and documented it for operator training and stakeholder presentations.', // R-E2.1
  ],
  meta: [
    { label: 'Role', value: 'Electrical / Powerhouse Intern' }, // R-E2
    { label: 'Where', value: 'ITC Limited, Munger, Bihar' }, // R-E2
    { label: 'When', value: 'June – July 2024' }, // R-E2
    { label: 'Scope', value: '15+ sub-distribution boards' }, // R-E2.1
  ],
  chapters: [
    {
      id: 'work',
      section: 'What I built',
      heading: 'A map of how power actually flows',
      blocks: [
        {
          type: 'list',
          items: [
            'Mapped power distribution across 15+ sub-distribution boards.', // R-E2.1
            'Covered the three supply paths: RUPS, bypass and DG supply.', // R-E2.1
            'Analysed the switchover logic between them, and where a single failure could take something down.', // R-E2.1
          ],
        },
      ],
    },
    {
      id: 'outcome',
      section: 'Outcome',
      heading: 'Documentation other people used',
      blocks: [{ type: 'p', text: 'The findings were documented for operator training and for stakeholder presentations.' }], // R-E2.1
    },
    {
      id: 'learned',
      section: 'Learned',
      heading: 'What carried over',
      blocks: [
        { type: 'todo', text: 'What this taught you that you still use — in your own words (for example, reading a whole system before trusting any one part of it).' },
      ],
    },
  ],
};
