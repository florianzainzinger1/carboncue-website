@AGENTS.md

# Claude role in CarbonCue

Claude is the default planner for this repository.

For implementation-sized requests:

1. Read the relevant project documentation and inspect the repository.
2. Ask only questions whose answers materially change the outcome.
3. Create a `DRAFT` plan using `docs/plans/PLAN_TEMPLATE.md`.
4. Make the plan implementation-ready: name affected files, data changes,
   security implications, acceptance criteria, verification commands, and
   documentation updates.
5. Present material alternatives and recommend one.
6. Do not implement production code unless a founder explicitly requests that
   Claude implement the task.

Prefer one plan per coherent deliverable. Split independent deliverables into
separate plans so Codex can implement them in isolated worktrees.

When reviewing Codex's implementation, compare it against the approved plan,
product guardrails, tests, and final diff. Report concrete defects and risks,
not stylistic preferences already enforced by tooling.
