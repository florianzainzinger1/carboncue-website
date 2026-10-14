import type { ComponentPropsWithoutRef } from "react";

import { cx } from "./styles";

type HeadingLevel = "h1" | "h2" | "h3" | "h4";
type HeadingSize = "display" | "title" | "section" | "subsection";

const headingSizes: Record<HeadingSize, string> = {
  display: "text-display max-w-5xl",
  title: "text-title max-w-4xl",
  section: "text-section max-w-3xl",
  subsection: "text-subsection max-w-2xl",
};

type HeadingProps = ComponentPropsWithoutRef<"h2"> & {
  as?: HeadingLevel;
  size?: HeadingSize;
};

export function Heading({
  as: Component = "h2",
  size = "section",
  className,
  ...props
}: HeadingProps) {
  return (
    <Component
      className={cx(
        "text-ink font-semibold text-balance [overflow-wrap:anywhere] hyphens-auto",
        headingSizes[size],
        className,
      )}
      {...props}
    />
  );
}

type ProseSize = "lead" | "body" | "small";

const proseSizes: Record<ProseSize, string> = {
  lead: "text-xl leading-8 md:text-2xl md:leading-9",
  body: "text-base leading-7 md:text-lg md:leading-8",
  small: "text-sm leading-6",
};

type ProseProps = ComponentPropsWithoutRef<"p"> & {
  size?: ProseSize;
  tone?: "default" | "muted";
};

export function Prose({
  size = "body",
  tone = "default",
  className,
  ...props
}: ProseProps) {
  return (
    <p
      className={cx(
        "max-w-reading",
        proseSizes[size],
        tone === "muted" ? "text-muted" : "text-ink-soft",
        className,
      )}
      {...props}
    />
  );
}
