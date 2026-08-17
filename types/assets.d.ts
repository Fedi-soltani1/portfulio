/**
 * Font files imported as URLs.
 *
 * Next types image imports out of the box but not font files. The import in
 * the locale layout exists so the preload tag points at the hashed, cache
 * busted filename the bundler actually emits, rather than a path hardcoded
 * here that would break silently the next time the dependency is updated.
 */
declare module '*.woff2' {
  const src: string;
  export default src;
}
