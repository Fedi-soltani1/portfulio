import { getTranslations } from 'next-intl/server';
import { FAQ_KEYS } from '@/lib/content';

/**
 * FAQPage markup for the questions section.
 *
 * This is the single highest-leverage schema for being *quoted* rather
 * than merely indexed: an answer engine looking for a short authoritative
 * answer to "xmin or rowversion?" can lift the pair verbatim.
 */
export async function FaqJsonLd() {
  const t = await getTranslations('faq');

  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_KEYS.map((key) => ({
      '@type': 'Question',
      name: t(`items.${key}.q`),
      acceptedAnswer: {
        '@type': 'Answer',
        text: t(`items.${key}.a`),
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
