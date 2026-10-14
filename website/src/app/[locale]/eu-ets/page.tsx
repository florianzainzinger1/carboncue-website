import Link from "next/link";
import { notFound } from "next/navigation";

import { GuideBreadcrumb } from "@/components/guides/guide-parts";
import { SiteShell } from "@/components/layout/site-shell";
import {
  createBreadcrumbStructuredData,
  getHubBreadcrumbSteps,
  StructuredDataScript,
} from "@/components/metadata/guide-structured-data";
import { Card, Heading, Prose } from "@/components/ui";
import { getDictionary } from "@/content/dictionaries";
import {
  formatGermanLongDate,
  guideHubCopy,
  guidePageLabels,
} from "@/content/de/guides/hub";
import {
  getGuideDocumentTitle,
  getGuideHubPath,
  getGuidePath,
  GUIDE_HUB_SEGMENT,
  GUIDE_LOCALE,
  GUIDES,
  stripSourceMarkers,
} from "@/content/guides/registry";
import { createPageMetadata } from "@/lib/metadata/page-metadata";

/**
 * The hub exists in German only. Next.js calls this once per locale from the
 * [locale] layout and merges the result over the parent params, so returning
 * the German locale for every call yields /de/eu-ets only (an empty array
 * would pass the English locale through unchanged). With the layout's
 * dynamicParams = false, /en/eu-ets and its public URL /eu-ets are a 404.
 */
export function generateStaticParams(): { locale: string }[] {
  return [{ locale: GUIDE_LOCALE }];
}
async function assertGermanLocale(
  params: PageProps<"/[locale]/eu-ets">["params"],
) {
  const { locale } = await params;

  if (locale !== GUIDE_LOCALE) {
    notFound();
  }
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/eu-ets">) {
  await assertGermanLocale(params);

  return createPageMetadata({
    locale: GUIDE_LOCALE,
    localizedPaths: { [GUIDE_LOCALE]: getGuideHubPath() },
    messages: {
      title: getGuideDocumentTitle(guideHubCopy.metaTitle),
      description: guideHubCopy.metaDescription,
    },
  });
}

export function GuideHubContent() {
  const breadcrumbItems = getHubBreadcrumbSteps().map((step) => ({
    name: step.name,
    href: step.path,
  }));

  return (
    <>
      <section
        className="border-border bg-canvas px-page py-section border-b"
        aria-labelledby="guide-hub-title"
      >
        <div className="max-w-site mx-auto">
          <div className="max-w-3xl">
            <GuideBreadcrumb items={breadcrumbItems} />
            <p className="text-primary mb-5 font-mono text-xs font-medium tracking-[0.14em] uppercase">
              {guideHubCopy.eyebrow}
            </p>
            <Heading id="guide-hub-title" as="h1" size="display">
              {guideHubCopy.title}
            </Heading>
            <Prose className="mt-7" size="lead">
              {guideHubCopy.intro}
            </Prose>
          </div>
        </div>
      </section>

      <section
        className="bg-surface px-page py-section"
        aria-labelledby="guide-hub-list-title"
      >
        <div className="max-w-site mx-auto">
          <Heading id="guide-hub-list-title" as="h2" size="section">
            {guideHubCopy.guidesTitle}
          </Heading>
          <ul className="mt-8 grid list-none gap-6 p-0 md:grid-cols-2">
            {GUIDES.map((guide) => (
              <li key={guide.slug} className="grid">
                <Card
                  aria-labelledby={`guide-card-${guide.slug}`}
                  className="flex flex-col"
                >
                  <p className="text-muted font-mono text-xs tracking-wider uppercase">
                    {guide.content.eyebrow}
                  </p>
                  <Heading
                    id={`guide-card-${guide.slug}`}
                    as="h3"
                    size="subsection"
                    className="mt-3"
                  >
                    <Link
                      href={getGuidePath(guide.slug)}
                      className="rounded-control underline underline-offset-4 hover:no-underline"
                    >
                      {guide.content.h1}
                    </Link>
                  </Heading>
                  <p className="text-ink-soft mt-4 text-base leading-7">
                    {/* Card leads drop the [n] markers; the sources live on the guide page. */}
                    {stripSourceMarkers(guide.content.lead)}
                  </p>
                  <p className="text-muted mt-auto pt-5 text-sm leading-6">
                    {guidePageLabels.updatedOnPrefix}{" "}
                    <time dateTime={guide.updatedOn}>
                      {formatGermanLongDate(guide.updatedOn)}
                    </time>
                  </p>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

export default async function GuideHubPage({
  params,
}: PageProps<"/[locale]/eu-ets">) {
  await assertGermanLocale(params);
  const dictionary = getDictionary(GUIDE_LOCALE);

  return (
    <SiteShell
      dictionary={dictionary}
      locale={GUIDE_LOCALE}
      alternateHrefs={{ [GUIDE_LOCALE]: getGuideHubPath() }}
      activeNavigationPath={GUIDE_HUB_SEGMENT}
    >
      <StructuredDataScript
        data={createBreadcrumbStructuredData(getHubBreadcrumbSteps())}
      />
      <GuideHubContent />
    </SiteShell>
  );
}
