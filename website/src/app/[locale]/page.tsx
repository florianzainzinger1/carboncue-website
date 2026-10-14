import { notFound } from "next/navigation";

import { PositionDuality } from "@/components/home/position-duality";
import { EuaRiskCalculator } from "@/components/interactive";
import { SiteShell } from "@/components/layout/site-shell";
import { WebsiteStructuredData } from "@/components/metadata/website-structured-data";
import { ComplianceYearStory } from "@/components/story/compliance-year-story";
import { ActionLink, Heading, Prose } from "@/components/ui";
import { getDictionary } from "@/content/dictionaries";
import type { MessageDictionary } from "@/content/messages";
import { isLocale, type Locale } from "@/i18n/config";
import { getLocalizedPath } from "@/i18n/paths";
import { generateLocalizedPageMetadata } from "@/lib/metadata/page-metadata";

export function generateMetadata({ params }: PageProps<"/[locale]">) {
  return generateLocalizedPageMetadata({
    params,
    pagePath: "/",
    pageKey: "home",
  });
}

type HomePageContentProps = Readonly<{
  locale: Locale;
  messages: MessageDictionary["home"];
  contactCta: string;
}>;

export function HomePageContent({
  locale,
  messages,
  contactCta,
}: HomePageContentProps) {
  return (
    <div className="flex flex-col">
      {/* ─── Hero ───────────────────────────────────────────────────────────
          The EU-ETS Phase 4 line sits inside the hero as a plain eyebrow, not
          in its own badge container, so it reads as part of the headline block
          rather than a bolted-on element. The hero carries no buttons: the
          header already holds the single call action, and the trust line was
          removed, so the rule below moves up with the shortened block. */}
      <section
        className="px-page border-border/80 bg-surface border-b pt-16 pb-16 md:pt-24 md:pb-20"
        aria-labelledby="home-title"
      >
        <div className="max-w-site mx-auto flex flex-col items-center text-center">
          <p className="text-muted font-mono text-xs tracking-wider uppercase">
            {messages.hero.badge}
          </p>

          <Heading
            id="home-title"
            as="h1"
            size="display"
            className="mt-5 max-w-4xl font-semibold tracking-tight text-balance"
          >
            {messages.hero.title}
          </Heading>

          <Prose
            size="lead"
            className="max-w-reading text-muted mx-auto mt-6 text-balance"
          >
            {messages.hero.summary}
          </Prose>
        </div>
      </section>

      {/* ─── The compliance year, told as a scroll story ─── */}
      <ComplianceYearStory labels={messages.story} />

      {/* ─── Both directions of the position, addressed side by side ─── */}
      <PositionDuality messages={messages.duality} />

      {/* ─── Interactive EUA risk calculator ─── */}
      <section
        id="eua-terminal"
        className="px-page border-border/80 bg-canvas border-t py-16 md:py-24"
        aria-labelledby="eua-calculator-title"
      >
        <div className="max-w-site mx-auto">
          <EuaRiskCalculator locale={locale} messages={messages.calculator} />
        </div>
      </section>

      {/* ─── Why CarbonCue answers it ─── */}
      <section
        className="px-page border-border/80 bg-surface border-t py-16 md:py-24"
        aria-labelledby="home-solution-title"
      >
        <div className="max-w-site mx-auto max-w-3xl">
          <p className="text-muted font-mono text-xs tracking-wider uppercase">
            {messages.solution.eyebrow}
          </p>
          <Heading
            id="home-solution-title"
            as="h2"
            size="section"
            className="mt-3 font-semibold text-balance"
          >
            {messages.solution.title}
          </Heading>
          <Prose className="max-w-reading text-muted mt-5">
            {messages.solution.body}
          </Prose>
          <div className="mt-8">
            <ActionLink
              href={getLocalizedPath(locale, "/contact")}
              variant="primary"
            >
              {contactCta}
            </ActionLink>
          </div>
        </div>
      </section>

      {/* ─── Closing CTA to the product page ─── */}
      <section
        className="px-page border-border/80 bg-canvas border-t py-16 md:py-24"
        aria-labelledby="home-cta-title"
      >
        <div className="max-w-site mx-auto max-w-3xl">
          <Heading
            id="home-cta-title"
            as="h2"
            size="section"
            className="font-semibold text-balance"
          >
            {messages.cta.title}
          </Heading>
          <Prose className="max-w-reading text-muted mt-4">
            {messages.cta.description}
          </Prose>
          <div className="mt-8">
            <ActionLink
              href={getLocalizedPath(locale, "/product")}
              variant="secondary"
            >
              {messages.cta.primary} →
            </ActionLink>
          </div>
        </div>
      </section>
    </div>
  );
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const messages = getDictionary(locale);

  return (
    <SiteShell dictionary={messages} locale={locale} pagePath="/">
      {/* The WebSite entity describes the whole site, so it is emitted on
          the two home pages only, not on every page. */}
      <WebsiteStructuredData locale={locale} />
      <HomePageContent
        locale={locale}
        messages={messages.home}
        contactCta={messages.shell.contactCta}
      />
    </SiteShell>
  );
}
