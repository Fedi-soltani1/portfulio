import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CASE_METRICS, CASE_STUDIES, keywordsFor } from '@/lib/content';
import { SITE_URL } from '@/lib/site';
import { ConflictDemo } from '@/components/concurrency/ConflictDemo';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { RelatedCaseStudies } from '@/components/work/RelatedCaseStudies';
import { BreadcrumbJsonLd, TechArticleJsonLd } from '@/components/seo/JsonLd';
import { SNIPPETS } from '@/lib/snippets';

export function generateStaticParams() {
  return CASE_STUDIES.map(({ slug }) => ({ slug }));
}

function findCaseStudy(slug: string) {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const caseStudy = findCaseStudy(slug);
  if (!caseStudy) return {};

  const tCase = await getTranslations({ locale, namespace: 'caseStudies' });
  const url = `${SITE_URL}/${locale}/work/${slug}`;

  /**
   * The title shown on the page is editorial ("The conflict you never
   * see"); the title in <head> is the query someone would actually type.
   * Conflating the two costs either the reader or the ranking.
   */
  return {
    title: tCase(`${caseStudy.key}.metaTitle`),
    description: tCase(`${caseStudy.key}.metaDescription`),
    keywords: keywordsFor(caseStudy.keywords, locale),
    alternates: {
      canonical: url,
      languages: {
        fr: `${SITE_URL}/fr/work/${slug}`,
        en: `${SITE_URL}/en/work/${slug}`,
      },
    },
    openGraph: {
      type: 'article',
      title: tCase(`${caseStudy.key}.metaTitle`),
      description: tCase(`${caseStudy.key}.metaDescription`),
      url,
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: tCase(`${caseStudy.key}.metaTitle`),
      description: tCase(`${caseStudy.key}.metaDescription`),
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const caseStudy = findCaseStudy(slug);
  if (!caseStudy) notFound();

  setRequestLocale(locale);

  const tWork = await getTranslations('work');
  const tCase = await getTranslations('caseStudies');
  const key = caseStudy.key;
  const snippet = SNIPPETS[key];

  const home = `${SITE_URL}/${locale}`;

  return (
    <main
      id="main-content"
      className="page"
    >
      <TechArticleJsonLd
        siteUrl={SITE_URL}
        locale={locale}
        path={`work/${slug}`}
        headline={tCase(`${key}.metaTitle`)}
        description={tCase(`${key}.metaDescription`)}
        keywords={keywordsFor(caseStudy.keywords, locale)}
        dependencies={caseStudy.dependencies}
        personId={`${SITE_URL}/#person`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: tCase('breadcrumbHome'), url: home },
          { name: tCase('breadcrumbWork'), url: `${home}#work` },
          { name: tWork(`items.${key}.title`), url: `${home}/work/${slug}` },
        ]}
      />

      <div className="shell" style={{ maxWidth: 760 }}>
        <Breadcrumb
          items={[
            { label: tCase('breadcrumbHome'), href: '/' },
            { label: tCase('breadcrumbWork'), href: '/#work' },
            { label: tWork(`items.${key}.title`) },
          ]}
        />

        <p className="mono" style={{ marginBottom: '1rem' }}>
          {tWork(`items.${key}.meta`)}
        </p>
        <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 3.6rem)', marginBottom: '1.5rem' }}>
          {tWork(`items.${key}.title`)}
        </h1>
        <p
          style={{
            color: 'var(--ink-soft)',
            fontSize: '1.05rem',
            marginBottom: '3.5rem',
            maxWidth: '58ch',
          }}
        >
          {tWork(`items.${key}.excerpt`)}
        </p>

        {/* Numbers before prose. The case studies described how a problem
            was solved without ever saying by how much — the same gap the
            CV had before the figures were added back. */}
        <dl
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))',
            gap: '1px',
            background: 'var(--line)',
            border: '1px solid var(--line)',
            margin: '0 0 3.5rem',
          }}
        >
          {CASE_METRICS.map((m) => (
            <div
              key={m}
              style={{
                background: 'var(--bg)',
                padding: '1.2rem 1.3rem',
                display: 'grid',
                gap: '0.4rem',
              }}
            >
              <dt
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 500,
                  fontSize: 'clamp(1.5rem, 3vw, 2.1rem)',
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  color: 'var(--accent)',
                }}
              >
                {tCase(`${key}.metrics.${m}.value`)}
              </dt>
              <dd className="mono" style={{ margin: 0, fontSize: '0.6rem' }}>
                {tCase(`${key}.metrics.${m}.label`)}
              </dd>
            </div>
          ))}
        </dl>

        <div style={{ display: 'grid', gap: '2.5rem' }}>
          <Section label={tCase('problemLabel')}>{tCase(`${key}.problem`)}</Section>

          {/* The 409 demo belongs to this study, so it sits between the
              problem and the explanation rather than after both. */}
          {key === 'concurrency' && <ConflictDemo />}

          <Section label={tCase('approachLabel')}>{tCase(`${key}.approach`)}</Section>

          {/* Three of the four studies have a matching excerpt. The SaaS
              one has none — showing a placeholder would be worse than
              showing nothing. */}
          {snippet && <CodeBlock snippet={snippet} label={tCase('codeLabel')} />}

          <Section label={tCase('resultLabel')}>{tCase(`${key}.result`)}</Section>
        </div>

        <RelatedCaseStudies slug={slug} />
      </div>
    </main>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gap: '0.75rem',
        paddingTop: '2rem',
        borderTop: '1px solid var(--line)',
      }}
    >
      <p className="mono">{label}</p>
      <p style={{ color: 'var(--ink-soft)', fontSize: '1rem', lineHeight: 1.7 }}>
        {children}
      </p>
    </div>
  );
}
