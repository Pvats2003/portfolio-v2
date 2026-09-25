// The world (/world): a painted countryside village; the inn is the projects hub (WORLD.md, ART.md).
// Everything shown here comes from existing content: case-study titles and kickers, and the homepage proof chips.
// The only words written here are place names and UI labels.
import type { Chip } from './types';
import { caseStudies } from './projects';
import { archive, flagship, selectedWork } from './work';

export type InnProject = { slug: string; title: string; kicker: string; proof?: Chip };

const proofs = new Map<string, Chip>([flagship, ...selectedWork, ...archive].map((c) => [c.slug, c.proof]));

export const innProjects: InnProject[] = caseStudies.map((c) => ({
  slug: c.slug,
  title: c.title,
  kicker: c.kicker,
  proof: proofs.get(c.slug),
}));

export const worldCopy = {
  title: 'My world',
  skip: 'Skip to the quick view',
  back: 'Back to the village',
  listView: 'List view',
  inn: 'The inn',
  innLabel: 'Projects',
  openCase: 'Open the case study',
};
