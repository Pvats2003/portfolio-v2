// Every screenshot on the site, with its alt text. Files live in public/work/<slug>/.
// Static imports give next/image the real width/height (no layout shift) and a blur placeholder.
import type { StaticImageData } from 'next/image';
import cityOpsDesktop from '@/public/work/city-ops-os/command-center-desktop.png';
import cityOpsPhone from '@/public/work/city-ops-os/field-officer-cockpit-phone.png';
import karavaliDiscover from '@/public/work/karavali/discover-home.webp';
import karavaliEvents from '@/public/work/karavali/events-around-manipal.webp';
import auditInput from '@/public/work/audit-ai-copilot/process-input.png';

export type Media = {
  src: StaticImageData;
  /** What the image shows, for people who can't see it. */
  alt: string;
  frame: 'browser' | 'phone';
  /** Text in the browser bar. Only real public URLs; otherwise the product name. */
  bar?: string;
  /** Screenshot contains made-up data (shown as a "Demo data" label). */
  demo?: boolean;
};

export const media = {
  cityOpsDesktop: {
    src: cityOpsDesktop,
    frame: 'browser',
    bar: 'City Ops OS · Command Center',
    demo: true,
    alt: 'City Ops OS command center for Rajampet: quick actions to add a business, plan the day, assign a field officer, start a session or report an issue; recording hours against a 20-hour target; counts of businesses, active field officers, live sessions, open critical issues and ready fleet; today’s field execution checks; and a “What needs my attention?” feed.',
  },
  cityOpsPhone: {
    src: cityOpsPhone,
    frame: 'phone',
    demo: true,
    alt: 'City Ops OS field officer cockpit on a phone: two visits for today with their times, business names and a Pending status, a navigate button beside each, and tabs for Today, Sessions, Issues and Profile.',
  },
  karavaliDiscover: {
    src: karavaliDiscover,
    frame: 'browser',
    bar: 'karavali.base44.app',
    alt: 'Karavali’s Discover page: the headline “Travel with people, not just places.” over a beach at sunset, with buttons to find people going out and to explore places.',
  },
  karavaliEvents: {
    src: karavaliEvents,
    frame: 'browser',
    bar: 'karavali.base44.app',
    alt: 'Karavali’s Events page for around Manipal: filters for fest, social, outdoors, food, wellness and culture, above event cards tagged Flagship, Recurring and Limited Spots.',
  },
  auditInput: {
    src: auditInput,
    frame: 'browser',
    bar: 'Audit AI Copilot',
    alt: 'Audit AI Copilot’s input screen: the headline “Audit Any Process. Instantly.”, a badge reading 10-rule engine plus LLM enhancement, tabs for text input and file upload, and an empty box for a process description.',
  },
} satisfies Record<string, Media>;

export type MediaKey = keyof typeof media;
