# 0005 — English primary locale at the root and technical SEO baseline

- **Status:** Accepted
- **Date:** 2026-09-14
- **Decided by:** Founders (approved in chat on 2026-09-14)
- **Affects:** URL structure, locale routing, metadata, sitemap, robots,
  structured data, icons, 404 handling, `next.config.ts`
- **Supersedes:** The German-default routing of the 2026-08-04 website
  foundation plan (Step 3: `/` redirects to `/de`, German `x-default`)

## Context

The site served German as the default: `/` answered a temporary redirect to
`/de`, English lived under `/en`, and `x-default` pointed at German. Unknown
locales redirected to German instead of returning a 404, only the home pages
carried an `og:image`, there was no favicon, `robots.txt` carried a
non-standard `Host` line, and the WebSite JSON-LD was emitted on every page.
The target audience is reached internationally first; a temporary redirect at
the domain root and duplicate prefixed URLs weaken the primary URL set.

## Decision

Founder decisions (binding):

1. **English is the primary locale and is served unprefixed at the domain
   root:** `https://carboncue.eu/`, `/product`, `/contact`, `/privacy`,
   `/imprint`. German stays prefixed and unchanged (`/de`, `/de/product`, ...).
   Every `/en` and `/en/*` request answers **308** to the unprefixed path, and
   the legacy GitHub-Pages `/index.html` answers 308 to `/`. `x-default`
   hreflang points at the English root URLs. There is still no
   Accept-Language or IP based redirect.
2. **Existing visible texts are not changed.** Strings in the German and
   English dictionaries, the operator configuration, and hard-coded component
   copy stay as they are; only new keys and sections may be added.
3. (Content stage) Two German-only guides and a German hub page
   "EU-ETS-Wissen" follow in a separate stage; this record only prepares the
   extension points.
4. (Content stage) A founders section on the contact page with roles,
   TU Wien, and LinkedIn links. The profile data lives in
   `website/src/content/founders.ts`.
5. **No Organization JSON-LD**, because no legal entity exists. The WebSite
   entity names the founders as `Person` publishers with their LinkedIn
   profiles as `sameAs`.

Technical choices:

- **Internal structure unchanged.** Pages stay in `app/[locale]`. The public
  URLs are mapped in `next.config.ts` via `website/src/i18n/routing.ts`:
  redirects for `/index.html`, `/en` and `/en/:path`, and `afterFiles`
  rewrites `/` → `/en` and every path whose first segment is not `de`, `en`,
  `api`, `_next` (or a dev-only `__nextjs*` endpoint) → `/en/:path`. Next.js
  checks static and non-dynamic routes (robots, sitemap, icons, `/api/contact`)
  before `afterFiles` rewrites, so they are unaffected; the rewrite targets are
  never matched by the redirects, so there is no loop.
- **`PREFIXLESS_LOCALE = "en"` and `DEFAULT_LOCALE = "en"`** in
  `i18n/config.ts`. `getLocalizedPath("en", ...)` returns the unprefixed path,
  so navigation, canonicals, hreflang, sitemap, JSON-LD and the language switch
  follow from one function.
- **Real 404s.** `app/[locale]/layout.tsx` exports `dynamicParams = false`;
  invalid locales call `notFound()` in the layout, pages and metadata. Unknown
  URLs receive the framework's static 404 page with `noindex`. The social image
  routes return no image metadata for invalid locales. A branded 404 was tried
  and dropped: a `not-found.tsx` in the root-layout segment is not used for
  unmatched URLs, and for `notFound()` thrown in a nested catch-all page
  Next.js 16.3 sends an empty error shell and renders the branded page only
  client-side. A server-rendered branded 404 needs the experimental
  `globalNotFound` flag or a non-dynamic root layout; experimental flags are
  not enabled.
- **Social images.** Page-level `openGraph` replaces the parent's, so
  `createPageMetadata` sets `openGraph.images` and `twitter.images` explicitly
  for every page to the public image URLs: `/opengraph-image/social-card` and
  `/twitter-image/social-card` for English (served through the root rewrite),
  `/de/opengraph-image/social-card` and `/de/twitter-image/social-card` for
  German. The `/en/*` redirect has no exception, so the prefixed English image
  URLs also answer 308 to their unprefixed form (amended 2026-09-14 after
  verification; an earlier draft exempted them from the redirect).
- **Icons** (`app/favicon.ico` 16/32/48, `app/icon.png` 192, `app/apple-icon.png`
  180) are generated once from the double-C mark in `logo/Logo.jpg` on the
  social-card petrol ground and committed as binaries.
- **robots.txt** drops the non-standard `Host` line; previews still disallow
  everything.
- **Sitemap** entries carry a hand-maintained ISO `lastmod` per page
  (`lib/metadata/sitemap-entries.ts`, never `new Date()`); single-locale pages
  are appended without hreflang alternates.
- **Duplicate hosts.** `headers()` sends `X-Robots-Tag: noindex` when the host
  matches `(?:.+\.)?vercel\.app`; the custom domain does not match.
- **Extension points.** `SiteShell`/`SiteHeader`/`LanguageSwitch` accept an
  explicit `alternateHrefs` map (missing locale → that locale's home) and an
  `activeNavigationPath`; `createPageMetadata` accepts `localizedPaths` for
  single-locale pages (canonical only, hreflang only when two locales exist).

## Alternatives considered

- **Moving English pages to `app/(en)` and German to `app/de`** — rejected:
  duplicates every page file and the root layout, for no user-visible gain.
- **A proxy (middleware) rewrite** — rejected: runs on every request and adds
  latency, while config rewrites are resolved by the router at no extra cost.
- **Rewriting the English image URLs to unprefixed paths** — rejected: the
  file-based metadata of the home page would still emit the prefixed URL, so
  the redirect exclusion is needed anyway.
- **Keeping `x-default` on German** — rejected by decision 1.

## Consequences

- English URLs change: every `/en/...` link shared so far redirects once with
  308; German URLs are unchanged.
- Adding a new bilingual page means adding it to `PAGE_PATHS` and
  `PAGE_LAST_MODIFIED`; the English URL is rewritten automatically.
- Paths whose first segment is `de`, `en`, `api` or `_next` are reserved.
- Upper-case locale segments (`/DE`) are 404 on deployments, but a local
  `next start` on Windows serves them from the case-insensitive file system and
  its revalidation can overwrite the German prerender; the e2e check for `/DE`
  therefore runs only off Windows.
- Unknown URLs show the framework's unbranded 404 page.

## Validation and review trigger

Validated by unit tests (`tests/unit/routing.test.ts`, `site-metadata.test.tsx`,
`components.test.tsx`) and e2e tests (`tests/e2e/seo-baseline.spec.ts`,
`locale-routing.spec.ts`) against a production build, plus manual `curl`
checks of status codes, `Location` headers and `X-Robots-Tag` on a local
production server. Review when Next.js stabilises `globalNotFound`, when a
third locale is added, or when a legal entity exists (Organization JSON-LD).
