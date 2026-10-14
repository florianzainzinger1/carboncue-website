export type DemoPositionInput = Readonly<{
  obligationEua: number;
  freeAllocationEua: number;
  heldAllowancesEua: number;
  plannedPurchasesEua: number;
  priceCentsPerEua: number;
}>;

export const DEMO_ASSUMPTIONS = [
  "synthetic_inputs",
  "listed_coverage_is_additive",
  "price_is_stated_input",
] as const;

export type DemoPositionAssumption = (typeof DEMO_ASSUMPTIONS)[number];

export const DEMO_WARNINGS = [
  "not_customer_or_verified_data",
  "not_price_prediction_or_recommendation",
  "limited_explanatory_scope",
] as const;

export type DemoPositionWarning = (typeof DEMO_WARNINGS)[number];

export type DemoPositionResult = Readonly<{
  status: "demo";
  source: "synthetic_example";
  exampleDate: "2026-08-01";
  calculationVersion: "website-demo-v1";
  scope: Readonly<{
    kind: "fictional_installation";
    id: "beispiel-industrieanlage";
  }>;
  input: DemoPositionInput;
  coverageEua: number;
  gapEua: number;
  surplusEua: number;
  budgetCents: number;
  units: Readonly<{
    obligationEua: "EUA";
    freeAllocationEua: "EUA";
    heldAllowancesEua: "EUA";
    plannedPurchasesEua: "EUA";
    priceCentsPerEua: "EUR_CENTS_PER_EUA";
    coverageEua: "EUA";
    gapEua: "EUA";
    surplusEua: "EUA";
    budgetCents: "EUR_CENTS";
  }>;
  assumptions: readonly DemoPositionAssumption[];
  warnings: readonly DemoPositionWarning[];
}>;

const INPUT_FIELDS = [
  "obligationEua",
  "freeAllocationEua",
  "heldAllowancesEua",
  "plannedPurchasesEua",
  "priceCentsPerEua",
] as const satisfies readonly (keyof DemoPositionInput)[];

const DEMO_UNITS = {
  obligationEua: "EUA",
  freeAllocationEua: "EUA",
  heldAllowancesEua: "EUA",
  plannedPurchasesEua: "EUA",
  priceCentsPerEua: "EUR_CENTS_PER_EUA",
  coverageEua: "EUA",
  gapEua: "EUA",
  surplusEua: "EUA",
  budgetCents: "EUR_CENTS",
} as const satisfies DemoPositionResult["units"];

function assertDemoInput(
  input: DemoPositionInput,
): asserts input is DemoPositionInput {
  if (typeof input !== "object" || input === null) {
    throw new TypeError("Demo position input must be an object.");
  }

  for (const field of INPUT_FIELDS) {
    const value = input[field];

    if (typeof value !== "number") {
      throw new TypeError(`${field} must be a number.`);
    }

    if (!Number.isSafeInteger(value) || value < 0) {
      throw new RangeError(`${field} must be a non-negative safe integer.`);
    }
  }
}

function addSafely(left: number, right: number, outputName: string): number {
  if (left > Number.MAX_SAFE_INTEGER - right) {
    throw new RangeError(`${outputName} exceeds the safe integer range.`);
  }

  return left + right;
}

function multiplySafely(
  left: number,
  right: number,
  outputName: string,
): number {
  if (left !== 0 && right > Math.floor(Number.MAX_SAFE_INTEGER / left)) {
    throw new RangeError(`${outputName} exceeds the safe integer range.`);
  }

  return left * right;
}

export function calculateDemoPosition(
  input: DemoPositionInput,
): DemoPositionResult {
  assertDemoInput(input);

  const allocationAndHoldingsEua = addSafely(
    input.freeAllocationEua,
    input.heldAllowancesEua,
    "coverageEua",
  );
  const coverageEua = addSafely(
    allocationAndHoldingsEua,
    input.plannedPurchasesEua,
    "coverageEua",
  );
  const gapEua = Math.max(input.obligationEua - coverageEua, 0);
  const surplusEua = Math.max(coverageEua - input.obligationEua, 0);
  const budgetCents = multiplySafely(
    gapEua,
    input.priceCentsPerEua,
    "budgetCents",
  );

  return {
    status: "demo",
    source: "synthetic_example",
    exampleDate: "2026-08-01",
    calculationVersion: "website-demo-v1",
    scope: {
      kind: "fictional_installation",
      id: "beispiel-industrieanlage",
    },
    input: { ...input },
    coverageEua,
    gapEua,
    surplusEua,
    budgetCents,
    units: DEMO_UNITS,
    assumptions: DEMO_ASSUMPTIONS,
    warnings: DEMO_WARNINGS,
  };
}
