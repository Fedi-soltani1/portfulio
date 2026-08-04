'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/lib/i18n/navigation';
import { ThemeToggle } from './ThemeToggle';
import { LocaleToggle } from './LocaleToggle';

const LINKS = [
  { id: 'manifesto', key: 'manifesto' },
  { id: 'expertise', key: 'expertise' },
  { id: 'rbac', key: 'rbac' },
  { id: 'concurrency', key: 'concurrency' },
  { id: 'experience', key: 'experience' },
  { id: 'work', key: 'work' },
  { id: 'notes', key: 'notes' },
  { id: 'faq', key: 'faq' },
  { id: 'contact', key: 'contact' },
] as const;

/**
 * Site-wide navigation.
 *
 * The links were bare fragments (`#work`), which only resolve on the
 * homepage — from a case study or a note they pointed at anchors that do
 * not exist on that page. They are now absolute (`/#work`), so the same
 * header works everywhere and every page carries the full internal link
 * set that Google uses to understand site structure.
 *
 * On the homepage they stay plain <a> so the smooth-scroll handler keeps
 * them; elsewhere they become router links that navigate then jump.
 */
export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const onHome = pathname === '/';

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backdropFilter: 'blur(10px)',
        background: 'color-mix(in srgb, var(--bg) 80%, transparent)',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <div
        className="shell"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 56,
          gap: 24,
        }}
      >
        <Link
          href="/"
          className="mono"
          style={{ color: 'var(--ink)', flexShrink: 0 }}
          aria-label={t('logoLabel')}
        >
          SF
        </Link>

        <nav
          aria-label="Sections"
          className="header-nav"
          style={{ display: 'flex', gap: 20, alignItems: 'center' }}
        >
          {LINKS.map((l) =>
            onHome ? (
              <a
                key={l.id}
                href={`#${l.id}`}
                className="mono header-link"
                style={{ transition: 'color .25s' }}
              >
                {t(l.key)}
              </a>
            ) : (
              <Link
                key={l.id}
                href={`/#${l.id}`}
                className="mono header-link"
                style={{ transition: 'color .25s' }}
              >
                {t(l.key)}
              </Link>
            ),
          )}
        </nav>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexShrink: 0 }}>
          <LocaleToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
