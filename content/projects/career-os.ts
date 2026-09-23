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
  chapters: [
    {
      id: 'problem',
      section: 'Problem',
      heading: 'The risk in automating applications is what the system says about you',
      blocks: [
        {
          type: 'p',
          text: 'Finding and triaging job postings is a search problem, and it can run unattended. Filling in an application is different: a guessed salary expectation, visa status or skill claim on a real application is a real problem, and it is exactly what a naive agent would guess.',
        },
        { type: 'quote', text: 'High-quality applications over high application count.' }, // README core principle
      ],
    },
    {
      id: 'constraints',
      section: 'Constraints',
      heading: 'Rules the system had to live by',
      blocks: [
        {
          type: 'list',
          items: [
            'Never fabricate. Anything not in the candidate knowledge base is the literal value UNKNOWN, with confidence 0.0 and verified = false.', // README
            'Humans in the loop by default. Automated submission is off unless several independent gates all agree.', // README
            'Only official, public, read-only job APIs — Greenhouse and Lever. Sources behind login walls or restrictive terms stay disabled.', // README
            'It must still work with no AI API key configured, and say so rather than silently degrading.', // README
          ],
        },
      ],
    },
    {
      id: 'deterministic-first',
      section: 'Decision',
      heading: 'Deterministic first; the LLM only where judgment is genuinely needed',
      blocks: [
        {
          type: 'p',
          text: 'Skills, education, location, seniority and eligibility are pattern-matchable, so they are scored deterministically — no LLM, no cost, always explainable. Only role alignment, experience similarity and project relevance go to a semantic stage, and that stage is skipped entirely when cheap signals have already decided the outcome.', // README (Phase 3)
        },
        {
          type: 'tradeoff',
          caption: 'What the split bought, and what it gave up',
          columnLabel: 'Choice',
          rows: [
            { dimension: 'Explainability', result: 'Every deterministic sub-score is traceable', kind: 'gained' }, // README
            { dimension: 'Cost', result: 'LLM skipped for excluded, hard-stopped or clearly poor matches — 2 of 4 sample jobs never needed a call', kind: 'gained' }, // README
            { dimension: 'Availability', result: 'Runs with no API key, deterministic-only', kind: 'gained' }, // README
            { dimension: 'Auto-apply without a second opinion', result: 'Never — without the semantic stage, a decision is capped at REVIEW', kind: 'given-up' }, // README
          ],
        },
      ],
    },
    {
      id: 'provenance',
      section: 'Decision',
      heading: 'Every fact carries its evidence',
      blocks: [
        {
          type: 'p',
          text: 'The candidate profile is a set of facts, each with a value, a source file, a confidence score and a verified flag. Skills also carry an evidence level: self-declared, demonstrated by a specific experience, or only adjacent — so matching can tell “has used it” from “claims it”.', // README (Phase 1)
        },
        {
          type: 'p',
          text: 'A resume validator then proves, on every parse, that each fact traces back to the actual resume file. To test it, fabricated facts — a fake job, employer, skill, achievement, certification and project — were injected into the real profile; every one was caught, with zero false positives on the unmodified profile.', // README (Phase 4)
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
          type: 'list',
          items: [
            'Salary, visa, legal and demographic questions are never answered by a model; if the fact is unknown, the application goes to a human.', // README (Phase 5), R-P2.2
            'Any other drafted answer passes a deterministic fabrication check: every name and multi-digit number in it must already exist in the resume or profile.', // README
            'A CAPTCHA, MFA prompt or unexpected form structure stops the flow and hands it to a human.', // README (Phase 6A), R-P2.2
            'Submitting needs every gate at once: dry-run off, live mode on, top automation level or explicit human approval, and rate limits clear. Today the only provider refuses to submit, by design.', // README
          ],
        },
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
            { label: 'Discovery', detail: 'Greenhouse & Lever' },
            { label: 'De-duplication', detail: 'Per-source ID + cross-source fingerprint' },
            { label: 'Matching', detail: 'Deterministic, then semantic' },
            { label: 'Decision', detail: 'Apply · Review · Save · Skip · Human required' },
            { label: 'Answers', detail: 'Hard-block → answer bank → checked LLM draft' },
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
          text: 'The tests caught a real bug before it shipped: a hard-stop match would have attempted a state transition the state machine didn’t allow, and crashed in production the first time it happened. The integration suite found it; the fix was a one-line change to the transition graph.', // README (adversarial review finding)
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
          type: 'list',
          items: [
            'A first real application provider against a structured ATS (Greenhouse or Lever), still dry-run gated.', // README (Phase 6B)
            'Resume variants and controlled tailoring — reordering and emphasis, never new claims.', // README (What remains)
            'A dashboard, a scheduler and notifications.', // README (What remains)
          ],
        },
      ],
    },
  ],
};
