import { expect, test } from "@playwright/test";

/**
 * The dual-mode EUA calculator: deficit mode prices the uncovered volume as
 * procurement plus conditional penalty; surplus mode reads the identical
 * t × price product as the calculated equivalent value of the holdings.
 * Defaults are 5,000 t at 85 €.
 */

test("toggles between deficit risk and surplus asset readings", async ({
  page,
}) => {
  await page.goto("/de");
  const calculator = page.locator("#eua-terminal");
  await calculator.scrollIntoViewIfNeeded();

  // Deficit is the default: procurement, conditional penalty, and the
  // combined miss-the-deadline figure are all present.
  await expect(
    calculator.getByRole("radio", { name: "Deckungslücke" }),
  ).toBeChecked();
  await expect(calculator.getByText("Beschaffungsbedarf")).toBeVisible();
  await expect(calculator.getByText("425.000 €").first()).toBeVisible();
  await expect(calculator.getByText("Zusätzliche Strafzahlung")).toBeVisible();
  await expect(calculator.getByText("+ 500.000 €")).toBeVisible();
  await expect(calculator.getByText("925.000 €")).toBeVisible();

  // Switch to surplus: the same volume and price read as bound capital; no
  // penalty framing survives the switch, and the note carries no sale
  // recommendation.
  // Click the visible label: the radio itself is sr-only, so its styled
  // label is the real pointer target, exactly as for a user.
  await calculator.getByText("Überschuss", { exact: true }).click();
  await expect(
    calculator.getByRole("radio", { name: "Überschuss" }),
  ).toBeChecked();
  await expect(
    calculator.getByText("Was ist Ihr Überschuss wert?"),
  ).toBeVisible();
  await expect(calculator.getByText("Überschussmenge")).toBeVisible();
  await expect(calculator.getByText("Rechnerischer Gegenwert")).toBeVisible();
  await expect(calculator.getByText("425.000 €")).toBeVisible();
  await expect(calculator.getByText("Strafzahlung")).toHaveCount(0);
  await expect(calculator.getByText("925.000 €")).toHaveCount(0);
  await expect(
    calculator.getByText("ohne Verkaufsempfehlung", { exact: false }),
  ).toBeVisible();

  // The DEMO badge stays in both modes.
  await expect(calculator.getByText("DEMO").first()).toBeVisible();

  // And back: the deficit reading returns.
  await calculator.getByText("Deckungslücke", { exact: true }).click();
  await expect(calculator.getByText("Zusätzliche Strafzahlung")).toBeVisible();
});

test("the mode switch works with the keyboard", async ({ page }) => {
  await page.goto("/de");
  const calculator = page.locator("#eua-terminal");
  await calculator.scrollIntoViewIfNeeded();

  await calculator.getByRole("radio", { name: "Deckungslücke" }).focus();
  await page.keyboard.press("ArrowRight");

  await expect(
    calculator.getByRole("radio", { name: "Überschuss" }),
  ).toBeChecked();
  await expect(calculator.getByText("Rechnerischer Gegenwert")).toBeVisible();
});

test("the surplus reading is translated on the English tree", async ({
  page,
}) => {
  await page.goto("/");
  const calculator = page.locator("#eua-terminal");
  await calculator.scrollIntoViewIfNeeded();

  await calculator.getByText("Surplus", { exact: true }).click();
  await expect(
    calculator.getByText("Calculated equivalent value"),
  ).toBeVisible();
  await expect(calculator.getByText("€425,000")).toBeVisible();
  await expect(
    calculator.getByText("no sale recommendation", { exact: false }),
  ).toBeVisible();
});
