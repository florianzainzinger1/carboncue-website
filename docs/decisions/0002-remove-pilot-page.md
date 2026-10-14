# 0002 — Remove the Pilot page and merge About into Contact

- **Status:** Accepted
- **Date:** 2026-08-05
- **Decided by:** Founders
- **Affects:** `docs/product/website-brief.md`, site navigation, routing

## Context

The website brief lists seven required pages: Home, Product, Pilot, About,
Contact, Privacy and Imprint. Steps 1–7 of the website foundation plan
implemented all seven.

During review the founders directed two structural changes:

1. remove the Pilot / "Designpartner" area entirely, from navigation, routes and
   content;
2. merge About and Contact into a single navigation entry, with the contact
   routes first and the company information below them.

## Decision

Both changes are adopted. The site now has five routes per locale:

```text
/            Home
/product     Product
/contact     Contact, with the About content directly below
/privacy     Privacy
/imprint     Imprint
```

`docs/product/website-brief.md` has been updated so the documented page list
matches the implementation.

## Consequences

- The design-partner pitch no longer has a dedicated page. The website brief
  named "apply for the design-partner pilot" as the secondary conversion; that
  path now runs through the contact route alongside the primary one. If pilot
  recruitment needs its own page later, it can be reinstated as a new plan.
- The combined Contact page carries two purposes. It is ordered contact-first so
  the conversion path stays above the company background.
- Sitemap and internal-link expectations dropped from fourteen URLs to ten.
- `MetadataPageKey` no longer includes `pilot` or `about`; the About messages
  survive as a section of the contact dictionary rather than a page of their own.

## Alternatives considered

**Keep the Pilot page and only hide it from navigation.** Rejected: an
unreferenced page still gets crawled and indexed, and it would keep content
alive that the founders no longer want to present.

**Keep About as a separate page and merely group it in the navigation.**
Rejected: the founders asked specifically for one entry containing both, with
About below the contact routes.
