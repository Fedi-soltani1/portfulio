'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import gsap from 'gsap';

import {
  CSS_VAR,
  DEFAULT_THEME,
  STORAGE_KEY,
  THEME_TOKENS,
  isThemeName,
  type ThemeName,
  type ThemeTokens,
} from '@/lib/theme';
import { EASE, THEME_TRANSITION } from '@/lib/animation-config';

interface ThemeContextValue {
  theme: ThemeName;
  toggle: () => void;
  /**
   * Live token values during the transition. The Three.js scene subscribes
   * to this so materials, lights and fog interpolate on the same timeline
   * as the CSS — the detail almost nobody implements, and the one that
   * makes the switch feel engineered rather than bolted on.
   */
  subscribe: (fn: (tokens: ThemeTokens) => void) => () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Start from the default; the inline head script already set the real
  // attribute, and the effect below reconciles state with the DOM.
  const [theme, setTheme] = useState<ThemeName>(DEFAULT_THEME);
  const listeners = useRef(new Set<(tokens: ThemeTokens) => void>());
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const attr = document.documentElement.getAttribute('data-theme');
    if (isThemeName(attr)) setTheme(attr);
  }, []);

  const subscribe = useCallback((fn: (tokens: ThemeTokens) => void) => {
    listeners.current.add(fn);
    return () => {
      listeners.current.delete(fn);
    };
  }, []);

  const toggle = useCallback(() => {
    const next: ThemeName = theme === 'ivory' ? 'indigo' : 'ivory';
    const from = THEME_TOKENS[theme];
    const to = THEME_TOKENS[next];
    const root = document.documentElement;

    tweenRef.current?.kill();

    // A plain attribute swap would snap. Tweening a proxy object and
    // writing each CSS variable per frame makes the whole surface migrate.
    const proxy: ThemeTokens = { ...from };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      root.setAttribute('data-theme', next);
      (Object.keys(CSS_VAR) as (keyof ThemeTokens)[]).forEach((key) => {
        root.style.removeProperty(CSS_VAR[key]);
      });
      listeners.current.forEach((fn) => fn(to));
    } else {
      tweenRef.current = gsap.to(proxy, {
        ...to,
        duration: THEME_TRANSITION,
        ease: EASE.inOut,
        onUpdate: () => {
          (Object.keys(CSS_VAR) as (keyof ThemeTokens)[]).forEach((key) => {
            root.style.setProperty(CSS_VAR[key], proxy[key]);
          });
          listeners.current.forEach((fn) => fn({ ...proxy }));
        },
        onComplete: () => {
          // Hand control back to the stylesheet so the cascade stays clean.
          root.setAttribute('data-theme', next);
          (Object.keys(CSS_VAR) as (keyof ThemeTokens)[]).forEach((key) => {
            root.style.removeProperty(CSS_VAR[key]);
          });
        },
      });
    }

    setTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private browsing — the theme simply will not persist.
    }
  }, [theme]);

  const value = useMemo(
    () => ({ theme, toggle, subscribe }),
    [theme, toggle, subscribe],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
