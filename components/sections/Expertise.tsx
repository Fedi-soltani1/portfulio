import { useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { PILLAR_KEYS, caseStudyForPillar } from '@/lib/content';
import { Reveal } from '@/components/motion/Reveal';
import { SectionHeader } from '@/components/layout/SectionHeader';

export function Expertise() {
  const t = useTranslations('expertise');

  return (
    <section id="expertise" className="sec sec--raised">
      <div className="shell">
        <SectionHeader
          num="03"
          label={t('label')}
          title={t('title')}
          highlight={t('highlight')}
        />

        <Reveal
          stagger
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            gap: '1px',
            background: 'var(--line)',
            border: '1px solid var(--line)',
          }}
        >
          {PILLAR_KEYS.map((key) => (
            <article
              key={key}
              className="pillar"
              style={{
                background: 'var(--bg)',
                padding: '2.2rem 1.7rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.9rem',
                minHeight: 300,
                transition: 'background .3s',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2.4rem',
                  lineHeight: 1,
                  color: 'var(--accent)',
                  letterSpacing: '-0.03em',
                }}
              >
                {t(`pillars.${key}.index`)}
              </span>
              <h3 style={{ fontSize: '1.32rem' }}>{t(`pillars.${key}.title`)}</h3>
              <p
                style={{
                  color: 'var(--ink-soft)',
                  fontSize: '0.94rem',
                  lineHeight: 1.62,
                  flex: 1,
                }}
              >
                {t(`pillars.${key}.body`)}
              </p>
              <p className="mono" style={{ fontSize: '0.64rem' }}>
                {t(`pillars.${key}.tags`)}
              </p>

              {/* Each pillar points at the study that proves it. Four extra
                  internal links from the highest-authority page on the site,
                  with anchor text that matches the target's topic. */}
              {(() => {
                const study = caseStudyForPillar(key);
                if (!study) return null;
                return (
                  <Link
                    href={`/work/${study.slug}`}
                    className="pillar-link mono"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      color: 'var(--accent)',
                      fontSize: '0.62rem',
                    }}
                  >
                    {t('readCase')}
                    <ArrowUpRight size={13} aria-hidden />
                  </Link>
                );
              })()}
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
