import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { NOTES } from '@/lib/content';
import { SITE_URL } from '@/lib/site';
import { routing } from '@/lib/i18n/routing';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'notes' });
  const url = `${SITE_URL}/${locale}/notes`;

  return {
    title: t('indexTitle'),
    description: t('indexIntro'),
    alternates: {
      canonical: url,
      languages: {
        fr: `${SITE_URL}/fr/notes`,
        en: `${SITE_URL}/en/notes`,
      },
    },
    openGraph: { title: t('indexTitle'), description: t('indexIntro'), url },
    // Twitter does not fall back to openGraph here: the root layout defines
    // its own twitter block, and a page that omits one inherits the parent's
    // wholesale. Without these two lines the notes index was shared on X
    // under the homepage title and description.
    twitter: {
      card: 'summary_large_image',
      title: t('indexTitle'),
      description: t('indexIntro'),
    },
  };
}

/**
 * A hub page.
 *
 * Its SEO value is structural rather than editorial: it gives the three
 * notes a common parent, so they form a section rather than three orphans
 * hanging off the homepage. Crawlers read that as a topic cluster.
 */
export default async function NotesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('notes');
  const tCase = await getTranslations('caseStudies');
  const home = `${SITE_URL}/${locale}`;

  return (
    <main
      id="main-content"
      className="page"
    >
      <BreadcrumbJsonLd
        items={[
          { name: tCase('breadcrumbHome'), url: home },
          { name: t('breadcrumbNotes'), url: `${home}/notes` },
        ]}
      />

      <div className="shell" style={{ maxWidth: 860 }}>
        <Breadcrumb
          items={[
            { label: tCase('breadcrumbHome'), href: '/' },
            { label: t('breadcrumbNotes') },
          ]}
        />

        <p className="mono" style={{ marginBottom: '1.2rem' }}>
          {t('indexLabel')}
        </p>
        <h1 className="t-display" style={{ marginBottom: '1.8rem', maxWidth: '14ch' }}>
          {t('indexTitle')}
        </h1>
        <p
          style={{
            color: 'var(--ink-soft)',
            fontSize: '1.05rem',
            maxWidth: '62ch',
            marginBottom: 'clamp(3rem, 8vh, 4.5rem)',
          }}
        >
          {t('indexIntro')}
        </p>

        <div style={{ display: 'grid' }}>
          {NOTES.map(({ slug, key }, i) => (
            <Link
              key={slug}
              href={`/notes/${slug}`}
              className="work-row"
              style={{
                padding: '2rem 0',
                display: 'grid',
                gridTemplateColumns: 'auto minmax(0, 1fr) auto',
                gap: '1.5rem',
                alignItems: 'center',
                borderTop: '1px solid var(--line)',
                borderBottom: i === NOTES.length - 1 ? '1px solid var(--line)' : undefined,
              }}
            >
              <span
                className="mono"
                style={{ fontSize: '0.66rem', alignSelf: 'flex-start', paddingTop: '0.4rem' }}
              >
                0{i + 1}
              </span>

              <span style={{ display: 'grid', gap: '0.5rem' }}>
                <span className="mono" style={{ fontSize: '0.62rem' }}>
                  {t(`items.${key}.meta`)}
                </span>
                <span
                  className="work-row__title"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 500,
                    fontSize: 'clamp(1.3rem, 3vw, 2rem)',
                    letterSpacing: '-0.03em',
                    lineHeight: 1.1,
                  }}
                >
                  {t(`items.${key}.title`)}
                </span>
                <span
                  style={{
                    color: 'var(--ink-soft)',
                    fontSize: '0.94rem',
                    maxWidth: '62ch',
                  }}
                >
                  {t(`items.${key}.excerpt`)}
                </span>
              </span>

              <span
                className="work-row__arrow"
                aria-hidden
                style={{
                  display: 'grid',
                  placeItems: 'center',
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  border: '1px solid var(--line-strong)',
                  color: 'var(--accent)',
                  flexShrink: 0,
                }}
              >
                <ArrowUpRight size={19} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
