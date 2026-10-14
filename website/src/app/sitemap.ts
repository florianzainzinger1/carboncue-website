import type { MetadataRoute } from "next";

import {
  getSiteUrlConfiguration,
  type SiteUrlConfiguration,
} from "@/content/site";
import { SUPPORTED_LOCALES } from "@/i18n/config";
import { getHreflangMap } from "@/i18n/paths";
import {
  BILINGUAL_SITEMAP_ENTRIES,
  SINGLE_LOCALE_SITEMAP_ENTRIES,
  type SitemapPageEntry,
} from "@/lib/metadata/sitemap-entries";

function getAbsoluteUrl(baseUrl: URL, path: string): string {
  return new URL(path, baseUrl).toString();
}

export function createSitemap(
  siteConfiguration: SiteUrlConfiguration,
  entries: readonly SitemapPageEntry[] = [
    ...BILINGUAL_SITEMAP_ENTRIES,
    ...SINGLE_LOCALE_SITEMAP_ENTRIES,
  ],
): MetadataRoute.Sitemap {
  const baseUrl = siteConfiguration.canonicalBaseUrl;

  if (!baseUrl) {
    return [];
  }

  return entries.flatMap((entry) => {
    const hreflang = getHreflangMap(entry.localizedPaths);
    const languages = Object.fromEntries(
      Object.entries(hreflang).map(([language, path]) => [
        language,
        getAbsoluteUrl(baseUrl, path),
      ]),
    );
    const hasAlternates = Object.keys(languages).length > 0;

    return SUPPORTED_LOCALES.flatMap((locale) => {
      const path = entry.localizedPaths[locale];

      if (path === undefined) {
        return [];
      }

      return [
        {
          url: getAbsoluteUrl(baseUrl, path),
          lastModified: entry.lastModified,
          ...(hasAlternates ? { alternates: { languages } } : {}),
        },
      ];
    });
  });
}

export default function sitemap(): MetadataRoute.Sitemap {
  return createSitemap(getSiteUrlConfiguration());
}
