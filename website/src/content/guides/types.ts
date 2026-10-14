/**
 * Typed shape of a long-form guide. Guides are single-locale content (the
 * current guides are German only), so they live outside the bilingual
 * MessageDictionary and are not part of the DE/EN key-parity check.
 *
 * Inline source markers are written as `[n]` inside any text field and must
 * reference a `sources[].id` of the same guide (enforced by unit tests).
 */

/** An ISO calendar date (YYYY-MM-DD). */
export type GuideIsoDate = `${number}-${number}-${number}`;

export type GuideTable = Readonly<{
  caption: string;
  head: readonly string[];
  rows: readonly (readonly string[])[];
}>;

export type GuideSection = Readonly<{
  id: string;
  heading: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
  table?: GuideTable;
}>;

export type GuideFaqItem = Readonly<{
  question: string;
  answer: string;
}>;

export type GuideSource = Readonly<{
  id: number;
  label: string;
  publisher: string;
  url: `https://${string}`;
  retrievedOn: GuideIsoDate;
}>;

export type GuideContent = Readonly<{
  slug: string;
  /** Short label for footer navigation and cross links. */
  navLabel: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  lead: string;
  keyFacts: readonly string[];
  sections: readonly GuideSection[];
  faq: readonly GuideFaqItem[];
  sources: readonly GuideSource[];
  disclaimer: string;
}>;
