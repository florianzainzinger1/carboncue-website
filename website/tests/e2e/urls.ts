export const localOrigin = "http://127.0.0.1:3000";

export const locales = ["de", "en"] as const;

export type TestLocale = (typeof locales)[number];

/**
 * Public URL path of a page: English is served unprefixed at the root, German
 * under /de. `pagePath` is "" for the home page or "/product" style.
 */
export function localizedPath(locale: TestLocale, pagePath: string): string {
  if (locale === "en") {
    return pagePath === "" ? "/" : pagePath;
  }

  return `/de${pagePath}`;
}

/** Absolute canonical URL as rendered in metadata (no trailing slash on /). */
export function canonicalUrl(locale: TestLocale, pagePath: string): string {
  return locale === "en"
    ? `${localOrigin}${pagePath}`
    : `${localOrigin}/de${pagePath}`;
}
