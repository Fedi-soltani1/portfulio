import { useTranslations } from 'next-intl';
import { STACK, STACK_GROUPS } from '@/lib/content';
import { Reveal } from '@/components/motion/Reveal';
import { SectionHeader } from '@/components/layout/SectionHeader';

/**
 * One row per category: label on the left, technologies as pills on the right.
 *
 * Deliberately static — an infinite marquee draws attention to itself rather
 * than to the content, and this section's job is to be scanned quickly and
 * read as credible. The production context of each item stays available on
 * hover via title, so nothing that was there is lost.
 */
export function Stack() {
  const t = useTranslations('stack');

  return (
    <section id="stack" className="sec">
      <div className="shell">
        <SectionHeader
          num="08"
          label={t('label')}
          title={t('title')}
          highlight={t('highlight')}
        />

        <Reveal stagger style={{ display: 'grid' }}>
          {STACK_GROUPS.map((group) => (
            <div
              key={group}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 190px) minmax(0, 1fr)',
                gap: '1.5rem',
                alignItems: 'baseline',
                paddingBlock: '1.15rem',
                borderTop: '1px solid var(--line)',
              }}
            >
              <p className="mono" style={{ color: 'var(--accent)' }}>
                {t(`groups.${group}`)}
              </p>

              <ul
                style={{
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.4rem',
                }}
              >
                {STACK[group].map((item) => (
                  <li key={item.name}>
                    <span
                      className="tech-pill"
                      title={item.context}
                      style={{
                        display: 'inline-block',
                        padding: '0.3rem 0.7rem',
                        border: '1px solid var(--line-strong)',
                        borderRadius: 3,
                        fontSize: '0.85rem',
                        color: 'var(--ink-soft)',
                        cursor: 'default',
                        transition: 'border-color .25s, color .25s, background .25s',
                      }}
                    >
                      {item.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>

        <p
          className="mono"
          style={{
            marginTop: '1.8rem',
            paddingTop: '1.2rem',
            borderTop: '1px solid var(--line)',
            textAlign: 'right',
            fontSize: '0.64rem',
          }}
        >
          {t('hint')}
        </p>
      </div>
    </section>
  );
}
