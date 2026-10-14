import type { ReactNode } from "react";

import { guideHubCopy } from "@/content/de/guides/hub";
import {
  getGuideHubPath,
  getGuidePath,
  GUIDE_HUB_SEGMENT,
  GUIDE_LOCALE,
  GUIDES,
} from "@/content/guides/registry";
import type { MessageDictionary } from "@/content/messages";
import type { Locale } from "@/i18n/config";
import {
  getLocalizedPath,
  type LocalizedHrefMap,
  type PagePath,
} from "@/i18n/paths";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type SiteShellProps = Readonly<{
  children: ReactNode;
  dictionary: MessageDictionary;
  locale: Locale;
  /**
   * A page that exists in both locales. It drives the language switch and
   * the active navigation item unless the explicit props below are set.
   */
  pagePath?: PagePath;
  /**
   * Language-switch targets for pages outside PAGE_PATHS (for example
   * German-only guides). Missing locales fall back to that locale's home.
   */
  alternateHrefs?: LocalizedHrefMap;
  /** Locale-neutral path of the active navigation item; null for none. */
  activeNavigationPath?: string | null;
}>;

export function SiteShell({
  children,
  dictionary,
  locale,
  pagePath,
  alternateHrefs,
  activeNavigationPath,
}: SiteShellProps) {
  const headerNavigationItems = [
    {
      href: getLocalizedPath(locale, "/"),
      label: dictionary.navigation.home,
      path: "/",
    },
    {
      href: getLocalizedPath(locale, "/product"),
      label: dictionary.navigation.product,
      path: "/product",
    },
    {
      href: getLocalizedPath(locale, "/contact"),
      label: dictionary.navigation.contact,
      path: "/contact",
    },
    // The guide hub exists in German only, so English pages get no link.
    ...(locale === GUIDE_LOCALE
      ? [
          {
            href: getGuideHubPath(),
            label: guideHubCopy.navLabel,
            path: GUIDE_HUB_SEGMENT,
          },
        ]
      : []),
  ];

  const guideFooterItems =
    locale === GUIDE_LOCALE
      ? GUIDES.map((guide) => ({
          href: getGuidePath(guide.slug),
          label: guide.content.navLabel,
          path: `${GUIDE_HUB_SEGMENT}/${guide.slug}`,
        }))
      : [];

  const footerNavigationItems = [
    ...headerNavigationItems,
    ...guideFooterItems,
    {
      href: getLocalizedPath(locale, "/privacy"),
      label: dictionary.navigation.privacy,
      path: "/privacy",
    },
    {
      href: getLocalizedPath(locale, "/imprint"),
      label: dictionary.navigation.imprint,
      path: "/imprint",
    },
  ];

  return (
    <>
      <a
        href="#main-content"
        className="rounded-control shadow-panel ease-calm fixed top-3 left-3 z-50 -translate-y-24 bg-zinc-950 px-4 py-3 font-semibold text-white transition-transform duration-[var(--motion-duration-fast)] focus:translate-y-0"
      >
        {dictionary.shell.skipToContent}
      </a>
      <SiteHeader
        locale={locale}
        pagePath={pagePath}
        alternateHrefs={alternateHrefs}
        activeNavigationPath={activeNavigationPath}
        navigationLabel={dictionary.shell.navigationLabel}
        navigationItems={headerNavigationItems}
        languageNavigationLabel={dictionary.shell.languageNavigationLabel}
        currentLanguageLabel={dictionary.shell.currentLanguageLabel}
        ctaLabel={dictionary.shell.contactCta}
      />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter
        label={dictionary.shell.footerLabel}
        disclaimer={dictionary.shell.disclaimer}
        navigationLabel={dictionary.shell.navigationLabel}
        navigationItems={footerNavigationItems}
      />
    </>
  );
}
