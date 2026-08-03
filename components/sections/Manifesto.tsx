import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/motion/Reveal';
import { IsolationDiagram } from '@/components/scene/IsolationDiagram';
import { MANIFESTO_FIGURES } from '@/lib/content';

/**
 * Statement, diagram and figures, in that order of importance.
 *
 * The diagram states the idea, the figures make it checkable. Neither
 * works as well alone: a diagram with no numbers is a claim, and numbers
 * with no diagram are trivia. The WebGL scene this replaces did the first
 * job worse and could not do the second at all.
 *
 * Every figure maps to something already in the CV — nothing invented.
 */
export function Manifesto() {
  const t = useTranslations('manifesto');
  const statement = t('statement');
  const highlight = t('highlight');
  const [before, after] = statement.split(highlight);

  return (
    <section id="manifesto" className="sec">
      <div className="shell" style={{ position: 'relative' }}>
        <span aria-hidden className="sec-num" style={{ right: 'auto', left: '-0.05em' }}>
          02
        </span>

        <p className="mono" style={{ position: 'relative', marginBottom: '2.5rem' }}>
          {t('label')}
        </p>

        <div className="manifesto-grid">
          <Reveal className="manifesto-figure">
            <IsolationDiagram />
          </Reveal>

          <Reveal className="manifesto-text">
            <p className="t-lead" style={{ marginBottom: '1.4rem' }}>
              {before}
              <span style={{ color: 'var(--accent)' }}>{highlight}</span>
              {after}
            </p>
            <p style={{ color: 'var(--ink-soft)', fontSize: '1rem' }}>{t('body')}</p>
          </Reveal>
        </div>

        <Reveal
          stagger
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 165px), 1fr))',
            gap: '1px',
            background: 'var(--line)',
            border: '1px solid var(--line)',
            marginTop: 'clamp(2.5rem, 6vh, 4rem)',
          }}
        >
          {MANIFESTO_FIGURES.map((key) => (
            <div
              key={key}
              style={{
                background: 'var(--bg)',
                padding: '1.5rem 1.4rem',
                display: 'grid',
                gap: '0.45rem',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 500,
                  fontSize: 'clamp(1.6rem, 3.4vw, 2.4rem)',
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  color: 'var(--ink)',
                }}
              >
                {t(`figures.${key}.value`)}
              </span>
              <span className="mono" style={{ fontSize: '0.6rem' }}>
                {t(`figures.${key}.label`)}
              </span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
