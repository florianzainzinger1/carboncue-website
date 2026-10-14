import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { localizedPath, localOrigin } from "./urls";

const pages = [
  { path: "", key: "home" },
  { path: "/product", key: "product" },
  { path: "/contact", key: "contact" },
  { path: "/privacy", key: "privacy" },
  { path: "/imprint", key: "imprint" },
] as const;

/** German-only pages: the EU-ETS-Wissen hub and its guides. */
const germanOnlyPaths = [
  "/de/eu-ets",
  "/de/eu-ets/abgabefrist-sanktion",
  "/de/eu-ets/freie-zuteilung-cbam-faktor",
] as const;

const visits = [
  ...(["de", "en"] as const).flatMap((locale) =>
    pages.map((route) => ({
      locale,
      url: localizedPath(locale, route.path),
      key: `${locale}/${route.key}`,
    })),
  ),
  ...germanOnlyPaths.map((url) => ({
    locale: "de" as const,
    url,
    key: url,
  })),
];

test("every page renders in both locales, passes axe, and makes no external-origin request", async ({
  page,
}) => {
  // Ten route visits, each with a networkidle wait and a full axe scan,
  // share one test budget. The sweep sat near the default 30s ceiling as the
  // pages grew and tips over it under parallel-worker load, so it gets the
  // tripled slow-test budget.
  test.slow();

  const externalRequests: string[] = [];

  page.on("request", (request) => {
    const requestUrl = new URL(request.url());

    if (requestUrl.origin !== localOrigin) {
      externalRequests.push(request.url());
    }
  });

  for (const visit of visits) {
    externalRequests.length = 0;
    await page.goto(visit.url);
    await page.waitForLoadState("networkidle");

    await expect(page.locator("html")).toHaveAttribute("lang", visit.locale);
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.locator("main")).toHaveAttribute("id", "main-content");

    const accessibilityScan = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(accessibilityScan.violations, `${visit.key} axe violations`).toEqual(
      [],
    );
    expect(externalRequests, `${visit.key} external requests`).toEqual([]);
  }

  expect(
    await page.evaluate(async () => {
      await document.fonts.ready;
      return document.fonts.check('16px "IBM Plex Sans Variable"');
    }),
  ).toBe(true);
});

test("product examples are labelled and every synthetic figure sits under a DEMO badge", async ({
  page,
}) => {
  const exampleLabel = { de: "Beispiel", en: "Example" } as const;

  for (const locale of ["de", "en"] as const) {
    await page.goto(localizedPath(locale, "/product"));

    // The six workflow cards carry narrative examples, marked by their own
    // "Beispiel"/"Example" label rather than a DEMO pill.
    const stages = page.locator("[data-product-stage]");
    await expect(stages).toHaveCount(6);

    for (let index = 0; index < 6; index += 1) {
      await expect(
        stages.nth(index).getByText(exampleLabel[locale], { exact: true }),
      ).toBeVisible();
      await expect(
        stages.nth(index).locator('[data-data-status="demo"]'),
      ).toHaveCount(0);
    }

    // The worked calculation is the section that carries actual figures, so it
    // keeps a visible DEMO badge and the illustrative-figures footnote.
    const demo = page.locator("#demo-position");
    await expect(demo.locator('[data-data-status="demo"]')).toHaveCount(1);
    await expect(demo.getByText("DEMO", { exact: true })).toBeVisible();
    await expect(demo.getByText(/^\*/)).toBeVisible();
  }
});

test("every internal link resolves without an error", async ({
  page,
  request,
}) => {
  const internalLinks = new Set<string>();

  for (const visit of visits) {
    await page.goto(visit.url);

    for (const href of await page
      .locator('a[href^="/"]')
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")))) {
      if (href) {
        internalLinks.add(href);
      }
    }
  }

  // The German-only guide pages are reachable through internal links.
  for (const path of germanOnlyPaths) {
    expect(internalLinks.has(path), path).toBe(true);
  }

  expect(internalLinks.size).toBeGreaterThanOrEqual(10);

  for (const href of internalLinks) {
    // Internal links must point at final URLs: no error and no redirect hop
    // (for example a stale /en/... link bouncing to the unprefixed URL).
    const response = await request.get(href, { maxRedirects: 0 });
    expect(response.status(), href).toBeLessThan(300);
  }
});
