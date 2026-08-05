import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/lib/i18n/routing';
import { SITE_URL } from '@/lib/site';
import { THEME_SCRIPT } from '@/lib/theme-script';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { PersonJsonLd } from '@/components/seo/PersonJsonLd';
import { ProfilePageJsonLd, WebSiteJsonLd } from '@/components/seo/JsonLd';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { Cursor } from '@/components/ui/Cursor';

// Fonts are self-hosted via @fontsource-variable and imported in globals.css.

/**
 * Namespaces read by 'use client' components. Keep in sync when a client
 * component starts calling useTranslations on a new namespace — a missing
 * entry surfaces immediately as a thrown MISSING_MESSAGE, not a silent
 * blank, so the failure mode is loud.
 */
const CLIENT_NAMESPACES = [
  'nav',
  'hero',
  'experience',
  'concurrency',
  'rbac',
] as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    title: t('title'),
    description: t('description'),
    metadataBase: new URL(SITE_URL),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${SITE_URL}/${locale}`,
      siteName: t('title'),
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        fr: `${SITE_URL}/fr`,
        en: `${SITE_URL}/en`,
        'x-default': `${SITE_URL}/${routing.defaultLocale}`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
    verification: {
      google: 'HuEzZkEktD3rsj7ll4mVAZqE-LjIwpz0hi0HRMgxSrU',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations('nav');
  const tHero = await getTranslations('hero');
  const tMeta = await getTranslations('meta');

  /**
   * Only the namespaces that client components actually read.
   *
   * Left unset, NextIntlClientProvider serialises every message into the
   * RSC payload — including the four case studies, which are rendered
   * entirely on the server and never needed in the browser. Narrowing this
   * is the single largest payload win available on this page.
   */
  const all = await getMessages();
  const messages = Object.fromEntries(
    CLIENT_NAMESPACES.filter((ns) => ns in all).map((ns) => [ns, all[ns]]),
  );

  return (
    /**
     * The document shell renders here, not in the root layout, so that
     * lang carries the real locale in the served HTML. suppressHydrationWarning
     * is required because the inline script mutates data-theme before React
     * hydrates — an intentional mismatch, not a bug to silence blindly.
     */
    <html lang={locale} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          {/* One graph, three nodes: the site, the page, the person.
              They share @id references so a crawler resolves them to a
              single entity rather than three unrelated snippets. */}
          <PersonJsonLd
            locale={locale}
            jobTitle={tHero('role')}
            description={tMeta('description')}
          />
          <WebSiteJsonLd
            locale={locale}
            name={tMeta('title')}
            description={tMeta('description')}
            siteUrl={SITE_URL}
          />
          <ProfilePageJsonLd
            locale={locale}
            siteUrl={SITE_URL}
            name={tHero('name')}
            jobTitle={tHero('role')}
            description={tMeta('description')}
          />
          <ThemeProvider>
            <a href="#main-content" className="skip-link">
              {t('skipToContent')}
            </a>
            <SmoothScroll />
            <ScrollProgress />
            <Cursor />
            {/* Header and Footer live here, not in the homepage component.
                Left there, the eight inner pages per locale rendered with
                no navigation and no footer at all — a dead end for readers
                and a site-wide link set missing from Google's view. */}
            <Header />
            {children}
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
