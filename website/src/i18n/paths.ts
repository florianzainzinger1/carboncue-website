import {
  DEFAULT_LOCALE,
  PREFIXLESS_LOCALE,
  SUPPORTED_LOCALES,
  type Locale,
} from "./config";

/** Pages that exist in every supported locale. */
export const PAGE_PATHS = [
  "/",
  "/product",
  "/contact",
  "/privacy",
  "/imprint",
] as const;

export type PagePath = (typeof PAGE_PATHS)[number];

/**
 * Public, already-localized paths of one page, keyed by the locales in which
 * the page exists. Bilingual pages carry both keys; single-locale pages (for
 * example German-only guides) carry only their own locale.
 */
export type LocalizedHrefMap = Partial<Record<Locale, string>>;

/**
 * Path prefix of a locale's URL tree: "" for the prefixless primary locale,
 * "/de" for German.
 */
export function getLocalePrefix(locale: Locale): string {
  return locale === PREFIXLESS_LOCALE ? "" : `/${locale}`;
}

/**
 * Localizes any locale-neutral path that starts with "/". Use this for pages
 * outside PAGE_PATHS (for example single-locale pages); the result for the
 * primary locale is unprefixed.
 */
export function localizePath(locale: Locale, path: string): string {
  if (!path.startsWith("/")) {
    throw new Error(`localizePath expects a path starting with "/": ${path}`);
  }

  const prefix = getLocalePrefix(locale);

  if (path === "/") {
    return prefix === "" ? "/" : prefix;
  }

  return `${prefix}${path}`;
}

export function getLocalizedPath(locale: Locale, pagePath: PagePath): string {
  return localizePath(locale, pagePath);
}

export function getHomePath(locale: Locale): string {
  return getLocalizedPath(locale, "/");
}

/** The localized paths of a page that exists in every supported locale. */
export function getLocalizedHrefMap(
  pagePath: PagePath,
): Required<LocalizedHrefMap> {
  return {
    de: getLocalizedPath("de", pagePath),
    en: getLocalizedPath("en", pagePath),
  };
}

export type HreflangMap = Partial<Record<Locale | "x-default", string>>;

/**
 * hreflang alternates for a page. Alternates are emitted only when the page
 * exists in at least two locales; `x-default` points at the default (English)
 * version when that version exists.
 */
export function getHreflangMap(localizedPaths: LocalizedHrefMap): HreflangMap {
  const existingLocales = SUPPORTED_LOCALES.filter(
    (locale) => localizedPaths[locale] !== undefined,
  );

  if (existingLocales.length < 2) {
    return {};
  }

  const languages: HreflangMap = {};

  for (const locale of existingLocales) {
    languages[locale] = localizedPaths[locale];
  }

  const defaultPath = localizedPaths[DEFAULT_LOCALE];

  if (defaultPath !== undefined) {
    languages["x-default"] = defaultPath;
  }

  return languages;
}

export function getLocalizedAlternates(pagePath: PagePath) {
  const canonicalByLocale = getLocalizedHrefMap(pagePath);

  return {
    canonicalByLocale,
    languages: {
      de: canonicalByLocale.de,
      en: canonicalByLocale.en,
      "x-default": canonicalByLocale[DEFAULT_LOCALE],
    },
  } as const;
}

/**
 * Where the language switch sends a reader of `targetLocale`: the page's
 * counterpart when it exists, otherwise that locale's home page.
 */
export function getLanguageSwitchHref(
  targetLocale: Locale,
  alternateHrefs: LocalizedHrefMap,
): string {
  return alternateHrefs[targetLocale] ?? getHomePath(targetLocale);
}
