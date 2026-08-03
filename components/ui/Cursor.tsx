'use client';

import { useEffect, useRef } from 'react';
import { CURSOR_LERP } from '@/lib/animation-config';

/**
 * A dot that tracks the pointer closely and a ring that lags behind it.
 *
 * The lag is the whole effect: two elements at different smoothing factors
 * read as weight, where a single element locked to the pointer just looks
 * like a second cursor.
 *
 * Mounted only for devices with a real pointer, and never under
 * prefers-reduced-motion. The native cursor is hidden through a class on
 * <html> that is added here rather than in CSS, so a failure to mount can
 * never leave the user with no cursor at all.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add('has-custom-cursor');

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dotPos = { ...target };
    const ringPos = { ...target };
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    const isInteractive = (el: EventTarget | null) =>
      el instanceof Element &&
      el.closest('a, button, input, [role="button"], summary') !== null;

    const onOver = (e: PointerEvent) => {
      ring.classList.toggle('is-active', isInteractive(e.target));
    };

    const tick = () => {
      dotPos.x += (target.x - dotPos.x) * CURSOR_LERP.dot;
      dotPos.y += (target.y - dotPos.y) * CURSOR_LERP.dot;
      ringPos.x += (target.x - ringPos.x) * CURSOR_LERP.ring;
      ringPos.y += (target.y - ringPos.y) * CURSOR_LERP.ring;

      dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;

      frame = requestAnimationFrame(tick);
    };

    // Hide while the pointer is outside the window, so the cursor does not
    // sit frozen at the last known position.
    const onLeave = () => dot.parentElement?.classList.add('is-hidden');
    const onEnter = () => dot.parentElement?.classList.remove('is-hidden');

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('pointerenter', onEnter);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('pointerenter', onEnter);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <div className="cursor" aria-hidden>
      <div ref={ringRef} className="cursor__ring" />
      <div ref={dotRef} className="cursor__dot" />
    </div>
  );
}
