import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';
import { NOTES } from '@/lib/content';
import { routing } from '@/lib/i18n/routing';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Notes techniques — Soltani Fedi';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Share card for the notes index.
 *
 * Listing the three subjects rather than repeating the page title tells a
 * reader whether the index is worth opening, which a generic card cannot.
 */
export default async function NotesIndexOgImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'notes' });

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#faf8f3',
          padding: '68px 76px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 21,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: '#6d6660',
            }}
          >
            {t('indexLabel')}
          </div>
          <div
            style={{
              fontSize: 66,
              fontWeight: 600,
              letterSpacing: -2.5,
              color: '#1a1815',
              marginTop: 22,
              lineHeight: 1.08,
            }}
          >
            {t('indexTitle')}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {NOTES.map((note) => (
            <div
              key={note.slug}
              style={{ display: 'flex', fontSize: 25, color: '#6d6660' }}
            >
              {t(`items.${note.key}.title`)}
            </div>
          ))}
          <div
            style={{
              display: 'flex',
              fontSize: 26,
              color: '#1a1815',
              marginTop: 18,
            }}
          >
            Soltani Fedi
          </div>
        </div>
      </div>
    ),
    size,
  );
}
