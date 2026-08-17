import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';
import { NOTES } from '@/lib/content';
import { routing } from '@/lib/i18n/routing';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Note technique — Soltani Fedi';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    NOTES.map(({ slug }) => ({ locale, slug })),
  );
}

/**
 * A share card per technical note.
 *
 * The case studies had one and the notes did not, so a note pasted into
 * LinkedIn or Slack appeared as a bare grey link while a case study showed
 * a designed card. The link that looks unfinished is the one nobody clicks.
 *
 * The layout deliberately differs from the case-study card: notes carry no
 * metrics, so the stack line does the work of telling the reader what the
 * article is about before they open it.
 */
export default async function NoteOgImage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const note = NOTES.find((n) => n.slug === slug);
  const key = note?.key ?? 'autocad';

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
            {t(`items.${key}.meta`)}
          </div>
          <div
            style={{
              fontSize: 62,
              fontWeight: 600,
              letterSpacing: -2.5,
              color: '#1a1815',
              marginTop: 22,
              lineHeight: 1.08,
              maxWidth: 1000,
            }}
          >
            {t(`items.${key}.title`)}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <div
            style={{
              fontSize: 24,
              color: '#c2410c',
              display: 'flex',
              maxWidth: 820,
            }}
          >
            {t(`items.${key}.stack`)}
          </div>
          <div
            style={{
              marginLeft: 'auto',
              fontSize: 26,
              color: '#1a1815',
              display: 'flex',
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
