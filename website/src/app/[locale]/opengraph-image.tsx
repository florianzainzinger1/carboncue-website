import { notFound } from "next/navigation";

import {
  createSocialCard,
  SOCIAL_CARD_CONTENT_TYPE,
  SOCIAL_CARD_ID,
  SOCIAL_CARD_SIZE,
} from "@/components/metadata/social-card";
import { getDictionary } from "@/content/dictionaries";
import { isLocale } from "@/i18n/config";

export function generateImageMetadata({
  params,
}: {
  params: { locale: string };
}) {
  // No image metadata for unknown locales, so /fr/opengraph-image/... is a 404.
  if (!isLocale(params.locale)) {
    return [];
  }

  return [
    {
      id: SOCIAL_CARD_ID,
      alt: getDictionary(params.locale).home.metadata.title,
      size: SOCIAL_CARD_SIZE,
      contentType: SOCIAL_CARD_CONTENT_TYPE,
    },
  ];
}

export default async function OpenGraphImage({
  params,
  id,
}: {
  params: Promise<{ locale: string }>;
  id: Promise<string | number>;
}) {
  const { locale } = await params;

  if (!isLocale(locale) || (await id) !== SOCIAL_CARD_ID) {
    notFound();
  }

  return createSocialCard(locale);
}
