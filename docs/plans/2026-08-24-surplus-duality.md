# Plan: Surplus & deficit duality across story, calculator, and examples

- **Status:** IMPLEMENTED
- **Created:** 2026-08-24
- **Planner:** Claude
- **Founder approver:** Florian Zainzinger (approved 2026-08-24: Q1 dokumentieren, Q2 petrol #0e7490, Q3 S-A, Q4 C-B)
- **Implementation owner:** Claude (explicit founder request, 2026-08-24)
- **Related issue:** none recorded
- **Target branch:** `agent/website-09-surplus-duality` (new, from `agent/website-08-homepage-rework` after its merge, or from `main`)

## Outcome

The website communicates that an EUA position can go both ways and that
CarbonCue manages both directions: a deficit is a financial risk with a
conditional 100 €/t penalty, and a surplus is bound capital whose value the
CFO should see, document, and decide on. Concretely: the scroll story gains a
surplus scene, the risk calculator computes and presents both directions, the
worked example loses its fictional company name in favour of a generic
professional label, and a compact section addresses the surplus CFO directly.

## Context

- Home currently runs hero → scroll story (5 deficit-focused steps, scroll-
  scrubbed morph) → EUA risk calculator (deficit-only) → solution → CTA.
- The story figure ends at "gap closed in time" (all blocks green). The graph
  already has a scrubbed-morph architecture (`morph`, `release` segments) that
  a third segment can extend.
- `website/src/lib/demo/calculate-demo-position.ts` already computes
  `surplusEua` deterministically; the UI never shows it.
- The fictional installation is named `Nordwerk Zement GmbH` / `Nordwerk
  Cement AG` in the demo dictionaries, `nordwerk-zement` in the demo scope id,
  and appears in unit/e2e assertions.
- Guardrails (AGENTS.md): broker-neutral, no trade execution, no investment
  advice, no guaranteed savings or perfect timing, DEMO provenance visible,
  market context must not dominate position/budget/approval.

## Scope

### Included

- Scroll story: a sixth step showing the surplus direction, with adjusted
  step texts acknowledging both directions.
- Calculator: deficit/surplus mode with distinct result panels.
- Demo example: anonymized installation label everywhere (code, dictionaries,
  tests, docs).
- A compact surplus/deficit duality band on the home page.
- Dictionary/message-contract changes in both locales; test updates; docs.

### Excluded

- Any surplus variant of the product-page worked example (backlog candidate).
- Any market-price feed, valuation service, or sell recommendation.
- Platform/SaaS changes; the epic is website-only.

## Product alignment

- **Customer problem supported:** CFOs with surplus positions treat them as
  invisible or locked capital; CFOs with deficits face unbudgeted cost and
  penalty risk. Both need position visibility, valuation at their own
  assumptions, and documented decisions.
- **Product wedge supported:** one reconciled position, finance-ready
  numbers, approval/audit trail — now explicitly for both signs of the
  position.
- **Compliance or legal impact:** Surplus wording must not promise sale
  proceeds, market timing, accounting treatment, or tax outcomes. See open
  question Q1 on "bilanzieren". All surplus values are labelled as the
  reader's own price assumption, DEMO where synthetic.
- **Customer-data impact:** None.
- **Security impact:** None.

## Assumptions and open questions

| Item | Type | Resolution |
|---|---|---|
| Q1: The founder-suggested copy "bilanzieren Sie audit-sicher" implies accounting assurance. Recommended wording: "audit-sicher dokumentieren" (documentation, not accounting advice). | Question | Founder picks wording before APPROVED |
| Q2: Asset colour for surplus. Recommendation: a restrained petrol/teal (`--color-asset: #0e7490`, AA on white at 11px+ bold) so "surplus asset" is visually distinct from "covered" green and "risk" red. Alternative: reuse the covered green. | Question | Founder picks colour direction |
| Q3: Story shape. Recommendation S-A: append a sixth step (see below). Alternative S-B: branch step 4 into side-by-side deficit/surplus mini-bars — rejected as it overloads the zoom narrative and doubles the scrub complexity. | Assumption (S-A) | Founder confirms |
| Q4: Calculator input model. Recommendation C-B: explicit mode toggle. Alternative C-A: one signed slider with centre zero (elegant, but negative tonnage confuses and hurts a11y labelling). Alternative C-C: emissions + coverage inputs with derived sign (more inputs, more friction). | Assumption (C-B) | Founder confirms |
| A1: Surplus block count in the story: 3 blocks (7,500 t) above the emissions bar reads clearly at all widths. | Assumption | Implementer may tune 2–4 |

No material open question may remain when the status changes to `APPROVED`.

## Proposed implementation

Steps in dependency order; files named per deliverable.

### 1. Design tokens

`website/src/app/globals.css`: add `--color-asset`, `--color-asset-soft`,
`--color-asset-ink` (petrol family, pending Q2) next to the risk accent
family. Verify AA contrast for every text use (validator: measured ratios in
code comments, matching existing practice).

### 2. Scroll story: sixth step (recommendation S-A)

- `website/src/content/messages.ts` + both dictionaries: extend
  `home.story.steps` from 5 to 6 entries. Adjusted texts (DE authoritative,
  EN mirrored):
  - Step 3 (overshoot) text gains one clause acknowledging the position can
    run in both directions ("Deckungslücke – oder ungenutzter Überschuss").
  - New step 6, kicker "Die andere Richtung", title approx. "Ein Überschuss
    ist gebundenes Kapital", text: surplus = more allowances than emissions;
    unseen, it sits as locked liquidity; CarbonCue makes it visible and the
    decision documentable. No sale promise.
  - `home.story.graph` gains `surplusLabel` (e.g. "Überschuss = gebundenes
    Kapital") and the alt text is extended.
- `website/src/components/story/compliance-year-story.tsx`: the scrub gains a
  third segment `surplus` = midline progress between step rows 5→6 (same
  pattern as `morph`/`release`). Reduced-motion snaps it from `active >= 5`.
  Row layout: step 6 takes the current last-row treatment (panel-height,
  top-aligned, `lg:mt-[20vh]`); step 5 becomes a centred 60vh middle row.
- `website/src/components/story/compliance-year-graph.tsx`, scrubbed by
  `surplus` after the all-green state:
  - The coverage line's y interpolates upward from `Yc` to a level above the
    bar top (coverage now exceeds emissions), label travelling with it.
  - 3 asset-coloured blocks (A1) grow into the space between the bar top and
    the raised line, same block geometry, `--color-asset` fill.
  - The closing check fades out; `closedLabel` crossfades to `surplusLabel`.
  - The `data-story-scene` attribute gains a third value `"surplus"` for
    tests.

### 3. Calculator: dual mode (recommendation C-B)

`website/src/components/interactive/eua-risk-calculator.tsx` plus dictionary
keys under `home.calculator`:

- A two-option segmented toggle above the inputs: DE "Deckungslücke" |
  "Überschuss" (EN "Deficit" | "Surplus"), implemented as a radiogroup with
  visible selected state; keyboard and screen-reader accessible.
- Volume slider unchanged in range (1,000–100,000 t, step 500); its label
  switches per mode ("Ungedeckte Menge" / "Überschussmenge") with a
  mode-specific hint. Sector presets stay for deficit mode; surplus mode
  shows the same presets relabelled as typical surplus magnitudes (values may
  stay identical; they are order-of-magnitude aids, not claims).
- Price slider unchanged (50–150 €, "your assumption, not a forecast").
- Result panel per mode:
  - Deficit (unchanged): Beschaffungsbedarf (t × price), conditional penalty
    (t × 100 €), Kosten im Versäumnisfall (sum). Risk accent.
  - Surplus: one headline value "Rechnerischer Gegenwert Ihres Überschusses"
    (t × price) in the asset accent, a sub-line "gebundenes Kapital bei Ihrer
    Preisannahme", and a short note that CarbonCue makes the position
    visible and the decision documentable — explicitly **no** sale
    recommendation, no penalty row, no proceeds promise. DEMO badge remains.
  - The panel transitions colours/labels with the existing calm CSS
    transitions; the headline result region gets `aria-live="polite"` so the
    mode switch is announced.
- Formulas stay inline, pure, and deterministic; no new dependency.

### 4. Anonymize the worked example

- Both dictionaries: `demo.installationName` → DE "Beispiel-Kalkulation:
  Industrieanlage (August 2026)", EN "Example calculation: industrial
  installation (August 2026)" (exact wording final at implementation; no
  company-like name).
- `website/src/lib/demo/calculate-demo-position.ts`: scope id literal
  `"nordwerk-zement"` → `"beispiel-industrieanlage"` (type + value).
- Tests: `website/tests/unit/demo-position.test.ts` (scope id),
  `website/tests/e2e/demo-position.spec.ts` (visible-name assertion asserts
  the new label). Cleanup in the same pass: replace the "Nordwerk Zement"
  fixture strings in `website/tests/e2e/contact-form.spec.ts` and
  `website/tests/unit/contact-api.test.ts` with a neutral fixture (e.g.
  "Beispiel Industrie GmbH") so the name disappears from the repo entirely.
- `docs/process/current-state.md` mention of `Nordwerk Zement` updated.

### 5. Surplus duality band

New server component `website/src/components/home/position-duality.tsx`
rendered on the home page directly after the scroll story, before the
calculator: a two-card band, one card per direction —
deficit: "Deckungslücke? Risiko früh erkennen, Budget planbar freigeben.";
surplus: founder-approved wording per Q1, recommended "Auch bei
Zertifikate-Überschuss: Sichern Sie Ihre Liquidität und dokumentieren Sie
audit-sicher." Cards use the risk and asset accents as a thin border/kicker
only (monochrome body), matching the enterprise look. Dictionary keys under a
new `home.duality` block.

### 6. Tests

- `website/tests/e2e/compliance-story.spec.ts`: extend to step 6 — scene
  attribute `"surplus"`, asset blocks present with the asset fill, coverage
  label visible above the bar; reduced-motion snap covers the new segment.
- New/extended e2e for the calculator: mode toggle switches labels and
  result panel (deficit shows penalty row; surplus shows no penalty row and
  the asset headline), keyboard operability, and no external requests.
- Unit: dictionaries key parity is enforced by the type contract; demo tests
  per step 4.

## Data and interfaces

None beyond the typed message contract (`website/src/content/messages.ts`)
additions listed above. No API, storage, or external-service changes. The
website demo calculation stays `website-demo-v1` — its formula is untouched;
only its unused `surplusEua` output remains available for future use.

## Failure modes and edge cases

- Reduced motion: the new `surplus` scrub segment must snap per step like the
  others; covered by the existing snap test extended to step 6.
- No JavaScript: the story renders scene 1 statically (unchanged); the
  calculator renders the deficit mode server-side with its noscript-visible
  values, as today.
- Scrolling backwards 6→5→4 must reverse cleanly (scrub, not timers).
- Mobile: the duality band stacks; the sixth step adds scroll length only on
  lg+ rows (mobile rows remain auto-height).
- Contrast: every asset-colour text use measured ≥ 4.5:1; axe runs on all
  routes in e2e.
- The surplus result must never render a penalty row or any "guaranteed
  proceeds" phrasing.

## Acceptance criteria

- [ ] The story tells both directions: steps 1–5 as today, step 6 shows the
      surplus state with asset-coloured blocks above the emissions bar and a
      travelling coverage-line label; scrubbed and reversible by scroll.
- [ ] The calculator toggles between deficit and surplus; deficit output is
      unchanged; surplus output shows t × price as bound capital at the
      reader's own assumption, with no penalty row and no sale
      recommendation; the toggle is keyboard- and screen-reader-usable.
- [ ] No company-like name (including "Nordwerk") exists anywhere in
      `website/` or `docs/process/current-state.md`.
- [ ] The duality band renders after the story in both locales with
      founder-approved wording.
- [ ] No demo, estimated, or synthetic value is presented as verified; DEMO
      badges remain on story and calculator.
- [ ] Both locales fully translated (enforced by the message contract).
- [ ] Relevant documentation is updated.

## Verification

Codex must run:

```text
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

Manual: desktop and mobile scroll-through of all six steps in both locales,
forwards and backwards; calculator mode switch by mouse and keyboard; axe is
covered by the e2e suite; verify reduced-motion behaviour with OS setting.

## Documentation updates

- [ ] `docs/process/current-state.md` (story, calculator, example label)
- [ ] `docs/process/backlog.md` (add: surplus variant of the product-page
      worked example, if the founder wants it later)
- [ ] `docs/process/changelog.md`
- [ ] `docs/product/website-brief.md` if the founder considers the surplus
      narrative a positioning change
- [ ] Decision record: one short record for "website communicates surplus
      and deficit duality" (product-direction change → founder approval)

## Rollout and rollback

Website-only; ships through the existing branch/PR/preview flow. Rollback is
a revert of the single epic commit(s). No data migration.

## Implementation notes

Implemented by Claude on 2026-08-24 on `agent/website-09-surplus-duality`.

Deviations from the proposed implementation, resolved as small details under
the plan handoff contract:

- The planned `aria-live="polite"` on the calculator's headline result was
  deliberately dropped: the native radios announce the mode change
  themselves, and a live region would double the speech output. Sighted
  context comes from the mode-switched title and result panel.
- Surplus mode reuses the deficit sector presets unchanged rather than
  relabelling them; they act as order-of-magnitude aids in both modes and
  the code comment says so.
- The duality deficit card's copy is a close paraphrase of the plan's
  sketch, aligned with the story's step-5 wording.
- One key was added beyond the plan: `calculator.surplusTitle`, because the
  fixed section title ("Was kostet Ihre ungedeckte Menge?") would have
  contradicted an active surplus mode.
- An adversarial review pass added: a fade-out band for the travelling
  allowances label while it crosses the stationary labels in the surplus
  scene, a real border on the selected calculator segment so forced-colors
  mode keeps a visible selection, discriminating opacity assertions for the
  surplus scene in the story spec, and the previously missed `Nordwerk`
  mention in `website/README.md`.

Verification: `pnpm format:check`, `pnpm lint`, `pnpm typecheck`,
`pnpm test` (40 unit tests), `pnpm build`, and `pnpm test:e2e` (24
Playwright tests including the surplus scene, reduced-motion snap, dual-mode
calculator, and axe on all routes) all pass on Node 22.14 locally; CI on
Node 24 remains the authoritative check. Manual desktop/mobile scroll-through
remains for the founder preview.
