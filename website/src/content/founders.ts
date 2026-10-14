export type FounderRole = "productAndTechnology";

export type FounderProfile = Readonly<{
  name: string;
  role: FounderRole;
  linkedInUrl: `https://www.linkedin.com/in/${string}/`;
}>;

/**
 * Public founder profiles. Used for the WebSite and Article JSON-LD publishers
 * (`sameAs`) and the contact-page founders section. This public source copy
 * lists only Florian Zainzinger.
 */
export const FOUNDER_PROFILES = [
  {
    name: "Florian Zainzinger",
    role: "productAndTechnology",
    linkedInUrl: "https://www.linkedin.com/in/florian-zainzinger-63650a259/",
  },
] as const satisfies readonly FounderProfile[];

export function getFounderByRole(role: FounderRole): FounderProfile {
  const founder = FOUNDER_PROFILES.find((profile) => profile.role === role);

  if (!founder) {
    throw new Error(`No founder profile for role ${role}`);
  }

  return founder;
}
