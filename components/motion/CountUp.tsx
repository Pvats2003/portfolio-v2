'use client';

import { useEffect, useRef } from 'react';

/**
 * Counts a number like "10,000+" up from zero once, when it first scrolls into view.
 * The final value is in the HTML; it's only hidden (space kept) until counting starts,
 * with a CSS fallback that shows it after 2.5 s. Under reduced motion it never animates.
 */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    const m = value.match(/^([\d,]+)(.*)$/);
    if (!el || !m) return;
    const target = Number(m[1].replace(/,/g, ''));
    const suffix = m[2];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.dataset.counted = '';
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / 900);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString('en-US') + suffix;
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      el.textContent = `0${suffix}`;
      el.dataset.counted = '';
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);
  return (
    <span ref={ref} className="countup inline-block tabular" style={{ minWidth: `${value.length}ch` }}>
      {value}
    </span>
  );
}
