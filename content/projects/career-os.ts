import type { CaseStudy } from '../types';

// Sources: resume (R-P2, R-P2.1, R-P2.2) and the project README
// (github.com/Pvats2003/career_ops_intel, README.md — "README" below).
// Where the resume and the README disagree, the README (what's actually built) wins on this page,
// and the conflict is listed in TODO.md.

export const careerOs: CaseStudy = {
  slug: 'career-os',
  index: '02',
  title: 'Career OS',
  kicker: 'Autonomous job discovery & application agent', // R-P2
  org: 'Self-initiated',
  chips: [{ label: 'Ongoing' }, { label: '350 passing tests', tone: 'ok' }, { label: 'Nothing auto-submits', tone: 'accent' }], // R-P2, README
  tldr: [
    'A job-search agent designed around one rule: it never fabricates a fact about the candidate.', // README core principle, R-P2.2
    'Every candidate fact carries its source, a confidence score and a verified flag. Anything unknown stays “UNKNOWN” and goes to a human.', // README, R-P2.2
    'It discovers, de-duplicates and matches jobs today, backed by 350 passing tests — and nothing in it can submit an application on its own.', // README
  ],
  meta: [
    { label: 'Role', value: 'Designed the system and directed the build' }, // R-P2.1 ("Designed…"), R-S4
    { label: 'Status', value: 'Ongoing — built in reviewed phases (discovery, matching, resume validation, application engine)' }, // R-P2, README
    { label: 'Stack', value: 'Python · Pydantic · SQLAlchemy 2.0 · Alembic · SQLite · Typer CLI · Anthropic API · pytest' }, // README
    { label: 'Quality', value: '350 passing tests · clean ruff and mypy · no ORM–migration drift' }, // README
  ],
  links: [{ label: 'Code on GitHub', href: 'https://github.com/Pvats2003/career_ops_intel' }],
  hero: { type: 'illustration', name: 'career-os' },
  chapters: [
    {
      id: 'problem',
      section: 'Problem',
      heading: 'The risk is what the system says about you',
      blocks: [
        {
          type: 'beforeAfter',
          before: { label: 'A naive agent', points: ['Guesses a salary expectation', 'Guesses visa status', 'Claims skills it can’t prove'] },
          after: {
            label: 'Career OS',
            points: [
              'Unknown facts stay “UNKNOWN”, confidence 0.0', // README
              'Salary, visa and legal questions go to a human', // README, R-P2.2
              'Every claim traces back to the resume', // README (Phase 4)
            ],
          },
        },
        {
          type: 'p',
          text: 'Finding jobs can run unattended. Filling in an application can’t: a guessed salary, visa status or skill claim on a real application is a real problem — and exactly what a naive agent would guess.',
        },
        { type: 'quote', text: 'High-quality applications over high application count.' }, // README core principle
      ],
    },
    {
      id: 'deterministic-first',
      section: 'Decision',
      heading: 'Deterministic first; the LLM only where judgment is needed',
      blocks: [
        {
          type: 'tradeoff',
          caption: 'What the split bought, and what it gave up',
          columnLabel: 'Choice',
          rows: [
            { dimension: 'Explainability', result: 'Every deterministic sub-score is traceable', kind: 'gained' }, // README
            { dimension: 'Cost', result: 'LLM skipped for clearly decided matches — 2 of 4 sample jobs never needed a call', kind: 'gained' }, // README
            { dimension: 'Availability', result: 'Runs with no API key, deterministic-only', kind: 'gained' }, // README
            { dimension: 'Auto-apply without a second opinion', result: 'Never — without the semantic stage, a decision is capped at REVIEW', kind: 'given-up' }, // README
          ],
        },
        {
          type: 'p',
          text: 'Skills, education, location, seniority and eligibility are pattern-matchable, so they’re scored deterministically: no LLM, no cost, always explainable. Only role alignment, experience and project relevance go to a semantic stage — skipped when cheap signals already decide.', // README (Phase 3)
        },
      ],
    },
    {
      id: 'provenance',
      section: 'Decision',
      heading: 'Every fact carries its evidence',
      blocks: [
        {
          type: 'table',
          caption: 'What every candidate fact carries',
          head: ['Field', 'Holds'],
          rows: [
            ['Value', 'The fact itself'],
            ['Source', 'The file it came from'],
            ['Confidence', 'A confidence score'],
            ['Verified', 'True or false'],
            ['Evidence', 'For skills: self-declared, demonstrated, or only adjacent'],
          ],
        }, // README (Phase 1)
        {
          type: 'p',
          text: 'A resume validator proves on every parse that each fact traces back to the resume. To test it, fabricated facts — a fake job, employer, skill, achievement, certification and project — were injected: every one was caught, with zero false positives.', // README (Phase 4)
        },
        { type: 'quote', text: 'Automate the work. Never automate trust.' }, // brief
      ],
    },
    {
      id: 'hard-stops',
      section: 'Decision',
      heading: 'Hard stops that route to a human',
      blocks: [
        {
          type: 'table',
          caption: 'What stops the flow',
          head: ['Trigger', 'What happens'],
          rows: [
            ['Salary, visa, legal or demographic question', 'Never answered by a model; if the fact is unknown, a human decides'], // README (Phase 5), R-P2.2
            ['Any other drafted answer', 'Every name and multi-digit number must already exist in the resume or profile'], // README
            ['CAPTCHA, MFA or an unexpected form', 'The flow stops and hands over to a human'], // README (Phase 6A), R-P2.2
            ['Submit', 'Needs every gate at once: dry-run off, live mode on, top automation level or human approval, rate limits clear'], // README
          ],
        },
        { type: 'p', text: 'Today the only application provider refuses to submit, by design.' }, // README
      ],
    },
    {
      id: 'built',
      section: 'What I built',
      heading: 'The pipeline, as it stands',
      blocks: [
        {
          type: 'pipeline',
          caption: 'From candidate facts to a reviewed application — every stage writes an audit record.',
          steps: [
            { label: 'Candidate facts', detail: 'Source, confidence, verified' },
            { label: 'Discovery', detail: 'Greenhouse & Lever, official APIs' },
            { label: 'De-duplication', detail: 'Per-source ID + cross-source fingerprint' },
            { label: 'Matching', detail: 'Deterministic, then semantic' },
            { label: 'Decision', detail: 'Apply · Review · Save · Skip · Human' },
            { label: 'Answers', detail: 'Hard-block → answer bank → checked draft' },
            { label: 'Human review', detail: 'Nothing auto-submits', accent: true },
          ],
        }, // README (Phases 1–6A)
      ],
    },
    {
      id: 'outcome',
      section: 'Outcome',
      heading: 'Tested like it will touch real applications',
      blocks: [
        {
          type: 'facts',
          items: [
            { value: '350', label: 'passing unit tests' }, // README, R-P2.2
            { value: 'Clean', label: 'ruff and mypy' }, // README
            { value: '0', label: 'ORM–migration drift' }, // README
          ],
        },
        {
          type: 'p',
          text: 'The tests caught a real bug before it shipped: a hard-stop match would have attempted a state transition the state machine didn’t allow, crashing the first time it happened. The fix was a one-line change to the transition graph.', // README (adversarial review finding)
        },
      ],
    },
    {
      id: 'learned',
      section: 'Learned',
      heading: 'What I learned',
      blocks: [{ type: 'todo', text: 'Two or three lessons from building Career OS, in your own words.' }],
    },
    {
      id: 'next',
      section: 'Next',
      heading: 'What’s next',
      blocks: [
        {
          type: 'table',
          caption: 'What remains, from the README',
          head: ['Next', 'What it means'],
          rows: [
            ['Provider', 'A first real application provider against a structured ATS (Greenhouse or Lever), still dry-run gated'], // README (Phase 6B)
            ['Tailoring', 'Resume variants: reordering and emphasis, never new claims'], // README (What remains)
            ['Operations', 'A dashboard, a scheduler and notifications'], // README (What remains)
          ],
        },
      ],
    },
  ],
};
