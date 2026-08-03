import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';
import { CASE_METRICS, CASE_STUDIES } from '@/lib/content';
import { routing } from '@/lib/i18n/routing';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Case study — Soltani Fedi';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    CASE_STUDIES.map(({ slug }) => ({ locale, slug })),
  );
}

/**
 * A distinct share card per case study.
 *
 * Reusing the generic profile card would make four different links look
 * identical in a Slack paste or a LinkedIn post — the reader cannot tell
 * them apart, so only the first ever gets clicked. Carrying the metrics
 * onto the card also puts a number in front of someone who never opens it.
 */
export default async function CaseStudyOgImage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const caseStudy = CASE_STUDIES.find((c) => c.slug === slug);

  const tWork = await getTranslations({ locale, namespace: 'work' });
  const tCase = await getTranslations({ locale, namespace: 'caseStudies' });
  const key = caseStudy?.key ?? 'isolation';

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
            {tWork(`items.${key}.meta`)}
          </div>
          <div
            style={{
              fontSize: 68,
              fontWeight: 600,
              letterSpacing: -2.5,
              color: '#1a1815',
              marginTop: 22,
              lineHeight: 1.08,
              maxWidth: 980,
            }}
          >
            {tWork(`items.${key}.title`)}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 56, alignItems: 'flex-end' }}>
          {CASE_METRICS.map((m) => (
            <div key={m} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 52, fontWeight: 600, color: '#c2410c', letterSpacing: -2 }}>
                {tCase(`${key}.metrics.${m}.value`)}
              </div>
              <div style={{ fontSize: 20, color: '#6d6660', marginTop: 6 }}>
                {tCase(`${key}.metrics.${m}.label`)}
              </div>
            </div>
          ))}

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
