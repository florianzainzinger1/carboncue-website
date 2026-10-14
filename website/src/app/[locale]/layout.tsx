import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { ReactNode } from "react";

import { getSiteUrlConfiguration } from "@/content/site";
import { isLocale, SUPPORTED_LOCALES } from "@/i18n/config";

import "../globals.css";

// Only the generated locales exist; any other first segment is a real 404.
// Unknown URLs are answered by the framework's static `/_not-found` page
// (HTTP 404, `noindex`). A branded 404 is not added: a not-found.tsx in this
// root-layout segment is never used for unmatched URLs, and for notFound()
// thrown in a nested page Next.js 16 only renders it client-side (empty
// server HTML). A server-rendered branded 404 needs either the experimental
// globalNotFound flag or a non-dynamic root layout (see ADR 0005).
export const dynamicParams = false;

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export function generateMetadata(): Metadata {
  return {
    metadataBase: getSiteUrlConfiguration().metadataBaseUrl,
  };
}

type LocaleLayoutProps = Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>;

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
