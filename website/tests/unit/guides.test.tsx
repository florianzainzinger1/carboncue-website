import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ContactPageContent } from "../../src/app/[locale]/contact/page";
import { GuideHubContent } from "../../src/app/[locale]/eu-ets/page";
import { GuideArticle } from "../../src/app/[locale]/eu-ets/[slug]/page";
import { SiteShell } from "../../src/components/layout/site-shell";
import {
  createBreadcrumbStructuredData,
  createGuideArticleStructuredData,
  getGuideBreadcrumbSteps,
  getHubBreadcrumbSteps,
} from "../../src/components/metadata/guide-structured-data";
import { dictionaries } from "../../src/content/dictionaries";
import {
  formatGermanLongDate,
  formatGermanNumericDate,
  guideHubCopy,
} from "../../src/content/de/guides/hub";
import { FOUNDER_PROFILES } from "../../src/content/founders";
import {
  collectGuideTexts,
  getGuideBySlug,
  getGuideDocumentTitle,
  getGuideHubPath,
  getGuidePath,
  GUIDES,
  splitSourceMarkers,
  stripSourceMarkers,
} from "../../src/content/guides/registry";
import { getSiteUrlConfiguration } from "../../src/content/site";
import { createPageMetadata } from "../../src/lib/metadata/page-metadata";
import {
  BILINGUAL_SITEMAP_ENTRIES,
  SINGLE_LOCALE_SITEMAP_ENTRIES,
} from "../../src/lib/metadata/sitemap-entries";
import { createSitemap } from "../../src/app/sitemap";

const productionConfiguration = getSiteUrlConfiguration(
  { CARBONCUE_DEPLOYMENT_ENV: "production" },
  { status: "configured", url: "https://carboncue.eu" },
);
const previewConfiguration = getSiteUrlConfiguration({
  CARBONCUE_BUILD_DEPLOYMENT_ENV: "preview",
});

function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);

  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

function isNotInFuture(value: string): boolean {
  const today = new Date().toISOString().slice(0, 10);

  return value <= today;
}

describe("guide registry and content rules", () => {
  it("registers German-only guides with unique kebab-case slugs", () => {
    const slugs = GUIDES.map((guide) => guide.slug);

    expect(slugs.length).toBeGreaterThanOrEqual(2);
    expect(new Set(slugs).size).toBe(slugs.length);

    for (const guide of GUIDES) {
      expect(guide.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(guide.content.slug).toBe(guide.slug);
      expect(guide.locale).toBe("de");
      expect(getGuideBySlug(guide.slug)).toBe(guide);
    }

    expect(getGuideBySlug("does-not-exist")).toBeUndefined();
  });

  it("uses valid ISO dates that are not in the future", () => {
    const dates = [
      guideHubCopy.updatedOn,
      ...GUIDES.flatMap((guide) => [
        guide.publishedOn,
        guide.updatedOn,
        ...guide.content.sources.map((source) => source.retrievedOn),
      ]),
    ];

    for (const date of dates) {
      expect(isValidIsoDate(date), date).toBe(true);
      expect(isNotInFuture(date), date).toBe(true);
    }

    for (const guide of GUIDES) {
      expect(guide.publishedOn <= guide.updatedOn).toBe(true);
    }
  });

  it("keeps meta titles within 60 and descriptions within 70 to 155 characters", () => {
    const pages = [
      {
        name: "hub",
        title: getGuideDocumentTitle(guideHubCopy.metaTitle),
        description: guideHubCopy.metaDescription,
      },
      ...GUIDES.map((guide) => ({
        name: guide.slug,
        title: getGuideDocumentTitle(guide.content.metaTitle),
        description: guide.content.metaDescription,
      })),
    ];

    for (const page of pages) {
      expect(page.title.length, page.name).toBeLessThanOrEqual(60);
      expect(page.description.length, page.name).toBeGreaterThanOrEqual(70);
      expect(page.description.length, page.name).toBeLessThanOrEqual(155);
    }
  });

  it("adds the brand to a title only while the title stays within 60 characters", () => {
    expect(getGuideDocumentTitle("Kurz")).toBe("Kurz | CarbonCue");
    expect(getGuideDocumentTitle("x".repeat(48))).toBe(
      `${"x".repeat(48)} | CarbonCue`,
    );
    expect(getGuideDocumentTitle("x".repeat(49))).toBe("x".repeat(49));
  });

  it("resolves every [n] marker to a source with an https URL and retrieval date", () => {
    for (const guide of GUIDES) {
      const sourceIds = guide.content.sources.map((source) => source.id);

      expect(new Set(sourceIds).size, guide.slug).toBe(sourceIds.length);
      expect(sourceIds, guide.slug).toEqual(
        sourceIds.map((_, index) => index + 1),
      );

      for (const source of guide.content.sources) {
        expect(new URL(source.url).protocol, source.url).toBe("https:");
        expect(isValidIsoDate(source.retrievedOn)).toBe(true);
        expect(source.label.trim()).not.toBe("");
        expect(source.publisher.trim()).not.toBe("");
      }

      const referenced = new Set<number>();

      for (const text of collectGuideTexts(guide.content)) {
        for (const part of splitSourceMarkers(text)) {
          if (typeof part === "number") {
            expect(sourceIds, `${guide.slug}: [${part}]`).toContain(part);
            referenced.add(part);
          }
        }
      }

      // Every listed source is cited somewhere in the guide.
      expect(
        [...referenced].sort((a, b) => a - b),
        guide.slug,
      ).toEqual(sourceIds);
    }
  });

  it("keeps internal verification notes out of the published content", () => {
    for (const guide of GUIDES) {
      expect(guide.content).not.toHaveProperty("verificationNotes");
      expect(JSON.stringify(guide.content)).not.toMatch(
        /WebFetch|Reviewer|verificationNotes/,
      );
    }
  });

  it("splits and strips source markers", () => {
    expect(splitSourceMarkers("Frist [2][9].")).toEqual(["Frist ", 2, 9, "."]);
    expect(stripSourceMarkers("Frist [2][9]. Weiter [1]")).toBe(
      "Frist. Weiter",
    );
  });

  it("formats German dates without Intl", () => {
    expect(formatGermanLongDate("2026-09-14")).toBe("14. September 2026");
    expect(formatGermanLongDate("2026-03-01")).toBe("1. März 2026");
    expect(formatGermanNumericDate("2026-09-14")).toBe("14.09.2026");
  });
});

describe("guide pages", () => {
  it("renders the article with breadcrumb, one h1, key facts, tables, FAQ, sources and disclaimer", () => {
    const guide = GUIDES[0];
    const markup = renderToStaticMarkup(<GuideArticle guide={guide} />);

    expect(markup.match(/<h1[\s>]/g)).toHaveLength(1);
    expect(markup).toContain(guide.content.h1);
    expect(markup).toContain('aria-label="Brotkrümelnavigation"');
    expect(markup).toContain('href="/de"');
    expect(markup).toContain('href="/de/eu-ets"');
    expect(markup).toContain('aria-current="page"');
    expect(markup).toContain("Stand:");
    expect(markup).toContain("14. September 2026");
    expect(markup).toContain("Verantwortlich: Florian Zainzinger");
    expect(markup).toContain("<caption");
    expect(markup).toContain('scope="col"');
    expect(markup).toContain('scope="row"');
    expect(markup).toContain('href="#quelle-1"');
    expect(markup).toContain('id="quelle-14"');
    expect(markup).toContain('rel="noopener"');
    expect(markup).toContain("Abgerufen am");
    expect(markup).toContain(guide.content.faq[0]!.question);
    expect(markup).not.toContain("FAQPage");
    expect(markup).toContain("keine Rechts-, Steuer- oder Anlageberatung");
    expect(markup).toContain(`href="${getGuidePath(GUIDES[1].slug)}"`);
  });

  it("renders the hub with a card per guide", () => {
    const markup = renderToStaticMarkup(<GuideHubContent />);

    expect(markup.match(/<h1[\s>]/g)).toHaveLength(1);
    expect(markup).toContain("EU-ETS-Wissen");

    for (const guide of GUIDES) {
      expect(markup).toContain(`href="${getGuidePath(guide.slug)}"`);
      expect(markup).toContain(guide.content.h1);
    }

    expect(markup).not.toMatch(/\[\d+\]/);
  });

  it("adds the hub link to the German navigation only", () => {
    const german = renderToStaticMarkup(
      <SiteShell dictionary={dictionaries.de} locale="de" pagePath="/">
        <p>body</p>
      </SiteShell>,
    );
    const english = renderToStaticMarkup(
      <SiteShell dictionary={dictionaries.en} locale="en" pagePath="/">
        <p>body</p>
      </SiteShell>,
    );

    expect(german).toContain('href="/de/eu-ets"');
    expect(german).toContain(`href="${getGuidePath(GUIDES[0].slug)}"`);
    expect(english).not.toContain("eu-ets");
  });

  it("points the language switch of a German-only page at the English home", () => {
    const markup = renderToStaticMarkup(
      <SiteShell
        dictionary={dictionaries.de}
        locale="de"
        alternateHrefs={{ de: getGuideHubPath() }}
        activeNavigationPath="/eu-ets"
      >
        <p>body</p>
      </SiteShell>,
    );

    expect(markup).toContain('href="/" hrefLang="en"');
  });
});

describe("guide metadata, structured data and sitemap", () => {
  it("emits a canonical, a German-only hreflang and Open Graph article data", () => {
    const guide = GUIDES[1];
    const metadata = createPageMetadata({
      locale: "de",
      localizedPaths: { de: getGuidePath(guide.slug) },
      messages: {
        title: guide.content.metaTitle,
        description: guide.content.metaDescription,
      },
      article: {
        publishedTime: guide.publishedOn,
        modifiedTime: guide.updatedOn,
        authors: ["Florian Zainzinger"],
      },
      siteConfiguration: productionConfiguration,
    });
    const canonical = `https://carboncue.eu/de/eu-ets/${guide.slug}`;

    expect(metadata.alternates).toEqual({
      canonical,
      languages: { de: canonical },
    });
    expect(metadata.openGraph).toMatchObject({
      type: "article",
      publishedTime: "2026-09-14",
      modifiedTime: "2026-09-14",
      url: canonical,
      locale: "de_AT",
    });
    expect(metadata.openGraph).not.toHaveProperty("alternateLocale");
    expect(metadata.openGraph?.images).toEqual([
      expect.objectContaining({ url: "/de/opengraph-image/social-card" }),
    ]);
  });

  it("builds Article JSON-LD with Person authors and publishers and no Organization", () => {
    const guide = GUIDES[0];
    const article = createGuideArticleStructuredData(
      guide,
      productionConfiguration,
    );
    const persons = FOUNDER_PROFILES.map((founder) => ({
      "@type": "Person",
      name: founder.name,
      sameAs: [founder.linkedInUrl],
    }));

    expect(article).toMatchObject({
      "@type": "Article",
      headline: guide.content.h1,
      description: guide.content.metaDescription,
      inLanguage: "de",
      datePublished: "2026-09-14",
      dateModified: "2026-09-14",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://carboncue.eu/de/eu-ets/${guide.slug}`,
      },
      image: ["https://carboncue.eu/de/opengraph-image/social-card"],
    });
    expect(article.author).toEqual(persons);
    expect(article.publisher).toEqual(persons);
    expect(JSON.stringify(article)).not.toContain("Organization");

    const preview = createGuideArticleStructuredData(
      guide,
      previewConfiguration,
    );
    expect(preview).not.toHaveProperty("mainEntityOfPage");
    expect(JSON.stringify(preview)).not.toContain('"@id"');
    expect(preview).not.toHaveProperty("image");
    expect(JSON.stringify(preview)).not.toContain("opengraph-image");
  });

  it("builds BreadcrumbList JSON-LD for hub and guides and omits URLs on previews", () => {
    const guide = GUIDES[0];
    const breadcrumb = createBreadcrumbStructuredData(
      getGuideBreadcrumbSteps(guide),
      productionConfiguration,
    );

    expect(breadcrumb.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Startseite",
        item: "https://carboncue.eu/de",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "EU-ETS-Wissen",
        item: "https://carboncue.eu/de/eu-ets",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: guide.content.h1,
        item: `https://carboncue.eu/de/eu-ets/${guide.slug}`,
      },
    ]);

    const hubPreview = createBreadcrumbStructuredData(
      getHubBreadcrumbSteps(),
      previewConfiguration,
    );
    expect(hubPreview.itemListElement).toHaveLength(2);
    expect(JSON.stringify(hubPreview)).not.toContain('"item"');
  });

  it("lists the hub and every guide once in the sitemap without alternates", () => {
    const sitemap = createSitemap(productionConfiguration);
    const germanOnly = sitemap.slice(BILINGUAL_SITEMAP_ENTRIES.length * 2);

    expect(SINGLE_LOCALE_SITEMAP_ENTRIES).toHaveLength(GUIDES.length + 1);
    expect(sitemap).toHaveLength(10 + GUIDES.length + 1);
    expect(germanOnly).toEqual([
      { url: "https://carboncue.eu/de/eu-ets", lastModified: "2026-09-14" },
      ...GUIDES.map((guide) => ({
        url: `https://carboncue.eu/de/eu-ets/${guide.slug}`,
        lastModified: guide.updatedOn,
      })),
    ]);
    expect(sitemap.map((entry) => entry.url)).not.toContain(
      "https://carboncue.eu/eu-ets",
    );
    expect(createSitemap(previewConfiguration)).toEqual([]);
  });
});

describe("contact founders section", () => {
  it.each([
    [
      "en",
      "Who is behind CarbonCue",
      "Co-founder · Product &amp; Technology",
      "Florian Zainzinger on LinkedIn",
      "TU Wien",
    ],
    [
      "de",
      "Wer hinter CarbonCue steht",
      "Mitgründer · Produkt &amp; Technologie",
      "Florian Zainzinger auf LinkedIn",
      "TU Wien",
    ],
  ] as const)(
    "renders the founder with role and LinkedIn link in %s",
    (locale, title, productRole, linkText, university) => {
      const markup = renderToStaticMarkup(
        <ContactPageContent messages={dictionaries[locale].contact} />,
      );

      expect(markup).toContain('id="founders-title"');
      expect(markup).toContain(title);
      expect(markup).toContain(university);
      expect(markup).toContain("Florian Zainzinger");
      expect(markup).toContain(productRole);
      expect(markup).toContain(linkText);
      expect(markup).toContain(
        'href="https://www.linkedin.com/in/florian-zainzinger-63650a259/" rel="noopener"',
      );
      expect(markup).not.toContain("nofollow");
      // The founders section follows the form and the confidentiality note.
      expect(markup.indexOf('id="founders-title"')).toBeGreaterThan(
        markup.indexOf("<form"),
      );
    },
  );
});
