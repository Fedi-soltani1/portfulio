import { useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import { FAQ_KEYS, FAQ_RELATED_CASE, CASE_STUDIES } from '@/lib/content';
import { Link } from '@/lib/i18n/navigation';
import { Reveal } from '@/components/motion/Reveal';
import { SectionHeader } from '@/components/layout/SectionHeader';

/**
 * Questions phrased the way people actually ask them.
 *
 * Two payoffs. Question-shaped queries are a large and under-contested
 * slice of search, and FAQPage is the format answer engines quote most
 * readily — a well-formed question-and-answer pair is exactly what an
 * assistant lifts into a response.
 *
 * Rendered as <details> so the answers are in the HTML from the start:
 * a crawler reads collapsed content, and keyboard users get open/close
 * behaviour for free.
 */
export function Faq() {
  const t = useTranslations('faq');
  const tWork = useTranslations('work');
  const tNotes = useTranslations('notes');

  return (
    <section id="faq" className="sec">
      <div className="shell">
        <SectionHeader
          num="10"
          label={t('label')}
          title={t('title')}
          highlight={t('highlight')}
        />

        <Reveal stagger style={{ display: 'grid' }}>
          {FAQ_KEYS.map((key) => {
            const relatedSlug = FAQ_RELATED_CASE[key];
            const relatedCase = relatedSlug
              ? CASE_STUDIES.find((c) => c.slug === relatedSlug)
              : undefined;

            return (
              <details key={key} className="faq-item">
                <summary>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 500,
                      fontSize: 'clamp(1.05rem, 2.4vw, 1.4rem)',
                      letterSpacing: '-0.025em',
                    }}
                  >
                    {t(`items.${key}.q`)}
                  </span>
                </summary>
                <p
                  style={{
                    color: 'var(--ink-soft)',
                    fontSize: '0.98rem',
                    lineHeight: 1.72,
                    maxWidth: '72ch',
                    marginBottom: relatedCase ? '0.9rem' : 0,
                  }}
                >
                  {t(`items.${key}.a`)}
                </p>
                {relatedCase && (
                  <Link
                    href={`/work/${relatedCase.slug}`}
                    className="mono"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      color: 'var(--accent)',
                      paddingBottom: '1.6rem',
                    }}
                  >
                    {tNotes('relatedCaseLabel')}
                    {' — '}
                    {tWork(`items.${relatedCase.key}.title`)}
                    <ArrowUpRight size={14} aria-hidden />
                  </Link>
                )}
              </details>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
