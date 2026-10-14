import { getDictionary } from "@/content/dictionaries";
import { FOUNDER_PROFILES } from "@/content/founders";
import {
  getSiteUrlConfiguration,
  SITE_NAME,
  type SiteUrlConfiguration,
} from "@/content/site";
import type { Locale } from "@/i18n/config";

/** The bare domain, offered to search engines as an alternate site name. */
export const SITE_ALTERNATE_NAME = "carboncue.eu";

type WebsiteStructuredDataProps = Readonly<{
  locale: Locale;
  siteConfiguration?: SiteUrlConfiguration;
}>;

/**
 * WebSite entity for the two home pages. There is no legal entity behind
 * CarbonCue, so the publishers are the founders as natural persons and
 * no Organization is ever emitted (founder decision 2026-09-14, ADR 0005).
 */
export function createWebsiteStructuredData(
  locale: Locale,
  siteConfiguration: SiteUrlConfiguration = getSiteUrlConfiguration(),
) {
  const dictionary = getDictionary(locale);
  const websiteUrl = siteConfiguration.canonicalBaseUrl
    ? new URL("/", siteConfiguration.canonicalBaseUrl).toString()
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: SITE_ALTERNATE_NAME,
    ...(websiteUrl ? { url: websiteUrl } : {}),
    description: dictionary.home.metadata.description,
    inLanguage: locale,
    publisher: FOUNDER_PROFILES.map((founder) => ({
      "@type": "Person",
      name: founder.name,
      sameAs: [founder.linkedInUrl],
    })),
  } as const;
}

export function serializeStructuredData(data: unknown): string {
  // Escape "<" so no string value can close the script element early.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function WebsiteStructuredData({
  locale,
  siteConfiguration,
}: WebsiteStructuredDataProps) {
  const structuredData = createWebsiteStructuredData(locale, siteConfiguration);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeStructuredData(structuredData),
      }}
    />
  );
}
