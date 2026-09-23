'use client';

import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';

/** Placed after a case study's last chapter: counts a "read" once the reader reaches the end. */
export function ReadTracker({ slug }: { slug: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        trackEvent({ name: 'case_study_read', slug });
        io.disconnect();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [slug]);
  return <div ref={ref} aria-hidden />;
}
