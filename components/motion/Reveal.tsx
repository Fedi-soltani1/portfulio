'use client';

import { useEffect, useRef } from 'react';
import { REVEAL_STAGGER } from '@/lib/animation-config';

interface Props {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Animate direct children individually with a stagger, instead of the wrapper as one block. */
  stagger?: boolean;
  /** Wrapper tag — use 'ol'/'ul' to keep list semantics when wrapping a list. */
  as?: 'div' | 'ol' | 'ul';
}

/**
 * Fades and lifts content in as it enters the viewport.
 *
 * This previously used GSAP's ScrollTrigger, which had a serious failure
 * mode: `fromTo` sets opacity to 0 on mount, and the tween only plays once
 * the trigger point is crossed. The last section on the page can never
 * cross it — there is no scroll left below it — so it stayed invisible
 * permanently. That is what emptied the contact section.
 *
 * IntersectionObserver cannot fail that way: it fires on observe for
 * anything already on screen. The explicit rect check below covers the
 * remaining case, where the element is visible before the observer is even
 * attached.
 *
 * Two side benefits: ScrollTrigger leaves the bundle entirely, and the
 * animation itself is now a CSS transition running on the compositor
 * rather than a JS tween.
 */
export function Reveal({
  children,
  className,
  style,
  stagger = false,
  as: Tag = 'div',
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Nothing is ever hidden under reduced motion: no class, no observer.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets = (
      stagger ? Array.from(el.children) : [el]
    ) as HTMLElement[];

    targets.forEach((target, i) => {
      target.style.setProperty('--reveal-delay', `${i * REVEAL_STAGGER}s`);
      target.classList.add('reveal');
    });

    const show = () => {
      targets.forEach((target) => target.classList.add('reveal--in'));
    };

    // Already on screen: reveal on the next frame. Adding both classes in
    // the same tick would skip the transition, so let one frame pass.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
      const frame = requestAnimationFrame(show);
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          show();
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [stagger]);

  return (
    <Tag ref={ref as React.Ref<never>} className={className} style={style}>
      {children}
    </Tag>
  );
}
