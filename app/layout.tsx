import './globals.css';

/**
 * Transparent by design.
 *
 * The document shell lives in app/[locale]/layout.tsx, because that is the
 * only place the locale is known at render time. Owning <html> here meant
 * hardcoding lang to the default locale and correcting it client-side —
 * which left every English page served as lang="fr" to crawlers and to
 * screen readers reading the initial HTML.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
