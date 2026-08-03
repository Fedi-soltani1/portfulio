'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, X } from 'lucide-react';

/**
 * The multi-tenant access model, made manipulable.
 *
 * The isolation pillar was the only one still illustrated by a static
 * diagram, while it is the strongest thing on this CV. Letting a visitor
 * switch role and tenant and watch rows disappear says more in five
 * seconds than a paragraph does.
 *
 * The two mechanisms are modelled separately on purpose, because
 * conflating them is the classic mistake:
 *
 *  - the tenant filter removes rows from the query itself, so forging an
 *    id changes nothing;
 *  - navigation flags only hide links, and protect nothing on their own.
 */

type Role = 'admin' | 'manager' | 'collaborator';
type Tenant = 'north' | 'south';

interface Project {
  id: string;
  name: string;
  tenant: Tenant;
  /** Owning user; a collaborator only sees their own. */
  owner: 'self' | 'other';
}

const PROJECTS: readonly Project[] = [
  { id: 'PRJ-104', name: 'Refonte portail client', tenant: 'north', owner: 'self' },
  { id: 'PRJ-118', name: 'Migration EF Core 10', tenant: 'north', owner: 'other' },
  { id: 'PRJ-131', name: 'Audit contrats API', tenant: 'north', owner: 'other' },
  { id: 'PRJ-207', name: 'Onboarding fournisseurs', tenant: 'south', owner: 'other' },
  { id: 'PRJ-219', name: 'Reprise de données', tenant: 'south', owner: 'other' },
] as const;

const NAV = ['projects', 'teams', 'users', 'settings'] as const;
type NavKey = (typeof NAV)[number];

/** Mirrors the canNavigate flags returned by the API. */
const CAN_NAVIGATE: Record<Role, Record<NavKey, boolean>> = {
  admin: { projects: true, teams: true, users: true, settings: true },
  manager: { projects: true, teams: true, users: false, settings: false },
  collaborator: { projects: true, teams: false, users: false, settings: false },
};

const CAN_WRITE: Record<Role, boolean> = {
  admin: true,
  manager: true,
  collaborator: false,
};

const ROLES: readonly Role[] = ['admin', 'manager', 'collaborator'];
const TENANTS: readonly Tenant[] = ['north', 'south'];
const TENANT_LABEL: Record<Tenant, string> = { north: 'Nord', south: 'Sud' };

export function RbacExplorer() {
  const t = useTranslations('rbac');
  const [role, setRole] = useState<Role>('manager');
  const [tenant, setTenant] = useState<Tenant>('north');

  const visible = useMemo(() => {
    // Step 1 — the Global Query Filter. Rows from another tenant are not
    // filtered out of the result: they never enter the query.
    const scoped = PROJECTS.filter((p) => p.tenant === tenant);

    // Step 2 — entity-level permissions, applied after tenant scoping.
    return role === 'collaborator'
      ? scoped.filter((p) => p.owner === 'self')
      : scoped;
  }, [role, tenant]);

  const hidden = PROJECTS.length - visible.length;

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {/* Controls */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
          gap: '1.5rem',
        }}
      >
        <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
          <legend className="mono" style={{ marginBottom: '0.6rem', padding: 0 }}>
            {t('roleLabel')}
          </legend>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {ROLES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                aria-pressed={role === r}
                className="rbac-chip"
                data-active={role === r}
              >
                {t(`roles.${r}`)}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
          <legend className="mono" style={{ marginBottom: '0.6rem', padding: 0 }}>
            {t('tenantLabel')}
          </legend>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {TENANTS.map((tn) => (
              <button
                key={tn}
                type="button"
                onClick={() => setTenant(tn)}
                aria-pressed={tenant === tn}
                className="rbac-chip"
                data-active={tenant === tn}
              >
                {TENANT_LABEL[tn]}
              </button>
            ))}
          </div>
        </fieldset>
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
        {/* Navigation flags */}
        <div style={{ background: 'var(--bg)', padding: '1.3rem' }}>
          <p className="mono" style={{ marginBottom: '0.9rem' }}>
            {t('navLabel')}
          </p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '0.5rem' }}>
            {NAV.map((item) => {
              const allowed = CAN_NAVIGATE[role][item];
              return (
                <li
                  key={item}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    fontSize: '0.92rem',
                    color: allowed ? 'var(--ink)' : 'var(--ink-faint)',
                    textDecoration: allowed ? 'none' : 'line-through',
                  }}
                >
                  {t(`nav.${item}`)}
                  {allowed ? (
                    <Check size={15} aria-hidden style={{ color: 'var(--accent)' }} />
                  ) : (
                    <X size={15} aria-hidden />
                  )}
                  <span className="sr-only">
                    {allowed ? t('yes') : t('no')}
                  </span>
                </li>
              );
            })}
          </ul>

          <p
            className="mono"
            style={{ marginTop: '1.1rem', paddingTop: '0.8rem', borderTop: '1px solid var(--line)' }}
          >
            {t('canWrite')} — {CAN_WRITE[role] ? t('yes') : t('no')}
          </p>
        </div>

        {/* Query result */}
        <div style={{ background: 'var(--bg)', padding: '1.3rem' }}>
          <p className="mono" style={{ marginBottom: '0.9rem' }}>
            {t('dataLabel')}
          </p>

          <ul
            aria-live="polite"
            style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '0.45rem' }}
          >
            {visible.map((p) => (
              <li
                key={p.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto minmax(0, 1fr)',
                  gap: '0.7rem',
                  fontSize: '0.88rem',
                  alignItems: 'baseline',
                }}
              >
                <span className="mono" style={{ fontSize: '0.6rem' }}>
                  {p.id}
                </span>
                <span style={{ color: 'var(--ink-soft)' }}>{p.name}</span>
              </li>
            ))}
          </ul>

          <p
            className="mono"
            style={{
              marginTop: '1.1rem',
              paddingTop: '0.8rem',
              borderTop: '1px solid var(--line)',
              color: 'var(--accent)',
            }}
          >
            {visible.length} {t('rowsVisible')}
            {hidden > 0 && ` · ${hidden} ${t('blocked').toLowerCase()}`}
          </p>
        </div>
      </div>
    </div>
  );
}
