import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  createWebsiteStructuredData,
  serializeStructuredData,
  WebsiteStructuredData,
} from "../../src/components/metadata/website-structured-data";
import { dictionaries } from "../../src/content/dictionaries";
import { FOUNDER_PROFILES, getFounderByRole } from "../../src/content/founders";
import {
  assertProductionSiteUrl,
  getSiteUrlConfiguration,
  productionSiteUrl,
  type ConfiguredProductionSiteUrl,
} from "../../src/content/site";
import { PAGE_PATHS } from "../../src/i18n/paths";
import { createPageMetadata } from "../../src/lib/metadata/page-metadata";
import {
  BILINGUAL_SITEMAP_ENTRIES,
  PAGE_LAST_MODIFIED,
  SINGLE_LOCALE_SITEMAP_ENTRIES,
} from "../../src/lib/metadata/sitemap-entries";
import { createRobots } from "../../src/app/robots";
import { createSitemap } from "../../src/app/sitemap";

const configuredProductionUrl: ConfiguredProductionSiteUrl = {
  status: "configured",
  url: "https://founder-approved-domain.com",
};

const productionConfiguration = getSiteUrlConfiguration(
  { CARBONCUE_DEPLOYMENT_ENV: "production" },
  configuredProductionUrl,
);

describe("site URL and metadata configuration", () => {
  it("uses carboncue.eu as the founder-approved production origin", () => {
    expect(productionSiteUrl).toEqual({
      status: "configured",
      url: "https://carboncue.eu",
    });
    expect(() =>
      assertProductionSiteUrl({ VERCEL_ENV: "production" }),
    ).not.toThrow();
  });

  it("allows development and preview while rejecting preview or malformed production origins", () => {
    expect(() =>
      assertProductionSiteUrl({ NODE_ENV: "development" }),
    ).not.toThrow();
    expect(() =>
      assertProductionSiteUrl({ VERCEL_ENV: "preview" }),
    ).not.toThrow();
    expect(() =>
      assertProductionSiteUrl(
        { CARBONCUE_DEPLOYMENT_ENV: "production" },
        { status: "configured", url: "https://branch-name.vercel.app" },
      ),
    ).toThrow(/preview hostname/);
    expect(() =>
      assertProductionSiteUrl(
        { CARBONCUE_DEPLOYMENT_ENV: "production" },
        {
          status: "configured",
          url: "http://founder-approved-domain.com/path",
        },
      ),
    ).toThrow(/founder-approved HTTPS origin/);
  });

  it("uses unprefixed English and prefixed German URLs for canonical and hreflang metadata", () => {
    const metadata = createPageMetadata({
      locale: "en",
      pagePath: "/product",
      messages: dictionaries.en.product.metadata,
      siteConfiguration: productionConfiguration,
    });

    expect(productionConfiguration.isIndexable).toBe(true);
    expect(metadata.alternates).toEqual({
      canonical: "https://founder-approved-domain.com/product",
      languages: {
        de: "https://founder-approved-domain.com/de/product",
        en: "https://founder-approved-domain.com/product",
        "x-default": "https://founder-approved-domain.com/product",
      },
    });
    expect(metadata.openGraph).toMatchObject({
      locale: "en_GB",
      alternateLocale: ["de_AT"],
      url: "https://founder-approved-domain.com/product",
    });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });

    const germanHome = createPageMetadata({
      locale: "de",
      pagePath: "/",
      messages: dictionaries.de.home.metadata,
      siteConfiguration: productionConfiguration,
    });

    expect(germanHome.alternates).toEqual({
      canonical: "https://founder-approved-domain.com/de",
      languages: {
        de: "https://founder-approved-domain.com/de",
        en: "https://founder-approved-domain.com/",
        "x-default": "https://founder-approved-domain.com/",
      },
    });
  });

  it("sets exactly one explicit Open Graph and Twitter image on every page in both locales", () => {
    for (const locale of ["de", "en"] as const) {
      for (const pagePath of PAGE_PATHS) {
        const metadata = createPageMetadata({
          locale,
          pagePath,
          messages: dictionaries[locale].home.metadata,
          siteConfiguration: productionConfiguration,
        });
        const openGraphImages = metadata.openGraph?.images;
        const twitterImages = metadata.twitter?.images;

        expect(Array.isArray(openGraphImages)).toBe(true);
        expect(Array.isArray(twitterImages)).toBe(true);
        expect(openGraphImages).toHaveLength(1);
        expect(twitterImages).toHaveLength(1);
        const imagePrefix = locale === "en" ? "" : `/${locale}`;

        expect(openGraphImages).toEqual([
          expect.objectContaining({
            url: `${imagePrefix}/opengraph-image/social-card`,
            width: 1200,
            height: 630,
          }),
        ]);
        expect(twitterImages).toEqual([
          expect.objectContaining({
            url: `${imagePrefix}/twitter-image/social-card`,
          }),
        ]);
      }
    }
  });

  it("supports single-locale pages with a canonical URL and only their own hreflang", () => {
    const metadata = createPageMetadata({
      locale: "de",
      localizedPaths: { de: "/de/wissen" },
      messages: dictionaries.de.home.metadata,
      siteConfiguration: productionConfiguration,
    });

    expect(metadata.alternates).toEqual({
      canonical: "https://founder-approved-domain.com/de/wissen",
      // No English counterpart, so no en and no x-default alternate.
      languages: { de: "https://founder-approved-domain.com/de/wissen" },
    });
    expect(metadata.openGraph).toMatchObject({ type: "website" });
    expect(metadata.openGraph).toMatchObject({
      locale: "de_AT",
      url: "https://founder-approved-domain.com/de/wissen",
    });
    expect(metadata.openGraph).not.toHaveProperty("alternateLocale");
    expect(() =>
      createPageMetadata({
        locale: "en",
        localizedPaths: { de: "/de/wissen" },
        messages: dictionaries.en.home.metadata,
        siteConfiguration: productionConfiguration,
      }),
    ).toThrow(/no en path/);
  });

  it("makes previews noindex without canonical or sitemap signals", () => {
    const configuration = getSiteUrlConfiguration({
      CARBONCUE_BUILD_DEPLOYMENT_ENV: "preview",
      CARBONCUE_BUILD_PREVIEW_URL: "carboncue-feature-preview.vercel.app",
      VERCEL_ENV: "production",
      VERCEL_URL: "ignored-production-alias.vercel.app",
    });
    const metadata = createPageMetadata({
      locale: "de",
      pagePath: "/contact",
      messages: dictionaries.de.contact.metadata,
      siteConfiguration: configuration,
    });

    expect(configuration.metadataBaseUrl.toString()).toBe(
      "https://carboncue-feature-preview.vercel.app/",
    );
    expect(configuration.canonicalBaseUrl).toBeNull();
    expect(metadata.alternates).toBeUndefined();
    expect(metadata.openGraph).not.toHaveProperty("url");
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
    expect(createSitemap(configuration)).toEqual([]);
    expect(
      createSitemap(configuration, [
        { localizedPaths: { de: "/de/wissen" }, lastModified: "2026-09-14" },
      ]),
    ).toEqual([]);
    expect(createRobots(configuration)).toEqual({
      rules: { userAgent: "*", disallow: "/" },
    });
  });

  it("builds all 10 localized sitemap entries plus the German-only guide pages with fixed lastmod dates", () => {
    const sitemap = createSitemap(productionConfiguration);

    // five bilingual pages in two locales, then the hub and the guides
    expect(sitemap).toHaveLength(
      PAGE_PATHS.length * 2 + SINGLE_LOCALE_SITEMAP_ENTRIES.length,
    );
    expect(sitemap.map((entry) => entry.url)).toContain(
      "https://founder-approved-domain.com/de/privacy",
    );
    expect(sitemap.map((entry) => entry.url)).toContain(
      "https://founder-approved-domain.com/privacy",
    );
    expect(sitemap.map((entry) => entry.url)).not.toContain(
      "https://founder-approved-domain.com/en/privacy",
    );
    expect(sitemap[0]?.alternates?.languages).toEqual({
      de: "https://founder-approved-domain.com/de",
      en: "https://founder-approved-domain.com/",
      "x-default": "https://founder-approved-domain.com/",
    });

    for (const entry of sitemap) {
      expect(entry.lastModified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }

    expect(Object.values(PAGE_LAST_MODIFIED)).toEqual(
      PAGE_PATHS.map(() => "2026-09-14"),
    );
    expect(createRobots(productionConfiguration)).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: "https://founder-approved-domain.com/sitemap.xml",
    });
    expect(createRobots(productionConfiguration)).not.toHaveProperty("host");
  });

  it("appends single-locale sitemap entries without hreflang alternates", () => {
    const sitemap = createSitemap(productionConfiguration, [
      ...BILINGUAL_SITEMAP_ENTRIES,
      {
        localizedPaths: { de: "/de/wissen" },
        lastModified: "2026-09-20",
      },
    ]);
    const guide = sitemap.at(-1);

    expect(sitemap).toHaveLength(PAGE_PATHS.length * 2 + 1);
    expect(guide).toEqual({
      url: "https://founder-approved-domain.com/de/wissen",
      lastModified: "2026-09-20",
    });
  });
});

describe("truthful website structured data", () => {
  it("publishes WebSite with the natural-person publisher and no Organization", () => {
    const configuration = getSiteUrlConfiguration({});
    const structuredData = createWebsiteStructuredData("de", configuration);
    const serialized = JSON.stringify(structuredData);

    expect(structuredData["@type"]).toBe("WebSite");
    expect(structuredData.url).toBe("http://127.0.0.1:3000/");
    expect(structuredData.alternateName).toBe("carboncue.eu");
    expect(structuredData.publisher).toEqual([
      {
        "@type": "Person",
        name: "Florian Zainzinger",
        sameAs: ["https://www.linkedin.com/in/florian-zainzinger-63650a259/"],
      },
    ]);
    expect(serialized).not.toContain("Organization");

    const markup = renderToStaticMarkup(
      <WebsiteStructuredData locale="de" siteConfiguration={configuration} />,
    );
    expect(markup).toContain('type="application/ld+json"');
    expect(markup).toContain('"@type":"WebSite"');
    expect(serializeStructuredData({ name: "</script><b>" })).toBe(
      '{"name":"\\u003c/script>\\u003cb>"}',
    );
  });

  it("uses the canonical origin root in production and omits the URL on previews", () => {
    expect(createWebsiteStructuredData("en", productionConfiguration).url).toBe(
      "https://founder-approved-domain.com/",
    );

    const preview = createWebsiteStructuredData(
      "en",
      getSiteUrlConfiguration({ CARBONCUE_BUILD_DEPLOYMENT_ENV: "preview" }),
    );

    expect(preview).not.toHaveProperty("url");
  });

  it("keeps the public founder profile list", () => {
    expect(FOUNDER_PROFILES.map((founder) => founder.name)).toEqual([
      "Florian Zainzinger",
    ]);
    expect(getFounderByRole("productAndTechnology").name).toBe(
      "Florian Zainzinger",
    );
  });
});
