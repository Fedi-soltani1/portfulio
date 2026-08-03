'use client';

import { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';

/**
 * A faithful, client-only reproduction of the optimistic concurrency
 * behaviour shipped at TeamXtend.
 *
 * The server row carries an xmin counter. Each editor holds the value it
 * read. On save, the held value is compared to the current one: equal means
 * commit and bump, different means 409 and no write. That is exactly what
 * PostgreSQL and EF Core do — no backend needed to demonstrate it.
 */

type Actor = 'A' | 'B';

interface Result {
  actor: Actor;
  ok: boolean;
  expected: number;
  actual: number;
}

const INITIAL_VALUE = 'Refonte du portail client';
const INITIAL_XMIN = 1042;

export function ConflictDemo() {
  const t = useTranslations('concurrency');

  const [serverValue, setServerValue] = useState(INITIAL_VALUE);
  const [serverXmin, setServerXmin] = useState(INITIAL_XMIN);

  // Each editor keeps the xmin it read when the form opened.
  const [draft, setDraft] = useState<Record<Actor, string>>({
    A: INITIAL_VALUE,
    B: INITIAL_VALUE,
  });
  const [heldXmin, setHeldXmin] = useState<Record<Actor, number>>({
    A: INITIAL_XMIN,
    B: INITIAL_XMIN,
  });

  const [focused, setFocused] = useState<Actor | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const save = useCallback(
    (actor: Actor) => {
      const held = heldXmin[actor];

      if (held !== serverXmin) {
        setResult({ actor, ok: false, expected: held, actual: serverXmin });
        return;
      }

      const nextXmin = serverXmin + 1;
      setServerValue(draft[actor]);
      setServerXmin(nextXmin);
      setHeldXmin((prev) => ({ ...prev, [actor]: nextXmin }));
      setResult({ actor, ok: true, expected: held, actual: nextXmin });
    },
    [draft, heldXmin, serverXmin],
  );

  const reset = useCallback(() => {
    setServerValue(INITIAL_VALUE);
    setServerXmin(INITIAL_XMIN);
    setDraft({ A: INITIAL_VALUE, B: INITIAL_VALUE });
    setHeldXmin({ A: INITIAL_XMIN, B: INITIAL_XMIN });
    setResult(null);
    setFocused(null);
  }, []);

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {/* Presence banner — what SignalR pushes to the other client. */}
      <div
        aria-live="polite"
        style={{
          minHeight: 34,
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.4rem 0.9rem',
          border: '1px solid',
          borderColor: focused ? 'var(--accent)' : 'var(--line)',
          background: focused ? 'var(--bg-elevated)' : 'transparent',
          transition: 'border-color .3s, background .3s',
        }}
      >
        {focused && (
          <>
            <span
              aria-hidden
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--accent)',
              }}
            />
            <span className="mono" style={{ color: 'var(--ink)' }}>
              {focused === 'A' ? t('userA') : t('userB')} {t('presence')}
            </span>
          </>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
          gap: '1px',
          background: 'var(--line)',
          border: '1px solid var(--line)',
        }}
      >
        {(['A', 'B'] as const).map((actor) => (
          <div
            key={actor}
            style={{
              background: 'var(--bg)',
              padding: '1.4rem',
              display: 'grid',
              gap: '0.75rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <span className="mono" style={{ color: 'var(--ink)' }}>
                {actor === 'A' ? t('userA') : t('userB')}
              </span>
              <span className="mono">xmin {heldXmin[actor]}</span>
            </div>

            <label
              className="mono"
              htmlFor={`field-${actor}`}
              style={{ fontSize: '0.62rem' }}
            >
              {t('field')}
            </label>
            <input
              id={`field-${actor}`}
              value={draft[actor]}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, [actor]: e.target.value }))
              }
              onFocus={() => setFocused(actor)}
              onBlur={() => setFocused((f) => (f === actor ? null : f))}
              style={{
                width: '100%',
                padding: '0.55rem 0.7rem',
                background: 'var(--bg-sunken)',
                border: '1px solid var(--line-strong)',
                color: 'var(--ink)',
                font: 'inherit',
                fontSize: '0.9rem',
                borderRadius: 2,
              }}
            />

            <button
              type="button"
              onClick={() => save(actor)}
              style={{
                padding: '0.55rem 1rem',
                border: '1px solid var(--ink)',
                background: 'var(--ink)',
                color: 'var(--bg)',
                fontSize: '0.85rem',
                borderRadius: 2,
                justifySelf: 'start',
              }}
            >
              {t('save')}
            </button>
          </div>
        ))}
      </div>

      {/* Response panel */}
      <div
        aria-live="polite"
        style={{
          border: '1px solid',
          borderColor: result ? (result.ok ? 'var(--line-strong)' : 'var(--accent)') : 'var(--line)',
          padding: '1.1rem 1.3rem',
          minHeight: 92,
          display: 'grid',
          gap: '0.45rem',
          background: result && !result.ok ? 'var(--bg-elevated)' : 'transparent',
          transition: 'border-color .3s, background .3s',
        }}
      >
        {result === null ? (
          <p className="mono">— </p>
        ) : result.ok ? (
          <>
            <p className="mono" style={{ color: 'var(--ink)' }}>
              {t('success')}
            </p>
            <p className="mono">
              {t('actual')} → {result.actual}
            </p>
          </>
        ) : (
          <>
            <p
              className="mono"
              style={{ color: 'var(--accent)', fontSize: '0.8rem' }}
            >
              {t('conflictTitle')}
            </p>
            <p style={{ fontSize: '0.92rem', color: 'var(--ink-soft)' }}>
              {t('conflictBody')}
            </p>
            <p className="mono">
              {t('expected')} {result.expected} · {t('actual')} {result.actual}
            </p>
          </>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <p className="mono">
          db → &quot;{serverValue}&quot; · xmin {serverXmin}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mono"
          style={{ textDecoration: 'underline', textUnderlineOffset: 4 }}
        >
          {t('reset')}
        </button>
      </div>
    </div>
  );
}
