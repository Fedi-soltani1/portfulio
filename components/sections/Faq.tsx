import { useTranslations } from 'next-intl';
import { FAQ_KEYS } from '@/lib/content';
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
          {FAQ_KEYS.map((key) => (
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
                  paddingBottom: '1.6rem',
                }}
              >
                {t(`items.${key}.a`)}
              </p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
