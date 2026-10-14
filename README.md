# CarbonCue

CarbonCue is a broker-neutral software product for mid-sized industrial
companies that take part in the EU Emissions Trading System (EU ETS). It brings
emissions, allowance, purchase, and budget data together into one clear EUA
position and a documented, approval-ready procurement workflow. CarbonCue does
not execute trades, give investment advice, or predict carbon prices.

Live website: <https://carboncue.eu>

> **Status:** the product is in development. This repository is a public copy
> that contains the source of the public marketing website and the engineering
> setup around it. The product application and internal documents are not part
> of it.

## What is in this repository

| Path | Contents |
|---|---|
| `website/` | Bilingual (English/German) marketing website, deployed at carboncue.eu |
| `website/tests/` | Vitest unit tests and Playwright end-to-end tests (including axe accessibility checks) |
| `.github/workflows/ci.yml` | CI: formatting, lint, typecheck, unit tests, production build, browser tests |
| `AGENTS.md`, `CLAUDE.md` | Instructions for the AI coding agents that work on the repository |
| `docs/process/agent-workflow.md` | The plan-first agent workflow described below |
| `docs/plans/` | Plan template and one implemented plan as an example |
| `docs/decisions/` | Selected architecture decision records |
| `logo/` | Source logo used to generate the site icons |

## Tech stack

- Next.js 16 (App Router, statically generated locale routes), React 19
- TypeScript in strict mode
- Tailwind CSS v4 with project-owned UI components, self-hosted IBM Plex fonts
- Contact form API route with zod validation, Postgres storage
  (`@vercel/postgres`), and email notification via Resend
- Vitest and Testing Library for unit tests; Playwright with axe-core for
  end-to-end and accessibility tests
- ESLint, Prettier, pnpm workspaces, GitHub Actions, Vercel hosting

Website features worth a look: typed bilingual dictionaries where a missing
translation key is a compile-time error, an interactive EUA risk calculator, a
scroll-driven explanatory figure built with CSS only, generated Open Graph
images, per-page metadata, sitemap and structured data, and build-time guards
that block a production build when legally required imprint data or the
production URL are missing.

## Engineering workflow

The project is built with a plan-first workflow between human founders and two
AI coding agents:

1. A founder describes the desired outcome.
2. Claude inspects the repository and writes an implementation plan from
   `docs/plans/PLAN_TEMPLATE.md`, with scope, acceptance criteria, and
   verification commands. The plan starts as `DRAFT`.
3. A founder reviews it and sets it to `APPROVED`.
4. Codex implements the approved plan in its own branch or worktree, writes
   tests, runs all checks, and updates the documentation.
5. A different model reviews the change against the plan, and a founder
   reviews the preview before merge.

Durable choices are recorded as decision records in `docs/decisions/`. The full
protocol is in [docs/process/agent-workflow.md](docs/process/agent-workflow.md)
and [AGENTS.md](AGENTS.md). Some documents referenced from `AGENTS.md` are
internal and not included in this copy.

## Getting started

Requirements: Node.js `24.19.0` (see `.nvmrc`) and pnpm `9.15.0`.

```sh
pnpm install --frozen-lockfile
pnpm --filter @carboncue/website dev   # http://localhost:3000
```

Quality checks, run from the repository root:

```sh
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e   # downloads Chromium into .playwright-browsers/ on first run
pnpm build
```

The contact form needs `POSTGRES_URL` and `RESEND_API_KEY` (see
`website/.env.example`). Without them the site builds and runs normally and the
form shows its error state on submit.

## License

Copyright (c) 2026 the CarbonCue founders. All rights reserved.

The source is published for viewing only. No license is granted to copy,
modify, or distribute it.
