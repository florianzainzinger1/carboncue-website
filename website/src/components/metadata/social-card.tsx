import { ImageResponse } from "next/og";

import { getDictionary } from "@/content/dictionaries";
import { SITE_NAME } from "@/content/site";
import type { Locale } from "@/i18n/config";

import { SOCIAL_CARD_SIZE } from "./social-card-config";

export {
  SOCIAL_CARD_CONTENT_TYPE,
  SOCIAL_CARD_ID,
  SOCIAL_CARD_SIZE,
} from "./social-card-config";

export function createSocialCard(locale: Locale): ImageResponse {
  const dictionary = getDictionary(locale);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#10252c",
        color: "#f7f2e8",
        padding: "68px 76px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: "-0.02em",
        }}
      >
        <span>{SITE_NAME}</span>
        <span
          style={{
            color: "#d9a441",
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: "0.12em",
          }}
        >
          {locale.toUpperCase()}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div
          style={{
            display: "flex",
            width: "96px",
            height: "8px",
            background: "#d9a441",
          }}
        />
        <div
          style={{
            display: "flex",
            maxWidth: "940px",
            fontSize: 62,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: "-0.035em",
          }}
        >
          {dictionary.home.hero.title}
        </div>
        <div
          style={{
            display: "flex",
            maxWidth: "920px",
            color: "#c7d3d1",
            fontSize: 27,
            lineHeight: 1.35,
          }}
        >
          {dictionary.home.metadata.description}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
        }}
      >
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "52px",
              height: "52px",
              border: "2px solid #5f8580",
              borderRadius: "14px",
              color: step === 4 ? "#10252c" : "#f7f2e8",
              background: step === 4 ? "#d9a441" : "transparent",
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            {step}
          </div>
        ))}
      </div>
    </div>,
    SOCIAL_CARD_SIZE,
  );
}
