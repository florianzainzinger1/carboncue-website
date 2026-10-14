import { abgabefristSanktionGuide } from "../de/guides/abgabefrist-sanktion";
import { freieZuteilungCbamFaktorGuide } from "../de/guides/freie-zuteilung-cbam-faktor";
import { FOUNDER_PROFILES } from "../founders";
import type { Locale } from "../../i18n/config";
import { localizePath } from "../../i18n/paths";
import type { GuideContent, GuideIsoDate } from "./types";

export type GuideEntry = Readonly<{
  slug: string;
  /** Guides exist in a single locale; there is no translated counterpart. */
  locale: Extract<Locale, "de">;
  publishedOn: GuideIsoDate;
  updatedOn: GuideIsoDate;
  content: GuideContent;
}>;

/** Locale-neutral path segment of the guide hub and its guides. */
export const GUIDE_HUB_SEGMENT = "/eu-ets";

/** The only locale the hub and the guides are published in. */
export const GUIDE_LOCALE = "de" as const satisfies Locale;

/** Registry of published guides, in display order. */
export const GUIDES = [
  {
    slug: abgabefristSanktionGuide.slug,
    locale: GUIDE_LOCALE,
    publishedOn: "2026-09-14",
    updatedOn: "2026-09-14",
    content: abgabefristSanktionGuide,
  },
  {
    slug: freieZuteilungCbamFaktorGuide.slug,
    locale: GUIDE_LOCALE,
    publishedOn: "2026-09-14",
    updatedOn: "2026-09-14",
    content: freieZuteilungCbamFaktorGuide,
  },
] as const satisfies readonly GuideEntry[];

/** Names shown in the "Verantwortlich" line, in operator order. */
export const GUIDE_RESPONSIBLE_NAMES = FOUNDER_PROFILES.map(
  (founder) => founder.name,
).join(", ");

const BRAND_SUFFIX = " | CarbonCue";
export const MAX_DOCUMENT_TITLE_LENGTH = 60;

/** Appends the brand only when the full title stays within 60 characters. */
export function getGuideDocumentTitle(metaTitle: string): string {
  const branded = `${metaTitle}${BRAND_SUFFIX}`;

  return branded.length <= MAX_DOCUMENT_TITLE_LENGTH ? branded : metaTitle;
}

export function getGuideBySlug(slug: string): GuideEntry | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}

/** Public path of the hub: "/de/eu-ets". */
export function getGuideHubPath(): string {
  return localizePath(GUIDE_LOCALE, GUIDE_HUB_SEGMENT);
}

/** Public path of a guide: "/de/eu-ets/<slug>". */
export function getGuidePath(slug: string): string {
  return localizePath(GUIDE_LOCALE, `${GUIDE_HUB_SEGMENT}/${slug}`);
}

/** Splits text into plain strings and `[n]` source-marker numbers. */
export function splitSourceMarkers(text: string): (string | number)[] {
  return text
    .split(/(\[\d+\])/)
    .filter((part) => part !== "")
    .map((part) => {
      const marker = /^\[(\d+)\]$/.exec(part);

      return marker ? Number(marker[1]) : part;
    });
}

/** Removes `[n]` markers and the space before them, for plain-text uses. */
export function stripSourceMarkers(text: string): string {
  return text.replace(/\s*(\[\d+\])+/g, "").trim();
}

/** Every text field of a guide that may carry `[n]` markers. */
export function collectGuideTexts(content: GuideContent): string[] {
  return [
    content.lead,
    ...content.keyFacts,
    ...content.sections.flatMap((section) => [
      section.heading,
      ...section.paragraphs,
      ...(section.bullets ?? []),
      ...(section.table
        ? [
            section.table.caption,
            ...section.table.head,
            ...section.table.rows.flat(),
          ]
        : []),
    ]),
    ...content.faq.flatMap((item) => [item.question, item.answer]),
    content.disclaimer,
  ];
}
