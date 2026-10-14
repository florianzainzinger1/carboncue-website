import { expect, test } from "@playwright/test";

import { canonicalUrl, locales, localizedPath, localOrigin } from "./urls";

const pagePaths = ["", "/product", "/contact", "/privacy", "/imprint"] as const;

test("serves the English root and German tree directly and redirects legacy URLs permanently", async ({
  request,
}) => {
  const root = await request.get("/", { maxRedirects: 0 });
  expect(root.status()).toBe(200);
  const rootHtml = await root.text();
  expect(rootHtml).toContain('<html lang="en"');
  expect(rootHtml).toContain(`<link rel="canonical" href="${localOrigin}"/>`);

  const german = await request.get("/de", { maxRedirects: 0 });
  expect(german.status()).toBe(200);
  expect(await german.text()).toContain('<html lang="de"');

  for (const [from, to] of [
    ["/en", "/"],
    ["/en/product", "/product"],
    ["/en/privacy", "/privacy"],
    ["/index.html", "/"],
    ["/en/opengraph-image/social-card", "/opengraph-image/social-card"],
    ["/en/twitter-image/social-card", "/twitter-image/social-card"],
  ] as const) {
    const response = await request.get(from, { maxRedirects: 0 });

    expect(response.status(), from).toBe(308);
    expect(new URL(response.headers().location!, localOrigin).pathname).toBe(
      to,
    );
  }

  // Following the redirects ends on a 200 page without a loop.
  for (const from of ["/en", "/en/", "/en/contact", "/index.html"]) {
    const response = await request.get(from, { maxRedirects: 5 });

    expect(response.status(), from).toBe(200);
  }

  // The old temporary root redirect to /de is gone.
  expect(root.headers().location).toBeUndefined();
});

test("keeps the contact API reachable behind the root rewrite", async ({
  request,
}) => {
  const invalid = await request.post("/api/contact", {
    data: {},
    maxRedirects: 0,
  });

  expect(invalid.status()).toBe(400);
  expect(await invalid.json()).toEqual({
    ok: false,
    error: "invalid_payload",
  });
});

test("answers unknown paths with a real 404 and noindex", async ({
  request,
}) => {
  const unknownPaths = [
    "/xyz",
    "/fr",
    "/de/does-not-exist",
    "/product/nope",
    "/fr/opengraph-image/social-card",
    "/fr/twitter-image/social-card",
  ];

  // Upper-case locale segments are only asserted off Windows: the local
  // `next start` incremental cache resolves prerendered files through the
  // case-insensitive NTFS lookup, so /DE is first served from de.html and
  // its 404 revalidation then overwrites the German home page on disk.
  // Deployments (Linux) look prerenders up case-sensitively.
  if (process.platform !== "win32") {
    unknownPaths.push("/DE");
  }

  for (const path of unknownPaths) {
    const response = await request.get(path, { maxRedirects: 0 });

    expect(response.status(), path).toBe(404);

    if (response.headers()["content-type"]?.includes("text/html")) {
      expect(await response.text(), path).toMatch(
        /<meta name="robots" content="noindex"\/>/,
      );
    }
  }
});

test("serves the brand favicon and app icons and links them from every tree", async ({
  page,
  request,
}) => {
  for (const [path, type] of [
    ["/favicon.ico", /^image\//],
    ["/icon.png", /^image\/png/],
    ["/apple-icon.png", /^image\/png/],
  ] as const) {
    const response = await request.get(path, { maxRedirects: 0 });

    expect(response.status(), path).toBe(200);
    expect(response.headers()["content-type"], path).toMatch(type);
  }

  for (const path of ["/", "/de/product"]) {
    await page.goto(path);
    await expect(
      page.locator('head link[rel="icon"][href^="/favicon.ico"]'),
    ).toHaveCount(1);
    await expect(
      page.locator('head link[rel="icon"][href^="/icon.png"]'),
    ).toHaveCount(1);
    await expect(
      page.locator(
        'head link[rel="apple-touch-icon"][href^="/apple-icon.png"]',
      ),
    ).toHaveCount(1);
  }
});

test("every page has exactly one og:image and twitter:image that load without a redirect", async ({
  page,
  request,
}) => {
  const imageUrls = new Set<string>();

  for (const locale of locales) {
    for (const pagePath of pagePaths) {
      await page.goto(localizedPath(locale, pagePath));
      await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute(
        "href",
        canonicalUrl(locale, pagePath),
      );

      const openGraphImages = page.locator('head meta[property="og:image"]');
      const twitterImages = page.locator('head meta[name="twitter:image"]');

      await expect(openGraphImages).toHaveCount(1);
      await expect(twitterImages).toHaveCount(1);

      imageUrls.add((await openGraphImages.getAttribute("content"))!);
      imageUrls.add((await twitterImages.getAttribute("content"))!);
    }
  }

  // One Open Graph and one Twitter card per locale.
  expect(imageUrls.size).toBe(4);

  for (const imageUrl of imageUrls) {
    const response = await request.get(imageUrl, { maxRedirects: 0 });

    expect(response.status(), imageUrl).toBe(200);
    expect(response.headers()["content-type"], imageUrl).toContain("image/png");
    expect((await response.body()).byteLength, imageUrl).toBeGreaterThan(
      10_000,
    );
  }
});

test("sends X-Robots-Tag noindex on vercel.app hosts only", async ({
  playwright,
}) => {
  const previewHost = await playwright.request.newContext({
    baseURL: localOrigin,
    extraHTTPHeaders: { Host: "carboncue-git-branch-team.vercel.app" },
  });
  const customDomain = await playwright.request.newContext({
    baseURL: localOrigin,
    extraHTTPHeaders: { Host: "carboncue.eu" },
  });

  for (const path of ["/", "/de/product"]) {
    const preview = await previewHost.get(path, { maxRedirects: 0 });
    const production = await customDomain.get(path, { maxRedirects: 0 });

    expect(preview.headers()["x-robots-tag"], path).toBe("noindex");
    expect(production.status(), path).toBe(200);
    expect(production.headers()["x-robots-tag"], path).toBeUndefined();
  }

  await previewHost.dispose();
  await customDomain.dispose();
});
