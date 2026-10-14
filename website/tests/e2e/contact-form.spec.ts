import { expect, test, type Page } from "@playwright/test";

/** The form only takes over submission once React has hydrated. */
async function openHydratedForm(page: Page) {
  await page.goto("/de/contact");
  await page.locator("form[data-hydrated]").waitFor();
}

test("submits the lead form and replaces it with the confirmation", async ({
  page,
}) => {
  // The backend needs a database and an email key, so the browser test
  // intercepts the same-origin API call and asserts the exact payload the
  // form sends instead.
  let payload: Record<string, unknown> | undefined;
  await page.route("**/api/contact", async (route) => {
    payload = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    });
  });

  await openHydratedForm(page);

  await page.getByLabel("Name", { exact: true }).fill("Anna Beispiel");
  await page
    .getByLabel("Unternehmen", { exact: true })
    .fill("Beispiel Industrie GmbH");
  await page
    .getByLabel("Geschäftliche E-Mail", { exact: true })
    .fill("anna@beispiel-industrie.example");
  await page
    .getByLabel("Ihre Nachricht (optional)", { exact: true })
    .fill("Bitte um Rückruf.");
  await page.getByRole("button", { name: "Anfrage senden" }).click();

  await expect(page.getByRole("status")).toContainText("Vielen Dank.");
  await expect(page.locator("form")).toHaveCount(0);

  expect(payload).toMatchObject({
    name: "Anna Beispiel",
    company: "Beispiel Industrie GmbH",
    email: "anna@beispiel-industrie.example",
    message: "Bitte um Rückruf.",
    website_url: "",
  });
});

test("shows the error message when the API fails and keeps the form", async ({
  page,
}) => {
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ ok: false, error: "server_error" }),
    }),
  );

  await openHydratedForm(page);

  await page.getByLabel("Name", { exact: true }).fill("Anna Beispiel");
  await page
    .getByLabel("Unternehmen", { exact: true })
    .fill("Beispiel Industrie GmbH");
  await page
    .getByLabel("Geschäftliche E-Mail", { exact: true })
    .fill("anna@beispiel-industrie.example");
  await page.getByRole("button", { name: "Anfrage senden" }).click();

  // Scoped to the form: Next's route announcer also carries role="alert",
  // so an unscoped lookup is ambiguous.
  const formAlert = page.locator("form").getByRole("alert");
  await expect(formAlert).toBeVisible();
  await expect(formAlert).toContainText("konnte nicht gesendet werden");
  await expect(page.locator("form")).toBeVisible();
});

test("hides the honeypot field from readers and the tab order", async ({
  page,
}) => {
  await page.goto("/de/contact");

  const honeypot = page.locator('input[name="website_url"]');
  await expect(honeypot).toBeHidden();
  await expect(honeypot).toHaveAttribute("tabindex", "-1");
});

test("the live API validates payloads and swallows honeypot hits", async ({
  request,
}) => {
  // Both paths run before any database or email dependency, so they work
  // against the production build without environment variables.
  const invalid = await request.post("/api/contact", {
    data: { name: "", company: "X", email: "not-an-email" },
  });
  expect(invalid.status()).toBe(400);

  const honeypot = await request.post("/api/contact", {
    data: {
      name: "Bot",
      company: "Bot GmbH",
      email: "bot@example.com",
      website_url: "https://spam.example",
    },
  });
  expect(honeypot.status()).toBe(200);
  await expect(honeypot.json()).resolves.toEqual({ ok: true });
});
