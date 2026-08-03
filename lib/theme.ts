/**
 * Single source of truth for both themes.
 *
 * These values are duplicated in globals.css because CSS needs them at
 * first paint, before any JS runs. This file exists so that the GSAP
 * transition and the Three.js scene read the same numbers the stylesheet
 * uses — drift between the two is the classic bug on a dual-theme site
 * with a 3D layer.
 */

export const THEMES = ['ivory', 'indigo'] as const;

export type ThemeName = (typeof THEMES)[number];

export const DEFAULT_THEME: ThemeName = 'ivory';

export const STORAGE_KEY = 'fs-theme';

export interface ThemeTokens {
  bg: string;
  bgElevated: string;
  bgSunken: string;
  ink: string;
  inkSoft: string;
  inkFaint: string;
  accent: string;
  accentSoft: string;
  line: string;
  lineStrong: string;
  /** Colours consumed by the Three.js scene. */
  sceneNode: string;
  sceneAccent: string;
  sceneDim: string;
}

export const THEME_TOKENS: Record<ThemeName, ThemeTokens> = {
  ivory: {
    bg: '#faf8f3',
    bgElevated: '#f2efe8',
    bgSunken: '#f0ece3',
    ink: '#1a1815',
    inkSoft: '#57534e',
    inkFaint: '#78716c',
    accent: '#c2410c',
    accentSoft: '#ea580c',
    line: '#e3ddd0',
    lineStrong: '#c9c1b0',
    sceneNode: '#1a1815',
    sceneAccent: '#c2410c',
    sceneDim: '#c9c1b0',
  },
  indigo: {
    bg: '#08090d',
    bgElevated: '#0d0e14',
    bgSunken: '#050609',
    ink: '#e8eaf0',
    inkSoft: '#98a2b8',
    inkFaint: '#6b7488',
    accent: '#818cf8',
    accentSoft: '#6366f1',
    line: '#1e2130',
    lineStrong: '#2a2f45',
    sceneNode: '#e8eaf0',
    sceneAccent: '#818cf8',
    sceneDim: '#2a2f45',
  },
};

/** Maps a token key to the CSS custom property GSAP animates. */
export const CSS_VAR: Record<keyof ThemeTokens, string> = {
  bg: '--bg',
  bgElevated: '--bg-elevated',
  bgSunken: '--bg-sunken',
  ink: '--ink',
  inkSoft: '--ink-soft',
  inkFaint: '--ink-faint',
  accent: '--accent',
  accentSoft: '--accent-soft',
  line: '--line',
  lineStrong: '--line-strong',
  sceneNode: '--scene-node',
  sceneAccent: '--scene-accent',
  sceneDim: '--scene-dim',
};

export function isThemeName(value: unknown): value is ThemeName {
  return typeof value === 'string' && (THEMES as readonly string[]).includes(value);
}
