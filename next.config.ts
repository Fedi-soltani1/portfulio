import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  /**
   * Répertoires parents des URLs d'articles.
   *
   * Aucun lien du site ne pointe sur /fr/work, mais un crawler qui connaît
   * /fr/work/optimistic-concurrency essaie systématiquement le segment
   * parent. Sans ces règles, il récolte quatre 404 et les remonte dans la
   * Search Console — un signal de qualité négatif pour des pages qui
   * n'ont jamais existé.
   *
   * Une redirection permanente vaut mieux qu'une page d'index vide : elle
   * envoie le visiteur là où le contenu se trouve réellement et transmet
   * le signal de classement à l'accueil.
   */
  async redirects() {
    return [
      { source: '/work', destination: '/fr#work', permanent: true },
      { source: '/fr/work', destination: '/fr#work', permanent: true },
      { source: '/en/work', destination: '/en#work', permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
