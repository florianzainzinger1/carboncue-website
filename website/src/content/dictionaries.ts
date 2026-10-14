import { dictionary as de } from "./de/dictionary";
import { dictionary as en } from "./en/dictionary";
import type { MessageDictionary } from "./messages";
import type { Locale } from "../i18n/config";

export const dictionaries = {
  de,
  en,
} as const satisfies Record<Locale, MessageDictionary>;

export function getDictionary(locale: Locale): MessageDictionary {
  return dictionaries[locale];
}
