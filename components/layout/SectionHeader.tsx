import { Reveal } from '@/components/motion/Reveal';

interface Props {
  /** Two-digit marker, e.g. "03". Rendered huge and faint behind the title. */
  num: string;
  /** Monospace eyebrow, e.g. "03 / Expertise". */
  label: string;
  title: string;
  /** Optional word inside the title to colour with the accent. */
  highlight?: string;
  /** Short supporting line under the title. */
  intro?: string;
  align?: 'left' | 'right';
}

/**
 * One header for every section.
 *
 * Before this existed, each section repeated the same "small label left,
 * medium title right" row — eight times. Identical rhythm plus identical
 * scale is exactly what makes a page read as a document rather than a
 * composition, so this concentrates the contrast: a watermark numeral for
 * depth, and a title far larger than anything around it.
 */
export function SectionHeader({
  num,
  label,
  title,
  highlight,
  intro,
  align = 'left',
}: Props) {
  const parts = highlight ? title.split(highlight) : null;

  return (
    <header
      style={{
        position: 'relative',
        marginBottom: 'clamp(2.5rem, 6vh, 4.5rem)',
        textAlign: align,
      }}
    >
      <span aria-hidden className="sec-num">
        {num}
      </span>

      <Reveal style={{ position: 'relative', zIndex: 1 }}>
        <p className="mono" style={{ marginBottom: '1.1rem' }}>
          {label}
        </p>

        <h2 className="t-display">
          {parts ? (
            <>
              {parts[0]}
              <span style={{ color: 'var(--accent)' }}>{highlight}</span>
              {parts[1]}
            </>
          ) : (
            title
          )}
        </h2>

        {intro && (
          <p
            style={{
              color: 'var(--ink-soft)',
              maxWidth: '52ch',
              marginTop: '1.5rem',
              marginInline: align === 'right' ? '0 0' : undefined,
              marginLeft: align === 'right' ? 'auto' : undefined,
              fontSize: '1.02rem',
            }}
          >
            {intro}
          </p>
        )}
      </Reveal>
    </header>
  );
}
