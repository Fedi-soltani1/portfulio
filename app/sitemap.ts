import type { MetadataRoute } from 'next';
import { routing } from '@/lib/i18n/routing';
import { CASE_STUDIES, NOTES } from '@/lib/content';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const home = routing.locales.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 1,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${SITE_URL}/${l}`]),
      ),
    },
  }));

  const work = routing.locales.flatMap((locale) =>
    CASE_STUDIES.map(({ slug }) => ({
      url: `${SITE_URL}/${locale}/work/${slug}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    })),
  );

  const notesIndex = routing.locales.map((locale) => ({
    url: `${SITE_URL}/${locale}/notes`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const notes = routing.locales.flatMap((locale) =>
    NOTES.map(({ slug }) => ({
      url: `${SITE_URL}/${locale}/notes/${slug}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    })),
  );

  return [...home, ...work, ...notesIndex, ...notes];
}
