import type { GuideIsoDate } from "../../guides/types";

/**
 * German-only copy for the "EU-ETS-Wissen" hub and the shared guide page
 * chrome. It is deliberately not part of the bilingual MessageDictionary:
 * there is no English counterpart of these pages.
 */
export const guideHubCopy = {
  navLabel: "EU-ETS-Wissen",
  eyebrow: "Ratgeber · Deutschland und Österreich",
  title: "EU-ETS-Wissen",
  intro:
    "Hier finden Sie Ratgeber zu Fristen und Regeln im EU-Emissionshandel für Betreiber ortsfester Anlagen in Deutschland und Österreich. Jeder Beitrag nennt seine Quellen mit Abrufdatum und ersetzt keine Rechtsberatung.",
  metaTitle: "EU-ETS-Wissen: Ratgeber zum Emissionshandel",
  metaDescription:
    "Ratgeber zum EU-Emissionshandel für Anlagenbetreiber in Deutschland und Österreich: Abgabefrist, Sanktionen, kostenlose Zuteilung und CBAM-Faktor.",
  guidesTitle: "Ratgeber",
  updatedOn: "2026-09-14",
} as const satisfies Readonly<Record<string, string>> & {
  updatedOn: GuideIsoDate;
};

export const guidePageLabels = {
  breadcrumbLabel: "Brotkrümelnavigation",
  breadcrumbHome: "Startseite",
  keyFactsTitle: "Auf einen Blick",
  faqTitle: "Häufige Fragen",
  sourcesTitle: "Quellen",
  retrievedOnPrefix: "Abgerufen am",
  updatedOnPrefix: "Stand:",
  responsiblePrefix: "Verantwortlich:",
  disclaimerTitle: "Hinweis",
  moreGuidesTitle: "Weitere Ratgeber",
  hubLinkLabel: "Alle Ratgeber im Überblick",
  tableRegionPrefix: "Tabelle",
} as const;

const GERMAN_MONTHS = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
] as const;

function parseIsoDate(date: GuideIsoDate) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);

  if (!match) {
    throw new Error(`Invalid ISO date: ${date}`);
  }

  return {
    year: match[1]!,
    month: Number(match[2]),
    day: Number(match[3]),
    monthPadded: match[2]!,
    dayPadded: match[3]!,
  };
}

/** "2026-09-14" -> "14. September 2026" (locale-independent, no Intl). */
export function formatGermanLongDate(date: GuideIsoDate): string {
  const { year, month, day } = parseIsoDate(date);

  return `${day}. ${GERMAN_MONTHS[month - 1]} ${year}`;
}

/** "2026-09-14" -> "14.09.2026". */
export function formatGermanNumericDate(date: GuideIsoDate): string {
  const { year, monthPadded, dayPadded } = parseIsoDate(date);

  return `${dayPadded}.${monthPadded}.${year}`;
}
