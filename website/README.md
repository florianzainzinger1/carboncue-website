# CarbonCue website

> **Note:** parts of this workspace README predate later decisions. Since
> [ADR 0005](../docs/decisions/0005-english-primary-locale-and-seo-baseline.md)
> English is served unprefixed at the root and German under `/de`; the site is
> live at <https://carboncue.eu> with the production URL and imprint configured
> in `src/content/`. Treat the code and the decision records as authoritative.

This folder is the implementation workspace for CarbonCue's public marketing
website.

## Current status

All seven steps of the approved website-foundation plan are implemented. This
workspace contains all seven public pages in German and English, the
deterministic explanatory demo, an email-only contact route, draft legal pages,
per-page metadata, generated social cards, sitemap, robots rules, structured
data, and production guards for both the still-missing imprint address and the
still-unapproved production URL. `/` redirects to the German Home page at
`/de`; the matching English page is at `/en`.

The site remains a preview, not a production-ready publication. The product is
in development, no CarbonCue legal entity exists, the imprint address is still
missing, and all German legal wording and all public claims require founder
review before production.

The repository pins Node.js `24.19.0` and pnpm `9.15.0`. From the repository
root, install and verify with:

```text
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

The first end-to-end run downloads Chromium into the ignored, repository-local
`.playwright-browsers/` directory.

## Implemented structure

```text
website/
|-- src/app/[locale]/     # Statically generated `de` and `en` route trees
|-- src/app/globals.css   # Tailwind v4 tokens and global styles
|-- src/components/       # Accessible project-owned layout and UI components
|-- src/content/de/       # German version-controlled dictionary
|-- src/content/en/       # English version-controlled dictionary
|-- src/content/legal/    # Typed operator details and production build guard
|-- src/content/site.ts   # Typed production URL and deployment configuration
|-- src/i18n/             # Locale contract and locale-aware path helpers
|-- src/lib/demo/         # Pure, website-only explanatory calculation
|-- src/lib/metadata/     # Per-page metadata construction
|-- tests/unit/           # Rendering, semantics, and dictionary contracts
|-- tests/e2e/            # Accessibility, locale, responsive, and network checks
|-- eslint.config.mjs
|-- next.config.ts
|-- playwright.config.ts
|-- postcss.config.mjs
|-- tsconfig.json         # `strict: true`
`-- vitest.config.ts
```

Components are Server Components unless browser state or interaction creates a
specific need for a Client Component. The current visual foundation has no
Client Components. IBM Plex Sans and IBM Plex Mono are bundled from pinned,
OFL-licensed Fontsource packages and emitted as same-origin build assets; do not
replace them with a browser request to an external font provider.

## Locale structure

`src/i18n/config.ts` is the canonical locale list: `de` and `en`, with `de` as
the default. `src/app/[locale]/layout.tsx` enumerates both for static generation
and sets `<html lang>` from the validated route parameter. The root redirect is
fixed at `/de`; neither `Accept-Language` nor IP location is consulted. The
language switch uses ordinary anchors and no cookie, so explicit locale URLs are
stable and work without JavaScript.

The seven locale-neutral paths are `/`, `/product`, `/pilot`, `/about`,
`/contact`, `/privacy`, and `/imprint`. Each page uses that path for the
alternate-language anchor and locale-aware metadata. Indexable builds publish
the locale-correct canonical plus `de`, `en`, and German `x-default` links.
Preview builds publish `noindex`, omit canonical and hreflang metadata, disallow
crawling, and return an empty sitemap so a preview hostname is never presented
as the production canonical.

## Site URL, social metadata, and crawl configuration

`src/content/site.ts` is the canonical environment and site URL configuration.
Development uses `http://127.0.0.1:3000`; Vercel preview builds may use their
preview origin only as the metadata asset base and are always non-indexable. A
production-targeted build refuses to proceed while `productionSiteUrl` remains:

```ts
{
  status: "missing",
  reason: "awaiting_founder_approval",
}
```

After founders approve the production HTTPS origin, replace that value with a
`status: "configured"` object containing the origin only—no path, query,
fragment, credentials, port, placeholder, or preview hostname. Do not infer a
domain from the contact email.

The app generates localized Open Graph and Twitter PNGs from repository-owned
code and dictionary content. `sitemap.xml` lists both locale trees with
hreflang alternates in indexable environments, while `robots.txt` follows the
same environment policy. Each locale layout emits `WebSite` JSON-LD with two
`Person` publishers. It intentionally emits no `Organization`: no CarbonCue
legal entity exists.

### Add a translated string

1. Add the key to `src/content/messages.ts` in the appropriate dictionary
   section.
2. Add the German value to `src/content/de/dictionary.ts` and the English value
   to `src/content/en/dictionary.ts`.
3. Read the value from the dictionary returned by `getDictionary(locale)` and
   pass it into the Server Component that renders it.
4. Run `pnpm typecheck` from the repository root. Omitting the key from either
   locale is a compile-time error; do not add a runtime fallback.

The English footer disclaimer is the exact canonical text from
an internal positioning document (not included in this public copy). The German translation is an
implementation draft and requires founder review of its legal wording before
production.

## Operator and imprint configuration

The operator configuration is `src/content/legal/operator.ts`. In this public
source copy the operator names and the imprint address are placeholders; the
real values are published in the imprint of the live website. Angle-bracket
placeholders fail the production build guard described below. The file records:

- operator names (placeholder: `CarbonCue`);
- country `Austria`;
- contact email `kontakt@carboncue.eu`;
- `operatorDetails.address` (placeholder values in this copy).

A founder must replace the complete `operatorDetails.address` value in that file
with the following shape, using the real geographic address and no abbreviation
or placeholder:

```ts
address: {
  status: "configured",
  streetAddress: "FULL STREET AND HOUSE NUMBER",
  postalCode: "POSTAL CODE",
  locality: "LOCALITY",
  country: "Austria",
},
```

All four address fields are required by `ConfiguredOperatorAddress`. Development
and preview builds continue while the value is missing and both Imprint routes
show a prominent incomplete-imprint notice. A build with either
`VERCEL_ENV=production` or `CARBONCUE_DEPLOYMENT_ENV=production` fails while the
address is missing, empty, or a recognized placeholder. This guard must not be
removed or bypassed to publish the site.

The German Privacy and Imprint content is the authoritative implementation
draft. The English routes say explicitly that German prevails. A founder and
qualified legal reviewer must review all German legal wording before production,
and founders must review every public claim in both languages.

## Contact configuration

The contact page carries a bilingual lead form (name, company, business email,
optional message) with an invisible honeypot. Submissions post JSON to the
same-origin `/api/contact` route, which validates the payload with zod,
silently acknowledges honeypot hits, stores real leads in a Postgres `leads`
table via `@vercel/postgres`, and notifies `kontakt@carboncue.eu` through
Resend. The backend requires `POSTGRES_URL` and `RESEND_API_KEY` (see
`.env.example`); without them the route answers 500 and the form shows its
error state. There is still no scheduling provider, analytics, cookie, or
third-party browser script — the Resend and database calls happen server-side
only. The privacy notice covers this processing in both locales; like all
German legal wording it remains subject to founder and legal review before
production.

## Explanatory demo

`src/lib/demo/calculate-demo-position.ts` contains only the website explanation's
pure obligation, coverage, gap, surplus, and budget arithmetic. It validates
non-negative safe-integer inputs and rejects unsafe coverage or budget outputs.
Its result is locale-independent and carries demo status, synthetic provenance,
a fixed example date, scope, units, assumptions, and warnings. It is not the
future product domain engine.

The German and English routes render the complete four-stage example as Server
Components. Number and currency formatting happens only in the locale-aware
view. The fixed example carries the generic label "Beispiel-Kalkulation:
Industrieanlage (August 2026)" — no company-like name appears on the public
site — with synthetic figures and a stated price input; it makes no timing,
prediction, recommendation, penalty, deadline, or compliance determination.

## Remaining responsibility

The website still needs founder and legal content review, the real imprint
address, an approved production URL, and founder-owned preview review. Production DNS and launch remain
separate founder-approved work.

The future authenticated SaaS application will not live in this folder. Its
planned location is `../platform/`, created only after the relevant roadmap gate
and an approved plan.

All repository-wide agent rules in `../AGENTS.md` apply here.
