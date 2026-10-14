/**
 * Public source copy: the real operator names and imprint address are
 * published on https://carboncue.eu/imprint and are replaced here by clearly
 * marked placeholders. Angle-bracket placeholders fail the production guard
 * below, so this copy cannot be deployed to production unchanged.
 */
export const OPERATOR_NAMES = ["CarbonCue"] as const;

export type ConfiguredOperatorAddress = Readonly<{
  status: "configured";
  streetAddress: string;
  postalCode: string;
  locality: string;
  country: "Austria";
}>;

export type MissingOperatorAddress = Readonly<{
  status: "missing";
  reason: "awaiting_founder_input";
}>;

export type OperatorAddress =
  ConfiguredOperatorAddress | MissingOperatorAddress;

export type OperatorDetails = Readonly<{
  names: typeof OPERATOR_NAMES;
  country: "Austria";
  contactEmail: "kontakt@carboncue.eu";
  address: OperatorAddress;
}>;

export const operatorDetails: OperatorDetails = {
  names: OPERATOR_NAMES,
  country: "Austria",
  contactEmail: "kontakt@carboncue.eu",
  address: {
    status: "configured",
    streetAddress: "<address on the live website>",
    postalCode: "<postal code>",
    locality: "<city>",
    country: "Austria",
  },
};

const PLACEHOLDER_PATTERN =
  /(?:placeholder|todo|tbd|ausständig|pending|example address|muster(?:straße|strasse)|x{2,}|<[^>]*>)/i;

function isCompleteAddress(address: ConfiguredOperatorAddress): boolean {
  return [address.streetAddress, address.postalCode, address.locality].every(
    (field) => field.trim().length > 0 && !PLACEHOLDER_PATTERN.test(field),
  );
}

export function isProductionDeployment(
  environment: Readonly<Record<string, string | undefined>>,
): boolean {
  return (
    environment.VERCEL_ENV === "production" ||
    environment.CARBONCUE_DEPLOYMENT_ENV === "production"
  );
}

export function assertProductionImprintAddress(
  environment: Readonly<Record<string, string | undefined>> = process.env,
  details: OperatorDetails = operatorDetails,
): void {
  if (!isProductionDeployment(environment)) {
    return;
  }

  if (details.address.status !== "configured") {
    throw new Error(
      '[CarbonCue configuration] Production build blocked: the imprint address is missing. A founder must set operatorDetails.address in website/src/content/legal/operator.ts to status "configured" and provide streetAddress, postalCode, locality, and country before production.',
    );
  }

  if (!isCompleteAddress(details.address)) {
    throw new Error(
      "[CarbonCue configuration] Production build blocked: the imprint address is empty or contains a placeholder. Complete operatorDetails.address in website/src/content/legal/operator.ts.",
    );
  }
}

export function formatOperatorAddress(
  address: ConfiguredOperatorAddress,
): string {
  return `${address.streetAddress}, ${address.postalCode} ${address.locality}`;
}
