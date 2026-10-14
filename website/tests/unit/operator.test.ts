import { describe, expect, it } from "vitest";

import {
  assertProductionImprintAddress,
  operatorDetails,
  type OperatorDetails,
} from "../../src/content/legal/operator";

const missingDetails: OperatorDetails = {
  ...operatorDetails,
  address: {
    status: "missing",
    reason: "awaiting_founder_input",
  },
};

const configuredDetails: OperatorDetails = {
  ...operatorDetails,
  address: {
    status: "configured",
    streetAddress: "Beispielgasse 1",
    postalCode: "1010",
    locality: "Vienna",
    country: "Austria",
  },
};

describe("operator and imprint configuration", () => {
  it("keeps the founder address configured and machine-checkable", () => {
    expect(operatorDetails.address.status).toBe("configured");
  });

  it("blocks a production build of this public copy's placeholder address", () => {
    expect(() =>
      assertProductionImprintAddress(
        { VERCEL_ENV: "production" },
        operatorDetails,
      ),
    ).toThrow(/empty or contains a placeholder/);
  });

  it("allows development and preview builds while the address is missing", () => {
    expect(() =>
      assertProductionImprintAddress(
        { NODE_ENV: "development" },
        missingDetails,
      ),
    ).not.toThrow();
    expect(() =>
      assertProductionImprintAddress({ VERCEL_ENV: "preview" }, missingDetails),
    ).not.toThrow();
  });

  it("blocks a production build when the address is missing", () => {
    expect(() =>
      assertProductionImprintAddress(
        { VERCEL_ENV: "production" },
        missingDetails,
      ),
    ).toThrow(/Production build blocked: the imprint address is missing/);
  });

  it("accepts a complete production address and rejects placeholders", () => {
    expect(() =>
      assertProductionImprintAddress(
        { CARBONCUE_DEPLOYMENT_ENV: "production" },
        configuredDetails,
      ),
    ).not.toThrow();

    expect(() =>
      assertProductionImprintAddress(
        { CARBONCUE_DEPLOYMENT_ENV: "production" },
        {
          ...configuredDetails,
          address: {
            status: "configured",
            streetAddress: "TODO",
            postalCode: "1010",
            locality: "Vienna",
            country: "Austria",
          },
        },
      ),
    ).toThrow(/empty or contains a placeholder/);
  });
});
