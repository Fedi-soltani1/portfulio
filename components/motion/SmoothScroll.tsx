'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { MOBILE_BREAKPOINT } from '@/lib/animation-config';

/**
 * Momentum scrolling on Lenis' own rAF loop.
 *
 * There is no ScrollTrigger sync here any more, because nothing on the site
 * animates on scroll through GSAP: Reveal moved to IntersectionObserver and
 * the progress bar uses a CSS scroll timeline. Keeping the sync would mean
 * shipping ScrollTrigger for no reason.
 *
 * Disabled below the mobile breakpoint — native inertia on touch devices
 * beats anything a library emulates — and under prefers-reduced-motion,
 * where hijacking the scroll is exactly what the setting exists to prevent.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches;
    if (reduced || isTouch) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let frame = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    });

    // Anchor links must go through Lenis, otherwise the native jump fights
    // the momentum loop and lands in the wrong place.
    const onAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest?.('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -76 });
    };

    document.addEventListener('click', onAnchorClick);

    return () => {
      document.removeEventListener('click', onAnchorClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
