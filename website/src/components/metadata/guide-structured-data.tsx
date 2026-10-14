import { FOUNDER_PROFILES } from "@/content/founders";
import { guideHubCopy, guidePageLabels } from "@/content/de/guides/hub";
import {
  getGuideHubPath,
  getGuidePath,
  GUIDE_LOCALE,
  type GuideEntry,
} from "@/content/guides/registry";
import {
  getSiteUrlConfiguration,
  type SiteUrlConfiguration,
} from "@/content/site";
import { getHomePath } from "@/i18n/paths";
import { getSocialImagePaths } from "@/lib/metadata/page-metadata";

import { serializeStructuredData } from "./website-structured-data";

type BreadcrumbStep = Readonly<{ name: string; path: string }>;

function absoluteUrl(baseUrl: URL | null, path: string): string | undefined {
  return baseUrl ? new URL(path, baseUrl).toString() : undefined;
}

function founderPersons() {
  return FOUNDER_PROFILES.map((founder) => ({
    "@type": "Person" as const,
    name: founder.name,
    sameAs: [founder.linkedInUrl],
  }));
}

/**
 * BreadcrumbList. On previews (no canonical base URL) the `item` URLs are
 * omitted so no preview hostname is published as a canonical signal.
 */
export function createBreadcrumbStructuredData(
  steps: readonly BreadcrumbStep[],
  siteConfiguration: SiteUrlConfiguration = getSiteUrlConfiguration(),
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: steps.map((step, index) => {
      const item = absoluteUrl(siteConfiguration.canonicalBaseUrl, step.path);

      return {
        "@type": "ListItem",
        position: index + 1,
        name: step.name,
        ...(item ? { item } : {}),
      };
    }),
  } as const;
}

export function getHubBreadcrumbSteps(): BreadcrumbStep[] {
  return [
    { name: guidePageLabels.breadcrumbHome, path: getHomePath(GUIDE_LOCALE) },
    { name: guideHubCopy.title, path: getGuideHubPath() },
  ];
}

export function getGuideBreadcrumbSteps(guide: GuideEntry): BreadcrumbStep[] {
  return [
    ...getHubBreadcrumbSteps(),
    { name: guide.content.h1, path: getGuidePath(guide.slug) },
  ];
}

/**
 * Article entity for a guide. Authors and publisher are the founders as
 * natural persons; no Organization is emitted because no legal entity exists
 * (ADR 0005). On previews the `@id` and `image` URL fields are omitted
 * so no preview hostname is published.
 */
export function createGuideArticleStructuredData(
  guide: GuideEntry,
  siteConfiguration: SiteUrlConfiguration = getSiteUrlConfiguration(),
) {
  const canonicalUrl = absoluteUrl(
    siteConfiguration.canonicalBaseUrl,
    getGuidePath(guide.slug),
  );
  const imageUrl = absoluteUrl(
    siteConfiguration.canonicalBaseUrl,
    getSocialImagePaths(GUIDE_LOCALE).openGraph,
  );

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.content.h1,
    description: guide.content.metaDescription,
    inLanguage: guide.locale,
    datePublished: guide.publishedOn,
    dateModified: guide.updatedOn,
    ...(canonicalUrl
      ? { mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl } }
      : {}),
    ...(imageUrl ? { image: [imageUrl] } : {}),
    author: founderPersons(),
    publisher: founderPersons(),
  } as const;
}

type StructuredDataScriptProps = Readonly<{ data: unknown }>;

export function StructuredDataScript({ data }: StructuredDataScriptProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeStructuredData(data) }}
    />
  );
}
