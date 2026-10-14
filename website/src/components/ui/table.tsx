import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cx } from "./styles";

type TableProps = ComponentPropsWithoutRef<"table"> & {
  caption: ReactNode;
  scrollLabel: string;
};

export function Table({
  caption,
  scrollLabel,
  className,
  children,
  ...props
}: TableProps) {
  return (
    <div
      className="rounded-card border-border bg-surface overflow-x-auto border focus-visible:outline-offset-4"
      role="region"
      aria-label={scrollLabel}
      tabIndex={0}
    >
      <table
        className={cx("w-full min-w-xl border-collapse text-left", className)}
        {...props}
      >
        <caption className="border-border bg-surface-muted text-ink border-b px-5 py-4 text-left font-semibold">
          {caption}
        </caption>
        {children}
      </table>
    </div>
  );
}

export function TableHead(props: ComponentPropsWithoutRef<"thead">) {
  return <thead className="bg-canvas text-ink" {...props} />;
}

export function TableBody(props: ComponentPropsWithoutRef<"tbody">) {
  return <tbody className="divide-border divide-y" {...props} />;
}

export function TableRow({
  className,
  ...props
}: ComponentPropsWithoutRef<"tr">) {
  return (
    <tr className={cx("hover:bg-primary-soft/45", className)} {...props} />
  );
}

export function TableHeaderCell({
  className,
  scope = "col",
  ...props
}: ComponentPropsWithoutRef<"th">) {
  return (
    <th
      scope={scope}
      className={cx(
        "border-border text-muted border-b px-5 py-3 font-mono text-xs font-medium tracking-[0.08em] uppercase",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({
  className,
  ...props
}: ComponentPropsWithoutRef<"td">) {
  return (
    <td
      className={cx("text-ink-soft px-5 py-4 text-sm leading-6", className)}
      {...props}
    />
  );
}
