'use client';

import { useEffect, useRef } from 'react';

/**
 * A 2px reading indicator across the top of the viewport.
 *
 * Driven by CSS scroll-timeline where supported, which runs entirely off
 * the main thread. The rAF fallback exists for Safari, which has not
 * shipped animation-timeline yet.
 *
 * Deliberately not gated behind prefers-reduced-motion, unlike every other
 * moving part here. The bar is a position indicator, strictly proportional
 * to scroll the user performed themselves — there is no autonomous motion
 * to suppress, and removing it would cost a genuine affordance.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Native scroll-timeline handles it; no JS needed.
    if (CSS.supports('animation-timeline: scroll()')) return;

    let frame = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? window.scrollY / max : 0;
      el.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
      frame = 0;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden>
      <div ref={ref} className="scroll-progress__bar" />
    </div>
  );
}
