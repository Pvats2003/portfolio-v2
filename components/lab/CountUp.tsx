'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Renders the final value on the server (so the real number is always in the HTML),
 * then — only if the visitor allows motion — ticks up to it once when scrolled into view.
 */
export function CountUp({ to, suffix = '', duration = 900 }: { to: number; suffix?: string; duration?: number }) {
  const final = `${to.toLocaleString('en-US')}${suffix}`;
  const [shown, setShown] = useState(final);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setShown(`${Math.round(to * eased).toLocaleString('en-US')}${p === 1 ? suffix : ''}`);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, suffix, duration]);

  return (
    <span ref={ref}>
      <span aria-hidden>{shown}</span>
      <span className="sr-only">{final}</span>
    </span>
  );
}
