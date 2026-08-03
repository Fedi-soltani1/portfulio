import { useTranslations } from 'next-intl';

/**
 * The tenant isolation diagram, as flat SVG.
 *
 * This replaces the WebGL scene. The 3D version had three problems the
 * copy could not fix: its framing depended on the height of the text
 * column beside it, it was hidden entirely below 860px, and a rotating
 * volume is harder to read than a static plan. An SVG scales to any box,
 * costs nothing at runtime, and states the same idea more clearly.
 *
 * Colours come from CSS variables, so the diagram follows the theme
 * transition for free — no subscription to the theme provider needed.
 */
export function IsolationDiagram() {
  const t = useTranslations('manifesto.diagram');

  return (
    <figure style={{ margin: 0 }}>
      <svg
        viewBox="0 0 300 160"
        width="100%"
        role="img"
        aria-label={t('alt')}
        style={{ overflow: 'visible' }}
      >
        {/* Boundaries first, so the cells sit on top of them. */}
        <line
          x1="99" y1="18" x2="99" y2="142"
          stroke="var(--line-strong)" strokeWidth="1" strokeDasharray="4 4"
        />
        <line
          x1="201" y1="18" x2="201" y2="142"
          stroke="var(--line-strong)" strokeWidth="1" strokeDasharray="4 4"
        />

        {/* Tenant cells. The middle one is the active tenant. */}
        <rect x="8" y="34" width="82" height="92" fill="none" stroke="var(--line-strong)" strokeWidth="1" />
        <rect x="109" y="34" width="82" height="92" fill="none" stroke="var(--accent)" strokeWidth="1.4" />
        <rect x="210" y="34" width="82" height="92" fill="none" stroke="var(--line-strong)" strokeWidth="1" />

        {/* Rows of data, coloured by owning tenant. */}
        <g fill="var(--line-strong)">
          <circle cx="30" cy="58" r="4" />
          <circle cx="52" cy="82" r="4" />
          <circle cx="36" cy="106" r="4" />
          <circle cx="232" cy="60" r="4" />
          <circle cx="258" cy="84" r="4" />
          <circle cx="240" cy="108" r="4" />
        </g>
        <g fill="var(--accent)">
          <circle cx="131" cy="58" r="4" />
          <circle cx="155" cy="84" r="4" />
          <circle cx="137" cy="108" r="4" />
        </g>

        {/* The query that tries to leave tenant B and is stopped. */}
        <path
          d="M167 80 L196 80"
          stroke="var(--accent)" strokeWidth="1.3" strokeDasharray="3 3" fill="none"
        />
        <g stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round">
          <line x1="197" y1="75" x2="205" y2="85" />
          <line x1="205" y1="75" x2="197" y2="85" />
        </g>

        {/* Labels */}
        <g
          fontFamily="var(--font-mono)"
          fontSize="7"
          letterSpacing="1.2"
          fill="var(--ink-faint)"
        >
          <text x="8" y="26">{t('tenantA').toUpperCase()}</text>
          <text x="210" y="26">{t('tenantC').toUpperCase()}</text>
          <text x="109" y="26" fill="var(--accent)">{t('tenantB').toUpperCase()}</text>
          <text x="109" y="152">{t('boundary')}</text>
        </g>
      </svg>

      <figcaption
        className="mono"
        style={{ marginTop: '1rem', fontSize: '0.62rem', color: 'var(--accent)' }}
      >
        {t('blocked')}
      </figcaption>
    </figure>
  );
}
