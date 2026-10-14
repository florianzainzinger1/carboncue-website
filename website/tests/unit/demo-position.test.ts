import { describe, expect, it } from "vitest";

import {
  calculateDemoPosition,
  type DemoPositionInput,
} from "../../src/lib/demo";

const GAP_INPUT = {
  obligationEua: 125_000,
  freeAllocationEua: 50_000,
  heldAllowancesEua: 20_000,
  plannedPurchasesEua: 10_000,
  priceCentsPerEua: 8_750,
} as const satisfies DemoPositionInput;

describe("calculateDemoPosition", () => {
  it("returns zero values for a zero input", () => {
    const result = calculateDemoPosition({
      obligationEua: 0,
      freeAllocationEua: 0,
      heldAllowancesEua: 0,
      plannedPurchasesEua: 0,
      priceCentsPerEua: 0,
    });

    expect(result).toMatchObject({
      coverageEua: 0,
      gapEua: 0,
      surplusEua: 0,
      budgetCents: 0,
    });
  });

  it("calculates coverage, gap, and budget for an uncovered position", () => {
    const result = calculateDemoPosition(GAP_INPUT);

    expect(result).toMatchObject({
      coverageEua: 80_000,
      gapEua: 45_000,
      surplusEua: 0,
      budgetCents: 393_750_000,
    });
  });

  it("floors the gap at zero for exact coverage", () => {
    const result = calculateDemoPosition({
      obligationEua: 100,
      freeAllocationEua: 40,
      heldAllowancesEua: 30,
      plannedPurchasesEua: 30,
      priceCentsPerEua: 9_000,
    });

    expect(result.gapEua).toBe(0);
    expect(result.surplusEua).toBe(0);
    expect(result.budgetCents).toBe(0);
  });

  it("returns a surplus without a negative gap or budget", () => {
    const result = calculateDemoPosition({
      obligationEua: 100,
      freeAllocationEua: 80,
      heldAllowancesEua: 40,
      plannedPurchasesEua: 10,
      priceCentsPerEua: 9_000,
    });

    expect(result.coverageEua).toBe(130);
    expect(result.gapEua).toBe(0);
    expect(result.surplusEua).toBe(30);
    expect(result.budgetCents).toBe(0);
  });

  it.each([
    ["obligationEua", -1],
    ["freeAllocationEua", 1.5],
    ["heldAllowancesEua", Number.NaN],
    ["plannedPurchasesEua", Number.POSITIVE_INFINITY],
    ["priceCentsPerEua", Number.MAX_SAFE_INTEGER + 1],
  ] as const)("rejects invalid %s input", (field, value) => {
    expect(() =>
      calculateDemoPosition({ ...GAP_INPUT, [field]: value }),
    ).toThrow(RangeError);
  });

  it("rejects non-numeric and non-object runtime input", () => {
    expect(() =>
      calculateDemoPosition({
        ...GAP_INPUT,
        obligationEua: "125000" as unknown as number,
      }),
    ).toThrow(TypeError);
    expect(() =>
      calculateDemoPosition(null as unknown as DemoPositionInput),
    ).toThrow(TypeError);
  });

  it("accepts safe-integer output boundaries", () => {
    const maximumBudget = calculateDemoPosition({
      obligationEua: Number.MAX_SAFE_INTEGER,
      freeAllocationEua: 0,
      heldAllowancesEua: 0,
      plannedPurchasesEua: 0,
      priceCentsPerEua: 1,
    });
    const maximumCoverage = calculateDemoPosition({
      obligationEua: 0,
      freeAllocationEua: Number.MAX_SAFE_INTEGER,
      heldAllowancesEua: 0,
      plannedPurchasesEua: 0,
      priceCentsPerEua: Number.MAX_SAFE_INTEGER,
    });

    expect(maximumBudget.gapEua).toBe(Number.MAX_SAFE_INTEGER);
    expect(maximumBudget.budgetCents).toBe(Number.MAX_SAFE_INTEGER);
    expect(maximumCoverage.coverageEua).toBe(Number.MAX_SAFE_INTEGER);
    expect(maximumCoverage.surplusEua).toBe(Number.MAX_SAFE_INTEGER);
    expect(maximumCoverage.budgetCents).toBe(0);
  });

  it("rejects unsafe coverage and budget output ranges", () => {
    expect(() =>
      calculateDemoPosition({
        obligationEua: 0,
        freeAllocationEua: Number.MAX_SAFE_INTEGER,
        heldAllowancesEua: 1,
        plannedPurchasesEua: 0,
        priceCentsPerEua: 0,
      }),
    ).toThrow(/coverageEua exceeds the safe integer range/);

    expect(() =>
      calculateDemoPosition({
        obligationEua: Number.MAX_SAFE_INTEGER,
        freeAllocationEua: 0,
        heldAllowancesEua: 0,
        plannedPurchasesEua: 0,
        priceCentsPerEua: 2,
      }),
    ).toThrow(/budgetCents exceeds the safe integer range/);
  });

  it("never increases the gap when eligible coverage is added", () => {
    let previousGap = Number.POSITIVE_INFINITY;

    for (const heldAllowancesEua of [0, 1, 100, 500, 900, 1_000, 1_100]) {
      const result = calculateDemoPosition({
        obligationEua: 1_000,
        freeAllocationEua: 0,
        heldAllowancesEua,
        plannedPurchasesEua: 0,
        priceCentsPerEua: 100,
      });

      expect(result.gapEua).toBeLessThanOrEqual(previousGap);
      previousGap = result.gapEua;
    }
  });

  it("returns identical deterministic view models for repeated evaluation", () => {
    const first = calculateDemoPosition(GAP_INPUT);
    const second = calculateDemoPosition(GAP_INPUT);

    expect(second).toEqual(first);
    expect(first.input).not.toBe(GAP_INPUT);
    expect(first).toMatchObject({
      status: "demo",
      source: "synthetic_example",
      exampleDate: "2026-08-01",
      calculationVersion: "website-demo-v1",
      scope: {
        kind: "fictional_installation",
        id: "beispiel-industrieanlage",
      },
    });
    expect(first.units.budgetCents).toBe("EUR_CENTS");
    expect(first.assumptions).toContain("price_is_stated_input");
    expect(first.warnings).toContain("not_price_prediction_or_recommendation");
  });
});
