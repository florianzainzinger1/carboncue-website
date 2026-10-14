import { expect, test } from "@playwright/test";

import { dictionaries } from "../../src/content/dictionaries";
import { canonicalUrl, locales, localizedPath, localOrigin } from "./urls";

const headerNavigation = {
  de: [
    ["Start", ""],
    ["Produkt", "/product"],
    ["Kontakt", "/contact"],
  ],
  en: [
    ["Home", ""],
    ["Product", "/product"],
    ["Contact", "/contact"],
  ],
} as const;

const footerLegalNavigation = {
  de: [
    ["Datenschutz", "/privacy"],
    ["Impressum", "/imprint"],
  ],
  en: [
    ["Privacy", "/privacy"],
    ["Imprint", "/imprint"],
  ],
} as const;

const pagePaths = [
  { path: "", pageKey: "home" },
  { path: "/product", pageKey: "product" },
  { path: "/contact", pageKey: "contact" },
  { path: "/privacy", pageKey: "privacy" },
  { path: "/imprint", pageKey: "imprint" },
] as const;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function urlEndsWith(path: string): RegExp {
  return new RegExp(`${escapeRegExp(localOrigin)}${escapeRegExp(path)}$`);
}

test("serves English at the root and German under /de without language inference", async ({
  browser,
}) => {
  const context = await browser.newContext({
    extraHTTPHeaders: { "Accept-Language": "de-AT,de;q=0.9" },
  });
  const page = await context.newPage();

  // A German browser still gets English at the root: no Accept-Language
  // redirect.
  const rootResponse = await page.goto("/");
  expect(rootResponse?.status()).toBe(200);
  await expect(page).toHaveURL(urlEndsWith("/"));
  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  await page.goto("/de");
  await expect(page).toHaveURL(urlEndsWith("/de"));
  await expect(page.locator("html")).toHaveAttribute("lang", "de");

  // Prefixed English URLs are duplicates and land on the unprefixed page.
  await page.goto("/en/product");
  await expect(page).toHaveURL(urlEndsWith("/product"));
  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  expect(await context.cookies()).toEqual([]);
  await context.close();
});

test("navigation reaches all pages in both locales", async ({ page }) => {
  for (const locale of locales) {
    await page.goto(localizedPath(locale, ""));

    for (const [label, path] of headerNavigation[locale]) {
      const primaryNavigation = page
        .getByRole("navigation", {
          name: locale === "de" ? "Hauptnavigation" : "Primary navigation",
        })
        .first();
      const link = primaryNavigation.getByRole("link", {
        name: label,
        exact: true,
      });

      await expect(link).toHaveAttribute("href", localizedPath(locale, path));
      await link.click();
      await expect(page).toHaveURL(urlEndsWith(localizedPath(locale, path)));
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }

    for (const [label, path] of footerLegalNavigation[locale]) {
      const footer = page.locator("footer");
      const link = footer.getByRole("link", {
        name: label,
        exact: true,
      });

      await expect(link).toHaveAttribute("href", localizedPath(locale, path));
      await link.click();
      await expect(page).toHaveURL(urlEndsWith(localizedPath(locale, path)));
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }

    const logoLink = page.getByRole("banner").getByRole("link", {
      name: "CarbonCue",
    });
    await expect(logoLink).toHaveAttribute("href", localizedPath(locale, ""));
  }
});

test("language switch preserves a deep page in both directions without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto("/de/privacy");
  const englishLink = page.getByRole("link", { name: "English", exact: true });
  await expect(englishLink).toHaveAttribute("href", "/privacy");
  await englishLink.click();
  await expect(page).toHaveURL(urlEndsWith("/privacy"));
  await expect(
    page.getByRole("heading", { name: "Data Protection Notice" }),
  ).toBeVisible();

  const germanLink = page.getByRole("link", { name: "Deutsch", exact: true });
  await expect(germanLink).toHaveAttribute("href", "/de/privacy");
  await germanLink.click();
  await expect(page).toHaveURL(urlEndsWith("/de/privacy"));
  await expect(
    page.getByRole("heading", { name: "Datenschutzhinweise" }),
  ).toBeVisible();

  await page.goto("/de");
  await expect(
    page.getByRole("link", { name: "English", exact: true }),
  ).toHaveAttribute("href", "/");

  await context.close();
});

test("emits complete locale-aware metadata on every page", async ({ page }) => {
  for (const locale of locales) {
    for (const { path, pageKey } of pagePaths) {
      const messages = dictionaries[locale][pageKey].metadata;
      await page.goto(localizedPath(locale, path));

      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page).toHaveTitle(messages.title);
      await expect(
        page.locator('head meta[name="description"]'),
      ).toHaveAttribute("content", messages.description);
      await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute(
        "href",
        canonicalUrl(locale, path),
      );
      await expect(
        page.locator('head link[rel="alternate"][hreflang="de"]'),
      ).toHaveAttribute("href", canonicalUrl("de", path));
      await expect(
        page.locator('head link[rel="alternate"][hreflang="en"]'),
      ).toHaveAttribute("href", canonicalUrl("en", path));
      await expect(
        page.locator('head link[rel="alternate"][hreflang="x-default"]'),
      ).toHaveAttribute("href", canonicalUrl("en", path));
      await expect(
        page.locator('head meta[property="og:title"]'),
      ).toHaveAttribute("content", messages.title);
      await expect(
        page.locator('head meta[property="og:description"]'),
      ).toHaveAttribute("content", messages.description);
      await expect(
        page.locator('head meta[property="og:locale"]'),
      ).toHaveAttribute("content", locale === "de" ? "de_AT" : "en_GB");
      await expect(
        page.locator('head meta[property="og:url"]'),
      ).toHaveAttribute("content", canonicalUrl(locale, path));
      await expect(
        page.locator('head meta[name="twitter:card"]'),
      ).toHaveAttribute("content", "summary_large_image");
      await expect(page.locator('head meta[name="robots"]')).toHaveAttribute(
        "content",
        /index, follow/,
      );

      const structuredData = page.locator('script[type="application/ld+json"]');

      if (pageKey !== "home") {
        // The WebSite entity is emitted on the two home pages only.
        await expect(structuredData).toHaveCount(0);
        continue;
      }

      await expect(structuredData).toHaveCount(1);
      const structuredDataText = await structuredData.textContent();
      const parsed = JSON.parse(structuredDataText!);

      expect(parsed["@type"]).toBe("WebSite");
      expect(parsed.url).toBe(`${localOrigin}/`);
      expect(parsed.alternateName).toBe("carboncue.eu");
      expect(parsed.inLanguage).toBe(locale);
      expect(parsed.publisher).toEqual([
        {
          "@type": "Person",
          name: "Florian Zainzinger",
          sameAs: ["https://www.linkedin.com/in/florian-zainzinger-63650a259/"],
        },
      ]);
      expect(structuredDataText).not.toContain("Organization");
    }
  }
});

test("serves both locale trees in the sitemap and an indexable local robots policy", async ({
  request,
}) => {
  const sitemapResponse = await request.get("/sitemap.xml");
  const sitemap = await sitemapResponse.text();

  expect(sitemapResponse.ok()).toBe(true);
  // five pages in two locales, plus the German-only hub and two guides
  expect(sitemap.match(/<url>/g)).toHaveLength(13);
  expect(sitemap.match(/<lastmod>2026-09-14<\/lastmod>/g)).toHaveLength(13);
  expect(sitemap).toContain(`<loc>${localOrigin}/de/eu-ets</loc>`);
  expect(sitemap).toContain(
    `<loc>${localOrigin}/de/eu-ets/abgabefrist-sanktion</loc>`,
  );
  expect(sitemap).toContain(
    `<loc>${localOrigin}/de/eu-ets/freie-zuteilung-cbam-faktor</loc>`,
  );
  expect(sitemap).not.toContain(`<loc>${localOrigin}/eu-ets`);
  expect(sitemap).toContain(`<loc>${localOrigin}/de/privacy</loc>`);
  expect(sitemap).toContain(`<loc>${localOrigin}/privacy</loc>`);
  expect(sitemap).toContain(`<loc>${localOrigin}/</loc>`);
  expect(sitemap).not.toContain(`${localOrigin}/en`);
  expect(sitemap).toContain(
    `hreflang="x-default" href="${localOrigin}/privacy"`,
  );

  const robotsResponse = await request.get("/robots.txt");
  const robots = await robotsResponse.text();

  expect(robotsResponse.ok()).toBe(true);
  expect(robots).toContain("User-Agent: *");
  expect(robots).toContain("Allow: /");
  expect(robots).toContain(`Sitemap: ${localOrigin}/sitemap.xml`);
  expect(robots).not.toMatch(/^Host:/im);
});
