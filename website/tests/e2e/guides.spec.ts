import { expect, test } from "@playwright/test";

import { localOrigin } from "./urls";

const guides = [
  {
    path: "/de/eu-ets/abgabefrist-sanktion",
    title: "EU-ETS-Abgabefrist 30. September: Sanktion je Tonne (DE/AT)",
    h1: "Abgabefrist 30. September: Was passiert, wenn Emissionsberechtigungen fehlen",
  },
  {
    path: "/de/eu-ets/freie-zuteilung-cbam-faktor",
    title: "Kostenlose Zuteilung & CBAM-Faktor 2026–2034: Werte je Jahr",
    h1: "Kostenlose Zuteilung und CBAM-Faktor 2026–2034",
  },
] as const;

const hub = {
  path: "/de/eu-ets",
  title: "EU-ETS-Wissen: Ratgeber zum Emissionshandel | CarbonCue",
  h1: "EU-ETS-Wissen",
} as const;

type JsonLd = Record<string, unknown> & { "@type": string };

async function readStructuredData(
  page: import("@playwright/test").Page,
): Promise<JsonLd[]> {
  const scripts = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();

  return scripts.map((text) => JSON.parse(text) as JsonLd);
}

test("serves the German hub and guides with German-only canonical metadata", async ({
  page,
}) => {
  for (const entry of [hub, ...guides]) {
    const response = await page.goto(entry.path);

    expect(response?.status(), entry.path).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "de");
    await expect(page).toHaveTitle(entry.title);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(entry.h1);
    await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${localOrigin}${entry.path}`,
    );

    const alternates = page.locator('head link[rel="alternate"][hreflang]');
    await expect(alternates).toHaveCount(1);
    await expect(alternates).toHaveAttribute("hreflang", "de");
    await expect(alternates).toHaveAttribute(
      "href",
      `${localOrigin}${entry.path}`,
    );
    await expect(
      page.locator('head meta[property="og:image"]'),
    ).toHaveAttribute(
      "content",
      `${localOrigin}/de/opengraph-image/social-card`,
    );
    await expect(page.locator('head meta[name="robots"]')).toHaveAttribute(
      "content",
      /index, follow/,
    );

    // A German-only page has no English counterpart: the switch leads home.
    await expect(
      page.getByRole("link", { name: "English", exact: true }),
    ).toHaveAttribute("href", "/");

    const breadcrumb = page.getByRole("navigation", {
      name: "Brotkrümelnavigation",
    });
    await expect(
      breadcrumb.getByRole("link", { name: "Startseite" }),
    ).toHaveAttribute("href", "/de");

    const structuredData = await readStructuredData(page);
    const breadcrumbList = structuredData.find(
      (item) => item["@type"] === "BreadcrumbList",
    );
    expect(breadcrumbList, entry.path).toBeDefined();
    expect(JSON.stringify(structuredData)).not.toContain("Organization");
    expect(JSON.stringify(structuredData)).not.toContain("FAQPage");
  }

  const hubImage = await page.request.get("/de/opengraph-image/social-card", {
    maxRedirects: 0,
  });
  expect(hubImage.status()).toBe(200);
});

test("renders each guide with its Stand line, sources, Article JSON-LD and cross links", async ({
  page,
}) => {
  for (const guide of guides) {
    await page.goto(guide.path);

    await expect(page.locator("[data-guide-updated]")).toHaveText(
      "Stand: 14. September 2026",
    );
    await expect(
      page.getByText("Verantwortlich: Florian Zainzinger"),
    ).toBeVisible();
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
      "content",
      "article",
    );

    // Every inline marker targets an existing source list entry.
    const markerTargets = await page
      .locator('main a[href^="#quelle-"]')
      .evaluateAll((links) =>
        links.map((link) => link.getAttribute("href")!.slice(1)),
      );
    expect(markerTargets.length).toBeGreaterThan(0);
    for (const id of new Set(markerTargets)) {
      await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
    }
    await expect(
      page
        .locator('li[id^="quelle-"] a[href^="https://"][rel="noopener"]')
        .first(),
    ).toBeVisible();
    await expect(page.getByText("Abgerufen am").first()).toBeVisible();
    await expect(page.locator("table caption").first()).toBeVisible();

    const structuredData = await readStructuredData(page);
    const article = structuredData.find((item) => item["@type"] === "Article");

    expect(article).toMatchObject({
      headline: guide.h1,
      inLanguage: "de",
      datePublished: "2026-09-14",
      dateModified: "2026-09-14",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${localOrigin}${guide.path}`,
      },
    });
    expect(article?.author).toEqual([
      {
        "@type": "Person",
        name: "Florian Zainzinger",
        sameAs: ["https://www.linkedin.com/in/florian-zainzinger-63650a259/"],
      },
    ]);
    expect(article?.publisher).toEqual(article?.author);

    const breadcrumbList = structuredData.find(
      (item) => item["@type"] === "BreadcrumbList",
    ) as { itemListElement: { item?: string }[] } | undefined;
    expect(breadcrumbList?.itemListElement.map((item) => item.item)).toEqual([
      `${localOrigin}/de`,
      `${localOrigin}/de/eu-ets`,
      `${localOrigin}${guide.path}`,
    ]);

    const other = guides.find((candidate) => candidate !== guide)!;
    const moreGuides = page.getByRole("navigation", {
      name: "Weitere Ratgeber",
    });
    await expect(
      moreGuides.getByRole("link", { name: other.h1 }),
    ).toHaveAttribute("href", other.path);
    await expect(
      moreGuides.getByRole("link", { name: "Alle Ratgeber im Überblick" }),
    ).toHaveAttribute("href", "/de/eu-ets");
  }

  await page.goto(hub.path);
  for (const guide of guides) {
    await expect(
      page.getByRole("main").getByRole("link", { name: guide.h1 }),
    ).toHaveAttribute("href", guide.path);
  }
});

test("links the hub from German navigation only", async ({ page }) => {
  await page.goto("/de");
  await expect(
    page
      .getByRole("navigation", { name: "Hauptnavigation" })
      .first()
      .getByRole("link", { name: "EU-ETS-Wissen", exact: true }),
  ).toHaveAttribute("href", "/de/eu-ets");
  await expect(
    page.locator("footer").getByRole("link", { name: "EU-ETS-Wissen" }),
  ).toHaveAttribute("href", "/de/eu-ets");

  await page.goto("/");
  await expect(page.locator('a[href*="eu-ets"]')).toHaveCount(0);
});

test("answers English and unprefixed guide URLs with 404 and no redirect loop", async ({
  request,
}) => {
  for (const path of [
    "/eu-ets",
    "/eu-ets/abgabefrist-sanktion",
    "/eu-ets/freie-zuteilung-cbam-faktor",
    "/de/eu-ets/does-not-exist",
  ]) {
    const response = await request.get(path, { maxRedirects: 0 });

    expect(response.status(), path).toBe(404);
    expect(await response.text(), path).toContain(
      '<meta name="robots" content="noindex"/>',
    );
  }

  for (const [from, to] of [
    ["/en/eu-ets", "/eu-ets"],
    ["/en/eu-ets/abgabefrist-sanktion", "/eu-ets/abgabefrist-sanktion"],
  ] as const) {
    const redirect = await request.get(from, { maxRedirects: 0 });

    expect(redirect.status(), from).toBe(308);
    expect(new URL(redirect.headers().location!, localOrigin).pathname).toBe(
      to,
    );

    // One hop to the unprefixed URL, which is a 404: no loop.
    const followed = await request.get(from, { maxRedirects: 5 });
    expect(followed.status(), from).toBe(404);
  }
});

test("keeps guide pages and the contact page free of horizontal overflow at 375px", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
  });
  const page = await context.newPage();

  for (const path of [
    hub.path,
    ...guides.map((guide) => guide.path),
    "/de/contact",
    "/contact",
  ]) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );

    expect(overflow, path).toBeLessThanOrEqual(0);
  }

  await context.close();
});

test("shows the founders section with a LinkedIn link on the contact page in both locales", async ({
  page,
}) => {
  const expectations = [
    {
      path: "/contact",
      heading: "Who is behind CarbonCue",
      roles: ["Co-founder · Product & Technology"],
      suffix: "on LinkedIn",
    },
    {
      path: "/de/contact",
      heading: "Wer hinter CarbonCue steht",
      roles: ["Mitgründer · Produkt & Technologie"],
      suffix: "auf LinkedIn",
    },
  ] as const;

  for (const expectation of expectations) {
    await page.goto(expectation.path);

    const section = page.locator('section[aria-labelledby="founders-title"]');
    await expect(
      section.getByRole("heading", { level: 2, name: expectation.heading }),
    ).toBeVisible();
    await expect(section.getByText("TU Wien")).toBeVisible();

    for (const role of expectation.roles) {
      await expect(section.getByText(role, { exact: true })).toBeVisible();
    }

    await expect(
      section.getByRole("link", {
        name: `Florian Zainzinger ${expectation.suffix}`,
      }),
    ).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/florian-zainzinger-63650a259/",
    );
    await expect(section.locator('a[rel="noopener"]')).toHaveCount(1);
  }
});
