import Link from "next/link";
import type { ComponentProps, ComponentPropsWithoutRef } from "react";

import { cx } from "./styles";

type ActionVariant = "primary" | "secondary" | "text" | "dark";

const actionBase =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-control font-medium text-sm transition-[color,background-color,border-color,box-shadow,transform] duration-[var(--motion-duration-fast)] ease-calm active:translate-y-[var(--motion-distance-short)] cursor-pointer select-none";

const actionVariants: Record<ActionVariant, string> = {
  primary:
    "border border-zinc-950 bg-zinc-950 px-5 py-2.5 text-white shadow-subtle hover:bg-zinc-850 hover:border-zinc-850",
  secondary:
    "border border-zinc-300 bg-white px-5 py-2.5 text-zinc-900 shadow-subtle hover:border-zinc-400 hover:bg-zinc-50",
  text: "px-2 py-1.5 text-zinc-900 underline-offset-4 hover:underline hover:text-zinc-600",
  dark: "border border-zinc-700 bg-zinc-900 px-5 py-2.5 text-white shadow-subtle hover:bg-zinc-800 hover:border-zinc-600",
};

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: ActionVariant;
};

export function Button({
  type = "button",
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        actionBase,
        actionVariants[variant],
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-y-0",
        className,
      )}
      {...props}
    />
  );
}

type ActionLinkProps = ComponentProps<typeof Link> & {
  variant?: ActionVariant;
};

export function ActionLink({
  variant = "primary",
  className,
  ...props
}: ActionLinkProps) {
  return (
    <Link
      className={cx(actionBase, actionVariants[variant], className)}
      {...props}
    />
  );
}
