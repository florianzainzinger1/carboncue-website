import { notFound } from "next/navigation";

import { SiteShell } from "@/components/layout/site-shell";
import { Card, Heading, Prose } from "@/components/ui";
import { getDictionary } from "@/content/dictionaries";
import { operatorDetails } from "@/content/legal/operator";
import type { MessageDictionary } from "@/content/messages";
import { isLocale } from "@/i18n/config";
import { generateLocalizedPageMetadata } from "@/lib/metadata/page-metadata";

export function generateMetadata({ params }: PageProps<"/[locale]/privacy">) {
  return generateLocalizedPageMetadata({
    params,
    pagePath: "/privacy",
    pageKey: "privacy",
  });
}

type PrivacyPageContentProps = Readonly<{
  messages: MessageDictionary["privacy"];
}>;

export function PrivacyPageContent({ messages }: PrivacyPageContentProps) {
  const sections = [
    { id: "site-data", content: messages.siteData },
    { id: "legal-basis", content: messages.legalBasis },
    { id: "retention", content: messages.retention },
    { id: "recipients", content: messages.recipients },
    { id: "cookies", content: messages.cookies },
    { id: "contact", content: messages.contact },
  ] as const;

  return (
    <>
      <section
        className="border-border bg-canvas px-page py-section border-b"
        aria-labelledby="privacy-title"
      >
        <div className="max-w-site mx-auto">
          <div className="max-w-3xl">
            <p className="text-primary mb-5 font-mono text-xs font-medium tracking-[0.14em] uppercase">
              {messages.eyebrow}
            </p>
            <Heading id="privacy-title" as="h1" size="display">
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
          <Card aria-labelledby="privacy-controller-title">
            <Heading id="privacy-controller-title" as="h2" size="section">
              {messages.controller.title}
            </Heading>
            <Prose className="mt-4" tone="muted">
              {messages.controller.description}
            </Prose>
            <dl className="mt-7 grid gap-6 sm:grid-cols-2">
              <div>
                <dt className="text-muted text-sm leading-6">
                  {messages.controller.jointLabel}
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
                  {messages.controller.countryLabel}
                </dt>
                <dd className="text-ink mt-1 font-medium">
                  {messages.controller.country}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-muted text-sm leading-6">
                  {messages.controller.emailLabel}
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

          <Card tone="muted" aria-labelledby="privacy-form-data-title">
            <Heading id="privacy-form-data-title" as="h2" size="section">
              {messages.formData.title}
            </Heading>
            <Prose className="mt-4" tone="muted">
              {messages.formData.description}
            </Prose>
            <Prose className="mt-4" tone="muted">
              {messages.formData.storage}
            </Prose>
          </Card>

          <Card tone="muted" aria-labelledby="privacy-email-data-title">
            <Heading id="privacy-email-data-title" as="h2" size="section">
              {messages.emailData.title}
            </Heading>
            <Prose className="mt-4" tone="muted">
              {messages.emailData.description}
            </Prose>
            <Heading as="h3" size="subsection" className="mt-7">
              {messages.emailData.categoriesLabel}
            </Heading>
            <ul className="text-ink-soft mt-4 grid list-disc gap-3 pl-5 text-base leading-7">
              {messages.emailData.categories.map((category) => (
                <li key={category}>{category}</li>
              ))}
            </ul>
          </Card>

          <Card aria-labelledby="privacy-purposes-title">
            <Heading id="privacy-purposes-title" as="h2" size="section">
              {messages.purposes.title}
            </Heading>
            <Prose className="mt-4" tone="muted">
              {messages.purposes.description}
            </Prose>
            <ul className="text-ink-soft mt-5 grid list-disc gap-3 pl-5 text-base leading-7">
              {messages.purposes.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Card>

          {sections.map(({ id, content }) => (
            <section key={id} aria-labelledby={`privacy-${id}`}>
              <Heading id={`privacy-${id}`} as="h2" size="section">
                {content.title}
              </Heading>
              <Prose className="mt-4" tone="muted">
                {content.description}
              </Prose>
            </section>
          ))}

          <section aria-labelledby="privacy-rights-title">
            <Heading id="privacy-rights-title" as="h2" size="section">
              {messages.rights.title}
            </Heading>
            <Prose className="mt-4" tone="muted">
              {messages.rights.description}
            </Prose>
            <ul className="text-ink-soft mt-5 grid list-disc gap-3 pl-5 text-base leading-7 sm:grid-cols-2">
              {messages.rights.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="text-ink-soft mt-5 text-base leading-7">
              {messages.rights.complaint}
            </p>
          </section>
        </div>
      </section>
    </>
  );
}

export default async function PrivacyPage({
  params,
}: PageProps<"/[locale]/privacy">) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);

  return (
    <SiteShell dictionary={dictionary} locale={locale} pagePath="/privacy">
      <PrivacyPageContent messages={dictionary.privacy} />
    </SiteShell>
  );
}
