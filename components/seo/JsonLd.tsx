/**
 * Structured data emitters.
 *
 * Schema is not a ranking factor on its own, but it is the main lever for
 * rich results, Knowledge Graph entity recognition and — increasingly —
 * being cited in AI answers rather than merely crawled. A page that only
 * declares Person leaves every one of those on the table.
 *
 * Everything here is server-rendered: AI crawlers read the HTML the server
 * returns and do not execute JavaScript, so client-side schema is invisible
 * to them.
 */

function Ld({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Fully controlled content, no user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ------------------------------------------------------------- website */

export function WebSiteJsonLd({
  locale,
  name,
  description,
  siteUrl,
}: {
  locale: string;
  name: string;
  description: string;
  siteUrl: string;
}) {
  return (
    <Ld
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: `${siteUrl}/${locale}`,
        name,
        description,
        inLanguage: locale,
        publisher: { '@id': `${siteUrl}/#person` },
      }}
    />
  );
}

/* -------------------------------------------------------- profile page */

/**
 * ProfilePage tells Google the page is *about a person*, which is what
 * makes a Knowledge Panel possible for a name query. Person alone only
 * says a person is mentioned.
 */
export function ProfilePageJsonLd({
  locale,
  siteUrl,
  name,
  jobTitle,
  description,
}: {
  locale: string;
  siteUrl: string;
  name: string;
  jobTitle: string;
  description: string;
}) {
  return (
    <Ld
      data={{
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        '@id': `${siteUrl}/${locale}#profilepage`,
        url: `${siteUrl}/${locale}`,
        name: `${name} — ${jobTitle}`,
        description,
        inLanguage: locale,
        isPartOf: { '@id': `${siteUrl}/#website` },
        mainEntity: { '@id': `${siteUrl}/#person` },
      }}
    />
  );
}

/* ---------------------------------------------------------- breadcrumb */

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  return (
    <Ld
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}

/* -------------------------------------------------------- tech article */

/**
 * The case studies are technical articles, not portfolio entries — they
 * explain a problem, a decision and a result. TechArticle is what makes
 * them eligible to be surfaced for the long-tail queries they actually
 * answer, such as "EF Core global query filter multi-tenant".
 */
export function TechArticleJsonLd({
  siteUrl,
  locale,
  slug,
  headline,
  description,
  keywords,
  dependencies,
  personId,
}: {
  siteUrl: string;
  locale: string;
  slug: string;
  headline: string;
  description: string;
  keywords: string[];
  dependencies: string;
  personId: string;
}) {
  const url = `${siteUrl}/${locale}/work/${slug}`;

  return (
    <Ld
      data={{
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        '@id': `${url}#article`,
        headline,
        description,
        url,
        inLanguage: locale,
        keywords: keywords.join(', '),
        // The prior knowledge a reader needs — a real TechArticle field,
        // and a strong topical signal.
        dependencies,
        proficiencyLevel: 'Expert',
        author: { '@id': personId },
        publisher: { '@id': personId },
        isPartOf: { '@id': `${siteUrl}/#website` },
        mainEntityOfPage: url,
      }}
    />
  );
}
