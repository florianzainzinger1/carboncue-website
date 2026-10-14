export const SUPPORTED_LOCALES = ["de", "en"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

/**
 * The primary locale is served without a path prefix at the domain root
 * (`/`, `/product`, ...). Every other locale keeps its prefix (`/de`, ...).
 * Founder decision 2026-09-14, see docs/decisions/0005.
 */
export const PREFIXLESS_LOCALE = "en" as const satisfies Locale;

/**
 * The locale used for `x-default` hreflang and for locale-neutral fallbacks
 * such as the not-found page. It is the prefixless primary locale.
 */
export const DEFAULT_LOCALE: Locale = PREFIXLESS_LOCALE;

export function isLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.some((locale) => locale === value);
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === "de" ? "en" : "de";
}
