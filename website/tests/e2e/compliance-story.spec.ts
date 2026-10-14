import { expect, test, type Page } from "@playwright/test";

const COVERED_FILL = "#047857";
const RISK_FILL = "#dc2626";

async function scrollToStep(page: Page, index: number) {
  // Centre the step on the viewport midline: the morph and the surplus
  // scene are scrubbed by the midline's progress between step centres, so a
  // minimal scroll-into-view would leave them mid-way.
  await page
    .locator('ol[data-enhanced="true"] > li')
    .nth(index)
    .evaluate((node) => {
      const box = node.getBoundingClientRect();
      window.scrollTo({
        top: window.scrollY + box.top + box.height / 2 - window.innerHeight / 2,
        behavior: "instant",
      });
    });
  // The active step is picked by an IntersectionObserver band across the
  // middle of the viewport, and the discrete accents transition afterwards.
  await page.waitForTimeout(1600);
}

test("the compliance story advances the figure from curve to block bar and back to covered", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/de");

  const figure = page.locator("[data-story-scene]");
  const blocks = page.locator(".story-block");

  // The bar always exists in the DOM; only its scene changes, so the block
  // arithmetic is checkable from the first step.
  await expect(blocks).toHaveCount(10);

  // Steps 1-3: the curve scene.
  for (const index of [0, 1, 2]) {
    await scrollToStep(page, index);
    await expect(figure).toHaveAttribute("data-story-scene", "curve");
  }

  // Step 4: the curve becomes a bar of tonnes, split at the coverage line,
  // with the charge chips beside the red section.
  await scrollToStep(page, 3);
  await expect(figure).toHaveAttribute("data-story-scene", "bar");

  const fillsAtStepFour = await blocks.evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute("fill")),
  );
  expect(fillsAtStepFour.filter((fill) => fill === COVERED_FILL)).toHaveLength(
    6,
  );
  expect(fillsAtStepFour.filter((fill) => fill === RISK_FILL)).toHaveLength(4);

  // The two charges that hit each uncovered tonne are named as compact chips.
  await expect(page.getByText("Pro ungedeckter Tonne")).toBeVisible();
  await expect(page.getByText("100 € Strafzahlung")).toBeVisible();
  await expect(page.getByText("Nachkauf trotzdem nötig")).toBeVisible();

  // The in-block zone labels have joined the fully formed bar: "Ungedeckt"
  // on the red section, "Gedeckt" on the green one. (The upper slot stacks
  // three crossfading texts, so Gedeckt is read from the lower, last node.)
  // Effective opacity: the product across the ancestor chain, so a label
  // parked inside a faded-out group can never pass as visible (which is
  // exactly the bug this guards against).
  const inBlockOpacity = (text: string, position: "first" | "last") =>
    figure
      .getByText(text, { exact: true })
      [position]()
      .evaluate((node) => {
        let opacity = 1;
        for (
          let current: Element | null = node;
          current;
          current = current.parentElement
        ) {
          opacity *= Number(getComputedStyle(current).opacity);
        }
        return opacity;
      });
  expect(await inBlockOpacity("Ungedeckt", "first")).toBeGreaterThan(0.9);
  expect(await inBlockOpacity("Gedeckt", "last")).toBeGreaterThan(0.9);

  // Step 5: every block turns green.
  await scrollToStep(page, 4);
  await expect(figure).toHaveAttribute("data-story-scene", "bar");

  // The upper zone label crossfades with the sweep: Ungedeckt out, the
  // upper Gedeckt in.
  expect(await inBlockOpacity("Ungedeckt", "first")).toBeLessThan(0.05);
  expect(await inBlockOpacity("Gedeckt", "first")).toBeGreaterThan(0.9);

  const fillsAtStepFive = await blocks.evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute("fill")),
  );
  expect(fillsAtStepFive.filter((fill) => fill === COVERED_FILL)).toHaveLength(
    10,
  );
  expect(fillsAtStepFive.filter((fill) => fill === RISK_FILL)).toHaveLength(0);

  // The petrol overlay group exists in the DOM throughout but must still be
  // fully faded out here, one step before the surplus scene.
  const surplusGroupOpacity = () =>
    page
      .locator('rect[fill="#0e7490"]')
      .first()
      .evaluate((node) =>
        Number(getComputedStyle(node.parentElement!).opacity),
      );
  expect(await surplusGroupOpacity()).toBeLessThan(0.05);

  // Step 6: the surplus scene. The coverage line has risen above the bar,
  // the top three blocks overlay in the petrol asset colour at full
  // opacity.
  await scrollToStep(page, 5);
  await expect(figure).toHaveAttribute("data-story-scene", "surplus");
  await expect(page.locator('rect[fill="#0e7490"]')).toHaveCount(3);
  expect(await surplusGroupOpacity()).toBeGreaterThan(0.9);
  await expect(page.getByText("Überschuss = gebundenes Kapital")).toBeVisible();

  // The upper zone label now reads "Überschuss" on the petrol blocks.
  expect(await inBlockOpacity("Überschuss", "first")).toBeGreaterThan(0.9);

  // The charge chips left with the red section, so they cannot sit over the
  // surplus annotation.
  const chipsOpacity = await page
    .getByText("Pro ungedeckter Tonne")
    .evaluate((node) => Number(getComputedStyle(node.parentElement!).opacity));
  expect(chipsOpacity).toBeLessThan(0.05);
});

test("reduced motion snaps the morph per step instead of scrubbing", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/de");

  // Step 4 centred: the figure must be fully morphed without any scrubbing
  // — the snap path derives it from the active step alone: bar scene with
  // the charge chips already shown.
  await scrollToStep(page, 3);
  await expect(page.locator("[data-story-scene]")).toHaveAttribute(
    "data-story-scene",
    "bar",
  );
  await expect(page.getByText("Pro ungedeckter Tonne")).toBeVisible();

  // Step 6 centred: the surplus scene snaps in without scrubbing.
  await scrollToStep(page, 5);
  await expect(page.locator("[data-story-scene]")).toHaveAttribute(
    "data-story-scene",
    "surplus",
  );
});

test("the figure stays centred in the viewport and passed steps fade out", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/de");

  const panel = page.locator("figure", {
    has: page.locator("[data-story-scene]"),
  });
  const offsets: number[] = [];

  for (const index of [1, 2, 3, 4]) {
    await page
      .locator('ol[data-enhanced="true"] > li')
      .nth(index)
      .scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    offsets.push(
      await panel.evaluate((node) => {
        const box = node.getBoundingClientRect();
        return Math.abs(box.top + box.height / 2 - window.innerHeight / 2);
      }),
    );
  }

  // The section intro scrolls away, then the figure rides the vertical middle
  // of the viewport: its centre stays within a sixth of the viewport height
  // of the viewport's centre at every step.
  for (const offset of offsets) {
    expect(offset).toBeLessThan(900 / 6);
  }

  // With the last step active, the steps the reader has scrolled past have
  // faded out upwards.
  const firstStepOpacity = await page
    .locator(".story-step")
    .first()
    .evaluate((node) => Number.parseFloat(getComputedStyle(node).opacity));
  expect(firstStepOpacity).toBeLessThan(0.05);
});
