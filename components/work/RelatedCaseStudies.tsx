import { getTranslations } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { relatedCaseStudies } from '@/lib/content';

/**
 * Two further studies at the foot of every case study.
 *
 * Before this, a case study had exactly one outgoing link — back to the
 * homepage anchor — so crawl depth stopped there and link equity had
 * nowhere to flow. The rotation in relatedCaseStudies guarantees every
 * study both gives and receives two links, so none is orphaned.
 */
export async function RelatedCaseStudies({ slug }: { slug: string }) {
  const related = relatedCaseStudies(slug);
  if (related.length === 0) return null;

  const t = await getTranslations('work');
  const tCase = await getTranslations('caseStudies');

  return (
    <section
      aria-labelledby="related-heading"
      style={{
        marginTop: 'clamp(4rem, 10vh, 6rem)',
        paddingTop: '2rem',
        borderTop: '1px solid var(--line)',
      }}
    >
      <h2 id="related-heading" className="mono" style={{ marginBottom: '1.5rem' }}>
        {tCase('relatedLabel')}
      </h2>

      <div style={{ display: 'grid', gap: '1px', background: 'var(--line)' }}>
        {related.map(({ key, slug: relatedSlug }) => (
          <Link
            key={relatedSlug}
            href={`/work/${relatedSlug}`}
            className="work-row"
            style={{
              background: 'var(--bg)',
              padding: '1.5rem 0',
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) auto',
              gap: '1.5rem',
              alignItems: 'center',
            }}
          >
            <span style={{ display: 'grid', gap: '0.35rem' }}>
              <span className="mono" style={{ fontSize: '0.6rem' }}>
                {t(`items.${key}.meta`)}
              </span>
              <span
                className="work-row__title"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 500,
                  fontSize: 'clamp(1.1rem, 2.4vw, 1.5rem)',
                  letterSpacing: '-0.03em',
                }}
              >
                {t(`items.${key}.title`)}
              </span>
            </span>
            <ArrowUpRight
              size={20}
              aria-hidden
              style={{ color: 'var(--accent)', flexShrink: 0 }}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
