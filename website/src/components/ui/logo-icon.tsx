import type { ComponentPropsWithoutRef } from "react";

type LogoIconProps = Omit<ComponentPropsWithoutRef<"svg">, "viewBox" | "xmlns">;

/**
 * CarbonCue double-C wordmark icon, traced from the official Logo.jpg.
 * Renders at currentColor so it adapts to header (dark) and footer (white) contexts.
 */
export function LogoIcon({ className, ...props }: LogoIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Upper C */}
      <path d="M62 18c-16.6 0-30 13.4-30 30 0 10 4.9 18.8 12.4 24.2a30 30 0 0 1-12.4-24.2c0-16.6 13.4-30 30-30 12.2 0 22.7 7.3 27.4 17.8A29.9 29.9 0 0 0 62 18z" />
      <path d="M62 10a38 38 0 1 0 26.4 65.2 38 38 0 0 1-13.6 4.6A30 30 0 1 1 89.6 36 37.8 37.8 0 0 0 62 10z" />
      {/* Lower C */}
      <path d="M46 52c-16.6 0-30 13.4-30 30a30 30 0 0 0 47.4 24.5A30 30 0 0 1 16 82c0-16.6 13.4-30 30-30 6 0 11.5 1.7 16.2 4.7A29.8 29.8 0 0 0 46 52z" />
      <path d="M46 44a38 38 0 1 0 22.8 68.3 38 38 0 0 1-11.8 3.5A30 30 0 1 1 73.6 70 37.8 37.8 0 0 0 46 44z" />
    </svg>
  );
}
