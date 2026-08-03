import { useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { NOTES } from '@/lib/content';
import { Reveal } from '@/components/motion/Reveal';
import { SectionHeader } from '@/components/layout/SectionHeader';

/**
 * The notes section, surfaced on the homepage.
 *
 * Without an entry point here, /notes and its three articles would only be
 * reachable from the sitemap — technically indexable, but receiving no
 * internal link from the site's strongest page, which is what actually
 * distributes authority.
 */
export function NotesTeaser() {
  const t = useTranslations('notes');

  return (
    <section id="notes" className="sec sec--raised">
      <div className="shell">
        <SectionHeader
          num="09"
          label={t('indexLabel')}
          title={t('indexTitle')}
          highlight={t('indexHighlight')}
          intro={t('indexIntro')}
        />

        <Reveal stagger style={{ display: 'grid' }}>
          {NOTES.map(({ slug, key }) => (
            <Link
              key={slug}
              href={`/notes/${slug}`}
              className="work-row"
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) auto',
                gap: '1.5rem',
                alignItems: 'center',
                paddingBlock: '1.6rem',
                borderTop: '1px solid var(--line)',
              }}
            >
              <span style={{ display: 'grid', gap: '0.4rem' }}>
                <span className="mono" style={{ fontSize: '0.6rem' }}>
                  {t(`items.${key}.meta`)}
                </span>
                <span
                  className="work-row__title"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 500,
                    fontSize: 'clamp(1.15rem, 2.6vw, 1.6rem)',
                    letterSpacing: '-0.03em',
                    lineHeight: 1.12,
                  }}
                >
                  {t(`items.${key}.title`)}
                </span>
              </span>
              <ArrowUpRight
                size={20}
                aria-hidden
                style={{ color: 'var(--accent)', flexShrink: 0 }}
              />
            </Link>
          ))}
        </Reveal>

        <Link
          href="/notes"
          className="mono pillar-link"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            marginTop: '1.6rem',
            color: 'var(--accent)',
          }}
        >
          {t('backToNotes')}
          <ArrowUpRight size={14} aria-hidden />
        </Link>
      </div>
    </section>
  );
}
