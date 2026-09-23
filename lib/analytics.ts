import { track } from '@vercel/analytics';

// The only custom events the site sends. Vercel Web Analytics is cookieless; no personal data goes in the properties.
export type TrackedEvent =
  | { name: 'resume_download'; from: string }
  | { name: 'contact_click'; channel: 'email' | 'phone' | 'linkedin' | 'github'; from: string }
  | { name: 'case_study_read'; slug: string };

export function trackEvent(event: TrackedEvent) {
  const { name, ...properties } = event;
  track(name, properties);
}
