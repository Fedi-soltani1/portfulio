'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from '@/components/providers/ThemeProvider';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const t = useTranslations('nav');

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t('toggleTheme')}
      title={t('toggleTheme')}
      style={{
        width: 34,
        height: 18,
        borderRadius: 9,
        border: '1px solid var(--line-strong)',
        position: 'relative',
        transition: 'border-color .3s',
      }}
    >
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: 2,
          left: theme === 'ivory' ? 2 : 17,
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: 'var(--accent)',
          transition: 'left .45s cubic-bezier(.4,0,.2,1)',
        }}
      />
    </button>
  );
}
