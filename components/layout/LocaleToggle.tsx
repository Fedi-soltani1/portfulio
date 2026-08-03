'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/lib/i18n/navigation';

/**
 * A single button showing the alternative language, never a dropdown.
 * Two options do not deserve a menu.
 */
export function LocaleToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('nav');

  const next = locale === 'fr' ? 'en' : 'fr';

  return (
    <button
      type="button"
      className="mono"
      onClick={() => router.replace(pathname, { locale: next })}
      style={{ color: 'var(--ink-soft)', transition: 'color .25s' }}
    >
      {t('toggleLocale')}
    </button>
  );
}
