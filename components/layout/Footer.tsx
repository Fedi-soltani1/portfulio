import { useTranslations } from 'next-intl';
import { CONTACT } from '@/lib/content';

export function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer style={{ borderTop: '1px solid var(--line)', paddingBlock: '2rem' }}>
      <div
        className="shell"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '1rem',
        }}
      >
        <p className="mono">
          © {year} {CONTACT.name} — {t('rights')}
        </p>
        <p className="mono">{t('built')}</p>
      </div>
    </footer>
  );
}
