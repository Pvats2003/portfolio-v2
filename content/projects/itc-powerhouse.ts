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
  hero: {
    type: 'pipeline',
    caption: 'What the internship covered, end to end.',
    steps: [
      { label: 'Three supply paths', detail: 'RUPS · bypass · DG supply' }, // R-E2.1
      { label: 'Switchover logic', detail: 'Analysed', accent: true }, // R-E2.1
      { label: '15+ sub-distribution boards', detail: 'Mapped' }, // R-E2.1
      { label: 'Findings', detail: 'Operator training · stakeholder presentations' }, // R-E2.1
    ],
  },
  chapters: [
    {
      id: 'work',
      section: 'What I built',
      heading: 'A map of how power actually flows',
      blocks: [
        {
          type: 'facts',
          items: [
            { value: '15+', label: 'sub-distribution boards mapped' }, // R-E2.1
            { value: '3', label: 'supply paths: RUPS, bypass, DG' }, // R-E2.1
            { value: '2', label: 'audiences: operators, stakeholders' }, // R-E2.1
          ],
        },
        {
          type: 'p',
          text: 'I analysed the switchover logic between the three supply paths and where a single failure could take something down, then documented it for operator training and stakeholder presentations.', // R-E2.1
        },
      ],
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
