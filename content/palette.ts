// Everything the ⌘K command palette can do. Case studies are added automatically from content/projects.
import { caseStudies } from './projects';
import { identity, RESUME_PDF } from './resume';

export type PaletteAction =
  | { kind: 'go'; href: string }
  | { kind: 'download'; href: string }
  | { kind: 'copy'; text: string }
  | { kind: 'external'; href: string };

export type PaletteItem = {
  id: string;
  group: 'Case studies' | 'Pages' | 'Actions';
  label: string;
  hint?: string;
  keywords?: string[];
  action: PaletteAction;
};

export function paletteItems(): PaletteItem[] {
  return [
    ...caseStudies.map<PaletteItem>((s) => ({
      id: `case-${s.slug}`,
      group: 'Case studies',
      label: s.title,
      hint: s.org,
      keywords: [s.kicker, ...s.chips.map((c) => c.label)],
      action: { kind: 'go', href: `/work/${s.slug}` },
    })),
    { id: 'page-home', group: 'Pages', label: 'Home', action: { kind: 'go', href: '/' } },
    { id: 'page-about', group: 'Pages', label: 'About', action: { kind: 'go', href: '/about' } },
    { id: 'page-resume', group: 'Pages', label: 'Resume', hint: 'Web version', action: { kind: 'go', href: '/resume' } },
    {
      id: 'act-resume',
      group: 'Actions',
      label: 'Download resume',
      hint: 'PDF',
      keywords: ['cv', 'pdf'],
      action: { kind: 'download', href: RESUME_PDF },
    },
    {
      id: 'act-copy-email',
      group: 'Actions',
      label: 'Copy email address',
      hint: identity.email,
      keywords: ['contact', 'mail'],
      action: { kind: 'copy', text: identity.email },
    },
    {
      id: 'act-copy-phone',
      group: 'Actions',
      label: 'Copy phone number',
      hint: identity.phone,
      keywords: ['contact', 'call', 'mobile'],
      action: { kind: 'copy', text: identity.phone },
    },
    {
      id: 'act-linkedin',
      group: 'Actions',
      label: 'Open LinkedIn',
      keywords: ['contact', 'profile'],
      action: { kind: 'external', href: identity.linkedin.href },
    },
    {
      id: 'act-github',
      group: 'Actions',
      label: 'Open GitHub',
      keywords: ['code', 'repos'],
      action: { kind: 'external', href: identity.github.href },
    },
  ];
}
