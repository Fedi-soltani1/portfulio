import { useTranslations } from 'next-intl';
import { ConflictDemo } from '@/components/concurrency/ConflictDemo';
import { Reveal } from '@/components/motion/Reveal';
import { SectionHeader } from '@/components/layout/SectionHeader';

export function Concurrency() {
  const t = useTranslations('concurrency');

  return (
    <section id="concurrency" className="sec">
      <div className="shell">
        <SectionHeader
          num="05"
          label={t('label')}
          title={t('title')}
          highlight={t('highlight')}
          intro={t('intro')}
        />

        <Reveal>
          <ConflictDemo />

          <p
            style={{
              color: 'var(--ink-soft)',
              fontSize: '0.92rem',
              maxWidth: '76ch',
              marginTop: '2.2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--line)',
            }}
          >
            {t('explain')}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
