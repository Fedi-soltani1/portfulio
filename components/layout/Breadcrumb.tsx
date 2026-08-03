import { ChevronRight } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';

/**
 * Visible breadcrumb, paired with BreadcrumbList schema on the page.
 *
 * Two jobs at once: it gives a deep page an upward link — the case studies
 * previously had none, which made them dead ends for a crawler — and it
 * lets Google replace the raw URL in the result with a readable path.
 */
export function Breadcrumb({
  items,
}: {
  /** Last item is the current page and is not linked. */
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: '2.5rem' }}>
      <ol
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.4rem',
        }}
      >
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li
              key={item.label}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="mono breadcrumb-link"
                  style={{ transition: 'color .25s' }}
                >
                  {item.label}
                </Link>
              ) : (
                <span className="mono" style={{ color: 'var(--ink)' }} aria-current="page">
                  {item.label}
                </span>
              )}
              {!last && (
                <ChevronRight
                  size={12}
                  aria-hidden
                  style={{ color: 'var(--ink-faint)' }}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
