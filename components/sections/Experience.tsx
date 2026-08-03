'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { EXPERIENCE_KEYS, EXPERIENCE_POINTS, type ExperienceKey } from '@/lib/content';
import { SectionHeader } from '@/components/layout/SectionHeader';

/**
 * Six roles printed in full made a wall of text — the section nobody read.
 *
 * Collapsed to one line each, it becomes scannable, and opening a row is a
 * deliberate act. The most recent role starts open so the section is never
 * empty, and rows stay real <button>s so keyboard and screen readers get
 * the same behaviour as a mouse.
 */
export function Experience() {
  const t = useTranslations('experience');
  const [currentKey] = EXPERIENCE_KEYS;
  const [open, setOpen] = useState<ExperienceKey>(currentKey as ExperienceKey);

  return (
    <section id="experience" className="sec sec--raised">
      <div className="shell">
        <SectionHeader
          num="06"
          label={t('label')}
          title={t('title')}
          highlight={t('highlight')}
        />

        <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {EXPERIENCE_KEYS.map((key) => {
            const isOpen = open === key;
            const points = Array.from(
              { length: EXPERIENCE_POINTS[key] },
              (_, i) => `items.${key}.p${i + 1}`,
            );

            return (
              <li key={key} style={{ borderTop: '1px solid var(--line)' }}>
                <button
                  type="button"
                  onClick={() => setOpen(key)}
                  aria-expanded={isOpen}
                  className="exp-row"
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1fr) auto',
                    gap: '1.5rem',
                    alignItems: 'baseline',
                    paddingBlock: '1.5rem',
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '0.75rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 500,
                        fontSize: 'clamp(1.3rem, 3vw, 2.1rem)',
                        letterSpacing: '-0.03em',
                        color: isOpen ? 'var(--accent)' : 'var(--ink)',
                        transition: 'color .3s',
                      }}
                    >
                      {t(`items.${key}.company`)}
                    </span>
                    {key === currentKey && (
                      <span
                        className="mono"
                        style={{
                          fontSize: '0.58rem',
                          color: 'var(--accent)',
                          border: '1px solid var(--accent)',
                          borderRadius: 999,
                          padding: '0.15rem 0.5rem',
                        }}
                      >
                        {t('present')}
                      </span>
                    )}
                  </span>

                  <span className="mono" style={{ whiteSpace: 'nowrap' }}>
                    {t(`items.${key}.period`)}
                  </span>
                </button>

                {/* Grid-rows 0fr → 1fr animates height without measuring it. */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                    transition: 'grid-template-rows .45s cubic-bezier(.4,0,.2,1)',
                  }}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <div
                      style={{
                        display: 'grid',
                        gap: '0.85rem',
                        paddingBottom: '2rem',
                        maxWidth: '80ch',
                      }}
                    >
                      <p style={{ color: 'var(--ink-soft)', fontSize: '0.92rem' }}>
                        {t(`items.${key}.role`)} — {t(`items.${key}.kind`)}
                      </p>
                      <p
                        style={{
                          color: 'var(--accent)',
                          fontSize: '0.9rem',
                          fontStyle: 'italic',
                        }}
                      >
                        {t(`items.${key}.project`)}
                      </p>
                      <ul
                        style={{
                          margin: 0,
                          paddingLeft: '1.1rem',
                          color: 'var(--ink-soft)',
                          fontSize: '0.94rem',
                          display: 'grid',
                          gap: '0.5rem',
                        }}
                      >
                        {points.map((p) => (
                          <li key={p}>{t(p)}</li>
                        ))}
                      </ul>
                      <p className="mono" style={{ fontSize: '0.64rem' }}>
                        {t('stackLabel')} — {t(`items.${key}.stack`)}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
