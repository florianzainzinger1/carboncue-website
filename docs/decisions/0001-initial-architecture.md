# 0001 — Documentation-first monorepo and managed web stack

- **Status:** Accepted
- **Date:** 2026-08-04
- **Owners:** Founders
- **Supersedes:** None

## Context

CarbonCue has two founders, plans to use AI agents for most implementation work,
needs a marketing website first, and intends to build a multi-tenant SaaS product
after customer validation.

The project requires strong product guardrails, deterministic calculations,
provenance, auditability, and customer-data isolation. A large custom
infrastructure stack would slow validation and increase operational risk.

Claude will create plans and Codex will implement approved plans. Both need the
same durable repository context.

## Decision

1. Use one GitHub repository with a monorepo-ready layout.
2. Keep product, business, engineering, process, plans, decisions, and research
   as versioned Markdown in the repository.
3. Use `AGENTS.md` as shared agent instructions and import it from `CLAUDE.md`.
4. Use Claude as the default planner and Codex as the default implementer.
5. Use isolated branches or worktrees and pull requests for each coherent change.
6. Build the marketing website inside the root `website/` subfolder with
   Next.js, strict TypeScript, Tailwind CSS, project-owned UI components, and
   Vercel previews.
7. Plan Supabase-managed PostgreSQL, Auth, and private Storage for the pilot
   product, subject to a security and data-processing review.
8. Keep the deterministic position and budget engine in a pure domain package
   independent from database, network, clock, and AI calls.
9. Defer microservices, Kubernetes, a separate API, a CMS, queues, and production
   AI until evidence requires them.

## Alternatives considered

### Separate website and product repositories

Rejected initially because shared product context, design, agent instructions,
and review workflows would be duplicated. Reconsider if independent release or
access-control needs appear.

### Marketing-specific static framework

Not selected because Next.js can serve the website and later product with one
team skill set. A static framework would be reasonable for the website alone but
offers less overall simplification for the planned SaaS.

### Custom backend or microservices immediately

Rejected because there is no validated scale or integration requirement. It
would add deployment, authentication, observability, and coordination overhead.

### Nested Claude-to-Codex delegation for all work

Rejected as the universal default. MCP delegation remains available for bounded
tasks, while direct isolated worktrees and cross-model review provide clearer
ownership and verification.

## Consequences

Positive:

- one source of truth for both agents and founders;
- low initial infrastructure burden;
- previewable, reviewable changes;
- clear path from website to pilot product;
- deterministic logic remains independently testable.

Costs and risks:

- documentation must be maintained with implementation;
- a monorepo can accumulate unnecessary packages if gates are ignored;
- managed providers need contractual, regional, and security review;
- founders must enforce plan approval and production boundaries.

## Validation and review trigger

Review this decision after:

- the second paid pilot;
- a customer requires a different hosting or data-residency model;
- the repository needs materially different access controls;
- the first durable background-processing requirement;
- evidence that Next.js or Supabase blocks a core product need.
