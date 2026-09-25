// The anime world (/world): the places in the town and what each one says.
// Every line of dialogue comes from existing content (case-study TL;DRs, homepage proof chips, About, contact);
// the only words written here are place names and UI labels. See WORLD.md §3.1.
import type { Chip } from './types';
import { getCaseStudy } from './projects';
import { flagship } from './work';

export type Vec3 = [number, number, number];

export type Place = {
  id: string;
  /** Speaker tab on the dialogue box. */
  name: string;
  /** Where the place pin sits in the scene. */
  pin: Vec3;
  /** Where the camera glides to when the place is opened. */
  view: { position: Vec3; target: Vec3 };
  lines: string[];
  proof?: Chip;
  /** Small print under the lines, e.g. that a screen shows demo data. */
  note?: string;
  links: { label: string; href: string; primary?: boolean }[];
};

const cityOps = getCaseStudy('city-ops-os')!;

/** Phase 2 prototype: the Field Ops Depot only. The other six places arrive in Phase 3. */
export const places: Place[] = [
  {
    id: 'depot',
    name: 'Field Ops Depot',
    pin: [0, 7.6, -1],
    view: { position: [17, 16, 26], target: [2.5, -1.4, -0.5] },
    lines: cityOps.tldr,
    proof: flagship.proof,
    note: 'The big screen shows City Ops OS with made-up demo data.',
    links: [{ label: 'Open the case study', href: `/work/${cityOps.slug}`, primary: true }],
  },
];

/** The overview the camera starts at and returns to. */
export const overview: Place['view'] = { position: [38, 38, 58], target: [0, 0, -1] };

export const worldCopy = {
  title: 'My world',
  skip: 'Skip to the quick view',
  back: 'Back to the town',
  listView: 'List view',
  loading: 'Loading the town…',
  tryAnyway: 'Try the 3D anyway',
  fallback: 'Showing a still picture of the town.',
};
