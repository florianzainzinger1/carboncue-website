import { PREFIXLESS_LOCALE, SUPPORTED_LOCALES } from "./config";

/**
 * Request-level routing for the prefixless primary locale. The app keeps its
 * internal `app/[locale]` tree; next.config.ts maps the public URLs onto it.
 *
 * Next.js checks, in order: headers, redirects, proxy, beforeFiles rewrites,
 * static files and non-dynamic routes (robots.txt, sitemap.xml, favicon.ico,
 * icon.png, apple-icon.png, /api/contact), afterFiles rewrites, dynamic routes
 * (`/[locale]/...`), fallback rewrites. The rewrites below are afterFiles, so
 * static and API routes are served before they are consulted, and `/de/*`
 * is excluded explicitly so it still reaches the dynamic route unchanged.
 */

type Redirect = Readonly<{
  source: string;
  destination: string;
  permanent: true;
}>;

type Rewrite = Readonly<{
  source: string;
  destination: string;
}>;

type HostHeaderRule = Readonly<{
  source: string;
  has: readonly Readonly<{ type: "host"; value: string }>[];
  headers: readonly Readonly<{ key: string; value: string }>[];
}>;

/** First path segments that must never be rewritten into the primary tree. */
const UNREWRITTEN_FIRST_SEGMENTS = [
  ...SUPPORTED_LOCALES,
  "api",
  "_next",
] as const;

export function createLocaleRedirects(): Redirect[] {
  const prefix = `/${PREFIXLESS_LOCALE}`;

  return [
    // Legacy GitHub-Pages entry URL.
    { source: "/index.html", destination: "/", permanent: true },
    // The primary locale lives at the root; its prefixed URLs are duplicates.
    // This includes the social image routes, which are served unprefixed.
    { source: prefix, destination: "/", permanent: true },
    {
      source: `${prefix}/:path(.+)`,
      destination: "/:path",
      permanent: true,
    },
  ];
}

export function createLocaleRewrites(): { afterFiles: Rewrite[] } {
  const exclusion = UNREWRITTEN_FIRST_SEGMENTS.join("|");

  return {
    afterFiles: [
      { source: "/", destination: `/${PREFIXLESS_LOCALE}` },
      {
        // Every path whose first segment is not a locale, `api` or `_next`
        // (and not a dev-server `__nextjs*` endpoint) is served from the
        // primary locale tree. Unknown paths still end in a 404 there.
        source: `/:path((?!(?:${exclusion})(?:/|$))(?!__nextjs).+)`,
        destination: `/${PREFIXLESS_LOCALE}/:path`,
      },
    ],
  };
}

/** Matches Vercel deployment hostnames (production aliases and previews). */
export const VERCEL_HOST_PATTERN = "(?:.+\\.)?vercel\\.app";

export function createHostHeaders(): HostHeaderRule[] {
  return [
    {
      // Keep *.vercel.app duplicates of the site out of search indexes; the
      // custom production domain does not match and stays indexable.
      source: "/:path*",
      has: [{ type: "host", value: VERCEL_HOST_PATTERN }],
      headers: [{ key: "X-Robots-Tag", value: "noindex" }],
    },
  ];
}
