import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { LanguageSwitch } from "../../src/components/layout/language-switch";
import { SiteFooter } from "../../src/components/layout/site-footer";
import { SiteHeader } from "../../src/components/layout/site-header";
import { dictionaries } from "../../src/content/dictionaries";
import {
  ActionLink,
  Button,
  Callout,
  Card,
  DemoBadge,
  Heading,
  InformationField,
  Prose,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "../../src/components/ui";

describe("shared visual foundation components", () => {
  it("renders typography, actions, cards, callouts, fields, and demo status as HTML", () => {
    const markup = renderToStaticMarkup(
      <>
        <Heading as="h2">Section heading</Heading>
        <Prose>Readable supporting text.</Prose>
        <Button>Continue</Button>
        <ActionLink href="/">Return</ActionLink>
        <Card aria-label="Example card">Card content</Card>
        <Callout title="Note">Callout content</Callout>
        <InformationField
          label="Status"
          value="Example"
          supportingText="Supporting text"
        />
        <DemoBadge label="Demo" assistiveLabel="Demo data" />
      </>,
    );

    expect(markup).toContain("<h2");
    expect(markup).toContain('type="button"');
    expect(markup).toContain('href="/"');
    expect(markup).toContain("<article");
    expect(markup).toContain("<aside");
    expect(markup).toContain('data-data-status="demo"');
    expect(markup).toContain("Demo data");
  });

  it("renders a captioned table with scoped column headers", () => {
    const markup = renderToStaticMarkup(
      <Table caption="Example values" scrollLabel="Example values table">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Label</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(markup).toContain('role="region"');
    expect(markup).toContain('aria-label="Example values table"');
    expect(markup).toContain("<caption");
    expect(markup).toContain('scope="col"');
  });

  it("renders shared navigation and the exact canonical disclaimer", () => {
    const markup = renderToStaticMarkup(
      <>
        <SiteHeader
          locale="en"
          pagePath="/"
          navigationLabel="Primary"
          navigationItems={[
            { href: "/", label: "Home", path: "/" },
            { href: "/product", label: "Product", path: "/product" },
          ]}
          languageNavigationLabel="Language selection"
          currentLanguageLabel="Current language"
        />
        <SiteFooter
          label={dictionaries.en.shell.footerLabel}
          disclaimer={dictionaries.en.shell.disclaimer}
          navigationLabel="Primary"
          navigationItems={[{ href: "/", label: "Home" }]}
        />
      </>,
    );

    expect(markup).toContain('aria-label="Primary"');
    expect(markup).toContain('href="/"');
    expect(markup).not.toContain('href="/en"');
    expect(markup).toContain('href="/de"');
    expect(markup).toContain('aria-current="page" class');
    expect(markup).toContain(dictionaries.en.shell.disclaimer);
  });

  it("lets pages without a counterpart pass explicit language targets and no active item", () => {
    const markup = renderToStaticMarkup(
      <SiteHeader
        locale="de"
        alternateHrefs={{ de: "/de/wissen" }}
        activeNavigationPath={null}
        navigationLabel="Hauptnavigation"
        navigationItems={[{ href: "/de", label: "Start", path: "/" }]}
        languageNavigationLabel="Sprachauswahl"
        currentLanguageLabel="Aktuelle Sprache"
      />,
    );

    // The English counterpart does not exist, so the switch falls back to the
    // English home page.
    expect(markup).toContain('href="/" hrefLang="en"');
    expect(markup).not.toMatch(/<a[^>]*aria-current="page"/);
  });

  it("renders a no-JavaScript language anchor for the same deep page", () => {
    const germanMarkup = renderToStaticMarkup(
      <LanguageSwitch
        locale="de"
        pagePath="/product"
        navigationLabel="Sprachauswahl"
        currentLanguageLabel="Aktuelle Sprache"
      />,
    );
    const englishMarkup = renderToStaticMarkup(
      <LanguageSwitch
        locale="en"
        pagePath="/product"
        navigationLabel="Language selection"
        currentLanguageLabel="Current language"
      />,
    );

    expect(germanMarkup).toContain('href="/product"');
    expect(germanMarkup).not.toContain('href="/en/product"');
    expect(germanMarkup).toContain('hrefLang="en"');
    expect(germanMarkup).toContain('aria-current="page"');
    expect(englishMarkup).toContain('href="/de/product"');
    expect(englishMarkup).toContain('hrefLang="de"');
  });
});
