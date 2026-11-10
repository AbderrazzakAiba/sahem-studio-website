import type { ReactNode } from "react";
import type { ServiceSlug } from "@/content/home";
import { cn } from "@/lib/utils";

/**
 * Service icons from the handoff (06-assets/icons/service-*.svg): 24 grid, 1.8 stroke, square caps,
 * currentColor + one Signal accent each. Decorative — the card title names the service.
 */
const icons: Record<ServiceSlug, ReactNode> = {
  websites: (
    <>
      <rect x="3" y="5" width="18" height="14" />
      <path d="M3 9H21" />
      <circle cx="17.5" cy="7" r="1" className="fill-accent-signal" stroke="none" />
    </>
  ),
  "landing-pages": (
    <>
      <rect x="6" y="3" width="12" height="18" />
      <path d="M9 13H13.5" />
      <path d="M13.5 11L16 13L13.5 15Z" fill="currentColor" />
      <circle cx="9" cy="7" r="1.2" className="fill-accent-signal" stroke="none" />
    </>
  ),
  identity: (
    <>
      <path d="M12 3L19 10L12 21L5 10Z" />
      <circle cx="12" cy="10" r="1.6" className="fill-accent-signal" stroke="none" />
    </>
  ),
  social: (
    <>
      <path d="M4 5H20V16H10L6 20V16H4Z" />
      <circle cx="16" cy="10.5" r="1.2" className="fill-accent-signal" stroke="none" />
    </>
  ),
  automation: (
    <>
      <circle cx="5.5" cy="6" r="2" className="fill-accent-signal" stroke="none" />
      <path d="M8 6H13A3 3 0 0 1 13 12H11A3 3 0 0 0 11 18H16" />
      <path d="M16 15.5L20 18L16 20.5Z" fill="currentColor" />
    </>
  ),
  motion: (
    <>
      <path d="M9 5L19 12L9 19Z" />
      <path d="M3 9H5.5M3 15H5.5" />
      <circle cx="12.5" cy="12" r="1.2" className="fill-accent-signal" stroke="none" />
    </>
  ),
};

export function ServiceIcon({ name, className }: { name: ServiceSlug; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
      className={cn("size-8 shrink-0 lg:size-10", className)}
    >
      {icons[name]}
    </svg>
  );
}
