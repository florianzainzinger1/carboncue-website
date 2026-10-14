import { notFound } from "next/navigation";

import { ContactForm } from "@/components/contact/contact-form";
import { SiteShell } from "@/components/layout/site-shell";
import { Callout, Card, Heading, Prose } from "@/components/ui";
import { getDictionary } from "@/content/dictionaries";
import { getFounderByRole, type FounderRole } from "@/content/founders";
import type { MessageDictionary } from "@/content/messages";
import { isLocale } from "@/i18n/config";
import { generateLocalizedPageMetadata } from "@/lib/metadata/page-metadata";

export function generateMetadata({ params }: PageProps<"/[locale]/contact">) {
  return generateLocalizedPageMetadata({
    params,
    pagePath: "/contact",
    pageKey: "contact",
  });
}

type ContactPageContentProps = Readonly<{
  messages: MessageDictionary["contact"];
}>;

/** Display order of the founder cards. */
const FOUNDER_CARD_ROLES = [
  "productAndTechnology",
] as const satisfies readonly FounderRole[];

type FoundersSectionProps = Readonly<{
  messages: MessageDictionary["contact"]["founders"];
}>;

export function FoundersSection({ messages }: FoundersSectionProps) {
  return (
    <section
      className="border-border bg-surface px-page py-section border-t"
      aria-labelledby="founders-title"
    >
      <div className="max-w-site mx-auto">
        <Heading id="founders-title" as="h2" size="section">
          {messages.title}
        </Heading>
        <Prose className="mt-5">{messages.description}</Prose>
        <ul className="mt-8 grid list-none gap-6 p-0 md:grid-cols-2">
          {FOUNDER_CARD_ROLES.map((role) => {
            const founder = getFounderByRole(role);

            return (
              <li key={role} className="grid">
                <Card
                  aria-labelledby={`founder-${role}`}
                  data-founder-role={role}
                >
                  <Heading id={`founder-${role}`} as="h3" size="subsection">
                    {founder.name}
                  </Heading>
                  <p className="text-ink-soft mt-2 text-base leading-7">
                    {messages.roles[role]}
                  </p>
                  <a
                    href={founder.linkedInUrl}
                    rel="noopener"
                    className="text-ink rounded-control mt-4 inline-flex min-h-9 items-center font-medium underline underline-offset-4 hover:no-underline"
                  >
                    {founder.name} {messages.linkedInSuffix}
                  </a>
                </Card>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function ContactPageContent({ messages }: ContactPageContentProps) {
  return (
    <>
      <section
        className="bg-canvas px-page py-section"
        aria-labelledby="contact-title"
      >
        <div className="max-w-site mx-auto grid items-start gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.75fr)] lg:gap-14">
          <div>
            <p className="text-primary mb-5 font-mono text-xs font-medium tracking-[0.14em] uppercase">
              {messages.intro.eyebrow}
            </p>
            <Heading id="contact-title" as="h1" size="display">
              {messages.intro.title}
            </Heading>
            <Prose className="mt-7" size="lead">
              {messages.intro.summary}
            </Prose>

            <ContactForm messages={messages.form} />
          </div>

          <Callout title={messages.confidentiality.title}>
            <p>{messages.confidentiality.description}</p>
            <p className="mt-4">{messages.confidentiality.caution}</p>
          </Callout>
        </div>
      </section>
      <FoundersSection messages={messages.founders} />
    </>
  );
}

export default async function ContactPage({
  params,
}: PageProps<"/[locale]/contact">) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);

  return (
    <SiteShell dictionary={dictionary} locale={locale} pagePath="/contact">
      <ContactPageContent messages={dictionary.contact} />
    </SiteShell>
  );
}
