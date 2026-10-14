import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ContactPageContent } from "../../src/app/[locale]/contact/page";
import { ImprintPageContent } from "../../src/app/[locale]/imprint/page";
import { HomePageContent } from "../../src/app/[locale]/page";
import { PrivacyPageContent } from "../../src/app/[locale]/privacy/page";
import { ProductPageContent } from "../../src/app/[locale]/product/page";
import { dictionaries } from "../../src/content/dictionaries";

describe("localized marketing pages", () => {
  it.each([
    [
      "de",
      "Volle Kontrolle über Ihre EU-ETS-Budgets.",
      "address on the live website",
    ],
    [
      "en",
      "Take full control over your EU ETS budgets.",
      "address on the live website",
    ],
  ] as const)(
    "server-renders all five pages in %s",
    (locale, homeTitle, imprintAddress) => {
      const dictionary = dictionaries[locale];
      const pages = [
        renderToStaticMarkup(
          <HomePageContent
            locale={locale}
            messages={dictionary.home}
            contactCta={dictionary.shell.contactCta}
          />,
        ),
        renderToStaticMarkup(
          <ProductPageContent
            locale={locale}
            messages={dictionary.product}
            demoMessages={dictionary.demo}
          />,
        ),
        renderToStaticMarkup(
          <ContactPageContent messages={dictionary.contact} />,
        ),
        renderToStaticMarkup(
          <PrivacyPageContent messages={dictionary.privacy} />,
        ),
        renderToStaticMarkup(
          <ImprintPageContent messages={dictionary.imprint} />,
        ),
      ];

      expect(pages).toHaveLength(5);
      expect(pages.every((page) => page.length > 0)).toBe(true);

      expect(pages[0]).toContain(homeTitle);
      expect(pages[0]).toContain("eua-terminal");
      // The hero carries no buttons any more. Within the page body the call
      // action appears exactly once, under the solution section; the header
      // copy lives in SiteShell, which this render does not include.
      expect(
        pages[0].split(dictionary.shell.contactCta).length - 1,
        "call action occurrences in the home body",
      ).toBe(1);

      // The product page still marks its synthetic figures.
      expect(pages[1]).toContain('data-data-status="demo"');
      expect(pages[1]).toContain(dictionary.demo.footnote);
      // The worked example reads as an equation, so the operators are there
      // and the boundaries panel is gone.
      expect(pages[1]).toContain("data-demo-operator");
      expect(pages[1]).not.toContain("demo-provenance-title");

      // index 2 is the contact page: the lead form with its honeypot has
      // replaced the old booking link and mail draft.
      expect(pages[2]).toContain("<form");
      expect(pages[2]).toContain('name="website_url"');
      expect(pages[2]).toContain(dictionary.contact.form.submitLabel);
      expect(pages[2]).not.toContain("calendly.com");
      expect(pages[2]).not.toContain("about-title");

      expect(pages[4]).toContain(imprintAddress);
      expect(pages[4]).toContain("CarbonCue");
    },
  );
});
