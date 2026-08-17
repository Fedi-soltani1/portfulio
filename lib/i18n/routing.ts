import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['fr', 'en'],

  /**
   * The fallback when the browser expresses no usable preference — and, in
   * practice, what most crawlers get, since they announce en-US or nothing.
   *
   * English rather than French: the target audience is international remote
   * and relocation, and the English queries this site aims at carry far more
   * volume than their French equivalents. French visitors still land on /fr
   * through detection below, so nothing is lost for them.
   */
  defaultLocale: 'en',

  /**
   * Read Accept-Language on the unprefixed root and redirect accordingly:
   * a French browser goes to /fr, everyone else to /en.
   *
   * Both versions stay fully indexable and reciprocally linked by hreflang —
   * detection only decides the entry point, never what a crawler can reach.
   */
  localeDetection: true,

  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];
