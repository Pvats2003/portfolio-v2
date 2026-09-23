// Shapes for case-study content. Every case study follows one template:
// TL;DR → Role & timeline → Problem → Constraints → Key decisions & trade-offs
// → What I built → Outcome / evidence → What I learned → What's next.

export type ChipTone = 'ok' | 'accent' | 'muted';
export type Chip = { label: string; tone?: ChipTone };

/** The template section a chapter belongs to (shown in the timestamp column). */
export type TemplateSection =
  | 'Problem'
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
  | { type: 'tradeoff'; caption: string; rows: { dimension: string; result: string; kind: 'gained' | 'given-up' }[] };

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
  chapters: Chapter[];
};
