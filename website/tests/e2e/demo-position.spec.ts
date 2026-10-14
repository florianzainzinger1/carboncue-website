import { expect, test } from "@playwright/test";

import { localizedPath } from "./urls";

const localeExpectations = {
  de: {
    stagesLabel: "Bedarf, Deckung, Lücke und Budget",
    equationHeadings: ["Bedarf", "Vorhandene Deckung", "Ungedeckte Lücke"],
    budgetHeading: "Das offene Beschaffungsbudget",
    provenanceText: "Industrieanlage",
  },
  en: {
    stagesLabel: "Requirement, coverage, gap and budget",
    equationHeadings: ["Requirement", "Existing coverage", "Uncovered gap"],
    budgetHeading: "The open procurement budget",
    provenanceText: "Industrial installation",
  },
} as const;

test("renders the worked example as an equation without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  for (const locale of ["de", "en"] as const) {
    const expected = localeExpectations[locale];
    await page.goto(localizedPath(locale, "/product"));

    const demo = page.locator("#demo-position");
    await expect(demo).toHaveAttribute("data-demo-status", "demo");
    await expect(
      demo.getByRole("list", { name: expected.stagesLabel }),
    ).toBeVisible();

    // Three terms plus the highlighted budget result.
    await expect(demo.locator("[data-demo-stage]")).toHaveCount(4);
    // The minus and equals signs that make it read as one calculation.
    await expect(demo.locator("[data-demo-operator]")).toHaveCount(2);

    for (const heading of [
      ...expected.equationHeadings,
      expected.budgetHeading,
    ]) {
      await expect(
        demo.getByRole("heading", { level: 3, name: heading, exact: true }),
      ).toBeVisible();
    }

    // Provenance is one line, not a panel of model metadata.
    await expect(
      demo.getByText(expected.provenanceText, { exact: false }),
    ).toBeVisible();
    await expect(demo.locator("#demo-provenance-title")).toHaveCount(0);
  }

  await context.close();
});

test("formats the same underlying figures for the active locale", async ({
  page,
}) => {
  await page.goto("/de/product");
  const germanObligation = page.locator('[data-demo-value="obligation"]');
  const germanGap = page.locator('[data-demo-value="gap"]');
  const germanPrice = page.locator('[data-demo-value="price"]');
  const germanBudget = page.locator('[data-demo-value="budget"]');

  await expect(germanObligation).toHaveAttribute("data-raw-value", "125000");
  await expect(germanObligation).toContainText("125.000 EUA");
  await expect(germanGap).toHaveAttribute("data-raw-value", "45000");
  await expect(germanGap).toContainText("45.000 EUA");
  await expect(germanPrice).toHaveAttribute("data-raw-value", "8750");
  await expect(germanPrice).toContainText("87,50");
  await expect(germanBudget).toHaveAttribute("data-raw-value", "393750000");
  await expect(germanBudget).toContainText("3.937.500,00");

  await page.goto("/product");
  const englishObligation = page.locator('[data-demo-value="obligation"]');
  const englishGap = page.locator('[data-demo-value="gap"]');
  const englishPrice = page.locator('[data-demo-value="price"]');
  const englishBudget = page.locator('[data-demo-value="budget"]');

  await expect(englishObligation).toHaveAttribute("data-raw-value", "125000");
  await expect(englishObligation).toContainText("125,000 EUA");
  await expect(englishGap).toHaveAttribute("data-raw-value", "45000");
  await expect(englishGap).toContainText("45,000 EUA");
  await expect(englishPrice).toHaveAttribute("data-raw-value", "8750");
  await expect(englishPrice).toContainText("87.50");
  await expect(englishBudget).toHaveAttribute("data-raw-value", "393750000");
  await expect(englishBudget).toContainText("3,937,500.00");
});
