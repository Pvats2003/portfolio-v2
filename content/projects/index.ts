import type { CaseStudy } from '../types';
import { cityOpsOs } from './city-ops-os';
import { careerOs } from './career-os';
import { karavali } from './karavali';
import { auditAiCopilot } from './audit-ai-copilot';
import { anpr } from './anpr';
import { itcPowerhouse } from './itc-powerhouse';

/** Every case study, in reading order. Adding a case study = one file + one line here. */
export const caseStudies: CaseStudy[] = [cityOpsOs, careerOs, karavali, auditAiCopilot, anpr, itcPowerhouse];

export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);

/** The next case study in reading order (wraps around). */
export const nextCaseStudy = (slug: string) => {
  const i = caseStudies.findIndex((c) => c.slug === slug);
  return caseStudies[(i + 1) % caseStudies.length];
};
