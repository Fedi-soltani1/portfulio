import type { MetadataRoute } from 'next';

/**
 * Not a PWA — there is nothing to install and nothing to cache offline.
 * This exists so that a phone adding the site to its home screen gets a
 * real name, a real icon and the right background colour, rather than a
 * cropped screenshot of the page.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Soltani Fedi — Full Stack .NET Developer',
    short_name: 'Soltani Fedi',
    description:
      'A .NET engineer specialising in multi-tenant SaaS architecture.',
    start_url: '/',
    display: 'browser',
    background_color: '#faf8f3',
    theme_color: '#faf8f3',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
