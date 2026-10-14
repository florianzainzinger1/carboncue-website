import { getPathMatch } from "next/dist/shared/lib/router/utils/path-match";
import { describe, expect, it } from "vitest";

import { DEFAULT_LOCALE, PREFIXLESS_LOCALE } from "../../src/i18n/config";
import {
  getHreflangMap,
  getLanguageSwitchHref,
  getLocalizedAlternates,
  getLocalizedPath,
  localizePath,
  PAGE_PATHS,
} from "../../src/i18n/paths";
import {
  createHostHeaders,
  createLocaleRedirects,
  createLocaleRewrites,
  VERCEL_HOST_PATTERN,
} from "../../src/i18n/routing";
import nextConfig from "../../next.config";

// Uses Next.js' own custom-route matcher (case-insensitive, strict, the same
// options the router uses for redirects and rewrites). `has` values are
// matched by Next.js as `^value$`.
function sourceMatches(source: string, pathname: string): boolean {
  return (
    getPathMatch(source, { strict: true, removeUnnamedParams: true })(
      pathname,
    ) !== false
  );
}

function firstMatch<T extends { source: string }>(
  rules: readonly T[],
  pathname: string,
): T | undefined {
  return rules.find((rule) => sourceMatches(rule.source, pathname));
}

describe("English primary locale paths", () => {
  it("serves English unprefixed and German prefixed", () => {
    expect(PREFIXLESS_LOCALE).toBe("en");
    expect(DEFAULT_LOCALE).toBe("en");
    expect(PAGE_PATHS.map((path) => getLocalizedPath("en", path))).toEqual([
      "/",
      "/product",
      "/contact",
      "/privacy",
      "/imprint",
    ]);
    expect(PAGE_PATHS.map((path) => getLocalizedPath("de", path))).toEqual([
      "/de",
      "/de/product",
      "/de/contact",
      "/de/privacy",
      "/de/imprint",
    ]);
    expect(localizePath("de", "/wissen")).toBe("/de/wissen");
    expect(() => localizePath("de", "wissen")).toThrow();
  });

  it("points x-default at English and omits hreflang for single-locale pages", () => {
    expect(getLocalizedAlternates("/contact").languages).toEqual({
      de: "/de/contact",
      en: "/contact",
      "x-default": "/contact",
    });
    expect(getHreflangMap({ de: "/de/wissen" })).toEqual({});
  });

  it("falls back to the other locale's home page when a counterpart is missing", () => {
    expect(getLanguageSwitchHref("en", { de: "/de/wissen" })).toBe("/");
    expect(getLanguageSwitchHref("de", { en: "/product" })).toBe("/de");
    expect(
      getLanguageSwitchHref("de", { de: "/de/product", en: "/product" }),
    ).toBe("/de/product");
  });
});

describe("request-level locale routing config", () => {
  const redirects = createLocaleRedirects();
  const { afterFiles } = createLocaleRewrites();

  it("permanently redirects /en, /en/* and /index.html to unprefixed paths", () => {
    expect(redirects.every((rule) => rule.permanent)).toBe(true);
    expect(firstMatch(redirects, "/en")?.destination).toBe("/");
    expect(firstMatch(redirects, "/index.html")?.destination).toBe("/");
    expect(firstMatch(redirects, "/en/product")?.destination).toBe("/:path");
    expect(firstMatch(redirects, "/en/product/deep")?.destination).toBe(
      "/:path",
    );
    expect(firstMatch(redirects, "/")).toBeUndefined();
    expect(firstMatch(redirects, "/de")).toBeUndefined();
    expect(firstMatch(redirects, "/de/product")).toBeUndefined();
    expect(firstMatch(redirects, "/english")).toBeUndefined();
  });

  it("redirects the prefixed English social image routes and rewrites the unprefixed ones", () => {
    for (const segment of ["opengraph-image", "twitter-image"]) {
      expect(
        firstMatch(redirects, `/en/${segment}/social-card`)?.destination,
      ).toBe("/:path");
      expect(firstMatch(redirects, `/${segment}/social-card`)).toBeUndefined();
      expect(
        firstMatch(afterFiles, `/${segment}/social-card`)?.destination,
      ).toBe("/en/:path");
      expect(
        firstMatch(redirects, `/de/${segment}/social-card`),
      ).toBeUndefined();
    }
  });

  it("rewrites unprefixed paths into the English tree and leaves locale, API and framework paths alone", () => {
    expect(firstMatch(afterFiles, "/")?.destination).toBe("/en");
    expect(firstMatch(afterFiles, "/product")?.destination).toBe("/en/:path");
    expect(firstMatch(afterFiles, "/deutsch")?.destination).toBe("/en/:path");

    for (const pathname of [
      "/de",
      "/de/product",
      "/en",
      "/en/product",
      "/api/contact",
      "/_next/static/chunk.js",
      "/__nextjs_original-stack-frames",
    ]) {
      expect(firstMatch(afterFiles, pathname), pathname).toBeUndefined();
    }
  });

  it("never rewrites into a path that the redirects would bounce back", () => {
    for (const pagePath of PAGE_PATHS) {
      const pathname = getLocalizedPath("en", pagePath);

      expect(firstMatch(redirects, pathname), pathname).toBeUndefined();
    }
  });

  it("adds X-Robots-Tag noindex only on vercel.app hosts", () => {
    const [rule] = createHostHeaders();
    const hostMatcher = new RegExp(`^${VERCEL_HOST_PATTERN}$`);

    expect(rule?.headers).toEqual([{ key: "X-Robots-Tag", value: "noindex" }]);
    expect(rule?.has).toEqual([{ type: "host", value: VERCEL_HOST_PATTERN }]);
    expect(hostMatcher.test("carboncue-git-main-team.vercel.app")).toBe(true);
    expect(hostMatcher.test("carboncue.vercel.app")).toBe(true);
    expect(hostMatcher.test("carboncue.eu")).toBe(false);
    expect(hostMatcher.test("www.carboncue.eu")).toBe(false);
    expect(hostMatcher.test("vercel.app.carboncue.eu")).toBe(false);
  });

  it("wires the routing rules into next.config.ts and drops the old / -> /de redirect", async () => {
    const configuredRedirects = await nextConfig.redirects?.();
    const configuredRewrites = await nextConfig.rewrites?.();
    const configuredHeaders = await nextConfig.headers?.();

    expect(configuredRedirects).toEqual(redirects);
    expect(configuredRedirects).not.toContainEqual(
      expect.objectContaining({ destination: "/de" }),
    );
    expect(configuredRewrites).toEqual(createLocaleRewrites());
    expect(configuredHeaders).toEqual(createHostHeaders());
  });
});
