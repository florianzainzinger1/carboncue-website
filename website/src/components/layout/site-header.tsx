import Link from "next/link";

import type { Locale } from "@/i18n/config";
import type { LocalizedHrefMap, PagePath } from "@/i18n/paths";
import { getHomePath, getLocalizedPath } from "@/i18n/paths";

import { ActionLink } from "../ui/actions";
import { LogoIcon } from "../ui/logo-icon";
import { LanguageSwitch } from "./language-switch";

type NavigationItem = Readonly<{
  href: string;
  label: string;
  /** Locale-neutral path used to mark the active item. */
  path: string;
}>;

type SiteHeaderProps = Readonly<{
  locale: Locale;
  /** A page that exists in both locales; drives the language switch. */
  pagePath?: PagePath;
  /** Explicit language-switch targets; overrides pagePath when set. */
  alternateHrefs?: LocalizedHrefMap;
  /**
   * Locale-neutral path of the navigation item to mark as current. Defaults
   * to pagePath; pass null to mark no item.
   */
  activeNavigationPath?: string | null;
  navigationLabel: string;
  navigationItems: readonly NavigationItem[];
  languageNavigationLabel: string;
  currentLanguageLabel: string;
  ctaLabel?: string;
}>;

export function SiteHeader({
  locale,
  pagePath,
  alternateHrefs,
  activeNavigationPath,
  navigationLabel,
  navigationItems,
  languageNavigationLabel,
  currentLanguageLabel,
  ctaLabel,
}: SiteHeaderProps) {
  const activePath =
    activeNavigationPath === undefined ? pagePath : activeNavigationPath;

  return (
    <header className="border-border/80 bg-surface/90 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="max-w-site px-page mx-auto grid items-center gap-x-6 gap-y-3 py-3.5 sm:grid-cols-[auto_1fr] lg:min-h-16 lg:grid-cols-[auto_1fr_auto]">
        <Link
          href={getHomePath(locale)}
          className="rounded-control text-ink inline-flex min-h-10 items-center gap-2.5 py-1 font-semibold tracking-tight transition-opacity hover:opacity-80"
        >
          <LogoIcon className="h-6 w-6 text-zinc-950" />
          <span className="text-base font-semibold tracking-tight text-zinc-950">
            CarbonCue
          </span>
        </Link>

        <nav
          aria-label={navigationLabel}
          className="order-3 col-span-2 lg:order-none lg:col-span-1"
        >
          <ul className="flex flex-wrap items-center gap-x-1 gap-y-1 lg:justify-center xl:gap-x-2">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={
                    activePath != null && item.path === activePath
                      ? "page"
                      : undefined
                  }
                  className="rounded-control inline-flex min-h-9 items-center px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950 aria-[current=page]:bg-zinc-100/80 aria-[current=page]:text-zinc-950"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3 justify-self-end">
          <LanguageSwitch
            locale={locale}
            pagePath={pagePath}
            alternateHrefs={alternateHrefs}
            navigationLabel={languageNavigationLabel}
            currentLanguageLabel={currentLanguageLabel}
          />
          {ctaLabel && (
            /* The wrapper does the hiding: ActionLink carries its own
               inline-flex, which wins over a `hidden` utility on the same
               element and left the CTA overflowing on narrow viewports. */
            <span className="hidden sm:block">
              <ActionLink
                href={getLocalizedPath(locale, "/contact")}
                variant="primary"
                className="h-9 min-h-9 px-3.5 py-2 text-xs"
              >
                {ctaLabel}
              </ActionLink>
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
