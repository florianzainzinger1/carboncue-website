import { guideHubCopy } from "@/content/de/guides/hub";
import {
  getGuideHubPath,
  getGuidePath,
  GUIDE_LOCALE,
  GUIDES,
} from "@/content/guides/registry";
import {
  getLocalizedHrefMap,
  PAGE_PATHS,
  type LocalizedHrefMap,
  type PagePath,
} from "@/i18n/paths";

/** An ISO calendar date (YYYY-MM-DD). Never derive it from `new Date()`. */
export type IsoDate = `${number}-${number}-${number}`;

export type SitemapPageEntry = Readonly<{
  /** Public paths keyed by the locales the page exists in. */
  localizedPaths: LocalizedHrefMap;
  lastModified: IsoDate;
}>;

/**
 * Last material content change per bilingual page. Update the date by hand
 * when a page's content changes.
 */
export const PAGE_LAST_MODIFIED = {
  "/": "2026-09-14",
  "/product": "2026-09-14",
  "/contact": "2026-09-14",
  "/privacy": "2026-09-14",
  "/imprint": "2026-09-14",
} as const satisfies Record<PagePath, IsoDate>;

export const BILINGUAL_SITEMAP_ENTRIES: readonly SitemapPageEntry[] =
  PAGE_PATHS.map((pagePath) => ({
    localizedPaths: getLocalizedHrefMap(pagePath),
    lastModified: PAGE_LAST_MODIFIED[pagePath],
  }));

/**
 * Pages that exist in a single locale: the German-only "EU-ETS-Wissen" hub
 * and its guides. They are listed without hreflang alternates; dates come
 * from the guide registry.
 */
export const SINGLE_LOCALE_SITEMAP_ENTRIES: readonly SitemapPageEntry[] = [
  {
    localizedPaths: { [GUIDE_LOCALE]: getGuideHubPath() },
    lastModified: guideHubCopy.updatedOn,
  },
  ...GUIDES.map((guide) => ({
    localizedPaths: { [guide.locale]: getGuidePath(guide.slug) },
    lastModified: guide.updatedOn,
  })),
];
