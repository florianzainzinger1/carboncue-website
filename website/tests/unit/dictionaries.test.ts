import { describe, expect, expectTypeOf, it } from "vitest";

import { dictionaries, getDictionary } from "../../src/content/dictionaries";
import type { MessageDictionary } from "../../src/content/messages";
import { SUPPORTED_LOCALES, type Locale } from "../../src/i18n/config";

const CANONICAL_ENGLISH_DISCLAIMER =
  "CarbonCue provides operational decision support, scenario analysis, and workflow documentation. It does not execute trades, provide regulated investment advice, replace legal or regulatory advice, or guarantee compliance or market outcomes.";

const typedDictionaries: Record<Locale, MessageDictionary> = dictionaries;

function collectMessageKeys(value: object, prefix = ""): string[] {
  return Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;

    return typeof child === "string"
      ? [path]
      : collectMessageKeys(child as object, path);
  });
}

describe("typed translation dictionaries", () => {
  it("provides a fully typed dictionary for every supported locale", () => {
    expect(Object.keys(typedDictionaries)).toEqual(SUPPORTED_LOCALES);

    for (const locale of SUPPORTED_LOCALES) {
      expectTypeOf(getDictionary(locale)).toEqualTypeOf<MessageDictionary>();
    }
  });

  it("keeps the same complete message-key set in German and English", () => {
    expect(collectMessageKeys(dictionaries.de).sort()).toEqual(
      collectMessageKeys(dictionaries.en).sort(),
    );
  });

  it("uses the exact canonical English disclaimer", () => {
    expect(dictionaries.en.shell.disclaimer).toBe(CANONICAL_ENGLISH_DISCLAIMER);
  });
});
