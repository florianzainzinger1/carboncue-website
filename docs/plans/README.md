# Implementation plans

Claude writes implementation plans here. Codex implements plans after founder
approval.

## Naming

Use:

```text
YYYY-MM-DD-short-descriptive-name.md
```

Example:

```text
2026-08-05-scaffold-marketing-website.md
```

## Lifecycle

```text
DRAFT → APPROVED → IN_PROGRESS → IMPLEMENTED
                  ↘ SUPERSEDED
```

- Claude creates `DRAFT`.
- A founder reviews assumptions, scope, and trade-offs, then changes it to
  `APPROVED`.
- Codex changes it to `IN_PROGRESS` at implementation start.
- Codex changes it to `IMPLEMENTED` only after all acceptance criteria and
  verification steps succeed.
- A replacement plan marks the old one `SUPERSEDED` and links both directions.

## Index

This public copy contains one implemented plan as an example of the format.
Other plans are internal and not included.

| Plan | Status | Owner | Implementation |
|---|---|---|---|
| [Surplus & deficit duality](2026-08-24-surplus-duality.md) | IMPLEMENTED | Claude | Claude, on explicit founder request |

Add each new plan to this table. Completed plans remain in the repository as a
record of intent and implementation scope.
