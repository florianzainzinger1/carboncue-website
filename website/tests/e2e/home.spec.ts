import { expect, test } from "@playwright/test";

import { localizedPath } from "./urls";

const pagePaths = ["", "/product", "/contact", "/privacy", "/imprint"] as const;

test("has a logical keyboard order and visible focus", async ({ page }) => {
  await page.goto("/de");

  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Zum Inhalt springen" });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();

  const focusStyle = await skipLink.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      outlineStyle: style.outlineStyle,
      outlineWidth: Number.parseFloat(style.outlineWidth),
    };
  });

  expect(focusStyle.outlineStyle).not.toBe("none");
  expect(focusStyle.outlineWidth).toBeGreaterThanOrEqual(2);

  await page.reload();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "CarbonCue" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Start", exact: true }).first(),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Produkt", exact: true }).first(),
  ).toBeFocused();
});

test("has no horizontal overflow across pages and representative widths", async ({
  page,
}) => {
  for (const locale of ["de", "en"] as const) {
    for (const pagePath of pagePaths) {
      for (const viewport of [
        { width: 375, height: 812 },
        { width: 768, height: 1024 },
        { width: 1440, height: 1000 },
      ]) {
        await page.setViewportSize(viewport);
        await page.goto(localizedPath(locale, pagePath));

        const overflow = await page.evaluate(() => ({
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: document.documentElement.clientWidth,
        }));

        expect(overflow.documentWidth).toBeLessThanOrEqual(
          overflow.viewportWidth,
        );
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        await expect(
          page
            .getByRole("navigation", {
              name: /Hauptnavigation|Primary navigation/,
            })
            .first(),
        ).toBeVisible();
      }
    }
  }
});

test("renders every page without JavaScript and honors reduced motion", async ({
  browser,
  page,
}) => {
  const noJavaScriptContext = await browser.newContext({
    javaScriptEnabled: false,
  });
  const noJavaScriptPage = await noJavaScriptContext.newPage();

  for (const locale of ["de", "en"] as const) {
    for (const pagePath of pagePaths) {
      await noJavaScriptPage.goto(localizedPath(locale, pagePath));
      await expect(
        noJavaScriptPage.getByRole("heading", { level: 1 }),
      ).toBeVisible();
      await expect(noJavaScriptPage.getByRole("main")).toBeVisible();
    }
  }
  await noJavaScriptContext.close();

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/de");

  const transitionDuration = await page
    .getByRole("banner")
    .getByRole("link", { name: "15-Minuten Erstgespräch anfragen" })
    .evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).transitionDuration),
    );

  expect(transitionDuration).toBeLessThanOrEqual(0.001);
});

test("publishes the contact form and the configured imprint address", async ({
  page,
}) => {
  for (const locale of ["de", "en"] as const) {
    for (const route of ["contact"] as const) {
      await page.goto(localizedPath(locale, `/${route}`));
      await expect(page.locator("form")).toBeVisible();
      await expect(page.locator('a[href*="calendly.com"]')).toHaveCount(0);
    }
  }

  await page.goto("/de/imprint");
  await expect(
    page.getByText("<address on the live website>, <postal code> <city>"),
  ).toBeVisible();

  await page.goto("/imprint");
  await expect(
    page.getByText("<address on the live website>, <postal code> <city>"),
  ).toBeVisible();
});
