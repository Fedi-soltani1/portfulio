import { CONTACT, STACK } from '@/lib/content';
import { SITE_URL } from '@/lib/site';

/**
 * schema.org Person, with a stable @id every other schema references.
 *
 * The @id is what turns a pile of disconnected snippets into one graph:
 * WebSite, ProfilePage and each TechArticle all point back here, so a
 * crawler resolves them to a single entity instead of four unrelated
 * mentions of a name. That is the difference between being indexed and
 * being recognised as a person in the Knowledge Graph.
 */
export function PersonJsonLd({
  locale,
  jobTitle,
  description,
}: {
  locale: string;
  jobTitle: string;
  description: string;
}) {
  // Only production technologies — "familiar" is excluded so the skill
  // list stays defensible if anyone checks it against the CV.
  const skills = [
    ...STACK.core,
    ...STACK.architecture,
    ...STACK.data,
    ...STACK.security,
    ...STACK.quality,
    ...STACK.cloud,
  ].map((t) => t.name);

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: CONTACT.name,
    givenName: 'Fedi',
    familyName: 'Soltani',
    jobTitle,
    description,
    email: `mailto:${CONTACT.email}`,
    telephone: CONTACT.phones,
    url: `${SITE_URL}/${locale}`,
    image: `${SITE_URL}/${locale}/opengraph-image`,
    sameAs: [CONTACT.linkedin],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Tunis',
      addressCountry: 'TN',
    },
    // Occupation carries the job-market signals: the role, where it
    // applies, and the skills that back it.
    hasOccupation: {
      '@type': 'Occupation',
      name: jobTitle,
      occupationLocation: { '@type': 'City', name: 'Tunis' },
      skills: skills.join(', '),
      occupationalCategory: '15-1252.00 Software Developers',
    },
    worksFor: {
      '@type': 'Organization',
      name: 'TeamXtend',
    },
    knowsLanguage: [
      { '@type': 'Language', name: 'Arabic', alternateName: 'ar' },
      { '@type': 'Language', name: 'French', alternateName: 'fr' },
      { '@type': 'Language', name: 'English', alternateName: 'en' },
    ],
    knowsAbout: skills,
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'ESPRIT — École Supérieure Privée d’Ingénierie et de Technologies',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Tunis',
        addressCountry: 'TN',
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
