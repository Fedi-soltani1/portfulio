'use client';

import { useLayoutEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { CONTACT } from '@/lib/content';
import { EASE } from '@/lib/animation-config';

export function Hero() {
  const t = useTranslations('hero');
  const rootRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: EASE.out } })
        .fromTo(labelRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 })
        .fromTo(
          nameRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.9 },
          '-=0.3',
        )
        .fromTo(
          detailsRef.current ? Array.from(detailsRef.current.children) : [],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 },
          '-=0.5',
        );

      if (blobRef.current) {
        gsap.to(blobRef.current, {
          x: 40,
          y: -30,
          duration: 8,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      ref={rootRef}
      style={{
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingTop: 56,
        paddingBottom: 'clamp(2rem, 6vh, 4rem)',
        overflow: 'hidden',
      }}
    >
      {/* Fills the empty space above the fold with motion instead of a blank surface. */}
      <div
        ref={blobRef}
        aria-hidden
        style={{
          position: 'absolute',
          top: '-15%',
          right: '-10%',
          width: 'min(60vw, 640px)',
          height: 'min(60vw, 640px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--accent-soft) 0%, transparent 70%)',
          opacity: 0.18,
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'linear-gradient(to bottom, black, transparent 75%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black, transparent 75%)',
          opacity: 0.6,
          pointerEvents: 'none',
        }}
      />

      <div className="shell" style={{ width: '100%', position: 'relative' }}>
        <p ref={labelRef} className="mono" style={{ marginBottom: '1.5rem' }}>
          {t('label')}
        </p>

        <h1 ref={nameRef} style={{ fontSize: 'clamp(3rem, 12vw, 11rem)', marginBottom: '2rem' }}>
          {t('name')}
        </h1>

        <div
          ref={detailsRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--line)',
          }}
        >
          <div>
            <p style={{ fontSize: '1.05rem', fontWeight: 500 }}>{t('role')}</p>
            <p style={{ color: 'var(--ink-soft)' }}>{t('specialty')}</p>
          </div>

          <p
            style={{
              color: 'var(--ink-soft)',
              maxWidth: '46ch',
              gridColumn: 'span 2',
            }}
          >
            {t('intro')}
          </p>

          <div style={{ textAlign: 'right' }}>
            <p className="mono">{t('location')}</p>
            <p className="mono" style={{ color: 'var(--accent)' }}>
              {t('available')}
            </p>
            <a
              href={CONTACT.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mono"
              style={{ textDecoration: 'underline', textUnderlineOffset: 4 }}
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
