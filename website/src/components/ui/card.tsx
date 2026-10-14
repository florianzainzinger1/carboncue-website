import type { ComponentPropsWithoutRef } from "react";

import { cx } from "./styles";

type CardProps = ComponentPropsWithoutRef<"article"> & {
  tone?: "plain" | "muted" | "elevated" | "dark";
};

const toneStyles: Record<NonNullable<CardProps["tone"]>, string> = {
  plain: "border-border bg-surface text-ink",
  muted: "border-border/70 bg-surface-muted text-ink",
  elevated: "border-border/60 bg-surface-elevated text-ink shadow-panel",
  dark: "border-zinc-800 bg-zinc-950 text-white shadow-dark-panel",
};

export function Card({ tone = "plain", className, ...props }: CardProps) {
  return (
    <article
      className={cx(
        "rounded-card p-panel ease-calm hover:shadow-card-hover border transition-[transform,box-shadow,border-color] duration-[var(--motion-duration-base)] hover:-translate-y-0.5",
        toneStyles[tone],
        className,
      )}
      {...props}
    />
  );
}
