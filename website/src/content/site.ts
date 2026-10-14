export const SITE_NAME = "CarbonCue";

export type ConfiguredProductionSiteUrl = Readonly<{
  status: "configured";
  url: string;
}>;

export type MissingProductionSiteUrl = Readonly<{
  status: "missing";
  reason: "awaiting_founder_approval";
}>;

export type ProductionSiteUrl =
  ConfiguredProductionSiteUrl | MissingProductionSiteUrl;

export const productionSiteUrl: ProductionSiteUrl = {
  status: "configured",
  url: "https://carboncue.eu",
};

export type DeploymentEnvironment = "development" | "preview" | "production";

export type SiteUrlConfiguration = Readonly<{
  environment: DeploymentEnvironment;
  metadataBaseUrl: URL;
  canonicalBaseUrl: URL | null;
  isIndexable: boolean;
}>;

const DEVELOPMENT_SITE_URL = new URL("http://127.0.0.1:3000");
const PLACEHOLDER_HOST_PATTERN =
  /(?:^|\.)(?:example|invalid|localhost|test)(?:\.|$)|(?:placeholder|todo|tbd)/i;

export function getDeploymentEnvironment(
  environment: Readonly<Record<string, string | undefined>>,
): DeploymentEnvironment {
  if (
    environment.CARBONCUE_BUILD_DEPLOYMENT_ENV === "development" ||
    environment.CARBONCUE_BUILD_DEPLOYMENT_ENV === "preview" ||
    environment.CARBONCUE_BUILD_DEPLOYMENT_ENV === "production"
  ) {
    return environment.CARBONCUE_BUILD_DEPLOYMENT_ENV;
  }

  if (
    environment.VERCEL_ENV === "production" ||
    environment.CARBONCUE_DEPLOYMENT_ENV === "production"
  ) {
    return "production";
  }

  if (
    environment.VERCEL_ENV === "preview" ||
    environment.CARBONCUE_DEPLOYMENT_ENV === "preview"
  ) {
    return "preview";
  }

  return "development";
}

function parseProductionUrl(configuration: ProductionSiteUrl): URL {
  if (configuration.status !== "configured") {
    throw new Error(
      '[CarbonCue configuration] Production build blocked: the founder-approved production URL is missing. A founder must set productionSiteUrl in website/src/content/site.ts to status "configured" and provide the approved HTTPS origin before production.',
    );
  }

  let url: URL;

  try {
    url = new URL(configuration.url);
  } catch {
    throw new Error(
      "[CarbonCue configuration] Production build blocked: productionSiteUrl.url is not a valid absolute URL.",
    );
  }

  const hasOnlyOrigin =
    url.protocol === "https:" &&
    url.username === "" &&
    url.password === "" &&
    url.port === "" &&
    (url.pathname === "/" || url.pathname === "") &&
    url.search === "" &&
    url.hash === "";
  const isPreviewOrPlaceholder =
    url.hostname === "vercel.app" ||
    url.hostname.endsWith(".vercel.app") ||
    PLACEHOLDER_HOST_PATTERN.test(url.hostname);

  if (!hasOnlyOrigin || isPreviewOrPlaceholder) {
    throw new Error(
      "[CarbonCue configuration] Production build blocked: productionSiteUrl.url must be the founder-approved HTTPS origin, without credentials, a port, path, query, fragment, preview hostname, or placeholder hostname.",
    );
  }

  return url;
}

function getPreviewMetadataBase(
  environment: Readonly<Record<string, string | undefined>>,
): URL {
  const previewHostname =
    environment.CARBONCUE_BUILD_PREVIEW_URL || environment.VERCEL_URL;

  if (!previewHostname) {
    return DEVELOPMENT_SITE_URL;
  }

  try {
    const url = new URL(
      previewHostname.startsWith("http://") ||
        previewHostname.startsWith("https://")
        ? previewHostname
        : `https://${previewHostname}`,
    );

    return new URL(url.origin);
  } catch {
    return DEVELOPMENT_SITE_URL;
  }
}

export function assertProductionSiteUrl(
  environment: Readonly<Record<string, string | undefined>> = process.env,
  configuration: ProductionSiteUrl = productionSiteUrl,
): void {
  if (getDeploymentEnvironment(environment) !== "production") {
    return;
  }

  parseProductionUrl(configuration);
}

export function getSiteUrlConfiguration(
  environment: Readonly<Record<string, string | undefined>> = process.env,
  productionConfiguration: ProductionSiteUrl = productionSiteUrl,
): SiteUrlConfiguration {
  const deploymentEnvironment = getDeploymentEnvironment(environment);

  if (deploymentEnvironment === "production") {
    const productionUrl = parseProductionUrl(productionConfiguration);

    return {
      environment: deploymentEnvironment,
      metadataBaseUrl: productionUrl,
      canonicalBaseUrl: productionUrl,
      isIndexable: true,
    };
  }

  if (deploymentEnvironment === "preview") {
    return {
      environment: deploymentEnvironment,
      metadataBaseUrl: getPreviewMetadataBase(environment),
      canonicalBaseUrl: null,
      isIndexable: false,
    };
  }

  return {
    environment: deploymentEnvironment,
    metadataBaseUrl: DEVELOPMENT_SITE_URL,
    canonicalBaseUrl: DEVELOPMENT_SITE_URL,
    isIndexable: true,
  };
}
