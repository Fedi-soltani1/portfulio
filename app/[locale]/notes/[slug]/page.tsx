import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { NOTES, CASE_STUDIES, findNote, relatedNotes } from '@/lib/content';
import { SITE_URL } from '@/lib/site';
import { routing } from '@/lib/i18n/routing';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { BreadcrumbJsonLd, TechArticleJsonLd } from '@/components/seo/JsonLd';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    NOTES.map(({ slug }) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const note = findNote(slug);
  if (!note) return {};

  const t = await getTranslations({ locale, namespace: 'notes' });
  const url = `${SITE_URL}/${locale}/notes/${slug}`;

  return {
    title: t(`items.${note.key}.metaTitle`),
    description: t(`items.${note.key}.metaDescription`),
    keywords: [...note.keywords],
    alternates: {
      canonical: url,
      languages: {
        fr: `${SITE_URL}/fr/notes/${slug}`,
        en: `${SITE_URL}/en/notes/${slug}`,
      },
    },
    openGraph: {
      type: 'article',
      title: t(`items.${note.key}.metaTitle`),
      description: t(`items.${note.key}.metaDescription`),
      url,
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
    },
    twitter: { card: 'summary_large_image' },
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const note = findNote(slug);
  if (!note) notFound();

  setRequestLocale(locale);

  const t = await getTranslations('notes');
  const tCase = await getTranslations('caseStudies');
  const tWork = await getTranslations('work');
  const key = note.key;
  const home = `${SITE_URL}/${locale}`;

  const paragraphs = Array.from(
    { length: note.paragraphs },
    (_, i) => `items.${key}.p${i + 1}`,
  );

  const related = relatedNotes(slug);
  const relatedCase = CASE_STUDIES.find((c) => c.slug === note.relatedCase);

  return (
    <main
      id="main-content"
      className="page"
    >
      <TechArticleJsonLd
        siteUrl={SITE_URL}
        locale={locale}
        path={`notes/${slug}`}
        headline={t(`items.${key}.metaTitle`)}
        description={t(`items.${key}.metaDescription`)}
        keywords={[...note.keywords]}
        dependencies={note.dependencies}
        personId={`${SITE_URL}/#person`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: tCase('breadcrumbHome'), url: home },
          { name: t('breadcrumbNotes'), url: `${home}/notes` },
          { name: t(`items.${key}.title`), url: `${home}/notes/${slug}` },
        ]}
      />

      <div className="shell" style={{ maxWidth: 720 }}>
        <Breadcrumb
          items={[
            { label: tCase('breadcrumbHome'), href: '/' },
            { label: t('breadcrumbNotes'), href: '/notes' },
            { label: t(`items.${key}.title`) },
          ]}
        />

        <p className="mono" style={{ marginBottom: '1rem' }}>
          {t(`items.${key}.meta`)}
        </p>
        <h1
          style={{
            fontSize: 'clamp(2rem, 5.5vw, 3.2rem)',
            marginBottom: '1.5rem',
            lineHeight: 1.06,
          }}
        >
          {t(`items.${key}.title`)}
        </h1>
        <p
          style={{
            color: 'var(--ink-soft)',
            fontSize: '1.05rem',
            marginBottom: '3rem',
            paddingBottom: '2rem',
            borderBottom: '1px solid var(--line)',
          }}
        >
          {t(`items.${key}.excerpt`)}
        </p>

        <article style={{ display: 'grid', gap: '1.5rem' }}>
          {paragraphs.map((p) => (
            <p key={p} style={{ fontSize: '1.02rem', lineHeight: 1.75 }}>
              {t(p)}
            </p>
          ))}
        </article>

        <p
          className="mono"
          style={{
            marginTop: '2.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--line)',
            fontSize: '0.64rem',
          }}
        >
          {t(`items.${key}.stack`)}
        </p>

        {/* A note points at the case study that goes deeper on the same
            territory, and at its sibling notes. Every page keeps at least
            three outgoing internal links. */}
        {relatedCase && (
          <section
            style={{
              marginTop: 'clamp(3rem, 8vh, 4.5rem)',
              paddingTop: '2rem',
              borderTop: '1px solid var(--line)',
            }}
          >
            <h2 className="mono" style={{ marginBottom: '1.2rem' }}>
              {t('relatedCaseLabel')}
            </h2>
            <Link
              href={`/work/${relatedCase.slug}`}
              className="work-row"
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) auto',
                gap: '1.5rem',
                alignItems: 'center',
                paddingBlock: '1.2rem',
                borderTop: '1px solid var(--line)',
                borderBottom: '1px solid var(--line)',
              }}
            >
              <span
                className="work-row__title"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 500,
                  fontSize: 'clamp(1.05rem, 2.4vw, 1.4rem)',
                  letterSpacing: '-0.03em',
                }}
              >
                {tWork(`items.${relatedCase.key}.title`)}
              </span>
              <ArrowUpRight size={19} aria-hidden style={{ color: 'var(--accent)' }} />
            </Link>
          </section>
        )}

        <section
          style={{
            marginTop: 'clamp(2.5rem, 6vh, 3.5rem)',
            paddingTop: '2rem',
            borderTop: '1px solid var(--line)',
          }}
        >
          <h2 className="mono" style={{ marginBottom: '1.2rem' }}>
            {t('relatedLabel')}
          </h2>
          <div style={{ display: 'grid' }}>
            {related.map((other) => (
              <Link
                key={other.slug}
                href={`/notes/${other.slug}`}
                className="work-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr) auto',
                  gap: '1.5rem',
                  alignItems: 'center',
                  paddingBlock: '1.2rem',
                  borderTop: '1px solid var(--line)',
                }}
              >
                <span
                  className="work-row__title"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 500,
                    fontSize: 'clamp(1.05rem, 2.4vw, 1.4rem)',
                    letterSpacing: '-0.03em',
                  }}
                >
                  {t(`items.${other.key}.title`)}
                </span>
                <ArrowUpRight size={19} aria-hidden style={{ color: 'var(--accent)' }} />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
