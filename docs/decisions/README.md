# Decision records

Decision records preserve durable product and architecture choices, their
evidence, and trade-offs.

## When a decision record is required

- Changing the product wedge, target customer, or legal boundary.
- Adding or replacing a major framework, database, hosting provider, queue, CMS,
  authentication system, AI provider, or architecture style.
- Changing tenant or authorization strategy.
- Changing deterministic formulas or rule-version behavior.
- Accepting a durable security or operational trade-off.
- Reversing an earlier decision.

## Index

This public copy contains a subset of the records; the gaps in numbering are
internal records that are not published.

| ID | Decision | Status | Date |
|---|---|---|---|
| [0001](0001-initial-architecture.md) | Documentation-first monorepo and managed web stack | Accepted | 2026-08-04 |
| [0002](0002-remove-pilot-page.md) | Remove the pilot page | Accepted | 2026-08-05 |
| [0005](0005-english-primary-locale-and-seo-baseline.md) | English primary locale at the root and technical SEO baseline | Accepted | 2026-09-14 |
| [0006](0006-german-guides-and-founders-section.md) | German-only EU-ETS guides, guide hub and founders section | Accepted | 2026-09-14 |

## Statuses

- `Proposed`
- `Accepted`
- `Superseded`
- `Rejected`
- `Deprecated`

Never rewrite an accepted record to hide history. Create a new record that
supersedes it.

## Template

```md
# NNNN — Decision title

- **Status:** Proposed
- **Date:** YYYY-MM-DD
- **Owners:** [names]
- **Supersedes:** None

## Context

## Decision

## Alternatives considered

## Consequences

## Validation and review trigger
```
