import { useLocale, useTranslations } from 'next-intl';
// lucide-react v1 dropped brand marks, so LinkedIn uses a generic external link.
import { Mail, ExternalLink, FileDown } from 'lucide-react';
import { CONTACT } from '@/lib/content';
import { Reveal } from '@/components/motion/Reveal';

export function Contact() {
  const t = useTranslations('contact');
  const locale = useLocale();
  const cvHref = locale === 'en' ? CONTACT.cv.en : CONTACT.cv.fr;

  const links = [
    { href: `mailto:${CONTACT.email}`, label: t('email'), Icon: Mail },
    { href: CONTACT.linkedin, label: t('linkedin'), Icon: ExternalLink },
    { href: cvHref, label: t('cv'), Icon: FileDown },
  ];

  // Education and languages were written into the message files but never
  // rendered — the two blocks of the CV that had no home on the site.
  const facts = [
    { label: t('phoneLabel'), value: t('phone') },
    { label: t('locationLabel'), value: t('location') },
    { label: t('educationLabel'), value: t('education') },
    { label: t('languagesLabel'), value: t('languages') },
  ];

  return (
    <section id="contact" className="sec sec--raised">
      <div className="shell" style={{ position: 'relative' }}>
        <span aria-hidden className="sec-num">
          11
        </span>

        <Reveal style={{ position: 'relative' }}>
          <p className="mono" style={{ marginBottom: '1.5rem' }}>
            {t('label')}
          </p>

          <h2
            className="t-display"
            style={{ marginBottom: '1.8rem', maxWidth: '14ch' }}
          >
            {t('title')}
          </h2>

          <p
            style={{
              color: 'var(--ink-soft)',
              maxWidth: '50ch',
              marginBottom: '3rem',
              fontSize: '1.02rem',
            }}
          >
            {t('body')}
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 210px), 1fr))',
              gap: '1px',
              background: 'var(--line)',
              border: '1px solid var(--line)',
            }}
          >
            {links.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="contact-link"
                style={{
                  background: 'var(--bg)',
                  padding: '1.4rem 1.6rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.7rem',
                  fontSize: '0.98rem',
                  transition: 'background .25s, color .25s',
                }}
              >
                <Icon size={17} aria-hidden style={{ color: 'var(--accent)' }} />
                {label}
              </a>
            ))}
          </div>

          <dl
            style={{
              margin: '3rem 0 0',
              display: 'grid',
              gap: '0',
            }}
          >
            {facts.map(({ label, value }) => (
              <div
                key={label}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 150px) minmax(0, 1fr)',
                  gap: '1.5rem',
                  paddingBlock: '0.9rem',
                  borderTop: '1px solid var(--line)',
                  alignItems: 'baseline',
                }}
              >
                <dt className="mono" style={{ margin: 0 }}>
                  {label}
                </dt>
                <dd
                  style={{
                    margin: 0,
                    color: 'var(--ink-soft)',
                    fontSize: '0.94rem',
                  }}
                >
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
