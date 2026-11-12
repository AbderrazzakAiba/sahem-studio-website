import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

/**
 * UI icons from the handoff (06-assets/icons): 24px grid, 1.8 stroke, square caps, currentColor.
 * Directional icons (arrow, menu) mirror in RTL with `rtl:-scale-x-100` where the caller needs it.
 */
const paths = {
  arrow: <path d="M20 12H4M10 6L4 12L10 18" />,
  chevron: <path d="M6 9L12 15L18 9" />,
  check: <path d="M5 12.5L10 17L19 7" />,
  close: <path d="M6 6L18 18M18 6L6 18" />,
  menu: <path d="M4 8H20M10 16H20" />,
  plus: <path d="M12 4V20M4 12H20" />,
  minus: <path d="M4 12H20" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12H21M12 3C9.5 6 8.5 9 8.5 12S9.5 18 12 21M12 3C14.5 6 15.5 9 15.5 12S14.5 18 12 21" />
    </>
  ),
  mail: <path d="M3 5H21V19H3ZM3 5L12 12.5L21 5" />,
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2V4M12 20V22M2 12H4M20 12H22M4.9 4.9L6.3 6.3M17.7 17.7L19.1 19.1M4.9 19.1L6.3 17.7M17.7 6.3L19.1 4.9" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M4 5H20V16H10L6 20V16H4Z" />
      <circle cx="16" cy="10.5" r="1.2" fill="var(--accent-signal)" stroke="none" />
    </>
  ),
} as const;

export type IconName = keyof typeof paths;

type Props = { name: IconName; size?: number } & Omit<SVGProps<SVGSVGElement>, "name">;

export function Icon({ name, size = 22, className, ...props }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", className)}
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
