# 0006 — German-only EU-ETS guides, guide hub and founders section

- **Status:** Accepted
- **Date:** 2026-09-14
- **Decided by:** Founders (approved in chat on 2026-09-14)
- **Affects:** `app/[locale]/eu-ets`, guide content model, sitemap, metadata,
  structured data, German navigation, contact page
- **Supersedes:** None (builds on
  [ADR 0005](0005-english-primary-locale-and-seo-baseline.md))

## Context

ADR 0005 made English the unprefixed primary locale and prepared extension
points for single-locale pages. The founders decided on 2026-09-14 to publish
two source-backed German guides for German and Austrian installation operators
and a German hub page, and to show who is behind CarbonCue on the contact
page. The guide text was produced and verified in a separate content stage;
its verification notes are internal
(`docs/research/seo-guides-verification-2026-09-14.md`).

## Decision

1. **German-only guides and hub.** The hub lives at `/de/eu-ets`
   ("EU-ETS-Wissen"), the guides at `/de/eu-ets/abgabefrist-sanktion` and
   `/de/eu-ets/freie-zuteilung-cbam-faktor`. There is no English counterpart:
   `/eu-ets/*` is a 404, `/en/eu-ets/*` answers the existing 308 to that 404
   URL (one hop, no loop).
2. **Content model outside the dictionaries.** Guides are typed content in
   `website/src/content/de/guides/*.ts` with a registry in
   `website/src/content/guides/registry.ts` (slug, locale, `publishedOn`,
   `updatedOn`). They are not part of the DE/EN key-parity contract. Text is
   stored verbatim; inline `[n]` markers must resolve to a listed source with
   an https URL and retrieval date (unit-tested, together with slug, date and
   meta-length rules).
3. **Routing.** `app/[locale]/eu-ets/[slug]/page.tsx` and
   `app/[locale]/eu-ets/page.tsx` generate German params only. Because Next.js
   16.3 passes a parent's params through unchanged when a child
   `generateStaticParams` returns `[]` (which leaves the slug missing and
   silently prerenders nothing), both functions return complete German params
   for every parent call instead of a top-down empty array. With
   `dynamicParams = false` every other combination is a 404.
4. **Metadata.** Canonical plus a single self-referencing `de` hreflang, no
   `en` and no `x-default`; Open Graph `article` with published/modified time
   on guides; the existing German social card as `og:image`. The brand suffix
   is appended to a title only when the result stays within 60 characters.
5. **Structured data.** Guides: `Article` (authors and publisher are the
   founders as `Person` with LinkedIn `sameAs`) and `BreadcrumbList`. Hub:
   `BreadcrumbList`. Still no `Organization`, no `FAQPage`. On previews without
   a canonical base the `url`/`@id`/`item` fields are omitted.
6. **Visible trust elements.** Every guide shows breadcrumb, "Stand" date,
   "Verantwortlich: <founder names>", numbered sources
   with publisher and retrieval date, and a disclaimer.
7. **Navigation.** German pages get an "EU-ETS-Wissen" header item and footer
   links to the hub and both guides. English pages get no link to German-only
   content. On German-only pages the language switch leads to the English home.
8. **Founders section on the contact page** (both locales, new dictionary keys
   only): founder names and roles, TU Wien students, independent project, no
   company incorporated yet; LinkedIn links with `rel="noopener"`.

## Alternatives considered

- **Guides inside the bilingual dictionaries** — rejected: would force empty or
  invented English copy and break the parity contract.
- **Top-down `generateStaticParams` returning `[]` for English** — tried;
  produced no prerendered guide at all and would have made the German guides
  404 at runtime.
- **A branded 404 for `/eu-ets`** — out of scope; see ADR 0005 open issue.
- **FAQPage markup** — rejected: FAQ stays plain HTML.

## Consequences

- Adding a guide means one content file, one registry entry, and nothing else:
  routes, sitemap, footer links, hub card and JSON-LD follow automatically.
- The guides need yearly maintenance (amounts, legislative status, Stand date);
  the verification record lists what to re-check.
- `next start` logs `Error: Internal: NoFallbackError` for 404s answered by the
  `eu-ets` routes (response is a correct static 404 with `noindex`).

## Validation and review trigger

Unit tests (`tests/unit/guides.test.tsx`) and e2e tests
(`tests/e2e/guides.spec.ts`, axe sweep in `all-pages.spec.ts`). Review when an
English guide is planned, when a legal entity is founded (publisher changes),
or when a guide's legal basis changes.
