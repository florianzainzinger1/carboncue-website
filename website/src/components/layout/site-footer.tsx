import Link from "next/link";
import { LogoIcon } from "../ui/logo-icon";

type FooterNavigationItem = Readonly<{
  href: string;
  label: string;
}>;

type SiteFooterProps = Readonly<{
  label: string;
  disclaimer: string;
  navigationLabel: string;
  navigationItems: readonly FooterNavigationItem[];
}>;

export function SiteFooter({
  label,
  disclaimer,
  navigationLabel,
  navigationItems,
}: SiteFooterProps) {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 text-white">
      <div className="max-w-site px-page mx-auto grid gap-10 py-12 md:grid-cols-[minmax(0,0.4fr)_minmax(0,1fr)] md:py-16">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoIcon className="h-6 w-6 text-white" />
            <span className="text-lg font-semibold tracking-tight text-white">
              CarbonCue
            </span>
          </div>
          <p className="mt-2.5 font-mono text-xs tracking-wider text-zinc-400 uppercase">
            {label}
          </p>
          <p className="mt-4 max-w-sm text-xs leading-relaxed text-zinc-400">
            Enterprise EU-ETS Compliance & Financial Workflow Architecture for
            DACH Industry.
          </p>
        </div>

        <div className="grid gap-6 md:justify-items-end">
          <nav aria-label={navigationLabel}>
            <ul className="flex max-w-3xl flex-wrap gap-x-6 gap-y-2 md:justify-end">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="rounded-control inline-flex min-h-9 items-center text-sm font-medium text-zinc-300 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="max-w-2xl text-xs leading-relaxed text-zinc-400 md:text-right">
            {disclaimer}
          </p>
          <p className="text-xs text-zinc-400">
            © {new Date().getFullYear()} CarbonCue. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}
