# Agent workflow

- **Status:** Active operating model
- **Last reviewed:** 2026-08-04
- **Owners:** Founders

## Operating model

Claude plans. Codex implements. Founders set priorities, approve plans, resolve
product choices, and approve production or high-risk changes.

GitHub issues, plans, branches, pull requests, checks, and preview deployments
are the coordination layer. Chat history is supporting context, not the source
of truth.

## Workflow

### 1. Founder defines the outcome

Create one issue or request containing:

- Goal
- Context
- Constraints
- Done when
- Priority
- Links to relevant evidence or documents

One issue should describe one coherent outcome. Split independent results.

### 2. Claude creates the plan

Claude:

1. reads `AGENTS.md`, current state, and relevant documentation;
2. inspects existing implementation and tests;
3. identifies compliance, data, security, and legal impact;
4. resolves material ambiguity with founders;
5. writes `docs/plans/YYYY-MM-DD-name.md` from the template;
6. marks it `DRAFT`;
7. adds it to `docs/plans/README.md`.

The plan must be specific enough that Codex does not need to invent product
behavior.

### 3. Founder approves

A founder reviews:

- product alignment;
- scope and non-goals;
- customer and legal claims;
- data and security impact;
- alternatives and trade-offs;
- acceptance criteria;
- rollout and rollback.

Approval is recorded by changing plan status to `APPROVED` and naming the
approver. Approval of a plan is not blanket approval for unrelated changes.

### 4. Codex implements

Codex:

1. works in a dedicated branch or Git worktree;
2. changes plan status to `IN_PROGRESS`;
3. inspects the current diff before editing;
4. implements steps in dependency order;
5. writes tests with the behavior;
6. runs incremental checks;
7. keeps an implementation note for material deviations.

Parallel write-capable agents use separate worktrees and non-overlapping scopes.
Read-only research or review may run in parallel.

### 5. Codex validates and documents

Before opening or handing off the pull request, Codex:

- runs all applicable commands from `../engineering/quality.md`;
- tests desktop and mobile UI through a real browser when relevant;
- reviews the complete diff;
- verifies every acceptance criterion;
- updates current state, backlog, changelog, and relevant canonical documents;
- records commands and results in the plan;
- marks the plan `IMPLEMENTED` only when complete.

### 6. Independent review

Prefer the other model family for review:

- Claude reviews Codex implementation against the approved plan; or
- Codex reviews a Claude-authored change when founders explicitly allowed Claude
  to implement.

Reviewers focus on concrete defects, security, data, product guardrails, missing
tests, and plan deviations.

### 7. Founder preview and merge

For website and UI work, a founder reviews the preview deployment. Public copy,
regulatory claims, legal pages, pricing, and customer-data behavior always need
founder review.

Merge only after required checks and approvals pass. Production deploys from
`main`, not directly from an agent's local checkout.

## Codex through Claude MCP

Claude may delegate a bounded implementation task to Codex through MCP. The
delegation must include:

- approved plan path;
- exact scope and excluded files;
- target worktree or branch;
- acceptance criteria;
- verification commands;
- required output: changed files, diff summary, commands run, results, risks, and
  commit identifier when requested.

Nested delegation does not remove review or approval requirements. Claude must
not treat Codex's success message as verification without inspecting results.

## Task sizing

Good agent tasks:

- one page or coherent flow;
- one domain calculation with tests;
- one schema migration plus policies and tests;
- one documented bug;
- one contained refactor with unchanged behavior.

Tasks are too large when they combine independent product decisions, touch most
of the system, lack measurable acceptance criteria, or require both architecture
invention and broad implementation.

## Escalation

Codex pauses affected work when:

- the approved plan contradicts the repository;
- a legal or regulatory assumption is missing;
- customer-data access would broaden unexpectedly;
- a formula or data model needs a product decision;
- acceptance criteria cannot be met safely;
- implementation requires a materially different service or architecture.

Record the evidence and the smallest decision founders must make.

## Retrospective loop

When the same agent mistake occurs twice:

1. identify the root cause;
2. improve the canonical document, plan template, test, hook, or CI rule;
3. avoid adding vague reminders;
4. log the material process change.

Use instructions for judgment, tests and CI for mechanical enforcement, skills
for repeatable multi-step methods, and MCP only for live external tools.
