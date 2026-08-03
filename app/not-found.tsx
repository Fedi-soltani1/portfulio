/**
 * Root-level fallback for paths that never reach a valid [locale] segment
 * (middleware normally redirects those first, so this is a rare edge case).
 * It intentionally avoids any next-intl API: reading the request locale here
 * would force the entire app out of static rendering, since Next treats this
 * file as a shared dependency of every route that can throw notFound().
 */
export default function NotFound() {
  return (
    <main
      id="main-content"
      style={{
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.75rem',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <p style={{ fontSize: '0.85rem', letterSpacing: '0.1em', opacity: 0.6 }}>
        404
      </p>
      <h1 style={{ fontSize: '1.5rem', margin: 0 }}>
        Page introuvable — Page not found
      </h1>
      <a href="/" style={{ textDecoration: 'underline' }}>
        Retour à l&apos;accueil — Back home
      </a>
    </main>
  );
}
