import type { ComponentPropsWithoutRef } from "react";

import { cx } from "./styles";

type DemoBadgeProps = ComponentPropsWithoutRef<"span"> & {
  label: string;
  assistiveLabel: string;
};

export function DemoBadge({
  label,
  assistiveLabel,
  className,
  ...props
}: DemoBadgeProps) {
  return (
    <span
      className={cx(
        "rounded-pill border-accent bg-accent-soft text-accent-ink inline-flex items-center border px-2.5 py-1 font-mono text-[0.6875rem] leading-none font-medium tracking-[0.12em] uppercase",
        className,
      )}
      data-data-status="demo"
      {...props}
    >
      <span aria-hidden="true">{label}</span>
      <span className="sr-only">{assistiveLabel}</span>
    </span>
  );
}
