import type { MetadataRoute } from "next";

import {
  getSiteUrlConfiguration,
  type SiteUrlConfiguration,
} from "@/content/site";

export function createRobots(
  siteConfiguration: SiteUrlConfiguration,
): MetadataRoute.Robots {
  const baseUrl = siteConfiguration.canonicalBaseUrl;

  if (!siteConfiguration.isIndexable || !baseUrl) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("/sitemap.xml", baseUrl).toString(),
  };
}

export default function robots(): MetadataRoute.Robots {
  return createRobots(getSiteUrlConfiguration());
}
