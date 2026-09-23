'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

// One listener for the whole site: resume downloads and contact clicks are recognised by where the
// link points, so no link can be forgotten and content files never carry tracking code.
export function ClickTracker({ resume, linkedin, github }: { resume: string; linkedin: string; github: string }) {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const link = (e.target as Element | null)?.closest?.('a[href]');
      if (!(link instanceof HTMLAnchorElement)) return;
      const href = link.getAttribute('href') ?? '';
      const from = window.location.pathname;
      if (href === resume) trackEvent({ name: 'resume_download', from });
      else if (href.startsWith('mailto:')) trackEvent({ name: 'contact_click', channel: 'email', from });
      else if (href === linkedin) trackEvent({ name: 'contact_click', channel: 'linkedin', from });
      else if (href === github) trackEvent({ name: 'contact_click', channel: 'github', from });
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [resume, linkedin, github]);
  return null;
}
