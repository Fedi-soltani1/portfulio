import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/lib/i18n/routing';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Soltani Fedi — Full Stack .NET Developer';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * The card people actually see first — in a Slack paste, a LinkedIn post,
 * a WhatsApp preview. Without it the link renders as a grey rectangle with
 * no title, which is a poor first impression for a portfolio.
 *
 * Deliberately plain: system fonts only, so nothing has to be fetched at
 * render time, and the ivory theme is reproduced by hand.
 */
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });

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
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: '#6d6660',
            }}
          >
            {t('label')}
          </div>
          <div
            style={{
              fontSize: 132,
              fontWeight: 600,
              letterSpacing: -5,
              color: '#1a1815',
              marginTop: 18,
              lineHeight: 1,
            }}
          >
            {t('name')}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            borderTop: '2px solid #e3ddd0',
            paddingTop: 28,
          }}
        >
          <div style={{ fontSize: 38, color: '#1a1815' }}>{t('role')}</div>
          <div style={{ fontSize: 32, color: '#c2410c', marginTop: 8 }}>
            {t('specialty')}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
