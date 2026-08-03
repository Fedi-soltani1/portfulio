/**
 * Canonical site URL.
 *
 * Read from the environment so the same build works on a preview
 * deployment and in production. Vercel sets VERCEL_PROJECT_PRODUCTION_URL
 * automatically; NEXT_PUBLIC_SITE_URL overrides it for a custom domain.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return 'http://localhost:3000';
}

export const SITE_URL = resolveSiteUrl();
