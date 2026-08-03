/**
 * Every duration, ease and threshold used across the site.
 *
 * Nothing animated may hardcode a number elsewhere. Scattered timings
 * across a dozen files are impossible to harmonise later, and the site
 * ends up feeling subtly inconsistent without anyone being able to say why.
 */

export const DURATION = {
  instant: 0.2,
  fast: 0.4,
  base: 0.8,
  slow: 1.2,
} as const;

export const EASE = {
  out: 'power3.out',
  inOut: 'power2.inOut',
  elastic: 'elastic.out(1, 0.4)',
} as const;

/** Theme cross-fade, in seconds. Matches THEME_TRANSITION_MS. */
export const THEME_TRANSITION = 0.8;
export const THEME_TRANSITION_MS = THEME_TRANSITION * 1000;

/** Reveal-on-scroll: per-child offset, in seconds. */
export const REVEAL_STAGGER = 0.12;

/**
 * Custom cursor smoothing, per frame. The gap between the two values is
 * what creates the sense of weight — a single element locked to the
 * pointer reads as a second cursor rather than an effect.
 */
export const CURSOR_LERP = { dot: 0.15, ring: 0.08 } as const;

/**
 * Below this width the site drops smooth scrolling: native inertia on
 * touch devices beats anything a library emulates.
 */
export const MOBILE_BREAKPOINT = 768;
