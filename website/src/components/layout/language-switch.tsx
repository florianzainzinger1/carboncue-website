import type { Locale } from "@/i18n/config";
import {
  getLanguageSwitchHref,
  getLocalizedHrefMap,
  type LocalizedHrefMap,
  type PagePath,
} from "@/i18n/paths";

const languageNames = {
  de: "Deutsch",
  en: "English",
} as const satisfies Record<Locale, string>;

type LanguageSwitchProps = Readonly<{
  locale: Locale;
  /** A page that exists in both locales. Ignored when alternateHrefs is set. */
  pagePath?: PagePath;
  /**
   * Explicit counterpart paths keyed by locale. A locale without an entry
   * links to that locale's home page instead.
   */
  alternateHrefs?: LocalizedHrefMap;
  navigationLabel: string;
  currentLanguageLabel: string;
}>;

export function LanguageSwitch({
  locale,
  pagePath,
  alternateHrefs,
  navigationLabel,
  currentLanguageLabel,
}: LanguageSwitchProps) {
  const hrefs: LocalizedHrefMap =
    alternateHrefs ?? (pagePath ? getLocalizedHrefMap(pagePath) : {});

  return (
    <nav aria-label={navigationLabel}>
      <ul className="border-border rounded-control flex items-center border p-1 text-sm font-medium">
        {(["de", "en"] as const).map((language) => (
          <li key={language}>
            {language === locale ? (
              <span
                aria-current="page"
                className="bg-ink rounded-control inline-flex min-h-9 items-center px-3 py-1.5 text-white"
              >
                <span lang={language}>{languageNames[language]}</span>
                <span className="sr-only"> — {currentLanguageLabel}</span>
              </span>
            ) : (
              <a
                href={getLanguageSwitchHref(language, hrefs)}
                hrefLang={language}
                className="rounded-control text-ink-soft hover:text-primary inline-flex min-h-9 items-center px-3 py-1.5 underline-offset-4 hover:underline"
              >
                <span lang={language}>{languageNames[language]}</span>
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
