import { notFound } from "next/navigation";

import { SiteShell } from "@/components/layout/site-shell";
import { Callout, Card, Heading, Prose } from "@/components/ui";
import { getDictionary } from "@/content/dictionaries";
import {
  formatOperatorAddress,
  operatorDetails,
} from "@/content/legal/operator";
import type { MessageDictionary } from "@/content/messages";
import { isLocale } from "@/i18n/config";
import { generateLocalizedPageMetadata } from "@/lib/metadata/page-metadata";

export function generateMetadata({ params }: PageProps<"/[locale]/imprint">) {
  return generateLocalizedPageMetadata({
    params,
    pagePath: "/imprint",
    pageKey: "imprint",
  });
}

type ImprintPageContentProps = Readonly<{
  messages: MessageDictionary["imprint"];
}>;

export function ImprintPageContent({ messages }: ImprintPageContentProps) {
  const address = operatorDetails.address;

  return (
    <>
      <section
        className="border-border bg-canvas px-page py-section border-b"
        aria-labelledby="imprint-title"
      >
        <div className="max-w-site mx-auto">
          <div className="max-w-3xl">
            <p className="text-primary mb-5 font-mono text-xs font-medium tracking-[0.14em] uppercase">
              {messages.eyebrow}
            </p>
            <Heading id="imprint-title" as="h1" size="display">
              {messages.title}
            </Heading>
            <Prose className="mt-7" size="lead">
              {messages.introduction}
            </Prose>
          </div>
        </div>
      </section>

      <section className="bg-surface px-page py-section">
        <div className="max-w-reading mx-auto grid gap-10">
          {address.status === "missing" ? (
            <Callout
              id="imprint-incomplete-notice"
              title={messages.incomplete.title}
              tone="caution"
              role="alert"
            >
              <p>{messages.incomplete.description}</p>
            </Callout>
          ) : null}

          <Card aria-labelledby="imprint-operator-title">
            <p className="text-primary mb-3 font-mono text-xs font-medium tracking-[0.12em] uppercase">
              {messages.operator.legalBasis}
            </p>
            <Heading id="imprint-operator-title" as="h2" size="section">
              {messages.operator.title}
            </Heading>
            <dl className="mt-7 grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="text-muted text-sm leading-6">
                  {messages.operator.jointLabel}
                </dt>
                <dd className="text-ink mt-1 font-medium">
                  <ul className="grid list-none gap-1 p-0">
                    {operatorDetails.names.map((name) => (
                      <li key={name}>{name}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt className="text-muted text-sm leading-6">
                  {messages.operator.addressLabel}
                </dt>
                <dd className="text-ink mt-1 font-medium">
                  {address.status === "configured"
                    ? formatOperatorAddress(address)
                    : messages.incomplete.title}
                </dd>
              </div>
              <div>
                <dt className="text-muted text-sm leading-6">
                  {messages.operator.countryLabel}
                </dt>
                <dd className="text-ink mt-1 font-medium">
                  {messages.operator.country}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-muted text-sm leading-6">
                  {messages.operator.emailLabel}
                </dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${operatorDetails.contactEmail}`}
                    className="text-primary rounded-control font-medium break-all underline underline-offset-4"
                  >
                    {operatorDetails.contactEmail}
                  </a>
                </dd>
              </div>
            </dl>
          </Card>

          {[
            messages.mediaOwner,
            messages.businessPurpose,
            messages.editorialLine,
            messages.responsibility,
          ].map((section, index) => (
            <section
              key={section.title}
              aria-labelledby={`imprint-section-${index}`}
            >
              <Heading id={`imprint-section-${index}`} as="h2" size="section">
                {section.title}
              </Heading>
              <Prose className="mt-4" tone="muted">
                {section.description}
              </Prose>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}

export default async function ImprintPage({
  params,
}: PageProps<"/[locale]/imprint">) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);

  return (
    <SiteShell dictionary={dictionary} locale={locale} pagePath="/imprint">
      <ImprintPageContent messages={dictionary.imprint} />
    </SiteShell>
  );
}
