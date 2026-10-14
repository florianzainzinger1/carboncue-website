# CarbonCue agent instructions

These instructions apply to every agent working in this repository.

> **Public copy:** this file is reproduced from CarbonCue's private repository.
> Several documents it references (current state, backlog, changelog, product,
> business, and most engineering documents) are internal and are not included
> here.

## Product constitution

Before proposing or implementing a material change:

1. Read `README.md`.
2. Read `docs/process/current-state.md`.
3. Read the product, engineering, and business documents relevant to the task.
4. Read the approved plan in `docs/plans/`, when one exists.
5. Inspect the current code, tests, and Git diff.

The documents under `docs/` are the project's versioned source of truth. Do not
silently contradict them. If a task requires a different direction, identify
the conflict and ask a founder to approve a decision record.

## Role separation

### Claude

Claude's default role is planning:

- clarify the outcome and assumptions;
- inspect the repository before planning;
- identify product, compliance, data, security, and legal impact;
- write plans from `docs/plans/PLAN_TEMPLATE.md`;
- define file-level changes, acceptance criteria, and verification commands;
- leave production implementation to Codex unless a founder explicitly changes
  the role for a task.

### Codex

Codex's default role is implementation:

- implement an `APPROVED` plan;
- keep changes within its stated scope;
- flag contradictions or unsafe assumptions before proceeding;
- write or update tests;
- run all applicable verification commands;
- review the final diff;
- update current state, backlog, changelog, and decisions when required.

Codex may implement without a stored plan only when a founder explicitly asks
for direct implementation and the change is small and unambiguous.

### Founders

Only founders approve:

- product-direction changes;
- regulatory and legal claims;
- pricing or customer commitments;
- production access and deployments;
- security exceptions;
- changes to deterministic compliance formulas;
- plans that materially affect customer data or tenant isolation.

## Plan handoff contract

Plans live at `docs/plans/YYYY-MM-DD-short-name.md`.

Allowed statuses:

- `DRAFT`
- `APPROVED`
- `IN_PROGRESS`
- `IMPLEMENTED`
- `SUPERSEDED`

Claude creates plans as `DRAFT`. A founder changes the status to `APPROVED`.
Codex changes it to `IN_PROGRESS` when implementation starts and `IMPLEMENTED`
only after acceptance criteria and verification are complete.

If implementation reveals that the approved plan is materially wrong, Codex
must stop that portion of the work, document the discrepancy, and request a
plan revision. Small implementation details may be resolved without rewriting
the plan when they do not change scope, risk, or customer behavior.

## Product guardrails

Do not:

- position CarbonCue as a carbon-price prediction company;
- claim guaranteed savings, guaranteed compliance, or perfect purchase timing;
- present demo, estimated, or synthetic data as customer or verified data;
- hide data provenance;
- add trade execution, order routing, custody, or personalized investment advice;
- silently change compliance or financial formulas;
- invent regulatory rules or deadlines;
- make market context more prominent than position, budget, and approval;
- turn the primary experience into a dense analyst dashboard.

The default customer flow is:

> Understand the problem → provide data → see the uncovered position → see the
> budget → request approval → document the decision → open details when needed.

## Engineering principles

- Keep compliance and budget calculations deterministic, pure, versioned,
  explainable, and thoroughly tested.
- Preserve raw inputs and provenance separately from normalized and calculated
  data.
- Every material value needs a source, timestamp, unit, status, and organization
  or installation scope.
- Use immutable input snapshots for decisions and approvals.
- Treat tenant isolation and authorization as database and application concerns,
  not UI-only concerns.
- Prefer the simplest architecture that satisfies the current phase.
- Do not introduce microservices, queues, a CMS, or abstraction layers without
  a demonstrated need and an accepted decision record.
- Never commit secrets, private correspondence, meeting notes containing
  confidential information, or real customer operational data.

## Required verification

For code changes, run every applicable command documented in
`docs/engineering/quality.md`. Until the application is scaffolded, record
missing commands explicitly rather than inventing successful results.

A feature is not complete until:

- the customer problem and scope are clear;
- edge cases and failure behavior are handled;
- data provenance is defined where applicable;
- permissions and tenant isolation are considered;
- demo/live/estimated status is explicit;
- relevant tests pass;
- desktop and mobile behavior are checked for UI work;
- documentation reflects the implemented state;
- the final diff has been reviewed.

## Documentation maintenance

Update:

- `docs/process/current-state.md` when implementation capabilities change;
- `docs/process/backlog.md` when work is completed, added, or reprioritized;
- `docs/process/changelog.md` for material changes;
- `docs/decisions/` when a durable product or architecture decision is made;
- `docs/research/sources.md` when new external factual claims are adopted;
- the relevant product or engineering document when behavior or scope changes.

Avoid duplicating the same rule in several documents. Link to the canonical
document instead.

## Research

For regulatory, legal, market, competitor, price, deadline, security, or
technology-currentness claims:

- use current primary sources;
- record the retrieval date;
- distinguish official facts from hypotheses and vendor claims;
- distinguish current law from proposals;
- state uncertainty;
- never treat model memory as the source.

## Git and collaboration

- One coherent outcome per issue, branch, worktree, and pull request.
- Never let two write-capable agents edit the same checkout concurrently.
- Keep `main` deployable.
- Do not force-push shared branches.
- Do not merge or deploy production changes without the required human approval.
- Preserve unrelated user changes in a dirty worktree.
