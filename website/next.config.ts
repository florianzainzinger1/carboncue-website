import type { NextConfig } from "next";

import { assertProductionImprintAddress } from "./src/content/legal/operator";
import {
  assertProductionSiteUrl,
  getDeploymentEnvironment,
} from "./src/content/site";
import {
  createHostHeaders,
  createLocaleRedirects,
  createLocaleRewrites,
} from "./src/i18n/routing";

assertProductionSiteUrl();
assertProductionImprintAddress();

const deploymentEnvironment = getDeploymentEnvironment(process.env);

const nextConfig: NextConfig = {
  env: {
    CARBONCUE_BUILD_DEPLOYMENT_ENV: deploymentEnvironment,
    CARBONCUE_BUILD_PREVIEW_URL:
      deploymentEnvironment === "preview" ? (process.env.VERCEL_URL ?? "") : "",
  },
  async headers() {
    return createHostHeaders().map((rule) => ({
      ...rule,
      has: [...rule.has],
      headers: [...rule.headers],
    }));
  },
  async redirects() {
    return createLocaleRedirects();
  },
  async rewrites() {
    return createLocaleRewrites();
  },
};

export default nextConfig;
