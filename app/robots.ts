import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/**
 * Deliberately open, including to AI crawlers.
 *
 * The default reflex is to block GPTBot and friends to protect content.
 * That calculation inverts for a portfolio: the goal is to be *cited* when
 * someone asks an assistant for a .NET engineer with multi-tenant SaaS
 * experience. Blocking those crawlers would mean disappearing from exactly
 * the surface where the question gets asked.
 *
 * Listing them explicitly rather than relying on the wildcard is what
 * makes the intent unambiguous — and auditable.
 */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Bingbot',
  'CCBot',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: '/' })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
