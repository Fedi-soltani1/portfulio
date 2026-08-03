import { useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { CASE_STUDIES } from '@/lib/content';
import { Reveal } from '@/components/motion/Reveal';
import { SectionHeader } from '@/components/layout/SectionHeader';

export function Work() {
  const t = useTranslations('work');

  return (
    /* The one fully inverted section. It lands right before the stack
       marquee, so the darkest and the busiest moments of the page sit
       next to each other instead of competing from a distance. */
    <section id="work" className="sec sec--invert">
      <div className="shell">
        <SectionHeader
          num="07"
          label={t('label')}
          title={t('title')}
          highlight={t('highlight')}
        />

        <Reveal stagger style={{ display: 'grid' }}>
          {CASE_STUDIES.map(({ key, slug }, i) => (
            <Link
              key={slug}
              href={`/work/${slug}`}
              className="work-row"
              style={{
                padding: '2.2rem 0',
                display: 'grid',
                gridTemplateColumns: 'auto minmax(0, 1fr) auto',
                gap: '1.8rem',
                alignItems: 'center',
                borderTop: '1px solid var(--line)',
                borderBottom:
                  i === CASE_STUDIES.length - 1 ? '1px solid var(--line)' : undefined,
              }}
            >
              <span
                className="mono"
                style={{ fontSize: '0.68rem', alignSelf: 'flex-start', paddingTop: '0.4rem' }}
              >
                0{i + 1}
              </span>

              <div style={{ display: 'grid', gap: '0.55rem' }}>
                <h3
                  className="work-row__title"
                  style={{ fontSize: 'clamp(1.5rem, 3.6vw, 2.6rem)' }}
                >
                  {t(`items.${key}.title`)}
                </h3>
                <p
                  style={{
                    color: 'var(--ink-soft)',
                    fontSize: '0.95rem',
                    maxWidth: '62ch',
                  }}
                >
                  {t(`items.${key}.excerpt`)}
                </p>
                <p className="mono" style={{ fontSize: '0.64rem' }}>
                  {t(`items.${key}.meta`)}
                </p>
              </div>

              <span
                className="work-row__arrow"
                aria-hidden
                style={{
                  display: 'grid',
                  placeItems: 'center',
                  width: 46,
                  height: 46,
                  borderRadius: '50%',
                  border: '1px solid var(--line-strong)',
                  color: 'var(--accent)',
                  flexShrink: 0,
                }}
              >
                <ArrowUpRight size={20} />
              </span>
              <span className="sr-only">{t('readMore')}</span>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
