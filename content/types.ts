// Shapes for case-study content. Every case study follows one template:
// TL;DR → Role & timeline → Problem → Constraints → Key decisions & trade-offs
// → What I built → Outcome / evidence → What I learned → What's next.

export type ChipTone = 'ok' | 'accent' | 'muted';
export type Chip = { label: string; tone?: ChipTone };

/** The template section a chapter belongs to (shown in the timestamp column). */
export type TemplateSection =
  | 'Problem'
  | 'Users'
  | 'Constraints'
  | 'Decision'
  | 'Turning point'
  | 'What I built'
  | 'Outcome'
  | 'Learned'
  | 'Next';

export type Block =
  | { type: 'p'; text: string }
  | { type: 'facts'; items: { value: string; label: string }[] }
  | { type: 'list'; items: string[] }
  /** A pull-quote: the one sentence a skimmer should take from the chapter. */
  | { type: 'quote'; text: string }
  /** Missing information. Rendered visibly, and also listed in TODO.md. */
  | { type: 'todo'; text: string }
  | { type: 'diagram'; name: 'sprawl' | 'converge' }
  | { type: 'tradeoff'; caption: string; columnLabel?: string; rows: { dimension: string; result: string; kind: 'gained' | 'given-up' }[] }
  /** A left-to-right (desktop) / top-to-bottom (mobile) flow of stages. */
  | { type: 'pipeline'; caption: string; steps: { label: string; detail?: string; accent?: boolean }[] }
  | { type: 'personas'; items: { tier: string; title: string; role: string; context: string; pain: string; goal: string; today: string }[] }
  /** A prioritisation board: columns of items with a status chip each. */
  | { type: 'board'; caption: string; columns: { label: string; items: { id?: string; text: string; status?: Chip }[] }[] }
  | { type: 'beforeAfter'; before: { label: string; points: string[] }; after: { label: string; points: string[] } }
  | { type: 'table'; caption: string; head: string[]; rows: string[][]; note?: string };

export type Chapter = {
  id: string;
  section: TemplateSection;
  heading: string;
  blocks: Block[];
};

export type MetaItem = { label: string; value: string; todo?: string };

export type CaseStudy = {
  slug: string;
  index: string;
  title: string;
  kicker: string;
  org: string;
  chips: Chip[];
  /** Exactly three lines. */
  tldr: [string, string, string];
  meta: MetaItem[];
  /** Public links shown in the header (live product, code). */
  links?: { label: string; href: string }[];
  chapters: Chapter[];
};
