import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cx } from "./styles";

type InformationFieldProps = ComponentPropsWithoutRef<"div"> & {
  label: ReactNode;
  value: ReactNode;
  supportingText?: ReactNode;
};

export function InformationField({
  label,
  value,
  supportingText,
  className,
  ...props
}: InformationFieldProps) {
  return (
    <div
      className={cx(
        "rounded-control border-border-strong bg-surface border px-4 py-3",
        className,
      )}
      {...props}
    >
      <p className="text-muted font-mono text-xs font-medium tracking-[0.1em] uppercase">
        {label}
      </p>
      <div className="text-ink mt-2 flex flex-wrap items-center gap-2 text-base font-semibold">
        {value}
      </div>
      {supportingText ? (
        <p className="text-muted mt-2 text-sm leading-6">{supportingText}</p>
      ) : null}
    </div>
  );
}
