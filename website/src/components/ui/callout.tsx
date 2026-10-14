import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cx } from "./styles";

type CalloutProps = Omit<ComponentPropsWithoutRef<"aside">, "title"> & {
  title: ReactNode;
  tone?: "note" | "caution";
};

export function Callout({
  title,
  tone = "note",
  className,
  children,
  ...props
}: CalloutProps) {
  return (
    <aside
      className={cx(
        "rounded-card p-panel border-l-4",
        tone === "note"
          ? "border-primary bg-primary-soft"
          : "border-accent bg-accent-soft",
        className,
      )}
      {...props}
    >
      <p className="text-ink font-mono text-xs font-medium tracking-[0.12em] uppercase">
        {title}
      </p>
      <div className="text-ink-soft mt-3 text-base leading-7">{children}</div>
    </aside>
  );
}
