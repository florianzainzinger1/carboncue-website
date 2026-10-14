import { notFound } from "next/navigation";

import { DemoPositionVisual } from "@/components/demo/demo-position-visual";
import { SiteShell } from "@/components/layout/site-shell";
import { ActionLink, Callout, Card, Heading, Prose } from "@/components/ui";
import { getDictionary } from "@/content/dictionaries";
import type { MessageDictionary } from "@/content/messages";
import { isLocale, type Locale } from "@/i18n/config";
import { getLocalizedPath } from "@/i18n/paths";
import { generateLocalizedPageMetadata } from "@/lib/metadata/page-metadata";

export function generateMetadata({ params }: PageProps<"/[locale]/product">) {
  return generateLocalizedPageMetadata({
    params,
    pagePath: "/product",
    pageKey: "product",
  });
}

type ProductPageContentProps = Readonly<{
  locale: Locale;
  messages: MessageDictionary["product"];
  demoMessages: MessageDictionary["demo"];
}>;

export function ProductPageContent({
  locale,
  messages,
  demoMessages,
}: ProductPageContentProps) {
  return (
    <>
      <section
        className="border-border bg-canvas px-page py-section border-b"
        aria-labelledby="product-title"
      >
        <div className="max-w-site mx-auto grid items-end gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.7fr)] lg:gap-14">
          <div>
            <p className="text-primary mb-5 font-mono text-xs font-medium tracking-[0.14em] uppercase">
              {messages.intro.eyebrow}
            </p>
            <Heading id="product-title" as="h1" size="display">
              {messages.intro.title}
            </Heading>
          </div>
          <Callout title={messages.intro.statusTitle}>
            <p>{messages.intro.statusBody}</p>
          </Callout>
        </div>
      </section>

      <section
        className="bg-surface px-page py-section"
        aria-labelledby="product-workflow-title"
      >
        <div className="max-w-site mx-auto">
          <div>
            <p className="text-primary mb-4 font-mono text-xs font-medium tracking-[0.14em] uppercase">
              {messages.workflow.eyebrow}
            </p>
            {/* hyphens-none: the shared Heading turns on automatic hyphenation,
                which broke this line as "Si-cherheit" once the summary column
                narrowed it. The line is short enough to wrap on word
                boundaries at every width. */}
            <Heading
              id="product-workflow-title"
              as="h2"
              size="title"
              className="hyphens-none"
            >
              {messages.workflow.title}
            </Heading>
          </div>

          <ol
            className="mt-12 grid list-none gap-5 p-0 lg:grid-cols-2"
            aria-label={messages.workflow.stagesLabel}
          >
            {messages.workflow.stages.map((stage, index) => (
              <li key={stage.eyebrow} data-product-stage={index + 1}>
                <Card className="h-full">
                  <div className="grid gap-6 sm:grid-cols-[3rem_minmax(0,1fr)]">
                    <p
                      className="text-primary font-mono text-3xl leading-none font-medium"
                      aria-hidden="true"
                    >
                      {index + 1}
                    </p>
                    <div>
                      <p className="text-primary mb-3 font-mono text-xs font-medium tracking-[0.12em] uppercase">
                        {stage.eyebrow}
                      </p>
                      <Heading as="h3" size="section">
                        {stage.title}
                      </Heading>
                      <Prose className="mt-4" tone="muted">
                        {stage.description}
                      </Prose>

                      <div className="border-border bg-surface-muted rounded-card mt-6 border p-5">
                        <p className="text-ink font-mono text-xs font-medium tracking-[0.12em] uppercase">
                          {stage.exampleLabel}
                        </p>
                        <p className="text-ink-soft mt-3 text-sm leading-6">
                          {stage.example}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ─── A worked example of the position the product produces ─── */}
      <DemoPositionVisual locale={locale} messages={demoMessages} />

      {/* pt-16 instead of the full section padding pulls the CTA closer to
          the worked example above it. */}
      <section
        className="bg-surface px-page pb-section pt-16"
        aria-labelledby="product-cta-title"
      >
        <div className="max-w-site mx-auto max-w-3xl">
          <Heading id="product-cta-title" as="h2" size="section">
            {messages.cta.title}
          </Heading>
          <Prose className="max-w-reading text-muted mt-4">
            {messages.cta.description}
          </Prose>
          <div className="mt-8">
            <ActionLink
              href={getLocalizedPath(locale, "/contact")}
              variant="primary"
            >
              {messages.cta.label}
            </ActionLink>
          </div>
        </div>
      </section>
    </>
  );
}

export default async function ProductPage({
  params,
}: PageProps<"/[locale]/product">) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);

  return (
    <SiteShell dictionary={dictionary} locale={locale} pagePath="/product">
      <ProductPageContent
        locale={locale}
        messages={dictionary.product}
        demoMessages={dictionary.demo}
      />
    </SiteShell>
  );
}
