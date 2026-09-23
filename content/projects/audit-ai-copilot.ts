import type { CaseStudy } from '../types';

// Sources: resume (R-P3, R-P3.1) and Priyanshu's PRD, "Audit AI Copilot — PRD v1.0, May 2026" ("PRD" below).
// PRD targets are labelled as targets; no results are claimed.
// The PRD names Groq; the shipped app uses OpenAI GPT-4o-mini (Priyanshu, Sep 2026), so the site says GPT-4o-mini.

export const auditAiCopilot: CaseStudy = {
  slug: 'audit-ai-copilot',
  index: '04',
  title: 'Audit AI Copilot',
  kicker: 'AI-powered internal audit risk review', // R-P3, PRD subtitle
  org: 'Self-initiated',
  chips: [{ label: 'Ongoing' }, { label: 'MVP v1.0 · May 2026' }], // R-P3, PRD
  tldr: [
    'An audit-risk copilot for mid-market finance teams that can’t justify a full consultancy engagement.', // PRD §1–2
    'A deterministic rule engine produces reproducible findings; an LLM rewrites and enriches them — it never adds findings of its own.', // PRD §6.1, R-P3.1
    'I wrote the PRD — three personas, prioritised user stories, roadmap and pricing — and directed the build: FastAPI, OpenAI’s GPT-4o-mini, and PDF reports.', // PRD, R-P3.1; model: Priyanshu
  ],
  meta: [
    { label: 'Role', value: 'Founder & product manager — wrote the PRD, directed the build' }, // PRD cover, R-P3.1
    { label: 'Timeline', value: 'PRD v1.0 and MVP · May 2026 · ongoing' }, // PRD, R-P3
    { label: 'Stack', value: 'FastAPI · Next.js · OpenAI GPT-4o-mini · ReportLab · pypdf · python-docx' }, // PRD §7, R-P3; model: Priyanshu (Sep 2026)
    { label: 'Scope', value: '3 personas · 10 user stories · 10-rule engine · 7 API endpoints' }, // PRD §4, §5, §6.1, §7.4
  ],
  hero: { type: 'shot', media: 'auditInput' },
  chapters: [
    {
      id: 'problem',
      section: 'Problem',
      heading: 'Mid-market finance teams audit themselves with spreadsheets',
      blocks: [
        {
          type: 'table',
          caption: 'The problem, broken down (from the PRD)',
          head: ['Dimension', 'What goes wrong'],
          rows: [
            ['Accessibility', 'Consultancy audit engagements are priced out of reach for most of the market'],
            ['Speed', 'A traditional engagement takes weeks to months; risk doesn’t wait'],
            ['Consistency', 'Manual audits vary with the consultant doing them'],
            ['Traceability', 'No low-cost tool produces reproducible, framework-mapped findings'],
            ['Expertise gap', 'Mid-market finance teams lack internal audit training'],
          ],
        }, // PRD §2.2
        {
          type: 'p',
          text: 'Companies with $10M–$200M in revenue can barely justify an audit engagement, and enterprise tools mean large contracts and long rollouts. So a finance controller at a $50M company handles compliance alone — with spreadsheets, email and memory.', // PRD §1, §2.1
        },
      ],
    },
    {
      id: 'users',
      section: 'Users',
      heading: 'Three personas, in priority order',
      blocks: [
        {
          type: 'personas',
          items: [
            {
              tier: 'Primary',
              title: 'The stretched finance controller',
              role: 'Finance Controller or VP Finance',
              context: '$20M–$150M revenue · 50–500 employees',
              pain: 'Responsible for compliance, with no dedicated audit team',
              goal: 'Find control gaps before external auditors do',
              today: 'Spreadsheets, email, the occasional consultant',
            },
            {
              tier: 'Secondary',
              title: 'The compliance-driven startup founder',
              role: 'Co-founder or COO, Series A',
              context: '$5M–$30M revenue · enterprise sales motion',
              pain: 'Enterprise customers asking for SOC 2 / ISO 27001 evidence',
              goal: 'Know where they stand before hiring a consultant',
              today: 'Nothing structured — ad hoc docs',
            },
            {
              tier: 'Tertiary',
              title: 'The internal audit professional',
              role: 'Internal auditor or risk manager at a bank or NBFC',
              context: 'Has an internal audit function',
              pain: 'Needs a first-pass screen before deep-dive engagements',
              goal: 'Automate preliminary risk identification',
              today: 'An enterprise audit tool, or manual work',
            },
          ],
        }, // PRD §4
      ],
    },
    {
      id: 'constraints',
      section: 'Constraints',
      heading: 'What the MVP had to respect',
      blocks: [
        {
          type: 'table',
          caption: 'Constraint, and how the MVP meets it',
          head: ['Constraint', 'How the MVP meets it'],
          rows: [
            ['Reproducible, even without AI', 'The rule engine always runs; the LLM is optional'], // PRD §3.1, US-08
            ['Use the documents auditors have', 'PDF and DOCX uploads up to 10 MB'], // PRD §6.2, US-02
            ['Not legal advice', 'Every report says so'], // PRD §9
          ],
        },
      ],
    },
    {
      id: 'hybrid',
      section: 'Decision',
      heading: 'Rules decide; the LLM only explains',
      blocks: [
        {
          type: 'pipeline',
          caption: 'The rule engine always runs; the LLM enhances only when it’s available.',
          steps: [
            { label: 'Input', detail: 'Process text, or a PDF/DOCX' },
            { label: 'Rule engine', detail: '10 rules · always runs', accent: true },
            { label: 'LLM enhancement', detail: 'GPT-4o-mini · if available' }, // Priyanshu
            { label: 'Structured findings', detail: 'Risks, gaps, controls, severity' },
            { label: 'Report', detail: 'Web view · branded PDF' },
          ],
        }, // PRD §7.1
        {
          type: 'p',
          text: 'The LLM refines the language, maps each control to a framework (SOX, Basel III, MiFID II, ISO 31000, COSO) and adds business impact. If it fails, the rule-engine findings come back on their own — never a blank result.', // PRD §1, §6.1, US-08
        },
        {
          type: 'tradeoff',
          caption: 'What the hybrid design bought, and what it gave up',
          columnLabel: 'Choice',
          rows: [
            { dimension: 'Reproducibility', result: 'Same input, same findings — every time', kind: 'gained' }, // PRD
            { dimension: 'Resilience', result: 'Useful output even when the LLM is down', kind: 'gained' }, // PRD US-08
            { dimension: 'Hallucination risk', result: 'The model can’t invent a finding', kind: 'gained' }, // PRD §9
            { dimension: 'Coverage', result: 'Only what the 10 rules detect — nothing outside them', kind: 'given-up' }, // PRD §6.1
          ],
        },
        { type: 'quote', text: 'The LLM does not generate new findings — it enriches existing ones.' }, // PRD §6.1
      ],
    },
    {
      id: 'priorities',
      section: 'Decision',
      heading: 'What made the MVP, and what waited',
      blocks: [
        {
          type: 'board',
          caption: 'User stories by priority and status, labelled P0 / P1 / P2 as in the PRD',
          columns: [
            {
              label: 'P0',
              items: [
                { id: 'US-01', text: 'Describe a process, get a structured risk assessment in under 60 seconds', status: { label: 'Done', tone: 'ok' } },
                { id: 'US-02', text: 'Upload a PDF or DOCX instead of retyping', status: { label: 'Done', tone: 'ok' } },
                { id: 'US-03', text: 'Download a branded PDF report for the CEO or board', status: { label: 'Done', tone: 'ok' } },
                { id: 'US-04', text: 'Every control tagged with a compliance framework', status: { label: 'Done', tone: 'ok' } },
                { id: 'US-07', text: 'Severity colour-coded for scanning', status: { label: 'Done', tone: 'ok' } },
                { id: 'US-08', text: 'Still works when the AI model is unavailable', status: { label: 'Done', tone: 'ok' } },
              ],
            },
            {
              label: 'P1',
              items: [
                { id: 'US-05', text: 'Ask follow-up questions about the results', status: { label: 'Done', tone: 'ok' } },
                { id: 'US-06', text: 'See previous analyses', status: { label: 'Done', tone: 'ok' } },
              ],
            },
            {
              label: 'P2',
              items: [
                { id: 'US-09', text: 'User accounts, so each user sees only their analyses', status: { label: 'Planned' } },
                { id: 'US-10', text: 'Annotate findings and assign remediation owners', status: { label: 'Planned' } },
              ],
            },
          ],
        }, // PRD §5
      ],
    },
    {
      id: 'built',
      section: 'What I built',
      heading: 'Ten rules, run on every analysis',
      blocks: [
        {
          type: 'table',
          caption: 'The 10 detection rules',
          head: ['Rule', 'Detects'],
          rows: [
            ['SOD-001', 'One person controlling multiple steps (segregation of duties)'],
            ['APR-001', 'No authorisation workflow'],
            ['TRC-001', 'No logging or monitoring (audit trail)'],
            ['MAN-001', 'Spreadsheet, email or verbal-only flows'],
            ['SPF-001', 'No backup or failover'],
            ['SEC-001', 'No encryption on data processes'],
            ['ACC-001', 'No authentication on systems'],
            ['CNT-001', 'Verbal or informal agreements'],
            ['LMT-001', 'No thresholds on financial flows'],
            ['TST-001', 'Deployments with no UAT or QA gate'],
          ],
        }, // PRD §6.1
        { type: 'todo', text: 'Add the results screen (after running the sample) here once the screenshot arrives.' },
      ],
    },
    {
      id: 'outcome',
      section: 'Outcome',
      heading: 'Where it stands',
      blocks: [
        {
          type: 'table',
          caption: 'Success metrics I set in the PRD',
          head: ['Metric', 'Target'],
          rows: [
            ['Time to first insight', 'Under 60 seconds'],
            ['PDF export rate', 'Over 40% of analyses'],
            ['7-day retention', 'Over 30%'],
            ['Rule-engine accuracy', 'Over 90% relevant hits'],
          ],
          note: 'Targets, not results. No usage or revenue figures are published here.',
        }, // PRD §3.3
        {
          type: 'p',
          text: 'The MVP covers all P0 and P1 stories: text and document analysis, framework-tagged findings, follow-up Q&A, history, and branded PDF reports. Accounts and team collaboration are planned.', // PRD §5, §8
        },
        { type: 'todo', text: 'Current status: is the MVP live for users?' },
      ],
    },
    {
      id: 'learned',
      section: 'Learned',
      heading: 'Open questions I’m still working through',
      blocks: [
        {
          type: 'list',
          items: [
            'Tool or service: does the user do the work, or do we?', // PRD §11
            'Solo controller or a team? It decides when collaboration matters.', // PRD §11
            'What is the retention hook? Session-based history doesn’t create stickiness.', // PRD §11
            'Should the rule engine be configurable per industry?', // PRD §11
          ],
        },
        { type: 'todo', text: 'Any lessons from building it so far, in your own words.' },
      ],
    },
    {
      id: 'next',
      section: 'Next',
      heading: 'Roadmap in the PRD',
      blocks: [
        {
          type: 'pipeline',
          caption: 'Planned releases, in order',
          steps: [
            { label: 'v1.1', detail: 'Accounts, persistent history, team sharing' }, // PRD §8
            { label: 'v1.2', detail: 'Continuous monitoring: weekly re-runs, risk deltas' }, // PRD §8
            { label: 'v1.3', detail: '25-rule library, industry templates' }, // PRD §8
            { label: 'v2.0', detail: 'Annotate findings, assign owners, track remediation', accent: true }, // PRD §8
          ],
        },
      ],
    },
  ],
};
