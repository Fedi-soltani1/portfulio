import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/motion/Reveal';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { RbacExplorer } from '@/components/rbac/RbacExplorer';

export function Rbac() {
  const t = useTranslations('rbac');

  return (
    <section id="rbac" className="sec sec--raised">
      <div className="shell">
        <SectionHeader
          num="04"
          label={t('label')}
          title={t('title')}
          highlight={t('highlight')}
          intro={t('intro')}
        />

        <Reveal>
          <RbacExplorer />

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
