import createMiddleware from 'next-intl/middleware';
import { routing } from './lib/i18n/routing';

export default createMiddleware(routing);

export const config = {
  /**
   * Skip Next internals, API routes and anything with a file extension.
   *
   * `apple-icon` is listed explicitly because it is the one metadata route
   * Next serves without an extension: without this it matched the locale
   * rule and got redirected to /fr/apple-icon, so iOS received a 307 where
   * it expected a PNG.
   */
  matcher: ['/((?!api|_next|_vercel|apple-icon|.*\\..*).*)'],
};
